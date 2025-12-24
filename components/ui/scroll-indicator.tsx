/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect, useRef } from "react";
import { useLenis } from "@/lib/lenis-context";
import { useNavbarTheme } from "@/lib/navbar-theme-context";
import { useTranslations } from "next-intl";
import gsap from "gsap";

export default function ScrollIndicator() {
    const [isVisible, setIsVisible] = useState(false);
    const [canShow, setCanShow] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const { lenis } = useLenis();
    const { theme } = useNavbarTheme();
    const t = useTranslations("scrollIndicator");
    const isDark = theme === "dark";

    useEffect(() => {
        const resetTimer = () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            setIsVisible(false);

            if (canShow) {
                timeoutRef.current = setTimeout(() => {
                    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
                    const currentScroll = window.scrollY;

                    if (scrollableHeight > 100 && currentScroll < scrollableHeight - 50) {
                        setIsVisible(true);
                    }
                }, 4000);
            }
        };

        const handleScroll = () => {
            resetTimer();
        };

        const handleInteraction = () => {
            resetTimer();
        };

        resetTimer();

        window.addEventListener("scroll", handleScroll, { passive: true });
        window.addEventListener("mousemove", handleInteraction, { passive: true });
        window.addEventListener("touchstart", handleInteraction, { passive: true });
        window.addEventListener("keydown", handleInteraction, { passive: true });

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("mousemove", handleInteraction);
            window.removeEventListener("touchstart", handleInteraction);
            window.removeEventListener("keydown", handleInteraction);
        };
    }, [canShow]);

    useEffect(() => {
        if (!containerRef.current) return;

        if (isVisible) {
            gsap.fromTo(
                containerRef.current,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
            );
        } else {
            gsap.to(containerRef.current, {
                opacity: 0,
                y: 20,
                duration: 0.3,
                ease: "power2.in",
            });
        }
    }, [isVisible]);

    const handleClick = () => {
        lenis?.scrollTo(window.scrollY + window.innerHeight * 0.8, {
            duration: 1.2,
        });
        setIsVisible(false);
    };

    const textColor = isDark ? "text-[#FFF5F5]" : "text-[#330014]";
    const borderColor = isDark ? "border-[#FFF5F5]" : "border-[#330014]";
    const bgColor = isDark ? "bg-[#FFF5F5]" : "bg-[#330014]";
    const iconColor = isDark ? "text-[#330014]" : "text-[#FFF5F5]";

    return (
        <div
            ref={containerRef}
            onClick={handleClick}
            className="hidden sm:flex fixed bottom-28 right-20 z-50 flex-col items-center gap-3 cursor-pointer opacity-0 group transition-colors duration-300"
        >
            <span className={`text-[10px] arimo tracking-widest uppercase whitespace-nowrap opacity-60 transition-colors duration-300 ${textColor}`}>
                {t("text")}
            </span>

            <div className="relative w-12 h-12 flex items-center justify-center">
                <span className={`absolute inset-0 rounded-full border ${borderColor} opacity-20 animate-ping-slow transition-colors duration-300`} />
                <span className={`absolute inset-1 rounded-full border ${borderColor} opacity-30 animate-ping-slower transition-colors duration-300`} />
                <span className={`absolute inset-2 rounded-full border ${borderColor} opacity-40 animate-ping-slowest transition-colors duration-300`} />

                <div className={`relative w-6 h-6 rounded-full ${bgColor} flex items-center justify-center group-hover:scale-110 transition-all duration-300`}>
                    <svg
                        className={`w-3 h-3 ${iconColor} animate-bounce-subtle transition-colors duration-300`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19 14l-7 7m0 0l-7-7m7 7V3"
                        />
                    </svg>
                </div>
            </div>
        </div>
    );
}
