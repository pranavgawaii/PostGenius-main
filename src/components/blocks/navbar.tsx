"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { useAuth } from "@clerk/nextjs";

export function Navbar() {
    const { isSignedIn } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navLinks = [
        { href: "#features", label: "Features" },
        { href: "#pricing", label: "Pricing" },
        { href: "#faq", label: "FAQ" },
    ];

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="mx-auto flex h-16 max-w-container items-center justify-between px-4 sm:px-8">
                <div className="flex items-center gap-2">
                    <Link href={isSignedIn ? "/dashboard" : "/"} className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                            <Icons.logo className="h-5 w-5" />
                        </div>
                        <span className="text-lg font-bold">Post Genius</span>
                    </Link>
                </div>

                {/* Desktop Nav */}
                <div className="hidden md:flex md:items-center md:gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-base font-medium text-muted-foreground transition-colors hover:text-foreground"
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                <div className="flex items-center gap-4">
                    <Link
                        href="/sign-in"
                        className="hidden text-base font-medium text-muted-foreground transition-colors hover:text-foreground sm:block"
                    >
                        Sign In
                    </Link>
                    <Button size="sm" asChild className="hidden sm:flex">
                        <Link href="/sign-up">Get Started</Link>
                    </Button>
                    <ModeToggle />

                    {/* Mobile Menu Button */}
                    <button
                        className="flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background md:hidden"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? (
                            <X className="h-5 w-5" />
                        ) : (
                            <Menu className="h-5 w-5" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Nav Overlay */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="border-b border-border/40 bg-background md:hidden overflow-hidden"
                    >
                        <div className="flex flex-col gap-4 p-6">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="text-lg font-medium text-muted-foreground transition-colors hover:text-foreground"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <div className="mt-4 flex flex-col gap-4 pt-4 border-t border-border/40">
                                <Link
                                    href="/sign-in"
                                    className="text-lg font-medium text-muted-foreground transition-colors hover:text-foreground"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Sign In
                                </Link>
                                <Button size="lg" asChild className="w-full">
                                    <Link href="/sign-up" onClick={() => setIsMenuOpen(false)}>
                                        Get Started
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
