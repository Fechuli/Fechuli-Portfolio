import { JetBrains_Mono } from "next/font/google";
import BBSContent from "./bbs-content";

const jetbrainsMono = JetBrains_Mono({
    subsets: ["latin"],
    variable: "--font-mono",
    display: "swap",
});

export default function BBSLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className={`${jetbrainsMono.variable} min-h-screen bg-black font-mono`}>
            <BBSContent>{children}</BBSContent>
        </div>
    );
}
