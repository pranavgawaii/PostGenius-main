"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Icons } from "@/components/ui/icons";
import { LayoutDashboard, Calendar, BarChart3, Settings, BookOpen, HelpCircle, ShieldAlert, Zap, Sparkles, ArrowRight, Link as LinkIcon, Menu } from "lucide-react";
import { WorkflowSelector } from "@/components/dashboard/workflow-selector";
import { StatsCounter } from "@/components/dashboard/stats-counter";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";

// --- Demo Components to avoid Auth/API calls ---

function DemoSidebar() {
    return (
        <div className="hidden md:flex flex-col w-64 border-r border-border bg-card/30 backdrop-blur-xl h-full absolute left-0 top-0">
            <div className="space-y-4 py-4 flex-1">
                <div className="px-3 py-2">
                    <div className="flex items-center gap-2 px-4 mb-8">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                            <Icons.logo className="h-5 w-5" />
                        </div>
                        <span className="text-lg font-bold">Post Genius</span>
                    </div>
                    <div className="space-y-1">
                        <Button variant="secondary" className="w-full justify-between bg-secondary/80 text-primary font-semibold shadow-sm">
                            <div className="flex items-center gap-3">
                                <LayoutDashboard className="h-4 w-4" />
                                Dashboard
                            </div>
                        </Button>
                        <Button variant="ghost" className="w-full justify-start">
                            <div className="flex items-center gap-3">
                                <BookOpen className="h-4 w-4" />
                                Library
                            </div>
                        </Button>
                        <Button variant="ghost" className="w-full justify-start">
                            <div className="flex items-center gap-3">
                                <Calendar className="h-4 w-4" />
                                Schedule
                            </div>
                        </Button>
                        <Button variant="ghost" className="w-full justify-start opacity-60">
                            <div className="flex items-center gap-3">
                                <BarChart3 className="h-4 w-4" />
                                Analytics
                            </div>
                            <Badge variant="outline" className="ml-auto text-[10px] px-1.5 py-0 h-5 border-primary/20 text-muted-foreground bg-primary/5">Soon</Badge>
                        </Button>
                        <Button variant="ghost" className="w-full justify-start">
                            <div className="flex items-center gap-3">
                                <Settings className="h-4 w-4" />
                                Settings
                            </div>
                        </Button>
                    </div>
                </div>
            </div>
            <div className="p-4 mt-auto border-t border-border/40">
                <div className="flex items-center gap-3 px-2 py-2 rounded-lg bg-white/5 disabled opacity-80">
                    <Avatar className="h-9 w-9 border border-primary/20">
                        <AvatarFallback>PG</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col overflow-hidden">
                        <span className="text-sm font-medium">Pranav Gawai</span>
                        <span className="text-xs text-muted-foreground">Pro Plan</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

function DemoRepurposeInput() {
    return (
        <div className="w-full relative group">
            <div className="relative">
                <div className="relative flex items-center">
                    <div className="absolute left-6 text-muted-foreground">
                        <LinkIcon className="h-5 w-5" />
                    </div>
                    <Input
                        type="url"
                        placeholder="Paste your article or video link here..."
                        className="h-14 w-full rounded-2xl border-2 border-border bg-background/50 pl-12 pr-24 text-base shadow-sm hover:border-primary/50 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all pointer-events-none"
                        readOnly
                    />
                    <div className="absolute right-1.5">
                        <Button size="icon" className="h-11 w-14 rounded-xl bg-primary text-primary-foreground shadow-md">
                            <ArrowRight className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- Main Preview Component ---

export function DashboardPreview() {
    return (
        <div className="relative w-full h-full bg-background rounded-xl overflow-hidden border border-border shadow-2xl">
            {/* Sidebar */}
            <DemoSidebar />

            {/* Main Content Area */}
            <div className="md:ml-64 h-full flex flex-col relative">

                {/* Header */}
                <header className="h-16 border-b border-border/40 bg-background/50 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-10">
                    <div className="flex items-center gap-2 md:hidden">
                        <Button variant="ghost" size="icon"><Menu className="h-5 w-5" /></Button>
                    </div>
                    <div className="flex items-center gap-2 ml-auto">
                        <Badge variant="outline" className="h-7 px-3 gap-1.5 bg-background/50 hover:bg-background/80 transition-colors cursor-default border-primary/20">
                            <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                            <span className="font-mono font-bold text-foreground">500</span>
                        </Badge>
                    </div>
                </header>

                <main className="flex-1 p-6 md:p-8 overflow-hidden relative">
                    {/* Background Grid */}
                    <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-5 pointer-events-none" />

                    <div className="max-w-5xl mx-auto space-y-8">
                        {/* Stats */}
                        <div className="transform scale-[0.95] origin-top-left opacity-90">
                            <StatsCounter />
                        </div>

                        {/* Input Area */}
                        <div className="relative rounded-[2rem] bg-card/50 border border-white/5 p-8 md:p-10 text-center space-y-6 overflow-hidden">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 via-purple-500/20 to-primary/20 rounded-[2rem] blur-xl opacity-30" />

                            <div className="relative z-10 space-y-4">
                                <div className="space-y-3">
                                    <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-secondary/50 border border-secondary text-[10px] font-medium text-secondary-foreground">
                                        <Sparkles className="w-2.5 h-2.5" />
                                        <span>AI Repurposing Engine v2.0</span>
                                    </div>
                                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
                                        Social Media Posts
                                    </h2>
                                    <p className="text-sm text-muted-foreground max-w-md mx-auto">
                                        Turn blogs and videos into viral threads and captions.
                                    </p>
                                </div>

                                <div className="max-w-xl mx-auto">
                                    <DemoRepurposeInput />
                                </div>
                            </div>
                        </div>

                        {/* Workflow Selector (Visual Only) */}
                        <div className="pointer-events-none opacity-80 filter blur-[0.5px]">
                            <WorkflowSelector selectedWorkflow={null} onSelect={() => { }} />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
