import Image from "next/image";
import AnimatedLink from "../ui/animated-link";
import TransitionLink from "../ui/transition-link";

export default function Footer() {
    const currentYear = new Date().getFullYear();

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
                        Digital Craftsman
                    </p>
                </div>

                <div className="flex flex-col items-start gap-2">
                    <h4 className="text-sm arimo opacity-50 uppercase tracking-widest mb-1">
                        Sitemap
                    </h4>
                    <AnimatedLink href="/">Home</AnimatedLink>
                    <AnimatedLink href="/about">About</AnimatedLink>
                    <AnimatedLink href="/progetti">Progetti</AnimatedLink>
                    <AnimatedLink href="/contatti">Contatti</AnimatedLink>
                    <AnimatedLink href="/blog">Blog</AnimatedLink>
                </div>

                <div className="flex flex-col items-start gap-2">
                    <h4 className="text-sm arimo opacity-50 uppercase tracking-widest mb-1">
                        Social
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
                        Località
                    </h4>
                    <p className="arimo">Firenze, Italia</p>
                    <p className="text-sm arimo opacity-50">
                        43.7696° N, 11.2558° E
                    </p>
                </div>
            </div>

            <div className="mt-12 pt-6 border-t border-[#330014]/10 flex flex-col sm:flex-row justify-between items-center gap-4">
                <p className="text-sm arimo opacity-50">
                    © {currentYear} Federico Fiaschi. Tutti i diritti riservati.
                </p>
                <div className="flex items-center gap-4">
                    <p className="text-sm arimo opacity-50">
                        Available for freelance
                    </p>
                    <AnimatedLink href="/sys">
                        {">_sys"}
                    </AnimatedLink>
                </div>
            </div>
        </footer>
    );
}
