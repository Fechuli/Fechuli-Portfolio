// Synth preset data structure for Juno-style synthesizer

export interface SynthParams {
    // Oscillator
    waveform: "sawtooth" | "square" | "triangle" | "sine";
    subOscLevel: number; // 0-100
    pwm: number; // 0-100 (pulse width modulation)
    detune: number; // -50 to +50 cents

    // Filter
    hpfCutoff: number; // 20-5000 Hz
    lpfCutoff: number; // 20-20000 Hz
    resonance: number; // 0-100 (maps to Q: 0.1-20)
    filterEnvAmount: number; // -100 to +100 (envelope modulation)

    // Envelope (ADSR)
    attack: number; // 0-2000ms
    decay: number; // 0-2000ms
    sustain: number; // 0-100%
    release: number; // 0-5000ms

    // LFO
    lfoRate: number; // 0.1-20 Hz
    lfoWaveform: "sine" | "square" | "triangle" | "sawtooth";
    lfoRouting: "pitch" | "filter" | "pwm" | "volume";
    lfoDepth: number; // 0-100

    // Effects
    chorusEnabled: boolean;
    chorusDepth: number; // 0-100
    chorusRate: number; // 0.1-5 Hz
    chorusMix: number; // 0-100

    delayEnabled: boolean;
    delayTime: number; // 10-2000ms
    delayFeedback: number; // 0-100
    delayMix: number; // 0-100

    reverbEnabled: boolean;
    reverbSize: number; // 0-100 (room size)
    reverbDamping: number; // 0-100
    reverbMix: number; // 0-100

    // Master
    glide: number; // 0-1000ms (portamento)
    masterVolume: number; // 0-100
}

export interface SynthPreset {
    id: string;
    name: string;
    description: string;
    category: "bass" | "lead" | "pad" | "fx";
    lowvibesTrack?: string;
    params: SynthParams;
}

// Default preset - clean init sound
export const DEFAULT_PRESET: SynthParams = {
    waveform: "sawtooth",
    subOscLevel: 0,
    pwm: 50,
    detune: 0,
    hpfCutoff: 20,
    lpfCutoff: 5000,
    resonance: 10,
    filterEnvAmount: 0,
    attack: 5,
    decay: 100,
    sustain: 80,
    release: 300,
    lfoRate: 5,
    lfoWaveform: "sine",
    lfoRouting: "filter",
    lfoDepth: 0,
    chorusEnabled: false,
    chorusDepth: 50,
    chorusRate: 0.5,
    chorusMix: 50,
    delayEnabled: false,
    delayTime: 250,
    delayFeedback: 30,
    delayMix: 25,
    reverbEnabled: false,
    reverbSize: 50,
    reverbDamping: 50,
    reverbMix: 30,
    glide: 0,
    masterVolume: 75,
};

