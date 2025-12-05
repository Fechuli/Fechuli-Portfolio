import Hero from "@/components/home/hero";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Home",
    description: "",
};

export default function Home() {
    return (
        <div className="min-h-screen">
            <Hero />
        </div>
    );
}
