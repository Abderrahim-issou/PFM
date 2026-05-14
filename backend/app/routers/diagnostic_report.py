from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.user import User
from app.schemas.route_schemas import DiagnosticReportResponse
from app.services.diagnostic_service import (
    get_user_diagnostic_reports,
    get_diagnostic_report_by_id,
    delete_diagnostic_report,
)
from app.dependencies.auth import get_current_user


router = APIRouter(
    prefix="/diagnostic-reports",
    tags=["Diagnostic Reports"]
)


@router.get("/history", response_model=list[DiagnosticReportResponse])
def get_my_diagnostic_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_user_diagnostic_reports(
        db=db,
        user_id=current_user.id
    )


@router.get("/{report_id}", response_model=DiagnosticReportResponse)
def get_report_details(
    report_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    report = get_diagnostic_report_by_id(
        db=db,
        report_id=report_id,
        user_id=current_user.id
    )

    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Diagnostic report not found"
        )

    return report


@router.delete("/{report_id}")
def remove_report(
    report_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    deleted = delete_diagnostic_report(
        db=db,
        report_id=report_id,
        user_id=current_user.id
    )

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Diagnostic report not found"
        )

    return {
        "message": "Diagnostic report deleted successfully"
    }