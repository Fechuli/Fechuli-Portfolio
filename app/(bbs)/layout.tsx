"use client";

import "@/app/globals.css";
import { JetBrains_Mono } from "next/font/google";
import { useState, useEffect } from "react";
import OfflineOverlay from "@/components/effects/offline-overlay";

const jetbrainsMono = JetBrains_Mono({
    subsets: ["latin"],
    variable: "--font-mono",
    display: "swap",
});

export default function BBSLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isOffline, setIsOffline] = useState(false);
    const [isChecked, setIsChecked] = useState(false);

    useEffect(() => {
        const terminated = localStorage.getItem("_x_terminated") === "true";
        setIsOffline(terminated);
        setIsChecked(true);
    }, []);

    return (
        <html lang="it">
            <body className={`${jetbrainsMono.variable} bg-black font-mono`}>
                {!isChecked ? null : isOffline ? <OfflineOverlay /> : children}
            </body>
        </html>
    );
}
