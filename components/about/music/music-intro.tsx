"use client";

import { useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

export default function MusicIntro() {
    const t = useTranslations("music.intro");
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
        if (!containerRef.current || !textRef.current) return;

        const container = containerRef.current;

        gsap.set(textRef.current, { opacity: 1 });

        const split = new SplitText(textRef.current, { type: "chars" });
        const chars = split.chars;

        if (!chars || chars.length === 0) return;

        gsap.set(chars, {
            opacity: 0,
            x: -20,
        });

        ScrollTrigger.create({
            trigger: container,
            start: "top 75%",
            onEnter: () => {
                chars.forEach((char, i) => {
                    gsap.to(char, {
                        opacity: 1,
                        x: 0,
                        duration: 0.3,
                        delay: i * 0.015,
                        ease: "power2.out",
                    });
                });
            },
        });

        return () => {
            split.revert();
            ScrollTrigger.getAll().forEach((trigger) => {
                if (trigger.trigger === container) {
                    trigger.kill();
                }
            });
        };
    }, []);

    const title = t("title");

    return (
        <div
            ref={containerRef}
            data-navbar-theme="light"
            className="bg-[#FFF5F5] text-[#330014] py-20 sm:py-32 px-6 sm:px-12 md:px-20"
        >
            <div className="max-w-4xl mx-auto">
                {title && (
                    <h2 className="resin text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-8 sm:mb-12">
                        {title}
                    </h2>
                )}
                <p
                    ref={textRef}
                    className="arimo text-base sm:text-lg md:text-xl leading-relaxed opacity-0"
                >
                    {t("text")}
                </p>
            </div>
        </div>
    );
}
