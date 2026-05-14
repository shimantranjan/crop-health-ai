import React, {
    useRef,
    useEffect,
    useState,
    useCallback,
} from "react";

import { Camera, Loader2 } from "lucide-react";

import { PredictionResponse } from "../types";
import { predictImage } from "../services/api";

interface LiveDetectionProps {
    onPrediction: (
        data: PredictionResponse
    ) => void;

    lang: string;

    isFrozen?: boolean;
}

const LiveDetection: React.FC<
    LiveDetectionProps
> = ({
    onPrediction,
    lang,
    isFrozen = false,
}) => {

        const videoRef =
            useRef<HTMLVideoElement | null>(null);

        const canvasRef =
            useRef<HTMLCanvasElement | null>(null);

        const streamRef =
            useRef<MediaStream | null>(null);

        const [isProcessing, setIsProcessing] =
            useState(false);

        const [isCameraReady, setIsCameraReady] =
            useState(false);

        const [errorStatus, setErrorStatus] =
            useState<string | null>(null);

        // =========================
        // CAMERA START
        // =========================

        const startCamera = useCallback(async () => {

            try {

                setErrorStatus(null);

                if (
                    !navigator.mediaDevices ||
                    !navigator.mediaDevices.getUserMedia
                ) {
                    throw new Error(
                        "Camera API unsupported."
                    );
                }

                // stop old stream
                if (streamRef.current) {
                    streamRef.current
                        .getTracks()
                        .forEach((track) =>
                            track.stop()
                        );
                }

                // Mac-safe webcam access
                const stream =
                    await navigator.mediaDevices.getUserMedia({
                        video: true,
                        audio: false,
                    });

                streamRef.current = stream;

                if (videoRef.current) {

                    videoRef.current.srcObject =
                        stream;

                    videoRef.current.onloadedmetadata =
                        async () => {

                            try {

                                await videoRef.current?.play();

                                setIsCameraReady(true);

                            } catch (err) {

                                console.error(err);

                                setErrorStatus(
                                    "Failed to play camera stream."
                                );
                            }
                        };
                }

            } catch (err: unknown) {

                console.error(err);

                setErrorStatus(
                    err instanceof Error
                        ? err.message
                        : "Unable to access camera."
                );

                setIsCameraReady(false);
            }

        }, []);

        // =========================
        // CAMERA STOP
        // =========================

        const stopCamera = useCallback(() => {

            if (streamRef.current) {

                streamRef.current
                    .getTracks()
                    .forEach((track) =>
                        track.stop()
                    );
            }

            if (videoRef.current) {
                videoRef.current.srcObject = null;
            }

            setIsCameraReady(false);

        }, []);

        // =========================
        // INITIALIZE CAMERA
        // =========================

        useEffect(() => {

            startCamera();

            return () => {
                stopCamera();
            };

        }, [startCamera, stopCamera]);

        // =========================
        // CAPTURE + PREDICT
        // =========================

        const captureAndPredict =
            useCallback(async () => {

                if (
                    !videoRef.current ||
                    !canvasRef.current ||
                    isProcessing ||
                    !isCameraReady ||
                    isFrozen
                ) {
                    return;
                }

                const video = videoRef.current;
                const canvas = canvasRef.current;

                const context =
                    canvas.getContext("2d");

                if (!context) return;

                setIsProcessing(true);

                try {

                    context.drawImage(
                        video,
                        0,
                        0,
                        canvas.width,
                        canvas.height
                    );

                    const blob =
                        await new Promise<Blob | null>(
                            (resolve) => {

                                canvas.toBlob(
                                    resolve,
                                    "image/jpeg",
                                    0.85
                                );
                            }
                        );

                    if (!blob) {
                        throw new Error(
                            "Failed to capture frame."
                        );
                    }

                    const data =
                        await predictImage(
                            blob,
                            lang,
                            "frame.jpg"
                        );

                    onPrediction(data);

                } catch (err) {

                    console.error(err);

                    setErrorStatus(
                        err instanceof Error
                            ? err.message
                            : "Prediction failed."
                    );

                } finally {

                    setIsProcessing(false);
                }

            }, [
                isProcessing,
                isCameraReady,
                isFrozen,
                lang,
                onPrediction,
            ]);

        // =========================
        // AUTO DETECTION LOOP
        // =========================

        useEffect(() => {

            const interval =
                setInterval(() => {

                    if (
                        isCameraReady &&
                        !isFrozen
                    ) {
                        captureAndPredict();
                    }

                }, 3000);

            return () =>
                clearInterval(interval);

        }, [
            captureAndPredict,
            isCameraReady,
            isFrozen,
        ]);

        return (
            <div className="w-full flex flex-col gap-3">

                <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-black">

                    <video
                        ref={videoRef}
                        autoPlay
                        muted
                        playsInline
                        className="w-full aspect-video object-cover"
                    />

                    <canvas
                        ref={canvasRef}
                        width={224}
                        height={224}
                        className="hidden"
                    />

                    {!isCameraReady &&
                        !errorStatus && (

                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 text-gray-400">

                                <Loader2 className="w-8 h-8 animate-spin mb-3" />

                                <p className="text-sm">
                                    Initializing camera...
                                </p>

                            </div>
                        )}

                    {errorStatus && (

                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-500/10 text-red-400 p-5 text-center">

                            <Camera className="w-8 h-8 mb-3 opacity-70" />

                            <p className="text-sm">
                                {errorStatus}
                            </p>

                        </div>
                    )}
                </div>

                {isProcessing &&
                    !isFrozen && (

                        <div className="text-xs text-amber-400 text-center italic">

                            Analyzing live crop stream...

                        </div>
                    )}
            </div>
        );
    };

export default LiveDetection;