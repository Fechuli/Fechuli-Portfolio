"use client";

import MusicIntro from "./music-intro";
import MusicalTimeline from "./musical-timeline";

export default function MusicSection() {
    return (
        <section className="w-full" aria-label="Music">
            {/* Intro sticks at top — timeline scrolls over it */}
            <div className="sticky top-0 z-0">
                <MusicIntro />
            </div>
            <div className="relative z-10">
                <MusicalTimeline />
            </div>
        </section>
    );
}
