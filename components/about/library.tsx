"use client";

import { useState, useEffect, useRef } from "react";
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

const SelectedBookViewer = dynamic(
    () => import("./library/SelectedBookViewer"),
    {
        ssr: false,
        loading: () => (
            <div className="w-full h-full flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-[#FFF5F5]/30 border-t-[#FFF5F5] rounded-full animate-spin" />
            </div>
        ),
    }
);

export default function Library() {
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);
    const [isMobile, setIsMobile] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const bookDetailRef = useRef<HTMLDivElement>(null);

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
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
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
                y: 20,
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
            <div
                ref={containerRef}
                data-navbar-theme="dark"
                className="bg-[#330014] relative"
            >
                <div className="h-[50vh]">
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
                            <BookDetail
                                book={selectedBook}
                                onClose={handleCloseBook}
                            />
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            data-navbar-theme="dark"
            className="bg-[#330014] relative"
        >
            <div className="h-[50vh]">
                <BookshelfScene
                    onSelectBook={handleSelectBook}
                    selectedBook={selectedBook}
                />
            </div>

            {selectedBook && (
                <div
                    ref={bookDetailRef}
                    className="border-t border-[#FFF5F5]/10"
                >
                    <div className="flex min-h-[80vh]">
                        <div className="w-1/3 border-r border-[#FFF5F5]/10">
                            <SelectedBookViewer book={selectedBook} />
                        </div>

                        <div className="flex-1 p-10 lg:p-16">
                            <BookDetail
                                book={selectedBook}
                                onClose={handleCloseBook}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
