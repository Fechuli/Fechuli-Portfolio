"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

interface SectionTitleProps {
    children: string;
    className?: string;
}

export default function SectionTitle({ children, className = "" }: SectionTitleProps) {
    const titleRef = useRef<HTMLHeadingElement>(null);
    const [fontLoaded, setFontLoaded] = useState(false);

    useEffect(() => {
        const loadFont = async () => {
            try {
                await document.fonts.load("1em Resin");
                await document.fonts.ready;
                setFontLoaded(true);
            } catch {
                setTimeout(() => setFontLoaded(true), 500);
            }
        };
        loadFont();
    }, []);

    useEffect(() => {
        if (!titleRef.current || !fontLoaded) return;

        const split = new SplitText(titleRef.current, { type: "chars" });
        const chars = split.chars;

        if (!chars || chars.length === 0) return;

        gsap.set(chars, {
            opacity: 0,
            x: -20,
            transformOrigin: "left center",
        });

        gsap.to(chars, {
            opacity: 1,
            x: 0,
            duration: 0.4,
            ease: "power2.out",
            stagger: 0.03,
            scrollTrigger: {
                trigger: titleRef.current,
                start: "top 80%",
                toggleActions: "play none none none",
            },
        });

        return () => {
            split.revert();
        };
    }, [fontLoaded]);

    return (
        <h2
            ref={titleRef}
            className={`text-4xl sm:text-6xl md:text-8xl lg:text-[11rem] tracking-[-0.06em] font-semibold mb-12 sm:mb-16 md:mb-24 ${className}`}
        >
            {children}
        </h2>
    );
}
