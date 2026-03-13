"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { useFilter } from "@/lib/filter-context";
import { FILTER_OPTIONS } from "./shared/filter-types";
import type { FilterType } from "./shared/filter-types";

export default function FilterAccordionMenu() {
    const t = useTranslations();
    const { isUnlocked, isEnabled, selectedFilter, setFilter } = useFilter();
    const [isExpanded, setIsExpanded] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        // Auto-close after 5 seconds of no interaction
        if (isExpanded) {
            timeoutRef.current = setTimeout(() => {
                setIsExpanded(false);
            }, 5000);
        }

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [isExpanded]);

    // Only show if unlocked AND enabled
    if (!isUnlocked || !isEnabled) {
        return null;
    }

    const handleToggle = () => {
        setIsExpanded(!isExpanded);
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newFilter = e.target.value as FilterType;
        setFilter(newFilter);

        // Reset auto-close timer
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
            setIsExpanded(false);
        }, 5000);
    };

    const handleClickOutside = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            setIsExpanded(false);
        }
    };

    return (
        <>
            {/* Backdrop for click-outside detection */}
            {isExpanded && (
                <div
                    className="fixed inset-0"
                    onClick={handleClickOutside}
                    style={{ pointerEvents: 'auto', zIndex: 99996 }}
                />
            )}

            {/* Accordion - unico div che scorre */}
            <div
                className="fixed top-1/2 -translate-y-1/2 flex bg-[#FFF5F5]/90 border-r border-[#330014]/10"
                style={{
                    left: 0,
                    zIndex: 99997,
                    transform: isExpanded ? 'translateY(-50%) translateX(0)' : 'translateY(-50%) translateX(-224px)',
                    transition: 'transform 0.3s ease-in-out',
                    boxShadow: '4px 0 20px rgba(51, 0, 20, 0.08)',
                    backdropFilter: 'blur(8px)'
                }}
            >
                {/* Panel content - sempre presente */}
                <div className="w-56" style={{ pointerEvents: isExpanded ? 'auto' : 'none' }}>
                        {/* Header */}
                        <div className="px-4 py-3 border-b border-[#330014]/10 flex justify-between items-center">
                            <span className="text-[#330014] text-xs font-mono uppercase tracking-[0.2em]">
                                Visual FX
                            </span>
                            <button
                                onClick={handleToggle}
                                className="text-[#330014]/40 hover:text-[#330014] transition-all duration-300 outline-none focus:outline-none"
                            >
                                <span className="text-sm">◀</span>
                            </button>
                        </div>

                        {/* Filter Selection */}
                        <div className="p-4">
                            <select
                                value={selectedFilter}
                                onChange={handleFilterChange}
                                className="w-full bg-transparent border border-[#330014]/20 text-[#330014] text-sm font-mono px-3 py-2 rounded outline-none focus:outline-none focus:border-[#330014]/40 cursor-pointer"
                            >
                                {FILTER_OPTIONS.map((option) => (
                                    <option
                                        key={option.value}
                                        value={option.value}
                                        className="bg-[#FFF5F5] text-[#330014]"
                                    >
                                        {t(option.label)}
                                    </option>
                                ))}
                            </select>

                            {/* Description */}
                            <p className="text-[#330014]/50 text-xs font-mono mt-2 leading-relaxed">
                                {t(FILTER_OPTIONS.find(opt => opt.value === selectedFilter)?.description || '')}
                            </p>
                        </div>

                        {/* Footer hint */}
                        <div className="px-4 py-2 border-t border-[#330014]/10">
                            <p className="text-[#330014]/30 text-[10px] font-mono uppercase tracking-wide">
                                Auto-close in 5s
                            </p>
                        </div>
                </div>

                {/* Tab - sempre visibile a destra */}
                <button
                    onClick={handleToggle}
                    className="group px-4 py-6 border-l border-[#330014]/10 transition-all duration-300 hover:px-5"
                    style={{ pointerEvents: 'auto' }}
                >
                    <div className="flex flex-col items-center gap-4">
                        {/* Freccia */}
                        <span className="text-[#330014]/40 text-base transition-all duration-300 group-hover:text-[#330014]/80">
                            {isExpanded ? '◀' : '▶'}
                        </span>
                        {/* FX */}
                        <span
                            className="text-[#330014] text-xs font-mono tracking-[0.3em] uppercase"
                            style={{
                                writingMode: 'vertical-rl',
                                textOrientation: 'mixed'
                            }}
                        >
                            FX
                        </span>
                    </div>
                </button>
            </div>
        </>
    );
}
