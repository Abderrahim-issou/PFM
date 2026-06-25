from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent

UPLOADS_DIR = BASE_DIR / "uploads"


def ensure_upload_dirs():

    folders = [
        UPLOADS_DIR,
        UPLOADS_DIR / "original",
        UPLOADS_DIR / "boxed",
        UPLOADS_DIR / "crops",
        UPLOADS_DIR / "gradcam",
    ]

    for folder in folders:
        folder.mkdir(parents=True, exist_ok=True)