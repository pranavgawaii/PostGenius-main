"use client";

import { Star } from "lucide-react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function TestimonialsSection() {
    const testimonials = [
        {
            quote: "Saved me hours every week! I generated 20 LinkedIn posts in just 10 minutes. The captions are professional and engaging. Perfect for busy content creators.",
            rating: 5,
            name: "Rahul Sharma",
            role: "Content Creator",
            initials: "RS",
            gradient: "from-blue-500/20 to-purple-500/20",
        },
        {
            quote: "As a college student managing my startup's social media, PostGenius has been a lifesaver. The AI-generated captions are spot-on and save me so much time!",
            rating: 5,
            name: "Priya Mehta",
            role: "Student Entrepreneur",
            initials: "PM",
            gradient: "from-emerald-500/20 to-teal-500/20",
        },
        {
            quote: "The free tier is incredibly generous! I use it daily for my Instagram and LinkedIn posts. The hashtag suggestions are a game-changer. Highly recommend!",
            rating: 5,
            name: "Arjun Patel",
            role: "Social Media Manager",
            initials: "AP",
            gradient: "from-orange-500/20 to-amber-500/20",
        },
    ];

    return (
        <section id="testimonials" className="py-16 sm:py-32 bg-background relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-7xl pointer-events-none">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-50" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl opacity-50" />
            </div>

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="mx-auto max-w-2xl text-center mb-12 md:mb-16">
                    <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                        Loved by Students & Creators
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground px-4 sm:px-0">
                        See what users are saying about PostGenius
                    </p>
                </div>

                <div className="grid gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {testimonials.map((testimonial, index) => (
                        <ScrollReveal
                            key={index}
                            delay={index * 0.1}
                            className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col"
                        >
                            {/* Stars */}
                            <div className="flex gap-1 mb-6">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className="h-5 w-5 fill-yellow-400 text-yellow-400"
                                    />
                                ))}
                            </div>

                            {/* Quote */}
                            <blockquote className="flex-1 text-base text-muted-foreground leading-relaxed italic mb-8">
                                "{testimonial.quote}"
                            </blockquote>

                            {/* Author */}
                            <div className="flex items-center gap-4 mt-auto">
                                <Avatar className="h-12 w-12 border-2 border-background shadow-sm">
                                    <AvatarFallback className={`bg-gradient-to-br ${testimonial.gradient} text-foreground font-semibold`}>
                                        {testimonial.initials}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <div className="font-semibold text-foreground">
                                        {testimonial.name}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        {testimonial.role}
                                    </div>
                                </div>
                            </div>
                        </ScrollReveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
