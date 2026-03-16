"use client";

import { useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LOWVIBES_TIMELINE } from "@/data/lowvibes-timeline";
import { TIMELINE_ARTIFACTS } from "@/data/timeline-artifacts";
import { useMobileDetect } from "@/lib/use-mobile-detect";

const TimelineModel = dynamic(
    () => import("./artifacts/timeline-model"),
    { ssr: false }
);

gsap.registerPlugin(ScrollTrigger);

const STICKY_BASE = 100;
const STICKY_STEP = 25;

export default function MusicalTimeline() {
    const t = useTranslations("music.timeline");
    const containerRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const cardsRef = useRef<HTMLDivElement>(null);
    const milestonesRefs = useRef<(HTMLLIElement | null)[]>([]);
    const ctaRef = useRef<HTMLDivElement>(null);
    const { isMobile } = useMobileDetect();

    useEffect(() => {
        const container = containerRef.current;
        const titleEl = titleRef.current;

        if (!container) return;

        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            if (titleEl) gsap.set(titleEl, { opacity: 1 });
            milestonesRefs.current.forEach((el) => {
                if (el) {
                    gsap.set(el, { opacity: 1 });
                    const content = el.querySelector("[data-content]");
                    if (content) gsap.set(content, { opacity: 1 });
                }
            });
            if (ctaRef.current) gsap.set(ctaRef.current, { opacity: 1 });
            return;
        }

        const ctx = gsap.context(() => {
            // --- Title: scrub-based entrance ---
            if (titleEl) {
                gsap.fromTo(
                    titleEl,
                    { y: 60, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        ease: "none",
                        scrollTrigger: {
                            trigger: titleEl,
                            start: "top 90%",
                            end: "top 55%",
                            scrub: 0.5,
                        },
                    }
                );
            }

            // --- Stacking card animations ---
            const milestones = milestonesRefs.current.filter(Boolean) as HTMLLIElement[];
            const total = milestones.length;

            milestones.forEach((el, i) => {
                const isLeft = i % 2 === 0;

                // Content slides in from the side
                const content = el.querySelector("[data-content]");
                if (content) {
                    gsap.fromTo(
                        content,
                        { x: isLeft ? -60 : 60, opacity: 0 },
                        {
                            x: 0,
                            opacity: 1,
                            ease: "none",
                            scrollTrigger: {
                                trigger: el,
                                start: "top 85%",
                                end: "top 50%",
                                scrub: 0.4,
                            },
                        }
                    );
                }

                // When the NEXT card approaches, this card dims + scales down
                if (i < total - 1) {
                    const nextEl = milestones[i + 1];
                    if (nextEl) {
                        gsap.to(el, {
                            scale: 0.95,
                            ease: "none",
                            scrollTrigger: {
                                trigger: nextEl,
                                start: "top 85%",
                                end: `top ${STICKY_BASE + (i + 1) * STICKY_STEP + 20}px`,
                                scrub: true,
                            },
                        });
                    }
                }
            });

            // --- CTA entrance ---
            if (ctaRef.current) {
                gsap.fromTo(
                    ctaRef.current,
                    { y: 30, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        ease: "none",
                        scrollTrigger: {
                            trigger: ctaRef.current,
                            start: "top 85%",
                            end: "top 55%",
                            scrub: 0.5,
                        },
                    }
                );
            }
        }, container);

        return () => ctx.revert();
    }, []);

    return (
        <div
            ref={containerRef}
            data-navbar-theme="light"
            className="relative px-6 sm:px-12 md:px-20 bg-[#FFF5F5]"
        >
            {/* Logo curves — background decoration */}
            <div className="absolute -top-[5%] -right-[20%] w-[70vw] max-w-225 aspect-square overflow-visible pointer-events-none select-none z-0">
                <svg
                    viewBox="0 0 55 55"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-full"
                    aria-hidden="true"
                >
                    {[
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
                    ].map((d, i) => (
                        <path
                            key={i}
                            d={d}
                            stroke="#330014"
                            strokeWidth={0.3}
                            strokeMiterlimit="10"
                            opacity={0.04 + i * 0.008}
                        />
                    ))}
                </svg>
            </div>

            {/* Section title */}
            <div className="pt-32 sm:pt-40 pb-24 sm:pb-32">
                <h2
                    ref={titleRef}
                    className="resin text-[clamp(3rem,8vw,9rem)] text-[#330014] tracking-[-0.06em] leading-[0.9] opacity-0"
                >
                    {t("title")}
                </h2>
            </div>

            {/* Stacking cards */}
            <div ref={cardsRef} className="relative max-w-6xl mx-auto">
                <ol className="list-none relative">
                    {LOWVIBES_TIMELINE.map((milestone, index) => {
                        const isLeft = index % 2 === 0;
                        const number = String(index + 1).padStart(2, "0");
                        const stickyTop = STICKY_BASE + index * STICKY_STEP;

                        return (
                            <li
                                key={`${milestone.year}-${index}`}
                                ref={(el) => {
                                    milestonesRefs.current[index] = el;
                                }}
                                className={`
                                    sticky will-change-transform
                                    pt-14 pb-[35vh] px-4 lg:px-0
                                    overflow-visible
                                    ${index > 0 ? "bg-[#FFF5F5] shadow-[0_-8px_30px_-12px_rgba(51,0,20,0.06)]" : ""}
                                `}
                                style={{
                                    top: `${stickyTop}px`,
                                    zIndex: 10 + index,
                                }}
                            >
                                {/* Content — alternates sides on desktop */}
                                <div
                                    data-content
                                    className={`lg:w-[45%] opacity-0 ${
                                        isLeft
                                            ? "lg:mr-auto lg:pr-20"
                                            : "lg:ml-auto lg:pl-20"
                                    }`}
                                >
                                    <span className="font-mono text-xs text-[#330014]/25 tracking-[0.2em]">
                                        {number}.
                                    </span>

                                    <div className="resin text-[clamp(2.5rem,5vw,5rem)] text-[#330014] tracking-[-0.05em] leading-[0.9] mt-1">
                                        {milestone.year}
                                    </div>

                                    <span className="inline-block font-mono text-[10px] uppercase tracking-[0.15em] text-[#330014]/35 mt-3">
                                        {t(`categories.${milestone.category}`)}
                                    </span>

                                    <h3 className="resin text-xl sm:text-2xl md:text-3xl text-[#330014] mt-3 leading-tight">
                                        {milestone.title}
                                    </h3>

                                    <p className="arimo text-sm sm:text-base text-[#330014]/60 leading-relaxed mt-3">
                                        {milestone.description}
                                    </p>
                                </div>

                                {/* 3D model — desktop only, clipped to card */}
                                {!isMobile &&
                                    TIMELINE_ARTIFACTS.filter(
                                        (a) => a.milestoneIndex === index
                                    ).map((artifact) => (
                                        <div
                                            key={artifact.modelPath}
                                            className="hidden lg:block absolute"
                                            style={{
                                                top: artifact.position.top,
                                                width: artifact.width,
                                                height: artifact.height,
                                                ...(isLeft
                                                    ? { right: artifact.position.right ?? artifact.position.left ?? "10%" }
                                                    : { left: artifact.position.left ?? artifact.position.right ?? "10%" }),
                                            }}
                                        >
                                            <TimelineModel
                                                modelPath={artifact.modelPath}
                                                jitterLevel={artifact.jitterLevel}
                                                floatSpeed={artifact.floatSpeed}
                                                floatAmplitude={artifact.floatAmplitude}
                                                scale={artifact.scale}
                                                initialRotation={artifact.rotation}
                                            />
                                        </div>
                                    ))}
                            </li>
                        );
                    })}
                </ol>

                {/* Final node — Spotify CTA */}
                <div
                    ref={ctaRef}
                    className="sticky bg-[#FFF5F5] pt-14 pb-20 opacity-0 shadow-[0_-8px_30px_-12px_rgba(51,0,20,0.06)]"
                    style={{
                        top: `${STICKY_BASE + LOWVIBES_TIMELINE.length * STICKY_STEP}px`,
                        zIndex: 10 + LOWVIBES_TIMELINE.length,
                    }}
                >
                    <div className="lg:w-[45%] lg:ml-auto lg:pl-20">
                        <a
                            href="https://open.spotify.com/intl-it/artist/0QoH2ffwsLCEdr25Yrk26z"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group"
                        >
                            <span className="font-mono text-xs text-[#330014]/25 tracking-[0.2em]">
                                {t("cta.label")}
                            </span>
                            <span className="block resin text-[clamp(1.8rem,4vw,3.5rem)] text-[#330014] tracking-[-0.04em] leading-[0.9] mt-1 transition-colors duration-400 group-hover:text-[#330014]/50">
                                {t("cta.text")}
                            </span>
                        </a>
                    </div>
                </div>
            </div>

            {/* CC-BY credits */}
            <p className="font-mono text-[9px] text-[#330014]/10 py-16 max-w-6xl mx-auto relative" style={{ zIndex: 10 + LOWVIBES_TIMELINE.length + 1 }}>
                3D models CC-BY via Poly Pizza — M. Uherčík, G. Ibias, P. Simcoe, Poly by Google
            </p>
        </div>
    );
}