// Lowvibes-inspired presets
export const JUNO_PRESETS: SynthPreset[] = [
    {
        id: "lowvibes_bass",
        name: "Lowvibes Deep Bass",
        description: "Warm sub-bass with chorus, signature sound from Japan Nostalgia",
        category: "bass",
        lowvibesTrack: "Japan Nostalgia",
        params: {
            waveform: "sawtooth",
            subOscLevel: 80,
            pwm: 0,
            detune: 0,
            hpfCutoff: 30,
            lpfCutoff: 350,
            resonance: 25,
            filterEnvAmount: 10,
            attack: 10,
            decay: 200,
            sustain: 90,
            release: 400,
            lfoRate: 0.3,
            lfoWaveform: "sine",
            lfoRouting: "filter",
            lfoDepth: 15,
            chorusEnabled: true,
            chorusDepth: 40,
            chorusRate: 0.5,
            chorusMix: 35,
            delayEnabled: false,
            delayTime: 250,
            delayFeedback: 0,
            delayMix: 0,
            reverbEnabled: true,
            reverbSize: 30,
            reverbDamping: 70,
            reverbMix: 15,
            glide: 50,
            masterVolume: 75,
        },
    },
    {
        id: "retro_lead",
        name: "Retro Lead Synth",
        description: "Classic Juno lead sound with PWM shimmer and chorus",
        category: "lead",
        lowvibesTrack: "Fa buio prima",
        params: {
            waveform: "square",
            subOscLevel: 20,
            pwm: 65,
            detune: -5,
            hpfCutoff: 100,
            lpfCutoff: 2800,
            resonance: 45,
            filterEnvAmount: 40,
            attack: 30,
            decay: 300,
            sustain: 60,
            release: 500,
            lfoRate: 4.5,
            lfoWaveform: "triangle",
            lfoRouting: "pwm",
            lfoDepth: 35,
            chorusEnabled: true,
            chorusDepth: 60,
            chorusRate: 2.0,
            chorusMix: 50,
            delayEnabled: false,
            delayTime: 250,
            delayFeedback: 0,
            delayMix: 0,
            reverbEnabled: true,
            reverbSize: 45,
            reverbDamping: 60,
            reverbMix: 25,
            glide: 0,
            masterVolume: 70,
        },
    },
    {
        id: "lush_pad",
        name: "Lush Ambient Pad",
        description: "Slow attack pad with chorus and reverb for atmospheric textures",
        category: "pad",
        params: {
            waveform: "sawtooth",
            subOscLevel: 40,
            pwm: 50,
            detune: 8,
            hpfCutoff: 80,
            lpfCutoff: 1200,
            resonance: 20,
            filterEnvAmount: -30,
            attack: 800,
            decay: 500,
            sustain: 85,
            release: 1200,
            lfoRate: 0.8,
            lfoWaveform: "sine",
            lfoRouting: "filter",
            lfoDepth: 25,
            chorusEnabled: true,
            chorusDepth: 70,
            chorusRate: 0.4,
            chorusMix: 60,
            delayEnabled: false,
            delayTime: 500,
            delayFeedback: 0,
            delayMix: 0,
            reverbEnabled: true,
            reverbSize: 80,
            reverbDamping: 40,
            reverbMix: 50,
            glide: 200,
            masterVolume: 65,
        },
    },
    {
        id: "plucky_arp",
        name: "Plucky Arpeggio",
        description: "Short, bright sound perfect for fast arpeggios and sequences",
        category: "lead",
        params: {
            waveform: "triangle",
            subOscLevel: 0,
            pwm: 50,
            detune: 0,
            hpfCutoff: 200,
            lpfCutoff: 4500,
            resonance: 35,
            filterEnvAmount: 60,
            attack: 5,
            decay: 150,
            sustain: 20,
            release: 180,
            lfoRate: 8,
            lfoWaveform: "square",
            lfoRouting: "filter",
            lfoDepth: 20,
            chorusEnabled: false,
            chorusDepth: 0,
            chorusRate: 0,
            chorusMix: 0,
            delayEnabled: true,
            delayTime: 125,
            delayFeedback: 40,
            delayMix: 30,
            reverbEnabled: true,
            reverbSize: 40,
            reverbDamping: 70,
            reverbMix: 20,
            glide: 0,
            masterVolume: 75,
        },
    },
    {
        id: "vintage_strings",
        name: "Vintage Strings",
        description: "Warm string ensemble with slow attack and rich chorus",
        category: "pad",
        params: {
            waveform: "sawtooth",
            subOscLevel: 30,
            pwm: 50,
            detune: 12,
            hpfCutoff: 120,
            lpfCutoff: 2200,
            resonance: 15,
            filterEnvAmount: 20,
            attack: 400,
            decay: 350,
            sustain: 95,
            release: 800,
            lfoRate: 1.2,
            lfoWaveform: "sine",
            lfoRouting: "pitch",
            lfoDepth: 10,
            chorusEnabled: true,
            chorusDepth: 80,
            chorusRate: 0.6,
            chorusMix: 70,
            delayEnabled: false,
            delayTime: 250,
            delayFeedback: 0,
            delayMix: 0,
            reverbEnabled: true,
            reverbSize: 65,
            reverbDamping: 50,
            reverbMix: 40,
            glide: 100,
            masterVolume: 70,
        },
    },
    {
        id: "fx_sweep",
        name: "FX Resonance Sweep",
        description: "High resonance with LFO modulation for sound effects and transitions",
        category: "fx",
        params: {
            waveform: "sine",
            subOscLevel: 60,
            pwm: 50,
            detune: 0,
            hpfCutoff: 50,
            lpfCutoff: 800,
            resonance: 85,
            filterEnvAmount: 50,
            attack: 200,
            decay: 600,
            sustain: 70,
            release: 1000,
            lfoRate: 0.5,
            lfoWaveform: "triangle",
            lfoRouting: "filter",
            lfoDepth: 80,
            chorusEnabled: false,
            chorusDepth: 0,
            chorusRate: 0,
            chorusMix: 0,
            delayEnabled: true,
            delayTime: 750,
            delayFeedback: 55,
            delayMix: 45,
            reverbEnabled: true,
            reverbSize: 90,
            reverbDamping: 30,
            reverbMix: 60,
            glide: 500,
            masterVolume: 70,
        },
    },
    {
        id: "funky_bass",
        name: "Funky Bass",
        description: "Punchy bass with resonance and quick envelope for rhythmic playing",
        category: "bass",
        params: {
            waveform: "square",
            subOscLevel: 70,
            pwm: 45,
            detune: 0,
            hpfCutoff: 40,
            lpfCutoff: 600,
            resonance: 60,
            filterEnvAmount: 70,
            attack: 5,
            decay: 180,
            sustain: 40,
            release: 250,
            lfoRate: 0,
            lfoWaveform: "sine",
            lfoRouting: "filter",
            lfoDepth: 0,
            chorusEnabled: false,
            chorusDepth: 0,
            chorusRate: 0,
            chorusMix: 0,
            delayEnabled: false,
            delayTime: 250,
            delayFeedback: 0,
            delayMix: 0,
            reverbEnabled: false,
            reverbSize: 20,
            reverbDamping: 80,
            reverbMix: 10,
            glide: 0,
            masterVolume: 80,
        },
    },
    {
        id: "space_lead",
        name: "Space Lead",
        description: "Ethereal lead with delay and reverb for dreamy melodies",
        category: "lead",
        lowvibesTrack: "Echoes",
        params: {
            waveform: "sine",
            subOscLevel: 15,
            pwm: 50,
            detune: 7,
            hpfCutoff: 150,
            lpfCutoff: 3500,
            resonance: 30,
            filterEnvAmount: 35,
            attack: 100,
            decay: 250,
            sustain: 75,
            release: 600,
            lfoRate: 6.0,
            lfoWaveform: "sine",
            lfoRouting: "pitch",
            lfoDepth: 15,
            chorusEnabled: true,
            chorusDepth: 50,
            chorusRate: 1.5,
            chorusMix: 40,
            delayEnabled: true,
            delayTime: 375,
            delayFeedback: 50,
            delayMix: 40,
            reverbEnabled: true,
            reverbSize: 75,
            reverbDamping: 45,
            reverbMix: 55,
            glide: 150,
            masterVolume: 70,
        },
    },
];

export const PRESET_CATEGORIES = ["all", "bass", "lead", "pad", "fx"] as const;
