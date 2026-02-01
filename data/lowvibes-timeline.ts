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
        year: 2017,
        month: 12,
        title: "28/12/17",
        description:
            "Io e Lorenzo già facevamo un sacco di viaggi di notte. Ascoltavamo Tropical House, Daft Punk e molti altri che ci hanno dato lo sprint per iniziare qualcosa. Nel garage di Lore mettiamo su una scrivania fatta con 4 assi sfuse, un PC Alienware e una cabina per microfoni arrangiata. Volevamo fare musica per il gusto di farla.",
        imageUrl: "/images/music/placeholder-formation.jpg",
        category: "formation",
    },
    {
        year: 2018,
        title: "Sperimentazione",
        description:
            "I primi brani erano brutti. Ma questo non ci impediva di sperimentare come i migliori musicisti degli anni '80. Nuovi sound, nuove idee, nuovi plugin crackati. Sempre con l'idea di portare quel tipo di vibes, quel viaggio che ci aveva accompagnato durante gli ultimi anni di scuola. La Korg di mio padre ha aiutato.",
        imageUrl: "/images/music/placeholder-studio.jpg",
        category: "studio",
    },
    {
        year: 2020,
        title: "Love Me Again",
        description:
            "Pubblichiamo il nostro primo brano, Love Me Again. Realizziamo anche un video per l'uscita del pezzo. Era la prima volta che qualcosa di nostro usciva veramente fuori dal garage.",
        imageUrl: "/images/music/placeholder-release-1.jpg",
        category: "release",
    },
    {
        year: 2021,
        title: "DJ Set",
        description:
            "Iniziano ad uscire altri brani e cominciamo a suonare DJ set dal vivo. Continuiamo per un paio d'anni in giro per club.",
        imageUrl: "/images/music/placeholder-performance.jpg",
        category: "performance",
    },
    {
        year: 2022,
        title: "I Club di Firenze",
        description:
            "Dal 2022 suoniamo in maniera costante nelle discoteche fiorentine più conosciute. Manduca, Space, Tenax. Sempre pubblicando nuovi brani. Ancora nessuna collaborazione con artisti esterni, e questo ci dispiaceva un po'.",
        imageUrl: "/images/music/placeholder-performance.jpg",
        category: "performance",
    },
    {
        year: 2023,
        title: "Collaborazioni",
        description:
            "Finalmente iniziamo ad avere contatto con altri artisti e pubblichiamo brani in italiano con loro. La nostra musica stava prendendo una nuova forma, anche se iniziava ad essere poco sostenibile. Eravamo indipendenti e nel mondo della musica era difficile trovare uno sbocco.",
        imageUrl: "/images/music/placeholder-release-2.jpg",
        category: "release",
    },
    {
        year: 2024,
        title: "Oggi",
        description:
            "Con Backdoor all'attivo, il progetto musicale rallenta e oggi i LowVibes pubblicano in maniera randomica quando capita. Che esista un piano per il loro ritorno?",
        imageUrl: "/images/music/placeholder-release-1.jpg",
        category: "release",
    },
];

export const CATEGORY_COLORS: Record<
    TimelineMilestone["category"],
    string
> = {
    formation: "#FFE4D6",
    release: "#FFF5F5",
    performance: "#D6E4FF",
    studio: "#E4D6FF",
    journey: "#FFE4E4",
};

export function sortTimelineByDate(
    milestones: TimelineMilestone[]
): TimelineMilestone[] {
    return [...milestones].sort((a, b) => {
        if (a.year !== b.year) return a.year - b.year;
        return (a.month || 0) - (b.month || 0);
    });
}

export function calculateSpiralPosition(
    index: number,
    total: number
): { x: number; y: number; rotation: number } {
    const angle = (index / total) * Math.PI * 4;
    const radius = 100 + index * 30;
    return {
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        rotation: (angle * 180) / Math.PI,
    };
}
