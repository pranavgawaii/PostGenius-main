"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Download, Check, Target } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ResumeBulletsOutputProps {
    bullets: string[];
}

export function ResumeBulletsOutput({ bullets }: ResumeBulletsOutputProps) {
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

    const handleCopy = (text: string, index: number) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        toast.success("Bullet copied!");
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    const handleCopyAll = () => {
        navigator.clipboard.writeText(bullets.map(b => `• ${b}`).join('\n\n'));
        toast.success("All bullets copied!");
    };

    const handleDownload = () => {
        const content = bullets.map(b => `• ${b}`).join('\n\n');
        const blob = new Blob([content], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "resume_bullets.txt";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <Card className="max-w-4xl mx-auto border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden p-6 space-y-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-green-500/10 rounded-lg">
                    <Target className="w-6 h-6 text-green-400" />
                </div>
                <div>
                    <h3 className="text-xl font-bold">Resume Bullet Points</h3>
                    <p className="text-sm text-muted-foreground">ATS-optimized • Quantifiable • Action-oriented</p>
                </div>
            </div>

            <div className="space-y-4">
                {bullets.map((bullet, index) => {
                    const charCount = bullet.length;
                    const isOptimal = charCount >= 60 && charCount <= 100;

                    return (
                        <div key={index} className="group relative bg-black/20 hover:bg-black/30 border border-white/5 hover:border-white/10 rounded-xl p-4 transition-all">
                            <div className="flex items-start gap-3 pr-12">
                                <span className="text-green-400 font-bold text-lg mt-[-2px]">•</span>
                                <p className="text-gray-200 leading-relaxed font-medium">{bullet}</p>
                            </div>

                            <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
                                <span className={cn(
                                    "text-xs font-mono",
                                    isOptimal ? "text-green-400" : "text-yellow-400"
                                )}>
                                    {charCount} chars {isOptimal && "✓"}
                                </span>

                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 text-xs gap-1.5 absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => handleCopy(bullet, index)}
                                >
                                    {copiedIndex === index ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                    Copy
                                </Button>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <Button variant="outline" className="gap-2" onClick={handleDownload}>
                    <Download className="w-4 h-4" />
                    Download .txt
                </Button>
                <Button className="gap-2 bg-green-600 hover:bg-green-700" onClick={handleCopyAll}>
                    <Copy className="w-4 h-4" />
                    Copy All
                </Button>
            </div>
        </Card>
    );
}
