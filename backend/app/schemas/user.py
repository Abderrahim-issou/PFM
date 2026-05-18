from sqlalchemy import String
from app.db.base import Base
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from app.schemas.diagnostic import DiagnosticReport
    from app.schemas.tracked import TrackedPlant



class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)

    first_name: Mapped[str] = mapped_column(
        String(50),
        nullable=False
    )
    
    last_name: Mapped[str] = mapped_column(String(50))

    email: Mapped[str] = mapped_column(
        String(100), 
        unique=True,
        index=True
    )
    password: Mapped[str]
    refresh_token: Mapped[str | None] = mapped_column(nullable=True)
    
    diagnostic_reports: Mapped[list["DiagnosticReport"]] = relationship(
        back_populates="user",
        cascade="all, delete-orphan"
    )

    tracked_plants: Mapped[list["TrackedPlant"]] = relationship(
        back_populates="user",
        cascade="all, delete-orphan"
    )
    
    def __repr__(self):
        return f"User(id={self.id}, email={self.email}, first_name={self.first_name})"