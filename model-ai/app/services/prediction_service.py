import os
import io
import cv2
import uuid
import torch
import numpy as np
import tensorflow as tf
from pathlib import Path
import torch.nn.functional as F
from PIL import Image, ImageDraw
from torchvision import transforms
from app.models.model_loader import get_model, get_resnet_model, get_efficientnet_model
from app.utils.strage_logic import save_image_to_backend_uploads
from app.schemas.prediction_schema import PredictionOutput, DetectedItem
import asyncio


BACKEND_UPLOADS_DIR = Path("../../../backend/app/uploads").resolve()
BOXED_DIR = BACKEND_UPLOADS_DIR / "boxed"
CROPS_DIR = BACKEND_UPLOADS_DIR / "crops"
GRADCAM_DIR = BACKEND_UPLOADS_DIR / "gradcam"
RESNET_IMAGE_SIZE = (224, 224)
EFFICIENTNET_IMAGE_SIZE = (380, 380)
RESNET_EFFICIENTNET_CLASS_NAMES = [
    "Tomato__Bacterial_spot",
    "Tomato_Early_blight",
    "Tomato_Late_blight",
    "Tomato_Leaf_Mold",
    "Tomato_Septoria_leaf_spot",
    "Tomato_Spider_mites Two-spotted_spider_mite",
    "Tomato_Target_Spot",
    "Tomato_Tomato_Yellow_Leaf_Curl_Virus",
    "Tomato_Tomato_mosaic_virus",
    "Tomato__healthy",
]
DISEASE_INFO = {
    "Tomato__Bacterial_spot": {
        "display_name": "Bacterial Spot",
        "severity": "Medium",
        "description": "Bacterial spot causes small dark lesions on tomato leaves and fruits, often spreading in warm and wet conditions.",
        "organic_cure": "Remove infected leaves, improve airflow, avoid overhead watering, and apply copper-based organic sprays.",
        "chemical_cure": "Use approved copper bactericides according to label instructions.",
        "prevention": "Use disease-free seeds, rotate crops, avoid working with wet plants, and sanitize tools regularly.",
    },

    "Tomato_Early_blight": {
        "display_name": "Early Blight",
        "severity": "Medium",
        "description": "Early blight produces dark concentric ring spots, usually starting on older lower leaves.",
        "organic_cure": "Remove infected foliage, mulch around plants, and use compost tea or copper-based sprays.",
        "chemical_cure": "Use protective fungicides such as chlorothalonil or mancozeb when disease pressure is high.",
        "prevention": "Rotate crops, avoid soil splash, space plants properly, and remove plant debris after harvest.",
    },

    "Tomato_Late_blight": {
        "display_name": "Late Blight",
        "severity": "High",
        "description": "Late blight is a fast-spreading disease that causes dark water-soaked lesions on leaves and stems.",
        "organic_cure": "Remove infected parts immediately, improve ventilation, and apply copper-based organic fungicide.",
        "chemical_cure": "Use recommended fungicides such as mancozeb or chlorothalonil during high-risk weather.",
        "prevention": "Avoid overhead watering, monitor humidity, space plants well, and destroy infected residues.",
    },

    "Tomato_Leaf_Mold": {
        "display_name": "Leaf Mold",
        "severity": "Medium",
        "description": "Leaf mold appears as yellow patches on upper leaf surfaces and fuzzy mold growth underneath.",
        "organic_cure": "Improve air circulation, remove infected leaves, and reduce humidity around plants.",
        "chemical_cure": "Use approved fungicides when infection spreads quickly.",
        "prevention": "Avoid high humidity, space plants correctly, and ventilate greenhouses.",
    },

    "Tomato_Septoria_leaf_spot": {
        "display_name": "Septoria Leaf Spot",
        "severity": "Medium",
        "description": "Septoria leaf spot causes many small circular spots with dark borders, usually on lower leaves.",
        "organic_cure": "Remove infected leaves and apply copper-based organic fungicide.",
        "chemical_cure": "Use protective fungicides such as chlorothalonil if needed.",
        "prevention": "Avoid wet foliage, mulch soil, and remove crop debris.",
    },

    "Tomato_Spider_mites Two-spotted_spider_mite": {
        "display_name": "Two-Spotted Spider Mite",
        "severity": "Medium",
        "description": "Spider mite damage appears as tiny yellow speckles, leaf bronzing, and sometimes fine webbing.",
        "organic_cure": "Spray leaves with water, apply neem oil, or introduce beneficial predatory mites.",
        "chemical_cure": "Use suitable miticides only when infestation is severe.",
        "prevention": "Avoid dusty conditions, inspect leaf undersides, and maintain plant hydration.",
    },

    "Tomato_Target_Spot": {
        "display_name": "Target Spot",
        "severity": "Medium",
        "description": "Target spot causes circular brown lesions with ring patterns and can spread during humid conditions.",
        "organic_cure": "Remove infected leaves and improve airflow.",
        "chemical_cure": "Apply recommended fungicides if disease pressure is high.",
        "prevention": "Avoid overhead watering, rotate crops, and remove infected residue.",
    },

    "Tomato_Tomato_Yellow_Leaf_Curl_Virus": {
        "display_name": "Yellow Leaf Curl Virus",
        "severity": "High",
        "description": "Yellow leaf curl virus causes curled yellow leaves, stunted growth, and reduced fruit production.",
        "organic_cure": "Remove heavily infected plants and control whiteflies using sticky traps or neem oil.",
        "chemical_cure": "Use approved insecticides to manage whitefly vectors when necessary.",
        "prevention": "Use resistant varieties, control whiteflies, and remove infected plants early.",
    },

    "Tomato_Tomato_mosaic_virus": {
        "display_name": "Tomato Mosaic Virus",
        "severity": "High",
        "description": "Tomato mosaic virus causes mottled leaves, distorted growth, and reduced plant vigor.",
        "organic_cure": "Remove infected plants and sanitize tools thoroughly.",
        "chemical_cure": "No direct chemical cure exists for viral infection.",
        "prevention": "Use clean seeds, wash hands/tools, and avoid handling plants after tobacco contact.",
    },

    "Tomato__healthy": {
        "display_name": "Healthy",
        "severity": "Low",
        "description": "The leaf appears healthy with no visible disease symptoms.",
        "organic_cure": "No treatment needed. Maintain regular organic care and monitor leaves weekly.",
        "chemical_cure": "No chemical treatment required.",
        "prevention": "Maintain balanced watering, good sunlight, clean tools, and regular inspection.",
    },
}




