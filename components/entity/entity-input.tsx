"use client";

import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { useTranslations } from "next-intl";

interface EntityInputProps {
    onSubmit: (value: string) => void;
    validate?: (value: string) => boolean;
    placeholder?: string;
    noSpaces?: boolean;
}

export default function EntityInput({
    onSubmit,
    validate,
    placeholder = "",
    noSpaces = false,
}: EntityInputProps) {
    const t = useTranslations("entity");
    const [value, setValue] = useState("");
    const [error, setError] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

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
        inputRef.current?.focus();
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (validate && !validate(value)) {
            setError(true);
            if (containerRef.current) {
                gsap.to(containerRef.current, {
                    keyframes: [
                        { x: -10 },
                        { x: 10 },
                        { x: -10 },
                        { x: 10 },
                        { x: 0 },
                    ],
                    duration: 0.4,
                    ease: "power2.out",
                });
            }
            setTimeout(() => setError(false), 1000);
            return;
        }

        onSubmit(value);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = noSpaces
            ? e.target.value.replace(/\s/g, "")
            : e.target.value;
        setValue(newValue);
        setError(false);
    };

    return (
        <div
            ref={containerRef}
            className="w-full max-w-md"
            style={{ opacity: 0 }}
        >
            <form onSubmit={handleSubmit}>
                <div className="relative">
                    <input
                        ref={inputRef}
                        type="text"
                        value={value}
                        onChange={handleChange}
                        placeholder={placeholder}
                        className={`
                            w-full bg-transparent border-b-2
                            ${error ? "border-red-500" : "border-white/30"}
                            text-white text-4xl sm:text-5xl font-mono
                            py-4 px-2 outline-none
                            focus:border-white/60 transition-colors
                            placeholder:text-white/20
                        `}
                        autoComplete="off"
                        spellCheck={false}
                    />
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 text-white/30 text-2xl">
                        _
                    </div>
                </div>
                {error && (
                    <p className="text-red-500/70 text-sm mt-2 font-mono">
                        {t("errorNoSpaces")}
                    </p>
                )}
                <button
                    type="submit"
                    className="mt-8 text-white/40 text-sm font-mono hover:text-white/70 transition-colors"
                >
                    {t("pressEnter")}
                </button>
            </form>
        </div>
    );
}
