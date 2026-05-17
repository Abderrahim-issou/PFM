from pydantic import BaseModel
from fastapi import UploadFile, File
from datetime import datetime
from pydantic import BaseModel, EmailStr

# Auth schemas

class RegisterSchema(BaseModel):
    email: str
    password: str
    first_name: str
    last_name: str
    
    
class Loginschema (BaseModel):
    email: str
    password: str


class Logoutschema (BaseModel):
    user_id: str


class RegionResponse(BaseModel):
    id: int
    label: str
    confidence: float
    x: float
    y: float
    width: float
    height: float
    crop_url: str | None = None
    gradcam_url: str | None = None
    disease: str | None = None
    severity: str | None = None
    diagnosis_confidence: float | None = None


class DiagnosticReportBase(BaseModel):
    model_prediction: str
    plant: str
    disease: str
    confidence: float
    severity: str
    description: str
    organic_cure: str
    chemical_cure: str
    prevention: str
    image_url: str | None = None
    regions: list[RegionResponse] | None = None


class DiagnosticReportResponse(DiagnosticReportBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True


class DiagnosticReportCreate(DiagnosticReportBase):
    pass


class TrackedPlantCreate(BaseModel):
    name: str
    icon: str | None = None


class TrackedPlantResponse(BaseModel):
    id: int
    user_id: int
    name: str
    icon: str | None
    current_health: float | None
    current_disease: str | None
    created_at: datetime

    class Config:
        from_attributes = True


class TrackingEntryResponse(BaseModel):
    id: int
    tracked_plant_id: int
    diagnostic_report_id: int
    health: float | None
    progress_status: str | None
    progress_message: str | None
    notes: str | None
    created_at: datetime
    diagnostic_report: DiagnosticReportResponse | None = None

    class Config:
        from_attributes = True


class TrackedPlantDetailsResponse(TrackedPlantResponse):
    tracking_entries: list[TrackingEntryResponse] = []
    
    


class UserProfileResponse(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: EmailStr

    class Config:
        from_attributes = True


class UserProfileUpdate(BaseModel):
    first_name: str | None = None
    last_name: str | None = None
    
    
class MonthlyAnalyticsItem(BaseModel):
    month: str
    healthy_score: int
    outbreak_score: int


class AnalyticsOverviewResponse(BaseModel):
    total_reports: int
    average_confidence: float
    high_risk_count: int
    medium_risk_count: int
    low_risk_count: int
    monthly_stats: list[MonthlyAnalyticsItem]