/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { VOCABOLARIO } from "@/data/vocabolario";

type Section = "home" | "ascii" | "changelog" | "vocabolario";

const ASCII_ART = `
███████╗███████╗ ██████╗██╗  ██╗██╗   ██╗██╗     ██╗
██╔════╝██╔════╝██╔════╝██║  ██║██║   ██║██║     ██║
█████╗  █████╗  ██║     ███████║██║   ██║██║     ██║
██╔══╝  ██╔══╝  ██║     ██╔══██║██║   ██║██║     ██║
██║     ███████╗╚██████╗██║  ██║╚██████╔╝███████╗██║
╚═╝     ╚══════╝ ╚═════╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚═╝
`;

const ASCII_GALLERY = [
    {
        title: "Backdoor",
        art: `
8 888888888o          .8.           ,o888888o.    8 8888     ,88' 8 888888888o.          ,o888888o.         ,o888888o.     8 888888888o.
8 8888    \`88.       .888.         8888     \`88.  8 8888    ,88'  8 8888    \`^888.    . 8888     \`88.    . 8888     \`88.   8 8888    \`88.
8 8888     \`88      :88888.     ,8 8888       \`8. 8 8888   ,88'   8 8888        \`88. ,8 8888       \`8b  ,8 8888       \`8b  8 8888     \`88
8 8888     ,88     . \`88888.    88 8888           8 8888  ,88'    8 8888         \`88 88 8888        \`8b 88 8888        \`8b 8 8888     ,88
8 8888.   ,88'    .8. \`88888.   88 8888           8 8888 ,88'     8 8888          88 88 8888         88 88 8888         88 8 8888.   ,88'
8 8888888888     .8\`8. \`88888.  88 8888           8 8888 88'      8 8888          88 88 8888         88 88 8888         88 8 888888888P'
8 8888    \`88.  .8' \`8. \`88888. 88 8888           8 888888<       8 8888         ,88 88 8888        ,8P 88 8888        ,8P 8 8888\`8b
8 8888      88 .8'   \`8. \`88888.\`8 8888       .8' 8 8888 \`Y8.     8 8888        ,88' \`8 8888       ,8P  \`8 8888       ,8P  8 8888 \`8b.
8 8888    ,88'.888888888. \`88888.  8888     ,88'  8 8888   \`Y8.   8 8888    ,o88P'    \` 8888     ,88'    \` 8888     ,88'   8 8888   \`8b.
8 888888888P .8'       \`8. \`88888.  \`8888888P'    8 8888     \`Y8. 8 888888888P'          \`8888888P'         \`8888888P'     8 8888     \`88.
        `,
    },
    {
        title: "D&D",
        art: `
                                             ,--,  ,.-.
               ,                   \\,       '-,-\`,'-.' | ._
              /|           \\    ,   |\\         }  )/  / \`-,',
              [ ,          |\\  /|   | |        /  \\|  |/\`  ,\`
              | |       ,.\`  \`,\` \`, | |  _,...(   (      .',
              \\  \\  __ ,-\` \`  ,  , \`/ |,'      Y     (   /_L\\
               \\  \\_\\,\`\`,   \` , ,  /  |         )         _,/
                \\  '  \`  ,_ _\`_,-,<._.<        /         /
                 ', \`>.,\`  \`  \`   ,., |_      |         /
                   \\/\`  \`,   \`   ,\`  | /__,.-\`    _,   \`\\
               -,-..\\\  _  \\  \`  /  ,  / \`._) _,-\\\`       \\
                \\_,,.) /\\    \` /  / ) (-,, \`\`    ,        |
               ,\` )  | \\_\\       '-\`  |  \`(               \\
              /  /\`\`\`(   , --, ,' \\   |\`<\`    ,            |
             /  /_,--\`\\   <\\  V /> ,\` )<_/)  | \\      _____)
       ,-, ,\`   \`   (_,\\ \\    |   /) / __/  /   \`----\`
      (-, \\           ) \\ ('_.-._)/ /,\`    /
      | /  \`          \`/ \\\\ V   V, /\`     /
   ,--\\(        ,     <_/\`\\\\     ||      /
  (   ,\`\`-     \\/|         \\-A.A-\`|     /
 ,>,_ )_,..(    )\\          -,,_-\`  _--\`
(_ \\|\`   _,/_  /  \\_            ,--\`
 \\( \`   <.,../\`     \`-.._   _,-\`
        `,
    },
    {
        title: "PC",
        art: `
      _______
     | ___  o|
     |[_-_]_ |
      ______________     |[_____]|
     |.------------.|    |[_____]|
     ||            ||    |[====o]|
     ||            ||    |[_.--_]|
     ||            ||    |[_____]|
     ||            ||    |      :|
     ||____________||    |      :|
 .==.|""  ......    |.==.|      :|
 |::| '-.________.-' |::||      :|
 |''|  (__________)-.|''||______:|
 \`""\`_.............._\\"\`______
    /:::::::::::'':::\\;\`'-.-.  \`\\
   /::=========.:.-::"\\  \\ \\--\\   \\
   \\\`"""""""""""""""\`/  \\ \\__)   \\
    \`"""""""""""""""\`    '========'
        `,
    },
    {
        title: "Seek...seek...",
        art: `
⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣤⣤⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠻⣿⣿⣿⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⣯⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢹⣿⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⣿⣇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢻⢺⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⡏⣧⣀⣀⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢶⣿⣋⣟⠭⣿⣿⠟⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢻⣿⣭⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⡏⢮⣳⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢻⡿⣦⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢿⠢⣽⣅⠀⠀⠀⠀⠀⠀⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠸⡆⢤⣿⡇⠀⠀⠀⠀⣸⡟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢷⠸⣞⡇⠀⠀⠀⠀⡏⢧⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⡄⣿⣷⠀⠀⠀⠀⢻⡈⢣⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣇⢸⣿⡆⠀⠀⠀⠀⢳⣬⣧⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢹⡈⣿⣧⠀⠀⢠⡄⣸⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⡇⢹⣿⡀⠀⢸⢧⠟⢹⠇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⠸⣿⡇⣠⠋⢾⣾⢸⢀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡖⠀⠸⣿⣶⣿⣷⡏⢰⡿⢿⠏⣸⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⡇⠀⣴⢋⣿⣿⣿⠇⡟⠁⣏⠀⣿⣧⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣰⡞⣏⢦⠇⢸⡿⢿⠋⢀⣤⣀⡘⢦⡟⢸⣆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢹⣿⠃⢀⣴⡆⠀⠀⠈⣹⣿⡷⠆⠀⣧⠈⢿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⠜⢁⡴⠋⡀⠙⢄⠀⣰⣿⣟⠓⠀⠀⢉⣴⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⣤⢰⡏⡠⠊⢀⡴⣇⠀⢀⡞⠉⠛⠀⡀⢀⣄⣩⠌⠙⢦⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⣸⣿⢣⠶⠖⠊⢀⣈⠉⣹⡷⢀⣴⡯⠔⣛⡵⠁⣠⡏⠸⣆⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⢹⡿⢿⠟⠀⣰⡞⠉⣿⡷⠇⠃⣠⢴⣶⣾⡋⢀⡴⣽⠁⠀⠘⣏⣀⢰⣆⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⣠⣶⣶⣅⣠⣶⠀⠒⠟⢁⡴⠋⠀⠀⠀⢹⣿⣿⡋⣧⢸⡇⡏⣀⣀⠀⠙⣿⣉⠙⢤⡄⠀⠀⠀
⠀⠀⣠⣴⣺⢿⣿⣿⡛⠛⠿⠿⣯⣷⡲⣶⣟⣻⡀⠀⣠⣿⣿⣖⣸⣨⣿⠿⠛⣻⣿⣶⣾⣾⠇⠀⠻⣄⠀⠀
⠀⣾⢟⠿⠿⢶⣮⡙⢏⢢⡀⢠⡌⣿⣿⡿⠟⡿⢳⣼⣿⣿⣿⣾⣿⣧⣤⣤⣤⣿⣿⣭⣿⠁⠀⠀⣀⣈⣧⠀
⢺⣥⢿⠾⠿⠿⠿⡿⠚⢋⣠⠯⣿⢉⢉⠻⠾⠛⢿⣿⠻⠿⢛⢋⣤⣯⣭⠽⠶⣾⣻⢿⣻⢿⠶⢛⣻⡿⢽⠄
        `,
    },
];

