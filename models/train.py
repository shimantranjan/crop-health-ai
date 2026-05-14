import torch
import torch.nn as nn
import torch.optim as optim
from torchvision import models
import time
import os

class CropDiseaseModel(nn.Module):
    def __init__(self, num_classes=15):
        super(CropDiseaseModel, self).__init__()
        # Use MobileNetV2 for real-time edge performance
        self.base_model = models.mobilenet_v2(weights=models.MobileNet_V2_Weights.IMAGENET1K_V1)
        
        # Replace classifier head mapping it to our target classes
        in_features = self.base_model.classifier[1].in_features
        self.base_model.classifier = nn.Sequential(
            nn.Dropout(p=0.2),
            nn.Linear(in_features, num_classes)
        )
        
    def forward(self, x):
        return self.base_model(x)

def train_model(data_loaders, dataset_sizes, num_epochs=25):
    """
    Standard training pipeline function.
    """
    device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")
    model = CropDiseaseModel(num_classes=15).to(device)
    
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=0.001)
    scheduler = optim.lr_scheduler.StepLR(optimizer, step_size=7, gamma=0.1)

    print(f"Starting training on device: {device}")
    
    best_acc = 0.0
    
    for epoch in range(num_epochs):
        print(f'Epoch {epoch}/{num_epochs - 1}')
        print('-' * 10)

        for phase in ['train', 'val']:
            if phase == 'train':
                model.train()
            else:
                model.eval()

            running_loss = 0.0
            running_corrects = 0

            # Iterate over data.
            # for inputs, labels in data_loaders[phase]:
            #     inputs = inputs.to(device)
            #     labels = labels.to(device)
            #
            #     optimizer.zero_grad()
            #
            #     with torch.set_grad_enabled(phase == 'train'):
            #         outputs = model(inputs)
            #         _, preds = torch.max(outputs, 1)
            #         loss = criterion(outputs, labels)
            #
            #         if phase == 'train':
            #             loss.backward()
            #             optimizer.step()
            #
            #     running_loss += loss.item() * inputs.size(0)
            #     running_corrects += torch.sum(preds == labels.data)
            
            if phase == 'train':
                scheduler.step()

            # epoch_loss = running_loss / dataset_sizes[phase]
            # epoch_acc = running_corrects.double() / dataset_sizes[phase]
            
            # print(f'{phase} Loss: {epoch_loss:.4f} Acc: {epoch_acc:.4f}')

    return model

def export_to_onnx(model, save_path="crop_model.onnx"):
    """
    Exports model to ONNX for fast inference in production.
    """
    model.eval()
    dummy_input = torch.randn(1, 3, 224, 224)
    torch.onnx.export(
        model, 
        dummy_input, 
        save_path, 
        export_params=True,
        opset_version=11,
        do_constant_folding=True,
        input_names=['input'],
        output_names=['output'],
        dynamic_axes={'input': {0: 'batch_size'}, 'output': {0: 'batch_size'}}
    )
    print(f"Model exported to {save_path}")

if __name__ == '__main__':
    # Pseudo-code execution path
    print("Initialize data loading, training process, and ONNX export.")
    # data_loaders, dataset_sizes = get_dataloaders()
    # model = train_model(data_loaders, dataset_sizes)
    # export_to_onnx(model, "models/crop_health_v1.onnx")
