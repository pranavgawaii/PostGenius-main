"use client";

import { cn } from "@/lib/utils";

interface PlanBadgeProps {
    plan: string;
    className?: string;
}

export function PlanBadge({ plan, className }: PlanBadgeProps) {
    const p = plan?.toLowerCase();
    const isFree = p === "free" || p === "none" || !p;
    const isPremium = p === "premium";
    const isPro = p === "pro";
    const isUnlimited = p === "unlimited";

    const displayPlan = isFree ? "FREE" : (plan?.toUpperCase() || "FREE");

    return (
        <span
            className={cn(
                "px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all",
                isFree && "bg-[#E5E7EB] text-gray-900 border-transparent",
                isPremium && "bg-gradient-to-r from-blue-600 to-purple-600 text-white border-transparent shadow-[0_0_10px_rgba(37,99,235,0.2)]",
                isPro && "bg-[#F59E0B] text-gray-900 border-transparent",
                isUnlimited && "bg-[#FB923C] text-white border-transparent animate-pulse",
                className
            )}
        >
            {displayPlan}
        </span>
    );
}