def ensure_ai_output_dirs():
    BOXED_DIR.mkdir(parents=True, exist_ok=True)
    CROPS_DIR.mkdir(parents=True, exist_ok=True)
    GRADCAM_DIR.mkdir(parents=True, exist_ok=True)

async def predict_with_yolo(image_bytes: bytes):
    ensure_ai_output_dirs()

    model = get_model()

    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    image_width, image_height = image.size

    results = model(image)
    result = results[0]

    names = result.names
    boxes = result.boxes

    if boxes is None or len(boxes) == 0:
        return {
            "success": False,
            "message": "No leaves detected",
            "boxed_image_url": None,
            "regions": [],
        }

    boxed_image = image.copy()
    draw = ImageDraw.Draw(boxed_image)

    region_items = []
    crop_upload_tasks = []

    disease_counts = {}
    confidences = []
    severities = []

    severity_priority = {
        "Low": 1,
        "Medium": 2,
        "High": 3,
    }

    for index, box in enumerate(boxes):
        class_id = int(box.cls.item())
        yolo_confidence = float(box.conf.item()) * 100
        yolo_class_name = names[class_id]

        x1, y1, x2, y2 = box.xyxy[0].tolist()

        x1_int = max(0, int(x1))
        y1_int = max(0, int(y1))
        x2_int = min(image_width, int(x2))
        y2_int = min(image_height, int(y2))

        crop = image.crop((x1_int, y1_int, x2_int, y2_int))

        effecient_result = await predict_leaf_with_efficientnet(crop)

        resnet_disease = effecient_result.get("disease") or yolo_class_name
        resnet_confidence = effecient_result.get("confidence") or yolo_confidence
        resnet_severity = effecient_result.get("severity") or "Low"

        crop_upload_tasks.append(
            save_image_to_backend_uploads(
                image=crop,
                folder="crops",
                prefix=f"leaf_{index + 1}",
                extension="jpg",
            )
        )

        draw.rectangle(
            [(x1_int, y1_int), (x2_int, y2_int)],
            outline="lime",
            width=4,
        )

        draw.text(
            (x1_int, max(0, y1_int - 18)),
            f"{resnet_disease} {resnet_confidence:.1f}%",
            fill="lime",
        )

        x = (x1 / image_width) * 100
        y = (y1 / image_height) * 100
        width = ((x2 - x1) / image_width) * 100
        height = ((y2 - y1) / image_height) * 100

        region_items.append({
            "id": index + 1,
            "label": "leaf",
            "confidence": round(yolo_confidence, 2),

            "x": round(x, 2),
            "y": round(y, 2),
            "width": round(width, 2),
            "height": round(height, 2),

            "crop_url": None,
            "gradcam_url": effecient_result.get("gradcam_url"),

            "disease": resnet_disease,
            "severity": resnet_severity,
            "diagnosis_confidence": round(resnet_confidence, 2),
        })

        disease_counts[resnet_disease] = disease_counts.get(resnet_disease, 0) + 1
        confidences.append(resnet_confidence)
        severities.append(resnet_severity)

    boxed_upload_task = save_image_to_backend_uploads(
        image=boxed_image,
        folder="boxed",
        prefix="boxed",
        extension="jpg",
    )

    crop_results, saved_boxed = await asyncio.gather(
        asyncio.gather(*crop_upload_tasks),
        boxed_upload_task,
    )

    regions = []

    for region_item, saved_crop in zip(region_items, crop_results):
        region_item["crop_url"] = saved_crop["url"]
        regions.append(region_item)

    boxed_image_url = saved_boxed["url"]

    main_disease = max(disease_counts, key=disease_counts.get)

    average_confidence = (
        sum(confidences) / len(confidences)
        if confidences
        else 0
    )

    main_severity = (
        max(
            severities,
            key=lambda severity: severity_priority.get(severity, 1)
        )
        if severities
        else "Low"
    )

    return {
        "success": True,
        "message": "YOLO + ResNet prediction completed successfully",
        "boxed_image_url": boxed_image_url,
        "model_prediction": main_disease,
        "plant": "Tomato",
        "disease": main_disease,
        "confidence": round(average_confidence, 2),
        "severity": main_severity,
        "regions": regions,
    }

