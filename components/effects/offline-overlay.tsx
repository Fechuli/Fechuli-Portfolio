"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export default function OfflineOverlay() {
    const t = useTranslations("offline");

    return (
        <div className="fixed inset-0 bg-black z-99999 flex flex-col">
            <div className="text-white/20 text-xl font-mono">
                {t("systemOffline")}
            </div>

            <Link
                href="/"
                className="absolute bottom-8 right-10 text-white/30 text-xs font-mono hover:text-white/50 transition-colors"
            >
                {t("backToHome")}
            </Link>
        </div>
    );
}
