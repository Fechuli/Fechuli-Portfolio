"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface HauntedCursorContextType {
    isUnlocked: boolean;
    isEnabled: boolean;
    unlock: () => void;
    toggle: () => void;
}

const HauntedCursorContext = createContext<HauntedCursorContextType>({
    isUnlocked: false,
    isEnabled: false,
    unlock: () => {},
    toggle: () => {},
});

export function HauntedCursorProvider({ children }: { children: ReactNode }) {
    const [isUnlocked, setIsUnlocked] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem("_entity_gift") === "true";
        }
        return false;
    });
    const [isEnabled, setIsEnabled] = useState(() => {
        if (typeof window !== 'undefined') {
            const unlocked = localStorage.getItem("_entity_gift") === "true";
            const enabled = localStorage.getItem("_entity_gift_enabled") === "true";
            return unlocked && enabled;
        }
        return false;
    });

    const unlock = () => {
        localStorage.setItem("_entity_gift", "true");
        localStorage.setItem("_entity_gift_enabled", "true");
        setIsUnlocked(true);
        setIsEnabled(true);
    };

    const toggle = () => {
        if (!isUnlocked) return;
        const newEnabled = !isEnabled;
        localStorage.setItem("_entity_gift_enabled", String(newEnabled));
        setIsEnabled(newEnabled);
    };

    return (
        <HauntedCursorContext.Provider value={{ isUnlocked, isEnabled, unlock, toggle }}>
            {children}
        </HauntedCursorContext.Provider>
    );
}

export function useHauntedCursor() {
    return useContext(HauntedCursorContext);
}
