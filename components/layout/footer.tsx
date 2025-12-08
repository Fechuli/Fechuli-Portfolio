"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import AnimatedLink from "../ui/animated-link";
import TransitionLink from "../ui/transition-link";

export default function Footer() {
    const currentYear = new Date().getFullYear();
    const t = useTranslations("footer");
    const nav = useTranslations("nav");

    return (
        <footer className="border-t border-[#330014]/20 px-4 sm:px-14 py-8 sm:py-5 text-[#330014]">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                <div className="flex flex-col gap-4 col-span-2 md:col-span-1">
                    <TransitionLink href="/">
                        <Image
                            src="/images/logo.svg"
                            alt="Fechuli's Logo"
                            width={40}
                            height={40}
                            className="-rotate-90"
                        />
                    </TransitionLink>
                    <p className="text-sm arimo opacity-50">
                        {t("tagline")}
                    </p>
                </div>

                <div className="flex flex-col items-start gap-2">
                    <h4 className="text-sm arimo opacity-50 uppercase tracking-widest mb-1">
                        {t("sitemap")}
                    </h4>
                    <AnimatedLink href="/">Home</AnimatedLink>
                    <AnimatedLink href="/about">{nav("about")}</AnimatedLink>
                    <AnimatedLink href="/projects">{nav("projects")}</AnimatedLink>
                    <AnimatedLink href="/contact">{nav("contact")}</AnimatedLink>
                    <AnimatedLink href="/blog">{nav("blog")}</AnimatedLink>
                </div>

                <div className="flex flex-col items-start gap-2">
                    <h4 className="text-sm arimo opacity-50 uppercase tracking-widest mb-1">
                        {t("social")}
                    </h4>
                    <AnimatedLink
                        href="https://www.instagram.com/fechuli/"
                        external
                    >
                        Instagram
                    </AnimatedLink>
                    <AnimatedLink
                        href="https://www.linkedin.com/in/federico-fiaschi-601737241/"
                        external
                    >
                        LinkedIn
                    </AnimatedLink>
                    <AnimatedLink
                        href="https://github.com/Fechuli"
                        external
                    >
                        GitHub
                    </AnimatedLink>
                </div>

                <div className="flex flex-col items-start gap-2">
                    <h4 className="text-sm arimo opacity-50 uppercase tracking-widest mb-1">
                        {t("location")}
                    </h4>
                    <p className="arimo">{t("city")}</p>
                    <p className="text-sm arimo opacity-50">
                        43.7696° N, 11.2558° E
                    </p>
                </div>
            </div>

            <div className="mt-12 pt-6 border-t border-[#330014]/10 flex flex-col sm:flex-row justify-between items-center gap-4">
                <p className="text-sm arimo opacity-50">
                    © {currentYear} Federico Fiaschi. {t("copyright")}
                </p>
                <div className="flex items-center gap-4">
                    <p className="text-sm arimo opacity-50">
                        {t("available")}
                    </p>
                    <AnimatedLink href="/sys">
                        {">_sys"}
                    </AnimatedLink>
                </div>
            </div>
        </footer>
    );
}
