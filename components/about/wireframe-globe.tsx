"use client";

import { useEffect, useRef } from "react";

interface WireframeGlobeProps {
    className?: string;
    containerRef?: React.RefObject<HTMLDivElement | null>;
}

export default function WireframeGlobe({ className = "", containerRef }: WireframeGlobeProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number>(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let width = 0;
        let height = 0;

        const setCanvasSize = () => {
            const rect = canvas.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            ctx.scale(dpr, dpr);
            width = rect.width;
            height = rect.height;
        };

        setCanvasSize();
        window.addEventListener("resize", setCanvasSize);

        let rotation = 0;
        const rotationSpeed = 0.005;

        const colorLight = "#FFF5F5";
        const colorDark = "#330014";

        const latitudeLines = 12;
        const longitudeLines = 24;

        const drawGlobe = () => {
            if (width === 0 || height === 0) {
                animationRef.current = requestAnimationFrame(drawGlobe);
                return;
            }

            const centerX = width / 2;
            const centerY = height / 2;
            const radius = Math.min(width, height) * 0.42;

            ctx.clearRect(0, 0, width, height);

            // Funzione per proiettare punto 3D su 2D con rotazione
            const project = (lat: number, lon: number) => {
                const phi = (lat * Math.PI) / 180;
                const theta = (lon * Math.PI) / 180 + rotation;

                const x = radius * Math.cos(phi) * Math.sin(theta);
                const y = radius * Math.sin(phi);
                const z = radius * Math.cos(phi) * Math.cos(theta);

                // Calcola opacità basata su z (graduale fade)
                // z va da -radius a +radius
                // Normalizziamo a 0-1, con fade zone ai bordi
                const normalizedZ = (z / radius + 1) / 2; // 0 = dietro, 1 = davanti
                // Applica una curva per fade più smooth
                const opacity = Math.pow(normalizedZ, 0.6) * 0.7 + 0.1;

                return {
                    x: centerX + x,
                    y: centerY - y,
                    z: z,
                    opacity: opacity,
                };
            };

            // Funzione per determinare il colore in base alla posizione
            // Il canvas è centrato nella pagina, dobbiamo convertire le coordinate
            // del canvas in coordinate della sezione per matchare la curva SVG
            const getColor = (canvasX: number, canvasY: number) => {
                // Ottieni la posizione del canvas nella pagina
                const canvasRect = canvas.getBoundingClientRect();

                // Converti coordinate canvas in coordinate pagina
                const pageX = canvasRect.left + canvasX;
                const pageY = canvasRect.top + canvasY;

                // Ottieni le dimensioni del container (la sezione About)
                // Se non c'è containerRef, usa la viewport
                const containerEl = containerRef?.current;
                let containerLeft = 0;
                let containerTop = 0;
                let containerWidth = window.innerWidth;
                let containerHeight = window.innerHeight;

                if (containerEl) {
                    const containerRect = containerEl.getBoundingClientRect();
                    containerLeft = containerRect.left;
                    containerTop = containerRect.top;
                    containerWidth = containerRect.width;
                    containerHeight = containerRect.height;
                }

                // Normalizza rispetto al container
                const nx = (pageX - containerLeft) / containerWidth;
                const ny = (pageY - containerTop) / containerHeight;

                // La curva SVG è: Q50,50 da (0,100) a (100,0) in coordinate SVG 0-100
                // Convertito in coordinate normalizzate 0-1:
                // P0 = (0, 1), P1 (controllo) = (0.5, 0.5), P2 = (1, 0)
                // Curva di Bézier quadratica: B(t) = (1-t)²P0 + 2(1-t)tP1 + t²P2
                // Per trovare x dato y, dobbiamo risolvere per t
                // y = (1-t)²*1 + 2(1-t)t*0.5 + t²*0
                // y = (1-t)² + (1-t)t = (1-t)[(1-t) + t] = (1-t)
                // Quindi t = 1 - y
                // x = (1-t)²*0 + 2(1-t)t*0.5 + t²*1
                // x = (1-t)t + t² = t[(1-t) + t] = t
                // Quindi x = t = 1 - y (è effettivamente una linea retta!)
                const curveX = 1 - ny;

                // Se nx > curveX, siamo nella zona bordeaux (sfondo scuro, linee chiare)
                return nx > curveX ? colorLight : colorDark;
            };

            // Disegna linee con opacità graduale basata sulla profondità
            const drawLineWithDepth = (points: { x: number; y: number; z: number; opacity: number }[]) => {
                if (points.length < 2) return;

                // Disegna segmento per segmento per applicare opacità graduale
                for (let i = 0; i < points.length - 1; i++) {
                    const p1 = points[i];
                    const p2 = points[i + 1];

                    // Usa opacità media tra i due punti
                    const avgOpacity = (p1.opacity + p2.opacity) / 2;
                    const color = getColor((p1.x + p2.x) / 2, (p1.y + p2.y) / 2);

                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);

                    ctx.strokeStyle = color;
                    ctx.lineWidth = 0.8 + avgOpacity * 0.4;
                    ctx.globalAlpha = avgOpacity;
                    ctx.stroke();
                }

                ctx.globalAlpha = 1;
            };

            // Raccogli punti per linee di latitudine
            for (let lat = -80; lat <= 80; lat += 160 / latitudeLines) {
                const points: { x: number; y: number; z: number; opacity: number }[] = [];

                for (let lon = 0; lon <= 360; lon += 3) {
                    points.push(project(lat, lon));
                }

                drawLineWithDepth(points);
            }

            // Raccogli punti per linee di longitudine
            for (let lon = 0; lon < 360; lon += 360 / longitudeLines) {
                const points: { x: number; y: number; z: number; opacity: number }[] = [];

                for (let lat = -90; lat <= 90; lat += 3) {
                    points.push(project(lat, lon));
                }

                drawLineWithDepth(points);
            }

            // Disegna equatore più spesso
            const equatorPoints: { x: number; y: number; z: number; opacity: number }[] = [];

            for (let lon = 0; lon <= 360; lon += 2) {
                equatorPoints.push(project(0, lon));
            }

            // Disegna equatore con linea più spessa
            for (let i = 0; i < equatorPoints.length - 1; i++) {
                const p1 = equatorPoints[i];
                const p2 = equatorPoints[i + 1];

                const avgOpacity = (p1.opacity + p2.opacity) / 2;
                const color = getColor((p1.x + p2.x) / 2, (p1.y + p2.y) / 2);

                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);

                ctx.strokeStyle = color;
                ctx.lineWidth = 1 + avgOpacity * 0.8;
                ctx.globalAlpha = avgOpacity * 1.2; // Equatore leggermente più visibile
                ctx.stroke();
            }

            ctx.globalAlpha = 1;

            rotation += rotationSpeed;
            animationRef.current = requestAnimationFrame(drawGlobe);
        };

        drawGlobe();

        return () => {
            window.removeEventListener("resize", setCanvasSize);
            cancelAnimationFrame(animationRef.current);
        };
    }, [containerRef]);

    return (
        <canvas
            ref={canvasRef}
            className={`w-full h-full ${className}`}
            style={{ display: "block" }}
        />
    );
}
