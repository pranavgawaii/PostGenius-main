"use client";

import { Card, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, RefreshCw, Check, MoreHorizontal, ThumbsUp, MessageCircle, Share2, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@clerk/nextjs";
import { cn } from "@/lib/utils";

interface LinkedInPostOutputProps {
    post: {
        text: string;
        hashtags: string[];
    };
}

export function LinkedInPostOutput({ post }: LinkedInPostOutputProps) {
    const { user } = useUser();
    const [copied, setCopied] = useState(false);

    // Safety check for post object
    if (!post) return null;

    const fullText = `${post.text || ''}\n\n${(post.hashtags || []).join(' ')}`;
    const charCount = fullText.length;

    // Quality Score Logic (Simple approximation)
    const score = Math.min(100, Math.max(0,
        (charCount > 200 && charCount < 1000 ? 50 : 20) +
        ((post.hashtags || []).length >= 3 ? 30 : 10) +
        ((post.text || '').includes('\n\n') ? 20 : 0)
    ));

    const handleCopy = () => {
        navigator.clipboard.writeText(fullText);
        setCopied(true);
        toast.success("Post copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Card className="max-w-2xl mx-auto border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden p-0">
            {/* LinkedIn Preview Container */}
            <div className="bg-white dark:bg-[#1b1f23] p-4 sm:p-6 border-b border-border/10">

                {/* Fake Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex gap-3">
                        <Avatar className="w-12 h-12">
                            <AvatarImage src={user?.imageUrl} />
                            <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white leading-tight">
                                {user?.fullName || "Your Name"}
                            </h3>
                            <p className="text-xs text-gray-500">Student at University • 2h • <span className="inline-block align-middle">🌐</span></p>
                        </div>
                    </div>
                    <MoreHorizontal className="text-gray-500 w-5 h-5" />
                </div>

                {/* Content */}
                <div className="space-y-4 text-sm sm:text-base text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">
                    {post.text}
                </div>

                {/* Hashtags */}
                <div className="mt-4 flex flex-wrap gap-1">
                    {(post.hashtags || []).map((tag, i) => (
                        <span key={i} className="text-blue-600 dark:text-blue-400 font-medium hover:underline cursor-pointer">
                            {tag}
                        </span>
                    ))}
                </div>

                {/* Fake Engagement Stats */}
                <div className="mt-4 pt-2 flex items-center justify-between text-xs text-gray-500 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-1">
                        <div className="flex -space-x-1">
                            <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">👍</div>
                            <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">💡</div>
                        </div>
                        <span>128</span>
                    </div>
                    <span>4 comments • 2 reposts</span>
                </div>

                {/* Fake Action Buttons */}
                <div className="mt-2 pt-2 flex justify-between border-t border-gray-100 dark:border-gray-800">
                    {[
                        { icon: ThumbsUp, label: "Like" },
                        { icon: MessageCircle, label: "Comment" },
                        { icon: Share2, label: "Repost" },
                        { icon: Send, label: "Send" }
                    ].map((btn, i) => (
                        <div key={i} className="flex items-center gap-1.5 px-2 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer text-gray-500 font-medium text-sm transition-colors">
                            <btn.icon className="w-5 h-5" />
                            <span className="hidden sm:inline">{btn.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer Metrics & Actions */}
            <CardFooter className="bg-black/20 p-4 grid gap-4">
                <div className="flex items-center justify-between text-sm">
                    <div className="flex flex-col">
                        <span className="text-muted-foreground">Character Count</span>
                        <span className={cn(
                            "font-bold font-mono",
                            charCount >= 200 && charCount <= 1300 ? "text-green-400" : "text-yellow-400"
                        )}>
                            {charCount} / 3000
                        </span>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-muted-foreground">Quality Score</span>
                        <div className="flex items-center gap-1">
                            <span className="text-yellow-400">⭐⭐⭐⭐</span>
                            <span className="font-bold">({score}/100)</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3 w-full">
                    <Button variant="outline" className="flex-1 gap-2">
                        <RefreshCw className="w-4 h-4" />
                        Regenerate
                    </Button>
                    <Button className="flex-1 gap-2 bg-[#0077b5] hover:bg-[#006396] text-white" onClick={handleCopy}>
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        Copy Post
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
}
