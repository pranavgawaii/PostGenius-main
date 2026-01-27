"use client";

import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";

export function ProfileSection() {
    const { user } = useUser();

    return (
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal details and public profile.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Avatar */}
                <div className="flex items-center gap-6">
                    <Avatar className="h-20 w-20 border-2 border-primary/20">
                        <AvatarImage src={user?.imageUrl} />
                        <AvatarFallback className="text-lg">{user?.firstName?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                        <Button variant="outline" size="sm" className="h-8">Change Avatar</Button>
                        <p className="text-[10px] text-muted-foreground">JPG, GIF or PNG. 1MB max.</p>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="grid gap-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" defaultValue={user?.firstName || ""} className="bg-background/50" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" defaultValue={user?.lastName || ""} className="bg-background/50" />
                    </div>
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" value={user?.primaryEmailAddress?.emailAddress || ""} disabled className="bg-muted/50" />
                    <p className="text-[10px] text-muted-foreground">Contact support to change your email.</p>
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea id="bio" placeholder="Tell us about yourself..." className="bg-background/50 min-h-[100px]" />
                </div>

                <div className="flex justify-end pt-4">
                    <Button>Save Changes</Button>
                </div>
            </CardContent>
        </Card>
    );
}
