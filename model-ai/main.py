from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.prediction_route import router as prediction_router
from dotenv import load_dotenv
import os

load_dotenv()

BACKEND_URL = os.getenv("BACKEND_URL")

app = FastAPI(
    title="AI Prediction Service",
    description="Plant disease detection API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        BACKEND_URL
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
);

app.include_router(
    prediction_router,
    prefix="/model",
    tags=["Prediction"]);