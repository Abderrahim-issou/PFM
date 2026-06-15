from pydantic import BaseModel
from typing import Optional

class PredictionInput:
    """
    This represents the raw input coming from the backend.
    In FastAPI, file uploads are usually handled in the route layer,
    so here we define what the service expects logically.
    """

    def __init__(self, image: bytes):
        self.image = image


# class PredictionOutput(BaseModel):
#     """
#     Standard response returned by the AI service.
#     """

#     success: bool
#     prediction: str
#     confidence: float
#     message: Optional[str] = None
    
    

class DetectedItem(BaseModel):
    class_id: int
    class_name: str
    confidence: float
    bbox: list[float]

class PredictionOutput(BaseModel):
    success: bool
    total_items: int
    detected_items: list[DetectedItem]
    counts: dict[str, int]
    message: str