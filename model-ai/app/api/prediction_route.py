from fastapi import APIRouter, UploadFile, File, HTTPException

from app.services.prediction_service import predict_with_yolo

router = APIRouter()


@router.post("/predict")
async def predict(file: UploadFile = File(...)):
    try:
        
        image_bytes = await file.read()

        if not image_bytes:
            raise HTTPException(
                status_code=400,
                detail="Empty image file"
            )

        
        result = predict_with_yolo(image_bytes)


        return result

    except Exception as e:
        print('error is here', e)
        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed: {str(e)}"
        )