from datetime import datetime
from sqlalchemy import String, Float, ForeignKey, DateTime, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base




class TrackedPlant(Base):
    __tablename__ = "tracked_plants"

    id: Mapped[int] = mapped_column(primary_key=True)

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        nullable=False,
        index=True
    )

    name: Mapped[str] = mapped_column(
        String(100),
        nullable=False
    )

    icon: Mapped[str | None] = mapped_column(
        String(20),
        nullable=True
    )

    current_health: Mapped[float | None] = mapped_column(
        Float,
        nullable=True
    )

    current_disease: Mapped[str | None] = mapped_column(
        String(150),
        nullable=True
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow
    )

    user: Mapped["User"] = relationship(
        back_populates="tracked_plants"
    )

    tracking_entries: Mapped[list["TrackingEntry"]] = relationship(
        back_populates="tracked_plant",
        cascade="all, delete-orphan"
    )

    def __repr__(self):
        return f"TrackedPlant(id={self.id}, name={self.name})"