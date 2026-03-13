"use client";

import { useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SPOTIFY_ARTIST_EMBED =
    "https://open.spotify.com/embed/artist/0QoH2ffwsLCEdr25Yrk26z?utm_source=generator&theme=0";
const SPOTIFY_PROFILE_URL =
    "https://open.spotify.com/intl-it/artist/0QoH2ffwsLCEdr25Yrk26z";

export default function SpotifyPlayer() {
    const t = useTranslations("music.spotify");
    const sectionRef = useRef<HTMLElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const section = sectionRef.current;
        const content = contentRef.current;

        if (!section || !content) return;

        // Respect reduced motion preference
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            gsap.set(content, { opacity: 1 });
            return;
        }

        const ctx = gsap.context(() => {
            gsap.fromTo(
                content,
                { opacity: 0, y: 40 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1.2,
                    ease: "expo.out",
                    scrollTrigger: {
                        trigger: section,
                        start: "top 70%",
                    },
                }
            );
        }, section);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            className="relative bg-[#330014] py-24 sm:py-32 md:py-40 px-6 sm:px-12 md:px-20"
            data-navbar-theme="dark"
        >
            <div ref={contentRef} className="max-w-4xl mx-auto opacity-0">
                {/* Spotify embed — clean, no decorative wrapper */}
                <div className="w-full aspect-square sm:aspect-video max-h-100">
                    <iframe
                        src={SPOTIFY_ARTIST_EMBED}
                        width="100%"
                        height="100%"
                        className="border-0"
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                        loading="lazy"
                        title="Spotify — LowVibes"
                    />
                </div>

                {/* Stats + CTA — inline, minimal */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-8 sm:mt-10 pt-8 sm:pt-10 border-t border-[#FFF5F5]/10">
                    <p className="font-mono text-sm text-[#FFF5F5]/40 tracking-wide">
                        {t("stats")}
                    </p>

                    <a
                        href={SPOTIFY_PROFILE_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-2 mt-4 sm:mt-0 text-[#FFF5F5]/60 hover:text-[#FFF5F5] transition-colors duration-300"
                    >
                        <span className="font-mono text-sm tracking-wide">
                            {t("viewProfile")}
                        </span>
                        <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                            &rarr;
                        </span>
                    </a>
                </div>
            </div>
        </section>
    );
}
