"use client";

import { useEffect, useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Layers, Search, LayoutGrid, List, Copy, Download, ExternalLink, Calendar, Facebook, Linkedin, Twitter, Instagram, Mail, FileText, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PlatformPreview } from "@/components/dashboard/platform-preview";

interface LibraryItem {
    id: number;
    url: string;
    title: string;
    created_at: string;
    user_id: string;
    captions: {
        instagram?: string;
        linkedin?: string;
        twitter?: string;
        facebook?: string;
        newsletter?: string;
        blog?: string;
        [key: string]: string | undefined;
    };
    metadata: {
        total_captions: number;
        content_summary?: string;
    };
}

const PLATFORM_ICONS: Record<string, any> = {
    instagram: Instagram,
    twitter: Twitter,
    linkedin: Linkedin,
    facebook: Facebook,
    newsletter: Mail,
    blog: FileText
};

export default function LibraryPage() {
    const [generations, setGenerations] = useState<LibraryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState<"grid" | "list">("grid");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(0);
    const [selectedPreview, setSelectedPreview] = useState<LibraryItem | null>(null);
    const limit = 12;

    const fetchGenerations = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/user/generations?limit=${limit}&offset=${page * limit}`);
            if (res.ok) {
                const data = await res.json();
                setGenerations(data);
            }
        } catch (error) {
            console.error("Failed to fetch library", error);
            toast.error("Failed to load library items");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGenerations();
    }, [page]);

    const filteredGenerations = useMemo(() => {
        return generations.filter(gen =>
            (gen.title?.toLowerCase() || "").includes(search.toLowerCase()) ||
            gen.url.toLowerCase().includes(search.toLowerCase())
        );
    }, [generations, search]);

    const downloadCSV = () => {
        const headers = ["ID", "Title", "URL", "Date", "Instagram", "Twitter", "LinkedIn", "Facebook", "Newsletter", "Blog"];
        const rows = generations.map(g => [
            g.id,
            `"${g.title.replace(/"/g, '""')}"`,
            g.url,
            g.created_at,
            `"${(g.captions.instagram || "").replace(/"/g, '""')}"`,
            `"${(g.captions.twitter || "").replace(/"/g, '""')}"`,
            `"${(g.captions.linkedin || "").replace(/"/g, '""')}"`,
            `"${(g.captions.facebook || "").replace(/"/g, '""')}"`,
            `"${(g.captions.newsletter || "").replace(/"/g, '""')}"`,
            `"${(g.captions.blog || "").replace(/"/g, '""')}"`
        ]);
        const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `postgenius_library_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        toast.success("Library exported to CSV!");
    };

    return (
        <div className="space-y-8 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-4xl font-black italic tracking-tighter bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                        CONTENT LIBRARY
                    </h1>
                    <p className="text-muted-foreground font-medium mt-2">
                        Manage all your AI-generated drafts in one place.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm" onClick={downloadCSV} className="h-10 gap-2 font-bold uppercase tracking-wider text-xs rounded-xl hidden sm:flex">
                        <Download className="w-4 h-4" />
                        Export CSV
                    </Button>
                    <div className="flex bg-muted p-1 rounded-xl border border-border/50">
                        <Button
                            variant={view === "grid" ? "secondary" : "ghost"}
                            size="icon"
                            className="h-8 w-8 rounded-lg"
                            onClick={() => setView("grid")}
                        >
                            <LayoutGrid className="h-4 w-4" />
                        </Button>
                        <Button
                            variant={view === "list" ? "secondary" : "ghost"}
                            size="icon"
                            className="h-8 w-8 rounded-lg"
                            onClick={() => setView("list")}
                        >
                            <List className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                        type="search"
                        placeholder="Search by title, topic or URL..."
                        className="pl-11 h-12 bg-background/50 border-input rounded-2xl shadow-sm transition-all focus:ring-2 focus:ring-primary/20"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Content Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="h-[200px] bg-muted/50 rounded-3xl animate-pulse" />
                    ))}
                </div>
            ) : filteredGenerations.length === 0 ? (
                <Card className="border-border/50 bg-background/50 backdrop-blur-sm shadow-xl">
                    <CardContent className="h-[400px] flex items-center justify-center">
                        <div className="text-center space-y-6">
                            <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center animate-bounce">
                                <Layers className="w-10 h-10 text-primary" />
                            </div>
                            <div className="space-y-2">
                                <p className="text-xl font-bold tracking-tight">Library is Empty</p>
                                <p className="text-muted-foreground max-w-xs mx-auto">
                                    Your generated content will appear here nicely organized.
                                </p>
                            </div>
                            <Button className="font-bold rounded-xl px-8" onClick={() => window.location.href = "/dashboard"}>
                                Create New Content
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className={cn(
                    "gap-6",
                    view === "grid" ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 items-start" : "flex flex-col"
                )}>
                    {filteredGenerations.map((gen) => (
                        <motion.div
                            layout
                            key={gen.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ y: -5 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Card
                                className="group border-border/50 bg-card hover:border-primary/50 transition-all duration-300 overflow-hidden shadow-sm hover:shadow-xl cursor-pointer h-full flex flex-col"
                                onClick={() => setSelectedPreview(gen)}
                            >
                                <div className="p-5 space-y-4 flex-1">
                                    {/* Card Header */}
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                            <div className="flex items-center gap-2">
                                                <Badge variant="secondary" className="rounded-md px-1.5 py-0.5 text-[10px] font-mono">
                                                    #{gen.id}
                                                </Badge>
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {formatDistanceToNow(new Date(gen.created_at), { addSuffix: true })}
                                                </span>
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2">
                                                {gen.title}
                                            </h3>
                                            <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                                                <ExternalLink className="w-3 h-3 flex-shrink-0" />
                                                <span className="truncate max-w-[200px]">{gen.url}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Platform Icons */}
                                    <div className="flex gap-2 pt-2">
                                        {Object.entries(gen.captions).map(([key, value]) => {
                                            if (!value) return null;
                                            const Icon = PLATFORM_ICONS[key] || FileText;
                                            return (
                                                <div key={key} className="bg-muted/50 p-1.5 rounded-lg text-muted-foreground group-hover:text-primary transition-colors">
                                                    <Icon className="w-4 h-4" />
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="p-4 border-t border-border/50 bg-muted/5 group-hover:bg-primary/5 transition-colors flex items-center justify-between">
                                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                        <Sparkles className="w-3.5 h-3.5 text-primary" />
                                        View Generated Content
                                    </span>
                                    <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full group-hover:bg-primary group-hover:text-white transition-all">
                                        <ChevronRight className="w-4 h-4" />
                                    </Button>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Preview Modal */}
            <Dialog open={!!selectedPreview} onOpenChange={(open) => !open && setSelectedPreview(null)}>
                <DialogContent className="max-w-6xl w-[95vw] h-[90vh] p-0 gap-0 overflow-hidden bg-background/95 backdrop-blur-3xl border-border/50 shadow-2xl rounded-3xl">
                    <DialogHeader className="p-6 border-b border-border/50 bg-muted/20">
                        <DialogTitle className="flex items-center gap-4">
                            <div className="hidden sm:block">
                                <span className="text-2xl font-black italic tracking-tighter">PREVIEW</span>
                            </div>
                            <div className="h-6 w-px bg-border hidden sm:block" />
                            <div className="flex flex-col gap-1 min-w-0">
                                <span className="text-sm font-medium truncate max-w-md">{selectedPreview?.title}</span>
                                <a href={selectedPreview?.url} target="_blank" className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1">
                                    {selectedPreview?.url} <ExternalLink className="w-3 h-3" />
                                </a>
                            </div>
                        </DialogTitle>
                    </DialogHeader>

                    <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-black/5 dark:bg-black/20">
                        <div className="max-w-5xl mx-auto -mt-8">
                            {selectedPreview && (
                                <PlatformPreview visible={true} data={selectedPreview.captions} />
                            )}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
