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

        if (pathname === href || isTransitioning) return;

        onClick?.();

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
