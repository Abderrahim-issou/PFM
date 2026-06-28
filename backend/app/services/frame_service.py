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
    read=200.0,
    write=200.0,
    pool=50.0,
)

DISEASE_INFO = {
    "Tomato__Bacterial_spot": {
        "description": "Bacterial spot is a bacterial disease that causes small dark, water-soaked spots on tomato leaves, stems, and fruits. It spreads quickly in warm and humid conditions.",
        "organic_cure": "Remove infected leaves, avoid overhead watering, improve air circulation, and apply copper-based organic sprays when symptoms appear.",
        "chemical_cure": "Use copper-based bactericides or approved mancozeb/copper combinations according to local agricultural guidelines.",
        "prevention": "Use certified disease-free seeds, rotate crops, disinfect tools, avoid wet foliage, and remove infected plant debris."
    },
    "Tomato_Early_blight": {
        "description": "Early blight is a fungal disease caused by Alternaria solani. It appears as brown spots with concentric rings, usually starting on older lower leaves.",
        "organic_cure": "Remove infected leaves, apply neem oil or copper-based fungicides, and use compost tea to improve plant resistance.",
        "chemical_cure": "Apply fungicides such as chlorothalonil, mancozeb, or azoxystrobin following label instructions.",
        "prevention": "Avoid overhead irrigation, mulch the soil, rotate crops, space plants properly, and remove infected residues."
    },
    "Tomato_Late_blight": {
        "description": "Late blight is a serious disease caused by Phytophthora infestans. It creates dark, water-soaked lesions and can rapidly destroy tomato plants in humid conditions.",
        "organic_cure": "Remove heavily infected plants, improve ventilation, avoid wet leaves, and apply copper-based organic fungicides early.",
        "chemical_cure": "Use protective fungicides such as chlorothalonil, mancozeb, or metalaxyl-based products where approved.",
        "prevention": "Use resistant varieties, avoid overhead watering, monitor during humid weather, and remove infected plant material quickly."
    },
    "Tomato_Leaf_Mold": {
        "description": "Leaf mold is a fungal disease common in humid environments. It causes yellow spots on the upper leaf surface and olive-green mold underneath.",
        "organic_cure": "Improve air circulation, reduce humidity, remove affected leaves, and apply copper or sulfur-based organic treatments.",
        "chemical_cure": "Use fungicides such as chlorothalonil or other approved anti-fungal products for tomato leaf mold.",
        "prevention": "Ventilate greenhouses, avoid leaf wetness, space plants properly, and use resistant tomato varieties."
    },
    "Tomato_Septoria_leaf_spot": {
        "description": "Septoria leaf spot is a fungal disease that causes many small circular spots with gray centers and dark borders, mainly on lower leaves.",
        "organic_cure": "Remove infected leaves, mulch around plants, avoid splashing water, and apply copper-based organic fungicide.",
        "chemical_cure": "Use fungicides such as chlorothalonil, mancozeb, or copper-based products according to recommendations.",
        "prevention": "Rotate crops, remove plant debris, avoid overhead watering, and keep foliage dry."
    },
    "Tomato_Spider_mites Two-spotted_spider_mite": {
        "description": "Two-spotted spider mites are pests that feed on leaf tissues, causing yellow speckling, leaf bronzing, webbing, and reduced plant vigor.",
        "organic_cure": "Spray leaves with water to reduce mites, apply neem oil or insecticidal soap, and introduce beneficial predatory mites if possible.",
        "chemical_cure": "Use approved miticides when infestation is severe, following local agricultural safety instructions.",
        "prevention": "Avoid plant stress, maintain proper humidity, inspect leaf undersides regularly, and remove heavily infested leaves."
    },
    "Tomato_Target_Spot": {
        "description": "Target spot is a fungal disease that causes brown circular lesions with ring-like patterns. It can affect leaves, stems, and fruit.",
        "organic_cure": "Remove infected leaves, improve airflow, avoid overhead watering, and apply copper-based organic fungicide.",
        "chemical_cure": "Use fungicides such as chlorothalonil, mancozeb, or strobilurin-based products where approved.",
        "prevention": "Use crop rotation, reduce humidity, avoid dense planting, and clean infected plant residues."
    },
    "Tomato_Tomato_Yellow_Leaf_Curl_Virus": {
        "description": "Tomato Yellow Leaf Curl Virus is a viral disease transmitted mainly by whiteflies. It causes yellowing, curling leaves, stunted growth, and reduced fruit production.",
        "organic_cure": "There is no direct cure for viral infection. Remove infected plants and control whiteflies using neem oil or insecticidal soap.",
        "chemical_cure": "Use approved insecticides to manage whitefly populations. Viral diseases cannot be cured chemically once the plant is infected.",
        "prevention": "Control whiteflies, use resistant varieties, remove infected plants, and protect young plants with insect-proof nets."
    },
    "Tomato_Tomato_mosaic_virus": {
        "description": "Tomato mosaic virus causes mottled green and yellow leaf patterns, leaf distortion, stunted growth, and reduced fruit quality.",
        "organic_cure": "There is no direct cure. Remove infected plants, disinfect tools, and avoid handling healthy plants after touching infected ones.",
        "chemical_cure": "No chemical cure exists for the virus. Management focuses on sanitation and preventing spread.",
        "prevention": "Use resistant varieties, disinfect tools, wash hands, remove infected plants, and avoid tobacco contamination."
    },
    "Tomato__healthy": {
        "description": "The leaf appears healthy with no visible signs of disease infection or pest damage.",
        "organic_cure": "No treatment is required. Continue regular monitoring and maintain good plant care.",
        "chemical_cure": "No chemical treatment is required.",
        "prevention": "Maintain proper watering, good air circulation, balanced nutrition, and regular inspection for early disease signs."
    }
}


