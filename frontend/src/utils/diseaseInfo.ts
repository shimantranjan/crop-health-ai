export interface DiseaseInfo {
    description: string;
    causes: string[];
    symptoms: string[];
    treatment: string[];
    prevention: string[];
}

export const diseaseInfoFallback: Record<string, DiseaseInfo> = {
    "Late Blight": {
        description: "Late blight is a highly destructive disease of potatoes and tomatoes. It spreads rapidly through airborne spores and can wipe out entire crops within days under cool, wet conditions.",
        causes: [
            "Pathogen: Phytophthora infestans (a fungus-like organism)",
            "High humidity and cool to moderate temperatures (50–70°F)"
        ],
        symptoms: [
            "Large, irregularly shaped, dark, water-soaked spots on leaves",
            "White mold ring on the underside of leaves",
            "Dark brown lesions on stems",
            "Firm, dark, greasy-looking spots on fruit"
        ],
        treatment: [
            "Apply protective fungicides containing chlorothalonil or copper",
            "Remove and destroy infected plant parts immediately",
            "Do not compost infected material"
        ],
        prevention: [
            "Plant resistant varieties",
            "Ensure proper spacing for good air circulation",
            "Water at the base to keep leaves dry",
            "Rotate crops every 2-3 years"
        ]
    },
    "Apple Scab": {
        description: "Apple scab is a widespread fungal disease that affects both the foliage and fruit of apple trees. It primarily occurs in areas with cool, wet springs.",
        causes: [
            "Pathogen: Venturia inaequalis (fungus)",
            "Overwintering infected leaves on the ground",
            "Prolonged spring rains"
        ],
        symptoms: [
            "Olive-green to black velvety spots on leaves",
            "Leaves turning yellow and dropping prematurely",
            "Scabby, cracked, and deformed fruit spots"
        ],
        treatment: [
            "Apply captan, myclobutanil, or sulfur fungicides",
            "Prune affected branches to limit spread"
        ],
        prevention: [
            "Plant scab-resistant apple varieties",
            "Rake up and destroy all fallen leaves in autumn",
            "Prune trees to open the canopy for better airflow"
        ]
    },
    "Tomato Early Blight": {
        description: "Tomato Early Blight is a very common tomato disease caused by fungus. It can affect leaves, stems, and fruit, reducing yield and vitality.",
        causes: [
            "Pathogen: Alternaria solani",
            "Warm temperatures and high humidity",
            "Fungus splashing from soil onto lower leaves"
        ],
        symptoms: [
            "Dark spots on lower older leaves with concentric rings (target-like)",
            "Yellowing tissue around the spots",
            "Sunken, dark lesions near the stem on fruit"
        ],
        treatment: [
            "Prune infected lower leaves",
            "Apply copper-based fungicide",
            "Remove heavily infected plants"
        ],
        prevention: [
            "Use mulch to prevent soil splashing onto leaves",
            "Water via drip irrigation, void overhead watering",
            "Stake or cage plants to keep foliage off the ground"
        ]
    }
};

export const getFallbackInfo = (diseaseClass: string): DiseaseInfo => {
    // Strip "Mock: " prefix if present
    const cleanKey = diseaseClass.replace("Mock: ", "");

    if (diseaseInfoFallback[cleanKey]) {
        return diseaseInfoFallback[cleanKey];
    }

    // Generic fallback if not matched
    return {
        description: `Information regarding ${cleanKey} is being processed. This is a generic plant affliction.`,
        causes: ["Environmental stress", "Fungal/Bacterial pathogens"],
        symptoms: ["Leaf discoloration", "Abnormal growth or spots"],
        treatment: ["Consult local agricultural extension", "Basic fungicidal application"],
        prevention: ["Maintain proper crop rotation", "Ensure adequate drainage and airflow"]
    };
};
