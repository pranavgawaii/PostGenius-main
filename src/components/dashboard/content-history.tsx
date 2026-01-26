"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { ArrowUpRight, Clock, FileText, Globe } from "lucide-react";
import Image from "next/image";

const recentItems = [
    {
        title: "10 Marketing Trends for 2026",
        source: "medium.com",
        date: "2 hours ago",
        posts: 3,
        icon: "/globe.svg" // Placeholder, would be actual favicon
    },
    {
        title: "How to Scale Your SaaS to $1M ARR",
        source: "indiehackers.com",
        date: "5 hours ago",
        posts: 4,
        icon: "/globe.svg"
    },
    {
        title: "The Future of React Server Components",
        source: "verce.com/blog",
        date: "1 day ago",
        posts: 3,
        icon: "/vercel.svg"
    },
];

export function ContentHistory() {
    return (
        <Card className="col-span-full lg:col-span-3 h-full shadow-lg border-primary/5 bg-background/50 backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" /> Recent Projects
                </CardTitle>
                <CardDescription>
                    Your previously repurposed articles.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {recentItems.map((item, i) => (
                    <div key={i} className="group flex items-start gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer">
                        <div className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-border bg-background shadow-sm">
                            <div className="flex h-full w-full items-center justify-center bg-muted/20">
                                <Globe className="h-5 w-5 text-muted-foreground" />
                            </div>
                        </div>
                        <div className="flex-1 space-y-1">
                            <p className="font-medium leading-none group-hover:text-primary transition-colors">
                                {item.title}
                            </p>
                            <p className="text-sm text-muted-foreground flex items-center gap-2">
                                <span className="truncate max-w-[120px]">{item.source}</span>
                                <span>•</span>
                                <span>{item.date}</span>
                            </p>
                        </div>
                        <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground bg-secondary/50 px-2 py-1 rounded-md">
                            <FileText className="w-3 h-3" />
                            {item.posts}
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
