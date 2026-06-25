import os 
import timm
import torch
from ultralytics import YOLO


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
YOLO_MODEL_PATH = os.path.join(BASE_DIR, "..", "..", "trained_models", "best2.pt")
EFFICIENTNET_MODEL_PATH = os.path.join(BASE_DIR, "..", "..", "trained_models", "effecientnet.pth") 


_model = None
_efficientnet_model = None


def get_model():
    global _model
    
    if _model is None:
        
        _model = YOLO(YOLO_MODEL_PATH);
        
    return _model;


def get_efficientnet_model():
    global _efficientnet_model

    if _efficientnet_model is None:
        print("Loading EfficientNet-B4 model...")

        model = timm.create_model(
            "efficientnet_b4",
            pretrained=False,
            num_classes=10
        )

        checkpoint = torch.load(EFFICIENTNET_MODEL_PATH, map_location="cpu")

        if "model_state_dict" in checkpoint:
            model.load_state_dict(checkpoint["model_state_dict"])
        else:
            model.load_state_dict(checkpoint)

        model.eval()

        _efficientnet_model = model

        print("EfficientNet-B4 model loaded successfully.")

    return _efficientnet_model