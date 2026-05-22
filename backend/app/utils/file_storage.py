import os
import uuid
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent.parent
UPLOAD_DIR = BASE_DIR / "uploads"

def ensure_upload_dirs():
    folders = [
        "original",
        "boxed",
        "crops",
        "gradcam",
    ]

    for folder in folders:
        os.makedirs(
            os.path.join(UPLOAD_DIR, folder),
            exist_ok=True
        )
        
def save_original_image(
    image_bytes: bytes,
    extension: str = "jpg"
):
    ensure_upload_dirs();
    
    filename = f"{uuid.uuid4()}.{extension}"

    filepath = os.path.join(
        UPLOAD_DIR,
        "original",
        filename
    )

    with open(filepath, "wb") as f:
        f.write(image_bytes)
    return {
        "filename": filename,
        "filepath": filepath,
        "url": f"/uploads/original/{filename}"
    }