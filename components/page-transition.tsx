"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface PageTransitionProps {
    show: boolean;
}

export default function PageTransition({ show }: PageTransitionProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const redLayerRef = useRef<HTMLDivElement>(null);
    const greenLayerRef = useRef<HTMLDivElement>(null);
    const blueLayerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const container = containerRef.current;
        const redLayer = redLayerRef.current;
        const greenLayer = greenLayerRef.current;
        const blueLayer = blueLayerRef.current;

        if (show) {
            gsap.set(container, {
                visibility: "visible",
                x: "-100%",
                borderRadius: "0 50% 50% 0",
            });

            gsap.set([redLayer, greenLayer, blueLayer], { x: 0, y: 0 });

            const tl = gsap.timeline();

            tl.to(container, {
                x: "-30%",
                borderRadius: "0 40% 40% 0",
                duration: 0.25,
                ease: "power2.in",
            });

            tl.to(container, {
                x: "0%",
                borderRadius: "0 0 0 0",
                duration: 0.25,
                ease: "power2.out",
            });

            tl.to(
                redLayer,
                {
                    x: -12,
                    y: 3,
                    duration: 0.35,
                    ease: "power2.out",
                },
                0
            );

            tl.to(
                blueLayer,
                {
                    x: 12,
                    y: -3,
                    duration: 0.35,
                    ease: "power2.out",
                },
                0
            );

            tl.to(
                [redLayer, blueLayer],
                {
                    x: 0,
                    y: 0,
                    duration: 0.25,
                    ease: "power2.inOut",
                },
                0.35
            );
        } else {
            const tl = gsap.timeline({
                onComplete: () => {
                    gsap.set(container, {
                        visibility: "hidden",
                        x: "-100%",
                        borderRadius: "0 50% 50% 0",
                    });
                    gsap.set([redLayer, greenLayer, blueLayer], { x: 0, y: 0 });
                },
            });

            tl.to(
                redLayer,
                {
                    x: -15,
                    y: 4,
                    duration: 0.25,
                    ease: "power2.in",
                },
                0
            );

            tl.to(
                blueLayer,
                {
                    x: 15,
                    y: -4,
                    duration: 0.25,
                    ease: "power2.in",
                },
                0
            );

            tl.to(
                container,
                {
                    x: "30%",
                    borderRadius: "50% 0 0 50%",
                    duration: 0.25,
                    ease: "power2.in",
                },
                0.1
            );

            tl.to(container, {
                x: "100%",
                borderRadius: "50% 0 0 50%",
                duration: 0.25,
                ease: "power2.out",
            });
        }
    }, [show]);

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-9999 pointer-events-none overflow-hidden"
            style={{
                visibility: "hidden",
                transform: "translateX(-100%)",
                borderRadius: "0 50% 50% 0",
            }}
        >
            <div
                ref={redLayerRef}
                className="absolute inset-0"
                style={{ mixBlendMode: "screen" }}
            >
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                    style={{ filter: "url(#redChannel)" }}
                >
                    <source src="/video/static.webm" type="video/webm" />
                </video>
            </div>

            <div
                ref={greenLayerRef}
                className="absolute inset-0"
                style={{ mixBlendMode: "screen" }}
            >
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                    style={{ filter: "url(#greenChannel)" }}
                >
                    <source src="/video/static.webm" type="video/webm" />
                </video>
            </div>

            <div
                ref={blueLayerRef}
                className="absolute inset-0"
                style={{ mixBlendMode: "screen" }}
            >
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                    style={{ filter: "url(#blueChannel)" }}
                >
                    <source src="/video/static.webm" type="video/webm" />
                </video>
            </div>

            <svg className="absolute w-0 h-0">
                <defs>
                    <filter id="redChannel">
                        <feColorMatrix
                            type="matrix"
                            values="1 0 0 0 0
                                    0 0 0 0 0
                                    0 0 0 0 0
                                    0 0 0 1 0"
                        />
                    </filter>
                    <filter id="greenChannel">
                        <feColorMatrix
                            type="matrix"
                            values="0 0 0 0 0
                                    0 1 0 0 0
                                    0 0 0 0 0
                                    0 0 0 1 0"
                        />
                    </filter>
                    <filter id="blueChannel">
                        <feColorMatrix
                            type="matrix"
                            values="0 0 0 0 0
                                    0 0 0 0 0
                                    0 0 1 0 0
                                    0 0 0 1 0"
                        />
                    </filter>
                </defs>
            </svg>
        </div>
    );
}
