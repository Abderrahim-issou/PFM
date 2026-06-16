from pathlib import Path
import uuid
import cv2
import numpy as np
from PIL import Image


PROJECT_ROOT = Path(__file__).resolve().parents[3]

BACKEND_UPLOADS_DIR = PROJECT_ROOT / "backend" / "app" / "uploads"


def save_image_to_backend_uploads(
    image,
    folder: str,
    prefix: str = "image",
    extension: str = "jpg",
):
    """
    Save image into backend/app/uploads/<folder>.

    image can be:
    - PIL.Image
    - numpy array
    - bytes
    """

    target_dir = BACKEND_UPLOADS_DIR / folder
    target_dir.mkdir(parents=True, exist_ok=True)

    filename = f"{uuid.uuid4()}_{prefix}.{extension}"
    filepath = target_dir / filename

    if isinstance(image, Image.Image):
        image.save(filepath)

    elif isinstance(image, np.ndarray):
        cv2.imwrite(str(filepath), image)

    elif isinstance(image, bytes):
        with open(filepath, "wb") as f:
            f.write(image)

    else:
        raise TypeError(f"Unsupported image type: {type(image)}")

    return {
        "filename": filename,
        "filepath": str(filepath),
        "url": f"/uploads/{folder}/{filename}",
    }