async def predict_with_yolo2(image_bytes: bytes):
    ensure_ai_output_dirs()

    model = get_model()

    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    image_width, image_height = image.size

    results = model(image)
    result = results[0]

    names = result.names
    boxes = result.boxes

    if boxes is None or len(boxes) == 0:
        return {
            "success": False,
            "message": "No leaves detected",
            "boxed_image_url": None,
            "regions": [],
        }


    boxed_image = image.copy()
    draw = ImageDraw.Draw(boxed_image)

    regions = []
    disease_counts = {}
    confidences = []
    severities = []

    severity_priority = {
        "Low": 1,
        "Medium": 2,
        "High": 3,
    }

    for index, box in enumerate(boxes):
        class_id = int(box.cls.item())
        yolo_confidence = float(box.conf.item()) * 100
        yolo_class_name = names[class_id]

        x1, y1, x2, y2 = box.xyxy[0].tolist()

        x1_int = max(0, int(x1))
        y1_int = max(0, int(y1))
        x2_int = min(image_width, int(x2))
        y2_int = min(image_height, int(y2))

        crop = image.crop((x1_int, y1_int, x2_int, y2_int))
        
        # resnet_result = predict_leaf_with_resnet(crop)
        effecient_result = await predict_leaf_with_efficientnet(crop)

        resnet_disease = effecient_result.get("disease") or yolo_class_name
        resnet_confidence = effecient_result.get("confidence") or yolo_confidence
        resnet_severity = effecient_result.get("severity") or "Low"

        saved_crop = await save_image_to_backend_uploads(
            image=crop,
            folder="crops",
            prefix=f"leaf_{index + 1}",
            extension="jpg",
        )

        crop_url = saved_crop["url"]

        draw.rectangle(
            [(x1_int, y1_int), (x2_int, y2_int)],
            outline="lime",
            width=4,
        )

        draw.text(
            (x1_int, max(0, y1_int - 18)),
            f"{resnet_disease} {resnet_confidence:.1f}%",
            fill="lime",
        )

        x = (x1 / image_width) * 100
        y = (y1 / image_height) * 100
        width = ((x2 - x1) / image_width) * 100
        height = ((y2 - y1) / image_height) * 100

        regions.append({
            "id": index + 1,
            "label": "leaf",
            "confidence": round(yolo_confidence, 2),

            "x": round(x, 2),
            "y": round(y, 2),
            "width": round(width, 2),
            "height": round(height, 2),

            "crop_url": crop_url,
            "gradcam_url": effecient_result.get("gradcam_url"),

            "disease": resnet_disease,
            "severity": resnet_severity,
            "diagnosis_confidence": round(resnet_confidence, 2),
        })

        disease_counts[resnet_disease] = disease_counts.get(resnet_disease, 0) + 1
        confidences.append(resnet_confidence)
        severities.append(resnet_severity)

    saved_boxed = await save_image_to_backend_uploads(
        image=boxed_image,
        folder="boxed",
        prefix="boxed",
        extension="jpg",
    )
    boxed_image_url = saved_boxed["url"]

    main_disease = max(disease_counts, key=disease_counts.get)

    average_confidence = (
        sum(confidences) / len(confidences)
        if confidences
        else 0
    )

    main_severity = (
        max(
            severities,
            key=lambda severity: severity_priority.get(severity, 1)
        )
        if severities
        else "Low"
    )

    return {
        "success": True,
        "message": "YOLO + ResNet prediction completed successfully",
        "boxed_image_url": boxed_image_url,
        "model_prediction": main_disease,
        "plant": "Tomato",
        "disease": main_disease,
        "confidence": round(average_confidence, 2),
        "severity": main_severity,
        "regions": regions,
    }

