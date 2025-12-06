"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";

// Seeded random number generator for consistent results
function seededRandom(seed: number) {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
}

const emptySubscribe = () => () => {};

interface PixelTransitionProps {
    fromColor?: string;
    toColor?: string;
    rows?: number;
    pixelSize?: number;
}

export default function PixelTransition({
    fromColor = "#330014",
    toColor = "#FFF5F5",
    rows = 20,
    pixelSize = 8,
}: PixelTransitionProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const mounted = useSyncExternalStore(
        emptySubscribe,
        () => true,
        () => false
    );

    useEffect(() => {
        if (!mounted) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const updateCanvas = () => {
            const width = window.innerWidth;
            const height = rows * pixelSize;

            canvas.width = width;
            canvas.height = height;

            const cols = Math.ceil(width / pixelSize);

            const parseColor = (color: string) => {
                const hex = color.replace("#", "");
                return {
                    r: parseInt(hex.substring(0, 2), 16),
                    g: parseInt(hex.substring(2, 4), 16),
                    b: parseInt(hex.substring(4, 6), 16),
                };
            };

            const from = parseColor(fromColor);
            const to = parseColor(toColor);

            let seed = 12345;
            for (let row = 0; row < rows; row++) {
                const progress = row / (rows - 1);
                const density = Math.pow(progress, 1.3);

                for (let col = 0; col < cols; col++) {
                    const x = col * pixelSize;
                    const y = row * pixelSize;

                    seed++;
                    if (seededRandom(seed) < density) {
                        seed++;
                        const useToColor = seededRandom(seed) < progress;
                        ctx.fillStyle = useToColor ? `rgb(${to.r}, ${to.g}, ${to.b})` : `rgb(${from.r}, ${from.g}, ${from.b})`;
                        ctx.fillRect(x, y, pixelSize, pixelSize);
                    }
                }
            }
        };

        updateCanvas();

        window.addEventListener("resize", updateCanvas);
        return () => window.removeEventListener("resize", updateCanvas);
    }, [mounted, fromColor, toColor, rows, pixelSize]);

    // Don't render anything on server
    if (!mounted) {
        return <div style={{ height: rows * pixelSize }} className="w-full" />;
    }

    return (
        <canvas
            ref={canvasRef}
            className="w-full block rotate-180 "
            style={{ height: rows * pixelSize }}
        />
    );
}
