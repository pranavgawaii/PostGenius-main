"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Check, Zap } from "lucide-react";

export function PlanSection() {
    const [plan, setPlan] = useState("Free");
    const [credits, setCredits] = useState(0);

    useEffect(() => {
        async function fetchPlan() {
            try {
                const res = await fetch('/api/user/me');
                const data = await res.json();
                if (data.success) {
                    setPlan(data.data.plan_type || 'free');
                    setCredits(data.data.credits_remaining || 0);
                }
            } catch (e) {
                console.error(e);
            }
        }
        fetchPlan();
    }, []);

    const isPro = plan === 'pro' || plan === 'unlimited';

    return (
        <div className="space-y-6">
            {/* Current Plan Card */}
            <Card className="border-primary/20 bg-gradient-to-br from-card/80 to-primary/5 backdrop-blur-sm overflow-hidden relative">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Zap className="w-32 h-32" />
                </div>

                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-2xl capitalize">{plan} Plan</CardTitle>
                            <CardDescription>Your current subscription.</CardDescription>
                        </div>
                        <Badge variant={isPro ? "default" : "secondary"} className="text-sm px-3 py-1">
                            {isPro ? "Active" : "Standard"}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6 relative z-10">
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm font-medium">
                            <span>Credits Remaining</span>
                            <span>{isPro ? "Unlimited" : `${credits} / 5 Daily`}</span>
                        </div>
                        <Progress value={isPro ? 100 : (credits / 5) * 100} className="h-2" />
                        <p className="text-xs text-muted-foreground">
                            {isPro ? "You have unlimited access to all features." : "Credits reset daily at midnight."}
                        </p>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button variant="outline" className="w-full" asChild>
                        <a href="/pricing">{isPro ? "Manage Subscription" : "Upgrade Plan"}</a>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
