"use client";

import { useUser } from "@clerk/nextjs";
import { ThumbsUp, MessageSquare, Repeat2, Send, MoreHorizontal, Globe, Heart } from "lucide-react";
import Image from "next/image";

export function LinkedInPreview({ content }: { content: string }) {
    const { user } = useUser();

    return (
        <div className="w-full max-w-xl mx-auto bg-background border border-border rounded-lg overflow-hidden shadow-sm">
            <div className="p-4">
                <div className="flex gap-2">
                    <div className="relative w-12 h-12 rounded-sm overflow-hidden bg-muted">
                        {user?.imageUrl ? (
                            <Image src={user.imageUrl} alt="Profile" fill className="object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground">?</div>
                        )}
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="font-bold text-sm hover:text-blue-600 hover:underline cursor-pointer">
                                    {user?.fullName || "Post Genius User"}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    AI Content Specialist @ Post Genius
                                </div>
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <span>1m ·</span>
                                    <Globe className="w-3 h-3" />
                                </div>
                            </div>
                            <MoreHorizontal className="w-5 h-5 text-muted-foreground cursor-pointer" />
                        </div>
                    </div>
                </div>
                <div className="mt-3 text-sm leading-relaxed whitespace-pre-wrap">
                    {content}
                </div>
            </div>

            <div className="px-4 py-2 border-t border-border flex items-center justify-between">
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <div className="flex -space-x-1">
                        <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center border border-white">
                            <ThumbsUp className="w-2 h-2 text-white fill-white" />
                        </div>
                        <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center border border-white">
                            <Heart className="w-2 h-2 text-white fill-white" />
                        </div>
                    </div>
                    <span>42 · 12 comments</span>
                </div>
            </div>

            <div className="px-2 py-1 flex items-center justify-around border-t border-border">
                <button className="flex items-center gap-2 px-3 py-2 hover:bg-muted rounded-md transition-colors text-muted-foreground font-semibold text-sm">
                    <ThumbsUp className="w-4 h-4" />
                    <span>Like</span>
                </button>
                <button className="flex items-center gap-2 px-3 py-2 hover:bg-muted rounded-md transition-colors text-muted-foreground font-semibold text-sm">
                    <MessageSquare className="w-4 h-4" />
                    <span>Comment</span>
                </button>
                <button className="flex items-center gap-2 px-3 py-2 hover:bg-muted rounded-md transition-colors text-muted-foreground font-semibold text-sm">
                    <Repeat2 className="w-4 h-4" />
                    <span>Repost</span>
                </button>
                <button className="flex items-center gap-2 px-3 py-2 hover:bg-muted rounded-md transition-colors text-muted-foreground font-semibold text-sm">
                    <Send className="w-4 h-4" />
                    <span>Send</span>
                </button>
            </div>
        </div>
    );
}
