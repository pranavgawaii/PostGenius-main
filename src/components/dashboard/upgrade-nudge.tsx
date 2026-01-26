"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, ArrowRight, X } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

export function UpgradeNudge() {
    const [isVisible, setIsVisible] = useState(false);
    const [usedCount, setUsedCount] = useState(0);
    const [limit, setLimit] = useState(5);

    useEffect(() => {
        const checkUsage = async () => {
            try {
                // Check if already dismissed
                if (sessionStorage.getItem("upgrade-nudge-dismissed")) return;

                const res = await fetch("/api/user/usage");
                if (res.ok) {
                    const data = await res.json();
                    const dailyLimit = data.daily_limit || 5;
                    const used = data.daily_request_count || 0;
                    setUsedCount(used);
                    setLimit(dailyLimit);

                    // Show if user has used 80% or more and is on free plan
                    if (used >= (dailyLimit * 0.8) && data.plan_type === "free") {
                        setIsVisible(true);
                    }
                }
            } catch (error) {
                console.error("Failed to check usage for nudge", error);
            }
        };
        checkUsage();
    }, []);

    const dismiss = () => {
        setIsVisible(false);
        sessionStorage.setItem("upgrade-nudge-dismissed", "true");
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="bg-primary/10 border-b border-primary/20 overflow-hidden"
                >
                    <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-1.5 bg-primary/20 rounded text-primary">
                                <AlertTriangle className="w-4 h-4" />
                            </div>
                            <p className="text-sm font-semibold text-primary">
                                <span className="hidden md:inline">⚠️ You've used {usedCount}/{limit} free generations today! </span>
                                <span className="md:hidden">Limit nearly reached! </span>
                                <Link href="/pricing" className="underline hover:text-primary/80 ml-1">
                                    Upgrade to Premium for 50 generations/day →
                                </Link>
                            </p>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={dismiss}
                            className="h-8 w-8 text-primary hover:bg-primary/10"
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
