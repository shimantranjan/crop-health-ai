export interface DiseaseInfo {
    name: string;
    description: string;
    symptoms: string[];
    precautions: string[];
    treatment: string;
}

export const formatDiseaseName = (rawName: string) => {
    return rawName.replace(/___/g, ' - ').replace(/_/g, ' ');
};

export const generateDefaultInfo = (rawName: string): DiseaseInfo => {
    const formattedName = formatDiseaseName(rawName);
    const isHealthy = rawName.toLowerCase().includes('healthy');

    if (isHealthy) {
        return {
            name: "Healthy Crop",
            description: `The crop appears healthy with no major disease symptoms detected.`,
            symptoms: [
                'Fresh green leaves',
                'Balanced growth',
                'No visible spots',
                'Strong stem structure',
            ],
            precautions: [
                'Maintain balanced irrigation',
                'Continue nutrient management',
                'Monitor pests regularly',
                'Ensure proper sunlight exposure',
            ],
            treatment: 'No treatment required. Continue healthy farming practices.',
        };
    }

    return {
        name: formattedName,
        description: `${formattedName} is a condition affecting the crop, potentially leading to reduced yield and plant decay if left untreated.`,
        symptoms: [
            'Abnormal leaf spots or yellowing',
            'Stunted growth',
            'Wilting or curling of leaves',
            'Fungal or pathogenic marks'
        ],
        precautions: [
            'Remove infected plant parts immediately',
            'Avoid overhead watering to stop spread',
            'Improve air circulation around plants',
            'Sanitize tools used on the plant'
        ],
        treatment: 'Apply an appropriate targeted fungicide or pesticide. Monitor regularly.'
    };
};

export const diseaseDatabase: Record<string, DiseaseInfo> = {
    'Tomato___Late_blight': {
        name: 'Tomato Late Blight',
        description: 'Late blight is a potentially devastating disease of tomato and potato, caused by the fungus-like organism Phytophthora infestans.',
        symptoms: [
            'Large, dark brown blotches on leaves',
            'White fungal growth on the undersides of leaves',
            'Dark brown, firm lesions on stems',
            'Rapid rotting of fruit'
        ],
        precautions: [
            'Space plants adequately for airflow',
            'Avoid watering late in the day',
            'Destroy infected plants entirely',
            'Use disease-resistant varieties'
        ],
        treatment: 'Apply copper-based fungicides or mancozeb preventatively. Destroy severely infected plants.'
    },
    'Potato___Early_blight': {
        name: 'Potato Early Blight',
        description: 'Early blight is a fungal disease caused by Alternaria solani, producing bullseye-like spots on leaves.',
        symptoms: [
            'Concentric ring patterns on older leaves',
            'Yellowing tissue around the spots',
            'Defoliation of lower leaves',
            'Dark, sunken lesions on tubers'
        ],
        precautions: [
            'Rotate crops away from nightshades',
            'Remove plant debris post-harvest',
            'Ensure adequate fertilization',
            'Use drip irrigation instead of sprinklers'
        ],
        treatment: 'Apply broad-spectrum fungicides like chlorothalonil at the first sign of symptoms.'
    }
};

export const getDiseaseInfo = (rawName: string): DiseaseInfo => {
    if (diseaseDatabase[rawName]) return diseaseDatabase[rawName];
    return generateDefaultInfo(rawName);
};
