"use client";

import { useRef } from "react";
import gsap from "gsap";
import { usePageTransition } from "@/lib/transition-context";
import { usePathname } from "next/navigation";

interface AnimatedLinkProps {
    href: string;
    children: string;
    external?: boolean;
}

export default function AnimatedLink({ href, children, external = false }: AnimatedLinkProps) {
    const containerRef = useRef<HTMLAnchorElement>(null);
    const { startTransition, isTransitioning } = usePageTransition();
    const pathname = usePathname();

    const handleClick = (e: React.MouseEvent) => {
        if (external) return; // Link esterni non usano la transizione

        e.preventDefault();
        if (pathname === href || isTransitioning) return;
        startTransition(href);
    };

    const handleMouseEnter = () => {
        const container = containerRef.current;
        if (!container) return;

        const normalChars = container.querySelectorAll(".char-normal");
        const italicChars = container.querySelectorAll(".char-italic");

        gsap.to(normalChars, {
            y: "-100%",
            duration: 0.3,
            stagger: 0.02,
            ease: "power2.out",
        });

        gsap.to(italicChars, {
            y: "0%",
            duration: 0.3,
            stagger: 0.02,
            ease: "power2.out",
        });
    };

    const handleMouseLeave = () => {
        const container = containerRef.current;
        if (!container) return;

        const normalChars = container.querySelectorAll(".char-normal");
        const italicChars = container.querySelectorAll(".char-italic");

        gsap.to(normalChars, {
            y: "0%",
            duration: 0.3,
            stagger: 0.02,
            ease: "power2.out",
        });

        gsap.to(italicChars, {
            y: "100%",
            duration: 0.3,
            stagger: 0.02,
            ease: "power2.out",
        });
    };

    const chars = children.split("");

    const content = (
        <>
            <span className="flex resin invisible">
                {chars.map((char, i) => (
                    <span key={i} className="inline-block">
                        {char === " " ? "\u00A0" : char}
                    </span>
                ))}
            </span>
            <span className="flex absolute top-0 left-0 w-full justify-center">
                {chars.map((char, i) => (
                    <span
                        key={i}
                        className="char-normal inline-block"
                        style={{ transform: "translateY(0%)" }}
                    >
                        {char === " " ? "\u00A0" : char}
                    </span>
                ))}
            </span>
            <span className="flex absolute top-0 left-0 w-full justify-center resin">
                {chars.map((char, i) => (
                    <span
                        key={i}
                        className="char-italic inline-block"
                        style={{ transform: "translateY(100%)" }}
                    >
                        {char === " " ? "\u00A0" : char}
                    </span>
                ))}
            </span>
        </>
    );

    const className = "relative inline-block overflow-hidden";

    if (external) {
        return (
            <a
                ref={containerRef}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={className}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                {content}
            </a>
        );
    }

    return (
        <a
            ref={containerRef}
            href={href}
            onClick={handleClick}
            className={className}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {content}
        </a>
    );
}
