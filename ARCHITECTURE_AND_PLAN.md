# Crop Health AI System Architecture & Build Plan

## 1. Full Architecture Explanation

### High-Level Flow
`Camera (Web/Mobile) -> API Gateway (FastAPI) -> AI Model (PyTorch/ONNX) -> Prediction Engine -> API Response (JSON) -> UI Visualization`

### Components
1. **Frontend (React/Next.js)**: Handles web-based user interaction. Uses WebRTC or standard HTML5 Canvas/Video streams to capture frames and upload them per a controlled FPS (e.g., 2-5 FPS for reasonable latency without overwhelming the backend) to the REST API for inference.
2. **Mobile (Flutter/React Native)**: Native camera interfaces. Uses CameraX (Android)/AVFoundation (iOS) for smooth real-time scanning. Capable of communicating with the REST API.
3. **Backend API (FastAPI)**: A scalable asynchronous Python backend. Features robust input validation, rate limiting, and fast parallel processing of image arrays.
4. **AI/ML Engine**: Powered initially by PyTorch, deployed in ONNX format for extreme low-latency inference. Models like MobileNetV2 (optimized for Edge/Mobile) or EfficientNet-B0 are used to classify disease and estimate severity. Additional NLP or rule-based expert systems for treatments and fertilizers.

---

## 2. Step-by-Step Build Plan

- **Phase 1: Foundation (Current)**
  - Scaffold project architecture and standard folder layout.
  - Setup core Backend (FastAPI setup, basic `/health` & `/predict` scaffolds).
  - Setup core ML pipeline scripts (training, data loading, basic ResNet/MobileNet scaffolding).

- **Phase 2: ML Model Training & Export**
  - Download PlantVillage dataset.
  - Implement dynamic augmentation.
  - Train MobileNetV2 / EfficientNet model.
  - Add logic for Grad-CAM (explainability) and Severity estimation.
  - Export trained model to ONNX format.

- **Phase 3: Backend API Integration**
  - Load ONNX model into FastAPI using `onnxruntime`.
  - Wire up `/predict` for classification.
  - Add treatment suggestion engine based on predictions.

- **Phase 4: Frontend Development**
  - Next.js application scaffolding (`npx create-next-app`).
  - Implement React WebCam / Video feed component.
  - Render bounding boxes or grad-cam heatmaps dynamically.

- **Phase 5: Mobile App Development**
  - Scaffold Flutter application.
  - Connect Camera plugin and hook up API calls.

- **Phase 6: Deployment & Optimization**
  - Dockerize backend and AI engine.
  - Deploy backend to Render/AWS.
  - Deploy frontend to Vercel.

---

## 3. System Architecture & Modular Design
- `backend/`: FastAPI source code (Routes, Pydantic schemas, Dependency Injection).
- `models/`: PyTorch definitions, training loops, evaluation metrics.
- `frontend/`: Next.js Web UI.
- `mobile/`: Flutter App.
- `data/`: Datasets.
- `notebooks/`: Jupyter Notebooks for experimentation.

---

## 4. Deployment Strategy
- **Backend & Model**: Docker image hosted on AWS ECR, run on ECS or an EC2 instance with GPU (or robust CPU compute for ONNX). Load balanced for scaling. Render setup is good for MVP.
- **Frontend**: Deployed seamlessly using Vercel.
- **Mobile**: CI/CD via Fastlane to TestFlight / Google Play beta.

---

## 5. Optimization Tips
- **Quantization**: Post-training quantization of the model (FP16 or INT8) to make real-time scanning feasible.
- **Batched Inference**: Send frames in small batches from high-throughput clients, process efficiently via ONNX Runtime.
- **Caching**: Cache model predictions for identical frames (using perceptual hashes if required).

---

## 6. Future Improvements
- **Edge Deployment**: Converting model to TFLite and embedding it directly into the mobile application (Offline Mode).
- **Geo-Tagging Dashboard**: Display real-time map of crop outbreaks happening globally.
- **LLM Agent**: Simple natural language prompt inside the UI to let farmers ask deeper questions about their crop conditions.
