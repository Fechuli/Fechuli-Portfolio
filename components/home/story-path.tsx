"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type AnchorConfig = {
    id: string;
    position:
        | "top-left"
        | "top-right"
        | "bottom-left"
        | "bottom-right"
        | "center-left"
        | "center-right"
        | "top-center"
        | "bottom-center";
    offsetX?: number;
    offsetY?: number;
};

const ANCHORS: AnchorConfig[] = [
    { id: "anchor-1", position: "bottom-left", offsetX: 0, offsetY: 30 },
    { id: "anchor-1b", position: "bottom-right", offsetX: 0, offsetY: 30 },
    { id: "anchor-2", position: "center-right", offsetX: 50 },
    { id: "anchor-3b", position: "top-left", offsetX: 100 },
    { id: "anchor-6", position: "center-right", offsetX: 15 },
    { id: "anchor-7", position: "bottom-left", offsetX: -10, offsetY: 100 },
    { id: "anchor-9", position: "top-left", offsetX: 0 },
    { id: "anchor-9b", position: "top-right", offsetX: 0 },
    { id: "anchor-10", position: "center-right", offsetX: 30 },
];

const DEBUG_MODE = true;

export default function StoryPath() {
    const pathRef = useRef<SVGPathElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [points, setPoints] = useState<
        { x: number; y: number; id: string }[]
    >([]);
    const [containerHeight, setContainerHeight] = useState(0);

    const calculatePoints = useCallback(() => {
        const container = containerRef.current?.parentElement;
        if (!container) return;

        const containerRect = container.getBoundingClientRect();
        const scrollTop = window.scrollY;
        const containerTop = containerRect.top + scrollTop;

        const newPoints: { x: number; y: number; id: string }[] = [];

        ANCHORS.forEach((anchor) => {
            const element = container.querySelector(
                `[data-anchor="${anchor.id}"]`
            );
            if (!element) return;

            const rect = element.getBoundingClientRect();
            const elementTop = rect.top + scrollTop - containerTop;
            const elementLeft = rect.left - containerRect.left;

            let x = 0;
            let y = 0;

            switch (anchor.position) {
                case "top-left":
                    x = elementLeft;
                    y = elementTop;
                    break;
                case "top-right":
                    x = elementLeft + rect.width;
                    y = elementTop;
                    break;
                case "bottom-left":
                    x = elementLeft;
                    y = elementTop + rect.height;
                    break;
                case "bottom-right":
                    x = elementLeft + rect.width;
                    y = elementTop + rect.height;
                    break;
                case "center-left":
                    x = elementLeft;
                    y = elementTop + rect.height / 2;
                    break;
                case "center-right":
                    x = elementLeft + rect.width;
                    y = elementTop + rect.height / 2;
                    break;
                case "top-center":
                    x = elementLeft + rect.width / 2;
                    y = elementTop;
                    break;
                case "bottom-center":
                    x = elementLeft + rect.width / 2;
                    y = elementTop + rect.height;
                    break;
            }

            if (anchor.offsetX) {
                x += (anchor.offsetX / 100) * containerRect.width;
            }
            if (anchor.offsetY) {
                y += anchor.offsetY;
            }

            newPoints.push({ x, y, id: anchor.id });
        });

        setPoints(newPoints);
        setContainerHeight(container.scrollHeight);
    }, []);

    useEffect(() => {
        const handleResize = () => {
            calculatePoints();
            ScrollTrigger.refresh();
        };

        window.addEventListener("resize", handleResize);

        const timeouts = [
            setTimeout(calculatePoints, 0),
            setTimeout(calculatePoints, 100),
            setTimeout(calculatePoints, 500),
            setTimeout(calculatePoints, 1000),
        ];

        const observer = new ResizeObserver(() => {
            calculatePoints();
        });

        if (containerRef.current?.parentElement) {
            observer.observe(containerRef.current.parentElement);
        }

        return () => {
            window.removeEventListener("resize", handleResize);
            timeouts.forEach(clearTimeout);
            observer.disconnect();
        };
    }, [calculatePoints]);

    const generatePath = useCallback(() => {
        if (points.length === 0) return "";

        let pathD = `M ${points[0].x} ${points[0].y}`;

        for (let i = 1; i < points.length; i++) {
            pathD += ` L ${points[i].x} ${points[i].y}`;
        }

        return pathD;
    }, [points]);

    useEffect(() => {
        if (!pathRef.current || points.length === 0) return;

        const path = pathRef.current;
        const length = path.getTotalLength();
        const container = containerRef.current?.parentElement;
        if (!container) return;

        const firstPointY = points[0].y;
        const lastPointY = points[points.length - 1].y;

        gsap.set(path, {
            strokeDasharray: length,
            strokeDashoffset: length,
        });

        const animation = gsap.to(path, {
            strokeDashoffset: 0,
            ease: "none",
            scrollTrigger: {
                trigger: container,
                start: `top+=${firstPointY - 200} bottom`,
                end: `top+=${lastPointY} center`,
                scrub: true,
                invalidateOnRefresh: true,
            },
        });

        return () => {
            animation.kill();
        };
    }, [points]);

    return (
        <div
            ref={containerRef}
            className="absolute inset-0 pointer-events-none hidden md:block z-0"
        >
            <svg
                className="absolute inset-0 w-full"
                style={{
                    overflow: "visible",
                    height: containerHeight || "100%",
                }}
            >
                <path
                    ref={pathRef}
                    d={generatePath()}
                    fill="none"
                    stroke="rgba(255, 245, 245, 0.3)"
                    strokeWidth="1"
                    strokeLinecap="square"
                    strokeLinejoin="miter"
                />

                {DEBUG_MODE &&
                    points
                        .filter((point) => ["anchor-2", "anchor-1b", "anchor-6", "anchor-7"].includes(point.id))
                        .map((point) => (
                            <g key={point.id}>
                                <circle
                                    cx={point.x}
                                    cy={point.y}
                                    r="20"
                                    fill="#330014"
                                    stroke="#fff5f540"
                                />
                            </g>
                        ))}
            </svg>
        </div>
    );
}
