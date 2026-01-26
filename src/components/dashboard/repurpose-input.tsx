"use client";

import { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, ArrowRight, Link as LinkIcon, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";


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

        // Check for URL in query params
        const params = new URLSearchParams(window.location.search);
        const queryUrl = params.get("url");
        if (queryUrl && !url) {
            setUrl(queryUrl);
        }

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
        <div className="w-full relative group">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="relative"
            >
                <form onSubmit={handleSubmit} className="relative flex items-center">
                    <div className="absolute left-6 text-muted-foreground group-focus-within:text-primary transition-colors">
                        <LinkIcon className="h-5 w-5" />
                    </div>

                    <Input
                        ref={inputRef}
                        type="url"
                        placeholder="Paste your link here..."
                        className={cn(
                            "h-14 w-full rounded-2xl border-2 border-border bg-background/50 pl-12 pr-24 text-base shadow-sm transition-all",
                            "hover:border-primary/50 hover:bg-background/80",
                            "focus:border-primary focus:bg-background focus:ring-4 focus:ring-primary/10",
                            error && "border-red-500/50 focus:border-red-500 focus:ring-red-500/10",
                            isLimitReached && "opacity-60 cursor-not-allowed bg-muted"
                        )}
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        required
                        disabled={isLimitReached}
                    />

                    <div className="absolute right-1.5">
                        <Button
                            type="submit"
                            size="icon"
                            className={cn(
                                "h-11 w-14 rounded-xl transition-all duration-300",
                                isLimitReached
                                    ? "bg-muted text-muted-foreground"
                                    : "bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 shadow-md"
                            )}
                            disabled={isGenerating || isLimitReached}
                        >
                            {isGenerating ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : isLimitReached ? (
                                <span className="text-[10px] font-bold">LOCK</span>
                            ) : (
                                <ArrowRight className="h-5 w-5" />
                            )}
                        </Button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
