"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import type { FilterContextType, FilterType } from "@/components/effects/filters/shared/filter-types";

const FilterContext = createContext<FilterContextType>({
    isUnlocked: false,
    isEnabled: false,
    selectedFilter: 'liquify',
    unlock: () => {},
    toggle: () => {},
    setFilter: () => {},
});

export function FilterProvider({ children }: { children: ReactNode }) {
    // Lazy initialization - read from localStorage only once during initial render
    const [isUnlocked, setIsUnlocked] = useState(() => {
        if (typeof window === 'undefined') return false;

        // Migration: Convert old _entity_gift_enabled to new _filter_enabled
        const oldEnabled = localStorage.getItem("_entity_gift_enabled");
        if (oldEnabled && !localStorage.getItem("_filter_enabled")) {
            localStorage.setItem("_filter_enabled", oldEnabled);
            if (!localStorage.getItem("_selected_filter")) {
                localStorage.setItem("_selected_filter", "liquify");
            }
        }

        return localStorage.getItem("_entity_gift") === "true";
    });

    const [isEnabled, setIsEnabled] = useState(() => {
        if (typeof window === 'undefined') return false;

        const unlocked = localStorage.getItem("_entity_gift") === "true";
        const enabled = localStorage.getItem("_filter_enabled") === "true";
        return unlocked && enabled;
    });

    const [selectedFilter, setSelectedFilter] = useState<FilterType>(() => {
        if (typeof window === 'undefined') return 'liquify';

        const saved = localStorage.getItem("_selected_filter") as FilterType | null;
        if (saved && ['liquify', 'crt', 'chromatic'].includes(saved)) {
            return saved;
        }
        return 'liquify';
    });

    const unlock = () => {
        localStorage.setItem("_entity_gift", "true");
        localStorage.setItem("_filter_enabled", "true");
        if (!localStorage.getItem("_selected_filter")) {
            localStorage.setItem("_selected_filter", "liquify");
        }
        setIsUnlocked(true);
        setIsEnabled(true);
    };

    const toggle = () => {
        if (!isUnlocked) return;

        const newEnabled = !isEnabled;
        localStorage.setItem("_filter_enabled", String(newEnabled));
        setIsEnabled(newEnabled);
    };

    const setFilter = (filter: FilterType) => {
        localStorage.setItem("_selected_filter", filter);
        setSelectedFilter(filter);
    };

    return (
        <FilterContext.Provider
            value={{
                isUnlocked,
                isEnabled,
                selectedFilter,
                unlock,
                toggle,
                setFilter
            }}
        >
            {children}
        </FilterContext.Provider>
    );
}

export function useFilter() {
    return useContext(FilterContext);
}
