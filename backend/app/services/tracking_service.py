# app/services/tracking_service.py

from sqlalchemy.orm import Session, joinedload
from fastapi import HTTPException, status

from app.schemas.tracked import TrackedPlant
from app.schemas.tracking import TrackingEntry
from app.schemas.user import User

from app.services.diagnostic_service import create_diagnostic_report
from app.services.frame_service import process_frame2  # change this import
from app.utils.file_storage import save_original_image


def calculate_health(severity: str) -> float:
    print("this is the sevirity: ", severity);
    if severity == "Low":
        return 85.0
    if severity == "Medium":
        return 60.0
    if severity == "High":
        return 35.0

    return 50.0


def compare_progress(old_health: float | None, new_health: float):
    print('this is the old health: ', old_health, "new health: ", new_health);
    if old_health is None:
        return "First Scan", "This is the first scan for this tracked plant."

    if new_health > old_health:
        return "Improved", f"Health improved from {old_health}% to {new_health}%."

    if new_health < old_health:
        return "Worsened", f"Health decreased from {old_health}% to {new_health}%."

    return "Stable", f"Health stayed stable at {new_health}%."


def create_tracked_plant(
    db: Session,
    user_id: int,
    name: str,
    icon: str | None = None,
):
    plant = TrackedPlant(
        user_id=user_id,
        name=name,
        icon=icon,
    )

    db.add(plant)
    db.commit()
    db.refresh(plant)

    return plant


def get_user_tracked_plants(
    db: Session,
    user_id: int,
):
    return (
        db.query(TrackedPlant)
        .filter(TrackedPlant.user_id == user_id)
        .order_by(TrackedPlant.created_at.desc())
        .all()
    )


def get_tracked_plant_details(
    db: Session,
    plant_id: int,
    user_id: int,
):
    plant = (
        db.query(TrackedPlant)
        .options(
            joinedload(TrackedPlant.tracking_entries)
            .joinedload(TrackingEntry.diagnostic_report)
        )
        .filter(
            TrackedPlant.id == plant_id,
            TrackedPlant.user_id == user_id,
        )
        .first()
    )

    if not plant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tracked plant not found",
        )

    return plant


def get_latest_tracking_entry(
    db: Session,
    plant_id: int,
):
    return (
        db.query(TrackingEntry)
        .filter(TrackingEntry.tracked_plant_id == plant_id)
        .order_by(TrackingEntry.created_at.desc())
        .first()
    )


async def scan_tracked_plant(
    db: Session,
    plant_id: int,
    user: User,
    image_bytes: bytes,
):
    plant = (
        db.query(TrackedPlant)
        .filter(
            TrackedPlant.id == plant_id,
            TrackedPlant.user_id == user.id,
        )
        .first()
    )

    if not plant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tracked plant not found",
        )

    result = await process_frame2(image_bytes, db=db, current_user=user)
    saved_image = save_original_image(image_bytes)
    report = create_diagnostic_report(
        db=db,
        user_id=user.id,

        model_prediction=result.get("model_prediction")
            or result.get("prediction")
            or "unknown",

        plant=result.get("plant") or "Unknown",

        disease=result.get("disease")
            or result.get("prediction")
            or "Unknown",

        confidence=result.get("confidence") or 0,

        severity=result.get("severity") or "Low",

        description=result.get("description") or "",

        organic_cure=result.get("organic_cure") or "",

        chemical_cure=result.get("chemical_cure") or "",

        prevention=result.get("prevention") or "",

        image_url=saved_image.get('url'),

        boxed_image_url=result.get("boxed_image_url"),

        regions=result.get("regions", []),
    )

    latest_entry = get_latest_tracking_entry(
        db=db,
        plant_id=plant.id,
    )

    new_health = calculate_health(result["severity"])

    old_health = latest_entry.health if latest_entry else None

    progress_status, progress_message = compare_progress(
        old_health=old_health,
        new_health=new_health,
    )

    entry = TrackingEntry(
        tracked_plant_id=plant.id,
        diagnostic_report_id=report.id,
        health=new_health,
        progress_status=progress_status,
        progress_message=progress_message,
        notes=None,
    )

    plant.current_health = new_health
    plant.current_disease = result["disease"]

    db.add(entry)
    db.commit()
    db.refresh(entry)

    return entry


def delete_tracked_plant(
    db: Session,
    plant_id: int,
    user_id: int,
):
    plant = (
        db.query(TrackedPlant)
        .filter(
            TrackedPlant.id == plant_id,
            TrackedPlant.user_id == user_id,
        )
        .first()
    )

    if not plant:
        return False

    db.delete(plant)
    db.commit()

    return True