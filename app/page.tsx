import { LandingNav } from "@/components/shared/LandingNav";
import { HeroSection } from "@/components/landing/HeroSection";
import { LogoTicker } from "@/components/landing/LogoTicker";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { SecuritySection } from "@/components/landing/SecuritySection";
import { PricingSection } from "@/components/landing/PricingSection";
import { Footer } from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FDFEFE] text-slate-900 font-sans overflow-x-hidden">
      <LandingNav />
      <HeroSection />
      <LogoTicker />
      <FeaturesSection />
      <HowItWorksSection />
      <SecuritySection />
      <PricingSection />
      <Footer />
    </div>
  );
}
