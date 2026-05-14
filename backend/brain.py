import torch
from torchvision import transforms, models
from PIL import Image
import io

class CropHealthBrain:

    def __init__(self):

        self.device = torch.device(
            "mps" if torch.backends.mps.is_available() else "cpu"
        )

        # Load class names
        with open("classes.txt", "r") as f:
            self.class_names = [line.strip() for line in f.readlines()]

        self.num_classes = len(self.class_names)

        # Load model
        self.model = models.mobilenet_v2(pretrained=False)

        self.model.classifier[1] = torch.nn.Linear(
            self.model.last_channel,
            self.num_classes
        )

        self.model.load_state_dict(
            torch.load("model.pth", map_location=self.device)
        )

        self.model.to(self.device)

        self.model.eval()

        # Image transform
        self.transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
        ])

    def predict(self, image_bytes):

        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")

        image = self.transform(image).unsqueeze(0)

        image = image.to(self.device)

        with torch.no_grad():

            outputs = self.model(image)

            probabilities = torch.nn.functional.softmax(outputs[0], dim=0)

            confidence, predicted = torch.max(probabilities, 0)

        disease = self.class_names[predicted.item()]

        confidence_score = round(confidence.item() * 100, 2)

        severity = min(
            100,
            round((100 - confidence_score) + 25)
        )

        return {
            "disease": disease,
            "confidence": confidence_score,
            "severity": severity
        }