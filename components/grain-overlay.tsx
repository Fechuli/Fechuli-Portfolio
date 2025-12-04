"use client";

interface GrainOverlayProps {
    opacity?: number;
}

export default function GrainOverlay({ opacity = 0.15 }: GrainOverlayProps) {
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
            }}
        >
            <video
                autoPlay
                loop
                muted
                playsInline
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
