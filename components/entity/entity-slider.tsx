"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import gsap from "gsap";

const DAYS_SHORT = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

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

    const handleSubmit = () => {
        if (type === "days") {
            // Return the day key for comparison, not the translated text
            onSubmit(dayKeys[selected]);
        } else {
            onSubmit(String(selected));
        }
    };

    // For days, show short labels; for numbers, show the numbers
    const items =
        type === "days"
            ? days.map(day => day.substring(0, 3).toUpperCase())
            : Array.from({ length: max - min + 1 }, (_, i) => String(min + i));

    return (
        <div
            ref={containerRef}
            className="w-full max-w-2xl"
            style={{ opacity: 0 }}
        >
            <div className="flex items-center justify-center gap-2 sm:gap-4">
                {items.map((item, index) => {
                    const isSelected =
                        type === "days"
                            ? index === selected
                            : min + index === selected;
                    return (
                        <button
                            key={item}
                            onClick={() =>
                                setSelected(
                                    type === "days" ? index : min + index
                                )
                            }
                            className={`
                                px-3 py-2 sm:px-4 sm:py-3 font-mono text-sm sm:text-base
                                transition-all duration-200
                                ${
                                    isSelected
                                        ? "text-black bg-white"
                                        : "text-white/40 hover:text-white/70"
                                }
                            `}
                        >
                            {item}
                        </button>
                    );
                })}
            </div>

            <div className="mt-8 relative h-0.5 bg-white/20">
                <div
                    className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full transition-all duration-200"
                    style={{
                        left: `${
                            (type === "days"
                                ? selected / (DAYS.length - 1)
                                : (selected - min) / (max - min)) * 100
                        }%`,
                        transform: "translate(-50%, -50%)",
                    }}
                />
            </div>

            <button
                onClick={handleSubmit}
                className="mt-8 block mx-auto text-white/40 text-sm font-mono hover:text-white/70 transition-colors"
            >
                {t("confirm")}
            </button>
        </div>
    );
}
