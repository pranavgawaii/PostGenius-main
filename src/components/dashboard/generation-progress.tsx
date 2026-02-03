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
    const currentStepIndex = Math.min(currentStep - 1, steps.length - 1);
    const currentPercentage = steps[currentStepIndex]?.percentage || 0;
    const currentStepName = steps[currentStepIndex]?.name || "Processing...";

    return (
        <div className="w-full max-w-lg mx-auto py-10 animate-in fade-in duration-1000">
            <div className="space-y-6">
                {/* Minimal Progress Line */}
                <div className="relative">
                    <div className="h-[2px] w-full bg-muted/20 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-primary relative"
                            initial={{ width: 0 }}
                            animate={{ width: `${currentPercentage}%` }}
                            transition={{ duration: 1, ease: "easeInOut" }}
                        >
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                                animate={{ x: ["-100%", "100%"] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            />
                        </motion.div>
                    </div>

                    {/* Discrete Step Indicators */}
                    <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full flex justify-between px-0.5 pointer-events-none">
                        {steps.map((_, idx) => (
                            <div
                                key={idx}
                                className={cn(
                                    "w-1 h-1 rounded-full transition-colors duration-500",
                                    idx < currentStep ? "bg-primary" : "bg-muted-foreground/20"
                                )}
                            />
                        ))}
                    </div>
                </div>

                {/* Elegant Step Name & Message */}
                <div className="flex flex-col items-center gap-2">
                    <motion.div
                        key={currentStepName}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="flex items-center gap-3"
                    >
                        <div className="relative flex items-center justify-center">
                            <Loader2 className="w-3 h-3 animate-spin text-primary/70" />
                            <div className="absolute inset-0 blur-[4px] bg-primary/20 rounded-full animate-pulse" />
                        </div>
                        <span className="text-[13px] font-medium tracking-tight text-foreground/80 lowercase">
                            {currentStepName}
                        </span>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground"
                    >
                        step {currentStep} of {steps.length}
                    </motion.p>
                </div>
            </div>
        </div>
    );
}
