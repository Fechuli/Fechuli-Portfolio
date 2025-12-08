"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useTransition } from "react";

export default function LanguageSwitcher() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const [isPending, startTransition] = useTransition();

    const switchLocale = (newLocale: "en" | "it") => {
        startTransition(() => {
            router.replace(pathname, { locale: newLocale });
        });
    };

    return (
        <div className="flex items-center gap-1 text-xs font-mono uppercase tracking-wider">
            <button
                onClick={() => switchLocale("en")}
                disabled={isPending}
                className={`px-1.5 py-0.5 transition-opacity ${
                    locale === "en" ? "opacity-100" : "opacity-40 hover:opacity-70"
                }`}
            >
                EN
            </button>
            <span className="opacity-30">/</span>
            <button
                onClick={() => switchLocale("it")}
                disabled={isPending}
                className={`px-1.5 py-0.5 transition-opacity ${
                    locale === "it" ? "opacity-100" : "opacity-40 hover:opacity-70"
                }`}
            >
                IT
            </button>
        </div>
    );
}
