"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
    title: string;
    value: number | string;
    icon: string;
    change: string;
    changeType: 'positive' | 'negative' | 'neutral';
    delay?: number;
}

export function StatCard({ title, value, icon, change, changeType, delay = 0 }: StatCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.5, ease: "easeOut" }}
            whileHover={{ y: -4, scale: 1.02 }}
        >
            <Card className="relative overflow-hidden border-border/50 dark:border-white/10 bg-white/50 dark:bg-white/[0.03] backdrop-blur-2xl p-5 hover:bg-black/[0.02] dark:hover:bg-white/[0.06] transition-all duration-300 group shadow-sm dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
                <div className="absolute -top-2 -right-2 text-3xl opacity-[0.05] grayscale group-hover:grayscale-0 group-hover:opacity-10 transition-all duration-700 rotate-12">
                    {icon}
                </div>

                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <span className="text-lg grayscale group-hover:grayscale-0 transition-all duration-500">{icon}</span>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">{title}</p>
                    </div>

                    <div className="flex items-baseline gap-2">
                        <h3 className="text-2xl font-black tracking-tighter text-foreground dark:bg-gradient-to-br dark:from-white dark:via-white dark:to-white/40 dark:bg-clip-text dark:text-transparent">
                            {value}
                        </h3>
                    </div>

                    <div className={cn(
                        "inline-flex items-center text-[10px] font-black tracking-wide px-2 py-0.5 rounded-full border",
                        changeType === 'positive' ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" :
                            changeType === 'negative' ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20" : "bg-neutral-100 dark:bg-white/5 text-muted-foreground border-border/50 dark:border-white/10"
                    )}>
                        {changeType === 'positive' && <span className="mr-1">↑</span>}
                        {changeType === 'negative' && <span className="mr-1">↓</span>}
                        {change}
                    </div>
                </div>

                {/* Refined Glass Highlight */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.5] dark:from-white/[0.05] to-transparent pointer-events-none" />
            </Card>
        </motion.div>
    );
}
