import { Navbar } from "@/components/blocks/navbar";
import { HeroSection } from "@/components/blocks/hero-section";
import { FeaturesSection } from "@/components/blocks/features-section";
import { HowItWorksSection } from "@/components/blocks/how-it-works-section";
import { CTASection } from "@/components/blocks/cta-section";
import { Footer } from "@/components/blocks/footer";
import { Pricing } from "@/components/blocks/pricing";
import { TestimonialsSection } from "@/components/blocks/testimonials-section";
import { FAQSection } from "@/components/blocks/faq-section";

const demoPlans = [
  {
    name: "FREE",
    price: "0",
    yearlyPrice: "0",
    period: "per month",
    features: [
      "5 captions per day",
      "4 platforms (Instagram, LinkedIn, Twitter, Facebook)",
      "Content library",
      "Hashtag suggestions",
      "Character counter",
      "Basic support",
      "No credit card required",
    ],
    description: "Start free and scale as you grow. Perfect for students, creators, and businesses.",
    buttonText: "Get Started Free",
    href: "/sign-up",
    isPopular: false,
  },
  {
    name: "PRO",
    price: "99",
    yearlyPrice: "79",
    period: "per month",
    features: [
      "50 captions per day",
      "4 platforms (Instagram, LinkedIn, Twitter, Facebook)",
      "Priority support",
      "Advanced analytics",
      "Bulk generation (10 URLs)",
      "Caption templates",
      "No watermarks",
      "14-day free trial",
    ],
    description: "For professional social media managers",
    buttonText: "Start Free Trial",
    href: "/sign-up",
    isPopular: true,
  },
  {
    name: "UNLIMITED",
    price: "299",
    yearlyPrice: "249",
    period: "per month",
    features: [
      "Unlimited captions",
      "4 platforms (Instagram, LinkedIn, Twitter, Facebook)",
      "API access",
      "Team collaboration",
      "White-label option",
      "Custom branding",
      "Dedicated support",
      "Priority features",
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
            text: "New: Introducing PostGenius AI 2.0",
            action: {
              text: "See what's new",
              href: "#features",
            },
          }}
          title={
            <>
              Generate Perfect Social Media Captions
              <div className="text-muted-foreground/80 sm:mt-2">With AI-Instantly</div>
            </>
          }
          description="Paste any blog, article, or video link. Get perfect captions instantly. Save hours every week."
          actions={[
            {
              text: "Get Started Free",
              href: "/sign-up",
              variant: "default",
            },
            {
              text: "See How It Works →",
              href: "#features",
              variant: "glow",
            },
          ]}
          image={{
            light: "/light.png",
            dark: "/dark.png",
            alt: "Post Genius Dashboard Preview",
          }}
        />
        <FeaturesSection />
        <HowItWorksSection />
        <Pricing
          plans={demoPlans}
          title="Simple, Transparent Pricing"
          description="Choose the plan that works for you. Upgrade, downgrade, or cancel anytime. All plans include core features with no hidden fees."
        />
        <TestimonialsSection />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
