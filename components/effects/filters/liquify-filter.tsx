"use client";

import { useEffect, useRef } from "react";

export default function LiquifyFilter() {
    const timeRef = useRef(0);
    const rafRef = useRef<number>(0);
    const turbulenceRef = useRef<SVGFETurbulenceElement | null>(null);

    useEffect(() => {
        const animate = () => {
            if (turbulenceRef.current) {
                // Animate the turbulence baseFrequency for liquid movement
                timeRef.current += 0.001;
                const freq = 0.01 + Math.sin(timeRef.current) * 0.005;
                turbulenceRef.current.setAttribute('baseFrequency', `${freq} ${freq}`);
            }

            rafRef.current = requestAnimationFrame(animate);
        };

        rafRef.current = requestAnimationFrame(animate);

        return () => {
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
            }
        };
    }, []);

    return (
        <>
            {/* SVG Filter Definition */}
            <svg
                style={{
                    position: 'absolute',
                    width: 0,
                    height: 0,
                    pointerEvents: 'none'
                }}
            >
                <defs>
                    <filter id="liquify" x="-20%" y="-20%" width="140%" height="140%">
                        {/* Create turbulent noise */}
                        <feTurbulence
                            ref={turbulenceRef}
                            type="fractalNoise"
                            baseFrequency="0.01 0.01"
                            numOctaves="3"
                            result="turbulence"
                            seed="2"
                        />

                        {/* Displace the image based on the noise */}
                        <feDisplacementMap
                            in="SourceGraphic"
                            in2="turbulence"
                            scale="35"
                            xChannelSelector="R"
                            yChannelSelector="G"
                            result="displacement"
                        />

                        {/* Slight blur for smoother effect */}
                        <feGaussianBlur
                            in="displacement"
                            stdDeviation="0.5"
                            result="blur"
                        />

                        {/* Blend with original for subtlety */}
                        <feBlend
                            in="blur"
                            in2="SourceGraphic"
                            mode="normal"
                            result="blend"
                        />
                    </filter>
                </defs>
            </svg>

            {/* Filter Wrapper - applies to everything below z-index 99995 */}
            <div
                className="fixed inset-0 pointer-events-none"
                style={{
                    zIndex: 99995,
                    backdropFilter: 'url(#liquify)'
                }}
            />
        </>
    );
}
