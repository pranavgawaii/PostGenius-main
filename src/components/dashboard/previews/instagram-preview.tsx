"use client";

import { useUser } from "@clerk/nextjs";
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from "lucide-react";
import Image from "next/image";

export function InstagramPreview({ content }: { content: string }) {
    const { user } = useUser();

    return (
        <div className="w-full max-w-[400px] mx-auto bg-background border border-border rounded-lg overflow-hidden shadow-sm font-sans">
            {/* Header */}
            <div className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="relative w-8 h-8 rounded-full overflow-hidden border border-border">
                        {user?.imageUrl ? (
                            <Image src={user.imageUrl} alt="Profile" fill className="object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-[10px]">?</div>
                        )}
                    </div>
                    <span className="text-sm font-semibold">{user?.username || user?.firstName?.toLowerCase() || "user"}</span>
                </div>
                <MoreHorizontal className="w-5 h-5" />
            </div>

            {/* Media Placeholder */}
            <div className="aspect-square bg-muted/30 flex items-center justify-center border-y border-border relative overflow-hidden group">
                <div className="text-muted-foreground/40 font-bold text-2xl rotate-12 select-none">
                    MEDIA PLACEHOLDER
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5" />
            </div>

            {/* Interactions */}
            <div className="p-3">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-4">
                        <Heart className="w-6 h-6 hover:text-red-500 cursor-pointer" />
                        <MessageCircle className="w-6 h-6 hover:text-muted-foreground cursor-pointer" />
                        <Send className="w-6 h-6 hover:text-muted-foreground cursor-pointer" />
                    </div>
                    <Bookmark className="w-6 h-6 hover:text-muted-foreground cursor-pointer" />
                </div>

                <div className="text-sm font-semibold mb-1">1,204 likes</div>

                <div className="text-sm leading-relaxed">
                    <span className="font-semibold mr-2">{user?.username || user?.firstName?.toLowerCase() || "user"}</span>
                    <span className="whitespace-pre-wrap">{content}</span>
                </div>

                <div className="text-[10px] text-muted-foreground uppercase mt-2 tracking-wide">
                    1 minute ago
                </div>
            </div>
        </div>
    );
}
