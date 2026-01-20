"use client";

import Link from "next/link";
import { Icons } from "@/components/ui/icons";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

export function Footer() {
    return (
        <footer className="border-t border-border bg-secondary/30 pt-16 pb-10">
            <div className="mx-auto max-w-container px-4 sm:px-8">
                <ScrollReveal className="grid gap-12 sm:grid-cols-2 md:grid-cols-4 lg:gap-16">
                    {/* Brand Column */}
                    <div className="flex flex-col gap-6">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                <Icons.logo className="h-5 w-5" />
                            </div>
                            <span className="text-lg font-bold">Post Genius</span>
                        </Link>
                        <p className="text-sm text-muted-foreground">
                            Making social media management simple and effective for everyone.
                        </p>
                        <div className="flex gap-4">
                            <Link
                                href="#"
                                className="text-muted-foreground transition-colors hover:text-primary"
                            >
                                <Icons.twitter className="h-5 w-5" />
                                <span className="sr-only">Twitter</span>
                            </Link>
                            <Link
                                href="#"
                                className="text-muted-foreground transition-colors hover:text-primary"
                            >
                                <Icons.gitHub className="h-5 w-5" />
                                <span className="sr-only">GitHub</span>
                            </Link>
                        </div>
                    </div>

                    {/* Product Column */}
                    <div>
                        <h4 className="mb-6 text-sm font-semibold text-foreground uppercase tracking-wider">
                            Product
                        </h4>
                        <ul className="space-y-4 text-sm text-muted-foreground">
                            <li>
                                <Link href="#features" className="hover:text-primary">
                                    Features
                                </Link>
                            </li>
                            <li>
                                <Link href="#pricing" className="hover:text-primary">
                                    Pricing
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-primary">
                                    Integrations
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-primary">
                                    Changelog
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Resources Column */}
                    <div>
                        <h4 className="mb-6 text-sm font-semibold text-foreground uppercase tracking-wider">
                            Resources
                        </h4>
                        <ul className="space-y-4 text-sm text-muted-foreground">
                            <li>
                                <Link href="#" className="hover:text-primary">
                                    Blog
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-primary">
                                    Community
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-primary">
                                    Help Center
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-primary">
                                    API Docs
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Company Column */}
                    <div>
                        <h4 className="mb-6 text-sm font-semibold text-foreground uppercase tracking-wider">
                            Company
                        </h4>
                        <ul className="space-y-4 text-sm text-muted-foreground">
                            <li>
                                <Link href="#" className="hover:text-primary">
                                    About
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-primary">
                                    Careers
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-primary">
                                    Legal
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-primary">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>
                </ScrollReveal>

                <div className="mt-16 border-t border-border pt-8 text-center text-sm text-muted-foreground">
                    <p>&copy; 2025 Post Genius. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
