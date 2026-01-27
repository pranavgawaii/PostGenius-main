"use client";

import { useClerk } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Key, Smartphone } from "lucide-react";

export function SecuritySection() {
    const { openUserProfile } = useClerk();

    return (
        <div className="space-y-6">
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle>Login & Security</CardTitle>
                    <CardDescription>Manage your password and authentication methods.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">

                    <div className="flex items-center justify-between p-4 border rounded-xl bg-background/30">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                <Key className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="font-medium">Password</p>
                                <p className="text-xs text-muted-foreground">Last changed 3 months ago</p>
                            </div>
                        </div>
                        <Button variant="outline" onClick={() => openUserProfile()}>Update</Button>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-xl bg-background/30">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                                <Smartphone className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="font-medium">Two-Factor Authentication</p>
                                <p className="text-xs text-muted-foreground">Add an extra layer of security.</p>
                            </div>
                        </div>
                        {/* Deep link to Clerk Security if available, else general User Profile */}
                        <Button variant="outline" onClick={() => openUserProfile()}>Manage</Button>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-red-500/10 bg-red-500/5 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="text-red-500 flex items-center gap-2">
                        <Shield className="w-5 h-5" /> Danger Zone
                    </CardTitle>
                    <CardDescription>Irreversible actions for your account.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">Delete Account</p>
                            <p className="text-xs text-muted-foreground">Permanently remove your data and access.</p>
                        </div>
                        <Button variant="destructive">Delete Account</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
