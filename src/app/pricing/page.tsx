import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";
import { PricingCard, PricingPlan } from "@/components/PricingCard";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function PricingPage() {
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
        redirect("/sign-in");
    }

    // Fetch user's current plan
    const { data: user } = await supabase
        .from("users")
        .select("plan_type")
        .eq("clerk_user_id", clerkUserId)
        .single();

    const currentPlan = user?.plan_type || "free";

    const plans: PricingPlan[] = [
        {
            id: "free",
            name: "Free",
            price: "₹0",
            priceSub: "/ per month",
            description: "perfect for students, creators, and businesses.",
            limit: "5 captions/day",
            features: [
                { text: "5 captions per day", included: true },
                { text: "4 platforms (Instagram, LinkedIn, Twitter, Facebook)", included: true },
                { text: "Content library", included: true },
                { text: "Hashtag suggestions", included: true },
                { text: "Character counter", included: true },
                { text: "Basic support", included: true },
                { text: "No credit card required", included: true },
            ],
            cta: "Get Started Free"
        },
        {
            id: "pro",
            name: "Pro",
            price: "₹99",
            priceSub: "/ per month",
            description: "For professional social media managers",
            limit: "50 captions/day",
            popular: true,
            features: [
                { text: "50 captions per day", included: true },
                { text: "4 platforms (Instagram, LinkedIn, Twitter, Facebook)", included: true },
                { text: "Priority support", included: true },
                { text: "Advanced analytics", included: true },
                { text: "Bulk generation (10 URLs)", included: true },
                { text: "Caption templates", included: true },
                { text: "No watermarks", included: true },
                { text: "14-day free trial", included: true },
            ],
            cta: "Start Free Trial"
        },
        {
            id: "unlimited",
            name: "Unlimited",
            price: "₹299",
            priceSub: "/ per month",
            description: "For agencies managing multiple clients",
            limit: "Unlimited captions",
            features: [
                { text: "Unlimited captions", included: true },
                { text: "4 platforms (Instagram, LinkedIn, Twitter, Facebook)", included: true },
                { text: "API access", included: true },
                { text: "Team collaboration", included: true },
                { text: "White-label option", included: true },
                { text: "Custom branding", included: true },
                { text: "Dedicated support", included: true },
                { text: "Priority features", included: true },
            ],
            cta: "Contact Sales"
        }
    ];

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
                <div className="max-w-7xl mx-auto h-16 px-6 flex items-center justify-between">
                    <Link href="/dashboard" className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Dashboard
                    </Link>
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-primary" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] italic">PostGenius Pricing</span>
                    </div>
                </div>
            </header>

            <main className="pt-32 px-6 max-w-7xl mx-auto">
                <ScrollReveal>
                    <div className="text-center mb-16">
                        <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter mb-4">
                            UPGRADE YOUR <span className="text-primary tracking-[-0.1em]">GRIND.</span>
                        </h1>
                        <p className="text-muted-foreground text-lg font-medium max-w-2xl mx-auto">
                            Choose the plan that fits your growth. Scale your social presence with AI that never sleeps.
                        </p>
                    </div>
                </ScrollReveal>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                    {plans.map((plan) => (
                        <PricingCard
                            key={plan.id}
                            plan={plan}
                            isCurrentPlan={currentPlan === plan.id}
                        />
                    ))}
                </div>

                <div className="mt-20 text-center">
                    <p className="text-muted-foreground text-sm font-medium italic">
                        All plans include a 7-day money-back guarantee. No hidden fees. Cancel anytime.
                    </p>
                </div>
            </main>
        </div>
    );
}
