"use client";

import { Crown, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface UpgradeBannerProps {
    className?: string;
    plan: string;
    remaining: number;
    limit: number;
}

export function UpgradeBanner({ className, plan, remaining, limit }: UpgradeBannerProps) {
    // Only show for free plan users
    if (plan?.toLowerCase() !== "free") return null;

    const isLimitReached = remaining <= 0;
    const isNearLimit = remaining <= 1;

    if (!isLimitReached && !isNearLimit) return null;

    return (
        <div className={cn(
            "relative overflow-hidden p-4 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-4 transition-all duration-500 animate-in fade-in slide-in-from-top-4",
            isLimitReached
                ? "bg-primary/5 border-primary/20"
                : "bg-amber-500/5 border-amber-500/20",
            className
        )}>
            <div className="flex items-center gap-4">
                <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                    isLimitReached ? "bg-primary/10" : "bg-amber-500/10"
                )}>
                    <Crown className={cn("w-5 h-5", isLimitReached ? "text-primary" : "text-amber-500")} />
                </div>
                <div>
                    <h4 className="text-sm font-black italic tracking-tight uppercase">
                        {isLimitReached ? "DAILY LIMIT REACHED" : "RUNNING LOW ON FUEL"}
                    </h4>
                    <p className="text-xs text-muted-foreground font-medium">
                        {isLimitReached
                            ? "You've used all 5 Generations today. Upgrade to Premium for 50/day!"
                            : `You only have ${remaining} generation left today. Don't stop the grind!`}
                    </p>
                </div>
            </div>

            <Button asChild size="sm" className="w-full md:w-auto rounded-xl font-bold uppercase tracking-widest text-[10px] gap-2 shadow-lg shadow-primary/20">
                <Link href="/pricing">
                    Upgrade to Premium <ArrowRight className="w-3 h-3" />
                </Link>
            </Button>
        </div>
    );
}
