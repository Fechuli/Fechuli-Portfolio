"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

export default function LibraryIntro() {
    const t = useTranslations("library");
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLParagraphElement>(null);
    const [fontLoaded, setFontLoaded] = useState(false);

    useEffect(() => {
        const loadFont = async () => {
            try {
                await document.fonts.ready;
                setFontLoaded(true);
            } catch {
                setTimeout(() => setFontLoaded(true), 500);
            }
        };
        loadFont();
    }, []);

    useEffect(() => {
        if (!containerRef.current || !textRef.current || !fontLoaded) return;

        const split = new SplitText(textRef.current, {
            type: "words,chars",
            wordsClass: "inline-block",
        });
        const chars = split.chars;

        if (!chars || chars.length === 0) return;

        gsap.set(textRef.current, { opacity: 1 });
        gsap.set(chars, {
            opacity: 0,
            x: -15,
            transformOrigin: "left center",
        });

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 75%",
                end: "top 25%",
                toggleActions: "play none none reverse",
            },
        });

        chars.forEach((char, i) => {
            tl.to(
                char,
                {
                    opacity: 1,
                    x: 0,
                    duration: 0.3,
                    ease: "power2.out",
                },
                i * 0.015
            );
        });

        return () => {
            tl.kill();
            split.revert();
            ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        };
    }, [fontLoaded]);

    return (
        <div
            ref={containerRef}
            data-navbar-theme="dark"
            className="bg-[#330014] py-32 lg:py-40 px-8 lg:px-16"
        >
            <p
                ref={textRef}
                className="text-[#FFF5F5]/60 text-2xl lg:text-3xl leading-relaxed font-light max-w-3xl mx-auto text-center opacity-0"
            >
                {t("intro")}
            </p>
        </div>
    );
}