async def predict_image(image_bytes: bytes):
    yolo_result = await predict_with_yolo(image_bytes)

    if not yolo_result.get("success"):
        return {
            "success": False,
            "prediction": None,
            "confidence": 0,
            "message": yolo_result.get("message", "Prediction failed"),

            "plant": "Unknown",
            "disease": "Unknown",
            "severity": "Low",
            "description": "",
            "organic_cure": "",
            "chemical_cure": "",
            "prevention": "",
            "model_prediction": "unknown",
            "image_url": None,
            "regions": [],
        }

    return {
        "success": True,

        "prediction": yolo_result["model_prediction"],
        "confidence": yolo_result["confidence"],
        "message": yolo_result["message"],

        "plant": yolo_result.get("plant", "Unknown"),
        "disease": yolo_result["disease"],


        "severity": "Low",

        "description": "",
        "organic_cure": "",
        "chemical_cure": "",
        "prevention": "",

        "model_prediction": yolo_result["model_prediction"],


        "image_url": yolo_result.get("boxed_image_url"),

        "regions": yolo_result["regions"],
    }
    
def preprocess_leaf_image_rais_net(image: Image.Image):
    transform = transforms.Compose([
        transforms.Resize(RESNET_IMAGE_SIZE),
        transforms.ToTensor(),
    ])

    image = image.convert("RGB")
    image_tensor = transform(image)

    image_tensor = image_tensor.unsqueeze(0)

    return image_tensor

def preprocess_leaf_image_effeccient_Net(image: Image.Image):
    transform = transforms.Compose([
        transforms.Resize(EFFICIENTNET_IMAGE_SIZE),
        transforms.ToTensor(),
        transforms.Normalize(
            mean=[0.485, 0.456, 0.406],
            std=[0.229, 0.224, 0.225]
        ),
    ])

    image = image.convert("RGB")
    image_tensor = transform(image)
    image_tensor = image_tensor.unsqueeze(0)

    return image_tensor

def get_disease_info(class_name: str):
    return DISEASE_INFO.get(
        class_name,
        {
            "display_name": class_name.replace("_", " "),
            "severity": "Low",
            "description": "",
            "organic_cure": "",
            "chemical_cure": "",
            "prevention": "",
        },
    )

