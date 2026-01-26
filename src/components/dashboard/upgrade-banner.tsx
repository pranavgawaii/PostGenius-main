"use client";

import { motion } from "framer-motion";
import { Sparkles, Zap, ArrowRight, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface UpgradeBannerProps {
    className?: string;
}

export function UpgradeBanner({ className }: UpgradeBannerProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className={`relative overflow-hidden rounded-2xl border border-border bg-card shadow-lg ${className}`}
        >
            {/* Subtle Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-amber-500/5" />

            <div className="relative p-4 md:px-6 md:py-5 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">

                {/* Left Side: Icon & Text */}
                <div className="flex items-center gap-4 w-full md:w-auto text-left">
                    {/* Premium Icon */}
                    <div className="shrink-0 h-10 w-10 md:h-12 md:w-12 flex items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-md text-white">
                        <Crown className="w-5 h-5 md:w-6 md:h-6 fill-current" />
                    </div>

                    <div className="space-y-0.5">
                        <h3 className="text-base md:text-lg font-bold text-foreground">
                            Out of Fuel?
                        </h3>
                        <p className="text-xs md:text-sm text-muted-foreground line-clamp-1 md:line-clamp-none">
                            You've hit your daily limit. Unlock <span className="text-foreground font-semibold">Unlimited Generations</span>.
                        </p>
                    </div>
                </div>

                {/* Right Side: CTA */}
                <div className="shrink-0 w-full md:w-auto">
                    <Button
                        asChild
                        className="w-full md:w-auto rounded-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white border-0 shadow-md h-9 md:h-10 px-6 font-semibold"
                    >
                        <Link href="/pricing" className="gap-2">
                            <Zap className="w-3.5 h-3.5 fill-current" />
                            <span>Upgrade to Pro</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </Button>
                </div>
            </div>
        </motion.div>
    );
}
