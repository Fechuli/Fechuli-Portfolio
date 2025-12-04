"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { useIsMobile } from "@/lib/use-media-query";

interface InteractiveLogoProps {
    className?: string;
    animate?: boolean;
    hoveredLink?: number | null;
}

export default function InteractiveLogo({ className = "", animate = false, hoveredLink = null }: InteractiveLogoProps) {
    const svgRef = useRef<SVGSVGElement>(null);
    const pathsRef = useRef<(SVGPathElement | null)[]>([]);
    const isDrawingRef = useRef(false);
    const hoverTimelineRef = useRef<gsap.core.Timeline | null>(null);
    const isMobile = useIsMobile();

    useEffect(() => {
        // Skip animazioni su mobile
        if (isMobile) return;

        const paths = pathsRef.current.filter(Boolean) as SVGPathElement[];

        if (animate) {
            isDrawingRef.current = true;

            paths.forEach((path) => {
                const length = path.getTotalLength();
                gsap.set(path, {
                    strokeDasharray: length,
                    strokeDashoffset: length,
                });
            });

            gsap.to(paths, {
                strokeDashoffset: 0,
                duration: 1.5,
                stagger: 0.1,
                ease: "power2.inOut",
                onComplete: () => {
                    isDrawingRef.current = false;
                },
            });
        }
    }, [animate, isMobile]);

    useEffect(() => {
        // Skip animazioni su mobile
        if (isMobile) return;

        const paths = pathsRef.current.filter(Boolean) as SVGPathElement[];

        // Non interrompere l'animazione draw iniziale
        if (isDrawingRef.current) return;

        // Uccidi la timeline precedente se esiste
        if (hoverTimelineRef.current) {
            hoverTimelineRef.current.kill();
            hoverTimelineRef.current = null;
        }

        // Reset delle proprietà (senza killTweensOf che interromperebbe il draw)
        gsap.to(paths, {
            scale: 1,
            rotation: 0,
            x: 0,
            y: 0,
            transformOrigin: "center center",
            duration: 0.4,
            stagger: 0.02,
            ease: "power2.out",
            overwrite: "auto",
        });

        if (hoveredLink === null) {
            return;
        }

        // Crea una nuova timeline per l'animazione hover
        const tl = gsap.timeline();
        hoverTimelineRef.current = tl;

        switch (hoveredLink) {
            case 0: // Home - pulse dal centro
                tl.to(paths, {
                    scale: 1.03,
                    transformOrigin: "center center",
                    duration: 0.6,
                    stagger: {
                        each: 0.05,
                        from: "end",
                    },
                    ease: "power2.out",
                    yoyo: true,
                    repeat: -1,
                });
                break;

            case 1: // About - rotazione leggera alternata
                tl.to(paths, {
                    rotation: (i) => i % 2 === 0 ? 3 : -3,
                    transformOrigin: "center center",
                    duration: 0.8,
                    stagger: 0.03,
                    ease: "power2.inOut",
                    yoyo: true,
                    repeat: -1,
                });
                break;

            case 2: // Progetti - explode/separate con ritorno
                paths.forEach((path, i) => {
                    const offset = (paths.length - 1 - i) * 0.8;
                    tl.to(path, {
                        x: offset,
                        y: -offset,
                        transformOrigin: "center center",
                        duration: 0.6,
                        ease: "power2.out",
                    }, i * 0.03);
                });
                break;

            case 3: // Contatti - wave verticale sfalsata
                paths.forEach((path, i) => {
                    tl.to(path, {
                        y: Math.sin(i * 0.8) * 2,
                        duration: 0.5,
                        delay: i * 0.06,
                        ease: "sine.inOut",
                        yoyo: true,
                        repeat: -1,
                    }, 0);
                });
                break;

            case 4: // Blog - wave orizzontale
                paths.forEach((path, i) => {
                    tl.to(path, {
                        x: Math.sin(i * 0.5) * 3,
                        duration: 0.8,
                        ease: "sine.inOut",
                        yoyo: true,
                        repeat: -1,
                        delay: i * 0.05,
                    }, 0);
                });
                break;

            case 5: // Studios - spin
                tl.to(paths, {
                    rotation: 360,
                    transformOrigin: "center center",
                    duration: 2,
                    stagger: 0.05,
                    ease: "power1.inOut",
                    repeat: -1,
                });
                break;
        }
    }, [hoveredLink, isMobile]);

    const handleMouseEnter = (index: number) => {
        if (isMobile) return;
        const path = pathsRef.current[index];
        if (!path) return;

        gsap.to(path, {
            scale: 1.05,
            transformOrigin: "center center",
            duration: 0.3,
            ease: "power2.out",
        });
    };

    const handleMouseLeave = (index: number) => {
        if (isMobile) return;
        const path = pathsRef.current[index];
        if (!path) return;

        gsap.to(path, {
            scale: 1,
            duration: 0.3,
            ease: "power2.out",
        });
    };

    const paths = [
        "M48.9 33H16.4V0.469971H26.62C32.529 0.469971 38.1961 2.81732 42.3744 6.99563C46.5527 11.1739 48.9 16.8409 48.9 22.75V33Z",
        "M46.26 34.5799H14.86V3.16992H25C27.7914 3.16861 30.5558 3.71729 33.1351 4.78461C35.7144 5.85194 38.0582 7.41699 40.0325 9.39037C42.0068 11.3637 43.5729 13.7068 44.6415 16.2856C45.71 18.8644 46.26 21.6285 46.26 24.4199V34.5799Z",
        "M43.62 36.1801H13.32V5.87012H23.4C26.0553 5.87012 28.6847 6.39312 31.1379 7.40927C33.5911 8.42542 35.8201 9.91482 37.6977 11.7924C39.5753 13.67 41.0647 15.8991 42.0809 18.3523C43.097 20.8055 43.62 23.4348 43.62 26.0901V36.1801Z",
        "M41 37.7801H11.78V8.57008H21.78C24.3031 8.56745 26.8019 9.06213 29.1337 10.0258C31.4655 10.9896 33.5844 12.4034 35.3694 14.1866C37.1544 15.9697 38.5705 18.0872 39.5366 20.4179C40.5027 22.7487 41 25.247 41 27.7701V37.7801Z",
        "M38.35 39.38H10.24V11.27H20.18C24.9982 11.2727 29.6182 13.1879 33.0252 16.5948C36.4322 20.0018 38.3473 24.6218 38.35 29.44V39.38Z",
        "M35.71 41H8.70001V14H18.57C23.1106 14 27.4657 15.8017 30.6792 19.0096C33.8927 22.2175 35.7021 26.5694 35.71 31.11V41Z",
        "M33.07 42.5899H7.15997V16.6699H17C21.2666 16.6832 25.3539 18.3873 28.3662 21.409C31.3785 24.4307 33.07 28.5233 33.07 32.7899V42.5899Z",
        "M30.44 44.1901H5.62V19.3701H15.35C19.3513 19.3728 23.188 20.9635 26.0173 23.7928C28.8467 26.6222 30.4373 30.4588 30.44 34.4601V44.1901Z",
        "M27.8 45.7901H4.08002V22.0701H13.74C17.4699 22.0727 21.0461 23.5563 23.6825 26.1946C26.319 28.833 27.8 32.4102 27.8 36.1401V45.7901Z",
        "M25.16 47.4H2.53998V24.77H12.13C13.8372 24.77 15.5276 25.1063 17.1049 25.7596C18.6821 26.4129 20.1152 27.3705 21.3224 28.5776C22.5295 29.7848 23.4871 31.2179 24.1404 32.7951C24.7937 34.3724 25.13 36.0628 25.13 37.77L25.16 47.4Z",
        "M22.53 49H1V27.47H10.52C13.7026 27.47 16.7548 28.7343 19.0053 30.9847C21.2557 33.2351 22.52 36.2874 22.52 39.47L22.53 49Z",
    ];

    const strokeWidths = [0.43, 0.43, 0.44, 0.45, 0.46, 0.46, 0.47, 0.48, 0.49, 0.49, 0.5];
    const opacities = [1, 0.95, 0.9, 0.85, 0.8, 0.75, 0.7, 0.65, 0.6, 0.55, 0.5];

    return (
        <svg
            ref={svgRef}
            viewBox="-5 -5 60 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            style={{ overflow: "visible" }}
        >
            {paths.map((d, i) => (
                <path
                    key={i}
                    ref={(el) => { pathsRef.current[i] = el; }}
                    d={d}
                    stroke="#330014"
                    strokeWidth={strokeWidths[i]}
                    strokeMiterlimit="10"
                    opacity={opacities[i]}
                    className="cursor-pointer transition-colors hover:stroke-[#330014]/60"
                    onMouseEnter={() => handleMouseEnter(i)}
                    onMouseLeave={() => handleMouseLeave(i)}
                />
            ))}
        </svg>
    );
}
