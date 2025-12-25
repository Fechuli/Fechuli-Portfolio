"use client";

import { useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import AnimatedTitle from "@/components/ui/animated-title";
import { usePageTransition } from "@/lib/transition-context";
import { useLoader } from "@/lib/loader-context";
import gsap from "gsap";
import Library from "@/components/about/library";
import WireframeGlobe from "@/components/about/wireframe-globe";

export default function AboutPage() {
    const t = useTranslations("aboutPage");
    const subtitleRef = useRef<HTMLParagraphElement>(null);
    const sectionRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const { isTransitioning } = usePageTransition();
    const { isLoading } = useLoader();

    useEffect(() => {
        if (!containerRef.current || isLoading) return;

        gsap.to(containerRef.current, {
            opacity: 1,
            duration: 0.5,
            ease: "power2.out",
        });
    }, [isLoading]);

    useEffect(() => {
        if (!subtitleRef.current || isTransitioning || isLoading) return;

        gsap.set(subtitleRef.current, { opacity: 0, y: 30 });
        gsap.to(subtitleRef.current, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power2.out",
            delay: 0.8,
        });
    }, [isTransitioning, isLoading]);

    return (
        <div ref={containerRef} style={{ opacity: 0 }}>
            <div ref={sectionRef} className="sm:min-h-screen bg-[#FFF5F5] text-[#330014] relative overflow-hidden pb-8 sm:pb-0">
                <svg
                    className="absolute inset-0 w-full h-full pointer-events-none hidden sm:block"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                >
                    <path d="M100,0 L100,100 L0,100 Q50,50 100,0" fill="#330014" />
                </svg>

                <svg
                    className="absolute bottom-0 left-0 w-full h-6 pointer-events-none sm:hidden"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                >
                    <path d="M0,100 Q50,0 100,50 L100,100 L0,100 Z" fill="#330014" />
                </svg>

                <div className="px-4 sm:px-6 md:px-10 lg:px-16 pt-28 sm:pt-40 md:pt-32 relative z-10">
                    <AnimatedTitle className="text-6xl sm:text-6xl md:text-8xl lg:text-[10rem] xl:text-[13rem]">
                        {t("title")}
                    </AnimatedTitle>
                </div>

                <div className="h-12 sm:hidden" aria-hidden="true" />

                <div className="px-4 pb-16 sm:pb-0 sm:px-0 sm:absolute sm:top-1/2 sm:-translate-y-1/2 sm:right-6 md:right-10 lg:right-16 z-10 sm:max-w-xs md:max-w-sm lg:max-w-md sm:text-right">
                    <p
                        ref={subtitleRef}
                        className="text-base sm:text-sm md:text-base lg:text-lg xl:text-xl font-light leading-relaxed text-[#330014] sm:text-[#FFF5F5] opacity-0"
                    >
                        {t("subtitle")}
                    </p>
                </div>

                {/* Globo wireframe al centro - solo desktop */}
                <div className="hidden sm:flex absolute inset-0 items-center justify-center pointer-events-none z-0">
                    <div className="sm:w-[400px] sm:h-[400px] md:w-[500px] md:h-[500px] lg:w-[600px] lg:h-[600px]">
                        <WireframeGlobe containerRef={sectionRef} />
                    </div>
                </div>
            </div>
            <Library />
        </div>
    );
}
