"use client";

import { useEffect, useState } from "react";
import { AlertCircle, X, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ErrorAlertProps {
    message: string | null;
    type?: "error" | "warning";
    onDismiss: () => void;
    autoDismiss?: boolean;
}

export function ErrorAlert({ message, type = "error", onDismiss, autoDismiss = true }: ErrorAlertProps) {
    useEffect(() => {
        if (message && autoDismiss && type !== "warning") {
            const timer = setTimeout(onDismiss, 5000);
            return () => clearTimeout(timer);
        }
    }, [message, autoDismiss, onDismiss, type]);

    return (
        <AnimatePresence>
            {message && (
                <motion.div
                    initial={{ opacity: 0, y: -10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: -10, height: 0 }}
                    className="w-full max-w-xl mx-auto overflow-hidden"
                >
                    <div className={cn(
                        "flex items-center gap-3 p-4 rounded-xl border mb-4 shadow-sm",
                        type === "error"
                            ? "bg-red-500/10 border-red-500/20 text-red-600"
                            : "bg-orange-500/10 border-orange-500/20 text-orange-600"
                    )}>
                        {type === "error" ? (
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        ) : (
                            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                        )}
                        <p className="text-sm font-medium flex-1">{message}</p>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onDismiss}
                            className={cn(
                                "h-8 w-8 hover:bg-transparent",
                                type === "error" ? "hover:text-red-800" : "hover:text-orange-800"
                            )}
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
