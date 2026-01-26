"use client";

import { useUser } from "@clerk/nextjs";
import { ThumbsUp, MessageCircle, Share2, MoreHorizontal, Globe } from "lucide-react";
import Image from "next/image";

export function FacebookPreview({ content }: { content: string }) {
    const { user } = useUser();

    return (
        <div className="w-full max-w-xl mx-auto bg-background border border-border rounded-lg overflow-hidden shadow-sm shadow-black/5">
            <div className="p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="relative w-10 h-10 rounded-full overflow-hidden bg-muted">
                            {user?.imageUrl ? (
                                <Image src={user.imageUrl} alt="Profile" fill className="object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-muted-foreground text-[10px]">?</div>
                            )}
                        </div>
                        <div>
                            <div className="text-sm font-semibold hover:underline cursor-pointer">
                                {user?.fullName || "Post Genius User"}
                            </div>
                            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                <span>1m ·</span>
                                <Globe className="w-3 h-3" />
                            </div>
                        </div>
                    </div>
                    <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="mt-3 text-[13px] leading-snug whitespace-pre-wrap">
                    {content}
                </div>
            </div>

            {/* Interactions Row */}
            <div className="px-4 py-2 border-t border-border flex items-center justify-between">
                <div className="flex items-center gap-1">
                    <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center border border-white">
                        <ThumbsUp className="w-2 h-2 text-white fill-white" />
                    </div>
                    <span className="text-[12px] text-muted-foreground">7</span>
                </div>
                <div className="text-[12px] text-muted-foreground">
                    <span>1 comment</span> · <span>1 share</span>
                </div>
            </div>

            <div className="px-4 py-1 border-t border-border flex items-center justify-between">
                <button className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-muted rounded-md transition-colors text-muted-foreground font-semibold text-sm">
                    <ThumbsUp className="w-4 h-4" />
                    <span>Like</span>
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-muted rounded-md transition-colors text-muted-foreground font-semibold text-sm">
                    <MessageCircle className="w-4 h-4" />
                    <span>Comment</span>
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-muted rounded-md transition-colors text-muted-foreground font-semibold text-sm">
                    <Share2 className="w-4 h-4" />
                    <span>Share</span>
                </button>
            </div>
        </div>
    );
}
