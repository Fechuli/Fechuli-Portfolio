"use client";

import { useEffect, useState } from "react";

interface CrtTurnOnProps {
    onComplete?: () => void;
}

export default function CrtTurnOn({ onComplete }: CrtTurnOnProps) {
    const [phase, setPhase] = useState<"line" | "expand" | "flash" | "done">("line");

    useEffect(() => {
        // Phase 1: Line appears (0 - 300ms)
        const timer1 = setTimeout(() => setPhase("expand"), 300);
        // Phase 2: Expand (300 - 800ms)
        const timer2 = setTimeout(() => setPhase("flash"), 800);
        // Phase 3: Flash (800 - 1000ms)
        const timer3 = setTimeout(() => {
            setPhase("done");
            onComplete?.();
        }, 1000);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(timer3);
        };
    }, [onComplete]);

    return (
        <div className="fixed inset-0 bg-black z-99999 flex items-center justify-center overflow-hidden">
            <div className={`crt-turn-on crt-turn-on--${phase}`} />
            <style jsx>{`
                .crt-turn-on {
                    position: absolute;
                    background: white;
                    transition: all 0.3s ease-out;
                }

                .crt-turn-on--line {
                    width: 0;
                    height: 2px;
                    animation: crt-line 0.3s ease-out forwards;
                }

                .crt-turn-on--expand {
                    width: 60%;
                    height: 2px;
                    animation: crt-expand 0.5s ease-out forwards;
                }

                .crt-turn-on--flash {
                    width: 100%;
                    height: 100%;
                    opacity: 1;
                    animation: crt-flash 0.2s ease-out forwards;
                }

                .crt-turn-on--done {
                    width: 100%;
                    height: 100%;
                    opacity: 1;
                }

                @keyframes crt-line {
                    0% {
                        width: 0;
                        height: 2px;
                    }
                    100% {
                        width: 60%;
                        height: 2px;
                    }
                }

                @keyframes crt-expand {
                    0% {
                        width: 60%;
                        height: 2px;
                    }
                    50% {
                        width: 80%;
                        height: 4px;
                    }
                    100% {
                        width: 100%;
                        height: 100%;
                    }
                }

                @keyframes crt-flash {
                    0% {
                        opacity: 1;
                    }
                    50% {
                        opacity: 0.8;
                    }
                    100% {
                        opacity: 1;
                    }
                }
            `}</style>
        </div>
    );
}
