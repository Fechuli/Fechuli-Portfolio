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

// Stats data
const STATS = [
    { value: "2017", label: "Anno" },
    { value: "12", label: "Brani" },
    { value: "2", label: "EP" },
];

export default function SpotifyPlayer() {
    const t = useTranslations("music.spotify");
    const sectionRef = useRef<HTMLElement>(null);
    const statsRef = useRef<(HTMLDivElement | null)[]>([]);

    // Animate stats on scroll
    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        statsRef.current.forEach((stat, i) => {
            if (!stat) return;

            gsap.fromTo(
                stat,
                { opacity: 0, y: 20 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    delay: i * 0.1,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: section,
                        start: "top 70%",
                        toggleActions: "play none none none",
                    },
                }
            );
        });

        return () => {
            ScrollTrigger.getAll().forEach((st) => st.kill());
        };
    }, []);

    return (
        <section
            ref={sectionRef}
            className="relative bg-[#330014] py-16 md:py-24 px-4 md:px-10 lg:px-16 border-y border-[#FFF5F5]/20"
            data-navbar-theme="dark"
        >
            {/* Bento Grid */}
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-12 gap-3 md:gap-4">

                    {/* Box 1: Title & Info */}
                    <div className="col-span-12 md:col-span-4 bg-[#FFF5F5]/5 border border-[#FFF5F5]/10 rounded-lg p-5 md:p-6 flex flex-col justify-between min-h-[180px]">
                        <div>
                            <span className="text-[#FFF5F5]/40 text-[10px] font-mono uppercase tracking-widest">
                                LowVibes
                            </span>
                            <h2 className="resin text-[#FFF5F5] text-2xl sm:text-3xl md:text-4xl mt-2">
                                {t("title")}
                            </h2>
                        </div>
                        <p className="text-[#FFF5F5]/50 text-sm font-light mt-4">
                            Synth-pop & electronic beats from Florence
                        </p>
                    </div>

                    {/* Box 2: Spotify Embed - main focus */}
                    <div className="col-span-12 md:col-span-8 md:row-span-2 bg-[#FFF5F5]/5 border border-[#FFF5F5]/10 rounded-lg p-3 md:p-4 min-h-[380px] md:min-h-[420px]">
                        <iframe
                            src={SPOTIFY_ARTIST_EMBED}
                            width="100%"
                            height="100%"
                            frameBorder="0"
                            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                            loading="lazy"
                            className="rounded-lg"
                            style={{ minHeight: "352px" }}
                            title="Spotify Player"
                        />
                    </div>

                    {/* Box 3: Stats */}
                    <div className="col-span-6 md:col-span-2 bg-[#FFF5F5]/5 border border-[#FFF5F5]/10 rounded-lg p-4 flex flex-col items-center justify-center gap-3">
                        {STATS.map((stat, i) => (
                            <div
                                key={stat.label}
                                ref={(el) => { statsRef.current[i] = el; }}
                                className="text-center"
                            >
                                <span className="text-[#FFF5F5] text-xl sm:text-2xl font-bold block">
                                    {stat.value}
                                </span>
                                <span className="text-[#FFF5F5]/40 text-[9px] font-mono uppercase tracking-widest">
                                    {stat.label}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Box 4: Spotify Link */}
                    <div className="col-span-6 md:col-span-2 bg-[#1DB954]/10 border border-[#1DB954]/30 rounded-lg p-4 flex flex-col items-center justify-center hover:bg-[#1DB954]/20 transition-colors">
                        <a
                            href={SPOTIFY_PROFILE_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col items-center gap-3 text-[#1DB954]"
                        >
                            <svg
                                width="36"
                                height="36"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                            >
                                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                            </svg>
                            <span className="text-[10px] font-mono uppercase tracking-wider text-center leading-tight">
                                {t("viewProfile")}
                            </span>
                        </a>
                    </div>

                </div>
            </div>
        </section>
    );
}
