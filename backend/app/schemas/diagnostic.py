from datetime import datetime
from sqlalchemy import String, Float, ForeignKey, DateTime, Text, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base



class DiagnosticReport(Base):
    __tablename__ = "diagnostic_reports"

    id: Mapped[int] = mapped_column(primary_key=True)
    
    model_prediction: Mapped[str]
    
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        nullable=False,
        index=True
    )

    plant: Mapped[str] = mapped_column(
        String(100),
        nullable=False
    )

    disease: Mapped[str] = mapped_column(
        String(150),
        nullable=False
    )

    confidence: Mapped[float] = mapped_column(
        Float,
        nullable=False
    )

    severity: Mapped[str] = mapped_column(
        String(20),
        nullable=False
    )

    description: Mapped[str] = mapped_column(Text)

    organic_cure: Mapped[str] = mapped_column(Text)

    chemical_cure: Mapped[str] = mapped_column(Text)

    prevention: Mapped[str] = mapped_column(Text)

    image_url: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True
    )
    
    boxed_image_url: Mapped[str | None] = mapped_column(String(255), nullable=True)
    
    regions: Mapped[list | None] = mapped_column(
        JSON,
        nullable=True
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow
    )

    user: Mapped["User"] = relationship(
        back_populates="diagnostic_reports"
    )


    def __repr__(self):
        return (
            f"DiagnosticReport("
            f"id={self.id}, "
            f"plant={self.plant}, "
            f"disease={self.disease})"
        )