"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import gsap from "gsap";

interface InteractivePortraitProps {
    className?: string;
    startAnimation?: boolean;
    pixelSize?: number;
    noise?: number;
}

const IMAGE_MAP = {
    "top-left": "/images/hero/alto-sinistra.webp",
    top: "/images/hero/alto.webp",
    "top-right": "/images/hero/alto-destra.webp",
    left: "/images/hero/sinistra.webp",
    center: "/images/hero/dritto.webp",
    right: "/images/hero/destra.webp",
    "bottom-left": "/images/hero/basso-sinistra.webp",
    bottom: "/images/hero/basso.webp",
    "bottom-right": "/images/hero/basso-destra.webp",
} as const;

type ImagePosition = keyof typeof IMAGE_MAP;

export default function InteractivePortrait({
    className = "",
    startAnimation = false,
    pixelSize = 50,
    noise = 0,
}: InteractivePortraitProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [currentPosition, setCurrentPosition] =
        useState<ImagePosition>("center");
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const [hasAnimated, setHasAnimated] = useState(false);
    const imagesRef = useRef<Map<ImagePosition, HTMLImageElement>>(new Map());
    const pixelsRef = useRef<
        {
            x: number;
            y: number;
            originX: number;
            originY: number;
            color: string;
            alpha: number;
        }[]
    >([]);
    const animationRef = useRef<number>(0);

    const getImagePosition = (
        mouseX: number,
        mouseY: number
    ): ImagePosition => {
        if (!containerRef.current) return "center";

        const rect = containerRef.current.getBoundingClientRect();
        const x = mouseX - rect.left;
        const y = mouseY - rect.top;

        const width = rect.width;
        const height = rect.height;

        const thirdW = width / 3;
        const thirdH = height / 3;

        if (y < thirdH) {
            if (x < thirdW) return "top-left";
            if (x < thirdW * 2) return "top";
            return "top-right";
        } else if (y < thirdH * 2) {
            if (x < thirdW) return "left";
            if (x < thirdW * 2) return "center";
            return "right";
        } else {
            if (x < thirdW) return "bottom-left";
            if (x < thirdW * 2) return "bottom";
            return "bottom-right";
        }
    };

    const initPixels = useCallback(
        (img: HTMLImageElement) => {
            const canvas = canvasRef.current;
            const container = containerRef.current;
            if (!canvas || !container) return;

            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            const rect = container.getBoundingClientRect();

            canvas.width = rect.width;
            canvas.height = rect.height;

            const isMobile = window.innerWidth < 640;
            const portraitWidth = isMobile
                ? Math.min(rect.width * 0.85, rect.height * 0.95)
                : Math.min(rect.width * 0.6, rect.height * 0.7);
            const portraitHeight = Math.min(
                rect.height * 1,
                portraitWidth * 1.4
            );

            const imgAspect = img.width / img.height;

            let drawWidth = portraitWidth;
            let drawHeight = portraitWidth / imgAspect;

            if (drawHeight > portraitHeight) {
                drawHeight = portraitHeight;
                drawWidth = portraitHeight * imgAspect;
            }

            const drawX = (canvas.width - drawWidth) / 2;
            const drawY = (canvas.height - drawHeight) / 2;

            ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);

            const imageData = ctx.getImageData(
                0,
                0,
                canvas.width,
                canvas.height
            );
            const pixels: typeof pixelsRef.current = [];

            const initialAlpha = hasAnimated ? 1 : 0;

            for (let y = 0; y < canvas.height; y += pixelSize) {
                for (let x = 0; x < canvas.width; x += pixelSize) {
                    const i = (y * canvas.width + x) * 4;
                    const r = imageData.data[i];
                    const g = imageData.data[i + 1];
                    const b = imageData.data[i + 2];
                    const alpha = imageData.data[i + 3];

                    const grayscale = 0.299 * r + 0.587 * g + 0.114 * b;

                    if (alpha > 128 && grayscale < 220) {
                        const normalizedGray = 1 - grayscale / 255;
                        const pixelAlpha = Math.max(normalizedGray * 0.6, 0.15);

                        pixels.push({
                            x,
                            y,
                            originX: x,
                            originY: y,
                            color: `rgba(51, 0, 20, ${pixelAlpha})`,
                            alpha: initialAlpha,
                        });
                    }
                }
            }

            pixelsRef.current = pixels;
        },
        [pixelSize, hasAnimated]
    );

    useEffect(() => {
        let loadedCount = 0;
        Object.entries(IMAGE_MAP).forEach(([position, src]) => {
            const img = new Image();
            img.src = src;
            img.onload = () => {
                imagesRef.current.set(position as ImagePosition, img);
                loadedCount++;
                console.log(
                    "Image loaded:",
                    position,
                    "Total images:",
                    imagesRef.current.size
                );

                if (loadedCount === Object.keys(IMAGE_MAP).length) {
                    setImagesLoaded(true);
                }
            };
            img.onerror = () => {
                console.error("Failed to load image:", position, src);
            };
        });
    }, []);

    useEffect(() => {
        if (!imagesLoaded) return;
        const centerImg = imagesRef.current.get("center");
        if (centerImg) {
            initPixels(centerImg);
        }
    }, [imagesLoaded, initPixels]);

    useEffect(() => {
        const img = imagesRef.current.get(currentPosition);
        console.log(
            "Current position:",
            currentPosition,
            "Image loaded:",
            img?.complete,
            "Images in map:",
            imagesRef.current.size
        );
        if (img && img.complete) {
            initPixels(img);
        }
    }, [currentPosition, pixelSize, initPixels]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const noiseIntensity = noise / 100;
            const time = Date.now() * 0.001;

            const rowOffsets: Map<number, number> = new Map();

            pixelsRef.current.forEach((pixel) => {
                if (pixel.alpha <= 0) return;

                let drawX = pixel.x;
                let drawAlpha = pixel.alpha;

                if (noiseIntensity > 0) {
                    const rowKey = Math.floor(pixel.y / pixelSize);

                    if (!rowOffsets.has(rowKey)) {
                        const rowNoise =
                            Math.sin(pixel.y * 0.05 + time * 4) *
                            noiseIntensity *
                            12;
                        const glitchChance = Math.sin(time * 8 + rowKey * 0.3);

                        let offset = 0;
                        if (glitchChance > 0.6) {
                            offset = rowNoise;
                        }

                        const scanlineGlitch = Math.sin(
                            rowKey * 0.7 + time * 12
                        );
                        if (scanlineGlitch > 0.85 - noiseIntensity * 0.3) {
                            offset +=
                                noiseIntensity *
                                25 *
                                Math.sign(Math.sin(time * 20 + rowKey));
                        }

                        rowOffsets.set(rowKey, offset);
                    }

                    drawX += rowOffsets.get(rowKey) || 0;

                    if (Math.random() < noiseIntensity * 0.15) {
                        drawAlpha *= 0.6 + Math.random() * 0.4;
                    }
                }

                ctx.globalAlpha = drawAlpha;
                ctx.fillStyle = pixel.color;
                ctx.fillRect(drawX, pixel.y, pixelSize - 1, pixelSize - 1);
                ctx.globalAlpha = 1;
            });

            animationRef.current = requestAnimationFrame(render);
        };

        render();

        return () => {
            cancelAnimationFrame(animationRef.current);
        };
    }, [pixelSize, noise]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const newPosition = getImagePosition(e.clientX, e.clientY);
        if (newPosition !== currentPosition) {
            setCurrentPosition(newPosition);
        }
    };

    useEffect(() => {
        console.log("Animation check:", {
            startAnimation,
            pixelsLength: pixelsRef.current.length,
            hasAnimated,
            imagesLoaded,
        });

        if (
            !startAnimation ||
            pixelsRef.current.length === 0 ||
            hasAnimated ||
            !imagesLoaded
        )
            return;

        console.log("Starting portrait animation");
        const pixels = pixelsRef.current;
        const indices = pixels.map((_, i) => i);
        for (let i = indices.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [indices[i], indices[j]] = [indices[j], indices[i]];
        }

        indices.forEach((index, i) => {
            gsap.to(pixels[index], {
                alpha: 1,
                duration: 0.02,
                delay: i * 0.003,
                ease: "none",
                onComplete: () => {
                    if (i === indices.length - 1) {
                        setHasAnimated(true);
                        console.log("Portrait animation complete");
                    }
                },
            });
        });
    }, [startAnimation, hasAnimated, imagesLoaded]);

    return (
        <div
            ref={containerRef}
            className={`${className} relative`}
            onMouseMove={handleMouseMove}
        >
            <canvas
                ref={canvasRef}
                className="absolute top-0 left-0 w-full h-full"
                style={{
                    opacity: startAnimation && imagesLoaded ? 1 : 0,
                    transition: "opacity 0.3s ease-out",
                }}
            />
        </div>
    );
}
