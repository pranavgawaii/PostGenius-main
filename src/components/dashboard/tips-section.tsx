"use client";

import { Check, Lightbulb, ExternalLink } from "lucide-react";

interface TipsSectionProps {
    onTryExample: (url: string) => void;
}

export function TipsSection({ onTryExample }: TipsSectionProps) {
    const tips = [
        "Works best with blog posts, articles, and public videos",
        "Generation takes approximately 5-10 seconds",
        "Review and edit captions before posting for best results",
        "Save frequently used captions to your library",
        "Each caption is optimized for its specific platform character limits"
    ];

    return (
        <div className="max-w-2xl mx-auto mt-8 mb-8">
            <div className="bg-card/30 rounded-2xl p-6 border border-border/50 backdrop-blur-sm">
                <div className="flex items-center justify-center gap-2 mb-4">
                    <Lightbulb className="h-5 w-5 text-yellow-500" />
                    <h3 className="font-semibold text-foreground text-center">Pro Tips</h3>
                </div>
                <ul className="space-y-3">
                    {tips.map((tip, index) => (
                        <li key={index} className="flex items-start gap-3 text-sm text-muted-foreground">
                            <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                            <span>{tip}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
