import os
import torch
import torchvision
from torchvision import transforms, datasets, models
from torch import nn, optim
from torch.utils.data import DataLoader

# Device
device = torch.device("mps" if torch.backends.mps.is_available() else "cpu")

# Dataset path
DATASET_PATH = "../data"

# Image transforms
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.RandomHorizontalFlip(),
    transforms.RandomRotation(10),
    transforms.ToTensor(),
])

# Load dataset
dataset = datasets.ImageFolder(DATASET_PATH, transform=transform)

# Classes
class_names = dataset.classes
num_classes = len(class_names)

print("Classes:", class_names)

# Split dataset
train_size = int(0.8 * len(dataset))
val_size = len(dataset) - train_size

train_dataset, val_dataset = torch.utils.data.random_split(
    dataset,
    [train_size, val_size]
)

train_loader = DataLoader(train_dataset, batch_size=32, shuffle=True)
val_loader = DataLoader(val_dataset, batch_size=32)

# Load pretrained model
model = models.mobilenet_v2(pretrained=True)

# Replace classifier
model.classifier[1] = nn.Linear(model.last_channel, num_classes)

model = model.to(device)

# Loss & optimizer
criterion = nn.CrossEntropyLoss()
optimizer = optim.Adam(model.parameters(), lr=0.001)

EPOCHS = 5

for epoch in range(EPOCHS):

    model.train()

    running_loss = 0.0
    correct = 0
    total = 0

    for images, labels in train_loader:

        images = images.to(device)
        labels = labels.to(device)

        optimizer.zero_grad()

        outputs = model(images)

        loss = criterion(outputs, labels)

        loss.backward()

        optimizer.step()

        running_loss += loss.item()

        _, predicted = outputs.max(1)

        total += labels.size(0)

        correct += predicted.eq(labels).sum().item()

    accuracy = 100 * correct / total

    print(f"Epoch {epoch+1}/{EPOCHS}")
    print(f"Loss: {running_loss:.4f}")
    print(f"Accuracy: {accuracy:.2f}%")

# Save model
torch.save(model.state_dict(), "model.pth")

# Save class names
with open("classes.txt", "w") as f:
    for item in class_names:
        f.write(f"{item}\n")

print("✅ Training complete")
print("✅ model.pth saved")
print("✅ classes.txt saved")