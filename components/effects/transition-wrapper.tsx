"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { usePageTransition } from "@/lib/transition-context";
import PageTransition from "./page-transition";

interface TransitionWrapperProps {
    children: React.ReactNode;
}

export default function TransitionWrapper({ children }: TransitionWrapperProps) {
    const { isTransitioning, endTransition } = usePageTransition();
    const pathname = usePathname();
    const prevPathname = useRef(pathname);

    useEffect(() => {
        if (prevPathname.current !== pathname && isTransitioning) {
            const timer = setTimeout(() => {
                endTransition();
            }, 100);

            prevPathname.current = pathname;
            return () => clearTimeout(timer);
        }
        prevPathname.current = pathname;
    }, [pathname, isTransitioning, endTransition]);

    return (
        <>
            <PageTransition show={isTransitioning} />
            {children}
        </>
    );
}
