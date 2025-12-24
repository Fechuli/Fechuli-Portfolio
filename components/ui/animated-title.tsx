"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { usePageTransition } from "@/lib/transition-context";

gsap.registerPlugin(SplitText);

interface AnimatedTitleProps {
    children: string;
    className?: string;
    delay?: number;
    as?: "h1" | "h2" | "h3";
    waitForTransition?: boolean;
}

export default function AnimatedTitle({
    children,
    className = "",
    delay = 0.3,
    as: Tag = "h1",
    waitForTransition = true,
}: AnimatedTitleProps) {
    const titleRef = useRef<HTMLHeadingElement>(null);
    const [fontLoaded, setFontLoaded] = useState(false);
    const { isTransitioning } = usePageTransition();

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
        if (waitForTransition && isTransitioning) return;

        const tl = gsap.timeline({ delay });

        tl.set(titleRef.current, { opacity: 1 });

        const split = new SplitText(titleRef.current, { type: "chars" });
        const chars = split.chars;

        if (!chars || chars.length === 0) return;

        gsap.set(chars, {
            opacity: 0,
            x: -20,
            transformOrigin: "left center",
        });

        chars.forEach((char, i) => {
            tl.to(
                char,
                {
                    opacity: 1,
                    x: 0,
                    duration: 0.4,
                    ease: "power2.out",
                },
                i * 0.03
            );
        });

        return () => {
            tl.kill();
            split.revert();
        };
    }, [fontLoaded, delay, isTransitioning, waitForTransition]);

    return (
        <Tag
            ref={titleRef}
            className={`font-bold leading-[0.9] opacity-0 tracking-[-0.07em] ${className}`}
        >
            {children}
        </Tag>
    );
}
