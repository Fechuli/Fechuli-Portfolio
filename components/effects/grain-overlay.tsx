"use client";

import { useEffect, useRef, useState } from "react";

interface GrainOverlayProps {
    opacity?: number;
}

export default function GrainOverlay({ opacity = 0.15 }: GrainOverlayProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isMobile, setIsMobile] = useState(false);
    const [videoReady, setVideoReady] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            const mobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768;
            setIsMobile(mobile);
        };
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    useEffect(() => {
        if (isMobile) return;

        const video = videoRef.current;
        if (!video) return;

        const handlePlaying = () => setVideoReady(true);
        video.addEventListener("playing", handlePlaying);

        video.play().catch(() => {});

        return () => {
            video.removeEventListener("playing", handlePlaying);
        };
    }, [isMobile]);

    useEffect(() => {
        if (!isMobile) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationId: number;
        let lastTime = 0;
        const fps = 12; 
        const interval = 1000 / fps;

        const resize = () => {
            const scale = 0.25; 
            canvas.width = window.innerWidth * scale;
            canvas.height = window.innerHeight * scale;
        };

        const generateNoise = (timestamp: number) => {
            if (timestamp - lastTime < interval) {
                animationId = requestAnimationFrame(generateNoise);
                return;
            }
            lastTime = timestamp;

            const imageData = ctx.createImageData(canvas.width, canvas.height);
            const data = imageData.data;

            for (let i = 0; i < data.length; i += 4) {
                const value = Math.random() * 255;
                data[i] = value;
                data[i + 1] = value;
                data[i + 2] = value;
                data[i + 3] = 255;
            }

            ctx.putImageData(imageData, 0, 0);
            animationId = requestAnimationFrame(generateNoise);
        };

        resize();
        window.addEventListener("resize", resize);
        animationId = requestAnimationFrame(generateNoise);

        return () => {
            window.removeEventListener("resize", resize);
            cancelAnimationFrame(animationId);
        };
    }, [isMobile]);

    if (isMobile) {
        return (
            <canvas
                ref={canvasRef}
                aria-hidden="true"
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    zIndex: 99999,
                    pointerEvents: "none",
                    opacity: opacity * 0.05, 
                    imageRendering: "pixelated",
                }}
            />
        );
    }

    return (
        <div
            aria-hidden="true"
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 99999,
                pointerEvents: "none",
                overflow: "hidden",
                opacity: videoReady ? 1 : 0,
                transition: "opacity 0.3s ease",
            }}
        >
            <video
                ref={videoRef}
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    opacity: opacity,
                }}
            >
                <source src="/video/grain.webm" type="video/webm" />
            </video>
        </div>
    );
}
