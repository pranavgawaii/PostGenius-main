"use client";

import { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, ArrowRight, Link as LinkIcon, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { UpgradeBanner } from "@/components/UpgradeBanner";

interface RepurposeInputProps {
    onGenerate: (url: string) => void;
    url: string;
    setUrl: (url: string) => void;
    isGenerating: boolean;
    error: string | null;
}

interface UsageData {
    remaining: number;
    daily_limit: number;
    plan_type: string;
}

export function RepurposeInput({
    onGenerate,
    url,
    setUrl,
    isGenerating,
    error
}: RepurposeInputProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [usage, setUsage] = useState<UsageData | null>(null);

    const fetchUsage = async () => {
        try {
            const res = await fetch("/api/user/usage");
            if (res.ok) {
                const data = await res.json();
                setUsage(data);
            }
        } catch (error) {
            console.error("Failed to fetch usage for input context", error);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Final frontend check before calling onGenerate
        if (usage && usage.remaining <= 0 && usage.plan_type === 'free') {
            return; // Safety break, though API will also block
        }

        onGenerate(url);
    };

    // Handle focus from parent if needed
    useEffect(() => {
        fetchUsage();
        const handleFocus = (e: any) => {
            if (e.detail?.focusInput) {
                inputRef.current?.focus();
            }
        };
        window.addEventListener("focus-repurpose-input", handleFocus);
        return () => window.removeEventListener("focus-repurpose-input", handleFocus);
    }, []);

    const isLimitReached = !!(usage && usage.remaining <= 0 && usage.plan_type === 'free');

    return (
        <div className="relative w-full max-w-3xl mx-auto text-center py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
            >
                <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary backdrop-blur-sm">
                    <Sparkles className="mr-2 h-3.5 w-3.5" />
                    AI Repurposing Engine v2.0
                </div>

                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent pb-2">
                    Turn any link into social gold.
                </h1>

                <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                    Paste an article, YouTube video, or blog URL. Our AI will instantly create viral posts for LinkedIn, X, and Instagram.
                </p>

                {usage && (usage.remaining <= 1) && (
                    <UpgradeBanner
                        plan={usage.plan_type}
                        remaining={usage.remaining}
                        limit={usage.daily_limit}
                        className="mt-8 shadow-xl"
                    />
                )}

                <form onSubmit={handleSubmit} className="relative mt-8 flex w-full items-center">
                    <div className="relative flex-1 group">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                            <LinkIcon className="h-5 w-5" />
                        </div>
                        <Input
                            ref={inputRef}
                            type="url"
                            placeholder="https://medium.com/your-article..."
                            className={cn(
                                "h-14 w-full rounded-2xl border-2 border-border/50 bg-background/50 pl-12 pr-32 text-lg shadow-xl shadow-primary/5 ring-offset-2 transition-all hover:bg-background/80 focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20",
                                error && "border-red-500/50 focus:border-red-500 focus:ring-red-500/20",
                                isLimitReached && "opacity-50 cursor-not-allowed grayscale"
                            )}
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            required
                            disabled={isLimitReached}
                        />
                        <div className="absolute inset-y-1 right-1">
                            <Button
                                type="submit"
                                size="lg"
                                className={cn(
                                    "h-12 rounded-xl text-primary-foreground shadow-lg transition-all w-28",
                                    isLimitReached
                                        ? "bg-muted text-muted-foreground cursor-not-allowed shadow-none"
                                        : "bg-primary shadow-primary/20 hover:bg-primary/90 hover:scale-105"
                                )}
                                disabled={isGenerating || isLimitReached}
                            >
                                {isGenerating ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : isLimitReached ? (
                                    "Locked"
                                ) : (
                                    <>
                                        Generate <ArrowRight className="ml-1 h-4 w-4" />
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </form>

                {/* Visual Flair */}
                <div className="absolute -top-24 -left-20 -z-10 h-64 w-64 rounded-full bg-primary/20 blur-[100px] opacity-20 animate-pulse" />
                <div className="absolute -bottom-24 -right-20 -z-10 h-64 w-64 rounded-full bg-blue-500/20 blur-[100px] opacity-20 animate-pulse delay-700" />
            </motion.div>
        </div>
    );
}
