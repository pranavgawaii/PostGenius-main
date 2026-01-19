"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { ModeToggle } from "@/components/ui/mode-toggle";

export function Navbar() {
    return (
        <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="mx-auto flex h-16 max-w-container items-center justify-between px-4 sm:px-8">
                <div className="flex items-center gap-2">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                            <Icons.logo className="h-5 w-5" />
                        </div>
                        <span className="text-lg font-bold">Post Genius</span>
                    </Link>
                </div>

                {/* Desktop Nav */}
                <div className="hidden md:flex md:items-center md:gap-6">
                    <Link
                        href="#features"
                        className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                    >
                        Features
                    </Link>
                    <Link
                        href="#pricing"
                        className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                    >
                        Pricing
                    </Link>
                    <Link
                        href="#"
                        className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                    >
                        Integrations
                    </Link>
                    <Link
                        href="#"
                        className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                    >
                        Changelog
                    </Link>
                </div>

                <div className="flex items-center gap-4">
                    <Link
                        href="/sign-in"
                        className="hidden text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:block"
                    >
                        Sign In
                    </Link>
                    <Button size="sm" asChild>
                        <Link href="/sign-up">Get Started</Link>
                    </Button>
                    <ModeToggle />
                </div>
            </div>
        </nav>
    );
}
