import { Navbar } from "@/components/blocks/navbar";
import { HeroSection } from "@/components/blocks/hero-section";
import { FeaturesSection } from "@/components/blocks/features-section";
import { CTASection } from "@/components/blocks/cta-section";
import { Footer } from "@/components/blocks/footer";

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
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
