"use client";

import { usePageTransition } from "@/lib/transition-context";
import { usePathname } from "next/navigation";

interface TransitionLinkProps {
    href: string;
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
}

export default function TransitionLink({
    href,
    children,
    className,
    onClick,
    onMouseEnter,
    onMouseLeave,
}: TransitionLinkProps) {
    const { startTransition, isTransitioning } = usePageTransition();
    const pathname = usePathname();

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();

        // Non fare nulla se siamo già su questa pagina o se è in corso una transizione
        if (pathname === href || isTransitioning) return;

        // Chiama onClick se fornito (es. per chiudere il menu)
        onClick?.();

        // Avvia la transizione
        startTransition(href);
    };

    return (
        <a
            href={href}
            onClick={handleClick}
            className={className}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            {children}
        </a>
    );
}
