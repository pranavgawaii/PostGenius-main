"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export function NotificationsSection() {
    const [emailMarketing, setEmailMarketing] = useState(false);
    const [securityAlerts, setSecurityAlerts] = useState(true);
    const [weeklyDigest, setWeeklyDigest] = useState(true);

    return (
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Manage how you receive updates and alerts.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">

                <div className="flex items-center justify-between space-x-2 p-4 border rounded-xl bg-background/30">
                    <div className="space-y-1">
                        <Label htmlFor="marketing" className="text-base">Marketing Emails</Label>
                        <p className="text-xs text-muted-foreground">Receive updates about new features and promotions.</p>
                    </div>
                    <Switch id="marketing" checked={emailMarketing} onCheckedChange={setEmailMarketing} />
                </div>

                <div className="flex items-center justify-between space-x-2 p-4 border rounded-xl bg-background/30">
                    <div className="space-y-1">
                        <Label htmlFor="security" className="text-base">Security Alerts</Label>
                        <p className="text-xs text-muted-foreground">Get notified about suspicious logins and password changes.</p>
                    </div>
                    <Switch id="security" checked={securityAlerts} onCheckedChange={setSecurityAlerts} disabled />
                </div>

                <div className="flex items-center justify-between space-x-2 p-4 border rounded-xl bg-background/30">
                    <div className="space-y-1">
                        <Label htmlFor="digest" className="text-base">Weekly Digest</Label>
                        <p className="text-xs text-muted-foreground">A summary of your generation stats sent every Monday.</p>
                    </div>
                    <Switch id="digest" checked={weeklyDigest} onCheckedChange={setWeeklyDigest} />
                </div>

            </CardContent>
        </Card>
    );
}
