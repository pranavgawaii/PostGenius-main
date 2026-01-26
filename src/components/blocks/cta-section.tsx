"use client";

import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Glow } from "@/components/ui/glow";

export function CTASection() {
    return (
        <section className="relative overflow-hidden py-24 sm:py-32">
            {/* Background Gradients */}
            <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background to-background/50" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] opacity-50" />

            <div className="mx-auto max-w-container px-4 text-center sm:px-8">
                <div className="relative z-10 flex flex-col items-center gap-8">
                    <Glow variant="center" className="opacity-40" />

                    <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl max-w-3xl mx-auto">
                        Ready to Stop Writing <span className="text-primary">Captions From Scratch?</span>
                    </h2>

                    <p className="max-w-xl text-lg text-muted-foreground sm:text-xl leading-relaxed">
                        Join thousands of creators and businesses who save hours every week with AI-powered caption generation.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 w-full justify-center pt-4">
                        <Button size="lg" className="h-14 px-8 text-lg rounded-full shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all hover:scale-105" asChild>
                            <Link href="/sign-up" className="flex items-center gap-2">
                                <Sparkles className="h-5 w-5" />
                                Start Generating Free
                            </Link>
                        </Button>
                        <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full" asChild>
                            <Link href="/#features" className="flex items-center gap-2">
                                See Examples <ArrowRight className="h-5 w-5" />
                            </Link>
                        </Button>
                    </div>

                    {/* Trust Badges */}
                    <div className="mt-8 pt-8 border-t border-border/50 flex flex-wrap justify-center gap-6 sm:gap-12 text-sm sm:text-base text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                            <span>No credit card required</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                            <span>5 free captions daily</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                            <span>Cancel anytime</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
