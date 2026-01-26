"use client";

import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Settings, User, Bell, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SettingsPage() {
    return (
        <div className="space-y-8 pb-20">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground">Preferences and account management.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-[200px_1fr]">
                <div className="space-y-2">
                    {[
                        { name: "Profile", icon: User },
                        { name: "Notifications", icon: Bell },
                        { name: "Security", icon: Shield },
                        { name: "Plan", icon: Zap },
                    ].map((item) => (
                        <div
                            key={item.name}
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${item.name === "Profile" ? "bg-primary text-primary-foreground font-medium" : "hover:bg-muted"
                                }`}
                        >
                            <item.icon className="w-4 h-4" />
                            <span>{item.name}</span>
                        </div>
                    ))}
                </div>

                <div className="space-y-6">
                    <ScrollReveal>
                        <Card className="border-primary/10 bg-background/50 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle>Profile Information</CardTitle>
                                <CardDescription>Update your personal details.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4 border-t border-border/50 pt-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Display Name</Label>
                                    <Input id="name" placeholder="Post Genius User" className="bg-background/50" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input id="email" type="email" placeholder="user@example.com" className="bg-background/50" />
                                </div>
                                <Button className="mt-2">Save Changes</Button>
                            </CardContent>
                        </Card>
                    </ScrollReveal>

                    <ScrollReveal delay={100}>
                        <Card className="border-red-500/10 bg-red-500/5 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-red-500">Danger Zone</CardTitle>
                                <CardDescription>Irreversible actions for your account.</CardDescription>
                            </CardHeader>
                            <CardContent className="border-t border-red-500/20 pt-6">
                                <Button variant="destructive">Delete Account</Button>
                            </CardContent>
                        </Card>
                    </ScrollReveal>
                </div>
            </div>
        </div>
    );
}
