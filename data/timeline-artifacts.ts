export interface TimelineArtifact {
    milestoneIndex: number;
    modelPath: string;
    position: {
        top: string;
        left?: string;
        right?: string;
    };
    rotation: [number, number, number];
    floatSpeed: number;
    floatAmplitude: number;
    scale: number;
    jitterLevel: number;
    width: number;
    height: number;
}

export const TIMELINE_ARTIFACTS: TimelineArtifact[] = [
    // 0 — 2017 → synth, right side (flipped 180° on X — top was bottom)
    {
        milestoneIndex: 0,
        modelPath: "/models/about/synth.glb",
        position: { top: "-15%", right: "-10%" },
        rotation: [190, 155, 5],
        floatSpeed: 0.7,
        floatAmplitude: 0.08,
        scale: 2.0,
        jitterLevel: 70,
        width: 650,
        height: 400,
    },
    // 1 — 2018 → boombox, left side
    {
        milestoneIndex: 1,
        modelPath: "/models/about/boombox.glb",
        position: { top: "-20%", left: "-8%" },
        rotation: [-5, 30, -3],
        floatSpeed: 0.6,
        floatAmplitude: 0.07,
        scale: 2,
        jitterLevel: 65,
        width: 700,
        height: 420,
    },
    // 2 — 2020 → vinyl player, right
    {
        milestoneIndex: 2,
        modelPath: "/models/about/vinyl_player.glb",
        position: { top: "-15%", right: "-5%" },
        rotation: [85, -112, 0],
        floatSpeed: 0.9,
        floatAmplitude: 0.1,
        scale: 1.5,
        jitterLevel: 80,
        width: 650,
        height: 380,
    },
    // 3 — 2021 → drum machine, left
    {
        milestoneIndex: 3,
        modelPath: "/models/about/drum_machine.glb",
        position: { top: "-18%", left: "-6%" },
        rotation: [77, 185, -5],
        floatSpeed: 0.8,
        floatAmplitude: 0.09,
        scale: 1.6,
        jitterLevel: 75,
        width: 680,
        height: 400,
    },
    // 4 — 2022 → DJ gear, right
    {
        milestoneIndex: 4,
        modelPath: "/models/about/dj_gear.glb",
        position: { top: "-35%", right: "-12%" },
        rotation: [55, 80, 3],
        floatSpeed: 0.65,
        floatAmplitude: 0.08,
        scale: 2,
        jitterLevel: 60,
        width: 750,
        height: 440,
    },
    // 5 — 2023 → midi controller, left
    {
        milestoneIndex: 5,
        modelPath: "/models/about/midi_controller.glb",
        position: { top: "-12%", left: "-4%" },
        rotation: [66, 6, -8],
        floatSpeed: 1.0,
        floatAmplitude: 0.1,
        scale: 2,
        jitterLevel: 85,
        width: 650,
        height: 380,
    },
    // 6 — 2024 → guitar amp, right
    {
        milestoneIndex: 6,
        modelPath: "/models/about/guitar_amp.glb",
        position: { top: "-10%", right: "-8%" },
        rotation: [5, -20, 6],
        floatSpeed: 0.75,
        floatAmplitude: 0.08,
        scale: 1.3,
        jitterLevel: 70,
        width: 700,
        height: 420,
    },
];
