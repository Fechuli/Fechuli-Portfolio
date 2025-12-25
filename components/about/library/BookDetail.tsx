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
            { opacity: 0, y: 20 },
            {
                opacity: 1,
                y: 0,
                duration: 0.5,
                stagger: 0.1,
                ease: "power2.out",
            }
        );
    }, [book]);

    return (
        <div ref={containerRef} className="h-full flex flex-col">
            <div className="flex items-start justify-between mb-6 animate-in">
                <div>
                    <h2 className="resin text-3xl md:text-4xl font-bold text-[#FFF5F5] mb-2">
                        {t(`books.${book.id}.title`)}
                    </h2>
                    <p className="text-[#FFF5F5]/70 text-lg">
                        {t(`books.${book.id}.author`)}
                    </p>
                </div>
                <button
                    onClick={onClose}
                    className="text-[#FFF5F5]/60 hover:text-[#FFF5F5] transition-colors p-2"
                    aria-label={t("closeBook")}
                >
                    <svg
                        width="24"
                        height="24"
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

            {/* Descrizione */}
            <div className="mb-6 animate-in">
                <h3 className="text-sm uppercase tracking-wider text-[#FFF5F5]/50 mb-2">
                    {t("sections.description")}
                </h3>
                <p className="text-[#FFF5F5]/90 leading-relaxed">
                    {t(`books.${book.id}.description`)}
                </p>
            </div>

            {/* Commento personale */}
            <div className="animate-in">
                <h3 className="text-sm uppercase tracking-wider text-[#FFF5F5]/50 mb-2">
                    {t("sections.comment")}
                </h3>
                <p className="text-[#FFF5F5]/90 leading-relaxed italic">
                    {t(`books.${book.id}.comment`)}
                </p>
            </div>

            {/* Hint per rotazione - solo desktop */}
            <div className="mt-auto pt-6 animate-in hidden sm:block">
                <p className="text-[#FFF5F5]/40 text-sm flex items-center gap-2">
                    <svg
                        width="16"
                        height="16"
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
