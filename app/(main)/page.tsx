import Hero from "@/components/home/hero";
import PixelTransition from "@/components/home/pixel-transition";
import SecondSection from "@/components/home/second-section";
import ThirdSection from "@/components/home/third-section";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Home | Fechuli",
    description: "",
};

export default function Home() {
    return (
        <div className="min-h-screen bg-[#330014]">
            <Hero />
            <div className="h-[5vw] bg-[#fff5f5]"></div>
            <PixelTransition rows={35} pixelSize={10} />
            <SecondSection />
            <ThirdSection />
        </div>
    );
}
