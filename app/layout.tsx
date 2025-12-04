import type { Metadata } from "next";
import "./globals.css";
import { Arimo } from "next/font/google";
import { ViewTransition } from "react";
import { LenisProvider } from "@/lib/lenis-context";
import { TransitionProvider } from "@/lib/transition-context";
import { LoaderProvider } from "@/lib/loader-context";
import Navbar from "@/components/navbar";
import GrainOverlay from "@/components/grain-overlay";
import TransitionWrapper from "@/components/transition-wrapper";
import PageLoader from "@/components/page-loader";

const arimo = Arimo({
    subsets: ["latin"],
    variable: "--font-arimo",
    display: "swap",
});

const SITE_NAME = "Fechuli";
const SITE_URL = "https://fechuli.it";

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: {
        default: SITE_NAME,
        template: `%s | ${SITE_NAME}`,
    },
    description: "Fechuli - Sviluppatore Web",
    openGraph: {
        title: SITE_NAME,
        description: "Fechuli - Sviluppatore Web",
        url: SITE_URL,
        siteName: SITE_NAME,
        locale: "it_IT",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
    },
    robots: {
        index: true,
        follow: true,
    },
};

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
                <GrainOverlay />
                <LoaderProvider>
                    <PageLoader />
                    <TransitionProvider>
                        <TransitionWrapper>
                            <LenisProvider>
                                <div className="sm:rounded-t-3xl bg-[#FFF5F5] p-4">
                                    <Navbar />
                                    <ViewTransition>
                                        {children}
                                    </ViewTransition>
                                </div>
                            </LenisProvider>
                        </TransitionWrapper>
                    </TransitionProvider>
                </LoaderProvider>
            </body>
        </html>
    );
}
