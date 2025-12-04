"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import CloseButton from "./close-button";
import InteractiveLogo from "./interactive-logo";
import AnimatedLink from "./animated-link";
import TransitionLink from "./transition-link";
import { useLenis } from "@/lib/lenis-context";

interface OverlayMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function OverlayMenu({ isOpen, onClose }: OverlayMenuProps) {
    const menuRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const linksContainerRef = useRef<HTMLDivElement>(null);
    const [hoveredLink, setHoveredLink] = useState<number | null>(null);
    const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const { lenis } = useLenis();

    const handleLinkHover = (index: number | null) => {
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
            hoverTimeoutRef.current = null;
        }

        if (index === null) {
            hoverTimeoutRef.current = setTimeout(() => {
                setHoveredLink(null);
            }, 50);
        } else {
            hoverTimeoutRef.current = setTimeout(() => {
                setHoveredLink(index);
            }, 150);
        }
    };

    const menuLinks = [
        { name: "Home", href: "/" },
        { name: "About", href: "/about" },
        { name: "Progetti", href: "/progetti" },
        { name: "Contatti", href: "/contatti" },
        { name: "Blog", href: "/blog" },
        { name: "Studio", href: "/studio" },
    ];

    useEffect(() => {
        if (isOpen) {
            lenis?.stop();
        } else {
            lenis?.start();
            if (hoverTimeoutRef.current) {
                clearTimeout(hoverTimeoutRef.current);
                hoverTimeoutRef.current = null;
            }
        }

        return () => {
            lenis?.start();
            if (hoverTimeoutRef.current) {
                clearTimeout(hoverTimeoutRef.current);
            }
        };
    }, [isOpen, lenis]);

    useEffect(() => {
        const menu = menuRef.current;
        const overlay = overlayRef.current;

        if (!menu || !overlay) return;

        if (isOpen) {
            gsap.set(overlay, { display: "block" });
            gsap.set(menu, { display: "block" });

            gsap.to(overlay, {
                opacity: 1,
                duration: 0.3,
                ease: "power2.out",
            });

            gsap.fromTo(
                menu,
                { y: "100%" },
                {
                    y: "0%",
                    duration: 0.5,
                    ease: "power3.out",
                    onComplete: () => {
                        const container = linksContainerRef.current;
                        if (!container) return;

                        const chars = container.querySelectorAll(".menu-char");
                        gsap.fromTo(
                            chars,
                            { y: "100%", opacity: 0 },
                            {
                                y: "0%",
                                opacity: 1,
                                duration: 0.5,
                                stagger: 0.02,
                                ease: "power3.out",
                            }
                        );
                    },
                }
            );
        } else {
            const container = linksContainerRef.current;
            if (container) {
                const chars = container.querySelectorAll(".menu-char");
                gsap.set(chars, { y: "100%", opacity: 0 });
            }
            gsap.to(menu, {
                y: "100%",
                duration: 0.4,
                ease: "power3.in",
            });

            gsap.to(overlay, {
                opacity: 0,
                duration: 0.3,
                delay: 0.1,
                ease: "power2.in",
                onComplete: () => {
                    gsap.set(overlay, { display: "none" });
                    gsap.set(menu, { display: "none" });
                },
            });
        }
    }, [isOpen]);

    return (
        <>
            <div
                ref={overlayRef}
                className="fixed inset-0 lg:top-5 top-6 left-2 right-2 sm:left-6 sm:right-6 bg-black/50 z-50 hidden opacity-0 rounded-t-3xl"
                onClick={onClose}
            />

            <div
                ref={menuRef}
                className="fixed bottom-0 left-2 right-2 sm:left-6 sm:right-6 h-[70vh] sm:h-[90vh] bg-[#FFF5F5] z-50 rounded-t-3xl hidden"
                style={{ transform: "translateY(100%)" }}
            >
                <div className="flex justify-end p-4 border-b border-[#330014]/20">
                    <CloseButton onClick={onClose} />
                </div>

                <div className="h-[calc(100%-73px)] grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 px-4 sm:px-8 pt-4 sm:pt-8 overflow-hidden">
                    <div
                        ref={linksContainerRef}
                        data-lenis-prevent
                        className="flex flex-col justify-start gap-2 pb-8 overflow-y-scroll overscroll-contain scrollbar-hide h-full"
                    >
                        {menuLinks.map((link, index) => (
                            <TransitionLink
                                key={link.name}
                                href={link.href}
                                onClick={onClose}
                                onMouseEnter={() => handleLinkHover(index)}
                                onMouseLeave={() => handleLinkHover(null)}
                                className="group flex items-baseline gap-4 text-[#330014] hover:opacity-70 transition-opacity"
                            >
                                <span className="text-sm arimo opacity-50 overflow-hidden">
                                    <span className="menu-char inline-block" style={{ transform: "translateY(100%)", opacity: 0 }}>
                                        {String(index + 1).padStart(2, "0")}
                                    </span>
                                </span>
                                <span className="relative overflow-hidden">
                                    <span className="text-6xl md:text-[8vw] resin flex">
                                        {link.name.split("").map((char, charIndex) => (
                                            <span
                                                key={charIndex}
                                                className="menu-char inline-block"
                                                style={{ transform: "translateY(100%)", opacity: 0 }}
                                            >
                                                {char === " " ? "\u00A0" : char}
                                            </span>
                                        ))}
                                    </span>
                                    <span className="absolute bottom-2 left-0 w-0 h-0.5 bg-[#330014] group-hover:w-full transition-all duration-300" />
                                </span>
                            </TransitionLink>
                        ))}
                    </div>

                    <div className="hidden md:flex flex-col items-center justify-between p-8 h-full overflow-visible">
                        <div className="self-end text-right text-[#330014]">
                            <span className="block text-xs arimo opacity-50 tracking-widest uppercase">Digital Craftsman open to collaborate</span>
                            <span className="block text-xs arimo opacity-50 tracking-wide mt-2">43.7696° N, 11.2558° E</span>
                        </div>
                        <div className="flex-1 flex items-center justify-center w-full overflow-visible">
                            <InteractiveLogo className="w-full h-full max-w-[500px] overflow-visible" animate={isOpen} hoveredLink={hoveredLink} />
                        </div>
                        <div className="flex gap-6 text-[#330014] self-end">
                            <AnimatedLink href="https://www.instagram.com/fechuli/" external>
                                Instagram
                            </AnimatedLink>
                            <AnimatedLink href="https://www.linkedin.com/in/federico-fiaschi-601737241/" external>
                                LinkedIn
                            </AnimatedLink>
                            <AnimatedLink href="https://github.com/Fechuli" external>
                                GitHub
                            </AnimatedLink>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
