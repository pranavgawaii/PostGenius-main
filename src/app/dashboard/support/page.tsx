"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    MessageSquare,
    Mail,
    FileText,
    ChevronDown,
    ExternalLink,
    Sparkles,
    Zap,
    LifeBuoy
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

export default function SupportPage() {
    const [searchQuery, setSearchQuery] = useState("");

    const faqs = [
        {
            question: "How do credits work?",
            answer: "Credits are used to generate content. Each workflow consumes a specific number of credits (usually 1-5). Your credits reset daily at midnight IST for free plans. Unlimited plans have no daily cap."
        },
        {
            question: "Can I cancel my subscription anytime?",
            answer: "Yes, you can cancel your subscription at any time from the Settings page. Your premium benefits will continue until the end of your current billing period."
        },
        {
            question: "How do I repurpose a YouTube video?",
            answer: "Simply navigate to the dashboard, select the 'Social Media Post' or 'LinkedIn' workflow, and paste your YouTube video URL. Our AI will transcribe and repurpose it into engaging text content."
        },
        {
            question: "What platforms are supported?",
            answer: "Currently, we optimize content for LinkedIn, Twitter (X), and Instagram. We also support generating GitHub READMEs, Study Notes, and Bullet Point summaries."
        },
        {
            question: "My generation failed, what do I do?",
            answer: "If a generation fails, your credits are usually not deducted. Please check your URL availability and try again. A 'Usage' error means you have hit your daily limit."
        }
    ];

    const filteredFaqs = faqs.filter(faq =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8 pb-20 max-w-5xl mx-auto px-4 pt-12">

            {/* Header */}
            <div className="text-center space-y-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-medium text-primary backdrop-blur-sm"
                >
                    <LifeBuoy className="w-3 h-3" />
                    Help Center
                </motion.div>

                <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tighter bg-gradient-to-b from-foreground to-foreground/60 bg-clip-text text-transparent">
                    How can we help you?
                </h1>

                <p className="text-muted-foreground max-w-lg mx-auto">
                    Find answers to common questions or get in touch with our support team.
                </p>

                {/* Search Bar */}
                <div className="relative max-w-md mx-auto mt-8">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search for answers..."
                        className="pl-10 h-11 bg-card/50 backdrop-blur-sm border-border/50 focus:ring-primary/50 rounded-xl"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">

                {/* Main Content - FAQs */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Sparkles className="w-4 h-4 text-primary" />
                        <h2 className="text-lg font-bold tracking-tight">Common Questions</h2>
                    </div>

                    <div className="space-y-3">
                        {filteredFaqs.length === 0 ? (
                            <div className="text-center py-10 text-muted-foreground">
                                <p>No results found for "{searchQuery}"</p>
                            </div>
                        ) : (
                            filteredFaqs.map((faq, index) => (
                                <FaqItem key={index} question={faq.question} answer={faq.answer} index={index} />
                            ))
                        )}
                    </div>
                </div>

                {/* Sidebar - Contact & Resources */}
                <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Zap className="w-4 h-4 text-amber-500" />
                        <h2 className="text-lg font-bold tracking-tight">Quick Actions</h2>
                    </div>

                    <Card className="p-5 border-border/50 bg-card/40 backdrop-blur-xl space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 text-primary bg-primary/10 rounded-full flex items-center justify-center">
                                <Mail className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm">Email Support</h3>
                                <p className="text-xs text-muted-foreground">Get a response within 24h</p>
                            </div>
                        </div>
                        <Button className="w-full" asChild>
                            <a href="mailto:support@postgenius.com">Contact Us</a>
                        </Button>
                    </Card>


                    <div className="pt-4 border-t border-border/40">
                        <h3 className="font-bold text-xs uppercase tracking-wider text-muted-foreground mb-3">Resources</h3>
                        <ul className="space-y-2">
                            <li>
                                <a href="/dashboard/support/docs" className="flex items-center gap-2 text-sm text-foreground/80 hover:text-primary transition-colors">
                                    <FileText className="w-3.5 h-3.5" /> Documentation
                                </a>
                            </li>
                            <li>
                                <a href="/dashboard/support/api" className="flex items-center gap-2 text-sm text-foreground/80 hover:text-primary transition-colors">
                                    <FileText className="w-3.5 h-3.5" /> API Reference
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

function FaqItem({ question, answer, index }: { question: string, answer: string, index: number }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="border border-border/50 rounded-xl bg-card/40 backdrop-blur-sm overflow-hidden"
        >
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5 transition-colors"
            >
                <span className="font-semibold text-sm mr-4">{question}</span>
                <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform duration-200", isOpen && "rotate-180")} />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="p-4 pt-0 text-sm text-muted-foreground leading-relaxed">
                            {answer}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
