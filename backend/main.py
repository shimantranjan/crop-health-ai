import os
import io
import uuid
import asyncio
import edge_tts
import torch

from PIL import Image
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from torchvision import transforms, models

# =========================================================
# FASTAPI APP
# =========================================================

app = FastAPI()

# =========================================================
# CORS
# =========================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================================================
# AUDIO DIRECTORY
# =========================================================

os.makedirs("audio", exist_ok=True)

app.mount("/audio", StaticFiles(directory="audio"), name="audio")

# =========================================================
# DEVICE
# =========================================================

device = torch.device(
    "mps" if torch.backends.mps.is_available() else "cpu"
)

print(f"Using device: {device}")

# =========================================================
# LOAD CLASS NAMES
# =========================================================

with open("classes.txt", "r") as f:
    CLASS_NAMES = [line.strip() for line in f.readlines()]

NUM_CLASSES = len(CLASS_NAMES)

print(f"Loaded {NUM_CLASSES} classes")

# =========================================================
# LOAD TRAINED MODEL
# =========================================================

model = models.mobilenet_v2(weights=None)

model.classifier[1] = torch.nn.Linear(
    model.last_channel,
    NUM_CLASSES
)

model.load_state_dict(
    torch.load(
        "model.pth",
        map_location=device
    )
)

model.to(device)

model.eval()

print("✅ Model loaded successfully")

# =========================================================
# IMAGE TRANSFORMS
# =========================================================

transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
])

# =========================================================
# IMAGE PREDICTION
# =========================================================

def predict_image(image_bytes):

    image = Image.open(
        io.BytesIO(image_bytes)
    ).convert("RGB")

    image = transform(image).unsqueeze(0)

    image = image.to(device)

    with torch.no_grad():

        outputs = model(image)

        probabilities = torch.nn.functional.softmax(
            outputs[0],
            dim=0
        )

        confidence, predicted = torch.max(
            probabilities,
            0
        )

    disease = CLASS_NAMES[predicted.item()]

    confidence_score = round(
        confidence.item() * 100,
        2
    )

    severity = min(
        100,
        round((100 - confidence_score) + 25)
    )

    return {
        "disease": disease,
        "confidence": confidence_score,
        "severity": severity
    }

# =========================================================
# EXPLANATION GENERATOR
# =========================================================

def generate_explanation(disease, confidence, severity):

    return f"""
Disease detected: {disease}

Confidence Level: {confidence}%.

Severity Level: {severity}%.

Recommended Actions:

1. Remove infected leaves immediately.

2. Avoid overwatering.

3. Use disease-resistant seeds.

4. Apply suitable fungicides or pesticides.

5. Improve airflow around crops.

6. Monitor nearby plants regularly.

Early detection can significantly reduce crop loss.
"""

# =========================================================
# HD VOICE GENERATION
# =========================================================

async def generate_voice(text):

    filename = f"{uuid.uuid4().hex}.mp3"

    output_path = f"audio/{filename}"

    communicate = edge_tts.Communicate(
        text=text,
        voice="en-US-GuyNeural"
    )

    await communicate.save(output_path)

    return f"http://127.0.0.1:8001/audio/{filename}"

# =========================================================
# ROOT API
# =========================================================

@app.get("/")
async def root():

    return {
        "message": "Crop Health AI Backend Running"
    }

# =========================================================
# UPDATED PREDICT API
# =========================================================

@app.post("/predict")
async def predict(file: UploadFile = File(...)):

    try:

        image_bytes = await file.read()

        # AI Prediction
        result = predict_image(image_bytes)

        # Generate Explanation
        explanation = generate_explanation(
            result["disease"],
            result["confidence"],
            result["severity"]
        )

        # Generate HD Voice
        audio_url = await generate_voice(explanation)

        return {
            "disease": result["disease"],
            "confidence": result["confidence"],
            "severity": result["severity"],
            "explanation": explanation,
            "audio_url": audio_url
        }

    except Exception as e:

        print("Prediction Error:", str(e))

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

# =========================================================
# STARTUP EVENT
# =========================================================

@app.on_event("startup")
async def startup_event():

    print("🚀 Crop Health AI Backend Started")