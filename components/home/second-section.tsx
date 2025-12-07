"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import StoryPath from "./story-path";
import LowVibesPlayer from "./lowvibes-player";

gsap.registerPlugin(ScrollTrigger, SplitText);

const IMAGES = [
    {
        src: "/images/about-me/1.webp",
        caption: "Cena da Hallasan, uno dei migliori coreani a Firenze",
    },
    {
        src: "/images/about-me/2.webp",
        caption: "Io e Lorenzo durante un classico dj set",
    },
    {
        src: "/images/about-me/3.webp",
        caption: "Io e Lorenzo al Tenax, famoso locale notturno fiorentino.",
    },
    {
        src: "/images/about-me/4.webp",
        caption: "Duccio e Nicco in studio a lavorare agli NFT",
    },
    {
        src: "/images/about-me/5.webp",
        caption: "Orso *il mio cane* e Duccio in studio",
    },
    { src: "/images/about-me/6.webp", caption: "Classica posa dei LowVibes" },
    {
        src: "/images/about-me/7.webp",
        caption:
            "Dudade (destra) e Vieri (sinistra) dormono in studio, Lore festeggia",
    },
    { src: "/images/about-me/8.webp", caption: "Io e Lorenzo in ascensore" },
    {
        src: "/images/about-me/9.webp",
        caption: "Purrino *il mio gatto* che sbadiglia in terrazza",
    },
];

interface ParallaxImageProps {
    src: string;
    caption: string;
    className?: string;
    height?: string;
    objectPosition?: string;
    imageRef?: React.RefObject<HTMLDivElement | null>;
}

function ParallaxImage({
    src,
    caption,
    className = "",
    height = "h-[300px] sm:h-[400px] md:h-[500px]",
    objectPosition = "object-center",
    imageRef,
}: ParallaxImageProps) {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const localInnerRef = useRef<HTMLDivElement>(null);
    const innerRef = imageRef || localInnerRef;

    useEffect(() => {
        const wrapper = wrapperRef.current;
        const container = containerRef.current;
        const inner = innerRef.current;
        if (!wrapper || !container || !inner) return;

        gsap.set(wrapper, { height: 0 });

        const revealAnimation = gsap.to(wrapper, {
            height: "100%",
            duration: 1.4,
            ease: "power2.out",
            scrollTrigger: {
                trigger: wrapper,
                start: "top 95%",
                toggleActions: "play none none none",
            },
        });

        gsap.set(inner, { yPercent: -10 });

        const parallaxAnimation = gsap.to(inner, {
            yPercent: 10,
            ease: "none",
            scrollTrigger: {
                trigger: container,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.5,
            },
        });

        return () => {
            revealAnimation.kill();
            parallaxAnimation.kill();
        };
    }, [innerRef]);

    return (
        <div className={className}>
            <div className={`relative ${height}`}>
                <div
                    ref={wrapperRef}
                    className="absolute bottom-0 left-0 right-0 overflow-hidden"
                >
                    <div
                        ref={containerRef}
                        className={`relative ${height} overflow-hidden`}
                    >
                        <div
                            ref={imageRef || innerRef}
                            className="absolute inset-x-0 h-[120%] -top-[10%]"
                        >
                            <Image
                                src={src}
                                alt={caption}
                                fill
                                className={`object-cover ${objectPosition}`}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <p className="text-sm mt-3 opacity-70 source">{caption}</p>
        </div>
    );
}

