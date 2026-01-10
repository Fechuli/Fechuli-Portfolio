// Lowvibes musical journey timeline data - The Real Story

export interface TimelineMilestone {
    year: number;
    month?: number;
    title: string;
    description: string;
    imageUrl?: string;
    spotifyTrackId?: string;
    category: "formation" | "release" | "performance" | "studio" | "journey";
}

export const LOWVIBES_TIMELINE: TimelineMilestone[] = [
    {
        year: 2019,
        title: "Viaggi Notturni Firenze-Livorno",
        description:
            "Federico e Lorenzo iniziano a viaggiare quasi ogni settimana tra Firenze e Livorno. Durante questi viaggi notturni nasce la voglia di fare musica insieme, di creare qualcosa di proprio.",
        imageUrl: "/images/music/placeholder-journey.jpg",
        category: "journey",
    },
    {
        year: 2019,
        month: 6,
        title: "Lo Studio nel Garage",
        description:
            "Apre lo studio nel garage di Lorenzo. Un piccolo spazio dove iniziare a sperimentare, registrare, provare. Nessuna pretesa, solo la voglia di suonare e vedere cosa succede.",
        imageUrl: "/images/music/placeholder-studio.jpg",
        category: "studio",
    },
    {
        year: 2019,
        month: 9,
        title: "Sperimentazione Selvaggia",
        description:
            "Periodo di totale sperimentazione senza seguire un genere preciso. Provando tutto, registrando tutto. Brani che funzionano musicalmente 'il giusto', ma che rappresentano la pura voglia di creare senza filtri.",
        imageUrl: "/images/music/placeholder-studio.jpg",
        category: "studio",
    },
    {
        year: 2020,
        title: "Passione Funk e Daft Punk Wave",
        description:
            "Si appassionano al funk e all'onda dei Daft Punk. Il sound inizia a prendere una direzione, trovando un'identità nel groove e nei sintetizzatori vintage.",
        imageUrl: "/images/music/placeholder-studio.jpg",
        category: "studio",
    },
    {
        year: 2020,
        month: 8,
        title: "Prime Collaborazioni",
        description:
            "Iniziano le prime collaborazioni con altri musicisti. I primi singoli condivisi, le prime produzioni che escono dallo studio del garage. La musica inizia a circolare.",
        imageUrl: "/images/music/placeholder-release-1.jpg",
        spotifyTrackId: "...", // To be filled by user
        category: "release",
    },
    {
        year: 2021,
        title: "Singoli Senza Schedule",
        description:
            "Periodo di rilasci spontanei. Nessun album, solo singoli. Nessuna schedule da seguire, nessuna deadline. Solo musica che esce quando ha senso, quando piace a noi.",
        imageUrl: "/images/music/placeholder-release-2.jpg",
        category: "release",
    },
    {
        year: 2022,
        title: "Il Juno Arriva in Studio",
        description:
            "Un Roland Juno-60 entra in studio. Il suono cambia, diventa più caldo, più analogico. Il chorus del Juno diventa la firma sonora dei Lowvibes.",
        imageUrl: "/images/music/placeholder-studio.jpg",
        category: "studio",
    },
    {
        year: 2023,
        title: "Live e Nuove Collaborazioni",
        description:
            "Prime esibizioni live e nuove collaborazioni. La musica esce dal garage e si confronta con il pubblico. Ogni tanto un nuovo singolo, quando va a noi.",
        imageUrl: "/images/music/placeholder-performance.jpg",
        category: "performance",
    },
    {
        year: 2024,
        title: "Continuiamo a Fare Musica",
        description:
            "Ancora oggi, ogni tanto facciamo uscire delle cose. Solo quando ci va, quando ha senso. Perché ci piace la musica, non perché dobbiamo seguire un calendario.",
        imageUrl: "/images/music/placeholder-release-1.jpg",
        category: "release",
    },
];

// Category colors for timeline visualization
export const CATEGORY_COLORS: Record<
    TimelineMilestone["category"],
    string
> = {
    formation: "#FFE4D6",
    release: "#FFF5F5",
    performance: "#D6E4FF",
    studio: "#E4D6FF",
    journey: "#FFE4E4", // Soft pink for journey/travel
};

// Helper function to sort timeline chronologically
export function sortTimelineByDate(
    milestones: TimelineMilestone[]
): TimelineMilestone[] {
    return [...milestones].sort((a, b) => {
        if (a.year !== b.year) return a.year - b.year;
        return (a.month || 0) - (b.month || 0);
    });
}

// Calculate position on spiral for timeline visualization
export function calculateSpiralPosition(
    index: number,
    total: number
): { x: number; y: number; rotation: number } {
    const angle = (index / total) * Math.PI * 4; // 2 full rotations
    const radius = 100 + index * 30; // Expanding spiral
    return {
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        rotation: (angle * 180) / Math.PI,
    };
}
