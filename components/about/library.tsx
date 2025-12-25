"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import gsap from "gsap";
import type { Book } from "@/data/books";
import BookDetail from "./library/BookDetail";

const BookshelfScene = dynamic(() => import("./library/BookshelfScene"), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-[#FFF5F5]/30 border-t-[#FFF5F5] rounded-full animate-spin" />
        </div>
    ),
});

const SelectedBookViewer = dynamic(() => import("./library/SelectedBookViewer"), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-[#FFF5F5]/30 border-t-[#FFF5F5] rounded-full animate-spin" />
        </div>
    ),
});

export default function Library() {
    const t = useTranslations("library");
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);
    const [isMobile, setIsMobile] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const bookDetailRef = useRef<HTMLDivElement>(null);
    const introRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    useEffect(() => {
        if (selectedBook && bookDetailRef.current) {
            gsap.fromTo(
                bookDetailRef.current,
                { opacity: 0 },
                { opacity: 1, duration: 0.5, ease: "power2.out" }
            );
        }
        if (!selectedBook && introRef.current) {
            gsap.fromTo(
                introRef.current,
                { opacity: 0 },
                { opacity: 1, duration: 0.5, ease: "power2.out" }
            );
        }
    }, [selectedBook]);

    const handleSelectBook = (book: Book) => {
        setSelectedBook(book);
    };

    const handleCloseBook = () => {
        if (bookDetailRef.current) {
            gsap.to(bookDetailRef.current, {
                opacity: 0,
                duration: 0.4,
                ease: "power2.out",
                onComplete: () => setSelectedBook(null),
            });
        } else {
            setSelectedBook(null);
        }
    };

    if (isMobile) {
        return (
            <div ref={containerRef} data-navbar-theme="dark" className="min-h-screen bg-[#330014] relative">
                <div className="px-6 pt-8 pb-6">
                    <p className="text-[#FFF5F5]/70 text-lg leading-relaxed font-light">
                        {t("intro")}
                    </p>
                </div>

                <div className="h-[60vh]">
                    <BookshelfScene
                        onSelectBook={handleSelectBook}
                        selectedBook={selectedBook}
                    />
                </div>

                {selectedBook && (
                    <div className="fixed inset-0 z-50 bg-[#330014] flex flex-col">
                        <div className="h-[45vh]">
                            <SelectedBookViewer book={selectedBook} />
                        </div>

                        <div className="flex-1 overflow-y-auto px-4 pb-8">
                            <BookDetail book={selectedBook} onClose={handleCloseBook} />
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div ref={containerRef} data-navbar-theme="dark" className="min-h-screen bg-[#330014] relative">
            <div className="h-screen flex">
                <div className="w-1/3 flex flex-col border-r border-[#FFF5F5]/10">
                    {selectedBook ? (
                        <div ref={bookDetailRef} className="flex flex-col h-full">
                            <div className="h-1/2 border-b border-[#FFF5F5]/10">
                                <SelectedBookViewer book={selectedBook} />
                            </div>

                            <div className="flex-1 overflow-y-auto p-6">
                                <BookDetail book={selectedBook} onClose={handleCloseBook} />
                            </div>
                        </div>
                    ) : (
                        <div
                            ref={introRef}
                            className="flex items-center justify-center h-full p-10"
                        >
                            <p className="text-[#FFF5F5]/70 text-xl leading-relaxed font-light max-w-md">
                                {t("intro")}
                            </p>
                        </div>
                    )}
                </div>

                {/* Pannello destro - Scaffale */}
                <div className="flex-1 flex flex-col">
                    {/* Scaffale 3D */}
                    <div className="flex-1">
                        <BookshelfScene
                            onSelectBook={handleSelectBook}
                            selectedBook={selectedBook}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
