"use client";

import { useEffect, useState } from "react";
import { Copy, Eye, Trash2, Calendar, LayoutGrid, List } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Generation {
    id: number;
    blog_title: string;
    blog_url: string;
    created_at: string;
    instagram_caption: string;
    twitter_caption: string;
    linkedin_caption: string;
    facebook_caption: string;
    newsletter_caption: string;
    blog_caption: string;
}

export function RecentGenerations() {
    const [generations, setGenerations] = useState<Generation[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchRecent = async () => {
        try {
            const res = await fetch("/api/user/generations?limit=3");
            if (res.ok) {
                const data = await res.json();
                setGenerations(data);
            }
        } catch (error) {
            console.error("Failed to fetch recent generations", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecent();
    }, []);

    const copyAll = (gen: Generation) => {
        const text = `
INSTAGRAM: ${gen.instagram_caption}
TWITTER: ${gen.twitter_caption}
LINKEDIN: ${gen.linkedin_caption}
FACEBOOK: ${gen.facebook_caption}
NEWSLETTER: ${gen.newsletter_caption}
BLOG: ${gen.blog_caption}
        `;
        navigator.clipboard.writeText(text);
        toast.success("All captions copied to clipboard!");
    };

    if (loading) return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map(i => <div key={i} className="h-40 bg-muted rounded-xl" />)}
        </div>
    );

    if (generations.length === 0) return (
        <div className="text-center py-12 px-4 border-2 border-dashed border-border rounded-3xl">
            <p className="text-muted-foreground">No generations yet. Paste a blog URL above to get started!</p>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold tracking-tight">Recent Generations</h3>
                <Button variant="ghost" asChild className="text-primary hover:text-primary/80">
                    <Link href="/dashboard/library">View All</Link>
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {generations.map((gen) => (
                    <Card key={gen.id} className="group overflow-hidden border-border/50 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1">
                        <CardHeader className="p-4 pb-2">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="p-1.5 bg-primary/10 rounded text-primary">
                                    <Calendar className="w-3.5 h-3.5" />
                                </span>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                    {formatDistanceToNow(new Date(gen.created_at), { addSuffix: true })}
                                </p>
                            </div>
                            <CardTitle className="text-sm line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                                {gen.blog_title || gen.blog_url}
                            </CardTitle>
                        </CardHeader>
                        <CardFooter className="p-4 pt-4 flex gap-2 border-t border-border/50 bg-muted/5 group-hover:bg-primary/5 transition-colors">
                            <Button variant="outline" size="sm" className="flex-1 text-[10px] h-8 font-bold uppercase tracking-wider" asChild>
                                <Link href={`/dashboard/library?id=${gen.id}`}>
                                    <Eye className="w-3 h-3 mr-1.5" />
                                    View
                                </Link>
                            </Button>
                            <Button variant="ghost" size="sm" className="flex-1 text-[10px] h-8 font-bold uppercase tracking-wider" onClick={() => copyAll(gen)}>
                                <Copy className="w-3 h-3 mr-1.5" />
                                Copy All
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
