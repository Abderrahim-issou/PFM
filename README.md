# Plant Disease Detection and Analysis Platform

## Overview

This project is an AI-powered web platform designed to assist farmers, agricultural experts, and researchers in identifying plant diseases from leaf images.

The system combines modern web technologies, deep learning models, and explainable AI techniques to provide accurate disease diagnosis, visual explanations, and treatment recommendations.

The platform allows users to upload images of plant leaves or capture them directly using a webcam. The uploaded image is analyzed by a deep learning model, and the system returns:

* Disease prediction
* Confidence score
* Disease description
* Severity level
* Grad-CAM visualization highlighting infected regions

---

# Objectives

The primary objectives of this project are:

* Detect plant diseases automatically from leaf images.
* Provide understandable AI predictions.
* Help farmers make informed decisions.
* Reduce disease spread through early diagnosis.
* Demonstrate the practical application of Artificial Intelligence in agriculture.

---

# Main Features

## Disease Detection

The platform can identify multiple plant diseases from leaf images using a deep learning classification model.

### Supported Classes

* Tomato Bacterial Spot
* Tomato Early Blight
* Tomato Late Blight
* Tomato Leaf Mold
* Tomato Septoria Leaf Spot
* Tomato Spider Mites
* Tomato Target Spot
* Tomato Yellow Leaf Curl Virus
* Tomato Mosaic Virus
* Healthy Tomato Leaf

---

## Explainable AI (Grad-CAM)

To increase trust in the model's predictions, Grad-CAM is used to generate heatmaps that highlight the regions of the leaf that contributed most to the prediction.

Benefits:

* Model transparency
* Easier validation of predictions
* Better understanding of disease symptoms

---

## Disease Information

For each detected disease, the platform provides:

### Description

A detailed explanation of the disease and its symptoms.

### Severity

Disease impact level:

* Low
* Medium
* High

### Organic Treatments

Environmentally friendly treatment methods.

### Chemical Treatments

Recommended chemical products and treatments.

### Prevention Guidelines

Best practices to avoid future infections.

---

# System Architecture

## Frontend

### Technologies

* React
* TypeScript
* Tailwind CSS
* Shadcn UI
* Axios

### Responsibilities

* User interface
* Image upload
* Webcam capture
* Display predictions
* Display Grad-CAM results
* Display disease information

---

## Backend

### Technologies

* FastAPI
* Python
* Pydantic

### Responsibilities

* Receive uploaded images
* Validate requests
* Process images
* Execute AI inference
* Generate Grad-CAM visualizations
* Return prediction results

---

## AI Layer

### Deep Learning Model

Detection model:

* YOLO8vm

Current model:

* EfficientNet-B4

Previously used:

* ResNet50

### Responsibilities

* Image classification
* Confidence estimation
* Feature extraction

---

# Workflow

## Step 1: Image Acquisition

The user provides a tomato plant image using one of the following methods:

### Upload Image

The user uploads an image from their device.

### Webcam Capture

The user captures an image directly from the browser using the integrated camera interface.

---

## Step 2: Image Submission

The frontend sends the captured or uploaded image to the FastAPI backend through an API request.

The backend:

1. Receives the image.
2. Validates the request.
3. Stores the image temporarily for processing.
4. Initiates the AI inference pipeline.

---

## Step 3: Leaf Detection Using YOLO

The uploaded image is first processed by a YOLO-based object detection model.

### Responsibilities of YOLO

* Detect tomato leaves within the image.
* Locate leaves using bounding boxes.
* Ignore irrelevant background regions.
* Support images containing multiple leaves.
* Extract and crop each detected leaf individually.

### Output

The model returns:

* Bounding box coordinates.
* Cropped leaf images.

These cropped leaf images are then forwarded to the disease classification model.

---

## Step 4: Disease Classification Using EfficientNet-B4

Each cropped leaf image is preprocessed and passed to the EfficientNet-B4 classification model.

### Preprocessing

The system:

1. Converts the image to RGB.
2. Resizes the image to the model input size.
3. Applies normalization.
4. Converts the image into a tensor.

### Classification

EfficientNet-B4 analyzes the leaf and predicts one of the supported disease categories.

The model outputs:

* Raw logits
* Class probabilities

Softmax is applied to convert logits into probabilities.

The class with the highest probability is selected as the final prediction.

---

## Step 5: Confidence Calculation

The confidence score is computed from the highest softmax probability.

