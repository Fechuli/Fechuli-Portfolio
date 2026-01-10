"use client";

import { useRef, useState, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import type { Book as BookType } from "@/data/books";

interface BookProps {
    book: BookType;
    position: [number, number, number];
    onClick?: () => void;
    isSelected?: boolean;
}

export default function Book({ book, position, onClick, isSelected }: BookProps) {
    const meshRef = useRef<THREE.Mesh>(null);
    const [hoveredRaw, setHoveredRaw] = useState(false);

    // Reset hover state when book gets selected (since mesh unmounts and onPointerLeave won't fire)
    useEffect(() => {
        if (isSelected) {
            setHoveredRaw(false);
            document.body.style.cursor = "auto";
        }
    }, [isSelected]);

    // Hover is only active when not selected
    const hovered = hoveredRaw && !isSelected;

    const [frontTexture, backTexture, spineTexture] = useTexture([
        book.textures.front,
        book.textures.back,
        book.textures.spine,
    ]);

    useMemo(() => {
        [frontTexture, backTexture, spineTexture].forEach((tex) => {
            tex.colorSpace = THREE.SRGBColorSpace;
        });
    }, [frontTexture, backTexture, spineTexture]);

    const materials = useMemo(() => {
        const pagesCanvas = document.createElement("canvas");
        pagesCanvas.width = 128;
        pagesCanvas.height = 256;
        const ctx = pagesCanvas.getContext("2d");
        if (ctx) {
            ctx.fillStyle = book.pagesColor;
            ctx.fillRect(0, 0, 128, 256);

            ctx.strokeStyle = "#e8e4d4";
            ctx.lineWidth = 0.5;
            for (let i = 0; i < 128; i += 2) {
                const offset = Math.sin(i * 0.7) * 0.3;
                ctx.beginPath();
                ctx.moveTo(i + offset, 0);
                ctx.lineTo(i + offset, 256);
                ctx.stroke();
            }

            ctx.strokeStyle = "#d5d0c0";
            ctx.lineWidth = 0.3;
            for (let i = 0; i < 128; i += 7) {
                ctx.beginPath();
                ctx.moveTo(i, 0);
                ctx.lineTo(i, 256);
                ctx.stroke();
            }
        }
        const pagesTexture = new THREE.CanvasTexture(pagesCanvas);
        pagesTexture.wrapS = THREE.RepeatWrapping;
        pagesTexture.wrapT = THREE.RepeatWrapping;

        const pagesMaterial = new THREE.MeshStandardMaterial({
            map: pagesTexture,
            color: book.pagesColor,
            roughness: 0.95,
            metalness: 0,
        });

        const frontMaterial = new THREE.MeshStandardMaterial({
            map: frontTexture,
            roughness: 0.6,
            metalness: 0,
        });

        const backMaterial = new THREE.MeshStandardMaterial({
            map: backTexture,
            roughness: 0.6,
            metalness: 0,
        });

        const spineMaterial = new THREE.MeshStandardMaterial({
            map: spineTexture,
            roughness: 0.6,
            metalness: 0,
        });

        return [
            spineMaterial,  // +X - spine (costa, verso utente)
            backMaterial,   // -X - back (retro, opposto a spine)
            pagesMaterial,  // +Y - sopra
            pagesMaterial,  // -Y - sotto
            frontMaterial,  // +Z - front (copertina fronte)
            pagesMaterial,  // -Z - bordo pagine
        ];
    }, [book.pagesColor, frontTexture, backTexture, spineTexture]);

    const thickness = book.thickness * 0.1;
    const height = book.height;
    const width = book.width;

    const shelfSurface = -0.55 + 0.02;
    const bookCenterY = shelfSurface + height / 2;

    useFrame(() => {
        if (!meshRef.current || isSelected) return;

        const targetZ = hovered ? position[2] + 0.15 : position[2];
        const targetScale = hovered ? 1.03 : 1;

        meshRef.current.position.z = THREE.MathUtils.lerp(
            meshRef.current.position.z,
            targetZ,
            0.1
        );

        meshRef.current.position.y = THREE.MathUtils.lerp(
            meshRef.current.position.y,
            bookCenterY,
            0.1
        );

        meshRef.current.scale.x = THREE.MathUtils.lerp(
            meshRef.current.scale.x,
            targetScale,
            0.1
        );
        meshRef.current.scale.y = THREE.MathUtils.lerp(
            meshRef.current.scale.y,
            targetScale,
            0.1
        );
        meshRef.current.scale.z = THREE.MathUtils.lerp(
            meshRef.current.scale.z,
            targetScale,
            0.1
        );
    });

    if (isSelected) return null;

    return (
        <mesh
            ref={meshRef}
            position={position}
            onClick={(e) => {
                e.stopPropagation();
                onClick?.();
            }}
            onPointerEnter={(e) => {
                e.stopPropagation();
                setHoveredRaw(true);
                document.body.style.cursor = "pointer";
            }}
            onPointerLeave={() => {
                setHoveredRaw(false);
                document.body.style.cursor = "auto";
            }}
            material={materials}
        >
            <boxGeometry args={[thickness, height, width]} />
        </mesh>
    );
}
