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
        linkedin?: string;
        twitter?: string;
        instagram?: string;
        facebook?: string;
        newsletter?: string;
        blog?: string;
    };
}

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
                <div className="flex justify-center mb-8">
                    <TabsList className="grid w-full grid-cols-6 bg-muted/50 backdrop-blur-md p-1 rounded-2xl border border-primary/10">
                        <TabsTrigger value="linkedin" className="rounded-xl data-[state=active]:bg-background/80 flex items-center gap-2">
                            <Linkedin className="w-4 h-4" /> <span className="hidden lg:inline">LinkedIn</span>
                        </TabsTrigger>
                        <TabsTrigger value="twitter" className="rounded-xl data-[state=active]:bg-background/80 flex items-center gap-2">
                            <Twitter className="w-4 h-4" /> <span className="hidden lg:inline">Twitter</span>
                        </TabsTrigger>
                        <TabsTrigger value="instagram" className="rounded-xl data-[state=active]:bg-background/80 flex items-center gap-2">
                            <Instagram className="w-4 h-4" /> <span className="hidden lg:inline">Instagram</span>
                        </TabsTrigger>
                        <TabsTrigger value="facebook" className="rounded-xl data-[state=active]:bg-background/80 flex items-center gap-2">
                            <Facebook className="w-4 h-4" /> <span className="hidden lg:inline">Facebook</span>
                        </TabsTrigger>
                        <TabsTrigger value="newsletter" className="rounded-xl data-[state=active]:bg-background/80 flex items-center gap-2">
                            <Mail className="w-4 h-4" /> <span className="hidden lg:inline">Newsletter</span>
                        </TabsTrigger>
                        <TabsTrigger value="blog" className="rounded-xl data-[state=active]:bg-background/80 flex items-center gap-2">
                            <BookOpen className="w-4 h-4" /> <span className="hidden lg:inline">Blog</span>
                        </TabsTrigger>
                    </TabsList>
                </div>

                {/* LinkedIn Tab */}
                <TabsContent value="linkedin">
                    <PreviewCard
                        title="LinkedIn Post"
                        platform="linkedin"
                        content={data?.linkedin || "Generating..."}
                        component={<LinkedInPreview content={data?.linkedin || ""} />}
                        onCopy={() => copyToClipboard(data?.linkedin || "")}
                    />
                </TabsContent>

                {/* Twitter Tab */}
                <TabsContent value="twitter">
                    <PreviewCard
                        title="Twitter Thread"
                        platform="twitter"
                        content={data?.twitter || "Generating..."}
                        component={<TwitterPreview content={data?.twitter || ""} />}
                        onCopy={() => copyToClipboard(data?.twitter || "")}
                    />
                </TabsContent>

                {/* Instagram Tab */}
                <TabsContent value="instagram">
                    <PreviewCard
                        title="Instagram Caption"
                        platform="instagram"
                        content={data?.instagram || "Generating..."}
                        component={<InstagramPreview content={data?.instagram || ""} />}
                        onCopy={() => copyToClipboard(data?.instagram || "")}
                    />
                </TabsContent>

                {/* Facebook Tab */}
                <TabsContent value="facebook">
                    <PreviewCard
                        title="Facebook Post"
                        platform="facebook"
                        content={data?.facebook || "Generating..."}
                        component={<FacebookPreview content={data?.facebook || ""} />}
                        onCopy={() => copyToClipboard(data?.facebook || "")}
                    />
                </TabsContent>

                {/* Newsletter Tab */}
                <TabsContent value="newsletter">
                    <PreviewCard
                        title="Newsletter Edition"
                        platform="newsletter"
                        content={data?.newsletter || "Generating..."}
                        component={<NewsletterPreview content={data?.newsletter || ""} />}
                        onCopy={() => copyToClipboard(data?.newsletter || "")}
                    />
                </TabsContent>

                {/* Blog Tab */}
                <TabsContent value="blog">
                    <PreviewCard
                        title="Blog Teaser"
                        platform="blog"
                        content={data?.blog || "Generating..."}
                        component={<BlogPreview content={data?.blog || ""} />}
                        onCopy={() => copyToClipboard(data?.blog || "")}
                    />
                </TabsContent>
            </Tabs>
        </motion.div>
    );
}

function PreviewCard({ title, component, onCopy, content }: any) {
    return (
        <Card className="border-primary/10 shadow-2xl shadow-primary/5 bg-background/60 backdrop-blur-xl overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 bg-muted/20 px-6 py-4">
                <div className="space-y-0.5">
                    <CardTitle className="text-xl font-bold">{title}</CardTitle>
                    <CardDescription>Optimized for engagement and viral reach.</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={onCopy} className="gap-2 rounded-xl">
                    <Copy className="w-4 h-4" /> Copy Content
                </Button>
            </CardHeader>
            <CardContent className="p-8 md:p-12 bg-grid-white/5">
                <div className="relative group">
                    <div className="absolute -inset-4 bg-gradient-to-r from-primary/10 to-blue-500/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative">
                        {component}
                    </div>
                </div>
            </CardContent>
            <CardFooter className="justify-between border-t border-border/40 bg-muted/10 px-6 py-4">
                <div className="text-xs text-muted-foreground font-medium">
                    {content ? `${content.split(' ').length} words` : '0 words'} • AI Analyzed • High Quality
                </div>
                <Button className="rounded-xl shadow-lg shadow-primary/20 hover:scale-105 transition-transform px-6">
                    Schedule Post
                </Button>
            </CardFooter>
        </Card>
    );
}
