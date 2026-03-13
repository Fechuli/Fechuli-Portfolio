// Filter type definitions

export type FilterType = 'liquify' | 'crt' | 'chromatic';

export interface FilterContextType {
    isUnlocked: boolean;
    isEnabled: boolean;
    selectedFilter: FilterType;
    unlock: () => void;
    toggle: () => void;
    setFilter: (filter: FilterType) => void;
}

export interface FilterOption {
    value: FilterType;
    label: string;
    description: string;
}

export const FILTER_OPTIONS: FilterOption[] = [
    {
        value: 'liquify',
        label: 'filters.liquify.label',
        description: 'filters.liquify.description'
    },
    {
        value: 'crt',
        label: 'filters.crt.label',
        description: 'filters.crt.description'
    },
    {
        value: 'chromatic',
        label: 'filters.chromatic.label',
        description: 'filters.chromatic.description'
    }
];
