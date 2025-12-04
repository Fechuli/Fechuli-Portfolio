"use client";

import { useState } from "react";
import OverlayMenu from "./overlay-menu";
import AnimatedLink from "./animated-link";
import TransitionLink from "./transition-link";
import MenuButton from "./menu-button";
import Image from "next/image";

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navLinks = [
        { name: "About", href: "/about" },
        { name: "Progetti", href: "/progetti" },
        { name: "Contatti", href: "/contatti" },
    ];

    return (
        <>
            <nav className="flex items-center justify-between sticky top-0 z-50 py-4 rounded-t-3xl -mx-4 -mt-4 px-4 w-[calc(100%+2rem)]">
                <TransitionLink href="/">
                    <Image
                        src={"/images/logo.svg"}
                        alt="Fechuli's Logo"
                        width={40}
                        height={40}
                        className="-rotate-90"
                    />
                </TransitionLink>
                <div className="flex items-center gap-6">
                    <div className="items-center gap-10 arimo sm:flex hidden">
                        {navLinks.map((link) => (
                            <AnimatedLink key={link.name} href={link.href}>
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
