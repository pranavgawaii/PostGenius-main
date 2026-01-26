"use client";

import { motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface GenerationProgressProps {
    currentStep: number;
    isGenerating: boolean;
}

const steps = [
    { name: "Checking cache...", percentage: 25 },
    { name: "Scraping blog content...", percentage: 50 },
    { name: "Generating captions with AI...", percentage: 90 },
    { name: "Saving to library...", percentage: 100 },
];

export function GenerationProgress({ currentStep, isGenerating }: GenerationProgressProps) {
    if (!isGenerating) return null;

    const currentPercentage = steps[currentStep - 1]?.percentage || 0;

    return (
        <div className="w-full max-w-xl mx-auto space-y-4 py-8 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="bg-muted/50 rounded-full h-2 overflow-hidden border border-border/50">
                <motion.div
                    className="h-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${currentPercentage}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                />
            </div>

            <div className="grid grid-cols-4 gap-2">
                {steps.map((step, idx) => {
                    const isCompleted = idx + 1 < currentStep;
                    const isActive = idx + 1 === currentStep;

                    return (
                        <div key={idx} className="flex flex-col items-center gap-2 text-center">
                            <div className={cn(
                                "w-6 h-6 rounded-full flex items-center justify-center text-[10px] transition-colors",
                                isCompleted ? "bg-primary text-primary-foreground" :
                                    isActive ? "bg-primary/20 text-primary animate-pulse" :
                                        "bg-muted text-muted-foreground"
                            )}>
                                {isCompleted ? (
                                    <Check className="w-3 h-3 stroke-[3]" />
                                ) : (
                                    <span>{idx + 1}</span>
                                )}
                            </div>
                            <span className={cn(
                                "text-[10px] font-medium leading-tight max-w-[80px]",
                                isActive ? "text-foreground" : "text-muted-foreground"
                            )}>
                                {step.name}
                            </span>
                        </div>
                    );
                })}
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground font-medium">
                <Loader2 className="w-3 h-3 animate-spin" />
                <span>Usually takes 10-15 seconds</span>
            </div>
        </div>
    );
}
