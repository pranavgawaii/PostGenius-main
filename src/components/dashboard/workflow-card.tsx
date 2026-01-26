"use client";

import { cn } from "@/lib/utils";
import { WorkflowDefinition } from "@/lib/workflows";
import { Check } from "lucide-react";

interface WorkflowCardProps {
    workflow: WorkflowDefinition;
    isSelected: boolean;
    onClick: () => void;
}

export function WorkflowCard({ workflow, isSelected, onClick }: WorkflowCardProps) {
    return (
        <div
            onClick={onClick}
            className={cn(
                "relative group cursor-pointer rounded-xl border-2 p-4 transition-all duration-200 flex flex-col justify-between hover:shadow-md",
                isSelected
                    ? "border-purple-500 bg-purple-500/5 shadow-xl shadow-purple-500/10 scale-[1.02]"
                    : "border-gray-200 bg-card hover:border-gray-300 hover:bg-muted/50 dark:border-white/10 dark:bg-white/5 dark:hover:border-white/20 dark:hover:bg-white/10 hover:scale-[1.02]"
            )}
        >
            {isSelected && (
                <div className="absolute top-3 right-3 bg-purple-500 rounded-full p-0.5 text-white">
                    <Check className="w-3 h-3" />
                </div>
            )}

            <div className="space-y-3">
                <div className="text-3xl">{workflow.icon}</div>

                <div>
                    <h3 className={cn(
                        "text-base font-bold mb-1",
                        isSelected ? "text-purple-600 dark:text-purple-400" : "text-foreground"
                    )}>
                        {workflow.name}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {workflow.description}
                    </p>
                </div>
            </div>

            <div className="mt-3 pt-3 border-t border-border/50">
                <span className={cn(
                    "inline-block text-[10px] font-medium px-2 py-0.5 rounded-full",
                    isSelected
                        ? "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300"
                        : "bg-secondary text-secondary-foreground"
                )}>
                    Best for: {workflow.bestFor.split(',')[0]}
                </span>
            </div>
        </div>
    );
}
