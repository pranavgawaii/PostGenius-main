"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

export function CTASection() {
    return (
        <section className="py-24 bg-background">
            <div className="mx-auto max-w-4xl px-4 sm:px-8">
                <div className="relative overflow-hidden rounded-[2rem] border border-border bg-gradient-to-br from-background to-secondary p-12 text-center md:p-20">
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />

                    <ScrollReveal className="relative z-10">
                        <h2 className="mb-6 text-3xl font-bold text-foreground sm:text-4xl md:text-5xl">
                            Ready to boost your social media?
                        </h2>
                        <p className="mx-auto mb-10 max-w-lg text-lg text-muted-foreground">
                            Join thousands of creators and businesses using Post Genius to grow
                            their online presence.
                        </p>
                        <Button size="lg" className="rounded-xl px-10 py-6 text-lg" asChild>
                            <Link href="/sign-up">Start Your Free Trial</Link>
                        </Button>
                    </ScrollReveal>
                </div>
            </div>
        </section>
    );
}
