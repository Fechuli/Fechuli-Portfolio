/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useRef, useState, useEffect } from "react";

interface PixelKnobProps {
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
}

export default function PixelKnob({
    value,
    onChange,
    min = 5,
    max = 100,
}: PixelKnobProps) {
    const sliderRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsDragging(true);
        updateValue(e.clientX);
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        e.preventDefault();
        setIsDragging(true);
        updateValue(e.touches[0].clientX);
    };

    const updateValue = (clientX: number) => {
        if (!sliderRef.current) return;

        const rect = sliderRef.current.getBoundingClientRect();
        const x = clientX - rect.left;
        const percentage = Math.max(0, Math.min(1, x / rect.width));
        const newValue = Math.round(min + percentage * (max - min));

        if (newValue !== value) {
            onChange(newValue);
        }
    };

    useEffect(() => {
        if (!isDragging) return;

        const handleMouseMove = (e: MouseEvent) => {
            updateValue(e.clientX);
        };

        const handleTouchMove = (e: TouchEvent) => {
            e.preventDefault();
            updateValue(e.touches[0].clientX);
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        const handleTouchEnd = () => {
            setIsDragging(false);
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
        window.addEventListener("touchmove", handleTouchMove, { passive: false });
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
        <div className="flex flex-col gap-1.5 sm:gap-2 w-48 sm:w-56 md:w-64">
            <div className="flex items-center justify-between text-[8px] sm:text-[9px] md:text-[10px] arimo uppercase tracking-wider text-[#330014]">
                <span>← High</span>
                <span className="text-[9px] sm:text-[10px] md:text-xs font-mono tracking-wide">Resolution</span>
                <span>Low →</span>
            </div>

            <div className="relative">
                <div className="absolute -top-2 left-0 right-0 flex justify-between">
                    {Array.from({ length: 20 }).map((_, i) => (
                        <div
                            key={`top-${i}`}
                            className="w-px bg-[#330014]"
                            style={{
                                height: i % 5 === 0 ? "8px" : "4px",
                                opacity: i * 5 <= percentage ? 1 : 0.3,
                            }}
                        />
                    ))}
                </div>

                <div
                    ref={sliderRef}
                    className="h-1 bg-[#330014] cursor-ew-resize relative"
                    onMouseDown={handleMouseDown}
                    onTouchStart={handleTouchStart}
                >
                    <div
                        className="absolute top-0 left-0 h-full bg-[#330014] opacity-100"
                        style={{ width: `${percentage}%` }}
                    />

                    <div
                        className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-[#FFF5F5] border-2 border-[#330014] rounded-sm"
                        style={{
                            left: `${percentage}%`,
                            transform: "translate(-50%, -50%)",
                        }}
                    />
                </div>

                <div className="absolute -bottom-2 left-0 right-0 flex justify-between">
                    {Array.from({ length: 20 }).map((_, i) => (
                        <div
                            key={`bottom-${i}`}
                            className="w-px bg-[#330014]"
                            style={{
                                height: i % 5 === 0 ? "8px" : "4px",
                                opacity: i * 5 <= percentage ? 1 : 0.3,
                            }}
                        />
                    ))}
                </div>
            </div>

            <div className="text-center">
                <span className="text-[8px] sm:text-[9px] md:text-[10px] arimo uppercase tracking-wider text-[#330014]">
                    Signal Adjustment
                </span>
            </div>
        </div>
    );
}
