"use client";

import { useEffect, useRef, useCallback } from "react";

const vertexShaderSource = `
    attribute vec2 a_position;
    attribute vec2 a_texCoord;
    varying vec2 v_texCoord;

    void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
        v_texCoord = a_texCoord;
    }
`;

const fragmentShaderSource = `
    precision mediump float;

    uniform sampler2D u_image;
    uniform vec2 u_resolution;
    uniform vec2 u_mouse;
    uniform float u_time;
    uniform float u_points[300];
    uniform int u_pointCount;

    varying vec2 v_texCoord;

    float noise(vec2 p) {
        return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
    }

    float smoothNoise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);

        float a = noise(i);
        float b = noise(i + vec2(1.0, 0.0));
        float c = noise(i + vec2(0.0, 1.0));
        float d = noise(i + vec2(1.0, 1.0));

        return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
    }

    void main() {
        vec2 uv = v_texCoord;
        vec2 pixelCoord = uv * u_resolution;

        float totalDistortion = 0.0;
        vec2 distortionDir = vec2(0.0);
        float erosion = 0.0;

        float mouseDist = distance(pixelCoord, u_mouse);
        float mouseRadius = 60.0;
        if (mouseDist < mouseRadius) {
            float mouseStrength = 1.0 - (mouseDist / mouseRadius);
            mouseStrength = mouseStrength * mouseStrength * mouseStrength;
            totalDistortion += mouseStrength * 0.5;

            vec2 dir = normalize(pixelCoord - u_mouse);
            distortionDir += dir * mouseStrength * 30.0;
        }

        for (int i = 0; i < 100; i++) {
            if (i >= u_pointCount) break;

            float px = u_points[i * 3];
            float py = u_points[i * 3 + 1];
            float age = u_points[i * 3 + 2];

            vec2 pointPos = vec2(px, py);
            float dist = distance(pixelCoord, pointPos);

            float baseRadius = 40.0;
            float growFactor = min(age / 20.0, 1.0);
            float shrinkFactor = max(0.0, 1.0 - (age - 60.0) / 60.0);
            float radius = baseRadius * growFactor * shrinkFactor;

            if (dist < radius && radius > 0.0) {
                float strength = 1.0 - (dist / radius);
                strength = strength * strength;

                float ageIntensity = shrinkFactor * growFactor;
                strength *= ageIntensity;

                totalDistortion += strength * 0.4;
                erosion += strength * ageIntensity * 0.8;

                vec2 dir = pixelCoord - pointPos;
                float angle = age * 0.05;
                vec2 rotatedDir = vec2(
                    dir.x * cos(angle) - dir.y * sin(angle),
                    dir.x * sin(angle) + dir.y * cos(angle)
                );
                distortionDir += normalize(rotatedDir) * strength * 25.0;
            }
        }

        float noiseScale = 0.01;
        float noiseVal = smoothNoise(pixelCoord * noiseScale + u_time * 0.5);
        distortionDir += vec2(
            smoothNoise(pixelCoord * noiseScale + vec2(100.0, 0.0) + u_time * 0.3) - 0.5,
            smoothNoise(pixelCoord * noiseScale + vec2(0.0, 100.0) + u_time * 0.3) - 0.5
        ) * totalDistortion * 40.0;

        vec2 distortedUV = uv + distortionDir / u_resolution;

        vec4 color = texture2D(u_image, distortedUV);

        if (erosion > 0.0) {
            float r = texture2D(u_image, distortedUV + vec2(erosion * 0.003, 0.0)).r;
            float g = texture2D(u_image, distortedUV).g;
            float b = texture2D(u_image, distortedUV - vec2(erosion * 0.003, 0.0)).b;
            color.rgb = vec3(r, g, b);

            color.rgb *= 1.0 - erosion * 0.6;

            float grain = noise(pixelCoord + u_time * 100.0) * erosion * 0.3;
            color.rgb += grain - erosion * 0.15;

            color.rgb = mix(color.rgb, vec3(0.2, 0.0, 0.08), erosion * 0.4);
        }

        gl_FragColor = color;
    }
`;

interface Point {
    x: number;
    y: number;
    age: number;
}

