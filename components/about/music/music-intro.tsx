"use client";

import { useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

export default function MusicIntro() {
    const t = useTranslations("music.intro");
    const containerRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const labelRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        const titleEl = titleRef.current;
        const labelEl = labelRef.current;
        const textEl = textRef.current;

        if (!container || !titleEl || !textEl) return;

        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            gsap.set(titleEl, { opacity: 1 });
            if (labelEl) gsap.set(labelEl, { opacity: 1 });
            gsap.set(textEl, { opacity: 1 });
            return;
        }

        let split: SplitText | null = null;

        const ctx = gsap.context(() => {
            // --- Scrub-based entrance ---
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: container,
                    start: "top 85%",
                    end: "top 20%",
                    scrub: 0.6,
                },
            });

            // Title rises into view
            tl.fromTo(
                titleEl,
                { y: 100, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.4 }
            );

            // Label fades in
            if (labelEl) {
                tl.fromTo(
                    labelEl,
                    { opacity: 0, y: 20 },
                    { opacity: 1, y: 0, duration: 0.2 },
                    0.3
                );
            }

            // Body text — char-by-char reveal tied to scroll
            gsap.set(textEl, { opacity: 1 });
            split = new SplitText(textEl, { type: "chars" });

            if (split.chars && split.chars.length > 0) {
                gsap.set(split.chars, { opacity: 0 });
                tl.to(
                    split.chars,
                    { opacity: 1, stagger: 0.01, duration: 0.01 },
                    0.45
                );
            }

            // --- Parallax layers as user scrolls past ---
            // Title drifts up slower → creates depth
            gsap.to(titleEl, {
                y: -80,
                ease: "none",
                scrollTrigger: {
                    trigger: container,
                    start: "top top",
                    end: "bottom top",
                    scrub: true,
                },
            });

            // Body text drifts at different speed
            const textWrapper = textEl.parentElement;
            if (textWrapper) {
                gsap.to(textWrapper, {
                    y: -30,
                    ease: "none",
                    scrollTrigger: {
                        trigger: container,
                        start: "top top",
                        end: "bottom top",
                        scrub: true,
                    },
                });
            }
        }, container);

        return () => {
            split?.revert();
            ctx.revert();
        };
    }, []);

    return (
        <div
            ref={containerRef}
            data-navbar-theme="dark"
            className="relative bg-[#330014] text-[#FFF5F5] pt-32 pb-24 sm:pt-40 sm:pb-32 md:pt-52 md:pb-40 px-6 sm:px-12 md:px-20 overflow-hidden"
        >
            <h2
                ref={titleRef}
                className="resin text-[clamp(4rem,13vw,15rem)] leading-[0.85] tracking-[-0.07em] opacity-0 will-change-transform"
            >
                {t("title")}
            </h2>

            <div
                ref={labelRef}
                className="flex items-center gap-4 mt-6 sm:mt-8 opacity-0"
            >
                <div className="h-px w-12 bg-[#FFF5F5]/30" />
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#FFF5F5]/40">
                    {t("label")}
                </span>
            </div>

            <div className="max-w-xl ml-auto mt-16 sm:mt-24 will-change-transform">
                <p
                    ref={textRef}
                    className="arimo text-base sm:text-lg leading-relaxed text-[#FFF5F5]/70 opacity-0"
                >
                    {t("text")}
                </p>
            </div>
        </div>
    );
}