def predict_leaf_with_resnet(image: Image.Image):
    model = get_resnet_model()

    processed_image = preprocess_leaf_image_rais_net(image)

    with torch.no_grad():
        outputs = model(processed_image)
        probabilities = F.softmax(outputs, dim=1)

    confidence_tensor, class_index_tensor = torch.max(probabilities, dim=1)

    class_index = int(class_index_tensor.item())
    confidence = float(confidence_tensor.item()) * 100

    class_name = RESNET_EFFICIENTNET_CLASS_NAMES[class_index]
    disease_info = get_disease_info(class_name)

    gradcam_url = generate_gradcam_rais_net(
        model=model,
        processed_image=processed_image,
        original_image=image,
        class_index=class_index,
        last_conv_layer_name=None,
    )

    return {
        "model_prediction": class_name,
        "disease": disease_info["display_name"],
        "confidence": round(confidence, 2),
        "severity": disease_info["severity"],
        "description": disease_info["description"],
        "organic_cure": disease_info["organic_cure"],
        "chemical_cure": disease_info["chemical_cure"],
        "prevention": disease_info["prevention"],
        "gradcam_url": gradcam_url,
    }

async def predict_leaf_with_efficientnet(image: Image.Image):
    model = get_efficientnet_model()

    processed_image = preprocess_leaf_image_effeccient_Net(image)

    with torch.no_grad():
        outputs = model(processed_image)
        probabilities = F.softmax(outputs, dim=1)

    confidence_tensor, class_index_tensor = torch.max(probabilities, dim=1)

    class_index = int(class_index_tensor.item())
    confidence = float(confidence_tensor.item()) * 100

    class_name = RESNET_EFFICIENTNET_CLASS_NAMES[class_index]
    disease_info = get_disease_info(class_name)

    gradcam_result = await generate_gradcam_efficientnet2(
        model=model,
        processed_image=processed_image,
        original_image=image,
        class_index=class_index,
    )
    gradcam_url = gradcam_result["gradcam_url"]
    gradcam_severity = gradcam_result["severity"]
    affected_area = gradcam_result["affected_area"]
    
    return {
        "model_prediction": class_name,
        "disease": disease_info["display_name"],
        "confidence": round(confidence, 2),
        "severity": gradcam_severity,
        "description": disease_info["description"],
        "organic_cure": disease_info["organic_cure"],
        "chemical_cure": disease_info["chemical_cure"],
        "prevention": disease_info["prevention"],
        "gradcam_url": gradcam_url,
    }
   
def generate_gradcam_rais_net(
    model,
    processed_image,
    original_image: Image.Image,
    class_index: int,
    last_conv_layer_name=None,
):
    model.eval()

    gradients = []
    activations = []

    target_layer = model.layer4[-1]

    def forward_hook(module, input, output):
        activations.append(output)

    def backward_hook(module, grad_input, grad_output):
        gradients.append(grad_output[0])

    forward_handle = target_layer.register_forward_hook(forward_hook)
    backward_handle = target_layer.register_full_backward_hook(backward_hook)

    output = model(processed_image)

    model.zero_grad()

    loss = output[0, class_index]
    loss.backward()

    grads = gradients[0]
    acts = activations[0]

    pooled_grads = torch.mean(grads, dim=[0, 2, 3])

    for i in range(acts.shape[1]):
        acts[:, i, :, :] *= pooled_grads[i]

    heatmap = torch.mean(acts, dim=1).squeeze()
    heatmap = F.relu(heatmap)

    heatmap = heatmap.detach().cpu().numpy()

    heatmap = heatmap / np.max(heatmap)

    original = np.array(original_image.convert("RGB"))
    original = cv2.resize(original, RESNET_IMAGE_SIZE)

    heatmap = cv2.resize(heatmap, RESNET_IMAGE_SIZE)
    heatmap = np.uint8(255 * heatmap)

    heatmap_color = cv2.applyColorMap(heatmap, cv2.COLORMAP_JET)

    overlay = cv2.addWeighted(original, 0.6, heatmap_color, 0.4, 0)

    saved_gradcam = save_image_to_backend_uploads(
        image=cv2.cvtColor(overlay, cv2.COLOR_RGB2BGR),
        folder="gradcam",
        prefix="gradcam",
        extension="jpg",
    )

    forward_handle.remove()
    backward_handle.remove()

    return saved_gradcam["url"]

