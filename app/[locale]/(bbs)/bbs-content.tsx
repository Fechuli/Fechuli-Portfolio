"use client";

import { useSyncExternalStore } from "react";
import OfflineOverlay from "@/components/effects/offline-overlay";

const subscribe = () => () => {};
const getSnapshot = () => localStorage.getItem("_x_terminated") === "true";
const getServerSnapshot = () => false;

export default function BBSContent({
    children,
}: {
    children: React.ReactNode;
}) {
    const isOffline = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
    const isChecked = useSyncExternalStore(subscribe, () => true, () => false);

    if (!isChecked) return null;
    if (isOffline) return <OfflineOverlay />;
    return <>{children}</>;
}
