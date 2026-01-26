"use client";

import { FileText, Clock, ArrowRight, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";

interface Generation {
    id: string;
    url: string;
    platforms: string[];
    created_at: string;
    summary?: string;
    title?: string;
}

interface RecentActivityWidgetProps {
    generations: Generation[];
}

export function RecentActivityWidget({ generations }: RecentActivityWidgetProps) {
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const handleCopy = (id: string, url: string) => {
        navigator.clipboard.writeText(url);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    if (!generations || generations.length === 0) {
        return (
            <div className="bg-card/30 backdrop-blur rounded-xl border border-white/5 overflow-hidden">
                <div className="p-4 border-b border-white/5 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <h3 className="font-semibold text-sm text-foreground">Recent Activity</h3>
                </div>
                <div className="p-12 text-center">
                    <p className="text-sm text-muted-foreground">No recent activity found. Start generating to see your history!</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-card/30 backdrop-blur rounded-xl border border-white/5 overflow-hidden">
            <div className="p-4 border-b border-white/5 flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-semibold text-sm text-foreground">Recent Activity</h3>
            </div>

            <div className="divide-y divide-white/5">
                {generations.slice(0, 5).map((gen) => (
                    <div
                        key={gen.id}
                        className="p-4 hover:bg-white/5 transition-colors group"
                    >
                        <div className="flex items-start justify-between gap-3 mb-2">
                            <div className="flex items-center gap-2 overflow-hidden">
                                <FileText className="h-4 w-4 text-primary shrink-0" />
                                <p className="text-sm font-medium text-foreground truncate max-w-[180px]">
                                    {gen.title?.startsWith("![") ? "Untitled Draft" : (gen.title || gen.url)}
                                </p>
                            </div>
                            <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0">
                                {formatDistanceToNow(new Date(gen.created_at), { addSuffix: true }).replace("about ", "")}
                            </span>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                                {gen.platforms.length} platforms
                            </span>

                            <div className="flex gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={() => handleCopy(gen.id, gen.url)}
                                    title="Copy Source URL"
                                >
                                    {copiedId === gen.id ? (
                                        <Check className="h-3 w-3 text-green-500" />
                                    ) : (
                                        <Copy className="h-3 w-3" />
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-3 bg-white/5 text-center">
                <Link
                    href="/dashboard/library"
                    className="text-xs font-medium text-primary hover:text-primary/80 transition-colors flex items-center justify-center gap-1"
                >
                    View All in Library
                    <ArrowRight className="h-3 w-3" />
                </Link>
            </div>
        </div>
    );
}
