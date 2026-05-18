from datetime import datetime
from sqlalchemy import String, Float, ForeignKey, DateTime, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from app.schemas.tracked import TrackedPlant
    from app.schemas.diagnostic import DiagnosticReport


class TrackingEntry(Base):
    __tablename__ = "tracking_entries"

    id: Mapped[int] = mapped_column(primary_key=True)

    tracked_plant_id: Mapped[int] = mapped_column(
        ForeignKey("tracked_plants.id"),
        nullable=False,
        index=True
    )

    diagnostic_report_id: Mapped[int] = mapped_column(
        ForeignKey("diagnostic_reports.id"),
        nullable=False
    )

    health: Mapped[float | None] = mapped_column(
        Float,
        nullable=True
    )

    progress_status: Mapped[str | None] = mapped_column(
        String(50),
        nullable=True
    )

    progress_message: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
    )

    notes: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow
    )

    tracked_plant: Mapped["TrackedPlant"] = relationship(
        back_populates="tracking_entries"
    )

    diagnostic_report: Mapped["DiagnosticReport"] = relationship()