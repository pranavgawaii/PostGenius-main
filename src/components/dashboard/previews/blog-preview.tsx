"use client";

import { useUser } from "@clerk/nextjs";
import { BookOpen, Clock, ChevronRight } from "lucide-react";
import Image from "next/image";

export function BlogPreview({ content }: { content: string }) {
    const { user } = useUser();

    return (
        <div className="w-full max-w-2xl mx-auto bg-background border border-border rounded-2xl overflow-hidden shadow-2xl shadow-primary/5 group">
            <div className="aspect-[21/9] bg-muted/20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-blue-500/20 mix-blend-overlay" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <BookOpen className="w-12 h-12 text-primary/40" />
                </div>
            </div>

            <div className="p-8">
                <div className="flex items-center gap-4 mb-6">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-primary/20">
                        {user?.imageUrl ? (
                            <Image src={user.imageUrl} alt="Profile" fill className="object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-[10px]">?</div>
                        )}
                    </div>
                    <div>
                        <div className="text-sm font-bold">{user?.fullName || "Post Genius User"}</div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>Jan 26, 2026</span>
                            <span>·</span>
                            <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span>5 min read</span>
                            </div>
                        </div>
                    </div>
                </div>

                <h2 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors">
                    The Art of Content Repurposing: A Masterclass
                </h2>

                <div className="text-muted-foreground leading-relaxed italic text-lg mb-6 line-clamp-3">
                    "{content.substring(0, 250)}..."
                </div>

                <div className="flex items-center justify-between border-t border-border pt-6">
                    <div className="flex gap-2">
                        <span className="px-3 py-1 bg-secondary rounded-full text-[10px] font-bold uppercase tracking-wider">Marketing</span>
                        <span className="px-3 py-1 bg-secondary rounded-full text-[10px] font-bold uppercase tracking-wider">AI</span>
                    </div>
                    <button className="flex items-center gap-1 text-primary font-bold text-sm hover:translate-x-1 transition-transform">
                        Read full article <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
