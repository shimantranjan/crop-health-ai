import React, {
    useEffect,
    useRef,
    useState,
    useCallback,
} from "react";

import {
    Camera,
    Upload,
    Play,
    Square,
    Volume2,
    Activity,
    ShieldCheck,
    AlertTriangle,
    BrainCircuit,
    History,
} from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";

import { getDiseaseInfo } from "../data/diseaseDatabase";

import {
    predictImage,
} from "../services/api";

import {
    PredictionResponse,
} from "../types";

const Dashboard = () => {

    const videoRef =
        useRef<HTMLVideoElement | null>(null);

    const canvasRef =
        useRef<HTMLCanvasElement | null>(null);

    const streamRef =
        useRef<MediaStream | null>(null);

    const [cameraOn, setCameraOn] =
        useState(false);

    const [prediction, setPrediction] =
        useState<PredictionResponse | null>(null);

    const [loading, setLoading] =
        useState(false);

    const [history, setHistory] =
        useState<PredictionResponse[]>([]);

    const [isPredicting, setIsPredicting] =
        useState(false);

    const [voiceEnabled, setVoiceEnabled] =
        useState(true);

    const [uploadedImage, setUploadedImage] =
        useState<string | null>(null);

    const [playbackState, setPlaybackState] =
        useState<"idle" | "playing">("idle");

    const [voices, setVoices] =
        useState<SpeechSynthesisVoice[]>([]);

    const diseaseInfo =
        prediction
            ? getDiseaseInfo(prediction.disease)
            : null;

    // =========================
    // LOAD VOICES
    // =========================

    useEffect(() => {

        const loadVoices = () => {
            setVoices(
                window.speechSynthesis.getVoices()
            );
        };

        loadVoices();

        window.speechSynthesis.onvoiceschanged =
            loadVoices;

    }, []);

    // =========================
    // SPEAK
    // =========================

    const speakPrediction = (
        text: string
    ) => {

        if (!voiceEnabled) return;

        window.speechSynthesis.cancel();

        const utterance =
            new SpeechSynthesisUtterance(text);

        const preferredVoices = [
            "Samantha",
            "Daniel",
            "Google UK English Female",
            "Google US English",
        ];

        let selectedVoice =
            voices.find((v) =>
                preferredVoices.includes(v.name)
            );

        if (!selectedVoice) {

            selectedVoice =
                voices.find((v) =>
                    v.lang.startsWith("en")
                ) || undefined;
        }

        if (selectedVoice) {
            utterance.voice = selectedVoice;
        }

        utterance.rate = 0.85;
        utterance.pitch = 0.92;
        utterance.volume = 1;

        utterance.onstart = () =>
            setPlaybackState("playing");

        utterance.onend = () =>
            setPlaybackState("idle");

        window.speechSynthesis.speak(
            utterance
        );
    };

    // =========================
    // CAMERA START
    // =========================

    const startCamera = async () => {

        try {

            setUploadedImage(null);

            const mediaStream =
                await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: false,
                });

            streamRef.current =
                mediaStream;

            if (videoRef.current) {

                videoRef.current.srcObject =
                    mediaStream;

                await videoRef.current.play();
            }

            setCameraOn(true);

        } catch (error) {

            console.error(
                "Camera Error:",
                error
            );

            alert(
                "Unable to access camera"
            );
        }
    };

    // =========================
    // CAMERA STOP
    // =========================

    const stopCamera = () => {

        if (streamRef.current) {

            streamRef.current
                .getTracks()
                .forEach((track) =>
                    track.stop()
                );
        }

        if (videoRef.current) {
            videoRef.current.srcObject =
                null;
        }

        setCameraOn(false);
    };

    // =========================
    // SPEECH GENERATOR
    // =========================

    const generateNarration = () => {

        if (
            !prediction ||
            !diseaseInfo
        ) {
            return "";
        }

        return `
            Detected:
            ${diseaseInfo.name}.
            Confidence:
            ${Math.round(
            prediction.confidence
        )} percent.
            ${diseaseInfo.description}
            Precautions:
            ${diseaseInfo.precautions.join(
            ", "
        )}.
            Treatment:
            ${diseaseInfo.treatment}
        `;
    };

    // =========================
    // FRAME CAPTURE
    // =========================

    const captureFrame =
        useCallback(async () => {

            if (
                !videoRef.current ||
                !canvasRef.current ||
                isPredicting ||
                !cameraOn
            ) {
                return;
            }

            const video =
                videoRef.current;

            const canvas =
                canvasRef.current;

            const context =
                canvas.getContext("2d");

            if (!context) return;

            canvas.width =
                video.videoWidth;

            canvas.height =
                video.videoHeight;

            context.drawImage(
                video,
                0,
                0,
                canvas.width,
                canvas.height
            );

            canvas.toBlob(
                async (blob) => {

                    if (!blob) return;

                    setIsPredicting(true);

                    try {

                        const response =
                            await predictImage(
                                blob,
                                "en",
                                "frame.jpg"
                            );

                        setPrediction(
                            response
                        );

                        setHistory((prev) => [
                            response,
                            ...prev,
                        ].slice(0, 5));

                        if (
                            voiceEnabled
                        ) {

                            const info =
                                getDiseaseInfo(
                                    response.disease
                                );

                            const text =
                                `Detected: ${info?.name ||
                                response.disease
                                }. Confidence: ${Math.round(
                                    response.confidence
                                )} percent.`;

                            speakPrediction(
                                text
                            );
                        }

                    } catch (error) {

                        console.error(
                            error
                        );

                    } finally {

                        setIsPredicting(
                            false
                        );
                    }

                },
                "image/jpeg",
                0.8
            );

        }, [
            cameraOn,
            isPredicting,
            voiceEnabled,
        ]);

    // =========================
    // IMAGE UPLOAD
    // =========================

    const handleUpload =
        async (
            e: React.ChangeEvent<HTMLInputElement>
        ) => {

            const file =
                e.target.files?.[0];

            if (!file) return;

            stopCamera();

            const imageUrl =
                URL.createObjectURL(file);

            setUploadedImage(
                imageUrl
            );

            setLoading(true);

            try {

                const data =
                    await predictImage(
                        file,
                        "en"
                    );

                setPrediction(data);

                setHistory((prev) => [
                    data,
                    ...prev,
                ].slice(0, 5));

                if (voiceEnabled) {

                    const info =
                        getDiseaseInfo(
                            data.disease
                        );

                    const text =
                        `Detected: ${info?.name ||
                        data.disease
                        }. Confidence: ${Math.round(
                            data.confidence
                        )} percent.`;

                    speakPrediction(
                        text
                    );
                }

            } catch (error) {

                console.error(error);

                alert(
                    "Prediction failed."
                );

            } finally {

                setLoading(false);
            }
        };

    // =========================
    // AUTO LOOP
    // =========================

    useEffect(() => {

        let interval:
            ReturnType<
                typeof setInterval
            >;

        if (cameraOn) {

            interval =
                setInterval(() => {

                    captureFrame();

                }, 2500);
        }

        return () => {

            if (interval) {
                clearInterval(
                    interval
                );
            }
        };

    }, [
        cameraOn,
        captureFrame,
    ]);

    // =========================
    // CLEANUP
    // =========================

    useEffect(() => {

        return () => {

            stopCamera();

            window.speechSynthesis.cancel();
        };

    }, []);

    return (

        <div className="min-h-screen bg-[#050816] text-gray-100 p-6 md:p-8">

            <canvas
                ref={canvasRef}
                className="hidden"
            />

            <div className="max-w-[1500px] mx-auto">

                {/* HEADER */}

                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">

                    <div className="flex items-center gap-3">

                        <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">

                            <BrainCircuit className="w-7 h-7 text-emerald-400" />

                        </div>

                        <div>

                            <h1 className="text-2xl font-semibold">

                                CropHealth
                                <span className="text-emerald-400">
                                    AI
                                </span>

                            </h1>

                            <p className="text-sm text-gray-400">

                                AI pathology operations

                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">

                        <div className="px-4 py-2 rounded-xl border border-white/5 bg-white/[0.03] flex items-center gap-2">

                            <div
                                className={`w-2 h-2 rounded-full ${cameraOn
                                        ? "bg-emerald-400 animate-pulse"
                                        : "bg-rose-500"
                                    }`}
                            />

                            <span className="text-sm text-gray-300">

                                {cameraOn
                                    ? "LIVE"
                                    : "STANDBY"}

                            </span>
                        </div>

                        <button
                            onClick={() =>
                                setVoiceEnabled(
                                    !voiceEnabled
                                )
                            }
                            className="p-3 rounded-xl border border-white/5 bg-white/[0.03]"
                        >

                            <Volume2
                                className={`w-5 h-5 ${voiceEnabled
                                        ? "text-emerald-400"
                                        : "text-gray-500"
                                    }`}
                            />
                        </button>
                    </div>
                </div>

                {/* GRID */}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {/* LEFT */}

                    <div className="lg:col-span-3 space-y-6">

                        <div className="rounded-2xl border border-white/5 bg-[#0d1117] p-5">

                            <div className="flex items-center gap-2 mb-4 text-sm text-gray-300">

                                <Camera className="w-4 h-4" />

                                Edge Stream

                            </div>

                            <div className="aspect-video rounded-xl overflow-hidden bg-black border border-white/5 mb-4 relative">

                                <video
                                    ref={videoRef}
                                    autoPlay
                                    muted
                                    playsInline
                                    className="w-full h-full object-cover"
                                />

                                {!cameraOn &&
                                    !uploadedImage && (

                                        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">

                                            <Camera className="w-8 h-8 mb-2 opacity-50" />

                                            <span className="text-xs">
                                                No active feed
                                            </span>

                                        </div>
                                    )}

                                {uploadedImage && (

                                    <img
                                        src={uploadedImage}
                                        alt="Uploaded"
                                        className="absolute inset-0 w-full h-full object-cover"
                                    />
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-3">

                                <button
                                    onClick={startCamera}
                                    className="h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm flex items-center justify-center gap-2"
                                >

                                    <Play className="w-4 h-4" />

                                    Start

                                </button>

                                <button
                                    onClick={stopCamera}
                                    className="h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm flex items-center justify-center gap-2"
                                >

                                    <Square className="w-4 h-4" />

                                    Stop

                                </button>
                            </div>
                        </div>

                        {/* UPLOAD */}

                        <div className="rounded-2xl border border-white/5 bg-[#0d1117] p-5">

                            <div className="flex items-center gap-2 mb-4 text-sm text-gray-300">

                                <Upload className="w-4 h-4" />

                                Manual Scan

                            </div>

                            <label className="border border-dashed border-white/10 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-white/[0.03] transition-all">

                                <Upload className="w-6 h-6 text-gray-400 mb-3" />

                                <span className="text-sm text-gray-300">

                                    Upload Image

                                </span>

                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleUpload}
                                    className="hidden"
                                />
                            </label>
                        </div>
                    </div>

                    {/* CENTER */}

                    <div className="lg:col-span-6">

                        <div className="rounded-2xl border border-white/5 bg-[#0d1117] p-6 min-h-[650px]">

                            <div className="flex items-center justify-between mb-8">

                                <h2 className="text-lg font-medium">

                                    Pathology Report

                                </h2>

                                <button
                                    onClick={() =>
                                        speakPrediction(
                                            generateNarration()
                                        )
                                    }
                                    disabled={!prediction}
                                    className="h-10 px-4 rounded-xl border border-white/5 bg-white/[0.03] text-sm flex items-center gap-2"
                                >

                                    <Volume2 className="w-4 h-4" />

                                    {playbackState ===
                                        "playing"
                                        ? "Narrating..."
                                        : "Narrate"}

                                </button>
                            </div>

                            <AnimatePresence mode="wait">

                                {prediction &&
                                    diseaseInfo ? (

                                    <motion.div
                                        key="result"
                                        initial={{
                                            opacity: 0,
                                        }}
                                        animate={{
                                            opacity: 1,
                                        }}
                                        exit={{
                                            opacity: 0,
                                        }}
                                        className="space-y-6"
                                    >

                                        <div className="rounded-2xl bg-black/30 border border-white/5 p-6">

                                            <div className="text-xs uppercase tracking-wider text-gray-500 mb-2">

                                                Classification

                                            </div>

                                            <h3 className="text-3xl font-semibold text-white mb-3">

                                                {diseaseInfo.name}

                                            </h3>

                                            <div className="text-5xl font-light">

                                                {prediction.confidence.toFixed(
                                                    1
                                                )}

                                                <span className="text-xl text-gray-500">

                                                    %

                                                </span>
                                            </div>
                                        </div>

                                        <div className="rounded-2xl bg-black/30 border border-white/5 p-5 text-gray-300 leading-relaxed">

                                            {diseaseInfo.description}

                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                                            <div className="rounded-2xl bg-black/30 border border-yellow-500/10 p-5">

                                                <div className="flex items-center gap-2 text-yellow-400 mb-4">

                                                    <AlertTriangle className="w-4 h-4" />

                                                    Symptoms

                                                </div>

                                                <div className="space-y-2">

                                                    {diseaseInfo.symptoms.map(
                                                        (
                                                            item,
                                                            index
                                                        ) => (

                                                            <div
                                                                key={
                                                                    index
                                                                }
                                                                className="text-sm text-gray-400"
                                                            >

                                                                •{" "}
                                                                {
                                                                    item
                                                                }

                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            </div>

                                            <div className="rounded-2xl bg-black/30 border border-blue-500/10 p-5">

                                                <div className="flex items-center gap-2 text-blue-400 mb-4">

                                                    <ShieldCheck className="w-4 h-4" />

                                                    Precautions

                                                </div>

                                                <div className="space-y-2">

                                                    {diseaseInfo.precautions.map(
                                                        (
                                                            item,
                                                            index
                                                        ) => (

                                                            <div
                                                                key={
                                                                    index
                                                                }
                                                                className="text-sm text-gray-400"
                                                            >

                                                                •{" "}
                                                                {
                                                                    item
                                                                }

                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="rounded-2xl bg-emerald-500/5 border border-emerald-500/10 p-5">

                                            <div className="text-sm text-emerald-400 mb-2">

                                                Recommended Protocol

                                            </div>

                                            <p className="text-sm text-gray-300 leading-relaxed">

                                                {
                                                    diseaseInfo.treatment
                                                }

                                            </p>
                                        </div>
                                    </motion.div>

                                ) : (

                                    <div className="h-full flex flex-col items-center justify-center text-center py-20">

                                        <Activity className="w-12 h-12 text-gray-700 mb-4" />

                                        <h3 className="text-lg text-gray-300 mb-2">

                                            Awaiting Telemetry

                                        </h3>

                                        <p className="text-sm text-gray-500 max-w-sm">

                                            Start live detection or upload an image to begin AI pathology analysis.

                                        </p>
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* RIGHT */}

                    <div className="lg:col-span-3 space-y-6">

                        <div className="rounded-2xl border border-white/5 bg-[#0d1117] p-5">

                            <div className="flex items-center gap-2 mb-4 text-sm text-gray-300">

                                <History className="w-4 h-4" />

                                Recent Logs

                            </div>

                            <div className="space-y-3">

                                {history.length >
                                    0 ? (

                                    history.map(
                                        (
                                            item,
                                            index
                                        ) => (

                                            <div
                                                key={
                                                    index
                                                }
                                                className="rounded-xl bg-black/30 border border-white/5 p-3 flex justify-between items-center"
                                            >

                                                <span className="text-xs text-gray-300 truncate">

                                                    {
                                                        getDiseaseInfo(
                                                            item.disease
                                                        ).name
                                                    }

                                                </span>

                                                <span className="text-xs text-emerald-400">

                                                    {item.confidence.toFixed(
                                                        1
                                                    )}
                                                    %

                                                </span>
                                            </div>
                                        )
                                    )

                                ) : (

                                    <div className="text-center py-8 text-xs text-gray-600">

                                        No recent activity

                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="rounded-2xl border border-white/5 bg-[#0d1117] p-5">

                            <h2 className="text-sm text-gray-300 mb-4">

                                System Status

                            </h2>

                            <div className="space-y-4">

                                <div>

                                    <div className="text-xs text-gray-500 mb-1">

                                        AI Node

                                    </div>

                                    <div className="text-sm text-emerald-400 flex items-center gap-2">

                                        <div className="w-2 h-2 rounded-full bg-emerald-400" />

                                        Operational

                                    </div>
                                </div>

                                <div>

                                    <div className="text-xs text-gray-500 mb-1">

                                        Session Scans

                                    </div>

                                    <div className="text-2xl font-light">

                                        {
                                            history.length
                                        }

                                    </div>
                                </div>

                                <div>

                                    <div className="text-xs text-gray-500 mb-1">

                                        Voice Status

                                    </div>

                                    <div
                                        className={`text-sm ${voiceEnabled
                                                ? "text-emerald-400"
                                                : "text-gray-500"
                                            }`}
                                    >

                                        {voiceEnabled
                                            ? "Enabled"
                                            : "Disabled"}

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;