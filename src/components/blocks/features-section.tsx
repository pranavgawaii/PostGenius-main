"use client";

import {
    Calendar,
    Sparkles,
    LineChart,
    Users,
    Globe,
    Zap,
} from "lucide-react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

export function FeaturesSection() {
    const features = [
        {
            icon: <Calendar className="h-8 w-8" />,
            title: "Smart Scheduling",
            description:
                "Schedule your posts for the best times to reach your audience. Drag and drop calendar makes planning easy.",
        },
        {
            icon: <Sparkles className="h-8 w-8" />,
            title: "AI Content Gen",
            description:
                "Generate engaging captions and hashtags instantly with our advanced AI. Never run out of ideas again.",
        },
        {
            icon: <LineChart className="h-8 w-8" />,
            title: "Analytics",
            description:
                "Track your performance with detailed analytics. Understand what works and optimize your strategy.",
        },
        {
            icon: <Users className="h-8 w-8" />,
            title: "Team Collaboration",
            description:
                "Invite your team members, assign roles, and approve content before it goes live.",
        },
        {
            icon: <Globe className="h-8 w-8" />,
            title: "Multi-Platform",
            description:
                "Post to Instagram, Twitter, LinkedIn, and Facebook from a single dashboard.",
        },
        {
            icon: <Zap className="h-8 w-8" />,
            title: "Automation",
            description:
                "Set up recurring posts and evergreen content to keep your feed active 24/7.",
        },
    ];

    return (
        <section id="features" className="relative py-24 sm:py-32 overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute inset-0 -z-10 h-full w-full bg-background [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)] opacity-5" />

            <div className="mx-auto max-w-container px-4 sm:px-8">
                <div className="mb-20 text-center">
                    <h2 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                        Everything you need to grow
                    </h2>
                    <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                        Powerful tools to help you manage your social media presence effectively.
                    </p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature, index) => (
                        <ScrollReveal
                            key={index}
                            delay={index * 0.1}
                            className="group relative overflow-hidden rounded-3xl border border-border/50 bg-background/50 p-8 backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:bg-accent/50 hover:shadow-2xl hover:shadow-primary/20 dark:bg-white/5 dark:border-white/10 dark:hover:bg-white/10"
                        >
                            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary ring-1 ring-border/50 transition-transform duration-300 group-hover:scale-110 group-hover:from-primary group-hover:to-primary/80 group-hover:text-primary-foreground shadow-lg shadow-primary/10 dark:ring-white/10">
                                {feature.icon}
                            </div>
                            <h3 className="mb-3 text-xl font-bold text-foreground transition-colors group-hover:text-primary">
                                {feature.title}
                            </h3>
                            <p className="text-base text-muted-foreground leading-relaxed group-hover:text-foreground/80 transition-colors">
                                {feature.description}
                            </p>
                        </ScrollReveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