const CHANGELOG = [
    {
        version: "0.0.1_alpha",
        date: "2025-12-06",
        changes: [
            "Initial release",
            "Homepage with interactive portrait",
            "Contact page with parallax",
        ],
    },
    {
        version: "0.9.0",
        date: "2025-12-05",
        changes: [
            "Added page transitions",
            "Menu overlay animation",
            "Loading screen",
        ],
    },
    {
        version: "0.1.0",
        date: "2025-12-01",
        changes: ["Project setup", "Basic structure"],
    },
];

const COMMAND_KEYS = [
    "help",
    "about",
    "social",
    "skills",
    "ascii",
    "vocabolario",
    "changelog",
    "clear",
    "exit",
    "whoami",
    "date",
    "echo",
];

type DestructionPhase =
    | "idle"
    | "confirm1"
    | "confirm2"
    | "loading"
    | "shutdown";

export default function Sys() {
    const t = useTranslations("sys");
    const locale = useLocale();
    const [currentSection, setCurrentSection] = useState<Section>("home");
    const [typedText, setTypedText] = useState("");
    const [currentTime, setCurrentTime] = useState("");
    const [commandInput, setCommandInput] = useState("");
    const [commandHistory, setCommandHistory] = useState<string[]>([]);
    const [commandOutput, setCommandOutput] = useState<string[]>([]);
    const [destructionPhase, setDestructionPhase] =
        useState<DestructionPhase>("idle");
    const [loadingProgress, setLoadingProgress] = useState(0);

    const welcomeText = `\n${t("welcome")}\n`;

    const destructionCmd = locale === "it" ? "autodistruzione" : "selfdestruct";

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setCurrentTime(
                now.toLocaleString("it-IT", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                })
            );
        };
        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (currentSection !== "home") return;

        let index = 0;
        setTypedText("");

        const typeInterval = setInterval(() => {
            if (index < welcomeText.length) {
                setTypedText(welcomeText.slice(0, index + 1));
                index++;
            } else {
                clearInterval(typeInterval);
            }
        }, 15);

        return () => clearInterval(typeInterval);
    }, [currentSection]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (document.activeElement?.tagName === "INPUT") return;

            if (currentSection === "home") {
                if (e.key === "1") setCurrentSection("ascii");
                if (e.key === "2") setCurrentSection("changelog");
                if (e.key === "3") setCurrentSection("vocabolario");
                if (e.key === "0") window.location.href = "/";
            } else {
                if (
                    e.key === "0" ||
                    e.key === "Escape" ||
                    e.key === "Backspace"
                ) {
                    setCurrentSection("home");
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [currentSection]);

    const executeCommand = (input: string) => {
        const trimmed = input.trim().toLowerCase();
        const parts = trimmed.split(" ");
        const cmd = parts[0];
        const args = parts.slice(1).join(" ");

        setCommandHistory((prev) => [...prev, `> ${input}`]);

        let output: string;

        // Build commands list with translations
        const commandsWithDestruction = [...COMMAND_KEYS, destructionCmd];

        switch (cmd) {
            case "help":
                output = `\n${t("available")}\n═══════════════════════════════════════\n${commandsWithDestruction
                    .map((name) => `  ${name.padEnd(14)} - ${t(`commands.${name === destructionCmd ? (locale === "it" ? "autodistruzione" : "selfdestruct") : name}`)}`)
                    .join("\n")}\n═══════════════════════════════════════\n`;
                break;
            case "about":
                output = `\n${t("aboutText")}\n`;
                break;
            case "social":
                output = `\n${t("socialText")}\n`;
                break;
            case "skills":
                output = `\n${t("skillsText")}\n`;
                break;
            case "ascii":
                setCurrentSection("ascii");
                output = t("openingAscii");
                break;
            case "changelog":
                setCurrentSection("changelog");
                output = t("openingChangelog");
                break;
            case "vocabolario":
                setCurrentSection("vocabolario");
                output = t("openingVocabolario");
                break;
            case "clear":
                setCommandOutput([]);
                setCommandHistory([]);
                return;
            case "exit":
                output = t("goodbye");
                setTimeout(() => {
                    window.location.href = "/";
                }, 1000);
                break;
            case "matrix":
                output = `\n  Wake up, Neo...\n  The Matrix has you...\n  Follow the white rabbit.\n\n  Knock, knock, Neo.\n`;
                break;
            case "whoami":
                output = "guest@fechuli-bbs";
                break;
            case "date":
                output = new Date().toLocaleString(locale === "it" ? "it-IT" : "en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                });
                break;
            case "echo":
                output = args || "";
                break;
            case "autodistruzione":
            case "selfdestruct":
                setDestructionPhase("confirm1");
                output = `\n${t("destruction.warning")}\n`;
                break;
            case "si":
            case "sì":
            case "yes":
                if (destructionPhase === "confirm1") {
                    setDestructionPhase("confirm2");
                    output = `\n${t("destruction.finalConfirm")}\n`;
                } else {
                    output = t("commandNotFound", { cmd });
                }
                break;
            case "no":
                if (
                    destructionPhase === "confirm1" ||
                    destructionPhase === "confirm2"
                ) {
                    setDestructionPhase("idle");
                    output = t("destruction.cancelled");
                } else {
                    output = "";
                }
                break;
            case "conferma":
            case "confirm":
                if (destructionPhase === "confirm2") {
                    setDestructionPhase("loading");
                    output = t("destruction.initializing");
                    startDestruction();
                } else {
                    output = t("commandNotFound", { cmd });
                }
                break;
            case "":
                return;
            default:
                if (destructionPhase === "confirm1") {
                    output = t("destruction.typeYesNo");
                } else if (destructionPhase === "confirm2") {
                    output = t("destruction.typeConfirm");
                } else {
                    output = t("commandNotFound", { cmd });
                }
        }

        setCommandOutput((prev) => [...prev, output]);
    };

    const startDestruction = () => {
        const loadingSteps = [
            t("destruction.steps.disconnecting"),
            t("destruction.steps.erasing"),
            t("destruction.steps.removing"),
            t("destruction.steps.deleting"),
            t("destruction.steps.purging"),
            t("destruction.steps.finalizing"),
        ];

        let stepIndex = 0;
        let progress = 0;

        const progressInterval = setInterval(() => {
            progress += Math.random() * 15 + 5;
            if (progress > 100) progress = 100;
            setLoadingProgress(Math.floor(progress));

            if (
                progress >= (stepIndex + 1) * (100 / loadingSteps.length) &&
                stepIndex < loadingSteps.length
            ) {
                setCommandOutput((prev) => [...prev, loadingSteps[stepIndex]]);
                stepIndex++;
            }

            if (progress >= 100) {
                clearInterval(progressInterval);
                setTimeout(() => {
                    setDestructionPhase("shutdown");
                    const currentCount = parseInt(
                        localStorage.getItem("_destruction_count") || "0"
                    );
                    localStorage.setItem(
                        "_destruction_count",
                        String(currentCount + 1)
                    );
                    localStorage.setItem("_x_terminated", "true");
                }, 500);
            }
        }, 300);
    };

    const handleCommandSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        executeCommand(commandInput);
        setCommandInput("");
    };

    const renderHome = () => (
        <div>
            <pre className="text-[#00ff00] text-[8px] sm:text-base overflow-x-auto">
                {ASCII_ART}
            </pre>
            <pre>{typedText}</pre>

            <div className="mt-4 space-y-1">
                {commandHistory.map((line, i) => (
                    <div key={i}>
                        <pre className="text-[#00ff00]">{line}</pre>
                        {commandOutput[i] && (
                            <pre className="opacity-80 whitespace-pre-wrap">
                                {commandOutput[i]}
                            </pre>
                        )}
                    </div>
                ))}
            </div>

            {destructionPhase === "loading" && (
                <div className="mt-4">
                    <pre className="text-[#00ff00]">
                        [
                        {`${"#".repeat(
                            Math.floor(loadingProgress / 5)
                        )}${".".repeat(20 - Math.floor(loadingProgress / 5))}`}
                        ] {loadingProgress}%
                    </pre>
                </div>
            )}

            <form
                onSubmit={handleCommandSubmit}
                className="mt-4 flex items-center"
            >
                <span className="text-[#00ff00] mr-2">
                    guest@fechuli-bbs:~$
                </span>
                <input
                    type="text"
                    value={commandInput}
                    onChange={(e) => setCommandInput(e.target.value)}
                    className="flex-1 bg-transparent border-none outline-none text-[#00ff00] caret-[#00ff00]"
                    autoFocus
                    spellCheck={false}
                    autoComplete="off"
                    disabled={
                        destructionPhase === "loading" ||
                        destructionPhase === "shutdown"
                    }
                />
            </form>

            <div className="mt-8 flex gap-4 text-xs opacity-50">
                <button
                    onClick={() => setCurrentSection("ascii")}
                    className="hover:opacity-100 transition-opacity"
                >
                    [1] ASCII
                </button>
                <button
                    onClick={() => setCurrentSection("changelog")}
                    className="hover:opacity-100 transition-opacity"
                >
                    [2] Changelog
                </button>
                <button
                    onClick={() => setCurrentSection("vocabolario")}
                    className="hover:opacity-100 transition-opacity"
                >
                    [3] Vocabolario
                </button>
                <Link href="/" className="hover:opacity-100 transition-opacity">
                    [0] Exit
                </Link>
            </div>
        </div>
    );

    const renderAsciiGallery = () => (
        <div>
            <pre className="text-[#00ff00] mb-4">
                {`\n╔══════════════════════════════════════╗\n║         ${t("sections.ascii").padEnd(28)}║\n╚══════════════════════════════════════╝\n`}
            </pre>
            <div className="space-y-8">
                {ASCII_GALLERY.map((item, index) => (
                    <div
                        key={index}
                        className="border border-[#00ff00] p-4 overflow-x-auto"
                    >
                        <p className="text-[#00ff00] mb-2">{`// ${item.title}`}</p>
                        <pre className="text-[10px] sm:text-xs">{item.art}</pre>
                    </div>
                ))}
            </div>
            <div className="mt-8">
                <button
                    onClick={() => setCurrentSection("home")}
                    className="hover:bg-[#00ff00] hover:text-black px-2 transition-colors"
                >
                    [0] {t("back")}
                </button>
            </div>
        </div>
    );

    const renderChangelog = () => (
        <div>
            <pre className="text-[#00ff00] mb-4">
                {`\n╔══════════════════════════════════════╗\n║           ${t("sections.changelog").padEnd(26)}║\n╚══════════════════════════════════════╝\n`}
            </pre>
            <div className="space-y-6">
                {CHANGELOG.map((entry, index) => (
                    <div
                        key={index}
                        className="border-l-2 border-[#00ff00] pl-4"
                    >
                        <p className="text-[#00ff00]">
                            v{entry.version} - {entry.date}
                        </p>
                        <ul className="mt-2 space-y-1">
                            {entry.changes.map((change, i) => (
                                <li key={i} className="opacity-70">
                                    → {change}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
            <div className="mt-8">
                <button
                    onClick={() => setCurrentSection("home")}
                    className="hover:bg-[#00ff00] hover:text-black px-2 transition-colors"
                >
                    [0] {t("back")}
                </button>
            </div>
        </div>
    );

    const renderVocabolario = () => (
        <div>
            <pre className="text-[#00ff00] mb-4">
                {`\n╔══════════════════════════════════════╗\n║         ${t("sections.vocabolario").padEnd(28)}║\n╚══════════════════════════════════════╝\n`}
            </pre>
            <div className="space-y-6">
                {VOCABOLARIO.map((entry, index) => (
                    <div key={index} className="border border-[#00ff00] p-4">
                        <p className="text-[#00ff00] text-lg mb-2">
                            {entry.termine}
                        </p>
                        <p className="opacity-70 leading-relaxed">
                            {entry.definizione}
                        </p>
                    </div>
                ))}
            </div>
            <div className="mt-8">
                <button
                    onClick={() => setCurrentSection("home")}
                    className="hover:bg-[#00ff00] hover:text-black px-2 transition-colors"
                >
                    [0] {t("back")}
                </button>
            </div>
        </div>
    );

    if (destructionPhase === "shutdown") {
        return (
            <div className="fixed inset-0 bg-black z-99999 flex items-center justify-center overflow-hidden">
                <div className="crt-shutdown" />
                <style jsx>{`
                    .crt-shutdown {
                        position: absolute;
                        width: 100%;
                        height: 100%;
                        background: white;
                        animation: crt-off 0.5s ease-out forwards;
                    }
                    @keyframes crt-off {
                        0% {
                            transform: scale(1, 1);
                            opacity: 1;
                        }
                        50% {
                            transform: scale(1, 0.005);
                            opacity: 1;
                        }
                        80% {
                            transform: scale(0.2, 0.005);
                            opacity: 1;
                        }
                        100% {
                            transform: scale(0, 0);
                            opacity: 0;
                        }
                    }
                `}</style>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-[#00ff00] font-mono p-4 sm:p-8 relative overflow-hidden">
            <div
                className="pointer-events-none absolute inset-0 z-10"
                style={{
                    background:
                        "repeating-linear-gradient(0deg, rgba(0,0,0,0.15) 0px, rgba(0,0,0,0.15) 1px, transparent 1px, transparent 2px)",
                }}
            />

            <div
                className="pointer-events-none absolute inset-0 z-10 opacity-[0.03]"
                style={{
                    animation: "flicker 0.15s infinite",
                }}
            />

            <div className="flex justify-between items-start mb-8 text-xs opacity-50">
                <span>{currentTime}</span>
            </div>

            <div className="relative z-0">
                {currentSection === "home" && renderHome()}
                {currentSection === "ascii" && renderAsciiGallery()}
                {currentSection === "changelog" && renderChangelog()}
                {currentSection === "vocabolario" && renderVocabolario()}
            </div>

            <div className="absolute bottom-4 left-4 right-4 sm:left-8 sm:right-8 text-xs opacity-50 flex justify-between">
                <span>{t("pressKeys")}</span>
            </div>

            <style jsx>{`
                @keyframes flicker {
                    0% {
                        opacity: 0.03;
                    }
                    50% {
                        opacity: 0.05;
                    }
                    100% {
                        opacity: 0.03;
                    }
                }
            `}</style>
        </div>
    );
}