export default function HauntedCursor() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const glRef = useRef<WebGLRenderingContext | null>(null);
    const programRef = useRef<WebGLProgram | null>(null);
    const textureRef = useRef<WebGLTexture | null>(null);
    const pointsRef = useRef<Point[]>([]);
    const mouseRef = useRef({ x: -1000, y: -1000 });
    const rafRef = useRef<number>(0);
    const lastPointRef = useRef({ x: 0, y: 0 });
    const startTimeRef = useRef(Date.now());
    const lastCaptureRef = useRef(0);

    const createShader = useCallback(
        (gl: WebGLRenderingContext, type: number, source: string) => {
            const shader = gl.createShader(type);
            if (!shader) return null;
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                console.error(gl.getShaderInfoLog(shader));
                gl.deleteShader(shader);
                return null;
            }
            return shader;
        },
        []
    );

    const createProgram = useCallback(
        (
            gl: WebGLRenderingContext,
            vertexShader: WebGLShader,
            fragmentShader: WebGLShader
        ) => {
            const program = gl.createProgram();
            if (!program) return null;
            gl.attachShader(program, vertexShader);
            gl.attachShader(program, fragmentShader);
            gl.linkProgram(program);
            if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
                console.error(gl.getProgramInfoLog(program));
                gl.deleteProgram(program);
                return null;
            }
            return program;
        },
        []
    );

    const captureScreen = useCallback(() => {
        const gl = glRef.current;
        if (!gl || !textureRef.current) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        const ctx = tempCanvas.getContext("2d");
        if (!ctx) return;

        ctx.fillStyle = "#FFF5F5";
        ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

        ctx.fillStyle = "#330014";
        ctx.font = "48px serif";

        gl.bindTexture(gl.TEXTURE_2D, textureRef.current);
        gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.RGBA,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            tempCanvas
        );
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const gl = canvas.getContext("webgl", {
            preserveDrawingBuffer: true,
            premultipliedAlpha: false,
        });
        if (!gl) {
            console.error("WebGL not supported");
            return;
        }
        glRef.current = gl;

        const vertexShader = createShader(
            gl,
            gl.VERTEX_SHADER,
            vertexShaderSource
        );
        const fragmentShader = createShader(
            gl,
            gl.FRAGMENT_SHADER,
            fragmentShaderSource
        );
        if (!vertexShader || !fragmentShader) return;

        const program = createProgram(gl, vertexShader, fragmentShader);
        if (!program) return;
        programRef.current = program;

        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
            gl.STATIC_DRAW
        );

        const texCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array([0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0]),
            gl.STATIC_DRAW
        );

        const texture = gl.createTexture();
        textureRef.current = texture;
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            gl.viewport(0, 0, canvas.width, canvas.height);
            captureScreen();
        };
        resize();
        window.addEventListener("resize", resize);

        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };

            const dx = e.clientX - lastPointRef.current.x;
            const dy = e.clientY - lastPointRef.current.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist > 8) {
                pointsRef.current.push({
                    x: e.clientX,
                    y: e.clientY,
                    age: 0,
                });
                lastPointRef.current = { x: e.clientX, y: e.clientY };

                if (pointsRef.current.length > 100) {
                    pointsRef.current.shift();
                }
            }
        };
        window.addEventListener("mousemove", handleMouseMove);

        const animate = () => {
            const now = Date.now();

            if (now - lastCaptureRef.current > 100) {
                captureScreen();
                lastCaptureRef.current = now;
            }

            gl.useProgram(program);

            const positionLocation = gl.getAttribLocation(
                program,
                "a_position"
            );
            const texCoordLocation = gl.getAttribLocation(
                program,
                "a_texCoord"
            );

            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
            gl.enableVertexAttribArray(positionLocation);
            gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

            gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
            gl.enableVertexAttribArray(texCoordLocation);
            gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);

            const resolutionLocation = gl.getUniformLocation(
                program,
                "u_resolution"
            );
            const mouseLocation = gl.getUniformLocation(program, "u_mouse");
            const timeLocation = gl.getUniformLocation(program, "u_time");
            const pointsLocation = gl.getUniformLocation(program, "u_points");
            const pointCountLocation = gl.getUniformLocation(
                program,
                "u_pointCount"
            );

            gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
            gl.uniform2f(
                mouseLocation,
                mouseRef.current.x,
                canvas.height - mouseRef.current.y
            );
            gl.uniform1f(timeLocation, (now - startTimeRef.current) / 1000);

            const pointsArray = new Float32Array(300);
            pointsRef.current = pointsRef.current.filter((point, i) => {
                point.age += 1;
                if (point.age > 120) return false;

                pointsArray[i * 3] = point.x;
                pointsArray[i * 3 + 1] = canvas.height - point.y;
                pointsArray[i * 3 + 2] = point.age;
                return true;
            });

            gl.uniform1fv(pointsLocation, pointsArray);
            gl.uniform1i(pointCountLocation, pointsRef.current.length);

            gl.drawArrays(gl.TRIANGLES, 0, 6);

            rafRef.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener("resize", resize);
            window.removeEventListener("mousemove", handleMouseMove);
            cancelAnimationFrame(rafRef.current);
        };
    }, [createShader, createProgram, captureScreen]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-99998"
            style={{
                mixBlendMode: "multiply",
                opacity: 0.9,
            }}
        />
    );
}
