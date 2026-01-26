"use client";

import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardEmptyStateProps {
    onTryExample: (url: string) => void;
}

export function DashboardEmptyState({ onTryExample }: DashboardEmptyStateProps) {
    const examples = [
        { label: "Tech Article about AI", url: "https://techcrunch.com/category/artificial-intelligence/" },
        { label: "YouTube Video Tutorial", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
        { label: "Product Launch Blog", url: "https://blog.google/products/pixel/" },
    ];

    return (
        <div
            className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-2xl bg-card/30 border border-white/5"
        >
            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-6 ring-1 ring-primary/20">
                <Sparkles className="h-10 w-10 text-primary" />
            </div>

            <h3 className="text-2xl font-bold text-foreground mb-2">
                Welcome to PostGenius!
            </h3>
            <p className="text-muted-foreground max-w-md mb-8 text-lg">
                Generate your first caption in seconds, not hours.
                Simply paste a URL to get started.
            </p>

            <Button
                size="lg"
                className="mb-10 h-12 px-8 text-base bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
                Generate Your First Caption
                <ArrowRight className="ml-2 h-4 w-4" />
            </Button>

            <div className="space-y-4 w-full max-w-sm">
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider text-xs">
                    Or try these examples
                </p>
                <div className="flex flex-col gap-2">
                    {examples.map((example, index) => (
                        <button
                            key={index}
                            onClick={() => onTryExample(example.url)}
                            className="flex items-center justify-between p-3 rounded-lg border border-white/5 bg-background/20 hover:bg-white/5 hover:border-primary/30 transition-all group text-sm text-left"
                        >
                            <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                                {example.label}
                            </span>
                            <ArrowRight className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
