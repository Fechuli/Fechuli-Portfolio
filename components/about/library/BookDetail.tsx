"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import type { Book } from "@/data/books";

interface BookDetailProps {
    book: Book;
    onClose: () => void;
}

export default function BookDetail({ book, onClose }: BookDetailProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const t = useTranslations("library");

    useEffect(() => {
        if (!containerRef.current) return;

        const elements = containerRef.current.querySelectorAll(".animate-in");

        gsap.fromTo(
            elements,
            { opacity: 0, y: 15 },
            {
                opacity: 1,
                y: 0,
                duration: 0.4,
                stagger: 0.08,
                ease: "power2.out",
            }
        );
    }, [book]);

    return (
        <div ref={containerRef} className="h-full flex flex-col">
            <div className="flex items-start justify-between mb-4 animate-in">
                <div className="flex-1 pr-4">
                    <h2 className="resin text-2xl md:text-3xl lg:text-4xl font-bold text-[#FFF5F5] leading-tight">
                        {t(`books.${book.id}.title`)}
                    </h2>
                    <p className="text-[#FFF5F5]/60 text-sm md:text-base mt-1 tracking-wide">
                        {t(`books.${book.id}.author`)}
                    </p>
                </div>
                <button
                    onClick={onClose}
                    className="text-[#FFF5F5]/40 hover:text-[#FFF5F5] transition-colors p-1.5 hover:bg-[#FFF5F5]/10 rounded-full"
                    aria-label={t("closeBook")}
                >
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>
            </div>

            <div className="w-12 h-px bg-[#FFF5F5]/20 mb-4 animate-in" />

            <div className="flex-1 overflow-y-auto pr-2 space-y-5">
                <div className="animate-in">
                    <h3 className="text-[10px] uppercase tracking-[0.2em] text-[#FFF5F5]/40 mb-2 font-medium">
                        {t("sections.description")}
                    </h3>
                    <p className="text-[#FFF5F5]/85 text-sm leading-relaxed">
                        {t(`books.${book.id}.description`)}
                    </p>
                </div>

                <div className="animate-in">
                    <h3 className="text-[10px] uppercase tracking-[0.2em] text-[#FFF5F5]/40 mb-2 font-medium">
                        {t("sections.comment")}
                    </h3>
                    <p className="text-[#FFF5F5]/70 text-sm leading-relaxed italic border-l-2 border-[#FFF5F5]/20 pl-3">
                        {t(`books.${book.id}.comment`)}
                    </p>
                </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#FFF5F5]/10 animate-in hidden sm:block">
                <p className="text-[#FFF5F5]/30 text-xs flex items-center gap-2">
                    <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path d="M21 12a9 9 0 11-6.219-8.56" />
                        <polyline points="21 3 21 9 15 9" />
                    </svg>
                    {t("rotateHint")}
                </p>
            </div>
        </div>
    );
}
