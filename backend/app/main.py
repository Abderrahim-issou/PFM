from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers.user_route import router as user_router
from app.db.session import engine
from app.schemas import user
from app.schemas.user import Base
from app.routers.process_image import router as process_route
from app.routers.diagnostic_report import router as diagnostic_report_router
from app.routers.tracking_route import router as tracking_router
from app.routers.analytics import router as analytics_router
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
import os
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent

UPLOADS_DIR = BASE_DIR / "uploads"



load_dotenv();

Base.metadata.create_all(bind=engine)

app = FastAPI();


app.mount(
    "/uploads",
    StaticFiles(directory=UPLOADS_DIR),
    name="uploads"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=['http://localhost:5173'],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
);

app.include_router(user_router);
app.include_router(process_route);
app.include_router(diagnostic_report_router)
app.include_router(analytics_router)
app.include_router(tracking_router)