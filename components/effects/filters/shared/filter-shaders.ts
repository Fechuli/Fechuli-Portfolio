// WebGL Shader Library for Filters

// Vertex shader (shared by all WebGL filters)
export const vertexShaderSource = `
    attribute vec2 a_position;
    attribute vec2 a_texCoord;
    varying vec2 v_texCoord;

    void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
        v_texCoord = a_texCoord;
    }
`;

// Chromatic Aberration Fragment Shader
export const chromaticFragmentShader = `
    precision mediump float;

    uniform sampler2D u_image;
    uniform vec2 u_resolution;
    varying vec2 v_texCoord;

    void main() {
        vec2 uv = v_texCoord;
        vec2 center = vec2(0.5);

        // Distance from center
        float dist = distance(uv, center);
        vec2 dir = normalize(uv - center);

        // Stronger offset at edges
        float offset = dist * 0.01;

        // Sample RGB channels separately
        float r = texture2D(u_image, uv + dir * offset).r;
        float g = texture2D(u_image, uv).g;
        float b = texture2D(u_image, uv - dir * offset).b;

        gl_FragColor = vec4(r, g, b, 1.0);
    }
`;

// Liquify Fragment Shader
export const liquifyFragmentShader = `
    precision mediump float;

    uniform sampler2D u_image;
    uniform vec2 u_resolution;
    uniform float u_time;
    varying vec2 v_texCoord;

    // Noise functions
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

        // Multi-layer noise for organic movement
        float noise1 = smoothNoise(uv * 3.0 + u_time * 0.1);
        float noise2 = smoothNoise(uv * 7.0 - u_time * 0.15);
        float noise3 = smoothNoise(uv * 5.0 + u_time * 0.08);

        // Combine noise layers for complex displacement
        vec2 offset = vec2(
            noise1 * 0.015 + noise3 * 0.008,
            noise2 * 0.015 - noise3 * 0.008
        );

        // Add subtle wave motion
        float wave = sin(uv.y * 10.0 + u_time * 0.5) * 0.003;
        offset.x += wave;

        // Sample with displacement
        vec2 distorted = uv + offset;
        gl_FragColor = texture2D(u_image, distorted);
    }
`;
