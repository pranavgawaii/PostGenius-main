"use client";

import { UserButton } from "@clerk/nextjs";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";

export function DashboardHeader() {
    return (
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-background/50 px-6 backdrop-blur-xl">
            <div className="flex items-center gap-4">
                {/* Mobile menu trigger could go here */}
                <h1 className="text-lg font-semibold md:hidden">My Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
                    <Bell className="h-5 w-5" />
                    <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-primary" />
                </Button>
                <div className="h-6 w-px bg-border" />
                <ModeToggle />
                <UserButton afterSignOutUrl="/" />
            </div>
        </header>
    );
}