DISEASE_ALIASES = {
    "Bacterial Spot": "Tomato__Bacterial_spot",
    "Early Blight": "Tomato_Early_blight",
    "Late Blight": "Tomato_Late_blight",
    "Leaf Mold": "Tomato_Leaf_Mold",
    "Septoria Leaf Spot": "Tomato_Septoria_leaf_spot",
    "Spider Mites": "Tomato_Spider_mites Two-spotted_spider_mite",
    "Two-spotted Spider Mite": "Tomato_Spider_mites Two-spotted_spider_mite",
    "Target Spot": "Tomato_Target_Spot",
    "Yellow Leaf Curl Virus": "Tomato_Tomato_Yellow_Leaf_Curl_Virus",
    "Tomato Yellow Leaf Curl Virus": "Tomato_Tomato_Yellow_Leaf_Curl_Virus",
    "Tomato Mosaic Virus": "Tomato_Tomato_mosaic_virus",
    "Mosaic Virus": "Tomato_Tomato_mosaic_virus",
    "Healthy": "Tomato__healthy",
    "healthy": "Tomato__healthy",
}


def get_disease_info(class_name: str):
    normalized_class_name = DISEASE_ALIASES.get(class_name, class_name)

    return DISEASE_INFO.get(normalized_class_name, {
        "description": "No detailed information is available for this prediction.",
        "organic_cure": "Please consult an agricultural specialist for organic treatment recommendations.",
        "chemical_cure": "Please consult local agricultural guidelines before applying chemical treatment.",
        "prevention": "Monitor the plant regularly and maintain good agricultural practices."
})
 

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
        
    model_prediction = (
        result.get("model_prediction")
        or result.get("prediction")
        or "unknown"
    )

    disease_info = get_disease_info(model_prediction)

    report = create_diagnostic_report(
        db=db,
        user_id=current_user.id,

        model_prediction=model_prediction,

        plant=result.get("plant") or "Tomato",

        disease=result.get("disease")
            or result.get("prediction")
            or model_prediction
            or "Unknown",

        confidence=result.get("confidence") or 0,

        severity=result.get("severity") or "Low",

        description= disease_info["description"],

        organic_cure= disease_info["organic_cure"],

        chemical_cure=disease_info["chemical_cure"],

        prevention=disease_info["prevention"],

        image_url=saved_image.get("url"),

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
