"use client";

import { useRef, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import CloseButton from "../ui/close-button";
import InteractiveLogo, {
    type InteractiveLogoHandle,
} from "./interactive-logo";
import AnimatedLink from "../ui/animated-link";
import TransitionLink from "../ui/transition-link";
import { useLenis } from "@/lib/lenis-context";
import { useHauntedCursor } from "@/lib/haunted-cursor-context";

interface OverlayMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function OverlayMenu({ isOpen, onClose }: OverlayMenuProps) {
    const t = useTranslations("menu");
    const menuRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const linksContainerRef = useRef<HTMLDivElement>(null);
    const logoRef = useRef<InteractiveLogoHandle>(null);
    const [hoveredLink, setHoveredLink] = useState<number | null>(null);
    const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const { lenis } = useLenis();
    const { isUnlocked, isEnabled, toggle } = useHauntedCursor();

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
        { name: t("home"), href: "/" },
        { name: t("about"), href: "/about" },
        { name: t("projects"), href: "/progetti" },
        { name: t("contact"), href: "/contatti" },
        { name: t("blog"), href: "/blog" },
        { name: t("studio"), href: "/studio" },
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
        const container = linksContainerRef.current;
        if (!container) return;
        const chars = container.querySelectorAll(".menu-char");
        gsap.set(chars, { y: "100%", opacity: 0 });
    }, []);

    useEffect(() => {
        const menu = menuRef.current;
        const overlay = overlayRef.current;
        const container = linksContainerRef.current;

        if (!menu || !overlay) return;

        if (isOpen) {
            const chars = container?.querySelectorAll(".menu-char");

            if (chars) {
                gsap.set(chars, { y: "100%", opacity: 0 });
            }

            overlay.style.display = "block";
            menu.style.display = "block";

            gsap.fromTo(
                overlay,
                { opacity: 0 },
                { opacity: 1, duration: 0.3, ease: "power2.out" }
            );

            gsap.fromTo(
                menu,
                { yPercent: 100 },
                {
                    yPercent: 0,
                    duration: 0.5,
                    ease: "power3.out",
                }
            );

            if (chars && chars.length > 0) {
                gsap.to(chars, {
                    y: "0%",
                    opacity: 1,
                    duration: 0.5,
                    stagger: 0.02,
                    ease: "power3.out",
                    delay: 0.5,
                });
            }
        } else {
            if (container) {
                const chars = container.querySelectorAll(".menu-char");
                gsap.killTweensOf(chars);
            }
            gsap.killTweensOf(menu);
            gsap.killTweensOf(overlay);

            logoRef.current?.reset();

            gsap.to(menu, {
                yPercent: 100,
                duration: 0.4,
                ease: "power3.in",
                onComplete: () => {
                    menu.style.display = "none";
                    if (container) {
                        const chars = container.querySelectorAll(".menu-char");
                        gsap.set(chars, { y: "100%", opacity: 0 });
                    }
                },
            });

            gsap.to(overlay, {
                opacity: 0,
                duration: 0.3,
                delay: 0.1,
                ease: "power2.in",
                onComplete: () => {
                    overlay.style.display = "none";
                },
            });
        }
    }, [isOpen]);

    return (
        <>
            <div
                ref={overlayRef}
                className="fixed inset-0 bg-black/50 z-100000"
                style={{ display: "none", opacity: 0 }}
                onClick={onClose}
            />

            <div
                ref={menuRef}
                className="fixed bottom-0 left-0 right-0 sm:left-6 sm:right-6 h-[70vh] sm:h-[90vh] bg-[#FFF5F5] z-100000 rounded-t-3xl"
                style={{ display: "none" }}
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
                                    <span className="menu-char inline-block">
                                        {String(index + 1).padStart(2, "0")}
                                    </span>
                                </span>
                                <span className="relative overflow-hidden">
                                    <span className="text-6xl md:text-[8vw] resin flex">
                                        {link.name
                                            .split("")
                                            .map((char, charIndex) => (
                                                <span
                                                    key={charIndex}
                                                    className="menu-char inline-block"
                                                >
                                                    {char === " "
                                                        ? "\u00A0"
                                                        : char}
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
                            <span className="block text-xs arimo opacity-50 tracking-widest uppercase">
                                Digital Craftsman open to collaborate
                            </span>
                            <span className="block text-xs arimo opacity-50 tracking-wide mt-2">
                                43.7696° N, 11.2558° E
                            </span>
                            {isUnlocked && (
                                <button
                                    onClick={toggle}
                                    className="group flex items-center gap-2 mt-4 ml-auto transition-all duration-300"
                                >
                                    <span className={`
                                        text-lg transition-all duration-500
                                        ${isEnabled
                                            ? "text-[#330014] opacity-100"
                                            : "text-[#330014]/30 group-hover:text-[#330014]/60"
                                        }
                                    `}>
                                        {isEnabled ? "◉" : "◎"}
                                    </span>
                                    <span className={`
                                        text-[10px] font-mono tracking-[0.3em] uppercase transition-all duration-300
                                        ${isEnabled
                                            ? "text-[#330014]/70"
                                            : "text-[#330014]/30 group-hover:text-[#330014]/50"
                                        }
                                    `}>
                                        {isEnabled ? "∴ attivo ∴" : "∵ inattivo ∵"}
                                    </span>
                                </button>
                            )}
                        </div>
                        <div className="flex-1 flex items-center justify-center w-full overflow-visible">
                            <InteractiveLogo
                                ref={logoRef}
                                className="w-full h-full max-w-[500px] overflow-visible"
                                animate={isOpen}
                                hoveredLink={hoveredLink}
                            />
                        </div>
                        <div className="flex gap-6 text-[#330014] self-end">
                            <AnimatedLink
                                href="https://www.instagram.com/fechuli/"
                                external
                            >
                                Instagram
                            </AnimatedLink>
                            <AnimatedLink
                                href="https://www.linkedin.com/in/federico-fiaschi-601737241/"
                                external
                            >
                                LinkedIn
                            </AnimatedLink>
                            <AnimatedLink
                                href="https://github.com/Fechuli"
                                external
                            >
                                GitHub
                            </AnimatedLink>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
