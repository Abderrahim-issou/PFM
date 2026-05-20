import os
import httpx
from sqlalchemy.orm import Session
from app.services.diagnostic_service import create_diagnostic_report
from app.schemas.user import User
from fastapi import HTTPException, status
from app.utils.file_storage import save_original_image


AI_SERVICE_URL = os.getenv('AI_SERVICE_URL');

timeout = httpx.Timeout(
    connect=10.0,
    read=120.0,
    write=120.0,
    pool=10.0,
)
 

async def process_frame(frame: bytes):

    try:
        async with httpx.AsyncClient(timeout=timeout) as client:
            response = await client.post(
                AI_SERVICE_URL,
                files={"file": frame}
            )

        if response.status_code != 200:
            return {
                "success": False,
                "error": "AI service failed",
                "status_code": response.status_code
            }

        result = response.json()

        return result
        

    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }


async def process_frame2(
    frames: bytes,
    db: Session,
    current_user: User,
):
    saved_image = save_original_image(frames)
    
    result = await process_frame(frames)

    if not result.get("success"):
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=result.get("error", "AI service failed")
        )

    report = create_diagnostic_report(
        db=db,
        user_id=current_user.id,

        model_prediction=result.get("model_prediction")
            or result.get("prediction")
            or "unknown",

        plant=result.get("plant") or "Unknown",

        disease=result.get("disease")
            or result.get("prediction")
            or "Unknown",

        confidence=result.get("confidence") or 0,

        severity=result.get("severity") or "Low",

        description=result.get("description") or "",

        organic_cure=result.get("organic_cure") or "",

        chemical_cure=result.get("chemical_cure") or "",

        prevention=result.get("prevention") or "",

        image_url=saved_image.get('url'),

        boxed_image_url=result.get("boxed_image_url"),

        regions=result.get("regions", []),
    )
    
    
    report_dict = {
        column.name: getattr(report, column.name)
        for column in report.__table__.columns
    }
    
    
    return {
        "success": True,
        **report_dict
    }
