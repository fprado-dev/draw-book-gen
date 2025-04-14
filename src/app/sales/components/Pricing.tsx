"use client";

import NumberFlow from "@number-flow/react";
import confetti from "canvas-confetti";
import { motion, Variants } from 'framer-motion';
import { Check, Crown, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useRef, useState } from 'react';

interface PricingPlan {
  name: string;
  description: string;
  monthlyPrice: number;
  annualPrice: number;
  features: string[];
  cta: string;
  href: string;
  isPopular: boolean;
  delay: number;
}

export default function PricingComponent() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const switchRef = useRef<HTMLDivElement>(null);

  const handleToggle = (cycle: 'monthly' | 'annual') => {
    setBillingCycle(cycle);

    // Trigger confetti when switching to annual billing
    if (cycle === 'annual' && switchRef.current) {
      const rect = switchRef.current.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;

      confetti({
        particleCount: 50,
        spread: 60,
        origin: {
          x: x / window.innerWidth,
          y: y / window.innerHeight,
        },
        colors: ["#7f4a88", "#e39774", "#9c5a8f", "#d87e65"],
        ticks: 200,
        gravity: 1.2,
        decay: 0.94,
        startVelocity: 30,
        shapes: ["circle"],
      });
    }
  };

  // Animation variants
  const headerVariants: Variants = {
    offscreen: { opacity: 0, y: -20 },
    onscreen: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        delay: 0.1
      }
    }
  };

  const cardVariants: Variants = {
    offscreen: {
      opacity: 0,
      y: 20,
      scale: 0.95
    },
    onscreen: (delay: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 15,
        delay: delay
      }
    })
  };

  const shapeVariants: Variants = {
    offscreen: { opacity: 0, scale: 0.8 },
    onscreen: {
      opacity: [0, 0.1, 0.05],
      scale: 1,
      transition: {
        duration: 4,
        repeat: Infinity,
        repeatType: "reverse"
      }
    }
  };

  // Pricing plans data
  const pricingPlans: PricingPlan[] = [
    {
      name: "Hobby",
      description: "Perfect for beginners",
      monthlyPrice: 19,
      annualPrice: 190,
      features: [
        "150 Credits",
        "1 Book",
        "10 Pages per Book",
        "1 Outline",
        "Standard resolution exports (300 DPI)",
        "No credit card required",
        "Email support",
      ],
      cta: "Start for Free Now",
      href: "/signup",
      isPopular: false,
      delay: 0.7
    },
    {
      name: "Pro",
      description: "For serious creators",
      monthlyPrice: 49,
      annualPrice: 470,
      features: [
        "Everything from Hobby",
        "700 Credits",
        "10 Books",
        "50 Pages per Book",
        "10 AI Outlines",
        "Blank Pages to prevent ink bleed-through",
        "Color testing pages",
        "Cover page generator",
        "Priority email support",
      ],
      cta: "Start Now",
      href: "/signup",
      isPopular: true,
      delay: 0.8
    },
    {
      name: "Premium",
      description: "For professional publishers",
      monthlyPrice: 99,
      annualPrice: 950,
      features: [
        "Everything from Pro",
        "2.000 Credits",
        "Unlimited Books",
        "Unlimited Pages",
        "Unlimited AI Outlines",
        "Custom Branding pages",
        "Advanced analytics dashboard",
      ],
      cta: "Start Now",
      href: "/contact",
      isPopular: false,
      delay: 0.9
    }
  ];

  return (
    <motion.section
      initial="offscreen"
      whileInView="onscreen"
      viewport={{ amount: 0.2 }}
      className="pricing-section min-h-screen flex items-center justify-center pt-14 sm:pt-20 relative overflow-hidden"
    >
      {/* Animated background shapes */}
      <motion.div
        className="absolute top-20 left-10 w-64 h-64 rounded-full bg-affair-200 dark:bg-affair-900/20 blur-3xl"
        variants={shapeVariants}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-affair-300 dark:bg-affair-800/20 blur-3xl"
        variants={shapeVariants}
        transition={{ delay: 0.5 }}
      />

      <div className="max-sm:max-w-sm max-w-7md mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          variants={headerVariants}
          className="text-center"
        >
          <motion.div
            className="inline-flex items-center gap-2 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm mb-4"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ amount: 0.2 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <Sparkles className="text-affair-600 dark:text-affair-400 w-4 h-4" />
            <span className="text-sm font-medium text-affair-900 dark:text-affair-100">Simple, Transparent Pricing</span>
          </motion.div>

          <motion.h1
            className="text-3xl sm:text-4xl md:text-6xl font-bold text-affair-800 dark:text-white mb-4 sm:mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ amount: 0.2 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Choose Your Creative Journey
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ amount: 0.2 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-lg sm:text-xl text-affair-600 dark:text-affair-300 max-w-xl sm:max-w-2xl mx-auto mb-6 sm:mb-8"
          >
            Start creating professional coloring books today with our AI-powered platform.
            No design skills required, just your creativity.
          </motion.p>

          <motion.div
            className="w-24 h-1 bg-gradient-to-r from-affair-700 to-affair-500 rounded-full mx-auto mb-12"
            initial={{ width: 0 }}
            whileInView={{ width: 96 }}
            viewport={{ amount: 0.2 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          />
        </motion.div>

        {/* Pricing Toggle */}
        <motion.div
          className="flex justify-center mb-12"
          variants={headerVariants}
          ref={switchRef}
        >
          <motion.div className="bg-white dark:bg-neutral-900 p-1 rounded-full shadow-md inline-flex"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ amount: 0.2 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <button
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${billingCycle === 'monthly'
                ? 'bg-affair-600 text-white'
                : 'text-affair-700 dark:text-affair-300'
                }`}
              onClick={() => handleToggle('monthly')}
            >
              Monthly
            </button>
            <button
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${billingCycle === 'annual'
                ? 'bg-affair-600 text-white'
                : 'text-affair-700 dark:text-affair-300'
                }`}
              onClick={() => handleToggle('annual')}
            >
              Annual (Save 20%)
            </button>
          </motion.div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan) => (
            <motion.div
              key={plan.name}
              variants={cardVariants}
              initial="offscreen"
              whileInView="onscreen"
              viewport={{ amount: 0.2 }}
              custom={plan.delay}
              className={`bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden shadow-lg border ${plan.isPopular
                ? 'border-2 border-affair-500 transform md:scale-105 relative'
                : 'border-gray-100 dark:border-gray-800'
                } flex flex-col`}
            >
              {plan.isPopular && (
                <div className="absolute top-0 right-0 left-0 bg-affair-500 text-white text-xs font-bold py-1 text-center">
                  MOST POPULAR
                </div>
              )}

              <div className={`p-6 ${plan.isPopular ? 'pt-8' : ''} border-b border-gray-100 dark:border-gray-800`}>
                <div className="flex items-center mb-2">
                  <h3 className={`${plan.isPopular ? 'text-xl font-bold' : 'text-lg font-semibold'} text-affair-700 dark:text-affair-300`}>
                    {plan.name}
                  </h3>
                  {plan.isPopular && <Crown className="w-5 h-5 text-affair-500 ml-2" />}
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">{plan.description}</p>
                <div className="flex items-baseline">
                  <span className={`${plan.isPopular ? 'text-5xl' : 'text-4xl'} font-bold text-gray-900 dark:text-white`}>
                    <NumberFlow
                      value={billingCycle === 'monthly' ? plan.monthlyPrice : plan.annualPrice}
                      format={{
                        style: "currency",
                        currency: "USD",
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      }}
                      transformTiming={{
                        duration: 500,
                        easing: "ease-out",
                      }}
                      willChange
                      className="font-variant-numeric: tabular-nums"
                    />
                  </span>
                  <span className="text-gray-500 dark:text-gray-400 ml-1">
                    /{billingCycle === 'monthly' ? 'month' : 'year'}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {billingCycle === 'monthly' ? 'billed monthly' : 'billed annually'}
                </p>
              </div>

              <div className="p-6 flex-grow">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="text-affair-500 w-5 h-5 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-gray-600 dark:text-gray-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-6 pt-0">
                <Link href={plan.href}>
                  <motion.button
                    className={`w-full py-3 rounded-lg ${plan.isPopular
                      ? 'bg-affair-600 hover:bg-affair-700 text-white'
                      : 'bg-affair-100 dark:bg-affair-900/30 text-affair-700 dark:text-affair-300 hover:bg-affair-200 dark:hover:bg-affair-800/50'
                      } font-medium text-sm transition-colors`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {plan.cta}
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Feature Comparison */}
        <motion.div
          className="mt-20 mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.2 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-center text-affair-800 dark:text-white mb-10">
            Compare All Features
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full bg-white dark:bg-neutral-900 rounded-xl overflow-hidden shadow-lg">
              <thead>
                <tr className="bg-affair-50 dark:bg-affair-900/30">
                  <th className="py-4 px-6 text-left text-affair-700 dark:text-affair-300 font-medium">Feature</th>
                  <th className="py-4 px-6 text-center text-affair-700 dark:text-affair-300 font-medium">Hobby</th>
                  <th className="py-4 px-6 text-center text-affair-700 dark:text-affair-300 font-medium">Pro</th>
                  <th className="py-4 px-6 text-center text-affair-700 dark:text-affair-300 font-medium">Premium</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {[
                  { name: "Monthly Price", hobby: "$19", pro: "$49", premium: "$99" },
                  { name: "Annual Price", hobby: "$190", pro: "$470", premium: "$950" },
                  { name: "Credits", hobby: "150", pro: "700", premium: "2,000" },
                  { name: "Books", hobby: "1", pro: "10", premium: "Unlimited" },
                  { name: "Pages per Book", hobby: "10", pro: "50", premium: "Unlimited" },
                  { name: "AI Outlines", hobby: "1", pro: "10", premium: "Unlimited" },
                  { name: "Export resolution", hobby: "Standard (300 DPI)", pro: "Standard (300 DPI)", premium: "Standard (300 DPI)" },
                  { name: "Blank Pages", hobby: "—", pro: "✓", premium: "✓" },
                  { name: "Color testing pages", hobby: "—", pro: "✓", premium: "✓" },
                  { name: "Cover page generator", hobby: "—", pro: "✓", premium: "✓" },
                  { name: "Custom Branding pages", hobby: "—", pro: "—", premium: "✓" },
                  { name: "Analytics dashboard", hobby: "—", pro: "—", premium: "✓" },
                  { name: "No credit card required", hobby: "✓", pro: "—", premium: "—" },
                  { name: "Support", hobby: "Email", pro: "Priority email", premium: "Priority email" }
                ].map((feature, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-neutral-800/30">
                    <td className="py-4 px-6 text-gray-800 dark:text-gray-200 font-medium">{feature.name}</td>
                    <td className="py-4 px-6 text-center text-gray-600 dark:text-gray-400">{feature.hobby}</td>
                    <td className="py-4 px-6 text-center text-gray-600 dark:text-gray-400">{feature.pro}</td>
                    <td className="py-4 px-6 text-center text-gray-600 dark:text-gray-400">{feature.premium}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
