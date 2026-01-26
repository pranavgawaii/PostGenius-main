"use client";

import {
    Sparkles,
    Globe,
    Zap,
    BookOpen,
    Hash,
    Shield,
} from "lucide-react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

export function FeaturesSection() {
    const features = [
        {
            icon: <Sparkles className="h-6 w-6" />,
            title: "AI Caption Generation",
            description:
                "Transform any URL into engaging, platform-specific captions instantly. Just paste a link and watch our AI create perfect captions.",
        },
        {
            icon: <Globe className="h-6 w-6" />,
            title: "Multi-Platform Support",
            description:
                "Generate optimized captions for Instagram, LinkedIn, Twitter, and Facebook simultaneously. Tailored to each platform's limits.",
        },
        {
            icon: <Zap className="h-6 w-6" />,
            title: "Lightning Fast",
            description:
                "Get your captions in under 5 seconds. No waiting, no complexity. Paste your URL and generate content instantly.",
        },
        {
            icon: <BookOpen className="h-6 w-6" />,
            title: "Content Library",
            description:
                "Save and organize all your generated captions in one centralized library. Access your history and reuse successful content.",
        },
        {
            icon: <Hash className="h-6 w-6" />,
            title: "Smart Hashtags",
            description:
                "Get relevant, trending hashtags automatically generated with every caption. Boost your reach and discoverability.",
            comingSoon: true,
        },
        {
            icon: <Shield className="h-6 w-6" />,
            title: "Generous Free Tier",
            description:
                "Start with free daily generations. Perfect for students, creators, and small businesses. Upgrade anytime for more.",
        },
    ];

    return (
        <section id="features" className="relative py-24 sm:py-32 overflow-hidden bg-background">
            {/* Elegant Background Glow */}
            <div className="absolute top-0 right-0 -z-10 h-[500px] w-[500px] bg-primary/20 blur-[120px] rounded-full opacity-20" />
            <div className="absolute bottom-0 left-0 -z-10 h-[500px] w-[500px] bg-blue-500/10 blur-[120px] rounded-full opacity-20" />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="mb-16 md:mb-24 text-center max-w-3xl mx-auto">
                    <h2 className="mb-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                        Everything You Need to Create <span className="text-primary">Engaging Social Content</span>
                    </h2>
                    <p className="mx-auto text-lg text-muted-foreground leading-relaxed">
                        Powerful AI tools designed to help you generate platform-optimized captions instantly, without the complexity.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature, index) => (
                        <ScrollReveal
                            key={index}
                            delay={index * 0.05}
                            className="group relative h-full overflow-hidden rounded-2xl border border-border/40 bg-card p-8 transition-all duration-300 hover:border-primary/50 hover:bg-accent/5 hover:shadow-2xl hover:shadow-primary/5"
                        >
                            {/* Hover Gradient Effect */}
                            <div className="absolute inset-0 z-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                            <div className="relative z-10">
                                {/* Icon */}
                                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20 transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground group-hover:ring-offset-2">
                                    {feature.icon}
                                </div>

                                {/* Content */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-xl font-bold text-foreground">
                                            {feature.title}
                                        </h3>
                                        {feature.comingSoon && (
                                            <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20">
                                                Soon
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-base text-muted-foreground leading-relaxed group-hover:text-foreground/80 transition-colors">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        </ScrollReveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
