"use client";

import { useEffect, useState } from "react";
import { Zap, Target, Flame, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface Stats {
    remaining: number;
    daily_limit: number;
    daily_request_count: number;
    plan_type: string;
    total_generations: number;
    allowed: boolean;
}

export function UsageStatsCards() {
    const [stats, setStats] = useState<Stats | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch("/api/user/usage");
                if (res.ok) {
                    const data = await res.json();
                    setStats(data);
                }
            } catch (error) {
                console.error("Failed to fetch stats", error);
            }
        };
        fetchStats();
    }, []);

    if (!stats) return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-pulse">
            {[1, 2, 3].map(i => <div key={i} className="h-28 bg-muted rounded-2xl" />)}
        </div>
    );

    const dailyLimit = stats.daily_limit || 5;
    const isUnlimited = stats.plan_type?.toLowerCase() === "unlimited";
    const usedToday = stats.daily_request_count || 0;
    const usagePercentage = isUnlimited ? 0 : (usedToday / dailyLimit) * 100;

    const cards = [
        {
            label: "Today's Usage",
            value: isUnlimited ? "∞ Unlimited" : `${usedToday}/${dailyLimit}`,
            subtext: isUnlimited ? "unlimited access granted" : "generations used today",
            icon: <Target className="w-5 h-5 text-primary" />,
            progress: isUnlimited ? 0 : usagePercentage,
            color: usagePercentage > 80 ? "bg-red-500" : usagePercentage > 50 ? "bg-orange-500" : "bg-primary"
        },
        {
            label: "Total Generated",
            value: stats.total_generations.toString(),
            subtext: "total captions created",
            icon: <Zap className="w-5 h-5 text-yellow-500" />,
            trend: "+12% this week"
        },
        {
            label: "Current Streak",
            value: "5 days",
            subtext: "daily usage streak",
            icon: <Flame className="w-5 h-5 text-orange-500" />,
            isStreak: true
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {cards.map((card, idx) => (
                <Card key={idx} className="border-border/50 bg-background/50 backdrop-blur-sm overflow-hidden group">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-muted rounded-lg group-hover:bg-primary/5 transition-colors">
                                {card.icon}
                            </div>
                            {card.trend && (
                                <span className="text-[10px] font-bold text-green-500 flex items-center gap-1">
                                    <TrendingUp className="w-3 h-3" />
                                    {card.trend}
                                </span>
                            )}
                            {card.isStreak && (
                                <span className="text-[10px] font-bold text-orange-500 animate-pulse">
                                    🔥 HOT
                                </span>
                            )}
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-2xl font-black tracking-tight">{card.value}</h4>
                            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{card.subtext}</p>
                        </div>
                        {card.progress !== undefined && (
                            <div className="mt-4 h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                <div
                                    className={cn("h-full transition-all duration-1000", card.color)}
                                    style={{ width: `${card.progress}%` }}
                                />
                            </div>
                        )}
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
