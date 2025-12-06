"use client";

import "../globals.css";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Arimo } from "next/font/google";
import { ViewTransition } from "react";
import { LenisProvider } from "@/lib/lenis-context";
import { TransitionProvider } from "@/lib/transition-context";
import { LoaderProvider, useLoader } from "@/lib/loader-context";
import Navbar from "@/components/layout/navbar";
import GrainOverlay from "@/components/effects/grain-overlay";
import TransitionWrapper from "@/components/effects/transition-wrapper";
import PageLoader from "@/components/effects/page-loader";
import CornerGrids from "@/components/ui/corner-grids";
import Footer from "@/components/layout/footer";
import OfflineOverlay from "@/components/effects/offline-overlay";
import EntityInteraction from "@/components/entity/entity-interaction";
import { HauntedCursorProvider, useHauntedCursor } from "@/lib/haunted-cursor-context";
import HauntedCursor from "@/components/effects/haunted-cursor";

const arimo = Arimo({
    subsets: ["latin"],
    variable: "--font-arimo",
    display: "swap",
});

function HauntedCursorEffect() {
    const { isEnabled } = useHauntedCursor();
    if (!isEnabled) return null;
    return <HauntedCursor />;
}

function LayoutContent({ children }: { children: React.ReactNode }) {
    const { setIsLoading } = useLoader();
    const pathname = usePathname();
    const [isOffline, setIsOffline] = useState(false);
    const [isChecked, setIsChecked] = useState(false);

    useEffect(() => {
        const terminated = localStorage.getItem("_x_terminated") === "true";
        setIsOffline(terminated);
        setIsChecked(true);
    }, []);

    // Don't render until we've checked localStorage
    if (!isChecked) {
        return null;
    }

    // If offline and on home page, show entity interaction
    if (isOffline && pathname === "/") {
        return <EntityInteraction />;
    }

    // If offline and NOT on home page, show offline overlay
    if (isOffline) {
        return <OfflineOverlay />;
    }

    return (
        <>
            <GrainOverlay />
            <CornerGrids />
            <HauntedCursorEffect />
            <PageLoader onComplete={() => setIsLoading(false)} />
            <TransitionProvider>
                <TransitionWrapper>
                    <LenisProvider>
                        <div className="sm:rounded-t-3xl bg-[#FFF5F5]">
                            <Navbar />
                            <ViewTransition>{children}</ViewTransition>
                            <Footer />
                        </div>
                    </LenisProvider>
                </TransitionWrapper>
            </TransitionProvider>
        </>
    );
}

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="it">
            <body
                className={`${arimo.variable} antialiased sm:px-6 px-0 sm:pt-6 bg-[#330014]`}
            >
                <HauntedCursorProvider>
                    <LoaderProvider>
                        <LayoutContent>{children}</LayoutContent>
                    </LoaderProvider>
                </HauntedCursorProvider>
            </body>
        </html>
    );
}
