'use client';

import { motion, useScroll } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useEffect } from 'react';
import { Benefits } from './components/Benefits';
import FAQ from './components/FAQ';
import FinalCTA from './components/FinalCTA';
import { Footer } from './components/Footer';
import { HeroSection } from './components/Hero';
import { HowItWorks } from './components/HowItWorks';
import { Navigation } from './components/Navigation';
import Pricing from './components/Pricing';

export default function Page() {
  const { setTheme } = useTheme();
  // For scroll progress tracking
  const { scrollYProgress } = useScroll();
  useEffect(() => {
    setTheme('light');
  }, [setTheme]);

  return (
    <div className="bg-primary-foreground relative min-h-screen bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
      {/* Progress indicator */}
      <motion.div
        className="bg-primary fixed left-0 right-0 top-0 z-50 h-1 origin-left"
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
