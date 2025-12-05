"use client";

import { useRef } from "react";
import gsap from "gsap";

interface MenuButtonProps {
    onClick: () => void;
}

export default function MenuButton({ onClick }: MenuButtonProps) {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const linesRef = useRef<(SVGLineElement | null)[]>([]);

    const handleMouseEnter = () => {
        const button = buttonRef.current;
        if (!button) return;

        gsap.to(button, {
            backgroundColor: "#FFF5F5",
            borderColor: "#330014",
            duration: 0.3,
            ease: "power2.out",
        });

        const verticalPositions = [
            { x1: 6, x2: 6 },
            { x1: 12, x2: 12 },
            { x1: 18, x2: 18 },
        ];

        linesRef.current.forEach((line, i) => {
            if (!line) return;
            gsap.to(line, {
                attr: {
                    x1: verticalPositions[i].x1,
                    x2: verticalPositions[i].x2,
                    y1: 4,
                    y2: 20,
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

        gsap.to(button, {
            backgroundColor: "#330014",
            borderColor: "#330014",
            duration: 0.3,
            ease: "power2.out",
        });

        const positions = [
            { y1: 6, y2: 6 },
            { y1: 12, y2: 12 },
            { y1: 18, y2: 18 },
        ];

        linesRef.current.forEach((line, i) => {
            if (!line) return;
            gsap.to(line, {
                attr: {
                    x1: 3,
                    x2: 21,
                    y1: positions[i].y1,
                    y2: positions[i].y2,
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
            aria-label="Apri menu"
        >
            <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="2"
            >
                <line
                    ref={(el) => { linesRef.current[0] = el; }}
                    x1="3"
                    y1="6"
                    x2="21"
                    y2="6"
                    stroke="#FFF5F5"
                />
                <line
                    ref={(el) => { linesRef.current[1] = el; }}
                    x1="3"
                    y1="12"
                    x2="21"
                    y2="12"
                    stroke="#FFF5F5"
                />
                <line
                    ref={(el) => { linesRef.current[2] = el; }}
                    x1="3"
                    y1="18"
                    x2="21"
                    y2="18"
                    stroke="#FFF5F5"
                />
            </svg>
        </button>
    );
}
