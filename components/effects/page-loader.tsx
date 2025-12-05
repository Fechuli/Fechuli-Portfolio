"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";

interface PageLoaderProps {
    onComplete?: () => void;
}

const GRID_SIZE = 60;

export default function PageLoader({ onComplete }: PageLoaderProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const logoContainerRef = useRef<HTMLDivElement>(null);
    const pathsRef = useRef<(SVGPathElement | null)[]>([]);
    const loaderBarRef = useRef<HTMLDivElement>(null);
    const loaderBarFillRef = useRef<HTMLDivElement>(null);
    const percentageRef = useRef<HTMLSpanElement>(null);
    const decorationsRef = useRef<HTMLDivElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);
    const cellsRef = useRef<Map<string, HTMLDivElement>>(new Map());
    const [isComplete, setIsComplete] = useState(false);
    const [timecode, setTimecode] = useState("00:00:00:00");
    const [frameCount, setFrameCount] = useState(0);
    const timecodeIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const randomGlowIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const [gridDimensions, setGridDimensions] = useState({ cols: 0, rows: 0 });
    const [gridOffset, setGridOffset] = useState({ x: 0, y: 0 });

    const paths = [
        "M48.9 33H16.4V0.469971H26.62C32.529 0.469971 38.1961 2.81732 42.3744 6.99563C46.5527 11.1739 48.9 16.8409 48.9 22.75V33Z",
        "M46.26 34.5799H14.86V3.16992H25C27.7914 3.16861 30.5558 3.71729 33.1351 4.78461C35.7144 5.85194 38.0582 7.41699 40.0325 9.39037C42.0068 11.3637 43.5729 13.7068 44.6415 16.2856C45.71 18.8644 46.26 21.6285 46.26 24.4199V34.5799Z",
        "M43.62 36.1801H13.32V5.87012H23.4C26.0553 5.87012 28.6847 6.39312 31.1379 7.40927C33.5911 8.42542 35.8201 9.91482 37.6977 11.7924C39.5753 13.67 41.0647 15.8991 42.0809 18.3523C43.097 20.8055 43.62 23.4348 43.62 26.0901V36.1801Z",
        "M41 37.7801H11.78V8.57008H21.78C24.3031 8.56745 26.8019 9.06213 29.1337 10.0258C31.4655 10.9896 33.5844 12.4034 35.3694 14.1866C37.1544 15.9697 38.5705 18.0872 39.5366 20.4179C40.5027 22.7487 41 25.247 41 27.7701V37.7801Z",
        "M38.35 39.38H10.24V11.27H20.18C24.9982 11.2727 29.6182 13.1879 33.0252 16.5948C36.4322 20.0018 38.3473 24.6218 38.35 29.44V39.38Z",
        "M35.71 41H8.70001V14H18.57C23.1106 14 27.4657 15.8017 30.6792 19.0096C33.8927 22.2175 35.7021 26.5694 35.71 31.11V41Z",
        "M33.07 42.5899H7.15997V16.6699H17C21.2666 16.6832 25.3539 18.3873 28.3662 21.409C31.3785 24.4307 33.07 28.5233 33.07 32.7899V42.5899Z",
        "M30.44 44.1901H5.62V19.3701H15.35C19.3513 19.3728 23.188 20.9635 26.0173 23.7928C28.8467 26.6222 30.4373 30.4588 30.44 34.4601V44.1901Z",
        "M27.8 45.7901H4.08002V22.0701H13.74C17.4699 22.0727 21.0461 23.5563 23.6825 26.1946C26.319 28.833 27.8 32.4102 27.8 36.1401V45.7901Z",
        "M25.16 47.4H2.53998V24.77H12.13C13.8372 24.77 15.5276 25.1063 17.1049 25.7596C18.6821 26.4129 20.1152 27.3705 21.3224 28.5776C22.5295 29.7848 23.4871 31.2179 24.1404 32.7951C24.7937 34.3724 25.13 36.0628 25.13 37.77L25.16 47.4Z",
        "M22.53 49H1V27.47H10.52C13.7026 27.47 16.7548 28.7343 19.0053 30.9847C21.2557 33.2351 22.52 36.2874 22.52 39.47L22.53 49Z",
    ];

    const strokeWidths = [
        0.43, 0.43, 0.44, 0.45, 0.46, 0.46, 0.47, 0.48, 0.49, 0.49, 0.5,
    ];

    const glowCell = useCallback((cell: HTMLDivElement) => {
        gsap.to(cell, {
            backgroundColor: "rgba(255, 245, 245, 0.25)",
            duration: 0.15,
            ease: "power2.out",
            onComplete: () => {
                gsap.to(cell, {
                    backgroundColor: "transparent",
                    duration: 0.4,
                    ease: "power2.inOut",
                });
            },
        });
    }, []);

    useEffect(() => {
        const updateGridDimensions = () => {
            const cols = Math.ceil(window.innerWidth / GRID_SIZE) + 2;
            const rows = Math.ceil(window.innerHeight / GRID_SIZE) + 2;
            setGridDimensions({ cols, rows });
            setGridOffset({
                x: (window.innerWidth % GRID_SIZE) / 2 - GRID_SIZE / 2,
                y: (window.innerHeight % GRID_SIZE) / 2 - GRID_SIZE / 2,
            });
        };

        updateGridDimensions();
        window.addEventListener("resize", updateGridDimensions);

        return () => {
            window.removeEventListener("resize", updateGridDimensions);
        };
    }, []);

    useEffect(() => {
        if (gridDimensions.cols === 0 || gridDimensions.rows === 0) return;

        const triggerRandomGlow = () => {
            const cells = Array.from(cellsRef.current.values());
            if (cells.length === 0) return;

            const numCells = Math.floor(Math.random() * 3) + 1;
            for (let i = 0; i < numCells; i++) {
                const randomIndex = Math.floor(Math.random() * cells.length);
                const cell = cells[randomIndex];
                if (cell) {
                    glowCell(cell);
                }
            }
        };

        const scheduleNextGlow = () => {
            const delay = Math.random() * 800 + 600;
            randomGlowIntervalRef.current = setTimeout(() => {
                triggerRandomGlow();
                scheduleNextGlow();
            }, delay);
        };

        scheduleNextGlow();

        return () => {
            if (randomGlowIntervalRef.current) {
                clearTimeout(randomGlowIntervalRef.current);
            }
        };
    }, [gridDimensions, glowCell]);

    const handleMouseMove = useCallback(
        (e: React.MouseEvent) => {
            const grid = gridRef.current;
            if (!grid) return;

            const rect = grid.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const col = Math.floor((x - gridOffset.x) / GRID_SIZE);
            const row = Math.floor((y - gridOffset.y) / GRID_SIZE);

            const cellKey = `${col}-${row}`;
            const cell = cellsRef.current.get(cellKey);

            if (cell) {
                glowCell(cell);
            }
        },
        [glowCell, gridOffset]
    );

    useEffect(() => {
        const startTime = Date.now();

        timecodeIntervalRef.current = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const totalFrames = Math.floor(elapsed / (1000 / 25));
            const frames = totalFrames % 25;
            const totalSeconds = Math.floor(totalFrames / 25);
            const seconds = totalSeconds % 60;
            const minutes = Math.floor(totalSeconds / 60) % 60;
            const hours = Math.floor(totalSeconds / 3600);

            setTimecode(
                `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
                    2,
                    "0"
                )}:${String(seconds).padStart(2, "0")}:${String(
                    frames
                ).padStart(2, "0")}`
            );
            setFrameCount(totalFrames);
        }, 40);

        return () => {
            if (timecodeIntervalRef.current) {
                clearInterval(timecodeIntervalRef.current);
            }
        };
    }, []);

    useEffect(() => {
        const container = containerRef.current;
        const logoContainer = logoContainerRef.current;
        const pathElements = pathsRef.current.filter(
            Boolean
        ) as SVGPathElement[];
        const loaderBar = loaderBarRef.current;
        const loaderBarFill = loaderBarFillRef.current;
        const percentage = percentageRef.current;
        const decorations = decorationsRef.current;

        if (
            !container ||
            !logoContainer ||
            pathElements.length === 0 ||
            !loaderBar ||
            !loaderBarFill ||
            !percentage ||
            !decorations
        )
            return;

        const tl = gsap.timeline({
            onComplete: () => {
                setIsComplete(true);
                onComplete?.();
            },
        });

        gsap.set(pathElements, {
            opacity: 0,
            scale: 1.5,
            transformOrigin: "center center",
        });

        gsap.set(loaderBar, { opacity: 0 });
        gsap.set(loaderBarFill, { width: "0%" });
        gsap.set(percentage, { opacity: 0, textContent: "0" });
        gsap.set(decorations, { opacity: 0 });

        tl.to(decorations, {
            opacity: 1,
            duration: 0.4,
            ease: "power2.out",
        });

        pathElements.forEach((path, i) => {
            const delay = i * 0.12;

            tl.to(
                path,
                {
                    opacity: 1 - i * 0.045,
                    scale: 1,
                    duration: 0.25,
                    ease: "power2.out",
                },
                0.3 + delay
            );

            tl.to(
                path,
                {
                    x: gsap.utils.random(-3, 3),
                    duration: 0.08,
                },
                0.3 + delay
            );

            tl.to(
                path,
                {
                    x: 0,
                    duration: 0.08,
                },
                0.38 + delay
            );
        });

        tl.to(
            [loaderBar, percentage],
            {
                opacity: 1,
                duration: 0.3,
                ease: "power2.out",
            },
            "-=0.5"
        );

        const progressObj = { value: 0 };
        tl.to(
            progressObj,
            {
                value: 100,
                duration: 8,
                ease: "power2.inOut",
                onUpdate: () => {
                    const val = Math.round(progressObj.value);
                    if (percentage) percentage.textContent = String(val);
                    if (loaderBarFill) loaderBarFill.style.width = `${val}%`;
                },
            },
            "-=0.2"
        );

        tl.to(pathElements, {
            opacity: 0.5,
            duration: 0.08,
        });
        tl.to(pathElements, {
            opacity: (i) => 1 - i * 0.045,
            duration: 0.08,
        });

        tl.to([loaderBar, percentage, decorations], {
            opacity: 0,
            duration: 0.3,
            ease: "power2.in",
        });

        const portalPath = pathElements[0];

        for (let i = 10; i >= 0; i--) {
            const path = pathElements[i];
            const isPortal = i === 0;
            tl.to(
                path,
                {
                    scale: isPortal ? 50 : 15 + i * 4,
                    opacity: 0,
                    duration: isPortal ? 0.4 : 0.2,
                    ease: "power2.in",
                },
                isPortal ? undefined : "-=0.16"
            );
        }

        tl.to(
            portalPath,
            {
                fill: "#FFF5F5",
                attr: { fill: "#FFF5F5" },
                duration: 0.3,
                ease: "power2.out",
            },
            "-=0.4"
        );

        tl.to(
            container,
            {
                opacity: 0,
                duration: 0.3,
                ease: "power2.out",
            },
            "-=0.15"
        );

        return () => {
            tl.kill();
        };
    }, [onComplete]);

    if (isComplete) return null;

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 bg-[#330014] flex flex-col items-center justify-center overflow-hidden"
            style={{ zIndex: 99999 }}
        >
            <div
                ref={decorationsRef}
                className="absolute inset-0"
                style={{ opacity: 0 }}
            >
                <div
                    ref={gridRef}
                    className="absolute inset-0 overflow-hidden"
                    onMouseMove={handleMouseMove}
                    style={{ pointerEvents: "auto" }}
                >
                    <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            backgroundImage: `
                                linear-gradient(to right, rgba(255, 245, 245, 0.1) 1px, transparent 1px),
                                linear-gradient(to bottom, rgba(255, 245, 245, 0.1) 1px, transparent 1px)
                            `,
                            backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
                            backgroundPosition: "center center",
                        }}
                    />
                    <div
                        className="absolute pointer-events-none"
                        style={{
                            display: "grid",
                            gridTemplateColumns: `repeat(${gridDimensions.cols}, ${GRID_SIZE}px)`,
                            gridTemplateRows: `repeat(${gridDimensions.rows}, ${GRID_SIZE}px)`,
                            left: `${gridOffset.x}px`,
                            top: `${gridOffset.y}px`,
                        }}
                    >
                        {Array.from({ length: gridDimensions.cols * gridDimensions.rows }).map((_, index) => {
                            const col = index % gridDimensions.cols;
                            const row = Math.floor(index / gridDimensions.cols);
                            const cellKey = `${col}-${row}`;
                            return (
                                <div
                                    key={cellKey}
                                    ref={(el) => {
                                        if (el) {
                                            cellsRef.current.set(cellKey, el);
                                        }
                                    }}
                                    className="pointer-events-none"
                                    style={{
                                        width: GRID_SIZE,
                                        height: GRID_SIZE,
                                        backgroundColor: "transparent",
                                    }}
                                />
                            );
                        })}
                    </div>
                </div>

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                    <svg
                        width="500"
                        height="500"
                        viewBox="0 0 500 500"
                        fill="none"
                        className="w-[80vmin] h-[80vmin] max-w-[500px] max-h-[500px]"
                    >
                        <circle
                            cx="250"
                            cy="250"
                            r="180"
                            stroke="#FFF5F5"
                            strokeWidth="0.5"
                            opacity="0.15"
                            fill="none"
                        />
                        <circle
                            cx="250"
                            cy="250"
                            r="220"
                            stroke="#FFF5F5"
                            strokeWidth="0.5"
                            opacity="0.1"
                            fill="none"
                        />
                        <circle
                            cx="250"
                            cy="250"
                            r="245"
                            stroke="#FFF5F5"
                            strokeWidth="0.5"
                            opacity="0.08"
                            fill="none"
                        />
                        <line
                            x1="250"
                            y1="0"
                            x2="250"
                            y2="70"
                            stroke="#FFF5F5"
                            strokeWidth="0.5"
                            opacity="0.2"
                        />
                        <line
                            x1="250"
                            y1="430"
                            x2="250"
                            y2="500"
                            stroke="#FFF5F5"
                            strokeWidth="0.5"
                            opacity="0.2"
                        />
                        <line
                            x1="0"
                            y1="250"
                            x2="70"
                            y2="250"
                            stroke="#FFF5F5"
                            strokeWidth="0.5"
                            opacity="0.2"
                        />
                        <line
                            x1="430"
                            y1="250"
                            x2="500"
                            y2="250"
                            stroke="#FFF5F5"
                            strokeWidth="0.5"
                            opacity="0.2"
                        />
                        <line
                            x1="50"
                            y1="50"
                            x2="90"
                            y2="90"
                            stroke="#FFF5F5"
                            strokeWidth="0.5"
                            opacity="0.15"
                        />
                        <line
                            x1="450"
                            y1="50"
                            x2="410"
                            y2="90"
                            stroke="#FFF5F5"
                            strokeWidth="0.5"
                            opacity="0.15"
                        />
                        <line
                            x1="50"
                            y1="450"
                            x2="90"
                            y2="410"
                            stroke="#FFF5F5"
                            strokeWidth="0.5"
                            opacity="0.15"
                        />
                        <line
                            x1="450"
                            y1="450"
                            x2="410"
                            y2="410"
                            stroke="#FFF5F5"
                            strokeWidth="0.5"
                            opacity="0.15"
                        />
                    </svg>
                </div>

                <div className="pointer-events-none absolute top-4 sm:top-8 md:top-12 left-4 sm:left-8 md:left-12 right-4 sm:right-8 md:right-12 flex justify-between items-start">
                    <div className="flex flex-col items-start">
                        <span className="text-[#FFF5F5]/40 text-[8px] sm:text-[10px] md:text-xs font-mono uppercase tracking-wider">
                            FECHULI BROADCAST SYSTEM
                        </span>
                        <p className="text-[#FFF5F5]/20 text-[4px] sm:text-[5px] md:text-[10px] font-mono mt-1 max-w-[120px] sm:max-w-[150px] md:max-w-[250px] leading-tight">
                            Signal Type: RGB / Bandwidth: ∞/sec
                            <br />
                            Calibration: PERFECT / Test Pattern: ACTIVE
                            <br />
                            Resolution: WHATEVER / Codec: XY
                            <br />
                            Last Update: RIGHT NOW
                            <br />
                            Maintenance: NEVER
                        </p>
                    </div>
                    <span className="text-[#FFF5F5]/40 text-[8px] sm:text-[10px] md:text-xs font-mono tabular-nums">
                        {timecode}
                    </span>
                </div>

                <div className="pointer-events-none absolute left-4 sm:left-8 md:left-12 top-1/2 -translate-y-1/2 flex flex-col gap-1">
                    {[
                        0.5, 0.4, 0.3, 0.2, 0.15, 0.1, 0.15, 0.2, 0.3, 0.4, 0.5,
                    ].map((opacity, i) => (
                        <div
                            key={i}
                            className="w-1 sm:w-1.5 md:w-2 h-3 sm:h-4 md:h-5"
                            style={{
                                backgroundColor: `rgba(255, 245, 245, ${opacity})`,
                            }}
                        />
                    ))}
                </div>

                <div className="pointer-events-none absolute right-4 sm:right-8 md:right-12 top-1/2 -translate-y-1/2 flex flex-col gap-1">
                    {[
                        0.5, 0.4, 0.3, 0.2, 0.15, 0.1, 0.15, 0.2, 0.3, 0.4, 0.5,
                    ].map((opacity, i) => (
                        <div
                            key={i}
                            className="w-1 sm:w-1.5 md:w-2 h-3 sm:h-4 md:h-5"
                            style={{
                                backgroundColor: `rgba(255, 245, 245, ${opacity})`,
                            }}
                        />
                    ))}
                </div>

                <div className="pointer-events-none absolute top-4 sm:top-8 md:top-12 left-1/2 -translate-x-1/2 flex items-end gap-[3px] sm:gap-1">
                    {[8, 4, 6, 4, 10, 4, 6, 4, 8, 4, 6, 4, 10, 4, 6, 4, 8].map(
                        (height, i) => (
                            <div
                                key={i}
                                className="w-px"
                                style={{
                                    height: `${height}px`,
                                    backgroundColor: `rgba(255, 245, 245, ${
                                        i === 4 || i === 12
                                            ? 0.4
                                            : i === 8
                                            ? 0.35
                                            : 0.2
                                    })`,
                                }}
                            />
                        )
                    )}
                </div>

                <div className="absolute bottom-4 sm:bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 flex items-start gap-[3px] sm:gap-1">
                    {[8, 4, 6, 4, 10, 4, 6, 4, 8, 4, 6, 4, 10, 4, 6, 4, 8].map(
                        (height, i) => (
                            <div
                                key={i}
                                className="w-px"
                                style={{
                                    height: `${height}px`,
                                    backgroundColor: `rgba(255, 245, 245, ${
                                        i === 4 || i === 12
                                            ? 0.4
                                            : i === 8
                                            ? 0.35
                                            : 0.2
                                    })`,
                                }}
                            />
                        )
                    )}
                </div>

                <div className="pointer-events-none absolute bottom-4 sm:bottom-8 md:bottom-12 left-4 sm:left-8 md:left-12 right-4 sm:right-8 md:right-12 flex justify-between items-end">
                    <span className="text-[#FFF5F5]/40 text-[8px] sm:text-[10px] md:text-xs font-mono tabular-nums">
                        FRM {String(frameCount).padStart(6, "0")}
                    </span>
                    <div className="flex flex-col items-end">
                        <p className="text-[#FFF5F5]/25 text-[4px] sm:text-[5px] md:text-[10px] font-mono mt-2 max-w-[140px] sm:max-w-[180px] md:max-w-[280px] leading-relaxed text-right">
                            <span className="opacity-60">
                                § DISCLAIMER LEGALE
                            </span>
                            <br />
                            Nessun designer è stato maltrattato durante la
                            realizzazione di questo sito, principalmente perché
                            nessun designer ci ha mai messo gli occhi sopra. I
                            pixel sono stati trattati con rispetto e il codice è
                            stato scritto in orari discutibili della notte.
                            <br />
                            <br />
                            <span className="opacity-60">
                                § NOTA IMPORTANTE
                            </span>
                            <br />
                            Se stai leggendo questo testo, chiaramente non hai
                            niente di meglio da fare. Ti capsico, anche io sono
                            stato lì. Benvenuto nel club.
                        </p>
                        <span className="text-[#FFF5F5]/40 text-[8px] sm:text-[10px] md:text-xs font-mono">
                            CH-01 • 25fps
                        </span>
                    </div>
                </div>
            </div>

            <div
                ref={logoContainerRef}
                className="pointer-events-none relative w-[200px] h-[200px] sm:w-[300px] sm:h-[300px]"
                style={{ transform: "translate(-5%, -5%)" }}
            >
                <svg
                    viewBox="-5 -5 60 60"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-full -rotate-90"
                    style={{ overflow: "visible" }}
                >
                    {paths.map((d, i) => (
                        <path
                            key={i}
                            ref={(el) => {
                                pathsRef.current[i] = el;
                            }}
                            d={d}
                            stroke="#FFF5F5"
                            strokeWidth={strokeWidths[i] * 1.5}
                            strokeMiterlimit="10"
                            fill="none"
                            style={{ opacity: 0 }}
                        />
                    ))}
                </svg>
            </div>

            <div className="pointer-events-none absolute bottom-[20%] left-1/2 -translate-x-1/2 flex items-center justify-center gap-4">
                <span className="text-sm font-mono w-8 opacity-0">0</span>
                <div
                    ref={loaderBarRef}
                    className="w-48 sm:w-72 h-0.5 bg-[#FFF5F5]/20 rounded-full overflow-hidden"
                    style={{ opacity: 0 }}
                >
                    <div
                        ref={loaderBarFillRef}
                        className="h-full bg-[#FFF5F5] rounded-full"
                        style={{ width: "0%" }}
                    />
                </div>
                <span
                    ref={percentageRef}
                    className="text-[#FFF5F5] text-sm font-mono w-8 tabular-nums"
                    style={{ opacity: 0 }}
                >
                    0
                </span>
            </div>
        </div>
    );
}
