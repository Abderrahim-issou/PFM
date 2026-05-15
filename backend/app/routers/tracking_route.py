# app/routers/tracking.py

from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.user import User
from app.dependencies.auth import get_current_user

from app.schemas.route_schemas import (
    TrackedPlantCreate,
    TrackedPlantResponse,
    TrackedPlantDetailsResponse,
    TrackingEntryResponse,
)

from app.services.tracking_service import (
    create_tracked_plant,
    get_user_tracked_plants,
    get_tracked_plant_details,
    scan_tracked_plant,
    delete_tracked_plant,
)


router = APIRouter(
    prefix="/tracked-plants",
    tags=["Tracked Plants"],
)


@router.post("/", response_model=TrackedPlantResponse)
def create_tracking(
    payload: TrackedPlantCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return create_tracked_plant(
        db=db,
        user_id=current_user.id,
        name=payload.name,
        icon=payload.icon,
    )


@router.get("/", response_model=list[TrackedPlantResponse])
def get_my_tracked_plants(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_user_tracked_plants(
        db=db,
        user_id=current_user.id,
    )


@router.get("/{plant_id}", response_model=TrackedPlantDetailsResponse)
def get_tracking_details(
    plant_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_tracked_plant_details(
        db=db,
        plant_id=plant_id,
        user_id=current_user.id,
    )


@router.post("/{plant_id}/scan", response_model=TrackingEntryResponse)
async def scan_existing_tracked_plant(
    plant_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    image_bytes = await file.read()

    return await scan_tracked_plant(
        db=db,
        plant_id=plant_id,
        user=current_user,
        image_bytes=image_bytes,
    )


@router.delete("/{plant_id}")
def remove_tracked_plant(
    plant_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    deleted = delete_tracked_plant(
        db=db,
        plant_id=plant_id,
        user_id=current_user.id,
    )

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tracked plant not found",
        )

    return {
        "message": "Tracked plant deleted successfully"
    }