async def generate_gradcam_efficientnet(
    model,
    processed_image,
    original_image: Image.Image,
    class_index: int,
    last_conv_layer_name=None,
):
    model.eval()

    gradients = []
    activations = []

    target_layer = model.conv_head

    def forward_hook(module, input, output):
        activations.append(output)

    def backward_hook(module, grad_input, grad_output):
        gradients.append(grad_output[0])

    forward_handle = target_layer.register_forward_hook(forward_hook)
    backward_handle = target_layer.register_full_backward_hook(backward_hook)

    output = model(processed_image)

    model.zero_grad()

    loss = output[0, class_index]
    loss.backward()

    grads = gradients[0]
    acts = activations[0]

    pooled_grads = torch.mean(grads, dim=[0, 2, 3])

    for i in range(acts.shape[1]):
        acts[:, i, :, :] *= pooled_grads[i]

    heatmap = torch.mean(acts, dim=1).squeeze()
    heatmap = F.relu(heatmap)

    heatmap = heatmap.detach().cpu().numpy()

    if np.max(heatmap) != 0:
        heatmap = heatmap / np.max(heatmap)

    original = np.array(original_image.convert("RGB"))
    original = cv2.resize(original, EFFICIENTNET_IMAGE_SIZE)

    heatmap = cv2.resize(heatmap, EFFICIENTNET_IMAGE_SIZE)
    heatmap = np.uint8(255 * heatmap)

    heatmap_color = cv2.applyColorMap(heatmap, cv2.COLORMAP_JET)

    overlay = cv2.addWeighted(original, 0.6, heatmap_color, 0.4, 0)

    saved_gradcam = await save_image_to_backend_uploads(
        image=cv2.cvtColor(overlay, cv2.COLOR_RGB2BGR),
        folder="gradcam",
        prefix="gradcam",
        extension="jpg",
    )

    forward_handle.remove()
    backward_handle.remove()

    return saved_gradcam["url"]




async def predict_with_yolo2(image_bytes: bytes):
    ensure_ai_output_dirs()

    model = get_model()

    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    image_width, image_height = image.size

    results = model(image)
    result = results[0]

    names = result.names
    boxes = result.boxes

    if boxes is None or len(boxes) == 0:
        return {
            "success": False,
            "message": "No leaves detected",
            "boxed_image_url": None,
            "regions": [],
        }

    boxed_image = image.copy()
    draw = ImageDraw.Draw(boxed_image)

    region_items = []
    crop_upload_tasks = []

    disease_counts = {}
    confidences = []
    severities = []

    severity_priority = {
        "Low": 1,
        "Medium": 2,
        "High": 3,
    }

    for index, box in enumerate(boxes):
        class_id = int(box.cls.item())
        yolo_confidence = float(box.conf.item()) * 100
        yolo_class_name = names[class_id]

        x1, y1, x2, y2 = box.xyxy[0].tolist()

        x1_int = max(0, int(x1))
        y1_int = max(0, int(y1))
        x2_int = min(image_width, int(x2))
        y2_int = min(image_height, int(y2))

        crop = image.crop((x1_int, y1_int, x2_int, y2_int))

        effecient_result = await predict_leaf_with_efficientnet(crop)

        resnet_disease = effecient_result.get("disease") or yolo_class_name
        resnet_confidence = effecient_result.get("confidence") or yolo_confidence
        resnet_severity = effecient_result.get("severity") or "Low"

        crop_upload_tasks.append(
            save_image_to_backend_uploads(
                image=crop,
                folder="crops",
                prefix=f"leaf_{index + 1}",
                extension="jpg",
            )
        )

        draw.rectangle(
            [(x1_int, y1_int), (x2_int, y2_int)],
            outline="lime",
            width=4,
        )

        draw.text(
            (x1_int, max(0, y1_int - 18)),
            f"{resnet_disease} {resnet_confidence:.1f}%",
            fill="lime",
        )

        x = (x1 / image_width) * 100
        y = (y1 / image_height) * 100
        width = ((x2 - x1) / image_width) * 100
        height = ((y2 - y1) / image_height) * 100

        region_items.append({
            "id": index + 1,
            "label": "leaf",
            "confidence": round(yolo_confidence, 2),

            "x": round(x, 2),
            "y": round(y, 2),
            "width": round(width, 2),
            "height": round(height, 2),

            "crop_url": None,
            "gradcam_url": effecient_result.get("gradcam_url"),

            "disease": resnet_disease,
            "severity": resnet_severity,
            "diagnosis_confidence": round(resnet_confidence, 2),
        })

        disease_counts[resnet_disease] = disease_counts.get(resnet_disease, 0) + 1
        confidences.append(resnet_confidence)
        severities.append(resnet_severity)

    boxed_upload_task = save_image_to_backend_uploads(
        image=boxed_image,
        folder="boxed",
        prefix="boxed",
        extension="jpg",
    )

    crop_results, saved_boxed = await asyncio.gather(
        asyncio.gather(*crop_upload_tasks),
        boxed_upload_task,
    )

    regions = []

    for region_item, saved_crop in zip(region_items, crop_results):
        region_item["crop_url"] = saved_crop["url"]
        regions.append(region_item)

    boxed_image_url = saved_boxed["url"]

    main_disease = max(disease_counts, key=disease_counts.get)

    average_confidence = (
        sum(confidences) / len(confidences)
        if confidences
        else 0
    )

    main_severity = (
        max(
            severities,
            key=lambda severity: severity_priority.get(severity, 1)
        )
        if severities
        else "Low"
    )

    return {
        "success": True,
        "message": "YOLO + ResNet prediction completed successfully",
        "boxed_image_url": boxed_image_url,
        "model_prediction": main_disease,
        "plant": "Tomato",
        "disease": main_disease,
        "confidence": round(average_confidence, 2),
        "severity": main_severity,
        "regions": regions,
    }
    
    
