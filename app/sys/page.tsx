/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

type Section = "home" | "ascii" | "changelog";

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
    { version: "1.0.0", date: "2025-12-06", changes: ["Initial release", "Homepage with interactive portrait", "Contact page with parallax"] },
    { version: "0.9.0", date: "2025-12-05", changes: ["Added page transitions", "Menu overlay animation", "Loading screen"] },
    { version: "0.1.0", date: "2025-12-01", changes: ["Project setup", "Basic structure"] },
];

export default function Sys() {
    const [currentSection, setCurrentSection] = useState<Section>("home");
    const [typedText, setTypedText] = useState("");
    const [showCursor, setShowCursor] = useState(true);
    const [currentTime, setCurrentTime] = useState("");

    const welcomeText = `
FECHULI BBS v1.0.0
══════════════════════════════════════════
Welcome, visitor.
System online since 2025.
══════════════════════════════════════════

Select an option:

[1] ASCII Gallery
[2] Changelog
[0] Exit to main site

> `;

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
        const cursorInterval = setInterval(() => {
            setShowCursor((prev) => !prev);
        }, 500);
        return () => clearInterval(cursorInterval);
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (currentSection === "home") {
                if (e.key === "1") setCurrentSection("ascii");
                if (e.key === "2") setCurrentSection("changelog");
                if (e.key === "0") window.location.href = "/";
            } else {
                if (e.key === "0" || e.key === "Escape" || e.key === "Backspace") {
                    setCurrentSection("home");
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [currentSection]);

    const renderHome = () => (
        <div>
            <pre className="text-[#00ff00]">{ASCII_ART}</pre>
            <pre>
                {typedText}
                {showCursor && <span className="bg-[#00ff00] text-black">_</span>}
            </pre>
            <div className="mt-8 flex gap-4">
                <button
                    onClick={() => setCurrentSection("ascii")}
                    className="hover:bg-[#00ff00] hover:text-black px-2 transition-colors"
                >
                    [1] ASCII Gallery
                </button>
                <button
                    onClick={() => setCurrentSection("changelog")}
                    className="hover:bg-[#00ff00] hover:text-black px-2 transition-colors"
                >
                    [2] Changelog
                </button>
                <Link
                    href="/"
                    className="hover:bg-[#00ff00] hover:text-black px-2 transition-colors"
                >
                    [0] Exit
                </Link>
            </div>
        </div>
    );

    const renderAsciiGallery = () => (
        <div>
            <pre className="text-[#00ff00] mb-4">
{`
╔══════════════════════════════════════╗
║         ASCII GALLERY                ║
╚══════════════════════════════════════╝
`}
            </pre>
            <div className="space-y-8">
                {ASCII_GALLERY.map((item, index) => (
                    <div key={index} className="border border-[#00ff00] p-4 overflow-x-auto">
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
                    [0] Back
                </button>
            </div>
        </div>
    );

    const renderChangelog = () => (
        <div>
            <pre className="text-[#00ff00] mb-4">
{`
╔══════════════════════════════════════╗
║           CHANGELOG                  ║
╚══════════════════════════════════════╝
`}
            </pre>
            <div className="space-y-6">
                {CHANGELOG.map((entry, index) => (
                    <div key={index} className="border-l-2 border-[#00ff00] pl-4">
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
                    [0] Back
                </button>
            </div>
        </div>
    );

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
                <span>FECHULI-BBS v1.0.0</span>
                <span>{currentTime}</span>
            </div>

            <div className="relative z-0">
                {currentSection === "home" && renderHome()}
                {currentSection === "ascii" && renderAsciiGallery()}
                {currentSection === "changelog" && renderChangelog()}
            </div>

            <div className="absolute bottom-4 left-4 right-4 sm:left-8 sm:right-8 text-xs opacity-50 flex justify-between">
                <span>Press number keys to navigate</span>
                <span>CONNECTION: SECURE</span>
            </div>

            <style jsx>{`
                @keyframes flicker {
                    0% { opacity: 0.03; }
                    50% { opacity: 0.05; }
                    100% { opacity: 0.03; }
                }
            `}</style>
        </div>
    );
}
