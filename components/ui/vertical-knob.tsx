/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useRef, useState, useEffect } from "react";

interface VerticalKnobProps {
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
}

export default function VerticalKnob({
    value,
    onChange,
    min = 0,
    max = 100,
}: VerticalKnobProps) {
    const sliderRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsDragging(true);
        updateValue(e.clientY);
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        setIsDragging(true);
        updateValue(e.touches[0].clientY);
    };

    const updateValue = (clientY: number) => {
        if (!sliderRef.current) return;

        const rect = sliderRef.current.getBoundingClientRect();
        const y = clientY - rect.top;
        const percentage = 1 - Math.max(0, Math.min(1, y / rect.height));
        const newValue = Math.round(min + percentage * (max - min));
        onChange(newValue);
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging) return;
            updateValue(e.clientY);
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (!isDragging) return;
            updateValue(e.touches[0].clientY);
        };

        const handleTouchEnd = () => {
            setIsDragging(false);
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
        window.addEventListener("touchmove", handleTouchMove);
        window.addEventListener("touchend", handleTouchEnd);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
            window.removeEventListener("touchmove", handleTouchMove);
            window.removeEventListener("touchend", handleTouchEnd);
        };
    }, [isDragging]);

    const percentage = ((value - min) / (max - min)) * 100;

    return (
        <div className="flex flex-row gap-1 sm:gap-1.5 md:gap-2 h-32 sm:h-40 md:h-48 lg:h-56">
            <div className="absolute -left-1.5 sm:-left-2 top-0 bottom-0 flex flex-col justify-between">
                {Array.from({ length: 10 }).map((_, i) => (
                    <div
                        key={`left-${i}`}
                        className="h-px bg-[#330014]"
                        style={{
                            width: i % 2 === 0 ? "6px" : "3px",
                            opacity: (9 - i) * 11.1 <= percentage ? 1 : 0.3,
                        }}
                    />
                ))}
            </div>

            <div className="flex flex-col items-center gap-2">
                <span className="text-[7px] sm:text-[8px] arimo uppercase tracking-wider text-[#330014] rotate-0">
                    Max
                </span>

                <div className="relative flex-1">
                    <div
                        ref={sliderRef}
                        className="w-0.5 sm:w-1 h-full bg-[#330014] cursor-ns-resize relative touch-none"
                        onMouseDown={handleMouseDown}
                        onTouchStart={handleTouchStart}
                    >
                        <div
                            className="absolute bottom-0 left-0 w-full bg-[#330014] opacity-100"
                            style={{ height: `${percentage}%` }}
                        />

                        <div
                            className="absolute left-1/2 -translate-x-1/2 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-[#FFF5F5] border-[1.5px] sm:border-2 border-[#330014] rounded-sm"
                            style={{
                                bottom: `${percentage}%`,
                                transform: "translate(-50%, 50%)",
                            }}
                        />
                    </div>

                    <div className="absolute -right-1.5 sm:-right-2 top-0 bottom-0 flex flex-col justify-between">
                        {Array.from({ length: 10 }).map((_, i) => (
                            <div
                                key={`right-${i}`}
                                className="h-px bg-[#330014]"
                                style={{
                                    width: i % 2 === 0 ? "6px" : "3px",
                                    opacity: (9 - i) * 11.1 <= percentage ? 1 : 0.3,
                                }}
                            />
                        ))}
                    </div>
                </div>

                <span className="text-[7px] sm:text-[8px] arimo uppercase tracking-wider text-[#330014]">
                    Min
                </span>
            </div>

            <div className="flex items-center">
                <span
                    className="text-[8px] sm:text-[9px] md:text-[10px] arimo uppercase tracking-wider text-[#330014]"
                    style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
                >
                    Noise
                </span>
            </div>
        </div>
    );
}
