"use client";

import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar as CalendarIcon, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SchedulePage() {
    return (
        <div className="space-y-8 pb-20">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Schedule</h1>
                    <p className="text-muted-foreground">Manage your content calendar and upcoming posts.</p>
                </div>
                <Button className="gap-2">
                    <Plus className="h-4 w-4" /> Schedule Post
                </Button>
            </div>

            <ScrollReveal>
                <Card className="border-primary/10 bg-background/50 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle>Wait, everything looks clear!</CardTitle>
                        <CardDescription>No posts scheduled for this week.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[500px] flex items-center justify-center border-t border-border/50">
                        <div className="text-center space-y-4">
                            <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                                <CalendarIcon className="w-8 h-8 text-primary" />
                            </div>
                            <div className="space-y-2">
                                <p className="text-lg font-medium">Empty Calendar</p>
                                <p className="text-muted-foreground max-w-sm mx-auto">
                                    Your schedule is currently empty. Generate some content and schedule it to see it here!
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </ScrollReveal>
        </div>
    );
}
