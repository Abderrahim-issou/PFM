from sqlalchemy.orm import Session
from app.schemas.diagnostic import DiagnosticReport

def create_diagnostic_report(
    db: Session,
    user_id: int,
    model_prediction: str,
    plant: str,
    disease: str,
    confidence: float,
    severity: str,
    description: str,
    organic_cure: str,
    chemical_cure: str,
    prevention: str,
    image_url: str | None = None,
    boxed_image_url: str | None = None,
    regions: list | None = None,
) -> DiagnosticReport:
    report = DiagnosticReport(
        user_id=user_id,
        model_prediction=model_prediction,
        plant=plant,
        disease=disease,
        confidence=confidence,
        severity=severity,
        description=description,
        organic_cure=organic_cure,
        chemical_cure=chemical_cure,
        prevention=prevention,
        image_url=image_url,
        boxed_image_url=boxed_image_url,
        regions=regions,
    )

    db.add(report)
    db.commit()
    db.refresh(report)

    return report


def get_user_diagnostic_reports(
    db: Session,
    user_id: int,
) -> list[DiagnosticReport]:
    return (
        db.query(DiagnosticReport)
        .filter(DiagnosticReport.user_id == user_id)
        .order_by(DiagnosticReport.created_at.desc())
        .all()
    )


def get_diagnostic_report_by_id(
    db: Session,
    report_id: int,
    user_id: int,
) -> DiagnosticReport | None:
    return (
        db.query(DiagnosticReport)
        .filter(
            DiagnosticReport.id == report_id,
            DiagnosticReport.user_id == user_id,
        )
        .first()
    )


def delete_diagnostic_report(
    db: Session,
    report_id: int,
    user_id: int,
) -> bool:
    report = get_diagnostic_report_by_id(
        db=db,
        report_id=report_id,
        user_id=user_id,
    )

    if not report:
        return False

    db.delete(report)
    db.commit()

    return True