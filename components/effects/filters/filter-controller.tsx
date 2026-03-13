"use client";

import { useState, useEffect } from "react";
import { useFilter } from "@/lib/filter-context";
import { useLoader } from "@/lib/loader-context";
import { detectMobile } from "./shared/filter-utils";
import LiquifyFilter from "./liquify-filter";
import CrtFilter from "./crt-filter";
import ChromaticFilter from "./chromatic-filter";

export default function FilterController() {
    const { isEnabled, selectedFilter } = useFilter();
    const { isLoading } = useLoader();
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        setIsMobile(detectMobile());
    }, []);

    // Disable on mobile for performance or while loading
    if (!isEnabled || isMobile || isLoading) {
        return null;
    }

    // Render selected filter with crossfade transition
    switch (selectedFilter) {
        case 'liquify':
            return <LiquifyFilter />;
        case 'crt':
            return <CrtFilter />;
        case 'chromatic':
            return <ChromaticFilter />;
        default:
            return null;
    }
}
