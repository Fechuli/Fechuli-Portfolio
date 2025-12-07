"use client";

import "@/app/globals.css";
import { JetBrains_Mono } from "next/font/google";
import { useSyncExternalStore } from "react";
import OfflineOverlay from "@/components/effects/offline-overlay";

const jetbrainsMono = JetBrains_Mono({
    subsets: ["latin"],
    variable: "--font-mono",
    display: "swap",
});

const subscribe = () => () => {};
const getSnapshot = () => localStorage.getItem("_x_terminated") === "true";
const getServerSnapshot = () => false;

export default function BBSLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const isOffline = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
    const isChecked = useSyncExternalStore(subscribe, () => true, () => false);

    return (
        <html lang="it">
            <body className={`${jetbrainsMono.variable} bg-black font-mono`}>
                {!isChecked ? null : isOffline ? <OfflineOverlay /> : children}
            </body>
        </html>
    );
}
