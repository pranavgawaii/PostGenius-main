"use client";

import { useEffect } from "react";
import { toast } from "sonner";

interface ShortcutProps {
    onGenerate: () => void;
    onFocusInput: () => void;
    onCloseModal: () => void;
}

export function useKeyboardShortcuts({ onGenerate, onFocusInput, onCloseModal }: ShortcutProps) {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
            const ctrlKey = isMac ? e.metaKey : e.ctrlKey;

            // Cmd/Ctrl + Enter: Generate
            if (ctrlKey && e.key === "Enter") {
                e.preventDefault();
                onGenerate();
            }

            // Cmd/Ctrl + K: Focus URL Input
            if (ctrlKey && e.key === "k") {
                e.preventDefault();
                onFocusInput();
            }

            // Escape: Close modals/alerts
            if (e.key === "Escape") {
                onCloseModal();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        // Show a subtle tip on first mount
        const hasSeenTip = localStorage.getItem("has-seen-shortcut-tip");
        if (!hasSeenTip) {
            setTimeout(() => {
                toast.info("💡 Tip: Use Cmd+Enter to generate quickly!", {
                    description: "Press ? anytime to see all shortcuts."
                });
                localStorage.setItem("has-seen-shortcut-tip", "true");
            }, 5000);
        }

        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onGenerate, onFocusInput, onCloseModal]);
}
