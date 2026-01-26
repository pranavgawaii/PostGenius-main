"use client";

import { Target, Zap, Star } from "lucide-react";

export function StatsCounter() {
    const stats = [
        {
            icon: <Target className="h-5 w-5 text-purple-400" />,
            value: "10,000+",
            label: "Captions Generated",
        },
        {
            icon: <Zap className="h-5 w-5 text-blue-400" />,
            value: "5 Seconds",
            label: "Avg Generation Time",
        },
        {
            icon: <Star className="h-5 w-5 text-yellow-400" />,
            value: "4.8/5",
            label: "User Rating",
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {stats.map((stat, index) => (
                <div
                    key={index}
                    className="flex flex-col p-4 md:p-6 rounded-xl bg-card/50 backdrop-blur border border-white/5 hover:bg-white/5 transition-colors"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-background/50 border border-white/5">
                            {stat.icon}
                        </div>
                        <span className="text-xl sm:text-2xl font-bold text-foreground">{stat.value}</span>
                    </div>
                    <p className="text-sm text-muted-foreground ml-1">{stat.label}</p>
                </div>
            ))}
        </div>
    );
}
