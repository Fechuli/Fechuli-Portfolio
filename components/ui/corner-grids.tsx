"use client";

import { useNavbarTheme } from "@/lib/navbar-theme-context";

const GRID_SIZE = 40;
const GRID_LINES = 8;
const LINE_OPACITY = 0.12;

export default function CornerGrids() {
    const { theme } = useNavbarTheme();
    const strokeColor = theme === "dark" ? "#FFF5F5" : "#330014";

    return (
        <div className="hidden sm:block fixed inset-0 pointer-events-none z-40">
            <div className="absolute top-0 left-0">
                <svg
                    width={GRID_SIZE * GRID_LINES}
                    height={GRID_SIZE * GRID_LINES}
                    className="overflow-visible"
                >
                    {Array.from({ length: GRID_LINES + 1 }).map((_, i) => (
                        <line
                            key={`tl-v-${i}`}
                            x1={i * GRID_SIZE}
                            y1={0}
                            x2={i * GRID_SIZE}
                            y2={i === 0 ? GRID_SIZE * GRID_LINES : GRID_SIZE * (GRID_LINES - i + 1)}
                            stroke={strokeColor}
                            strokeWidth={0.5}
                            opacity={LINE_OPACITY * (1 - i * 0.12)}
                        />
                    ))}
                    {Array.from({ length: GRID_LINES + 1 }).map((_, i) => (
                        <line
                            key={`tl-h-${i}`}
                            x1={0}
                            y1={i * GRID_SIZE}
                            x2={i === 0 ? GRID_SIZE * GRID_LINES : GRID_SIZE * (GRID_LINES - i + 1)}
                            y2={i * GRID_SIZE}
                            stroke={strokeColor}
                            strokeWidth={0.5}
                            opacity={LINE_OPACITY * (1 - i * 0.12)}
                        />
                    ))}
                </svg>
            </div>

            <div className="absolute top-0 right-0">
                <svg
                    width={GRID_SIZE * GRID_LINES}
                    height={GRID_SIZE * GRID_LINES}
                    className="overflow-visible"
                >
                    {Array.from({ length: GRID_LINES + 1 }).map((_, i) => (
                        <line
                            key={`tr-v-${i}`}
                            x1={GRID_SIZE * GRID_LINES - i * GRID_SIZE}
                            y1={0}
                            x2={GRID_SIZE * GRID_LINES - i * GRID_SIZE}
                            y2={i === 0 ? GRID_SIZE * GRID_LINES : GRID_SIZE * (GRID_LINES - i + 1)}
                            stroke={strokeColor}
                            strokeWidth={0.5}
                            opacity={LINE_OPACITY * (1 - i * 0.12)}
                        />
                    ))}
                    {Array.from({ length: GRID_LINES + 1 }).map((_, i) => (
                        <line
                            key={`tr-h-${i}`}
                            x1={GRID_SIZE * GRID_LINES}
                            y1={i * GRID_SIZE}
                            x2={i === 0 ? 0 : GRID_SIZE * (i - 1)}
                            y2={i * GRID_SIZE}
                            stroke={strokeColor}
                            strokeWidth={0.5}
                            opacity={LINE_OPACITY * (1 - i * 0.12)}
                        />
                    ))}
                </svg>
            </div>

            <div className="absolute bottom-0 left-0">
                <svg
                    width={GRID_SIZE * GRID_LINES}
                    height={GRID_SIZE * GRID_LINES}
                    className="overflow-visible"
                >
                    {Array.from({ length: GRID_LINES + 1 }).map((_, i) => (
                        <line
                            key={`bl-v-${i}`}
                            x1={i * GRID_SIZE}
                            y1={GRID_SIZE * GRID_LINES}
                            x2={i * GRID_SIZE}
                            y2={i === 0 ? 0 : GRID_SIZE * (i - 1)}
                            stroke={strokeColor}
                            strokeWidth={0.5}
                            opacity={LINE_OPACITY * (1 - i * 0.12)}
                        />
                    ))}
                    {Array.from({ length: GRID_LINES + 1 }).map((_, i) => (
                        <line
                            key={`bl-h-${i}`}
                            x1={0}
                            y1={GRID_SIZE * GRID_LINES - i * GRID_SIZE}
                            x2={i === 0 ? GRID_SIZE * GRID_LINES : GRID_SIZE * (GRID_LINES - i + 1)}
                            y2={GRID_SIZE * GRID_LINES - i * GRID_SIZE}
                            stroke={strokeColor}
                            strokeWidth={0.5}
                            opacity={LINE_OPACITY * (1 - i * 0.12)}
                        />
                    ))}
                </svg>
            </div>

            <div className="absolute bottom-0 right-0">
                <svg
                    width={GRID_SIZE * GRID_LINES}
                    height={GRID_SIZE * GRID_LINES}
                    className="overflow-visible"
                >
                    {Array.from({ length: GRID_LINES + 1 }).map((_, i) => (
                        <line
                            key={`br-v-${i}`}
                            x1={GRID_SIZE * GRID_LINES - i * GRID_SIZE}
                            y1={GRID_SIZE * GRID_LINES}
                            x2={GRID_SIZE * GRID_LINES - i * GRID_SIZE}
                            y2={i === 0 ? 0 : GRID_SIZE * (i - 1)}
                            stroke={strokeColor}
                            strokeWidth={0.5}
                            opacity={LINE_OPACITY * (1 - i * 0.12)}
                        />
                    ))}
                    {Array.from({ length: GRID_LINES + 1 }).map((_, i) => (
                        <line
                            key={`br-h-${i}`}
                            x1={GRID_SIZE * GRID_LINES}
                            y1={GRID_SIZE * GRID_LINES - i * GRID_SIZE}
                            x2={i === 0 ? 0 : GRID_SIZE * (i - 1)}
                            y2={GRID_SIZE * GRID_LINES - i * GRID_SIZE}
                            stroke={strokeColor}
                            strokeWidth={0.5}
                            opacity={LINE_OPACITY * (1 - i * 0.12)}
                        />
                    ))}
                </svg>
            </div>
        </div>
    );
}