def estimate_severity_from_heatmap(heatmap):
    threshold = 0.6

    hot_pixels = np.sum(heatmap >= threshold)
    total_pixels = heatmap.size

    affected_area = (hot_pixels / total_pixels) * 100

    if affected_area < 2:
        severity = "Low"
    elif affected_area < 10:
        severity = "Medium"
    else:
        severity = "High"

    return severity, round(affected_area, 2)


async def generate_gradcam_efficientnet2(
    model,
    processed_image,
    original_image: Image.Image,
    class_index: int,
    last_conv_layer_name=None,
):
    model.eval()

    gradients = []
    activations = []

    target_layer = model.conv_head

    def forward_hook(module, input, output):
        activations.append(output)

    def backward_hook(module, grad_input, grad_output):
        gradients.append(grad_output[0])

    forward_handle = target_layer.register_forward_hook(forward_hook)
    backward_handle = target_layer.register_full_backward_hook(backward_hook)

    try:
        output = model(processed_image)

        model.zero_grad()

        loss = output[0, class_index]
        loss.backward()

        grads = gradients[0]
        acts = activations[0]

        pooled_grads = torch.mean(grads, dim=[0, 2, 3])

        for i in range(acts.shape[1]):
            acts[:, i, :, :] *= pooled_grads[i]

        heatmap = torch.mean(acts, dim=1).squeeze()
        heatmap = F.relu(heatmap)

        heatmap = heatmap.detach().cpu().numpy()

        if np.max(heatmap) != 0:
            heatmap = heatmap / np.max(heatmap)

        severity, affected_area = estimate_severity_from_heatmap(heatmap)

        original = np.array(original_image.convert("RGB"))
        original = cv2.resize(original, EFFICIENTNET_IMAGE_SIZE)

        heatmap_resized = cv2.resize(heatmap, EFFICIENTNET_IMAGE_SIZE)
        heatmap_uint8 = np.uint8(255 * heatmap_resized)

        heatmap_color = cv2.applyColorMap(heatmap_uint8, cv2.COLORMAP_JET)

        overlay = cv2.addWeighted(original, 0.6, heatmap_color, 0.4, 0)

        saved_gradcam = await save_image_to_backend_uploads(
            image=cv2.cvtColor(overlay, cv2.COLOR_RGB2BGR),
            folder="gradcam",
            prefix="gradcam",
            extension="jpg",
        )

        return {
            "gradcam_url": saved_gradcam["url"],
            "severity": severity,
            "affected_area": affected_area,
        }

    finally:
        forward_handle.remove()
        backward_handle.remove()
    
    
    
    
    
    
    
    
    
    
    
  