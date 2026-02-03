"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    Book,
    Zap,
    Code2,
    Sparkles,
    ChevronRight,
    Search,
    Home,
    Rocket,
    Settings,
    BarChart3,
    Globe,
    Lightbulb,
    Target
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function DocsPage() {
    const [activeSection, setActiveSection] = useState("introduction");
    const [searchQuery, setSearchQuery] = useState("");

    const sections = [
        {
            id: "introduction",
            title: "Introduction",
            icon: Book,
            content: [
                {
                    title: "Welcome to PostGenius",
                    body: "PostGenius transforms any URL into engaging social media content using advanced AI. Whether you're a content creator, marketer, or business owner, PostGenius helps you maintain a consistent social media presence without the time investment."
                },
                {
                    title: "What Makes PostGenius Different",
                    body: "Unlike generic AI writing tools, PostGenius is purpose-built for social media content creation. Our AI understands platform-specific best practices, character limits, and engagement patterns to generate content that performs.\n\nSimply paste a URL, select your target platform, and receive perfectly formatted captions ready to post."
                },
                {
                    title: "Who Is This For",
                    body: "Content Creators: Repurpose your blog posts and videos into social content\n\nMarketing Teams: Scale your social media output without hiring more staff\n\nAgencies: Manage multiple client accounts efficiently\n\nDevelopers: Generate professional README files for GitHub projects"
                }
            ]
        },
        {
            id: "getting-started",
            title: "Getting Started",
            icon: Rocket,
            content: [
                {
                    title: "Create Your Account",
                    body: "Sign up with your email or Google account. No credit card required for the free plan. You'll immediately receive 5 daily credits to start generating content."
                },
                {
                    title: "Your First Generation",
                    body: "Navigate to your Dashboard and follow these steps:\n\n1. Select a workflow (Social Media Captions, LinkedIn Post, etc.)\n2. Paste the URL of your source content\n3. Click Generate\n4. Review and customize your AI-generated content\n5. Copy to clipboard and post to your platforms\n\nThe entire process takes less than 30 seconds."
                },
                {
                    title: "Understanding Workflows",
                    body: "Each workflow is optimized for specific content types:\n\nSocial Media Captions: Generates platform-specific posts for Instagram, LinkedIn, Twitter, and Facebook from any article or video\n\nLinkedIn Posts: Creates professional thought leadership content with proper formatting\n\nGitHub README: Auto-generates comprehensive documentation for your repositories\n\nStudy Notes: Converts educational content into structured, scannable notes\n\nResume Bullets: Transforms job descriptions into achievement-focused resume points"
                }
            ]
        },
        {
            id: "workflows",
            title: "Workflows Guide",
            icon: Zap,
            content: [
                {
                    title: "Social Media Captions",
                    body: "Generate platform-optimized captions in seconds.\n\nInput: Blog post, article, or YouTube video URL\nOutput: Four unique captions tailored for Instagram, LinkedIn, Twitter, and Facebook\nCredit Cost: 1 credit per generation\n\nEach caption includes:\n• Platform-appropriate tone and length\n• Relevant hashtags (Instagram)\n• Engagement hooks\n• Call-to-action elements"
                },
                {
                    title: "LinkedIn Posts",
                    body: "Create professional content that drives engagement.\n\nInput: Any article, blog, or video URL\nOutput: Formatted LinkedIn post with hooks, body paragraphs, and CTA\nCredit Cost: 1 credit per generation\n\nOptimized for:\n• Professional tone\n• Thought leadership positioning\n• Maximum engagement\n• LinkedIn algorithm preferences"
                },
                {
                    title: "GitHub README Generator",
                    body: "Comprehensive documentation for your repositories.\n\nInput: Public GitHub repository URL\nOutput: Complete README with badges, installation steps, usage examples, and more\nCredit Cost: 2 credits per generation\n\nIncludes:\n• Project description\n• Installation instructions\n• Usage examples\n• Contributing guidelines\n• License information"
                },
                {
                    title: "Study Notes",
                    body: "Transform articles into structured learning materials.\n\nInput: Educational content or article URL\nOutput: Organized notes with key points, summaries, and highlights\nCredit Cost: 1 credit per generation\n\nPerfect for:\n• Students\n• Researchers\n• Lifelong learners\n• Knowledge workers"
                },
                {
                    title: "Resume Bullets",
                    body: "Convert experiences into achievement-focused resume points.\n\nInput: Job posting or project description URL\nOutput: ATS-friendly, quantifiable bullet points\nCredit Cost: 1 credit per generation\n\nFeatures:\n• Action verb optimization\n• Achievement-focused language\n• ATS compatibility\n• Professional formatting"
                }
            ]
        },
        {
            id: "features",
            title: "Platform Features",
            icon: Sparkles,
            content: [
                {
                    title: "Content Library",
                    body: "Every generation is automatically saved to your personal library. Access your entire content history, search by workflow type, and reuse successful posts.\n\nLibrary capabilities:\n• Search and filter by date or workflow\n• One-click copy to clipboard\n• Delete unwanted generations\n• Export content history\n• View generation metadata"
                },
                {
                    title: "Smart Content Caching",
                    body: "PostGenius caches scraped content for 24 hours, enabling faster regenerations and reducing API costs. If you want to try different variations of the same source content, subsequent generations are nearly instant.\n\nBenefits:\n• 10x faster generation times for cached content\n• Consistent results across regenerations\n• Lower credit consumption\n• Improved reliability"
                },
                {
                    title: "Multi-Platform Optimization",
                    body: "Each platform has unique requirements. PostGenius automatically adapts your content:\n\nInstagram: Engaging captions with strategic hashtags and emoji usage\nLinkedIn: Professional tone with thought leadership positioning\nTwitter/X: Concise messaging within character limits\nFacebook: Conversation-starting posts optimized for engagement"
                },
                {
                    title: "Real-Time Analytics",
                    body: "Track your content generation patterns and optimize your workflow.\n\nView insights on:\n• Daily generation count\n• Credit usage trends\n• Most-used workflows\n• Generation success rate\n• Content library growth"
                }
            ]
        },
        {
            id: "credits",
            title: "Credits & Plans",
            icon: BarChart3,
            content: [
                {
                    title: "How Credits Work",
                    body: "Credits are the currency of PostGenius. Each generation consumes credits based on workflow complexity. Failed generations never consume credits.\n\nFree Plan: 5 credits daily (resets at midnight IST)\nPro Plan: 50 credits daily\nUnlimited Plan: Unlimited credits with no daily cap"
                },
                {
                    title: "Credit Consumption Rates",
                    body: "Social Media Captions: 1 credit\nLinkedIn Post: 1 credit\nGitHub README: 2 credits\nStudy Notes: 1 credit\nResume Bullets: 1 credit\n\nTip: Most users on the Pro plan generate 30-40 pieces of content daily, well within the 50-credit limit."
                },
                {
                    title: "Upgrading Your Plan",
                    body: "Upgrade anytime from Settings → Billing. Changes take effect immediately, and you'll never lose unused credits.\n\nPro Plan Benefits:\n• 50 credits per day\n• Priority support (24-hour response)\n• Advanced analytics dashboard\n• Bulk generation (up to 10 URLs)\n• No watermarks\n• 14-day free trial\n\nUnlimited Plan Benefits:\n• Unlimited daily credits\n• API access for integrations\n• Team collaboration features\n• White-label options\n• Custom branding\n• Dedicated account manager"
                },
                {
                    title: "Billing & Cancellation",
                    body: "All plans are billed monthly or annually (save 20% with annual billing). You can upgrade, downgrade, or cancel anytime from your Settings page.\n\nCancellation policy:\n• Cancel anytime, no questions asked\n• Premium benefits continue until end of billing period\n• No refunds for partial months\n• Reactivate anytime without losing your data"
                }
            ]
        },
        {
            id: "best-practices",
            title: "Best Practices",
            icon: Target,
            content: [
                {
                    title: "Choosing the Right Source Content",
                    body: "The quality of your output depends on your input. For best results:\n\nUse well-written, informative source content\nEnsure URLs are publicly accessible\nPrefer articles with clear structure and headings\nAvoid paywalled or login-required content\nFor GitHub READMEs, ensure repositories are public"
                },
                {
                    title: "Customizing Generated Content",
                    body: "While PostGenius generates high-quality content, adding your personal touch makes it even better:\n\nReview and adjust tone to match your brand voice\nAdd specific examples or data points\nInclude relevant mentions or tags\nCustomize calls-to-action for your goals\nTest different variations to see what resonates"
                },
                {
                    title: "Maximizing Your Credits",
                    body: "Get the most value from your daily credits:\n\nBatch similar content generation tasks\nUse the Content Library to repurpose successful posts\nLeverage smart caching for multiple variations\nSchedule generations during your content planning sessions\nUpgrade to Pro if you consistently hit your daily limit"
                },
                {
                    title: "Content Strategy Tips",
                    body: "Build a sustainable social media presence:\n\nGenerate content in batches for the week ahead\nMaintain a consistent posting schedule\nMix generated content with original posts\nTrack which workflows perform best for your audience\nUse analytics to optimize your content mix"
                }
            ]
        },
        {
            id: "troubleshooting",
            title: "Troubleshooting",
            icon: Settings,
            content: [
                {
                    title: "Generation Failed",
                    body: "If your generation fails, try these solutions:\n\nCommon causes:\n• URL is not publicly accessible\n• Private GitHub repository\n• Rate limit exceeded\n• Network timeout\n• Insufficient credits\n\nSolutions:\n• Verify the URL opens in an incognito browser window\n• Check your credit balance in the top navigation\n• Wait 1-2 minutes before retrying\n• Try a different URL to isolate the issue\n• Contact support if the problem persists"
                },
                {
                    title: "Content Not Appearing in Library",
                    body: "If your generated content isn't showing in your Library:\n\nCheck if the generation actually succeeded (look for success message)\nRefresh your browser (Cmd+R or Ctrl+R)\nClear browser cache and reload\nCheck if you're filtering by the correct workflow type\nVerify you're logged into the correct account"
                },
                {
                    title: "Credits Not Updating",
                    body: "Credits should update immediately after each generation:\n\nFailed generations do not consume credits\nCredits reset at midnight IST for free plans\nCheck Settings → Usage to see detailed credit history\nIf credits seem incorrect, log out and log back in\nContact support with your generation ID for investigation"
                },
                {
                    title: "Quality Issues",
                    body: "If generated content doesn't meet expectations:\n\nEnsure source content is high-quality and well-structured\nTry regenerating with a different source URL\nUse more detailed, informative source content\nCustomize the output to better match your needs\nProvide feedback to help improve our AI models"
                }
            ]
        },
        {
            id: "integrations",
            title: "Integrations & API",
            icon: Globe,
            content: [
                {
                    title: "API Access",
                    body: "Unlimited plan subscribers get full API access to integrate PostGenius into their workflows.\n\nAPI capabilities:\n• Programmatic content generation\n• Bulk processing\n• Custom integrations\n• Webhook support\n• Rate limits: 100 requests/minute\n\nView complete API documentation in the API Reference section."
                },
                {
                    title: "Zapier Integration (Coming Soon)",
                    body: "Connect PostGenius to 5,000+ apps:\n\nAutomate content generation when you publish new blog posts\nSync generated content to your social media scheduler\nCreate content from RSS feeds automatically\nIntegrate with your content management system"
                },
                {
                    title: "Browser Extension (Coming Soon)",
                    body: "Generate content directly from any webpage:\n\nRight-click any article to generate captions\nOne-click generation from your browser toolbar\nInstant copy-to-clipboard functionality\nAvailable for Chrome, Firefox, and Edge"
                }
            ]
        },
        {
            id: "tips",
            title: "Pro Tips",
            icon: Lightbulb,
            content: [
                {
                    title: "Workflow Selection Strategy",
                    body: "Choose the right workflow for maximum impact:\n\nFor blog posts: Use Social Media Captions to create a content series\nFor thought leadership: LinkedIn Posts workflow creates professional, engaging content\nFor open-source projects: GitHub README saves hours of documentation time\nFor learning: Study Notes transforms long articles into digestible summaries"
                },
                {
                    title: "Content Repurposing",
                    body: "Get more mileage from every piece of content:\n\nGenerate social captions from your latest blog post\nCreate a LinkedIn post from the same article\nExtract study notes for your knowledge base\nUse different angles to create multiple posts from one source"
                },
                {
                    title: "Keyboard Shortcuts",
                    body: "Work faster with these shortcuts:\n\nCmd/Ctrl + K: Focus search bar\nCmd/Ctrl + Enter: Submit generation\nCmd/Ctrl + C: Copy to clipboard (in Library)\nEsc: Close modals and dialogs"
                },
                {
                    title: "Team Collaboration",
                    body: "Unlimited plan teams can collaborate effectively:\n\nShare content library across team members\nMaintain consistent brand voice\nTrack team usage and analytics\nAssign roles and permissions\nCentralize content creation workflows"
                }
            ]
        }
    ];

    const activeContent = sections.find(s => s.id === activeSection);

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="border-b border-border/50 bg-card/30 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 py-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Link href="/dashboard/support" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                                <Home className="w-3.5 h-3.5" />
                                Support
                            </Link>
                            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                            <div className="flex items-center gap-1.5">
                                <Book className="w-3.5 h-3.5 text-primary" />
                                <span className="font-semibold text-xs">Documentation</span>
                            </div>
                        </div>
                        <Link href="/dashboard/support/api">
                            <Button variant="outline" size="sm" className="gap-1.5 h-7 text-xs">
                                <Code2 className="w-3 h-3" />
                                API Reference
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-4">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Sidebar Navigation */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-20 space-y-4">
                            {/* Search */}
                            <div className="relative">
                                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                                <Input
                                    placeholder="Search docs..."
                                    className="pl-8 h-8 text-xs bg-card/50 border-border/50"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>

                            {/* Navigation */}
                            <nav className="space-y-0.5">
                                {sections.map((section) => {
                                    const Icon = section.icon;
                                    return (
                                        <button
                                            key={section.id}
                                            onClick={() => setActiveSection(section.id)}
                                            className={cn(
                                                "w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all",
                                                activeSection === section.id
                                                    ? "bg-primary/10 text-primary border border-primary/20"
                                                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                                            )}
                                        >
                                            <Icon className="w-3.5 h-3.5 shrink-0" />
                                            <span>{section.title}</span>
                                        </button>
                                    );
                                })}
                            </nav>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        <motion.div
                            key={activeSection}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-4"
                        >
                            {/* Section Header */}
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    {activeContent && <activeContent.icon className="w-5 h-5 text-primary" />}
                                    <h1 className="text-2xl font-black tracking-tight">{activeContent?.title}</h1>
                                </div>
                                <div className="h-0.5 w-16 bg-gradient-to-r from-primary to-primary/20 rounded-full" />
                            </div>

                            {/* Content Blocks */}
                            <div className="space-y-3">
                                {activeContent?.content.map((block, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="p-4 rounded-xl bg-card/40 border border-border/50 backdrop-blur-sm hover:border-primary/20 transition-all"
                                    >
                                        <h2 className="text-sm font-bold mb-2 flex items-center gap-1.5">
                                            <div className="h-1 w-1 rounded-full bg-primary" />
                                            {block.title}
                                        </h2>
                                        <div className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
                                            {block.body}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Bottom Navigation */}
                            <div className="flex items-center justify-between pt-4 border-t border-border/50">
                                <div>
                                    {sections.findIndex(s => s.id === activeSection) > 0 && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setActiveSection(sections[sections.findIndex(s => s.id === activeSection) - 1].id)}
                                            className="gap-1.5 h-7 text-xs"
                                        >
                                            <ChevronRight className="w-3 h-3 rotate-180" />
                                            Previous
                                        </Button>
                                    )}
                                </div>
                                <div>
                                    {sections.findIndex(s => s.id === activeSection) < sections.length - 1 && (
                                        <Button
                                            size="sm"
                                            onClick={() => setActiveSection(sections[sections.findIndex(s => s.id === activeSection) + 1].id)}
                                            className="gap-1.5 h-7 text-xs"
                                        >
                                            Next
                                            <ChevronRight className="w-3 h-3" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
