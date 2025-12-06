"use client";

import { useState, useRef, useEffect } from "react";
import gsap from "gsap";

interface EntityChoiceProps {
    type: "yesno" | "checkbox";
    options?: string[];
    onSubmit: (value: string) => void;
}

export default function EntityChoice({
    type,
    options = [],
    onSubmit,
}: EntityChoiceProps) {
    const [selected, setSelected] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (containerRef.current) {
            gsap.fromTo(
                containerRef.current,
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    ease: "power2.out",
                    delay: 0.5,
                }
            );
        }
    }, []);

    const handleSelect = (value: string) => {
        setSelected(value);
    };

    const handleSubmit = () => {
        if (selected) {
            onSubmit(selected);
        }
    };

    if (type === "yesno") {
        return (
            <div
                ref={containerRef}
                className="flex gap-8 sm:gap-16"
                style={{ opacity: 0 }}
            >
                <button
                    onClick={() => onSubmit("si")}
                    className={`
                        px-12 py-6 sm:px-16 sm:py-8
                        border-2 border-white/30
                        text-white/70 text-2xl sm:text-3xl font-mono
                        hover:bg-white hover:text-black
                        transition-all duration-200
                    `}
                >
                    SÌ
                </button>
                <button
                    onClick={() => onSubmit("no")}
                    className={`
                        px-12 py-6 sm:px-16 sm:py-8
                        border-2 border-white/30
                        text-white/70 text-2xl sm:text-3xl font-mono
                        hover:bg-white hover:text-black
                        transition-all duration-200
                    `}
                >
                    NO
                </button>
            </div>
        );
    }

    return (
        <div ref={containerRef} className="space-y-4" style={{ opacity: 0 }}>
            {options.map((option) => (
                <button
                    key={option}
                    onClick={() => handleSelect(option)}
                    className={`
                        flex items-center gap-4 w-full
                        text-left text-xl sm:text-2xl font-mono
                        transition-all duration-200
                        ${
                            selected === option
                                ? "text-white"
                                : "text-white/40 hover:text-white/70"
                        }
                    `}
                >
                    <div
                        className={`
                        w-6 h-6 border-2 flex items-center justify-center
                        transition-all duration-200
                        ${
                            selected === option
                                ? "border-white bg-white"
                                : "border-white/40"
                        }
                    `}
                    >
                        {selected === option && (
                            <span className="text-black text-sm">✓</span>
                        )}
                    </div>
                    {option}
                </button>
            ))}

            {selected && (
                <button
                    onClick={handleSubmit}
                    className="mt-8 text-white/40 text-sm font-mono hover:text-white/70 transition-colors"
                >
                    Conferma
                </button>
            )}
        </div>
    );
}
