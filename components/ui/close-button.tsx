"use client";

import { useRef } from "react";
import gsap from "gsap";

interface CloseButtonProps {
    onClick: () => void;
}

export default function CloseButton({ onClick }: CloseButtonProps) {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const linesRef = useRef<(SVGLineElement | null)[]>([]);

    const handleMouseEnter = () => {
        const button = buttonRef.current;
        if (!button) return;

        gsap.killTweensOf(button);
        linesRef.current.forEach((line) => {
            if (line) gsap.killTweensOf(line);
        });

        gsap.to(button, {
            backgroundColor: "#FFF5F5",
            borderColor: "#330014",
            duration: 0.3,
            ease: "power2.out",
        });

        const horizontalPositions = [
            { x1: 4, x2: 20, y1: 8, y2: 8 },
            { x1: 4, x2: 20, y1: 16, y2: 16 },
        ];

        linesRef.current.forEach((line, i) => {
            if (!line) return;
            gsap.to(line, {
                attr: {
                    x1: horizontalPositions[i].x1,
                    x2: horizontalPositions[i].x2,
                    y1: horizontalPositions[i].y1,
                    y2: horizontalPositions[i].y2,
                },
                stroke: "#330014",
                duration: 0.3,
                delay: i * 0.05,
                ease: "power2.out",
            });
        });
    };

    const handleMouseLeave = () => {
        const button = buttonRef.current;
        if (!button) return;

        gsap.killTweensOf(button);
        linesRef.current.forEach((line) => {
            if (line) gsap.killTweensOf(line);
        });

        gsap.to(button, {
            backgroundColor: "#330014",
            borderColor: "#330014",
            duration: 0.3,
            ease: "power2.out",
        });

        const xPositions = [
            { x1: 6, x2: 18, y1: 6, y2: 18 },
            { x1: 18, x2: 6, y1: 6, y2: 18 },
        ];

        linesRef.current.forEach((line, i) => {
            if (!line) return;
            gsap.to(line, {
                attr: {
                    x1: xPositions[i].x1,
                    x2: xPositions[i].x2,
                    y1: xPositions[i].y1,
                    y2: xPositions[i].y2,
                },
                stroke: "#FFF5F5",
                duration: 0.3,
                delay: i * 0.05,
                ease: "power2.out",
            });
        });
    };

    return (
        <button
            ref={buttonRef}
            onClick={onClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="p-2 bg-[#330014] cursor-pointer border-2 border-[#330014] transition-none"
            aria-label="Chiudi menu"
        >
            <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="2"
            >
                <line
                    ref={(el) => { linesRef.current[0] = el; }}
                    x1="6"
                    y1="6"
                    x2="18"
                    y2="18"
                    stroke="#FFF5F5"
                />
                <line
                    ref={(el) => { linesRef.current[1] = el; }}
                    x1="18"
                    y1="6"
                    x2="6"
                    y2="18"
                    stroke="#FFF5F5"
                />
            </svg>
        </button>
    );
}
