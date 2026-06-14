import os 
import timm
import torch
import torch.nn as nn
from ultralytics import YOLO
from torchvision import models


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
YOLO_MODEL_PATH = os.path.join(BASE_DIR, "..", "..", "trained_models", "best2.pt")
RAISNET_MODEL_PATH = os.path.join(BASE_DIR, "..", "..", "trained_models", "raisnet.pth")
EFFICIENTNET_MODEL_PATH = os.path.join(BASE_DIR, "..", "..", "trained_models", "effecientnet.pth") 


_model = None
_resnet_model = None
_efficientnet_model = None



def get_resnet_model():
    global _resnet_model

    if _resnet_model is None:
        print("Loading ResNet50 model...")

        model = models.resnet50(weights=None)
        model.fc = nn.Linear(model.fc.in_features, 10)

        checkpoint = torch.load(RAISNET_MODEL_PATH, map_location="cpu")

        model.load_state_dict(checkpoint["model_state_dict"])

        model.eval()

        _resnet_model = model

        print("ResNet50 model loaded successfully.")

    return _resnet_model


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