'use client';

import { useTheme } from "next-themes";
import { useEffect } from "react";
import { Benefits } from "./components/Benefits";
import { HeroSection } from "./components/Hero";
import { HowItWorks } from "./components/HowItWorks";


export default function Page() {
  const { setTheme } = useTheme();

  useEffect(() => {
    setTheme('light');
  }, []);

  return (
    <div className="min-h-screen bg-primary-foreground  bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
      <HeroSection />
      <Benefits />
      <HowItWorks />
      {/*
      <Demo />
      <Testimonials />
      <Pricing />
      <FAQ />
      <FinalCTA />
      <Footer /> */}
    </div>
  );
}
