// Spotify embed data for Lowvibes tracks

export interface SpotifyTrack {
    id: string;
    name: string;
    embedUrl: string;
    releaseDate?: string;
}

// Featured tracks for player section
// NOTE: User needs to fill in actual Spotify embed URLs
export const FEATURED_TRACKS: SpotifyTrack[] = [
    {
        id: "japan_nostalgia",
        name: "Japan Nostalgia",
        embedUrl: "https://open.spotify.com/embed/track/...", // TO BE FILLED
        releaseDate: "2020-06-15",
    },
    {
        id: "fa_buio_prima",
        name: "Fa Buio Prima",
        embedUrl: "https://open.spotify.com/embed/track/...", // TO BE FILLED
        releaseDate: "2021-04-20",
    },
    {
        id: "echoes",
        name: "Echoes",
        embedUrl: "https://open.spotify.com/embed/track/...", // TO BE FILLED
        releaseDate: "2021-10-15",
    },
];

// Main artist/album embeds
export const SPOTIFY_EMBEDS = {
    artistProfile:
        "https://open.spotify.com/intl-it/artist/0QoH2ffwsLCEdr25Yrk26z",
    // Optional: album embed if user wants to feature full album
    albumEmbed: "https://open.spotify.com/embed/album/...", // TO BE FILLED
};

// Link to artist page
export const ARTIST_URL =
    "https://open.spotify.com/intl-it/artist/0QoH2ffwsLCEdr25Yrk26z";

// Helper to get standard Spotify embed parameters
export function getSpotifyEmbedParams(trackId: string): string {
    const params = new URLSearchParams({
        utm_source: "generator",
        theme: "0", // Dark theme to match site aesthetic
    });
    return `https://open.spotify.com/embed/track/${trackId}?${params.toString()}`;
}
