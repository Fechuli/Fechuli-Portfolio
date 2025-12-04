"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface LoaderContextType {
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;
}

const LoaderContext = createContext<LoaderContextType | null>(null);

export function LoaderProvider({ children }: { children: ReactNode }) {
    const [isLoading, setIsLoading] = useState(true);

    return (
        <LoaderContext.Provider value={{ isLoading, setIsLoading }}>
            {children}
        </LoaderContext.Provider>
    );
}

export function useLoader() {
    const context = useContext(LoaderContext);
    if (!context) {
        throw new Error("useLoader must be used within a LoaderProvider");
    }
    return context;
}
