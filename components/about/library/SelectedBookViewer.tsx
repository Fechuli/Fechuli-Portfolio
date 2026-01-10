"use client";

import { Suspense, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useTexture, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import type { Book as BookType } from "@/data/books";

interface SelectedBookViewerProps {
    book: BookType;
}

function SelectedBook({ book }: { book: BookType }) {
    const meshRef = useRef<THREE.Mesh>(null);

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
            ctx.lineWidth = 1;
            for (let i = 0; i < 128; i += 2) {
                const offset = Math.sin(i * 0.7) * 0.3;
                ctx.beginPath();
                ctx.moveTo(i + offset, 0);
                ctx.lineTo(i + offset, 256);
                ctx.stroke();
            }

            ctx.strokeStyle = "#d5d0c0";
            ctx.lineWidth = 0.3;
            for (let i = 0; i < 256; i += 7) {
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
            spineMaterial,  // +X - spine (costa)
            backMaterial,   // -X - back (retro, opposto a spine)
            pagesMaterial,  // +Y - sopra
            pagesMaterial,  // -Y - sotto
            frontMaterial,  // +Z - front (copertina fronte)
            pagesMaterial,  // -Z - bordo pagine
        ];
    }, [book.pagesColor, frontTexture, backTexture, spineTexture]);

    useFrame((state) => {
        if (!meshRef.current) return;
        meshRef.current.rotation.y =
            Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
    });

    const scale = 2.5;
    const thickness = book.thickness * 0.1 * scale;
    const height = book.height * scale;
    const width = book.width * scale;

    return (
        <mesh ref={meshRef} material={materials} rotation={[0, -0.6, 0]}>
            <boxGeometry args={[thickness, height, width]} />
        </mesh>
    );
}

function LoadingFallback() {
    return (
        <mesh>
            <boxGeometry args={[0.2, 1.5, 1]} />
            <meshStandardMaterial color="#330014" wireframe />
        </mesh>
    );
}

export default function SelectedBookViewer({ book }: SelectedBookViewerProps) {
    return (
        <div className="w-full h-full min-h-[350px]">
            <Canvas
                camera={{
                    position: [2, 0.5, 3.5],
                    fov: 45,
                    near: 0.1,
                    far: 100,
                }}
                dpr={[1, 2]}
                gl={{
                    antialias: true,
                    powerPreference: "high-performance",
                    alpha: true,
                }}
                style={{ background: "transparent" }}
            >
                <ambientLight intensity={1} color="#FFF5F5" />
                <directionalLight
                    position={[2, 3, 2]}
                    intensity={1}
                    color="#FFE4D6"
                />
                <directionalLight
                    position={[-3, -1, 3]}
                    intensity={1}
                    color="#D6E4FF"
                />
                <directionalLight
                    position={[0, 2, -4]}
                    intensity={1}
                    color="#FFF5F5"
                />

                <Suspense fallback={<LoadingFallback />}>
                    <SelectedBook book={book} />
                </Suspense>

                {/* Grid under the book */}
                <gridHelper
                    args={[8, 20, "#FFF5F5", "#FFF5F5"]}
                    position={[0, -2, 0]}
                    material-opacity={0.15}
                    material-transparent={true}
                />

                <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    minPolarAngle={Math.PI / 4}
                    maxPolarAngle={(Math.PI * 3) / 4}
                    rotateSpeed={0.5}
                    dampingFactor={0.1}
                    enableDamping
                />
            </Canvas>
        </div>
    );
}