export default function SecondSection() {
    const titleRef = useRef<HTMLHeadingElement>(null);
    const lowvibesImageRef = useRef<HTMLDivElement>(null);
    const [fontLoaded, setFontLoaded] = useState(false);

    useEffect(() => {
        const loadFont = async () => {
            try {
                await document.fonts.load("1em Resin");
                await document.fonts.ready;
                setFontLoaded(true);
            } catch {
                setTimeout(() => setFontLoaded(true), 500);
            }
        };
        loadFont();
    }, []);

    useEffect(() => {
        if (!titleRef.current || !fontLoaded) return;

        const split = new SplitText(titleRef.current, { type: "chars" });
        const chars = split.chars;

        if (!chars || chars.length === 0) return;

        gsap.set(chars, {
            opacity: 0,
            x: -20,
            transformOrigin: "left center",
        });

        gsap.to(chars, {
            opacity: 1,
            x: 0,
            duration: 0.4,
            ease: "power2.out",
            stagger: 0.03,
            scrollTrigger: {
                trigger: titleRef.current,
                start: "top 80%",
                toggleActions: "play none none none",
            },
        });

        return () => {
            split.revert();
        };
    }, [fontLoaded]);

    return (
        <div className="bg-[#330014] text-[#FFF5F5] relative" data-navbar-theme="dark">
            <StoryPath />
            <div className="px-4 md:px-10 lg:px-16 py-16 md:py-24">
                <h2
                    ref={titleRef}
                    className="text-4xl sm:text-6xl md:text-8xl lg:text-[11rem] tracking-[-0.06em] font-semibold mb-12 sm:mb-16 md:mb-24"
                >
                    Chi sono
                </h2>

                <div className="space-y-16 sm:space-y-20 md:space-y-32">
                    <div className="grid grid-cols-12 gap-4 md:gap-8 items-center">
                        <div className="col-span-12 md:col-span-5 space-y-6 text-base sm:text-lg md:text-xl font-light leading-relaxed relative">
                            <span
                                data-anchor="anchor-1"
                                className="absolute left-0 bottom-0"
                            />
                            <span
                                data-anchor="anchor-1b"
                                className="absolute right-0 bottom-0"
                            />
                            <p>
                                Ciao, sono Federico, classe 1998 e nato a
                                Firenze. Da quando mio babbo ha portato la
                                Playstation 2 a casa ho sempre avuto una
                                passione sfrenata per i videogiochi. Questa
                                passione mi ha spinto a studiare informatica e a
                                volermi specializzare nella loro costruzione.
                            </p>
                        </div>
                        <div className="col-span-12 md:col-span-6 md:col-start-7">
                            <ParallaxImage
                                src={IMAGES[0].src}
                                caption={IMAGES[0].caption}
                                height="h-[350px] sm:h-[450px] md:h-[550px]"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-12 gap-4 md:gap-8">
                        <div
                            data-anchor="anchor-2"
                            className="col-span-8 md:col-span-4 md:col-start-2 relative"
                        >
                            <ParallaxImage
                                src={IMAGES[1].src}
                                caption={IMAGES[1].caption}
                                height="h-[250px] sm:h-[300px] md:h-[380px]"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-12 gap-4 md:gap-8 items-center">
                        <div className="col-span-12 md:col-span-4 md:col-start-2 space-y-6 text-base sm:text-lg md:text-xl font-light leading-relaxed order-2 md:order-1 relative">
                            <span
                                data-anchor="anchor-3"
                                className="absolute left-0 top-0"
                            />
                            <span
                                data-anchor="anchor-3b"
                                className="absolute left-0 bottom-0"
                            />
                            <p>
                                Tuttavia la vita a volte prende strade
                                inaspettate e dopo i primi anni di scuola ho
                                abbandonato l&apos;idea. Per molti anni della
                                mia adolescenza ho praticato teatro presso il
                                Teatro Puccini a Firenze.
                            </p>
                        </div>
                        <div
                            data-anchor="anchor-4"
                            className="col-span-12 md:col-span-5 md:col-start-8 order-1 md:order-2 relative"
                        >
                            <ParallaxImage
                                src={IMAGES[2].src}
                                caption={IMAGES[2].caption}
                                height="h-[280px] sm:h-[350px] md:h-[420px]"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-12 gap-4 md:gap-8 items-end">
                        <div
                            data-anchor="anchor-5"
                            className="col-span-12 md:col-span-5 md:col-start-1 relative"
                        >
                            <ParallaxImage
                                src={IMAGES[3].src}
                                caption={IMAGES[3].caption}
                                height="h-[220px] sm:h-[400px] md:h-[480px]"
                            />
                        </div>
                        <div
                            data-anchor="anchor-6"
                            className="col-span-5 md:col-span-3 md:col-start-7 mt-8 md:mt-32 hidden md:block relative"
                        >
                            <ParallaxImage
                                src={IMAGES[4].src}
                                caption={IMAGES[4].caption}
                                height="h-[200px] sm:h-[280px] md:h-[320px]"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-12 gap-4 md:hidden -mt-8">
                        <div className="col-span-8 col-start-5">
                            <ParallaxImage
                                src={IMAGES[4].src}
                                caption={IMAGES[4].caption}
                                height="h-[180px]"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-12 gap-4 md:gap-8">
                        <div className="col-span-12 md:col-span-6 md:col-start-4 space-y-6 text-base sm:text-lg md:text-xl font-light leading-relaxed text-center">
                            <p>
                                Nel frattempo ho aperto uno studio di
                                registrazione col mio amico e collaboratore
                                Lorenzo con cui ho condiviso 6 anni di
                                produzione musicale e dj set. In quegli anni
                                sono nati i:
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-12 gap-4 md:gap-8 -mt-60 sm:-mt-28 md:-mt-120">
                        <div
                            data-anchor="anchor-7"
                            className="col-span-12 md:col-span-8 md:col-start-3 relative"
                        >
                            <Image
                                src={"/images/about-me/lowvibes.webp"}
                                alt="Low Vibes Logo"
                                width={600}
                                height={60}
                                className="mx-auto relative z-10 translate-y-[50%] w-[80%] sm:w-[70%] md:w-auto"
                            />
                            <ParallaxImage
                                src={IMAGES[5].src}
                                caption={IMAGES[5].caption}
                                height="h-[300px] sm:h-[450px] md:h-[800px]"
                                objectPosition="object-top"
                                imageRef={lowvibesImageRef}
                            />
                        </div>
                        <div className="col-span-12 md:col-span-2 hidden md:flex md:items-center">
                            <LowVibesPlayer imageRef={lowvibesImageRef} />
                        </div>
                    </div>

                    <div className="grid grid-cols-12 gap-4 md:gap-8 -mt-6 sm:-mt-10 md:-mt-16">
                        <div
                            data-anchor="anchor-8"
                            className="col-span-10 sm:col-span-6 sm:col-start-7 md:col-span-5 md:col-start-9 relative"
                        >
                            <ParallaxImage
                                src={IMAGES[6].src}
                                caption={IMAGES[6].caption}
                                height="h-[220px] sm:h-[280px] md:h-[350px]"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-12 gap-4 md:gap-8 items-center">
                        <div className="col-span-12 md:col-span-5 md:col-start-1 relative">
                            <ParallaxImage
                                src={IMAGES[7].src}
                                caption={IMAGES[7].caption}
                                height="h-[300px] sm:h-[380px] md:h-[450px]"
                            />
                        </div>
                        <div className="col-span-12 md:col-span-5 md:col-start-7 space-y-6 text-base sm:text-lg md:text-xl font-light leading-relaxed relative">
                            <span
                                data-anchor="anchor-9"
                                className="absolute left-0 top-0"
                            />
                            <span
                                data-anchor="anchor-9b"
                                className="absolute right-0 top-0"
                            />
                            <p>
                                Nel 2019 insieme a Tommaso, Duccio e Lorenzo
                                apro Backdoor Studio che è attualmente la realtà
                                in cui lavoro e condivido le mie giornate
                                lavorative.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-12 gap-4 md:gap-8">
                        <div className="col-span-12 md:col-span-7 md:col-start-6 relative">
                            <span
                                data-anchor="anchor-10"
                                className="absolute right-0 top-1/2 -translate-y-1/2"
                            />
                            <ParallaxImage
                                src={IMAGES[8].src}
                                caption={IMAGES[8].caption}
                                height="h-[350px] sm:h-[500px] md:h-[650px]"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
