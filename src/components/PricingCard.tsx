"use client";

import { Check, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

export interface PricingPlan {
    id: string;
    name: string;
    price: string;
    priceSub: string;
    description: string;
    limit: string;
    features: {
        text: string;
        included: boolean;
        comingSoon?: boolean;
    }[];
    popular?: boolean;
    cta: string;
}

interface PricingCardProps {
    plan: PricingPlan;
    isCurrentPlan: boolean;
}

export function PricingCard({ plan, isCurrentPlan }: PricingCardProps) {
    return (
        <Card className={cn(
            "relative flex flex-col h-full border-border/50 bg-background/50 backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:-translate-y-1",
            plan.popular && "border-primary/50 shadow-[0_0_30px_rgba(168,85,247,0.1)] ring-1 ring-primary/50"
        )}>
            {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-lg">
                    <Sparkles className="w-3 h-3" />
                    Most Popular
                </div>
            )}

            <div className="p-8 pb-0">
                <div className="mb-4">
                    <h3 className="text-xl font-black italic tracking-tighter uppercase">{plan.name}</h3>
                    <p className="text-muted-foreground text-xs font-medium">{plan.description}</p>
                </div>

                <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-black tracking-tighter">{plan.price}</span>
                        <span className="text-muted-foreground text-xs font-bold uppercase tracking-wider">{plan.priceSub}</span>
                    </div>
                    <div className="mt-2 text-[10px] font-black text-primary uppercase tracking-widest">
                        {plan.limit}
                    </div>
                </div>

                <div className="space-y-4 mb-8">
                    {plan.features.map((feature, i) => (
                        <div key={i} className="flex items-start gap-3">
                            {feature.included ? (
                                <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                            ) : (
                                <X className="w-4 h-4 text-muted-foreground/30 shrink-0 mt-0.5" />
                            )}
                            <div className="flex flex-col">
                                <span className={cn(
                                    "text-sm font-medium",
                                    !feature.included && "text-muted-foreground/50 line-through decoration-muted-foreground/30"
                                )}>
                                    {feature.text}
                                </span>
                                {feature.comingSoon && (
                                    <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest">Coming Soon</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-auto p-8 pt-0">
                {isCurrentPlan ? (
                    <Button disabled className="w-full h-11 rounded-xl font-bold uppercase tracking-widest text-xs bg-muted text-muted-foreground border-transparent">
                        Current Plan
                    </Button>
                ) : (
                    <Button asChild className={cn(
                        "w-full h-11 rounded-xl font-bold uppercase tracking-widest text-xs group",
                        plan.popular ? "bg-primary hover:bg-primary/90" : "bg-foreground hover:bg-foreground/90"
                    )}>
                        <Link href={`/upgrade/${plan.id}`}>
                            {plan.cta}
                        </Link>
                    </Button>
                )}
            </div>
        </Card>
    );
}

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
    return <div className={cn("rounded-3xl border", className)}>{children}</div>;
}
