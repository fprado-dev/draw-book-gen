'use client';

import NumberFlow from '@number-flow/react';
import confetti from 'canvas-confetti';
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
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>(
    'monthly'
  );
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
        colors: ['#7f4a88', '#e39774', '#9c5a8f', '#d87e65'],
        ticks: 200,
        gravity: 1.2,
        decay: 0.94,
        startVelocity: 30,
        shapes: ['circle'],
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
        delay: 0.1,
      },
    },
  };

  const cardVariants: Variants = {
    offscreen: {
      opacity: 0,
      y: 20,
      scale: 0.95,
    },
    onscreen: (delay: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 80,
        damping: 15,
        delay: delay,
      },
    }),
  };

  const shapeVariants: Variants = {
    offscreen: { opacity: 0, scale: 0.8 },
    onscreen: {
      opacity: [0, 0.1, 0.05],
      scale: 1,
      transition: {
        duration: 4,
        repeat: Infinity,
        repeatType: 'reverse',
      },
    },
  };

  // Pricing plans data
  const pricingPlans: PricingPlan[] = [
    {
      name: 'Hobby',
      description: 'Perfect for beginners',
      monthlyPrice: 19,
      annualPrice: 190,
      features: [
        '150 Credits',
        '1 Book',
        '10 Pages per Book',
        '1 Outline',
        'Standard resolution exports (300 DPI)',
        'No credit card required',
        'Email support',
      ],
      cta: 'Start for Free Now',
      href: '/signup',
      isPopular: false,
      delay: 0.7,
    },
    {
      name: 'Pro',
      description: 'For serious creators',
      monthlyPrice: 49,
      annualPrice: 470,
      features: [
        'Everything from Hobby',
        '700 Credits',
        '10 Books',
        '50 Pages per Book',
        '10 AI Outlines',
        'Blank Pages to prevent ink bleed-through',
        'Color testing pages',
        'Cover page generator',
        'Priority email support',
      ],
      cta: 'Start Now',
      href: '/signup',
      isPopular: true,
      delay: 0.8,
    },
    {
      name: 'Premium',
      description: 'For professional publishers',
      monthlyPrice: 99,
      annualPrice: 950,
      features: [
        'Everything from Pro',
        '2.000 Credits',
        'Unlimited Books',
        'Unlimited Pages',
        'Unlimited AI Outlines',
        'Custom Branding pages',
        'Advanced analytics dashboard',
      ],
      cta: 'Start Now',
      href: '/contact',
      isPopular: false,
      delay: 0.9,
    },
  ];

  return (
    <motion.section
      initial="offscreen"
      whileInView="onscreen"
      viewport={{ amount: 0.2 }}
      className="pricing-section relative flex min-h-screen items-center justify-center overflow-hidden pt-14 sm:pt-20"
    >
      {/* Animated background shapes */}
      <motion.div
        className="bg-affair-200 dark:bg-affair-900/20 absolute left-10 top-20 h-64 w-64 rounded-full blur-3xl"
        variants={shapeVariants}
      />
      <motion.div
        className="bg-affair-300 dark:bg-affair-800/20 absolute bottom-20 right-10 h-80 w-80 rounded-full blur-3xl"
        variants={shapeVariants}
        transition={{ delay: 0.5 }}
      />

      <div className="max-w-7md relative z-10 mx-auto px-4 max-sm:max-w-sm sm:px-6 lg:px-8">
        <motion.div variants={headerVariants} className="text-center">
          <motion.div
            className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 shadow-sm backdrop-blur-sm dark:bg-neutral-900/80"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ amount: 0.2 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <Sparkles className="text-affair-600 dark:text-affair-400 h-4 w-4" />
            <span className="text-affair-900 dark:text-affair-100 text-sm font-medium">
              Simple, Transparent Pricing
            </span>
          </motion.div>

          <motion.h1
            className="text-affair-800 mb-4 text-3xl font-bold sm:mb-6 sm:text-4xl md:text-6xl dark:text-white"
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
            className="text-affair-600 dark:text-affair-300 mx-auto mb-6 max-w-xl text-lg sm:mb-8 sm:max-w-2xl sm:text-xl"
          >
            Start creating professional coloring books today with our AI-powered
            platform. No design skills required, just your creativity.
          </motion.p>

          <motion.div
            className="from-affair-700 to-affair-500 mx-auto mb-12 h-1 w-24 rounded-full bg-gradient-to-r"
            initial={{ width: 0 }}
            whileInView={{ width: 96 }}
            viewport={{ amount: 0.2 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          />
        </motion.div>

        {/* Pricing Toggle */}
        <motion.div
          className="mb-12 flex justify-center"
          variants={headerVariants}
          ref={switchRef}
        >
          <motion.div
            className="inline-flex rounded-full bg-white p-1 shadow-md dark:bg-neutral-900"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ amount: 0.2 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <button
              className={`rounded-full px-6 py-2 text-sm font-medium transition-colors ${
                billingCycle === 'monthly'
                  ? 'bg-affair-600 text-white'
                  : 'text-affair-700 dark:text-affair-300'
              }`}
              onClick={() => handleToggle('monthly')}
            >
              Monthly
            </button>
            <button
              className={`rounded-full px-6 py-2 text-sm font-medium transition-colors ${
                billingCycle === 'annual'
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
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-3">
          {pricingPlans.map((plan) => (
            <motion.div
              key={plan.name}
              variants={cardVariants}
              initial="offscreen"
              whileInView="onscreen"
              viewport={{ amount: 0.2 }}
              custom={plan.delay}
              className={`overflow-hidden rounded-2xl border bg-white shadow-lg dark:bg-neutral-900 ${
                plan.isPopular
                  ? 'border-affair-500 relative transform border-2 md:scale-105'
                  : 'border-gray-100 dark:border-gray-800'
              } flex flex-col`}
            >
              {plan.isPopular && (
                <div className="bg-affair-500 absolute left-0 right-0 top-0 py-1 text-center text-xs font-bold text-white">
                  MOST POPULAR
                </div>
              )}

              <div
                className={`p-6 ${plan.isPopular ? 'pt-8' : ''} border-b border-gray-100 dark:border-gray-800`}
              >
                <div className="mb-2 flex items-center">
                  <h3
                    className={`${plan.isPopular ? 'text-xl font-bold' : 'text-lg font-semibold'} text-affair-700 dark:text-affair-300`}
                  >
                    {plan.name}
                  </h3>
                  {plan.isPopular && (
                    <Crown className="text-affair-500 ml-2 h-5 w-5" />
                  )}
                </div>
                <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                  {plan.description}
                </p>
                <div className="flex items-baseline">
                  <span
                    className={`${plan.isPopular ? 'text-5xl' : 'text-4xl'} font-bold text-gray-900 dark:text-white`}
                  >
                    <NumberFlow
                      value={
                        billingCycle === 'monthly'
                          ? plan.monthlyPrice
                          : plan.annualPrice
                      }
                      format={{
                        style: 'currency',
                        currency: 'USD',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      }}
                      transformTiming={{
                        duration: 500,
                        easing: 'ease-out',
                      }}
                      willChange
                      className="font-variant-numeric: tabular-nums"
                    />
                  </span>
                  <span className="ml-1 text-gray-500 dark:text-gray-400">
                    /{billingCycle === 'monthly' ? 'month' : 'year'}
                  </span>
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {billingCycle === 'monthly'
                    ? 'billed monthly'
                    : 'billed annually'}
                </p>
              </div>

              <div className="flex-grow p-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="text-affair-500 mr-2 mt-0.5 h-5 w-5 flex-shrink-0" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-6 pt-0">
                <Link href={plan.href}>
                  <motion.button
                    className={`w-full rounded-lg py-3 ${
                      plan.isPopular
                        ? 'bg-affair-600 hover:bg-affair-700 text-white'
                        : 'bg-affair-100 dark:bg-affair-900/30 text-affair-700 dark:text-affair-300 hover:bg-affair-200 dark:hover:bg-affair-800/50'
                    } text-sm font-medium transition-colors`}
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
          className="mb-16 mt-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.2 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          <h2 className="text-affair-800 mb-10 text-center text-2xl font-bold dark:text-white">
            Compare All Features
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full overflow-hidden rounded-xl bg-white shadow-lg dark:bg-neutral-900">
              <thead>
                <tr className="bg-affair-50 dark:bg-affair-900/30">
                  <th className="text-affair-700 dark:text-affair-300 px-6 py-4 text-left font-medium">
                    Feature
                  </th>
                  <th className="text-affair-700 dark:text-affair-300 px-6 py-4 text-center font-medium">
                    Hobby
                  </th>
                  <th className="text-affair-700 dark:text-affair-300 px-6 py-4 text-center font-medium">
                    Pro
                  </th>
                  <th className="text-affair-700 dark:text-affair-300 px-6 py-4 text-center font-medium">
                    Premium
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {[
                  {
                    name: 'Monthly Price',
                    hobby: '$19',
                    pro: '$49',
                    premium: '$99',
                  },
                  {
                    name: 'Annual Price',
                    hobby: '$190',
                    pro: '$470',
                    premium: '$950',
                  },
                  {
                    name: 'Credits',
                    hobby: '150',
                    pro: '700',
                    premium: '2,000',
                  },
                  {
                    name: 'Books',
                    hobby: '1',
                    pro: '10',
                    premium: 'Unlimited',
                  },
                  {
                    name: 'Pages per Book',
                    hobby: '10',
                    pro: '50',
                    premium: 'Unlimited',
                  },
                  {
                    name: 'AI Outlines',
                    hobby: '1',
                    pro: '10',
                    premium: 'Unlimited',
                  },
                  {
                    name: 'Export resolution',
                    hobby: 'Standard (300 DPI)',
                    pro: 'Standard (300 DPI)',
                    premium: 'Standard (300 DPI)',
                  },
                  { name: 'Blank Pages', hobby: '—', pro: '✓', premium: '✓' },
                  {
                    name: 'Color testing pages',
                    hobby: '—',
                    pro: '✓',
                    premium: '✓',
                  },
                  {
                    name: 'Cover page generator',
                    hobby: '—',
                    pro: '✓',
                    premium: '✓',
                  },
                  {
                    name: 'Custom Branding pages',
                    hobby: '—',
                    pro: '—',
                    premium: '✓',
                  },
                  {
                    name: 'Analytics dashboard',
                    hobby: '—',
                    pro: '—',
                    premium: '✓',
                  },
                  {
                    name: 'No credit card required',
                    hobby: '✓',
                    pro: '—',
                    premium: '—',
                  },
                  {
                    name: 'Support',
                    hobby: 'Email',
                    pro: 'Priority email',
                    premium: 'Priority email',
                  },
                ].map((feature, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 dark:hover:bg-neutral-800/30"
                  >
                    <td className="px-6 py-4 font-medium text-gray-800 dark:text-gray-200">
                      {feature.name}
                    </td>
                    <td className="px-6 py-4 text-center text-gray-600 dark:text-gray-400">
                      {feature.hobby}
                    </td>
                    <td className="px-6 py-4 text-center text-gray-600 dark:text-gray-400">
                      {feature.pro}
                    </td>
                    <td className="px-6 py-4 text-center text-gray-600 dark:text-gray-400">
                      {feature.premium}
                    </td>
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
