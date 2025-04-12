'use client';

import { useScroll, Variants } from "framer-motion";
import { useTheme } from "next-themes";
import { useEffect } from "react";
import { HeroSection } from "./components/Hero";

export default function Page() {
  const { setTheme } = useTheme();
  const { scrollY } = useScroll();
  useEffect(() => {
    setTheme('light');
  }, []);


  const menuOptions = [
    {
      id: 1,
      title: "About",
      path: "#about",
      color: "#ffF"
    },
    {
      id: 2,
      title: "Services",
      path: "#services",
      color: "#f28323"
    },
    {
      id: 3,
      title: "Clients",
      path: "#clients",
      color: "#b23421"
    },
    {
      id: 4,
      title: "Contact",
      path: "#contact",
      color: "#7f4a88"
    },
    {
      id: 5,
      title: "Footer",
      path: "#footer",
      color: "#22c55e"
    }
  ];

  const cardVariants: Variants = {
    offscreen: {
      y: 300,
    },
    onscreen: {
      y: 50,
      rotate: -10,
      transition: {
        type: "spring",
        bounce: 0.4,
        duration: 0.8,
      },
    },
  };
  return (
    <div className="min-h-screen relative bg-primary-foreground bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
      <HeroSection />
      {/* <Benefits />
      <HowItWorks />
      <TestimonialsPage />
      <Demo />
      <Pricing />
      <FAQ />
      <FinalCTA /> */}
      {/* <Footer /> */}
    </div>
  );
}
