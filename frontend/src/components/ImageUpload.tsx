import React, { useState, useRef } from "react";
import { PredictionResponse } from "../types";
import { predictImage } from "../services/api";

interface ImageUploadProps {
    onPrediction: (data: PredictionResponse) => void;
    lang: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onPrediction, lang }) => {
    const [preview, setPreview] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [errorStatus, setErrorStatus] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);
        setErrorStatus(null);
        setIsProcessing(true);

        try {
            const data = await predictImage(file, lang);
            onPrediction(data);
        } catch (err: unknown) {
            setErrorStatus(err instanceof Error ? err.message : "Failed to analyze image payload.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div style={styles.container}>
            {!preview ? (
                <div
                    style={styles.uploadArea}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <div style={styles.uploadIcon}>📁</div>
                    <h3 style={styles.uploadTitle}>Drag & Drop or Click to Upload</h3>
                    <p style={styles.uploadDesc}>High-res JPG, PNG, WEBP</p>
                </div>
            ) : (
                <div style={styles.previewContainer}>
                    <img src={preview} alt="Crop preview" style={styles.previewImage} />

                    <button
                        style={styles.resetBtn}
                        onClick={() => {
                            setPreview(null);
                            if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                    >
                        ✕ Reset
                    </button>

                    {isProcessing && (
                        <div style={styles.overlay}>
                            <div style={styles.spinner}></div>
                            <p>Analyzing morphology...</p>
                        </div>
                    )}

                    {errorStatus && (
                        <div style={{ ...styles.overlay, backgroundColor: "rgba(255,0,0,0.8)" }}>
                            <p>{errorStatus}</p>
                        </div>
                    )}
                </div>
            )}

            <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: "none" }}
            />
        </div>
    );
};

export default ImageUpload;

const styles: Record<string, React.CSSProperties> = {
    container: {
        width: "100%",
        maxWidth: "600px",
        display: "flex",
        flexDirection: "column",
        alignSelf: "center",
    },
    uploadArea: {
        border: "2px dashed rgba(255,255,255,0.2)",
        borderRadius: "24px",
        padding: "64px 32px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(24, 24, 27, 0.4)",
        cursor: "pointer",
        transition: "all 0.2s ease",
    },
    uploadIcon: {
        fontSize: "48px",
        marginBottom: "16px",
    },
    uploadTitle: {
        margin: "0 0 8px 0",
        fontSize: "20px",
        color: "#fff",
    },
    uploadDesc: {
        margin: 0,
        fontSize: "14px",
        color: "#a1a1aa",
    },
    previewContainer: {
        position: "relative",
        width: "100%",
        borderRadius: "24px",
        overflow: "hidden",
        backgroundColor: "#000",
        display: "flex",
        flexDirection: "column",
        border: "1px solid rgba(255,255,255,0.1)",
    },
    previewImage: {
        width: "100%",
        maxHeight: "500px",
        objectFit: "contain",
        display: "block",
    },
    resetBtn: {
        position: "absolute",
        top: "16px",
        right: "16px",
        backgroundColor: "rgba(0,0,0,0.6)",
        color: "#fff",
        border: "none",
        padding: "8px 16px",
        borderRadius: "999px",
        cursor: "pointer",
        fontSize: "13px",
        fontWeight: "600",
        backdropFilter: "blur(4px)",
        zIndex: 10,
    },
    overlay: {
        position: "absolute",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.7)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        fontWeight: "bold",
        zIndex: 5,
        textAlign: "center",
    },
    spinner: {
        width: "32px",
        height: "32px",
        border: "3px solid rgba(255,255,255,0.3)",
        borderTopColor: "#fff",
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
        marginBottom: "16px",
    },
};
