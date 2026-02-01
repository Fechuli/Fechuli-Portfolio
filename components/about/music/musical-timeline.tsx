"use client";

import { useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LOWVIBES_TIMELINE } from "@/data/lowvibes-timeline";

gsap.registerPlugin(ScrollTrigger);

export default function MusicalTimeline() {
    const t = useTranslations("music.timeline");
    const containerRef = useRef<HTMLDivElement>(null);
    const milestonesRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        if (!containerRef.current) return;

        milestonesRefs.current.forEach((milestone) => {
            if (milestone) {
                gsap.set(milestone, {
                    opacity: 0,
                    y: 30,
                });
            }
        });

        milestonesRefs.current.forEach((milestone) => {
            if (milestone) {
                ScrollTrigger.create({
                    trigger: milestone,
                    start: "top 85%",
                    onEnter: () => {
                        gsap.to(milestone, {
                            opacity: 1,
                            y: 0,
                            duration: 0.8,
                            ease: "power2.out",
                        });
                    },
                });
            }
        });

        return () => {
            ScrollTrigger.getAll().forEach((trigger) => {
                trigger.kill();
            });
        };
    }, []);

    return (
        <div
            ref={containerRef}
            data-navbar-theme="light"
            className="relative py-20 sm:py-32 px-6 sm:px-12 overflow-hidden bg-[#FFF5F5]"
        >
            <div className="max-w-7xl mx-auto mb-16 sm:mb-24">
                <h2 className="resin text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-center text-[#330014]">
                    {t("title")}
                </h2>
            </div>

            <div className="relative max-w-7xl mx-auto space-y-24 sm:space-y-32">
                {LOWVIBES_TIMELINE.map((milestone, index) => {
                    const isLeft = index % 2 === 0;
                    const rotation = isLeft ? -1.5 : 1.5;

                    return (
                        <div
                            key={`${milestone.year}-${milestone.title}`}
                            ref={(el) => {
                                milestonesRefs.current[index] = el;
                            }}
                            className={`flex flex-col ${
                                isLeft
                                    ? "lg:flex-row"
                                    : "lg:flex-row-reverse"
                            } gap-8 lg:gap-16 items-center`}
                        >
                            <div className="w-full lg:w-1/2 shrink-0">
                                <div
                                    className="relative bg-black border-4 border-[#FFF5F5] aspect-4/3 overflow-hidden"
                                    style={{
                                        transform: `rotate(${rotation}deg)`,
                                        boxShadow:
                                            "0 10px 40px rgba(0,0,0,0.3)",
                                    }}
                                >
                                    <div
                                        className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-[#330014] to-[#1a000a]"
                                        style={{
                                            filter: "contrast(1.1) saturate(0.8)",
                                        }}
                                    >
                                        <div
                                            className="absolute inset-0 pointer-events-none opacity-10"
                                            style={{
                                                backgroundImage:
                                                    "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.05) 3px, rgba(255,255,255,0.05) 6px)",
                                            }}
                                        />

                                        <div
                                            className="absolute inset-0 opacity-20 mix-blend-overlay"
                                            style={{
                                                backgroundImage:
                                                    'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'1.5\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
                                                backgroundRepeat: "repeat",
                                            }}
                                        />

                                        <div className="relative z-10 text-center">
                                            <div className="font-mono text-sm text-[#FFE4D6]/40 mb-2">
                                                [{milestone.year}]
                                            </div>
                                            <div className="text-6xl opacity-20">
                                                🎵
                                            </div>
                                            <div className="font-mono text-xs text-[#FFE4D6]/30 mt-2 uppercase tracking-wider">
                                                GIF Placeholder
                                            </div>
                                        </div>
                                    </div>

                                    <div
                                        className="absolute inset-0 pointer-events-none"
                                        style={{
                                            background:
                                                "radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.4) 100%)",
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="w-full lg:w-1/2">
                                <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-[#330014]/10 border border-[#330014]/20 backdrop-blur-sm">
                                    <div className="font-mono text-sm text-[#330014] font-bold">
                                        {milestone.year}
                                        {milestone.month &&
                                            `.${String(milestone.month).padStart(2, "0")}`}
                                    </div>
                                    <div className="w-1 h-1 rounded-full bg-[#330014]/60" />
                                    <div className="font-mono text-xs uppercase tracking-wider text-[#330014]/70">
                                        {t(`categories.${milestone.category}`)}
                                    </div>
                                </div>

                                <h3 className="resin text-3xl sm:text-4xl md:text-5xl text-[#330014] mb-4 leading-tight">
                                    {milestone.title}
                                </h3>

                                <p className="arimo text-base sm:text-lg md:text-xl text-[#330014]/90 leading-relaxed">
                                    {milestone.description}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
