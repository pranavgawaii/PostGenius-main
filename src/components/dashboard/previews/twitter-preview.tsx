"use client";

import { useUser } from "@clerk/nextjs";
import { MessageCircle, Repeat2, Heart, Share, MoreHorizontal } from "lucide-react";
import Image from "next/image";

export function TwitterPreview({ content }: { content: string }) {
    const { user } = useUser();

    return (
        <div className="w-full max-w-xl mx-auto bg-background border border-border rounded-xl overflow-hidden shadow-sm">
            <div className="p-4">
                <div className="flex gap-3">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden bg-muted">
                        {user?.imageUrl ? (
                            <Image src={user.imageUrl} alt="Profile" fill className="object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground">?</div>
                        )}
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                                <span className="font-bold hover:underline cursor-pointer">
                                    {user?.fullName || "Post Genius User"}
                                </span>
                                <span className="text-muted-foreground text-sm">
                                    @{user?.username || user?.firstName?.toLowerCase() || "user"} · 1m
                                </span>
                            </div>
                            <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div className="mt-2 text-[15px] leading-normal whitespace-pre-wrap break-words">
                            {content}
                        </div>
                        <div className="mt-4 flex items-center justify-between text-muted-foreground max-w-md">
                            <div className="flex items-center gap-2 hover:text-blue-500 cursor-pointer transition-colors group">
                                <div className="p-2 group-hover:bg-blue-500/10 rounded-full">
                                    <MessageCircle className="w-4 h-4" />
                                </div>
                                <span className="text-xs">24</span>
                            </div>
                            <div className="flex items-center gap-2 hover:text-green-500 cursor-pointer transition-colors group">
                                <div className="p-2 group-hover:bg-green-500/10 rounded-full">
                                    <Repeat2 className="w-4 h-4" />
                                </div>
                                <span className="text-xs">12</span>
                            </div>
                            <div className="flex items-center gap-2 hover:text-pink-500 cursor-pointer transition-colors group">
                                <div className="p-2 group-hover:bg-pink-500/10 rounded-full">
                                    <Heart className="w-4 h-4" />
                                </div>
                                <span className="text-xs">148</span>
                            </div>
                            <div className="flex items-center gap-2 hover:text-blue-500 cursor-pointer transition-colors group">
                                <div className="p-2 group-hover:bg-blue-500/10 rounded-full">
                                    <Share className="w-4 h-4" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
