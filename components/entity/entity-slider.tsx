"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import gsap from "gsap";

interface EntitySliderProps {
    type: "days" | "number";
    min?: number;
    max?: number;
    onSubmit: (value: string) => void;
    days?: string[];
    dayKeys?: string[];
}

export default function EntitySlider({
    type,
    min = 1,
    max = 10,
    onSubmit,
    days = [],
    dayKeys = [],
}: EntitySliderProps) {
    const t = useTranslations("entity");
    const [selected, setSelected] = useState<number>(
        type === "days" ? 0 : Math.floor((max - min) / 2) + min
    );
    const containerRef = useRef<HTMLDivElement>(null);
    const itemsRef = useRef<(HTMLButtonElement | null)[]>([]);

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
            // Auto-focus the container so keyboard navigation works immediately
            setTimeout(() => {
                containerRef.current?.focus();
            }, 600);
        }
    }, []);

    useEffect(() => {
        // Animate items on selection change
        itemsRef.current.forEach((item, index) => {
            if (!item) return;

            const isSelected = type === "days" ? index === selected : min + index === selected;

            if (isSelected) {
                gsap.to(item, {
                    scale: 1,
                    opacity: 1,
                    duration: 0.3,
                    ease: "power2.out",
                });
            } else {
                gsap.to(item, {
                    scale: 0.85,
                    opacity: 0.3,
                    duration: 0.3,
                    ease: "power2.out",
                });
            }
        });
    }, [selected, type, min]);

    const handleSubmit = () => {
        if (type === "days") {
            onSubmit(dayKeys[selected]);
        } else {
            onSubmit(String(selected));
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        const itemsLength = type === "days" ? days.length : max - min + 1;

        if (e.key === "ArrowLeft") {
            e.preventDefault();
            if (type === "days") {
                setSelected((prev) => (prev > 0 ? prev - 1 : itemsLength - 1));
            } else {
                setSelected((prev) => (prev > min ? prev - 1 : max));
            }
        } else if (e.key === "ArrowRight") {
            e.preventDefault();
            if (type === "days") {
                setSelected((prev) => (prev < itemsLength - 1 ? prev + 1 : 0));
            } else {
                setSelected((prev) => (prev < max ? prev + 1 : min));
            }
        } else if (e.key === "Enter") {
            e.preventDefault();
            handleSubmit();
        }
    };

    const items =
        type === "days"
            ? days
            : Array.from({ length: max - min + 1 }, (_, i) => String(min + i));

    return (
        <div
            ref={containerRef}
            className="w-full max-w-3xl outline-none focus:outline-none"
            style={{ opacity: 0 }}
            onKeyDown={handleKeyDown}
            tabIndex={0}
        >
            {/* Main display */}
            <div className="flex flex-col items-center gap-12">
                {/* Selected value display */}
                <div className="text-center">
                    <div className="text-6xl sm:text-8xl font-mono text-white tracking-wider">
                        {type === "days" ? days[selected] : selected}
                    </div>
                </div>

                {/* Items list */}
                <div className="flex items-center justify-center gap-1 sm:gap-2 flex-wrap max-w-full px-4">
                    {items.map((item, index) => {
                        const isSelected =
                            type === "days"
                                ? index === selected
                                : min + index === selected;
                        return (
                            <button
                                key={item}
                                ref={(el) => {
                                    itemsRef.current[index] = el;
                                }}
                                onClick={() =>
                                    setSelected(
                                        type === "days" ? index : min + index
                                    )
                                }
                                className={`
                                    relative px-2 py-1 sm:px-3 sm:py-2 font-mono text-xs sm:text-sm
                                    transition-all duration-300
                                    ${
                                        isSelected
                                            ? "text-white"
                                            : "text-white/20 hover:text-white/40"
                                    }
                                `}
                                style={{
                                    opacity: isSelected ? 1 : 0.3,
                                    transform: isSelected ? "scale(1)" : "scale(0.85)",
                                }}
                            >
                                {type === "days" ? item.substring(0, 3).toUpperCase() : item}

                                {/* Selection indicator */}
                                {isSelected && (
                                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full" />
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Keyboard hint */}
                <div className="text-white/50 text-sm font-mono text-center">
                    ← → {t("pressEnter")}
                </div>
            </div>

            {/* Confirm button */}
            <button
                onClick={handleSubmit}
                className="mt-12 block mx-auto px-8 py-3 text-white/40 text-sm font-mono hover:text-white border border-white/10 hover:border-white/30 transition-all duration-300"
            >
                {t("confirm")}
            </button>
        </div>
    );
}
