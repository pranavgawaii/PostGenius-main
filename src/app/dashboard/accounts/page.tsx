"use client";

import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, Twitter, Linkedin, Facebook, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AccountsPage() {
    const platforms = [
        { name: "LinkedIn", icon: Linkedin, color: "text-blue-600", bg: "bg-blue-600/10" },
        { name: "Twitter / X", icon: Twitter, color: "text-sky-500", bg: "bg-sky-500/10" },
        { name: "Facebook", icon: Facebook, color: "text-blue-700", bg: "bg-blue-700/10" },
    ];

    return (
        <div className="space-y-8 pb-20">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Connected Accounts</h1>
                    <p className="text-muted-foreground">Manage your social media connections and API keys.</p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {platforms.map((platform) => (
                    <Card key={platform.name} className="border-primary/10 bg-background/50 backdrop-blur-sm overflow-hidden group hover:border-primary/30 transition-all">
                        <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                            <div className={`w-10 h-10 rounded-lg ${platform.bg} flex items-center justify-center`}>
                                <platform.icon className={`w-6 h-6 ${platform.color}`} />
                            </div>
                            <div className="flex-1">
                                <CardTitle className="text-lg">{platform.name}</CardTitle>
                                <CardDescription>Not connected</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                                Connect {platform.name}
                            </Button>
                        </CardContent>
                    </Card>
                ))}

                <Card className="border-dashed border-2 flex items-center justify-center p-6 bg-muted/20 cursor-pointer hover:bg-muted/30 transition-all">
                    <div className="text-center space-y-2">
                        <Plus className="w-8 h-8 mx-auto text-muted-foreground" />
                        <p className="text-sm font-medium text-muted-foreground">Add New Platform</p>
                    </div>
                </Card>
            </div>

            <ScrollReveal>
                <Card className="border-primary/10 bg-background/50 backdrop-blur-sm mt-8">
                    <CardHeader>
                        <CardTitle>Security & API Access</CardTitle>
                        <CardDescription>Your data is encrypted and secure.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[200px] flex items-center justify-center border-t border-border/50 text-muted-foreground">
                        No active API secrets found.
                    </CardContent>
                </Card>
            </ScrollReveal>
        </div>
    );
}
