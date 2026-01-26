"use client";

import { motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

import { WorkflowType } from "@/lib/workflows";

interface GenerationProgressProps {
    currentStep: number;
    isGenerating: boolean;
    workflow?: WorkflowType | null;
}

const workflowSteps: Record<string, { name: string; percentage: number }[]> = {
    social_media: [
        { name: "Checking cache...", percentage: 25 },
        { name: "Scraping content...", percentage: 50 },
        { name: "Generating captions...", percentage: 90 },
        { name: "Finalizing...", percentage: 100 },
    ],
    github_readme: [
        { name: "Checking cache...", percentage: 25 },
        { name: "Fetching repo...", percentage: 50 },
        { name: "Analyzing code...", percentage: 90 },
        { name: "Writing README...", percentage: 100 },
    ],
    resume: [
        { name: "Checking cache...", percentage: 25 },
        { name: "Parsing resume...", percentage: 50 },
        { name: "Optimizing...", percentage: 90 },
        { name: "Formatting...", percentage: 100 },
    ],
    notes: [
        { name: "Checking cache...", percentage: 25 },
        { name: "Analyzing text...", percentage: 50 },
        { name: "Extracting facts...", percentage: 90 },
        { name: "Structuring...", percentage: 100 },
    ],
    linkedin: [
        { name: "Checking cache...", percentage: 25 },
        { name: "Reading content...", percentage: 50 },
        { name: "Drafting post...", percentage: 90 },
        { name: "Polishing...", percentage: 100 },
    ]
};

const defaultSteps = workflowSteps.social_media;

export function GenerationProgress({ currentStep, isGenerating, workflow }: GenerationProgressProps) {
    if (!isGenerating) return null;

    const steps = (workflow && workflowSteps[workflow]) ? workflowSteps[workflow] : defaultSteps;
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
