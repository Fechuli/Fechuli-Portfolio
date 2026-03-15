"use client";

import { useRef, useEffect, useState, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { applyPS1ToScene } from "./ps1-material";
import { TIMELINE_ARTIFACTS } from "@/data/timeline-artifacts";

TIMELINE_ARTIFACTS.forEach((a) => useGLTF.preload(a.modelPath));

interface PS1ModelProps {
    modelPath: string;
    jitterLevel: number;
    floatSpeed: number;
    floatAmplitude: number;
    scale: number;
    initialRotation: [number, number, number];
}

function PS1Model({
    modelPath,
    jitterLevel,
    floatSpeed,
    floatAmplitude,
    scale,
    initialRotation,
}: PS1ModelProps) {
    const groupRef = useRef<THREE.Group>(null);
    const { scene } = useGLTF(modelPath);
    const [hovered, setHovered] = useState(false);

    const { clonedScene, centerOffset, fitScale } = useMemo(() => {
        const clone = scene.clone(true);

        clone.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                if (Array.isArray(child.material)) {
                    child.material = child.material.map((m: THREE.Material) =>
                        m.clone()
                    );
                } else {
                    child.material = child.material.clone();
                }
            }
        });

        applyPS1ToScene(clone, jitterLevel);

        clone.updateWorldMatrix(true, true);

        const box = new THREE.Box3().setFromObject(clone);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);

        return {
            clonedScene: clone,
            centerOffset: [-center.x, -center.y, -center.z] as [
                number,
                number,
                number,
            ],
            fitScale: maxDim > 0 ? 2.0 / maxDim : 1,
        };
    }, [scene, jitterLevel]);

    useFrame((state) => {
        if (!groupRef.current) return;

        const t = state.clock.elapsedTime;

        groupRef.current.position.y = Math.sin(t * floatSpeed) * floatAmplitude;
        groupRef.current.position.x =
            Math.sin(t * floatSpeed * 0.7 + 1.5) * (floatAmplitude * 0.3);

        const targetScale = hovered ? scale * 1.1 : scale;
        groupRef.current.scale.lerp(
            new THREE.Vector3(targetScale, targetScale, targetScale),
            0.08
        );
    });

    const rotationRad = useMemo(
        () =>
            initialRotation.map((d) => (d * Math.PI) / 180) as [
                number,
                number,
                number,
            ],
        [initialRotation]
    );

    return (
        <group
            ref={groupRef}
            scale={scale}
            rotation={rotationRad}
            onPointerEnter={() => setHovered(true)}
            onPointerLeave={() => setHovered(false)}
        >
            <group scale={fitScale}>
                <group position={centerOffset}>
                    <primitive object={clonedScene} />
                </group>
            </group>
        </group>
    );
}

export interface TimelineModelProps {
    modelPath: string;
    jitterLevel?: number;
    floatSpeed?: number;
    floatAmplitude?: number;
    scale?: number;
    initialRotation?: [number, number, number];
    className?: string;
}

export default function TimelineModel({
    modelPath,
    jitterLevel = 80,
    floatSpeed = 0.8,
    floatAmplitude = 0.08,
    scale = 1,
    initialRotation = [0, 0, 0],
    className = "",
}: TimelineModelProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { rootMargin: "600px 0px" }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <div ref={containerRef} className={`relative w-full h-full cursor-grab active:cursor-grabbing ${className}`}>
            {/* SVG duotone filter: grayscale → map shadows to #330014, highlights to #FFF5F5 */}
            <svg className="absolute w-0 h-0" aria-hidden="true">
                <defs>
                    <filter id={`duotone-${modelPath.replace(/[^a-z0-9]/gi, "")}`} colorInterpolationFilters="sRGB">
                        {/* Single matrix: luma → duotone #330014 (shadow) to #FFF5F5 (highlight) */}
                        <feColorMatrix type="matrix" values="
                            0.2392 0.4696 0.0912 0 0.2
                            0.2870 0.5635 0.1094 0 0
                            0.2637 0.5177 0.1006 0 0.078
                            0      0      0      1 0
                        " />
                    </filter>
                </defs>
            </svg>

            {isVisible && (
                <Canvas
                    camera={{
                        position: [0, 0, 4.5],
                        fov: 50,
                        near: 0.1,
                        far: 50,
                    }}
                    dpr={[1, 1.5]}
                    gl={{
                        antialias: false,
                        alpha: true,
                        powerPreference: "high-performance",
                    }}
                    style={{
                        background: "transparent",
                        filter: `url(#duotone-${modelPath.replace(/[^a-z0-9]/gi, "")})`,
                    }}
                >
                    <ambientLight intensity={1.4} color="#FFF5F5" />
                    <directionalLight
                        position={[3, 4, 5]}
                        intensity={1.6}
                        color="#FFF5F5"
                    />
                    <directionalLight
                        position={[-3, 2, 3]}
                        intensity={0.8}
                        color="#FFE4D6"
                    />

                    <OrbitControls
                        enableZoom={false}
                        enablePan={false}
                        enableDamping
                        dampingFactor={0.12}
                        rotateSpeed={0.6}
                    />

                    <Suspense fallback={null}>
                        <PS1Model
                            modelPath={modelPath}
                            jitterLevel={jitterLevel}
                            floatSpeed={floatSpeed}
                            floatAmplitude={floatAmplitude}
                            scale={scale}
                            initialRotation={initialRotation}
                        />
                    </Suspense>
                </Canvas>
            )}
        </div>
    );
}
