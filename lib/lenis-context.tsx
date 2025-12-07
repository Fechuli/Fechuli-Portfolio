"use client";

import { createContext, useContext, useEffect, useRef, useMemo, ReactNode, useCallback } from "react";
import Lenis from "lenis";

interface LenisContextType {
    getLenis: () => Lenis | null;
}

const LenisContext = createContext<LenisContextType>({ getLenis: () => null });

export function useLenis() {
    const { getLenis } = useContext(LenisContext);
    return { lenis: getLenis() };
}

export function LenisProvider({ children }: { children: ReactNode }) {
    const lenisRef = useRef<Lenis | null>(null);

    const getLenis = useCallback(() => lenisRef.current, []);

    const contextValue = useMemo(() => ({ getLenis }), [getLenis]);

    useEffect(() => {
        const lenisInstance = new Lenis();
        lenisRef.current = lenisInstance;

        function raf(time: number) {
            lenisInstance.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        return () => {
            lenisInstance.destroy();
            lenisRef.current = null;
        };
    }, []);

    return (
        <LenisContext.Provider value={contextValue}>
            {children}
        </LenisContext.Provider>
    );
}
