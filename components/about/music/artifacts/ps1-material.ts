import * as THREE from "three";

export function applyPS1Shader(
    material: THREE.Material,
    jitterLevel: number
) {
    material.onBeforeCompile = (shader) => {
        shader.vertexShader = shader.vertexShader.replace(
            "#include <project_vertex>",
            `
            vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.0);
            gl_Position = projectionMatrix * mvPosition;
            gl_Position.xy /= gl_Position.w;
            gl_Position.xy = floor(gl_Position.xy * ${jitterLevel.toFixed(1)}) / ${jitterLevel.toFixed(1)};
            gl_Position.xy *= gl_Position.w;
            `
        );

    };

    if ("map" in material && (material as Record<string, unknown>).map) {
        const map = (material as Record<string, unknown>).map as THREE.Texture;
        map.magFilter = THREE.NearestFilter;
        map.minFilter = THREE.NearestFilter;
    }
}

export function applyPS1ToScene(scene: THREE.Group, jitterLevel: number) {
    scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
            const materials = Array.isArray(child.material)
                ? child.material
                : [child.material];

            materials.forEach((mat: THREE.Material) => {
                applyPS1Shader(mat, jitterLevel);
                mat.needsUpdate = true;
            });
        }
    });
}
