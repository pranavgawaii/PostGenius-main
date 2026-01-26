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
            priceSub: "Free forever",
            description: "Perfect for casual creators",
            limit: "5 generations/day",
            features: [
                { text: "5 Generations per day", included: true },
                { text: "All 6 Platforms", included: true },
                { text: "Smart Content Caching", included: true },
                { text: "Standard Support", included: true },
                { text: "Export to CSV", included: false },
                { text: "API Access", included: false },
                { text: "Custom Tone Selection", included: false, comingSoon: true },
            ],
            cta: "Get Started"
        },
        {
            id: "premium",
            name: "Premium",
            price: "₹149",
            priceSub: "/month",
            description: "For serious social growers",
            limit: "50 generations/day",
            popular: true,
            features: [
                { text: "50 Generations per day", included: true },
                { text: "All 6 Platforms", included: true },
                { text: "Smart Content Caching", included: true },
                { text: "Priority Support", included: true },
                { text: "Export to CSV", included: true },
                { text: "API Access", included: false },
                { text: "Custom Tone Selection", included: true, comingSoon: true },
            ],
            cta: "Upgrade to Premium"
        },
        {
            id: "pro",
            name: "Professional",
            price: "₹399",
            priceSub: "/month",
            description: "The ultimate content engine",
            limit: "200 generations/day",
            features: [
                { text: "200 Generations per day", included: true },
                { text: "All 6 Platforms", included: true },
                { text: "Smart Content Caching", included: true },
                { text: "24/7 Priority Support", included: true },
                { text: "Advanced Export (CSV/JSON)", included: true },
                { text: "Full API Access", included: true },
                { text: "Hashtag Generator", included: true, comingSoon: true },
            ],
            cta: "Go Pro Now"
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
                    {plans.map((plan, i) => (
                        <ScrollReveal key={plan.id} delay={i * 100}>
                            <PricingCard
                                plan={plan}
                                isCurrentPlan={currentPlan === plan.id || (plan.id === 'free' && currentPlan === 'unlimited')}
                            />
                        </ScrollReveal>
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
