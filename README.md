# 🌿 Crop Health AI

<div align="center">

![Python](https://img.shields.io/badge/Python-3.10+-blue?style=for-the-badge\&logo=python)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge\&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge\&logo=typescript)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge\&logo=fastapi)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge\&logo=tailwindcss)
![PyTorch](https://img.shields.io/badge/PyTorch-EE4C2C?style=for-the-badge\&logo=pytorch)
![PWA](https://img.shields.io/badge/PWA-Enabled-success?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

### AI-Powered Real-Time Crop Disease Detection & Smart Agricultural Diagnostics Platform

An advanced full-stack computer vision system designed for intelligent plant pathology analysis using deep learning, real-time inference pipelines, live camera diagnostics, and modern AI-assisted agricultural monitoring.

</div>

---

# 📌 Overview

Crop Health AI is a production-grade agricultural intelligence platform engineered to detect and classify crop diseases using convolutional neural networks and real-time computer vision.

The platform combines:

* Deep Learning-based disease classification
* Real-time camera diagnostics
* Intelligent pathology reporting
* Voice-assisted AI narration
* Modern React analytics dashboard
* FastAPI inference engine
* Tailwind-powered premium UI/UX
* Progressive Web App (PWA) architecture

The system is optimized for:

* Farmers
* Agricultural researchers
* Precision farming solutions
* Plant pathology labs
* Smart greenhouse systems
* AI-driven crop monitoring ecosystems

---

# 🚀 Key Features

## 🧠 AI Disease Detection

* CNN-powered crop disease classification
* Real-time inference engine
* Confidence score analysis
* Smart pathology interpretation
* Dynamic disease reporting
* Multi-class prediction support

---

## 📷 Live Camera Detection

* Browser-based live camera streaming
* Real-time frame capture
* AI inference from live video feed
* Smart detection stabilization
* Continuous pathology monitoring
* Instant disease reporting

---

## 🎙️ AI Voice Narration

* Speech synthesis integration
* Disease explanation narration
* Confidence reporting through voice
* Natural browser voice support
* AI pathology verbal summaries

---

## 📊 Modern Analytics Dashboard

* Responsive premium dashboard
* Real-time scan metrics
* Detection history visualization
* System telemetry monitoring
* AI operational status tracking
* Dynamic pathology panels

---

## 🎨 Advanced UI / UX

* TailwindCSS-based modern interface
* Premium dark glassmorphism design
* Framer-motion inspired interactions
* Responsive mobile-first layout
* Compact enterprise dashboard styling
* Smooth transitions & animations

---

## ⚡ FastAPI Backend

* High-performance inference APIs
* Async request handling
* Image upload endpoints
* Voice response support
* Efficient model loading pipeline
* Optimized for low-latency inference

---

## 📱 Progressive Web App (PWA)

* Installable application support
* Offline-ready frontend architecture
* Mobile optimized
* Lightweight deployment model
* Enhanced browser compatibility

---

# 🏗️ System Architecture

```text
┌──────────────────────────────────────────────┐
│                 Frontend UI                 │
│        React + TypeScript + Tailwind        │
└──────────────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────┐
│             Live Detection Layer            │
│     Camera Stream + Frame Capture Engine    │
└──────────────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────┐
│               FastAPI Backend               │
│        Prediction APIs + Voice Engine       │
└──────────────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────┐
│              Deep Learning Model            │
│        PyTorch CNN Classification Core      │
└──────────────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────┐
│             Disease Intelligence            │
│   Symptoms • Causes • Treatment • Reports   │
└──────────────────────────────────────────────┘
```

---

# 🧰 Tech Stack

| Layer            | Technology          |
| ---------------- | ------------------- |
| Frontend         | React + TypeScript  |
| Styling          | TailwindCSS         |
| Backend          | FastAPI             |
| ML Framework     | PyTorch             |
| Language         | Python              |
| Build Tool       | Vite                |
| State Handling   | React Hooks         |
| Voice Engine     | SpeechSynthesis API |
| Camera Access    | MediaDevices API    |
| Deployment Ready | PWA                 |
| Package Manager  | npm                 |

---

# 📂 Project Structure

```bash
crop-health-ai-pro/
│
├── backend/
│   ├── api/
│   ├── audio/
│   ├── core/
│   ├── models/
│   ├── routes/
│   ├── main.py
│   ├── brain.py
│   ├── train.py
│   ├── model.pth
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── LiveDetection.tsx
│   │   │   ├── ImageUpload.tsx
│   │   │   ├── Navbar.tsx
│   │   │   └── StatsCard.tsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Analytics.tsx
│   │   │   └── Home.tsx
│   │   │
│   │   ├── services/
│   │   ├── config/
│   │   ├── data/
│   │   ├── utils/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   │
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
│
├── data/
├── models/
├── mobile/
└── README.md
```

---

# ⚙️ Installation Guide

# 1️⃣ Clone Repository

```bash
git clone https://github.com/shimantranjan/crop-health-ai.git
```

```bash
cd crop-health-ai
```

---

# 2️⃣ Backend Setup

```bash
cd backend
```

## Create Virtual Environment

### macOS / Linux

```bash
python3 -m venv venv
source venv/bin/activate
```

### Windows

```bash
python -m venv venv
venv\Scripts\activate
```

---

## Install Dependencies

```bash
pip install -r requirements.txt
```

---

## Run Backend

```bash
uvicorn main:app --reload --port 8001
```

Backend runs at:

```text
http://127.0.0.1:8001
```

---

# 3️⃣ Frontend Setup

Open a new terminal.

```bash
cd frontend
```

## Install Dependencies

```bash
npm install
```

---

## Run Frontend

```bash
npm run dev
```

Frontend runs at:

```text
http://localhost:5173
```

---

# 🧪 Build Production Version

## Frontend Build

```bash
npm run build
```

---

## Preview Production Build

```bash
npm run preview
```

---

# 🧠 AI Model Pipeline

The deep learning inference pipeline performs:

1. Image preprocessing
2. Frame normalization
3. CNN-based feature extraction
4. Disease probability estimation
5. Confidence scoring
6. Smart pathology interpretation
7. Voice narration generation
8. UI telemetry synchronization

---

# 📸 Live Camera Workflow

The live inference engine uses:

```text
navigator.mediaDevices.getUserMedia()
```

for:

* Real-time camera access
* Browser stream management
* Dynamic frame extraction
* AI-based periodic scanning
* Continuous pathology monitoring

---

# 🔊 Voice Intelligence Engine

The platform integrates browser-native speech synthesis:

```text
window.speechSynthesis
```

Features include:

* AI disease narration
* Confidence verbalization
* Human-readable pathology summaries
* Smart voice selection

---

# 📈 Future Enhancements

* Multilingual AI narration
* Cloud inference scaling
* TensorRT optimization
* Edge AI deployment
* Mobile-native Flutter application
* IoT greenhouse integration
* Drone-assisted crop monitoring
* Real-time agricultural analytics
* LLM-assisted crop advisory
* Weather-integrated disease prediction

---

# 🔒 Security & Performance

* Async FastAPI architecture
* Efficient model loading
* Optimized inference handling
* Frontend code splitting
* Lightweight PWA build
* Cached inference assets
* Reduced latency inference pipeline

---

# 🧑‍💻 Development Notes

The project was architected with a focus on:

* Production-ready modularity
* Scalable frontend architecture
* Real-time inference stability
* Enterprise dashboard aesthetics
* Maintainable TypeScript structure
* AI-first agricultural workflows

---

# 🤝 Contribution

Contributions are welcome.

## Steps

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push branch
5. Open Pull Request

---

# 📄 License

This project is licensed under the MIT License.

---

# 👨‍💻 Author

## Shimant Ranjan

AI/ML Developer • Full Stack Developer • Computer Vision Enthusiast

Focused on building intelligent systems combining:

* Artificial Intelligence
* Deep Learning
* Computer Vision
* Real-Time Systems
* Modern Frontend Engineering
* Agricultural Technology

---

# ⭐ Support

If you found this project valuable:

* Star the repository
* Share with developers
* Contribute improvements
* Fork the project

---

<div align="center">

## 🌱 Building Smarter Agriculture with Artificial Intelligence

</div>
