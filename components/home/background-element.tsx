"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Position = {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
};

interface BackgroundElementProps {
    type: "image" | "text";
    src?: string;
    content?: string;
    position: Position;
    blur: number;
    opacity: number;
    size?: number;
    rotate?: number;
    parallaxSpeed?: number;
}

export default function BackgroundElement({
    type,
    src,
    content,
    position,
    blur,
    opacity,
    size = 150,
    rotate = 0,
    parallaxSpeed = 1.5,
}: BackgroundElementProps) {
    const elementRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const element = elementRef.current;
        if (!element) return;

        gsap.set(element, { yPercent: -30 });

        const animation = gsap.to(element, {
            yPercent: 30,
            ease: "none",
            scrollTrigger: {
                trigger: element,
                start: "top bottom",
                end: "bottom top",
                scrub: parallaxSpeed,
            },
        });

        return () => {
            animation.kill();
        };
    }, [parallaxSpeed]);

    const positionStyles: React.CSSProperties = {
        position: "absolute",
        ...position,
        filter: `blur(${blur}px)`,
        opacity,
        transform: `rotate(${rotate}deg)`,
        pointerEvents: "none",
        zIndex: 0,
    };

    if (type === "image" && src) {
        return (
            <div
                ref={elementRef}
                className="hidden md:block"
                style={{
                    ...positionStyles,
                    width: size,
                    height: size,
                }}
            >
                <Image
                    src={src}
                    alt=""
                    fill
                    className="object-cover"
                    sizes={`${size}px`}
                />
            </div>
        );
    }

    if (type === "text" && content) {
        return (
            <div
                ref={elementRef}
                className="hidden md:block font-mono text-[#FFF5F5] text-sm whitespace-nowrap"
                style={positionStyles}
            >
                {content}
            </div>
        );
    }

    return null;
}
