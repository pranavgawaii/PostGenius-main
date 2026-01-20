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
            icon: <Calendar className="h-6 w-6" />,
            title: "Smart Scheduling",
            description:
                "Schedule your posts for the best times to reach your audience. Drag and drop calendar makes planning easy.",
        },
        {
            icon: <Sparkles className="h-6 w-6" />,
            title: "AI Content Gen",
            description:
                "Generate engaging captions and hashtags instantly with our advanced AI. Never run out of ideas again.",
        },
        {
            icon: <LineChart className="h-6 w-6" />,
            title: "Analytics",
            description:
                "Track your performance with detailed analytics. Understand what works and optimize your strategy.",
        },
        {
            icon: <Users className="h-6 w-6" />,
            title: "Team Collaboration",
            description:
                "Invite your team members, assign roles, and approve content before it goes live.",
        },
        {
            icon: <Globe className="h-6 w-6" />,
            title: "Multi-Platform",
            description:
                "Post to Instagram, Twitter, LinkedIn, and Facebook from a single dashboard.",
        },
        {
            icon: <Zap className="h-6 w-6" />,
            title: "Automation",
            description:
                "Set up recurring posts and evergreen content to keep your feed active 24/7.",
        },
    ];

    return (
        <section id="features" className="bg-secondary/50 py-24 transition-colors">
            <div className="mx-auto max-w-container px-4 sm:px-8">
                <div className="mb-20 text-center">
                    <h2 className="mb-5 text-4xl font-bold text-foreground sm:text-5xl">
                        Everything you need to grow
                    </h2>
                    <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                        Powerful tools to help you manage your social media presence
                        effectively.
                    </p>
                </div>

                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature, index) => (
                        <ScrollReveal
                            key={index}
                            delay={index * 0.1}
                            className="group relative overflow-hidden rounded-3xl border border-border bg-background p-10 transition-all hover:-translate-y-2 hover:border-primary/50 hover:shadow-2xl"
                        >
                            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                                {feature.icon}
                            </div>
                            <h3 className="mb-4 text-2xl font-semibold text-foreground">
                                {feature.title}
                            </h3>
                            <p className="text-base text-muted-foreground leading-relaxed">
                                {feature.description}
                            </p>
                        </ScrollReveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
