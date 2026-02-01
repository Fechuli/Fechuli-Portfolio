"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import AnimatedLink from "@/components/ui/animated-link";
import SectionTitle from "@/components/ui/section-title";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import StoryPath from "./story-path";
import LowVibesPlayer from "./lowvibes-player";
import BackgroundElement from "./background-element";

gsap.registerPlugin(ScrollTrigger);

const BACKGROUND_IMAGES = [
    {
        src: "/images/about-me/bg-1.webp",
        position: { top: "22%", right: "8%" },
        size: 280,
        blur: 8,
        opacity: 0.35,
        parallaxSpeed: 1.8,
    },
    {
        src: "/images/about-me/bg-2.webp",
        position: { top: "32%", right: "3%" },
        size: 320,
        blur: 10,
        opacity: 0.3,
        parallaxSpeed: 2,
    },
    {
        src: "/images/about-me/bg-3.webp",
        position: { top: "48%", left: "2%" },
        size: 350,
        blur: 8,
        opacity: 0.35,
        parallaxSpeed: 1.6,
    },
    {
        src: "/images/about-me/bg-4.webp",
        position: { top: "68%", left: "15%" },
        size: 400,
        blur: 6,
        opacity: 0.4,
        parallaxSpeed: 1.5,
    },
    {
        src: "/images/about-me/bg-5.webp",
        position: { top: "88%", right: "5%" },
        size: 300,
        blur: 10,
        opacity: 0.3,
        parallaxSpeed: 2.2,
    },
];

const getBackgroundTexts = (t: (key: string) => string) => [
    {
        content:
            "const SecondSection = () => { /* who I am, what I do, why I do it */ }",
        position: { top: "5%", right: "5%" },
        blur: 1,
        opacity: 0.25,
        rotate: -2,
    },
    {
        content:
            "gsap.to(element, { yPercent: 10, ease: 'none', scrollTrigger: { scrub: true } });",
        position: { top: "18%", right: "12%" },
        blur: 1,
        opacity: 0.22,
        rotate: 1,
    },
    {
        content: t("todo"),
        position: { top: "28%", left: "2%" },
        blur: 1,
        opacity: 0.28,
        rotate: -1,
    },
    {
        content:
            "const dreams = ['music', 'code', 'theater', 'games'].filter(d => d.isPassion);",
        position: { top: "42%", right: "2%" },
        blur: 1,
        opacity: 0.2,
        rotate: 2,
    },
    {
        content: t("commit"),
        position: { top: "58%", left: "3%" },
        blur: 1,
        opacity: 0.25,
        rotate: -2,
    },
    {
        content: "useEffect(() => { tapioca(); }, [giuilius]);",
        position: { top: "72%", left: "5%" },
        blur: 1,
        opacity: 0.22,
        rotate: 1,
    },
    {
        content: t("comment"),
        position: { top: "82%", right: "8%" },
        blur: 1,
        opacity: 0.25,
        rotate: -1,
    },
    {
        content:
            "export default function SecondSection() { return <SecondSection />; }",
        position: { top: "88%", left: "8%" },
        blur: 1,
        opacity: 0.2,
        rotate: 2,
    },
];

