"use client";

import { Link as LinkIcon, Sparkles, Copy } from "lucide-react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

export function HowItWorksSection() {
    const steps = [
        {
            number: "1",
            icon: <LinkIcon className="h-5 w-5" />,
            title: "Paste URL",
            description: "Simply paste the link to your blog, article, or video content.",
        },
        {
            number: "2",
            icon: <Sparkles className="h-5 w-5" />,
            title: "AI Generates",
            description: "Our engine analyzes text and creates optimized captions instantly.",
        },
        {
            number: "3",
            icon: <Copy className="h-5 w-5" />,
            title: "Copy & Post",
            description: "Select your favorite version and share it to your socials.",
        },
    ];

    return (
        <section id="how-it-works" className="relative py-24 sm:py-32 overflow-hidden bg-muted/30">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="mb-20 text-center max-w-3xl mx-auto">
                    <h2 className="mb-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                        How It Works
                    </h2>
                    <p className="mx-auto text-lg text-muted-foreground leading-relaxed">
                        Generate engaging social media captions in 3 simple steps
                    </p>
                </div>

                {/* Steps Container */}
                <div className="relative mt-12 lg:mt-20">
                    {/* Connecting Line (Desktop) */}
                    <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 px-12 hidden lg:block">
                        <div className="w-full h-px bg-border border-t border-dashed border-muted-foreground/30 relative">
                            {/* Animated Pulse on Line */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary to-transparent opacity-20 w-1/2 animate-[shimmer_2s_infinite_linear] h-full" />
                        </div>
                    </div>

                    <div className="grid gap-12 lg:grid-cols-3 lg:gap-8 relative z-10">
                        {steps.map((step, index) => (
                            <ScrollReveal
                                key={index}
                                delay={index * 0.2}
                                className="relative flex flex-col items-center text-center group"
                            >
                                {/* Step Circle */}
                                <div className="relative mb-8 bg-background rounded-full p-2 ring-1 ring-border shadow-sm group-hover:ring-primary/50 group-hover:shadow-primary/20 transition-all duration-300">
                                    <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-secondary/50 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 text-foreground">
                                        {step.icon}

                                        {/* Number Badge */}
                                        <div className="absolute -top-1 -right-1 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shadow-lg ring-4 ring-background">
                                            {step.number}
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="space-y-3 px-4 max-w-xs mx-auto">
                                    <h3 className="text-xl font-bold text-foreground">
                                        {step.title}
                                    </h3>
                                    <p className="text-base text-muted-foreground leading-relaxed">
                                        {step.description}
                                    </p>
                                </div>
                            </ScrollReveal>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
