from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.user import User
from app.dependencies.auth import get_current_user
from app.schemas.route_schemas import AnalyticsOverviewResponse
from app.services.analytics_service import get_analytics_overview


router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"],
)


@router.get("/overview", response_model=AnalyticsOverviewResponse)
def get_my_analytics_overview(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_analytics_overview(
        db=db,
        user_id=current_user.id,
    )