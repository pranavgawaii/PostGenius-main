"use client";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

export function FAQSection() {
    const faqs = [
        {
            question: "How does postGENIUS work?",
            answer: "Simply paste the URL of any blog post, article, or video into postGENIUS. Our AI analyzes the content and generates 4 unique captions optimized for Instagram, LinkedIn, Twitter, and Facebook. The entire process takes less than 5 seconds!",
        },
        {
            question: "What platforms are supported?",
            answer: "postGENIUS generates captions for Instagram, LinkedIn, Twitter, and Facebook. Each caption is optimized for the platform's character limits and audience expectations.",
        },
        {
            question: "Is there a free plan?",
            answer: "Yes! Our free plan includes 5 caption generations per day, access to all 4 platforms, content library, and hashtag suggestions. No credit card required to get started.",
        },
        {
            question: "How accurate are the AI-generated captions?",
            answer: "Our AI uses advanced models (Gemini) to analyze your content and generate contextually relevant, engaging captions. While the captions are highly accurate, we recommend reviewing them before posting to ensure they match your brand voice.",
        },
        {
            question: "Can I edit the generated captions?",
            answer: "Absolutely! All generated captions can be copied and edited to fit your specific needs. Think of them as a strong starting point that saves you hours of writing time.",
        },
        {
            question: "What types of content work best with postGENIUS?",
            answer: "postGENIUS works with any public URL including blog posts, news articles, YouTube videos, product pages, and web content. The more detailed the content, the better the captions!",
        },
        {
            question: "Do you offer student discounts?",
            answer: "Yes! Students with a valid .edu email address get 50% off the Pro plan. Contact us after signing up to claim your discount.",
        },
        {
            question: "Can I cancel anytime?",
            answer: "Yes, you can upgrade, downgrade, or cancel your plan at any time. No long-term contracts or commitments required.",
        },
    ];

    return (
        <section id="faq" className="py-24 sm:py-32 bg-background relative overflow-hidden">
            {/* Background Texture */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-20" />

            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                        Frequently Asked Questions
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Everything you need to know about postGENIUS
                    </p>
                </div>

                <div className="grid gap-4">
                    {faqs.map((faq, index) => (
                        <ScrollReveal key={index} delay={index * 0.05}>
                            <Accordion type="single" collapsible className="bg-card border border-border rounded-xl px-6">
                                <AccordionItem value={`item-${index}`} className="border-none">
                                    <AccordionTrigger className="text-left text-base sm:text-lg font-medium text-foreground hover:text-primary py-6">
                                        {faq.question}
                                    </AccordionTrigger>
                                    <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-6">
                                        {faq.answer}
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </ScrollReveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
