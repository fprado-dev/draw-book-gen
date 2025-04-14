'use client';

import { motion, useScroll } from "framer-motion";
import { useTheme } from "next-themes";
import { useEffect } from "react";
import { Benefits } from "./components/Benefits";
import FAQ from "./components/FAQ";
import FinalCTA from "./components/FinalCTA";
import { Footer } from "./components/Footer";
import { HeroSection } from "./components/Hero";
import { HowItWorks } from "./components/HowItWorks";
import { Navigation } from "./components/Navigation";
import Pricing from "./components/Pricing";

export default function Page() {
  const { setTheme } = useTheme();
  // For scroll progress tracking
  const { scrollYProgress } = useScroll();
  useEffect(() => {
    setTheme('light');
  }, []);

  return (
    <div className="min-h-screen relative bg-primary-foreground bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
      {/* Progress indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-primary origin-left z-50"
        style={{ scaleX: scrollYProgress }}
      />
      <Navigation />
      <div id="hero" className="pt-5">
        <HeroSection />
      </div>
      <div id="benefits">
        <Benefits />
      </div>
      <div id="pricing">
        <Pricing />
      </div>
      <div id="howItWorks">
        <HowItWorks />
      </div>
      <div id="faq">
        <FAQ />
      </div>

      <div id="finalCta">
        <FinalCTA />
      </div>


      <Footer />
      {/*
      <div id="demo">
        <Demo />
      </div>
      <div id="pricing">
       
      </div>
       */}
    </div>
  );
}
