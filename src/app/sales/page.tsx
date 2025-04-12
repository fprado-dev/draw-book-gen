'use client';

import { useScroll } from "framer-motion";
import { useTheme } from "next-themes";
import { useEffect } from "react";
import BenefitsSection from "./components/Benefits";
import { HeroSection } from "./components/Hero";
import { Navigation } from "./components/Navigation";

export default function Page() {
  const { setTheme } = useTheme();
  const { scrollY } = useScroll();
  useEffect(() => {
    setTheme('light');
  }, []);

  return (
    <div className="min-h-screen relative bg-primary-foreground bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
      <Navigation />
      <div id="hero" className="pt-16">
        <HeroSection />
      </div>
      <div id="benefits">
        <BenefitsSection />
      </div>
      {/* <div id="howItWorks">
        <HowItWorks />
      </div>
      <div id="demo">
        <Demo />
      </div>
      <div id="pricing">
        <Pricing />
      </div>
      <div id="faq">
        <FAQ />
      </div>
      <div id="finalCta">
        <FinalCTA />
      </div>
      <Footer /> */}
    </div>
  );
}