### Formula

Confidence = Maximum Softmax Probability × 100

### Example

* Prediction: Tomato Early Blight
* Confidence: 96.45%

---

## Step 6: Severity Assessment

After disease classification, the system determines the severity level associated with the predicted disease.

Severity levels include:

* Low
* Medium
* High

This information helps users understand the potential impact of the disease.

---

## Step 7: Grad-CAM Generation

To explain the prediction, the system generates a Grad-CAM visualization.

### Process

1. Perform a forward pass through EfficientNet-B4.
2. Capture feature maps from the final convolutional layer.
3. Compute gradients with respect to the predicted class.
4. Generate an activation heatmap.
5. Overlay the heatmap onto the original cropped leaf image.

### Result

The generated Grad-CAM highlights the regions of the leaf that most influenced the model's prediction.

---

## Step 8: Disease Information Retrieval

Based on the predicted disease class, the system retrieves additional information from the disease knowledge base.

Retrieved information includes:

* Disease name
* Description
* Severity level
* Organic treatment recommendations
* Chemical treatment recommendations
* Prevention guidelines

---

## Step 9: Result Generation

The backend aggregates all outputs into a single response.

The response includes:

* Disease prediction
* Confidence score
* Severity level
* Disease description
* Organic treatments
* Chemical treatments
* Prevention recommendations
* Grad-CAM image URL

---

## Step 10: Result Delivery

The backend returns the final response to the frontend.

The frontend displays:

* Original image
* Detected leaf
* Disease prediction
* Confidence score
* Severity level
* Disease information
* Grad-CAM visualization

This provides users with both an accurate diagnosis and a visual explanation of the model's decision-making process.


# Project Structure

```text
project-root/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── layouts/
│   │   └── assets/
│   │
│   └── package.json
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── services/
│   │   ├── models/
│   │   ├── utils/
│   │   └── schemas/
│   │
│   ├── uploads/
│   │   ├── predictions/
│   │   └── gradcam/
│   │
│   └── main.py
│
├── model-ai/
│   ├── trained_models/
│   │   ├── efficientnet_b4.pth
│   │   └── ...
│   │
│   ├── training/
│   ├── notebooks/
│   └── datasets/
│
├── docs/
│
├── README.md
│
└── requirements.txt
```

# AI Training Pipeline

## Dataset Sources

### PlantVillage

Provides:

* Clean images
* Controlled backgrounds
* High-quality labels

### Tomato leaf diseases

Provides:

* Real-world tomato leaf images collected under natural agricultural conditions.
* Images containing healthy and diseased tomato leaves.
* Diverse backgrounds, viewpoints, and environmental conditions.
* Variable lighting conditions including shadows and sunlight variations.
* Occluded and partially visible leaves.
* Multiple leaves appearing within a single image.
* Realistic field conditions that improve model generalization.

---

## Data Augmentation

The training pipeline includes:

### Geometric Augmentations

* Random Crop
* Horizontal Flip
* Vertical Flip
* Rotation

### Appearance Augmentations

* Brightness Adjustment
* Contrast Adjustment
* Color Jitter

### Robustness Augmentations

* Gaussian Noise
* Motion Blur
* JPEG Compression
* Shadows

---

## Training Strategy

### Phase 1

Feature Extraction

* Freeze backbone
* Train classification head

### Phase 2

Fine Tuning

* Unfreeze upper layers
* Train with lower learning rate

---

# Technologies Used

## Frontend

* React
* TypeScript
* Tailwind CSS
* Shadcn UI
* Axios

## Backend

* FastAPI
* Python
* Pydantic

## Deep Learning

* PyTorch
* TIMM
* EfficientNet-B4
* Grad-CAM

## Utilities

* OpenCV
* Pillow
* NumPy
* Scikit-Learn
* Albumentations

---

# Future Improvements

Potential future enhancements include:

* Multi-crop disease detection
* Disease segmentation
* Mobile application
* Real-time video diagnosis
* Multiple plant species support
* Disease severity estimation
* Farmer recommendation system
* Agricultural chatbot assistant

---

# Conclusion

This project demonstrates the integration of modern web technologies and deep learning to create an intelligent plant disease diagnosis platform. By combining EfficientNet-B4, Grad-CAM, and a user-friendly web interface, the system provides accurate, explainable, and actionable disease predictions that can assist farmers and agricultural professionals in disease management and crop protection.
