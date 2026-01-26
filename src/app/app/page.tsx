"use client";

import { useState } from "react";
import { RepurposeInput } from "@/components/dashboard/repurpose-input";
import { PlatformPreview } from "@/components/dashboard/platform-preview";
import { Navbar } from "@/components/blocks/navbar";

export default function AppPage() {
    const [showResults, setShowResults] = useState(false);
    const [generatedData, setGeneratedData] = useState<any>(null);

    const handleGenerate = async (url: string) => {
        console.log("Generating for:", url);
        setGeneratedData(null);
        setShowResults(true);

        try {
            const res = await fetch("/api/repurpose", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url }),
            });

            if (!res.ok) throw new Error("Generation failed");

            const data = await res.json();
            setGeneratedData(data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="flex min-h-screen flex-col bg-background text-foreground">
            <Navbar />
            <main className="flex-1 container mx-auto px-4 py-8">
                <div className="space-y-8 pb-20">
                    {/* Header / Input Section */}
                    <div className="relative min-h-[500px] flex flex-col justify-center items-center rounded-3xl bg-gradient-to-b from-background to-muted/20 border border-border/50 overflow-hidden px-4">
                        <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
                        <RepurposeInput onGenerate={handleGenerate} />
                    </div>

                    {/* Results Section */}
                    {showResults && <PlatformPreview visible={showResults} data={generatedData} />}
                </div>
            </main>
        </div>
    );
}
