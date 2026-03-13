"use client";

export default function CrtFilter() {
    return (
        <>
            {/* SVG Patterns and Filters */}
            <svg
                style={{
                    position: 'absolute',
                    width: 0,
                    height: 0,
                    pointerEvents: 'none'
                }}
            >
                <defs>
                    {/* Scanline pattern */}
                    <pattern
                        id="crt-scanlines"
                        x="0"
                        y="0"
                        width="100%"
                        height="3"
                        patternUnits="userSpaceOnUse"
                    >
                        <rect width="100%" height="1.5" fill="black" opacity="0.15" />
                        <rect y="1.5" width="100%" height="1.5" fill="transparent" />
                    </pattern>

                    {/* Barrel distortion filter */}
                    <filter id="crt-barrel" x="-50%" y="-50%" width="200%" height="200%">
                        {/* Create radial gradient for displacement */}
                        <feTurbulence
                            type="turbulence"
                            baseFrequency="0"
                            numOctaves="1"
                            result="turbulence"
                        />

                        {/* Displacement map for barrel effect */}
                        <feDisplacementMap
                            in="SourceGraphic"
                            in2="turbulence"
                            scale="25"
                            xChannelSelector="R"
                            yChannelSelector="G"
                            result="displacement"
                        />

                        {/* Add slight blur for CRT glow */}
                        <feGaussianBlur
                            in="displacement"
                            stdDeviation="0.8"
                            result="blur"
                        />
                    </filter>
                </defs>
            </svg>

            {/* Filter Container with barrel distortion */}
            <div
                className="fixed inset-0 pointer-events-none"
                style={{
                    zIndex: 99995,
                    transform: 'perspective(1000px)',
                    transformStyle: 'preserve-3d'
                }}
            >
                {/* Barrel distortion wrapper */}
                <div
                    className="absolute inset-0"
                    style={{
                        transform: 'scale(1.08) perspective(800px) rotateX(0.5deg)',
                        filter: 'url(#crt-barrel)',
                        borderRadius: '3%',
                        transformStyle: 'preserve-3d'
                    }}
                >
                    {/* Scanlines */}
                    <div
                        className="absolute inset-0"
                        style={{
                            backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.15) 0px, rgba(0,0,0,0.15) 1.5px, transparent 1.5px, transparent 3px)',
                            mixBlendMode: 'multiply'
                        }}
                    />

                    {/* Strong vignette for CRT edges */}
                    <div
                        className="absolute inset-0"
                        style={{
                            background: 'radial-gradient(ellipse at center, transparent 20%, rgba(0,0,0,0.3) 60%, rgba(0,0,0,0.7) 100%)',
                            opacity: 0.9
                        }}
                    />

                    {/* Flicker effect */}
                    <div
                        className="absolute inset-0 animate-crt-flicker"
                        style={{
                            background: 'rgba(255, 255, 255, 0.03)'
                        }}
                    />

                    {/* RGB color separation at edges */}
                    <div
                        className="absolute inset-0"
                        style={{
                            backgroundImage: `
                                radial-gradient(circle at 15% 20%, rgba(255,0,0,0.04) 0%, transparent 40%),
                                radial-gradient(circle at 85% 80%, rgba(0,0,255,0.04) 0%, transparent 40%),
                                radial-gradient(circle at 50% 10%, rgba(0,255,0,0.02) 0%, transparent 30%)
                            `
                        }}
                    />

                    {/* Curved glass reflection */}
                    <div
                        className="absolute inset-0"
                        style={{
                            background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 50%, rgba(255,255,255,0.02) 100%)',
                            borderRadius: '2%'
                        }}
                    />
                </div>
            </div>

            {/* Flicker animation styles */}
            <style dangerouslySetInnerHTML={{__html: `
                @keyframes crt-flicker {
                    0%, 100% {
                        opacity: 0.05;
                    }
                    50% {
                        opacity: 0.09;
                    }
                }

                .animate-crt-flicker {
                    animation: crt-flicker 0.12s infinite;
                }
            `}} />
        </>
    );
}
