/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useTranslations } from "next-intl";

interface EntityVoiceProps {
    onSubmit: (result: "correct" | "wrong" | "denied") => void;
    targetPhrase: string;
}

export default function EntityVoice({ onSubmit, targetPhrase }: EntityVoiceProps) {
    const t = useTranslations("entity");
    const [status, setStatus] = useState<"idle" | "recording" | "playback">("idle");
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [transcription, setTranscription] = useState<string>("");
    const [isListening, setIsListening] = useState(false);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const recognitionRef = useRef<any>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        return () => {
            if (recognitionRef.current) {
                try {
                    recognitionRef.current.stop();
                } catch (e) {
                }
            }
        };
    }, []);

    const checkSimilarity = useCallback((text: string, target: string): boolean => {
        const normalize = (str: string) =>
            str
                .toLowerCase()
                .replace(/[^\w\s]/g, "")
                .replace(/\s+/g, "")
                .trim();

        const normalizedText = normalize(text);
        const normalizedTarget = normalize(target);

        console.log("Comparing:", normalizedText, "with", normalizedTarget);

        if (normalizedText === normalizedTarget) return true;

        if (normalizedText.includes(normalizedTarget)) return true;

        if (normalizedTarget === "gugugaga") {
            const hasGu = normalizedText.includes("gu");
            const hasGa = normalizedText.includes("ga");
            if (hasGu && hasGa) return true;
        }

        return false;
    }, []);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, {
                    type: "audio/webm",
                });
                const url = URL.createObjectURL(audioBlob);
                setAudioUrl(url);
                stream.getTracks().forEach((track) => track.stop());
                setStatus("playback");
            };

            if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
                const SpeechRecognition =
                    (window as any).SpeechRecognition ||
                    (window as any).webkitSpeechRecognition;
                const recognition = new SpeechRecognition();
                recognitionRef.current = recognition;

                recognition.lang = "it-IT";
                recognition.continuous = true;
                recognition.interimResults = true;

                recognition.onresult = (event: any) => {
                    let finalTranscript = "";
                    for (let i = 0; i < event.results.length; i++) {
                        const transcript = event.results[i][0].transcript;
                        if (event.results[i].isFinal) {
                            finalTranscript += transcript + " ";
                        }
                    }
                    if (finalTranscript) {
                        setTranscription(finalTranscript.trim());
                        setIsListening(true);
                    }
                };

                recognition.onerror = (event: any) => {
                    console.error("Speech recognition error:", event.error);
                };

                recognition.start();
            }

            mediaRecorder.start();
            setStatus("recording");

            setTimeout(() => {
                stopRecording();
            }, 5000);
        } catch (error) {
            console.error("Microphone access denied:", error);
            onSubmit("denied");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
            mediaRecorderRef.current.stop();
        }
        if (recognitionRef.current) {
            try {
                recognitionRef.current.stop();
            } catch (e) {
                
            }
        }
    };

    const playAudio = () => {
        if (audioUrl && audioRef.current) {
            audioRef.current.play();
        }
    };

    const handleConfirm = () => {
        if (transcription) {
            const isCorrect = checkSimilarity(transcription, targetPhrase);
            onSubmit(isCorrect ? "correct" : "wrong");
        } else {
            onSubmit("wrong");
        }
    };

    const handleRetry = () => {
        setStatus("idle");
        setAudioUrl(null);
        setTranscription("");
        setIsListening(false);
    };

    return (
        <div className="flex flex-col items-center gap-12 w-full max-w-2xl">
            {audioUrl && <audio ref={audioRef} src={audioUrl} className="hidden" />}

            {status === "idle" && (
                <div className="flex flex-col items-center gap-8">
                    <div className="w-32 h-32 rounded-full border-2 border-white/20 flex items-center justify-center">
                        <div className="w-24 h-24 rounded-full border border-white/30 flex items-center justify-center">
                            <div className="w-16 h-16 rounded-full bg-white/10" />
                        </div>
                    </div>
                    <button
                        onClick={startRecording}
                        className="px-12 py-4 text-white/70 text-base font-mono hover:text-white border border-white/20 hover:border-white/40 transition-all duration-300"
                    >
                        {t("voiceRecord")}
                    </button>
                </div>
            )}

            {status === "recording" && (
                <div className="flex flex-col items-center gap-8">
                    <div className="relative">
                        <div className="w-32 h-32 rounded-full border-2 border-red-500/50 flex items-center justify-center">
                            <div className="w-24 h-24 rounded-full border border-red-500/70 flex items-center justify-center animate-pulse">
                                <div className="w-16 h-16 rounded-full bg-red-500" />
                            </div>
                        </div>
                        <div className="absolute inset-0 rounded-full border-2 border-red-500/30 animate-ping" />
                    </div>

                    <div className="text-center">
                        <p className="text-white/70 text-sm font-mono mb-2">
                            {t("voiceRecording")}
                        </p>
                        {isListening && (
                            <p className="text-white/40 text-xs font-mono">
                                {t("voiceDetected")}...
                            </p>
                        )}
                    </div>

                    <button
                        onClick={stopRecording}
                        className="px-8 py-2 text-white/50 text-sm font-mono hover:text-white/70 border border-white/20 hover:border-white/30 transition-all duration-300"
                    >
                        {t("voiceStop")}
                    </button>
                </div>
            )}

            {status === "playback" && (
                <div className="flex flex-col items-center gap-8 w-full">
                    <div className="w-full text-center space-y-4">
                        {transcription ? (
                            <>
                                <p className="text-white/50 text-sm font-mono">
                                    {t("voiceDetected")}:
                                </p>
                                <div className="px-6 py-4 border border-white/20 bg-white/5">
                                    <p className="text-white text-xl font-mono tracking-wide">
                                        &quot;{transcription}&quot;
                                    </p>
                                </div>
                            </>
                        ) : (
                            <p className="text-white/40 text-sm font-mono">
                                {t("voiceProcessing")}
                            </p>
                        )}
                    </div>

                    <button
                        onClick={playAudio}
                        className="w-20 h-20 rounded-full border border-white/30 hover:border-white/50 flex items-center justify-center transition-all duration-300 group"
                    >
                        <svg
                            className="w-8 h-8 text-white/50 group-hover:text-white/70 transition-colors"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    </button>

                    <div className="flex gap-6 mt-4">
                        <button
                            onClick={handleRetry}
                            className="px-8 py-3 text-white/40 text-sm font-mono hover:text-white/60 border border-white/10 hover:border-white/20 transition-all duration-300"
                        >
                            {t("voiceRetry")}
                        </button>
                        <button
                            onClick={handleConfirm}
                            className="px-8 py-3 text-white/70 text-sm font-mono hover:text-white border border-white/30 hover:border-white/50 transition-all duration-300"
                        >
                            {t("voiceConfirm")}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
