from fastapi import APIRouter, UploadFile, File, Form
from pathlib import Path
import uuid

router = APIRouter(prefix="/internal", tags=["Internal"])

BASE_DIR = Path(__file__).resolve().parent.parent
UPLOADS_DIR = BASE_DIR / "uploads"


@router.post("/upload-image")
async def upload_image(
    file: UploadFile = File(...),
    folder: str = Form(...)
):
    target_dir = UPLOADS_DIR / folder
    target_dir.mkdir(parents=True, exist_ok=True)

    extension = file.filename.split(".")[-1]

    filename = f"{uuid.uuid4()}.{extension}"
    filepath = target_dir / filename

    content = await file.read()

    with open(filepath, "wb") as f:
        f.write(content)

    return {
        "filename": filename,
        "filepath": str(filepath),
        "url": f"/uploads/{folder}/{filename}",
    }