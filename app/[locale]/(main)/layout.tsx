"use client";

import { useSyncExternalStore } from "react";
import { usePathname } from "@/i18n/navigation";
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
import { FilterProvider } from "@/lib/filter-context";
import FilterController from "@/components/effects/filters/filter-controller";
import FilterAccordionMenu from "@/components/effects/filters/filter-accordion-menu";
import { NavbarThemeProvider } from "@/lib/navbar-theme-context";
import ScrollIndicator from "@/components/ui/scroll-indicator";

const emptySubscribe = () => () => {};

function LayoutContent({ children }: { children: React.ReactNode }) {
    const { setIsLoading } = useLoader();
    const pathname = usePathname();

    const mounted = useSyncExternalStore(
        emptySubscribe,
        () => true,
        () => false
    );

    const isOffline = useSyncExternalStore(
        emptySubscribe,
        () => localStorage.getItem("_x_terminated") === "true",
        () => false
    );

    if (!mounted) {
        return null;
    }

    if (isOffline && pathname === "/") {
        return <EntityInteraction />;
    }

    if (isOffline) {
        return <OfflineOverlay />;
    }

    return (
        <>
            <GrainOverlay />
            <FilterController />
            <FilterAccordionMenu />
            <PageLoader onComplete={() => setIsLoading(false)} />
            <TransitionProvider>
                <TransitionWrapper>
                    <LenisProvider>
                        <NavbarThemeProvider>
                            <CornerGrids />
                            <ScrollIndicator />
                            <div className="sm:rounded-t-3xl bg-[#FFF5F5] max-w-500 mx-auto">
                                <Navbar />
                                <ViewTransition>{children}</ViewTransition>
                                <Footer />
                            </div>
                        </NavbarThemeProvider>
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
        <FilterProvider>
            <LoaderProvider>
                <LayoutContent>{children}</LayoutContent>
            </LoaderProvider>
        </FilterProvider>
    );
}
