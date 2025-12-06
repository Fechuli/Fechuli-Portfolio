"use client";

import { useEffect, useRef, useLayoutEffect } from "react";
import gsap from "gsap";

interface EntityQuestionProps {
    text: string | string[];
    onComplete?: () => void;
    pauseAfter?: number;
}

export default function EntityQuestion({
    text,
    onComplete,
    pauseAfter = 1500,
}: EntityQuestionProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const timelineRef = useRef<gsap.core.Timeline | null>(null);
    const prevTextKeyRef = useRef<string>("");

    const lines = Array.isArray(text) ? text : [text];
    const textKey = JSON.stringify(text);

    useLayoutEffect(() => {
        if (timelineRef.current) {
            timelineRef.current.kill();
            timelineRef.current = null;
        }

        const container = containerRef.current;
        if (!container) return;

        const lineElements = container.querySelectorAll(".entity-line");
        gsap.set(lineElements, { opacity: 0, y: 20 });

        prevTextKeyRef.current = textKey;
    }, [textKey]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const lineElements = container.querySelectorAll(".entity-line");
        if (lineElements.length === 0) return;

        const tl = gsap.timeline({
            onComplete: () => {
                setTimeout(() => {
                    onComplete?.();
                }, pauseAfter);
            },
        });

        timelineRef.current = tl;

        lineElements.forEach((line, index) => {
            tl.to(
                line,
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    ease: "power2.out",
                },
                index * 0.3
            );
        });

        return () => {
            tl.kill();
        };
    }, [textKey, onComplete, pauseAfter]);

    return (
        <div ref={containerRef} className="space-y-2">
            {lines.map((line, index) => (
                <div
                    key={`${textKey}-${index}`}
                    className="entity-line text-white/70 text-xl sm:text-2xl font-mono"
                    style={{ opacity: 0, transform: 'translateY(20px)' }}
                >
                    {line || "\u00A0"}
                </div>
            ))}
        </div>
    );
}
