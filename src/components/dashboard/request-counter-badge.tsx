"use client";

import { useEffect, useState } from "react";
import { Flame, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface UsageData {
    remaining: number;
    daily_limit: number;
    plan_type: string;
    reset_at: string;
    allowed: boolean;
}

export function RequestCounterBadge() {
    const [usage, setUsage] = useState<UsageData | null>(null);

    const fetchUsage = async () => {
        try {
            const res = await fetch("/api/user/usage");
            if (res.ok) {
                const data = await res.json();
                setUsage(data);
            }
        } catch (error) {
            console.error("Failed to fetch usage", error);
        }
    };

    useEffect(() => {
        fetchUsage();
        // Poll every 30 seconds
        const interval = setInterval(fetchUsage, 30000);
        return () => clearInterval(interval);
    }, []);

    if (!usage) return null;

    const dailyLimit = usage.daily_limit || 5; // Fallback to 5 if 0/null
    const remaining = usage.remaining ?? dailyLimit; // Default to dailyLimit if null/undefined
    const isUnlimited = usage.plan_type?.toLowerCase() === "unlimited";

    const isLow = !isUnlimited && remaining <= (dailyLimit * 0.2);
    const isMedium = !isUnlimited && remaining > (dailyLimit * 0.2) && remaining < (dailyLimit * 0.6);

    // Calculate time until reset safely
    const resetAt = usage.reset_at ? new Date(usage.reset_at) : null;
    const now = new Date();
    const hoursToReset = resetAt && !isNaN(resetAt.getTime())
        ? Math.ceil((resetAt.getTime() - now.getTime()) / (1000 * 60 * 60))
        : 24; // Default to 24h if invalid

    return (
        <TooltipProvider>
            <div className="flex items-center gap-2">
                <PlanBadge plan={usage.plan_type} className="hidden md:block" />
                <Tooltip>
                    <TooltipTrigger asChild>
                        <div className={cn(
                            "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all animate-in fade-in zoom-in duration-300",
                            isUnlimited ? "bg-orange-500/10 text-orange-500 border border-orange-500/20" :
                                isLow ? "bg-red-500/10 text-red-500 border border-red-500/20" :
                                    isMedium ? "bg-orange-500/10 text-orange-500 border border-orange-500/20" :
                                        "bg-green-500/10 text-green-500 border border-green-500/20"
                        )}>
                            <Flame className={cn("w-3.5 h-3.5", (remaining > 0 || isUnlimited) && "animate-pulse")} />
                            <span>
                                {isUnlimited ? (
                                    "∞ Unlimited"
                                ) : (
                                    remaining <= 0 ? `Resets in ${hoursToReset}h` : `${remaining}/${dailyLimit} left today`
                                )}
                            </span>
                        </div>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p className="text-xs">
                            {isUnlimited ? "Unlimited Generations" : `Daily Limit: ${dailyLimit} generations`}
                        </p>
                        <p className="text-[10px] text-muted-foreground">Resets at midnight IST</p>
                    </TooltipContent>
                </Tooltip>
            </div>
        </TooltipProvider>
    );
}

import { PlanBadge } from "@/components/PlanBadge";
