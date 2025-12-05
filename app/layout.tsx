"use client";

import "./globals.css";
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

const arimo = Arimo({
    subsets: ["latin"],
    variable: "--font-arimo",
    display: "swap",
});

function LayoutContent({ children }: { children: React.ReactNode }) {
    const { setIsLoading } = useLoader();

    return (
        <>
            <GrainOverlay />
            <CornerGrids />
            <PageLoader onComplete={() => setIsLoading(false)} />
            <TransitionProvider>
                <TransitionWrapper>
                    <LenisProvider>
                        <div className="sm:rounded-t-3xl bg-[#FFF5F5]">
                            <Navbar />
                            <ViewTransition>
                                {children}
                            </ViewTransition>
                        </div>
                    </LenisProvider>
                </TransitionWrapper>
            </TransitionProvider>
        </>
    );
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="it">
            <body
                className={`${arimo.variable} antialiased sm:px-6 px-0 sm:pt-6 bg-[#330014]`}
            >
                <LoaderProvider>
                    <LayoutContent>{children}</LayoutContent>
                </LoaderProvider>
            </body>
        </html>
    );
}
