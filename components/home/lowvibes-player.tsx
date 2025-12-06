"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import gsap from "gsap";

type Track = {
    id: string;
    name: string;
    src: string;
    filterColor: string;
};

const TRACKS: Track[] = [
    {
        id: "japan",
        name: "Japan Nostalgia",
        src: "/audio/lowvibes/japan_radio.mp3",
        filterColor: "sepia(0.6) hue-rotate(-20deg) saturate(1.4)",
    },
    {
        id: "erfa",
        name: "Fa buio prima",
        src: "/audio/lowvibes/erfa_radio.mp3",
        filterColor: "sepia(0.4) hue-rotate(180deg) saturate(1.2)",
    },
    {
        id: "hermes",
        name: "Mare Mosso",
        src: "/audio/lowvibes/hermes_radio.mp3",
        filterColor: "sepia(0.5) hue-rotate(280deg) saturate(1.3)",
    },
];

const SPOTIFY_URL =
    "https://open.spotify.com/intl-it/artist/0QoH2ffwsLCEdr25Yrk26z?si=LtOr_FYIS8mDeCZKIkTvrg";

interface LowVibesPlayerProps {
    imageRef: React.RefObject<HTMLDivElement | null>;
}

export default function LowVibesPlayer({ imageRef }: LowVibesPlayerProps) {
    const [activeTrack, setActiveTrack] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const applyFilter = useCallback(
        (filterValue: string) => {
            if (!imageRef.current) return;

            const img = imageRef.current.querySelector("img");
            if (!img) return;

            gsap.to(img, {
                filter: filterValue,
                duration: 0.6,
                ease: "power2.inOut",
            });
        },
        [imageRef]
    );

    const stopAudio = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            audioRef.current = null;
        }
        setIsPlaying(false);
    }, []);

    const playTrack = useCallback(
        (track: Track) => {
            stopAudio();

            const audio = new Audio(track.src);
            audio.loop = true;
            audioRef.current = audio;

            audio.play().catch(console.error);
            setIsPlaying(true);
            setActiveTrack(track.id);

            applyFilter(track.filterColor);
        },
        [stopAudio, applyFilter]
    );

    const handleTrackClick = (track: Track) => {
        if (activeTrack === track.id && isPlaying) {
            stopAudio();
            setActiveTrack(null);
            applyFilter("none");
        } else {
            playTrack(track);
        }
    };

    const handleDefaultClick = () => {
        stopAudio();
        setActiveTrack(null);
        applyFilter("none");
    };

    useEffect(() => {
        return () => {
            stopAudio();
        };
    }, [stopAudio]);

    return (
        <div className="flex flex-col gap-2 pt-6">
            <p className="opacity-60 text-sm">Ascolta degli estratti di alcuni<br/> brani dei LowVibes</p>
            <button
                onClick={handleDefaultClick}
                className={`px-3 py-2 text-xs font-mono uppercase tracking-wider border transition-all duration-300 text-left ${
                    activeTrack === null
                        ? "bg-[#FFF5F5] text-[#330014] border-[#FFF5F5]"
                        : "bg-transparent text-[#FFF5F5]/60 border-[#FFF5F5]/30 hover:border-[#FFF5F5]/60"
                }`}
            >
                Off
            </button>

            {TRACKS.map((track) => (
                <button
                    key={track.id}
                    onClick={() => handleTrackClick(track)}
                    className={`px-3 py-2 text-xs font-mono uppercase tracking-wider border transition-all duration-300 text-left whitespace-nowrap ${
                        activeTrack === track.id
                            ? "bg-[#FFF5F5] text-[#330014] border-[#FFF5F5]"
                            : "bg-transparent text-[#FFF5F5]/60 border-[#FFF5F5]/30 hover:border-[#FFF5F5]/60"
                    }`}
                >
                    {track.name}
                </button>
            ))}

            <a
                href={SPOTIFY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 flex items-center gap-2 px-3 py-2 text-xs font-mono uppercase tracking-wider text-[#1DB954] border border-[#1DB954]/50 hover:bg-[#1DB954]/10 transition-all duration-300"
            >
                <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                >
                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                </svg>
                Spotify
            </a>
        </div>
    );
}
