
import io
import os
import uuid
import cv2
import httpx
import numpy as np
from PIL import Image

BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:8000")


def get_pil_format(extension: str):
    ext = extension.lower().replace(".", "")

    if ext in ["jpg", "jpeg"]:
        return "JPEG"

    if ext == "png":
        return "PNG"

    if ext == "webp":
        return "WEBP"

    return ext.upper()


async def save_image_to_backend_uploads(
    image,
    folder: str,
    prefix: str = "image",
    extension: str = "jpg",
):
    filename = f"{uuid.uuid4()}_{prefix}.{extension}"

    if isinstance(image, Image.Image):
        buffer = io.BytesIO()
        image.save(
            buffer,
            format=get_pil_format(extension)
        )
        image_bytes = buffer.getvalue()

    elif isinstance(image, np.ndarray):
        success, encoded = cv2.imencode(
            f".{extension}",
            image
        )

        if not success:
            raise ValueError(
                "Failed to encode numpy image"
            )

        image_bytes = encoded.tobytes()

    elif isinstance(image, bytes):
        image_bytes = image

    else:
        raise TypeError(
            f"Unsupported image type: {type(image)}"
        )

    async with httpx.AsyncClient(
        timeout=120
    ) as client:

        response = await client.post(
            f"{BACKEND_URL}/internal/upload-image",
            files={
                "file": (
                    filename,
                    image_bytes,
                    f"image/{extension}"
                )
            },
            data={
                "folder": folder
            },
        )



    response.raise_for_status()

    result = response.json()


    return result