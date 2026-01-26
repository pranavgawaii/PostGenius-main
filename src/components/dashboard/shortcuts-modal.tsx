"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface ShortcutsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const shortcuts = [
    { key: "Cmd/Ctrl + Enter", action: "Generate Social Content", detail: "Trigger generation when URL is entered" },
    { key: "Cmd/Ctrl + K", action: "Focus Input", detail: "Quickly jump to the URL input field" },
    { key: "Esc", action: "Close Modals", detail: "Dismiss alerts, focus, or modals" },
    { key: "Tab", action: "Navigate Tabs", detail: "Switch between platform preview tabs" },
    { key: "?", action: "Open Help", detail: "Show this shortcuts helper" },
];

export function ShortcutsModal({ isOpen, onClose }: ShortcutsModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md bg-background border-border">
                <DialogHeader>
                    <DialogTitle className="text-xl font-black italic tracking-tighter">KEYBOARD SHORTCUTS</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border">
                                <th className="text-left font-bold uppercase tracking-widest text-[10px] pb-2">Shortcut</th>
                                <th className="text-left font-bold uppercase tracking-widest text-[10px] pb-2">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {shortcuts.map((s, i) => (
                                <tr key={i} className="group">
                                    <td className="py-3 pr-4">
                                        <kbd className="px-2 py-1 bg-muted border border-border rounded text-xs font-mono group-hover:bg-primary/10 transition-colors">
                                            {s.key}
                                        </kbd>
                                    </td>
                                    <td className="py-3">
                                        <p className="font-semibold text-foreground leading-none mb-1">{s.action}</p>
                                        <p className="text-[10px] text-muted-foreground font-medium">{s.detail}</p>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </DialogContent>
        </Dialog>
    );
}
