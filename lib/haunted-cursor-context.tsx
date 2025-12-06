"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

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
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [isEnabled, setIsEnabled] = useState(false);

    useEffect(() => {
        // Check localStorage on mount
        const unlocked = localStorage.getItem("_entity_gift") === "true";
        const enabled = localStorage.getItem("_entity_gift_enabled") === "true";
        setIsUnlocked(unlocked);
        setIsEnabled(unlocked && enabled);
    }, []);

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
