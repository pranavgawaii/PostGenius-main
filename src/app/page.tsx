import { Navbar } from "@/components/blocks/navbar";
import { HeroSection } from "@/components/blocks/hero-section";
import { FeaturesSection } from "@/components/blocks/features-section";
import { CTASection } from "@/components/blocks/cta-section";
import { Footer } from "@/components/blocks/footer";
import { Pricing } from "@/components/blocks/pricing";

const demoPlans = [
  {
    name: "CREATOR",
    price: "29",
    yearlyPrice: "24",
    period: "per month",
    features: [
      "5 Social Profiles",
      "Unlimited Scheduling",
      "Basic AI Content Generation",
      "Best Time to Post",
      "1 User Seat",
    ],
    description: "For solo creators building their personal brand",
    buttonText: "Start Free Trial",
    href: "/sign-up",
    isPopular: false,
  },
  {
    name: "PRO",
    price: "59",
    yearlyPrice: "49",
    period: "per month",
    features: [
      "15 Social Profiles",
      "Advanced AI Writing Assistant",
      "Competitor Analysis",
      "Unified Inbox",
      "3 User Seats",
      "Priority Support",
    ],
    description: "For professional social media managers",
    buttonText: "Get Started",
    href: "/sign-up",
    isPopular: true,
  },
  {
    name: "AGENCY",
    price: "149",
    yearlyPrice: "129",
    period: "per month",
    features: [
      "Unlimited Social Profiles",
      "White-label Reporting",
      "Client Approval Workflows",
      "Custom Brand Voice AI",
      "Dedicated Account Manager",
      "Unlimited Users",
    ],
    description: "For agencies managing multiple clients",
    buttonText: "Contact Sales",
    href: "/contact",
    isPopular: false,
  },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1">
        <HeroSection
          badge={{
            text: "New: AI Content Generation",
            action: {
              text: "Learn more",
              href: "#features",
            },
          }}
          title={
            <>
              Social Media Management
              <div className="text-muted-foreground/80 sm:mt-2">Made Simple</div>
            </>
          }
          description="Plan, automate, and manage your social media content like a pro. Save time and grow your audience with Post Genius."
          actions={[
            {
              text: "Get Started Free",
              href: "/sign-up",
              variant: "default",
            },
            {
              text: "Learn More",
              href: "#features",
              variant: "glow",
            },
          ]}
          image={{
            light: "/dashboard-light.png",
            dark: "/dashboard-dark.png",
            alt: "Post Genius Dashboard Preview",
          }}
        />
        <FeaturesSection />
        <Pricing
          plans={demoPlans}
          title="Simple, Transparent Pricing"
          description="Choose the plan that works for you
All plans include access to our platform, lead generation tools, and dedicated support."
        />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
