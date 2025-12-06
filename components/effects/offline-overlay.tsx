"use client";

import Link from "next/link";

export default function OfflineOverlay() {
    return (
        <div className="fixed inset-0 bg-black z-99999 flex flex-col">
            <div className="text-white/20 text-xl font-mono">
                SYSTEM OFFLINE
            </div>

            <Link
                href="/"
                className="absolute bottom-8 right-10 text-white/30 text-xs font-mono hover:text-white/50 transition-colors"
            >
                Torna alla home
            </Link>
        </div>
    );
}
