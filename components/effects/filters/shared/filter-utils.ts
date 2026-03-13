// Utility functions for filters

export function getDeviceCapability() {
    if (typeof window === 'undefined') {
        return {
            isMobile: false,
            isLowEnd: false,
            supportsWebGL: false
        };
    }

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ||
                     window.innerWidth < 768;

    const lowEnd = isMobile ||
                   (navigator.hardwareConcurrency ? navigator.hardwareConcurrency < 4 : false);

    const canvas = document.createElement('canvas');
    const supportsWebGL = !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));

    return {
        isMobile,
        isLowEnd: lowEnd,
        supportsWebGL
    };
}

export function detectMobile(): boolean {
    if (typeof window === 'undefined') return false;
    return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ||
           window.innerWidth < 768;
}

// WebGL shader utilities
export function createShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
    const shader = gl.createShader(type);
    if (!shader) return null;

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compile error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}

export function createProgram(
    gl: WebGLRenderingContext,
    vertexShader: WebGLShader,
    fragmentShader: WebGLShader
): WebGLProgram | null {
    const program = gl.createProgram();
    if (!program) return null;

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Program link error:', gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
        return null;
    }

    return program;
}

// Performance monitoring
export class PerformanceMonitor {
    private frameCount = 0;
    private lastTime = performance.now();
    private fps = 60;
    private callback?: (fps: number) => void;

    constructor(callback?: (fps: number) => void) {
        this.callback = callback;
    }

    update() {
        this.frameCount++;
        const now = performance.now();

        if (now - this.lastTime > 1000) {
            this.fps = this.frameCount;
            this.frameCount = 0;
            this.lastTime = now;

            if (this.callback) {
                this.callback(this.fps);
            }

            if (this.fps < 30) {
                console.warn(`Low FPS detected: ${this.fps}`);
            }
        }
    }

    getFPS(): number {
        return this.fps;
    }
}
