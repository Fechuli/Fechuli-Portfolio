"use client";

import MusicIntro from "./music-intro";
import MusicalTimeline from "./musical-timeline";
import SpotifyPlayer from "./spotify-player";

export default function MusicSection() {
    return (
        <section className="w-full" aria-label="Music">
            <MusicIntro />
            <MusicalTimeline />
            <SpotifyPlayer />
        </section>
    );
}
