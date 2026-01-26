"use client";

import { useState, useCallback } from "react";
import { RepurposeInput } from "@/components/dashboard/repurpose-input";
import { PlatformPreview } from "@/components/dashboard/platform-preview";
import { UsageStatsCards } from "@/components/dashboard/usage-stats-cards";
import { RecentGenerations } from "@/components/dashboard/recent-generations";
import { GenerationProgress } from "@/components/dashboard/generation-progress";
import { ErrorAlert } from "@/components/dashboard/error-alert";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

export default function DashboardPage() {
    const [url, setUrl] = useState("");
    const [showResults, setShowResults] = useState(false);
    const [generatedData, setGeneratedData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = useCallback(async (targetUrl: string) => {
        const urlToUse = targetUrl || url;
        if (!urlToUse) {
            setError("Please enter a blog URL");
            return;
        }

        // Basic URL validation
        if (!urlToUse.startsWith("http")) {
            setError("Please enter a valid URL (must start with http:// or https://)");
            return;
        }

        console.log("🚀 Starting generation for:", urlToUse);
        setLoading(true);
        setError(null);
        setGeneratedData(null);
        setShowResults(false);
        setCurrentStep(1);

        try {
            // Step 1: Checking Cache
            setTimeout(() => setCurrentStep(2), 2000);

            const res = await fetch("/api/generate-captions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ blogUrl: urlToUse }),
            });

            // Step 2 & 3 are handled by the single API call, we mock the transition
            setTimeout(() => setCurrentStep(3), 5000);
            setTimeout(() => setCurrentStep(4), 10000);

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || "Generation failed");
            }

            const data = await res.json();
            setGeneratedData(data.captions); // Assuming the API returns captions object
            setShowResults(true);
        } catch (err: any) {
            console.error(err);
            setError(err.message || "An unexpected error occurred. Please try again.");
        } finally {
            setLoading(false);
            setCurrentStep(0);
        }
    }, [url]);

    // Keyboard Shortcuts Integration
    useKeyboardShortcuts({
        onGenerate: () => handleGenerate(url),
        onFocusInput: () => {
            window.dispatchEvent(new CustomEvent("focus-repurpose-input", { detail: { focusInput: true } }));
        },
        onCloseModal: () => {
            setError(null);
            setShowResults(false);
        }
    });

    return (
        <div className="space-y-10 pb-20 max-w-7xl mx-auto">
            <ScrollReveal>
                <UsageStatsCards />
            </ScrollReveal>

            {/* Header / Input Section */}
            <div className="relative min-h-[450px] flex flex-col justify-center items-center rounded-[2.5rem] bg-gradient-to-b from-background to-muted/20 border border-border/50 overflow-hidden px-4 transition-all duration-500">
                <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />

                <div className="w-full max-w-3xl space-y-4">
                    <RepurposeInput
                        url={url}
                        setUrl={setUrl}
                        onGenerate={handleGenerate}
                        isGenerating={loading}
                        error={error}
                    />

                    <ErrorAlert
                        message={error}
                        onDismiss={() => setError(null)}
                        type={error?.includes("limit") ? "warning" : "error"}
                    />

                    <GenerationProgress
                        currentStep={currentStep}
                        isGenerating={loading}
                    />
                </div>
            </div>

            {/* Recent Generations */}
            {!showResults && !loading && (
                <ScrollReveal>
                    <RecentGenerations />
                </ScrollReveal>
            )}

            {/* Results Section */}
            {showResults && (
                <ScrollReveal>
                    <PlatformPreview visible={showResults} data={generatedData} />
                </ScrollReveal>
            )}
        </div>
    );
}
