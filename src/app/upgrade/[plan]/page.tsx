import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, Lock, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { cn } from "@/lib/utils";

interface UpgradePageProps {
    params: {
        plan: string;
    };
}

export default async function UpgradePage({ params }: UpgradePageProps) {
    const { userId: clerkUserId } = await auth();
    const targetPlan = params.plan.toLowerCase();

    if (!clerkUserId) {
        redirect("/sign-in");
    }

    if (!["premium", "pro"].includes(targetPlan)) {
        notFound();
    }

    // Fetch user's current plan
    const { data: user } = await supabase
        .from("users")
        .select("plan_type, email")
        .eq("clerk_user_id", clerkUserId)
        .single();

    const currentPlan = user?.plan_type || "free";

    // Plan data for display
    const planDetails: Record<string, {
        name: string;
        price: string;
        limit: string;
        features: string[];
    }> = {
        premium: {
            name: "Premium",
            price: "₹149/month",
            limit: "50 gens/day",
            features: [
                "50 Generations per day",
                "Advanced AI Optimization",
                "Priority Support Access",
                "CSV Export Capabilities",
                "Ad-free Experience"
            ]
        },
        pro: {
            name: "Professional",
            price: "₹399/month",
            limit: "200 gens/day",
            features: [
                "200 Generations per day",
                "Full API Access",
                "Priority 24/7 Support",
                "All Advanced Platforms",
                "Early access to new features"
            ]
        }
    };

    const details = planDetails[targetPlan];

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <header className="h-20 px-6 border-b border-border/50 flex items-center">
                <Link href="/pricing" className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Selection
                </Link>
            </header>

            <main className="flex-1 flex items-center justify-center p-6">
                <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <ScrollReveal>
                        <div className="space-y-8">
                            <div>
                                <h1 className="text-4xl font-black italic tracking-tighter uppercase mb-2">
                                    CONFIRM YOUR <span className="text-primary italic tracking-[-0.05em]">UPGRADE.</span>
                                </h1>
                                <p className="text-muted-foreground text-sm font-medium">
                                    You are upgrading from <span className="text-foreground font-bold uppercase">{currentPlan}</span> to <span className="text-primary font-bold uppercase">{targetPlan}</span>.
                                </p>
                            </div>

                            <div className="space-y-4">
                                {details.features.map((feature, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                                            <Check className="w-3 h-3 text-primary" />
                                        </div>
                                        <span className="text-sm font-medium">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-6 border-t border-border/50">
                                <div className="flex items-center gap-3 text-muted-foreground">
                                    <ShieldCheck className="w-5 h-5" />
                                    <p className="text-xs font-medium">Secure SSL Encrypted Checkout</p>
                                </div>
                            </div>
                        </div>
                    </ScrollReveal>

                    <ScrollReveal delay={200}>
                        <div className="bg-muted/50 rounded-[2.5rem] p-10 border border-border/50 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Zap className="w-32 h-32 text-primary" />
                            </div>

                            <div className="relative z-10 space-y-8">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Order Summary</p>
                                    <h3 className="text-2xl font-black italic tracking-tight uppercase">{details.name} Subscription</h3>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground font-medium">{details.name} Plan</span>
                                        <span className="font-bold">{details.price}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground font-medium">Setup Fee</span>
                                        <span className="text-green-500 font-bold uppercase tracking-widest text-[10px]">Waived</span>
                                    </div>
                                    <div className="pt-4 border-t border-border flex justify-between items-baseline">
                                        <span className="font-black italic uppercase tracking-widest text-xs">Total Due</span>
                                        <span className="text-3xl font-black tracking-tighter">{details.price}</span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <Button disabled className="w-full h-14 rounded-2xl font-black uppercase tracking-[0.1em] text-xs gap-3 shadow-xl shadow-primary/20 cursor-not-allowed">
                                        <Lock className="w-4 h-4" />
                                        Complete Payment
                                    </Button>
                                    <p className="text-center text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                                        ⚠️ Payment Gateway Integration Coming Soon
                                    </p>
                                </div>

                                <div className="pt-4 flex items-center justify-center gap-6 grayscale opacity-50">
                                    <span className="text-[10px] font-black">VISA</span>
                                    <span className="text-[10px] font-black">MASTERCARD</span>
                                    <span className="text-[10px] font-black">UPI</span>
                                    <span className="text-[10px] font-black">RAZORPAY</span>
                                </div>
                            </div>
                        </div>
                    </ScrollReveal>
                </div>
            </main>
        </div>
    );
}
