"use client";

import { createContext, useContext, useSyncExternalStore, ReactNode } from "react";

type NavbarTheme = "light" | "dark";

interface NavbarThemeContextType {
    theme: NavbarTheme;
}

const NavbarThemeContext = createContext<NavbarThemeContextType>({ theme: "light" });

function getTheme(): NavbarTheme {
    if (typeof window === "undefined") return "light";

    const navbarHeight = 80;
    const checkPoint = navbarHeight / 2;
    const darkSections = document.querySelectorAll("[data-navbar-theme='dark']");

    let isDark = false;
    darkSections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= checkPoint && rect.bottom >= checkPoint) {
            isDark = true;
        }
    });

    return isDark ? "dark" : "light";
}

function subscribeToScroll(callback: () => void) {
    window.addEventListener("scroll", callback, { passive: true });
    window.addEventListener("resize", callback);
    return () => {
        window.removeEventListener("scroll", callback);
        window.removeEventListener("resize", callback);
    };
}

export function NavbarThemeProvider({ children }: { children: ReactNode }) {
    const theme = useSyncExternalStore(
        subscribeToScroll,
        getTheme,
        () => "light" as NavbarTheme
    );

    return (
        <NavbarThemeContext.Provider value={{ theme }}>
            {children}
        </NavbarThemeContext.Provider>
    );
}

export function useNavbarTheme() {
    return useContext(NavbarThemeContext);
}
