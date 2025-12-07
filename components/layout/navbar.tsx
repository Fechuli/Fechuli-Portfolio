"use client";

import { useState } from "react";
import OverlayMenu from "./overlay-menu";
import AnimatedLink from "../ui/animated-link";
import TransitionLink from "../ui/transition-link";
import MenuButton from "../ui/menu-button";
import Image from "next/image";
import { useNavbarTheme } from "@/lib/navbar-theme-context";

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { theme } = useNavbarTheme();

    const navLinks = [
        { name: "About", href: "/about" },
        { name: "Progetti", href: "/progetti" },
        { name: "Contatti", href: "/contatti" },
    ];

    const isDark = theme === "dark";

    return (
        <>
            <nav className={`flex items-center justify-between sticky top-0 z-50 py-4 sm:rounded-t-3xl px-4 sm:px-14 transition-colors duration-300 ${isDark ? "text-[#FFF5F5]" : "text-[#330014]"}`}>
                <TransitionLink href="/">
                    <Image
                        src={"/images/logo.svg"}
                        alt="Fechuli's Logo"
                        width={40}
                        height={40}
                        className={`-rotate-90 transition-all duration-300 ${isDark ? "invert" : ""}`}
                    />
                </TransitionLink>
                <div className="flex items-center gap-6">
                    <div className="items-center gap-10 arimo sm:flex hidden">
                        {navLinks.map((link) => (
                            <AnimatedLink key={link.name} href={link.href} isDark={isDark}>
                                {link.name}
                            </AnimatedLink>
                        ))}
                    </div>

                    <MenuButton onClick={() => setIsMenuOpen(true)} />
                </div>
            </nav>

            <OverlayMenu
                isOpen={isMenuOpen}
                onClose={() => setIsMenuOpen(false)}
            />
        </>
    );
}
