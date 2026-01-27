"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LogoLoaderProps {
    className?: string;
    size?: number;
}

export function LogoLoader({ className, size = 64 }: LogoLoaderProps) {
    const strokeWidth = 32;
    // Scale stroke width relative to 256px base size if needed, 
    // but usually SVG scaling handles this. 
    // We'll stick to the original viewbox.

    const transition = {
        duration: 2,
        ease: "easeInOut" as const,
        repeat: Infinity,
        repeatType: "loop" as const,
        repeatDelay: 0.5
    };

    return (
        <div className={cn("relative flex items-center justify-center", className)}>
            {/* Ambient Glow */}
            <motion.div
                animate={{
                    opacity: [0.3, 0.6, 0.3],
                    scale: [0.8, 1.1, 0.8],
                }}
                transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute inset-0 rounded-full bg-primary/20 blur-3xl"
            />

            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 256 256"
                width={size}
                height={size}
                className="relative z-10 text-primary"
            >
                <rect width="256" height="256" fill="none" />

                {/* Longer Line (Diagonal) */}
                <motion.line
                    x1="192"
                    y1="40"
                    x2="40"
                    y2="192"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={strokeWidth}
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{
                        ...transition,
                        times: [0, 0.4, 0.8, 1] // Adjust timing for sequential feel if needed
                    }}
                />

                {/* Shorter Line (Checkmark) */}
                <motion.line
                    x1="208"
                    y1="128"
                    x2="128"
                    y2="208"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={strokeWidth}
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{
                        ...transition,
                        delay: 0.2, // Start slightly after the first line
                    }}
                />
            </svg>
        </div>
    );
}

export function PageLoader() {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
            <LogoLoader size={80} />
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="mt-4 text-sm font-medium text-muted-foreground animate-pulse"
            >
                Loading PostGenius...
            </motion.p>
        </div>
    );
}
