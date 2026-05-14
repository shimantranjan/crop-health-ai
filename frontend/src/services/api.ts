import { API_BASE } from "../config/api";

import {
    PredictionResponse,
} from "../types";

export async function predictImage(
    file: File | Blob,
    lang: string = "en",
    filename: string = "image.jpg"
): Promise<PredictionResponse> {

    const formData = new FormData();

    formData.append("file", file, filename);

    formData.append("lang", lang);

    const response = await fetch(
        `${API_BASE}/predict`,
        {
            method: "POST",
            body: formData,
        }
    );

    if (!response.ok) {
        throw new Error(
            `Prediction API failed with status ${response.status}`
        );
    }

    return response.json();
}