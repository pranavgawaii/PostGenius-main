"use client";

import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart3, TrendingUp, Users, MousePointer2 } from "lucide-react";

export default function AnalyticsPage() {
    return (
        <div className="space-y-8 pb-20">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
                <p className="text-muted-foreground">Track your performance across all platforms.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-primary/5 border-primary/20">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Impressions</CardTitle>
                        <TrendingUp className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">0</div>
                        <p className="text-xs text-muted-foreground">Start posting to see data</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
                        <MousePointer2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">0%</div>
                        <p className="text-xs text-muted-foreground">No data available</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Followers Gained</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">0</div>
                        <p className="text-xs text-muted-foreground">No growth yet</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Post Efficiency</CardTitle>
                        <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">--</div>
                        <p className="text-xs text-muted-foreground">Insufficient data</p>
                    </CardContent>
                </Card>
            </div>

            <ScrollReveal>
                <Card className="border-primary/10 bg-background/50 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle>Performance Overview</CardTitle>
                        <CardDescription>Your reach and engagement over time.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[400px] flex items-center justify-center border-t border-border/50">
                        <div className="text-center space-y-4">
                            <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                                <BarChart3 className="w-8 h-8 text-primary" />
                            </div>
                            <p className="text-muted-foreground">Sync your accounts to see live analytics!</p>
                        </div>
                    </CardContent>
                </Card>
            </ScrollReveal>
        </div>
    );
}