const IMAGE_SOURCES = [
    "/images/about-me/1.webp",
    "/images/about-me/2.webp",
    "/images/about-me/3.webp",
    "/images/about-me/4.webp",
    "/images/about-me/5.webp",
    "/images/about-me/6.webp",
    "/images/about-me/7.webp",
    "/images/about-me/8.webp",
    "/images/about-me/9.webp",
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
    const lowvibesImageRef = useRef<HTMLDivElement>(null);
    const t = useTranslations("aboutSection");
    const img = useTranslations("images");
    const bgTexts = useTranslations("backgroundTexts");

    const captions = [
        img("caption1"),
        img("caption2"),
        img("caption3"),
        img("caption4"),
        img("caption5"),
        img("caption6"),
        img("caption7"),
        img("caption8"),
        img("caption9"),
    ];

    const backgroundTexts = getBackgroundTexts(bgTexts);

    return (
        <div
            className="bg-[#330014] text-[#FFF5F5] relative overflow-hidden"
            data-navbar-theme="dark"
        >
            {BACKGROUND_IMAGES.map((img, index) => (
                <BackgroundElement
                    key={`img-${index}`}
                    type="image"
                    src={img.src}
                    position={img.position}
                    blur={img.blur}
                    opacity={img.opacity}
                    size={img.size}
                    parallaxSpeed={img.parallaxSpeed}
                />
            ))}
            {backgroundTexts.map((text, index) => (
                <BackgroundElement
                    key={`text-${index}`}
                    type="text"
                    content={text.content}
                    position={text.position}
                    blur={text.blur}
                    opacity={text.opacity}
                    rotate={text.rotate}
                />
            ))}
            <StoryPath />
            <div className="px-4 md:px-10 lg:px-16 py-12 md:py-16">
                <SectionTitle>{t("title")}</SectionTitle>

                <div className="space-y-10 sm:space-y-14 md:space-y-20">
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
                            <p>{t("intro")}</p>
                        </div>
                        <div className="col-span-12 md:col-span-6 md:col-start-7">
                            <ParallaxImage
                                src={IMAGE_SOURCES[0]}
                                caption={captions[0]}
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
                                src={IMAGE_SOURCES[1]}
                                caption={captions[1]}
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
                            <p>{t("theater")}</p>
                        </div>
                        <div
                            data-anchor="anchor-4"
                            className="col-span-12 md:col-span-5 md:col-start-8 order-1 md:order-2 relative"
                        >
                            <ParallaxImage
                                src={IMAGE_SOURCES[2]}
                                caption={captions[2]}
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
                                src={IMAGE_SOURCES[3]}
                                caption={captions[3]}
                                height="h-[220px] sm:h-[400px] md:h-[480px]"
                            />
                        </div>
                        <div
                            data-anchor="anchor-6"
                            className="col-span-5 md:col-span-3 md:col-start-7 mt-8 md:mt-20 hidden md:block relative"
                        >
                            <ParallaxImage
                                src={IMAGE_SOURCES[4]}
                                caption={captions[4]}
                                height="h-[200px] sm:h-[280px] md:h-[320px]"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-12 gap-4 md:hidden -mt-8">
                        <div className="col-span-8 col-start-5">
                            <ParallaxImage
                                src={IMAGE_SOURCES[4]}
                                caption={captions[4]}
                                height="h-[180px]"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-12 gap-4 md:gap-8">
                        <div className="col-span-12 md:col-span-6 md:col-start-4 space-y-6 text-base sm:text-lg md:text-xl font-light leading-relaxed text-center">
                            <p>{t("studio")}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-12 gap-4 md:gap-8 -mt-48 sm:-mt-20 md:-mt-80">
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
                                src={IMAGE_SOURCES[5]}
                                caption={captions[5]}
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
                                src={IMAGE_SOURCES[6]}
                                caption={captions[6]}
                                height="h-[220px] sm:h-[280px] md:h-[350px]"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-12 gap-4 md:gap-8 items-center">
                        <div className="col-span-12 md:col-span-5 md:col-start-1 relative">
                            <ParallaxImage
                                src={IMAGE_SOURCES[7]}
                                caption={captions[7]}
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
                            <p>{t("backdoor")}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-12 gap-4 md:gap-8 items-center">
                        <div className="col-span-12 md:col-span-4 md:col-start-1 space-y-6 order-2 md:order-1">
                            <p className="max-w-xs text-base sm:text-lg md:text-xl font-light leading-relaxed">
                                {t("cta.text")}
                            </p>
                            <AnimatedLink href="/about" isDark>
                                {t("cta.button")}
                            </AnimatedLink>
                        </div>
                        <div className="col-span-12 md:col-span-7 md:col-start-6 relative order-1 md:order-2">
                            <span
                                data-anchor="anchor-10"
                                className="absolute right-0 top-1/2 -translate-y-1/2"
                            />
                            <ParallaxImage
                                src={IMAGE_SOURCES[8]}
                                caption={captions[8]}
                                height="h-[350px] sm:h-[500px] md:h-[650px]"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
