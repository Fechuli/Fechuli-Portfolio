import Hero from "@/components/home/hero";
import SecondSection from "@/components/home/second-section";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Home | Fechuli",
    description: "",
};

export default function Home() {
    return (
        <div className="min-h-screen">
            <Hero />
            <SecondSection />
        </div>
    );
}
