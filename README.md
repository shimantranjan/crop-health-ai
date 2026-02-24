 🌿 Crop Health AI - Disease Detection System

An AI-powered system that detects crop diseases from leaf images using a Convolutional Neural Network (CNN).

---

## 📌 Overview

Crop diseases can significantly impact agricultural productivity.  
This project uses Deep Learning to automatically identify plant diseases from images, helping farmers take timely action.

---

## 🧠 Features

- 📸 Image-based disease detection
- 🤖 CNN model trained on plant dataset
- ⚡ Fast prediction system
- 🌱 Supports multiple crops:
  - Tomato
  - Potato
  - Pepper Bell
- 📊 Accurate classification of diseases

---

## 🏗️ Project Structure


crop-health-ai/
│
├── app/ # Main application
│ └── app.py
│
├── models/ # Model & training code
│ ├── cnn_model.py
│ ├── train_model.py
│
├── inference/ # Prediction scripts
│ └── predict.py
│
├── recommendations/ # Disease info
│ └── disease_info.json
│
├── data/ # Dataset (not uploaded)
├── requirements.txt
└── README.md


---

## ⚙️ Installation

### 1. Clone the repository
```bash
git clone https://github.com/shimantranjan/crop-health-ai.git
cd crop-health-ai
2. Create virtual environment
python -m venv venv
source venv/bin/activate   # Mac/Linux
3. Install dependencies
pip install -r requirements.txt
📥 Model Download

⚠️ Model file is not included due to GitHub size limits.

👉 Download from here:

PASTE YOUR GOOGLE DRIVE LINK HERE

Place the file inside:

models/plant_disease_model.h5
▶️ How to Run
python app/app.py

Then enter image path like:

data/raw/Tomato_healthy/sample.jpg
📊 Sample Output
Predicted Disease: Tomato_healthy
🧪 Dataset

Based on PlantVillage dataset

Organized into class folders

Preprocessed to 224x224 images

🛠️ Tech Stack

Python

TensorFlow / Keras

NumPy

CNN (Deep Learning)

🚀 Future Improvements

🌐 Web App (React + Flask)

📱 Mobile App

☁️ Cloud Deployment

🧠 More crop support

👨‍💻 Author

Shimant Ranjan

GitHub: https://github.com/shimantranjan

🏆 Hackathon Ready

This project demonstrates:

Real-world problem solving

AI integration

End-to-end ML pipeline

⭐ Support

If you like this project:

⭐ Star the repo

🍴 Fork it

🚀 Share it
