"use client";

import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Twitter, Linkedin, Instagram, Facebook, Mail, BookOpen } from "lucide-react";
import { TwitterPreview } from "./previews/twitter-preview";
import { LinkedInPreview } from "./previews/linkedin-preview";
import { InstagramPreview } from "./previews/instagram-preview";
import { FacebookPreview } from "./previews/facebook-preview";
import { NewsletterPreview } from "./previews/newsletter-preview";
import { BlogPreview } from "./previews/blog-preview";
import { toast } from "sonner";

interface GeneratedContent {
    platform: "twitter" | "linkedin" | "instagram" | "facebook" | "newsletter" | "blog";
    content: string;
}

export interface PlatformPreviewProps {
    visible: boolean;
    data?: {
        linkedin?: string | any;
        twitter?: string | any;
        instagram?: string | any;
        facebook?: string | any;
        newsletter?: string | any;
        blog?: string | any;
    };
}

// Helper to safely extract string content
const safeString = (content: any): string => {
    if (!content) return "";
    if (typeof content === "string") return content;
    if (typeof content === "object") {
        return content.text || content.content || content.caption || JSON.stringify(content);
    }
    return String(content);
};

export function PlatformPreview({ visible, data }: PlatformPreviewProps) {
    if (!visible) return null;

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard!");
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-5xl mx-auto mt-12"
        >
            <Tabs defaultValue="linkedin" className="w-full">
                <div className="flex justify-start md:justify-center mb-8 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
                    <TabsList className="flex items-center w-max md:w-full md:grid md:grid-cols-6 bg-muted/50 backdrop-blur-md p-1 rounded-2xl border border-primary/10">
                        <TabsTrigger value="linkedin" className="rounded-xl data-[state=active]:bg-background/80 flex items-center gap-2 whitespace-nowrap">
                            <Linkedin className="w-4 h-4" /> <span className="inline lg:inline">LinkedIn</span>
                        </TabsTrigger>
                        <TabsTrigger value="twitter" className="rounded-xl data-[state=active]:bg-background/80 flex items-center gap-2 whitespace-nowrap">
                            <Twitter className="w-4 h-4" /> <span className="inline lg:inline">Twitter</span>
                        </TabsTrigger>
                        <TabsTrigger value="instagram" className="rounded-xl data-[state=active]:bg-background/80 flex items-center gap-2 whitespace-nowrap">
                            <Instagram className="w-4 h-4" /> <span className="inline lg:inline">Instagram</span>
                        </TabsTrigger>
                        <TabsTrigger value="facebook" className="rounded-xl data-[state=active]:bg-background/80 flex items-center gap-2 whitespace-nowrap">
                            <Facebook className="w-4 h-4" /> <span className="inline lg:inline">Facebook</span>
                        </TabsTrigger>
                        <TabsTrigger value="newsletter" className="rounded-xl data-[state=active]:bg-background/80 flex items-center gap-2 whitespace-nowrap">
                            <Mail className="w-4 h-4" /> <span className="inline lg:inline">Letter</span>
                        </TabsTrigger>
                        <TabsTrigger value="blog" className="rounded-xl data-[state=active]:bg-background/80 flex items-center gap-2 whitespace-nowrap">
                            <BookOpen className="w-4 h-4" /> <span className="inline lg:inline">Blog</span>
                        </TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="linkedin" className="mt-0">
                    <PreviewCard
                        title="LinkedIn Post"
                        content={safeString(data?.linkedin)}
                        onCopy={() => copyToClipboard(safeString(data?.linkedin))}
                        component={<LinkedInPreview content={safeString(data?.linkedin)} />}
                    />
                </TabsContent>
                <TabsContent value="twitter" className="mt-0">
                    <PreviewCard
                        title="Twitter Thread / Post"
                        content={safeString(data?.twitter)}
                        onCopy={() => copyToClipboard(safeString(data?.twitter))}
                        component={<TwitterPreview content={safeString(data?.twitter)} />}
                    />
                </TabsContent>
                <TabsContent value="instagram" className="mt-0">
                    <PreviewCard
                        title="Instagram Caption"
                        content={safeString(data?.instagram)}
                        onCopy={() => copyToClipboard(safeString(data?.instagram))}
                        component={<InstagramPreview content={safeString(data?.instagram)} />}
                    />
                </TabsContent>
                <TabsContent value="facebook" className="mt-0">
                    <PreviewCard
                        title="Facebook Post"
                        content={safeString(data?.facebook)}
                        onCopy={() => copyToClipboard(safeString(data?.facebook))}
                        component={<FacebookPreview content={safeString(data?.facebook)} />}
                    />
                </TabsContent>
                <TabsContent value="newsletter" className="mt-0">
                    <PreviewCard
                        title="Email Newsletter"
                        content={safeString(data?.newsletter)}
                        onCopy={() => copyToClipboard(safeString(data?.newsletter))}
                        component={<NewsletterPreview content={safeString(data?.newsletter)} />}
                    />
                </TabsContent>
                <TabsContent value="blog" className="mt-0">
                    <PreviewCard
                        title="Blog Post / Summary"
                        content={safeString(data?.blog)}
                        onCopy={() => copyToClipboard(safeString(data?.blog))}
                        component={<BlogPreview content={safeString(data?.blog)} />}
                    />
                </TabsContent>
            </Tabs>
        </motion.div>
    );
}

function PreviewCard({ title, component, onCopy, content }: any) {
    const wordCount = typeof content === 'string' ? content.split(' ').length : 0;

    return (
        <Card className="border-primary/10 shadow-2xl shadow-primary/5 bg-background/60 backdrop-blur-xl overflow-hidden">
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-border/50 bg-muted/20 px-4 sm:px-6 py-4 gap-4">
                <div className="space-y-0.5">
                    <CardTitle className="text-xl font-bold">{title}</CardTitle>
                    <CardDescription className="text-xs sm:text-sm">Optimized for engagement and viral reach.</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={onCopy} className="gap-2 rounded-xl w-full sm:w-auto justify-center">
                    <Copy className="w-4 h-4" /> Copy Content
                </Button>
            </CardHeader>
            <CardContent className="p-4 sm:p-8 md:p-12 bg-grid-white/5">
                <div className="relative group overflow-x-auto">
                    <div className="absolute -inset-4 bg-gradient-to-r from-primary/10 to-blue-500/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative">
                        {component}
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border/40 bg-muted/10 px-4 sm:px-6 py-4">
                <div className="text-[10px] sm:text-xs text-muted-foreground font-medium text-center sm:text-left">
                    {wordCount} words • AI Analyzed • High Quality
                </div>
                <Button className="w-full sm:w-auto rounded-xl shadow-lg shadow-primary/20 hover:scale-105 transition-transform px-6">
                    Schedule Post
                </Button>
            </CardFooter>
        </Card>
    );
}
