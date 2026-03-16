"use client";

import { useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SPOTIFY_URL =
    "https://open.spotify.com/intl-it/artist/0QoH2ffwsLCEdr25Yrk26z";

export default function SpotifyPlayer() {
    const t = useTranslations("music.spotify");
    const ctaRef = useRef<HTMLAnchorElement>(null);
    const creditsRef = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
        const cta = ctaRef.current;
        if (!cta) return;

        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            gsap.set([cta, creditsRef.current], { opacity: 1 });
            return;
        }

        const ctx = gsap.context(() => {
            gsap.fromTo(
                cta,
                { y: 60, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1.4,
                    ease: "expo.out",
                    scrollTrigger: { trigger: cta, start: "top 85%" },
                }
            );

            if (creditsRef.current) {
                gsap.fromTo(
                    creditsRef.current,
                    { opacity: 0 },
                    {
                        opacity: 1,
                        duration: 1,
                        scrollTrigger: { trigger: creditsRef.current, start: "top 90%" },
                    }
                );
            }
        });

        return () => ctx.revert();
    }, []);

    return (
        <div className="relative bg-[#FFF5F5] pb-24 sm:pb-32 md:pb-40 px-6 sm:px-12 md:px-20">
            {/* Giant CTA — typographic link to Spotify */}
            <a
                ref={ctaRef}
                href={SPOTIFY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group block max-w-6xl mx-auto pt-16 sm:pt-24 border-t border-[#330014]/10 opacity-0"
            >
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#330014]/30">
                    Spotify
                </span>
                <span className="block resin text-[clamp(3rem,10vw,12rem)] text-[#330014] tracking-[-0.06em] leading-[0.85] mt-2 transition-colors duration-500 group-hover:text-[#330014]/50">
                    {t("listen")}
                    <span className="inline-block ml-[0.1em] text-[0.4em] align-top opacity-0 -translate-x-4 transition-all duration-500 group-hover:opacity-50 group-hover:translate-x-0 arimo">
                        &#x2197;
                    </span>
                </span>
            </a>

            {/* CC-BY credits */}
            <p
                ref={creditsRef}
                className="font-mono text-[9px] text-[#330014]/10 mt-16 max-w-6xl mx-auto opacity-0"
            >
                3D models CC-BY via Poly Pizza — M. Uherčík, G. Ibias, P. Simcoe, Poly by Google
            </p>
        </div>
    );
}
