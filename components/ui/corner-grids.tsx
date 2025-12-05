"use client";

const GRID_SIZE = 40;
const GRID_LINES = 8;
const LINE_OPACITY = 0.12;

export default function CornerGrids() {
    return (
        <div className="hidden sm:block fixed inset-0 pointer-events-none z-40">
            {/* Top Left */}
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
                            stroke="#330014"
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
                            stroke="#330014"
                            strokeWidth={0.5}
                            opacity={LINE_OPACITY * (1 - i * 0.12)}
                        />
                    ))}
                </svg>
            </div>

            {/* Top Right */}
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
                            stroke="#330014"
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
                            stroke="#330014"
                            strokeWidth={0.5}
                            opacity={LINE_OPACITY * (1 - i * 0.12)}
                        />
                    ))}
                </svg>
            </div>

            {/* Bottom Left */}
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
                            stroke="#330014"
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
                            stroke="#330014"
                            strokeWidth={0.5}
                            opacity={LINE_OPACITY * (1 - i * 0.12)}
                        />
                    ))}
                </svg>
            </div>

            {/* Bottom Right */}
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
                            stroke="#330014"
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
                            stroke="#330014"
                            strokeWidth={0.5}
                            opacity={LINE_OPACITY * (1 - i * 0.12)}
                        />
                    ))}
                </svg>
            </div>
        </div>
    );
}
