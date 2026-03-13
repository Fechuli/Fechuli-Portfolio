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
    const spineRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const milestonesRefs = useRef<(HTMLLIElement | null)[]>([]);

    useEffect(() => {
        const container = containerRef.current;
        const titleEl = titleRef.current;
        const spineEl = spineRef.current;

        if (!container) return;

        // Respect reduced motion preference
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            if (titleEl) gsap.set(titleEl, { opacity: 1 });
            if (spineEl) gsap.set(spineEl, { scaleY: 1 });
            milestonesRefs.current.forEach((el) => {
                if (el) gsap.set(el, { opacity: 1 });
            });
            return;
        }

        const ctx = gsap.context(() => {
            // Title entrance
            if (titleEl) {
                gsap.fromTo(
                    titleEl,
                    { y: 60, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 1.2,
                        ease: "expo.out",
                        scrollTrigger: {
                            trigger: titleEl,
                            start: "top 80%",
                        },
                    }
                );
            }

            // Spine grows with scroll
            if (spineEl) {
                gsap.fromTo(
                    spineEl,
                    { scaleY: 0 },
                    {
                        scaleY: 1,
                        ease: "none",
                        scrollTrigger: {
                            trigger: container,
                            start: "top 40%",
                            end: "bottom 60%",
                            scrub: 0.3,
                        },
                    }
                );
            }

            // Milestones slide in from alternating sides
            milestonesRefs.current.forEach((el, i) => {
                if (!el) return;

                const isLeft = i % 2 === 0;

                gsap.fromTo(
                    el,
                    { opacity: 0, x: isLeft ? -30 : 30 },
                    {
                        opacity: 1,
                        x: 0,
                        duration: 1.2,
                        ease: "expo.out",
                        scrollTrigger: {
                            trigger: el,
                            start: "top 85%",
                        },
                    }
                );
            });
        }, container);

        return () => ctx.revert();
    }, []);

    return (
        <div
            ref={containerRef}
            data-navbar-theme="light"
            className="relative py-32 sm:py-40 px-6 sm:px-12 md:px-20 bg-[#FFF5F5]"
        >
            {/* Section title */}
            <h2
                ref={titleRef}
                className="resin text-[clamp(3rem,8vw,9rem)] text-[#330014] tracking-[-0.06em] leading-[0.9] mb-24 sm:mb-32 opacity-0"
            >
                {t("title")}
            </h2>

            {/* Timeline container */}
            <div className="relative max-w-6xl mx-auto">
                {/* Spine — mobile: left edge, desktop: centered */}
                <div className="absolute left-1.75 lg:left-1/2 lg:-translate-x-px top-0 bottom-0">
                    <div
                        ref={spineRef}
                        className="w-px h-full bg-[#330014]/15 origin-top"
                    />
                </div>

                {/* Milestones — semantic ordered list */}
                <ol className="space-y-20 sm:space-y-28 lg:space-y-36 list-none">
                    {LOWVIBES_TIMELINE.map((milestone, index) => {
                        const isLeft = index % 2 === 0;
                        const number = String(index + 1).padStart(2, "0");

                        return (
                            <li
                                key={`${milestone.year}-${index}`}
                                ref={(el) => {
                                    milestonesRefs.current[index] = el;
                                }}
                                className="relative pl-10 lg:pl-0"
                            >
                                {/* Dot on the spine */}
                                <div className="absolute left-0 lg:left-1/2 lg:-translate-x-1/2 top-1.5">
                                    <div className="w-3.75 h-3.75 rounded-full border-2 border-[#330014] bg-[#FFF5F5]" />
                                </div>

                                {/* Content — alternates sides on desktop */}
                                <div
                                    className={`lg:w-[45%] ${
                                        isLeft
                                            ? "lg:mr-auto lg:pr-20"
                                            : "lg:ml-auto lg:pl-20"
                                    }`}
                                >
                                    {/* Number marker */}
                                    <span className="font-mono text-xs text-[#330014]/25 tracking-[0.2em]">
                                        {number}.
                                    </span>

                                    {/* Year — typographic, large */}
                                    <div className="resin text-[clamp(2.5rem,5vw,5rem)] text-[#330014] tracking-[-0.05em] leading-[0.9] mt-1">
                                        {milestone.year}
                                    </div>

                                    {/* Category */}
                                    <span className="inline-block font-mono text-[10px] uppercase tracking-[0.15em] text-[#330014]/35 mt-3">
                                        {t(
                                            `categories.${milestone.category}`
                                        )}
                                    </span>

                                    {/* Title */}
                                    <h3 className="resin text-xl sm:text-2xl md:text-3xl text-[#330014] mt-3 leading-tight">
                                        {milestone.title}
                                    </h3>

                                    {/* Description */}
                                    <p className="arimo text-sm sm:text-base text-[#330014]/60 leading-relaxed mt-3">
                                        {milestone.description}
                                    </p>
                                </div>
                            </li>
                        );
                    })}
                </ol>
            </div>
        </div>
    );
}
