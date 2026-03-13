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
    const [isFocused, setIsFocused] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const borderRef = useRef<HTMLDivElement>(null);
    const labelRef = useRef<HTMLLabelElement>(null);

    useEffect(() => {
        if (containerRef.current && labelRef.current && borderRef.current) {
            const tl = gsap.timeline({ delay: 0.3 });

            tl.fromTo(
                containerRef.current,
                {
                    opacity: 0,
                    y: 20,
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: "power3.out",
                }
            )
                .fromTo(
                    labelRef.current,
                    { opacity: 0 },
                    { opacity: 1, duration: 0.6, ease: "power2.out" },
                    "-=0.5"
                )
                .fromTo(
                    borderRef.current,
                    { scaleX: 0 },
                    { scaleX: 1, duration: 0.8, ease: "power2.inOut" },
                    "-=0.6"
                );
        }

        inputRef.current?.focus();
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (validate && !validate(value)) {
            setError(true);

            if (containerRef.current && borderRef.current) {
                gsap.to(containerRef.current, {
                    keyframes: [
                        { x: -8, duration: 0.08 },
                        { x: 8, duration: 0.08 },
                        { x: -6, duration: 0.08 },
                        { x: 6, duration: 0.08 },
                        { x: 0, duration: 0.08 },
                    ],
                    ease: "power2.out",
                });

                gsap.to(borderRef.current, {
                    opacity: 0.3,
                    duration: 0.1,
                    yoyo: true,
                    repeat: 3,
                });
            }

            setTimeout(() => setError(false), 2000);
            return;
        }

        if (containerRef.current) {
            gsap.to(containerRef.current, {
                opacity: 0.5,
                duration: 0.25,
                ease: "power2.in",
                onComplete: () => onSubmit(value),
            });
        } else {
            onSubmit(value);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = noSpaces
            ? e.target.value.replace(/\s/g, "")
            : e.target.value;
        setValue(newValue);
        setError(false);
    };

    const handleFocus = () => {
        setIsFocused(true);

        if (labelRef.current) {
            gsap.to(labelRef.current, {
                y: -36,
                scale: 0.8,
                opacity: 0.6,
                duration: 0.35,
                ease: "power2.out",
            });
        }

        if (borderRef.current) {
            gsap.to(borderRef.current, {
                scaleY: 2,
                duration: 0.35,
                ease: "power2.out",
            });
        }
    };

    const handleBlur = () => {
        if (!value) {
            setIsFocused(false);

            if (labelRef.current) {
                gsap.to(labelRef.current, {
                    y: 0,
                    scale: 1,
                    opacity: 0.3,
                    duration: 0.35,
                    ease: "power2.out",
                });
            }
        }

        if (borderRef.current) {
            gsap.to(borderRef.current, {
                scaleY: 1,
                duration: 0.35,
                ease: "power2.out",
            });
        }
    };

    const hasValue = value.length > 0 || isFocused;

    return (
        <div className="w-full max-w-xl">
            <div
                ref={containerRef}
                className="relative"
                style={{ opacity: 0 }}
            >
                <form onSubmit={handleSubmit} className="relative">
                    <label
                        ref={labelRef}
                        htmlFor="entity-input"
                        className={`
                            absolute left-0 top-0
                            text-lg
                            text-white
                            pointer-events-none
                            origin-left
                            transition-opacity duration-200
                            ${hasValue ? "opacity-60" : "opacity-30"}
                            ${error ? "opacity-40" : ""}
                        `}
                        style={{
                            fontFamily: "'Geist Mono', 'Courier New', monospace",
                            fontWeight: 400,
                            letterSpacing: "0.05em",
                        }}
                    >
                        {placeholder}
                    </label>

                    <input
                        id="entity-input"
                        ref={inputRef}
                        type="text"
                        value={value}
                        onChange={handleChange}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        className={`
                            w-full bg-transparent
                            text-white text-5xl md:text-6xl
                            pt-1 pb-4 px-0
                            outline-none border-0
                            transition-opacity duration-200
                            ${error ? "opacity-50" : ""}
                        `}
                        style={{
                            fontFamily: "'Geist Mono', 'Courier New', monospace",
                            fontWeight: 300,
                            letterSpacing: "-0.02em",
                        }}
                        autoComplete="off"
                        spellCheck={false}
                        aria-invalid={error}
                        aria-describedby={error ? "input-error" : undefined}
                    />

                    <div
                        ref={borderRef}
                        className={`
                            absolute bottom-0 left-0 right-0 h-px
                            origin-bottom
                            transition-all duration-200
                            ${error ? "bg-white/40" : isFocused ? "bg-white" : "bg-white/20"}
                        `}
                        style={{
                            transformOrigin: "center bottom",
                        }}
                    />

                    {/* Character Count */}
                    {value.length > 0 && (
                        <div
                            className="absolute -right-16 top-1 text-white/20 text-xs tabular-nums"
                            style={{
                                fontFamily: "'Geist Mono', 'Courier New', monospace",
                                fontWeight: 300,
                            }}
                        >
                            {value.length}
                        </div>
                    )}
                </form>

                {error && (
                    <p
                        id="input-error"
                        className="mt-3 text-white/50 text-xs tracking-wide"
                        style={{
                            fontFamily: "'Geist Mono', 'Courier New', monospace",
                            fontWeight: 400,
                        }}
                        role="alert"
                    >
                        {t("errorNoSpaces")}
                    </p>
                )}

                <div className="mt-6 flex items-center gap-2">
                    <div
                        className={`
                            text-white/20 text-xs tracking-wider uppercase
                            transition-all duration-300
                            ${value.length > 0 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"}
                        `}
                        style={{
                            fontFamily: "'Geist Mono', 'Courier New', monospace",
                            fontWeight: 400,
                        }}
                    >
                        {t("pressEnter")}
                    </div>

                    {value.length > 0 && (
                        <div className="flex items-center">
                            <svg
                                width="12"
                                height="12"
                                viewBox="0 0 12 12"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="square"
                                className="text-white/20"
                            >
                                <path d="M2 6h8M6 2l4 4-4 4" />
                            </svg>
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
                @import url("https://fonts.googleapis.com/css2?family=Geist+Mono:wght@300;400;500&display=swap");

                input:focus-visible {
                    outline: none;
                }
            `}</style>
        </div>
    );
}
