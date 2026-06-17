from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.prediction_route import router as prediction_router


app = FastAPI(
    title="AI Prediction Service",
    description="Plant disease detection API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=['http://localhost:8000'],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
);

app.include_router(
    prediction_router,
    prefix="/model",
    tags=["Prediction"]);