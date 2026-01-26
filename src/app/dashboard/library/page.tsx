"use client";

import { useEffect, useState, useMemo } from "react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Layers, Search, Filter, LayoutGrid, List, Copy, Trash2, Eye, ArrowLeft, ArrowRight, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

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

export default function LibraryPage() {
    const [generations, setGenerations] = useState<Generation[]>([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState<"grid" | "list">("grid");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(0);
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
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGenerations();
    }, [page]);

    const filteredGenerations = useMemo(() => {
        return generations.filter(gen =>
            (gen.blog_title?.toLowerCase() || "").includes(search.toLowerCase()) ||
            gen.blog_url.toLowerCase().includes(search.toLowerCase())
        );
    }, [generations, search]);

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
        toast.success("All captions copied!");
    };

    const downloadCSV = () => {
        const headers = ["ID", "Title", "URL", "Date", "Instagram", "Twitter", "LinkedIn", "Facebook", "Newsletter", "Blog"];
        const rows = generations.map(g => [
            g.id, g.blog_title, g.blog_url, g.created_at,
            g.instagram_caption, g.twitter_caption, g.linkedin_caption,
            g.facebook_caption, g.newsletter_caption, g.blog_caption
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
        <div className="space-y-8 pb-20 max-w-7xl mx-auto">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-black italic tracking-tighter">CONTENT LIBRARY</h1>
                    <p className="text-muted-foreground text-sm font-medium">Manage and export all your AI-generated social content.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={downloadCSV} className="h-9 gap-2 text-xs font-bold uppercase tracking-wider">
                        <Download className="w-3.5 h-3.5" />
                        Export
                    </Button>
                    <div className="h-9 w-px bg-border mx-2" />
                    <div className="flex bg-muted p-1 rounded-lg">
                        <Button
                            variant={view === "grid" ? "secondary" : "ghost"}
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => setView("grid")}
                        >
                            <LayoutGrid className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                            variant={view === "list" ? "secondary" : "ghost"}
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => setView("list")}
                        >
                            <List className="h-3.5 w-3.5" />
                        </Button>
                    </div>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search by title or URL..."
                        className="pl-10 h-11 bg-background/50 border-border/50 rounded-xl"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <Button variant="outline" className="h-11 rounded-xl gap-2 font-bold uppercase tracking-wider text-xs">
                    <Filter className="h-3.5 w-3.5" />
                    Filters
                </Button>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
                    {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-48 bg-muted rounded-2xl" />)}
                </div>
            ) : filteredGenerations.length === 0 ? (
                <Card className="border-border/50 bg-background/50 backdrop-blur-sm">
                    <CardContent className="h-[400px] flex items-center justify-center">
                        <div className="text-center space-y-4">
                            <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                                <Layers className="w-8 h-8 text-primary" />
                            </div>
                            <div className="space-y-2">
                                <p className="text-lg font-bold tracking-tight">Library is Empty</p>
                                <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                                    Start by repurposing your first link from the dashboard!
                                </p>
                            </div>
                            <Button className="mt-4 font-bold rounded-xl" onClick={() => window.location.href = "/dashboard"}>
                                Generate Now
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ) : view === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredGenerations.map((gen) => (
                        <Card key={gen.id} className="group overflow-hidden border-border/50 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1">
                            <CardHeader className="p-5 pb-3">
                                <div className="flex items-center justify-between mb-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                    <span className="bg-muted px-2 py-0.5 rounded italic">#{gen.id}</span>
                                    <span>{formatDistanceToNow(new Date(gen.created_at), { addSuffix: true })}</span>
                                </div>
                                <CardTitle className="text-base line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                                    {gen.blog_title || gen.blog_url}
                                </CardTitle>
                            </CardHeader>
                            <CardFooter className="p-4 flex gap-2 border-t border-border/50 bg-muted/5 group-hover:bg-primary/5 transition-colors">
                                <Button variant="outline" size="sm" className="flex-1 text-[10px] h-9 font-bold uppercase tracking-wider" onClick={() => copyAll(gen)}>
                                    <Copy className="w-3 h-3 mr-1.5" />
                                    Copy All
                                </Button>
                                <Button variant="ghost" size="sm" className="flex-1 text-[10px] h-9 font-bold uppercase tracking-wider">
                                    <Eye className="w-3 h-3 mr-1.5" />
                                    Details
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="border border-border/50 rounded-2xl overflow-hidden bg-background/50 backdrop-blur-sm">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-muted/50 text-[10px] font-bold uppercase tracking-widest text-muted-foreground border-b border-border">
                            <tr>
                                <th className="px-6 py-4">Title / URL</th>
                                <th className="px-6 py-4">Generated</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {filteredGenerations.map((gen) => (
                                <tr key={gen.id} className="hover:bg-primary/5 transition-colors group">
                                    <td className="px-6 py-4 max-w-md">
                                        <p className="font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">{gen.blog_title || "Untitled"}</p>
                                        <p className="text-[10px] text-muted-foreground line-clamp-1 truncate">{gen.blog_url}</p>
                                    </td>
                                    <td className="px-6 py-4 text-muted-foreground font-medium text-xs">
                                        {formatDistanceToNow(new Date(gen.created_at), { addSuffix: true })}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => copyAll(gen)} className="h-8 w-8">
                                                <Copy className="w-3.5 h-3.5" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <Eye className="w-3.5 h-3.5" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Pagination */}
            {filteredGenerations.length > 0 && (
                <div className="flex items-center justify-center gap-4 py-8">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(p => Math.max(0, p - 1))}
                        disabled={page === 0}
                        className="rounded-xl font-bold gap-2 text-xs uppercase"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" /> Previous
                    </Button>
                    <span className="text-xs font-bold bg-muted px-3 py-1.5 rounded-lg border border-border/50">
                        PAGE {page + 1}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(p => p + 1)}
                        disabled={generations.length < limit}
                        className="rounded-xl font-bold gap-2 text-xs uppercase"
                    >
                        Next <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                </div>
            )}
        </div>
    );
}
