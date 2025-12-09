"use client";

import { useTranslations } from "next-intl";
import SectionTitle from "../ui/section-title";

export default function ThirdSection() {
    const t = useTranslations("portfolio");

    return (
        <div className="rounded-t-3xl bg-[#FFF5F5] min-h-screen">
            <div className="text-[#330014] px-4 md:px-10 lg:px-16 py-16 md:py-24">
                <SectionTitle>{t("title")}</SectionTitle>
            </div>
        </div>
    );
}
