"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Contatti() {
    const imageRef = useRef<HTMLDivElement>(null);
    const imageInnerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const imageContainer = imageRef.current;
        const imageInner = imageInnerRef.current;
        if (!imageContainer || !imageInner) return;

        gsap.set(imageInner, { yPercent: -10 });

        gsap.to(imageInner, {
            yPercent: 10,
            ease: "none",
            scrollTrigger: {
                trigger: imageContainer,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.5,
            },
        });

        return () => {
            ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        };
    }, []);

    return (
        <div className="min-h-screen">
            <div className="flex flex-col items-center justify-center py-20 sm:py-40 px-4 sm:px-8">
                <div className="max-w-4xl">
                    <p className="text-lg sm:text-2xl md:text-3xl">Ti interessa ciò che faccio?</p>
                    <h2 className="resin text-4xl sm:text-6xl md:text-7xl text-[#330014] leading-none whitespace-nowrap">
                        Entriamo in contatto
                    </h2>
                    <p className="text-base sm:text-xl md:text-2xl max-w-xs sm:max-w-sm ml-auto text-right mt-2 sm:mt-4">
                        Sentiti liber* di scrivermi sui miei social o di
                        mandarmi una mail per qualsiasi domanda o proposta
                    </p>
                </div>
            </div>

            <div className="flex items-center justify-center px-4 sm:px-14 pb-20 sm:pb-32">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 w-full max-w-6xl">
                    <div
                        ref={imageRef}
                        className="relative h-[350px] sm:h-[500px] md:h-[600px] overflow-hidden order-2 md:order-1"
                    >
                        <div
                            ref={imageInnerRef}
                            className="absolute inset-x-0 h-[120%] -top-[10%]"
                        >
                            <Image
                                src="/images/me.jpg"
                                alt="Federico Fiaschi"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col justify-center gap-3 sm:gap-4 text-[#330014] order-1 md:order-2">
                        {[
                            { name: "Instagram", href: "https://www.instagram.com/fechuli/" },
                            { name: "LinkedIn", href: "https://www.linkedin.com/in/federico-fiaschi-601737241/" },
                            { name: "GitHub", href: "https://github.com/Fechuli" },
                            { name: "federicofiaschi277@gmail.com", href: "mailto:federicofiaschi277@gmail.com" },
                            { name: "federico@backdoor-studio.com", href: "mailto:federico@backdoor-studio.com" },
                        ].map((link, index) => (
                            <a
                                key={link.name}
                                href={link.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-baseline gap-2 sm:gap-4 hover:opacity-70 transition-opacity"
                            >
                                <span className="text-xs sm:text-sm arimo opacity-50">
                                    {String(index + 1).padStart(2, "0")}
                                </span>
                                <span className="relative">
                                    <span className="text-base sm:text-xl md:text-3xl arimo break-all sm:break-normal">
                                        {link.name}
                                    </span>
                                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#330014] group-hover:w-full transition-all duration-300" />
                                </span>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
