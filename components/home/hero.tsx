"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import InteractivePortrait from "../effects/interactive-portrait";
import PixelKnob from "../ui/pixel-knob";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { useLoader } from "@/lib/loader-context";

gsap.registerPlugin(SplitText);

export default function Hero() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef({ x: 0, y: 0, isOver: false });
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
    const renderRef = useRef<() => void>(() => {});
    const [fontLoaded, setFontLoaded] = useState(false);
    const [pixelSize, setPixelSize] = useState(50);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const akaRef = useRef<HTMLDivElement>(null);
    const fechuliContainerRef = useRef<HTMLDivElement>(null);
    const { isLoading } = useLoader();


    const PIXEL_SIZE = 4;
    const DISTORT_RADIUS = 80;
    const DISTORT_STRENGTH = 25;

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

    const initPixels = useCallback(() => {
        const canvas = canvasRef.current;
        const container = fechuliContainerRef.current;
        if (!canvas || !container || !fontLoaded) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const rect = container.getBoundingClientRect();
        const padding = DISTORT_STRENGTH + 10;
        canvas.width = rect.width + padding * 2;
        canvas.height = rect.height + padding * 2;

        // Calculate responsive font size based on viewport width
        const vw = window.innerWidth;
        const baseFontSize = vw < 768 ? vw * 0.12 : vw * 0.088;
        const fontSize = Math.min(baseFontSize, rect.height * 0.7);

        ctx.fillStyle = "#330014";
        ctx.font = `${fontSize}px "Resin", sans-serif`;
        ctx.textAlign = "right";
        ctx.textBaseline = "middle";
        ctx.fillText("Fechuli", canvas.width - padding, canvas.height / 2);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels: typeof pixelsRef.current = [];

        // Check if animation has already completed
        const initialAlpha = pixelsRef.current.length > 0 && pixelsRef.current[0].alpha > 0 ? 1 : 0;

        for (let y = 0; y < canvas.height; y += PIXEL_SIZE) {
            for (let x = 0; x < canvas.width; x += PIXEL_SIZE) {
                const i = (y * canvas.width + x) * 4;
                const alpha = imageData.data[i + 3];

                if (alpha > 128) {
                    pixels.push({
                        x,
                        y,
                        originX: x,
                        originY: y,
                        color: `rgba(51, 0, 20, ${0.7 * (alpha / 255)})`,
                        alpha: initialAlpha,
                    });
                }
            }
        }

        pixelsRef.current = pixels;
    }, [fontLoaded, PIXEL_SIZE, DISTORT_STRENGTH]);

    useEffect(() => {
        const render = () => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const { x: mouseX, y: mouseY, isOver } = mouseRef.current;

            pixelsRef.current.forEach((pixel) => {
                if (pixel.alpha <= 0) return;

                let drawX = pixel.originX;
                let drawY = pixel.originY;

                if (isOver) {
                    const dx = pixel.originX - mouseX;
                    const dy = pixel.originY - mouseY;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < DISTORT_RADIUS) {
                        const force =
                            (1 - distance / DISTORT_RADIUS) * DISTORT_STRENGTH;
                        const angle = Math.atan2(dy, dx);
                        drawX = pixel.originX + Math.cos(angle) * force;
                        drawY = pixel.originY + Math.sin(angle) * force;
                    }
                }

                pixel.x += (drawX - pixel.x) * 0.15;
                pixel.y += (drawY - pixel.y) * 0.15;

                ctx.globalAlpha = pixel.alpha;
                ctx.fillStyle = pixel.color;
                ctx.fillRect(pixel.x, pixel.y, PIXEL_SIZE - 1, PIXEL_SIZE - 1);
                ctx.globalAlpha = 1;
            });

            animationRef.current = requestAnimationFrame(render);
        };

        renderRef.current = render;

        if (!fontLoaded) return;

        initPixels();
        render();

        const handleResize = () => {
            initPixels();
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            cancelAnimationFrame(animationRef.current);
        };
    }, [initPixels, fontLoaded]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = fechuliContainerRef.current?.getBoundingClientRect();
        if (!rect) return;

        const padding = DISTORT_STRENGTH + 10;
        mouseRef.current = {
            x: e.clientX - rect.left + padding,
            y: e.clientY - rect.top + padding,
            isOver: true,
        };
    };

    const handleMouseLeave = () => {
        mouseRef.current.isOver = false;
    };

    useEffect(() => {
        if (isLoading || !titleRef.current || !akaRef.current || !fechuliContainerRef.current || !fontLoaded) return;

        const tl = gsap.timeline({ delay: 0.3 });

        tl.set(titleRef.current, { opacity: 1 });

        const split = new SplitText(titleRef.current, { type: "chars" });
        const chars = split.chars;

        if (!chars || chars.length === 0) {
            return;
        }

        gsap.set(chars, {
            opacity: 0,
            x: -20,
            transformOrigin: "left center"
        });

        chars.forEach((char, i) => {
            tl.to(char, {
                opacity: 1,
                x: 0,
                duration: 0.4,
                ease: "power2.out",
            }, i * 0.03);
        });

        // First: Container expands from w-0 to auto
        tl.to(akaRef.current, {
            width: "auto",
            duration: 0.6,
            ease: "power2.inOut",
        }, "+=0.2");

        tl.to(fechuliContainerRef.current, {
            opacity: 1,
            duration: 0.5,
            ease: "power2.out",
            onComplete: () => {
                const animatePixels = () => {
                    const pixels = pixelsRef.current;

                    if (pixels.length === 0) {
                        setTimeout(animatePixels, 50);
                        return;
                    }

                    // Create shuffled indices
                    const indices = pixels.map((_, i) => i);
                    for (let i = indices.length - 1; i > 0; i--) {
                        const j = Math.floor(Math.random() * (i + 1));
                        [indices[i], indices[j]] = [indices[j], indices[i]];
                    }

                    // Animate each particle
                    indices.forEach((index, i) => {
                        gsap.to(pixels[index], {
                            alpha: 1,
                            duration: 0.02,
                            delay: i * 0.003,
                            ease: "none",
                        });
                    });
                };

                animatePixels();
            }
        }, "+=0.1");

        return () => {
            tl.kill();
            split.revert();
        };
    }, [isLoading, fontLoaded]);

    return (
        <div className="text-[#330014] h-dvh flex flex-col items-center justify-between w-full relative pb-4 sm:pb-20 md:pb-26">
            <div className="absolute inset-0 w-screen h-dvh z-0">
                <InteractivePortrait
                    className="w-full h-full"
                    startAnimation={!isLoading}
                    pixelSize={pixelSize}
                />
            </div>

            <div className="flex flex-col items-end relative z-10 pointer-events-none w-full px-4 sm:-mx-4 sm:px-4 sm:w-[calc(100%+2rem)] pt-2 sm:pt-0 overflow-visible">
                <h1
                    ref={titleRef}
                    className="text-[11.5vw] sm:text-[12vw] md:text-[13vw] lg:text-[13.2vw] tracking-[-0.04em] font-bold leading-none opacity-0 whitespace-nowrap w-full text-right overflow-visible"
                >
                    Federico Fiaschi
                </h1>
                <div className="overflow-hidden mt-2 sm:mt-4" ref={akaRef} style={{ width: 0 }}>
                    <span className="bg-[#330014] text-[#FFF5F5] text-[11px] sm:text-sm md:text-base tracking-[0.35em] sm:tracking-[0.4em] uppercase arimo pl-1 sm:pl-2 block whitespace-nowrap">
                        aka
                    </span>
                </div>
                <div
                    ref={fechuliContainerRef}
                    className="pointer-events-auto relative -mt-2 sm:mt-2 w-[70vw] sm:w-[50vw] md:w-[35vw] h-[18vw] sm:h-[12vw] md:h-[8vw] overflow-visible opacity-0 -ml-10 sm:ml-0"
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                >
                    <canvas
                        ref={canvasRef}
                        className="absolute overflow-visible"
                        style={{
                            overflow: "visible",
                            top: -(DISTORT_STRENGTH + 10),
                            left: -(DISTORT_STRENGTH + 10),
                        }}
                    />
                </div>
            </div>

            <div className="relative z-10 self-center sm:self-end bg-[#FFF5F5] px-3 py-2.5 sm:px-6 sm:py-4">
                <PixelKnob
                    value={pixelSize}
                    onChange={setPixelSize}
                    min={5}
                    max={100}
                />
            </div>
        </div>
    );
}
