/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface TransitionContextType {
    isTransitioning: boolean;
    startTransition: (href: string) => void;
    endTransition: () => void;
}

const TransitionContext = createContext<TransitionContextType>({
    isTransitioning: false,
    startTransition: () => {},
    endTransition: () => {},
});

export function usePageTransition() {
    return useContext(TransitionContext);
}

interface TransitionProviderProps {
    children: ReactNode;
}

export function TransitionProvider({ children }: TransitionProviderProps) {
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [pendingHref, setPendingHref] = useState<string | null>(null);
    const router = useRouter();

    const startTransition = useCallback((href: string) => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setPendingHref(href);

        setTimeout(() => {
            router.push(href);
        }, 500);
    }, [isTransitioning, router]);

    const endTransition = useCallback(() => {
        setIsTransitioning(false);
        setPendingHref(null);
    }, []);

    return (
        <TransitionContext.Provider value={{ isTransitioning, startTransition, endTransition }}>
            {children}
        </TransitionContext.Provider>
    );
}
