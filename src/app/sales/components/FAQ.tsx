'use client';

import { motion, Variants } from 'framer-motion';
import { ChevronDown, Sparkles } from 'lucide-react';
import { useState } from 'react';

// FAQ data structure
interface FAQItem {
  id: number;
  question: string;
  answer: string;
  delay: number;
}

export default function FAQ() {
  const [expandedQuestions, setExpandedQuestions] = useState<
    Record<number, boolean>
  >({});

  // FAQ data
  const faqData: FAQItem[] = [
    {
      id: 1,
      question: 'Do I need design skills to use Aillustra?',
      answer:
        "No design skills required! Aillustra's AI technology handles all the technical aspects of creating professional coloring book illustrations. Our platform is designed to be intuitive and user-friendly, allowing anyone to create stunning coloring books regardless of their artistic background.",
      delay: 0.1,
    },
    {
      id: 2,
      question: 'How do I create my first coloring book?',
      answer:
        'Creating your first coloring book is simple: 1) Describe your vision using our prompt system, 2) Let our AI generate illustrations based on your description, 3) Review and refine the results, 4) Compile your book with our drag-and-drop interface, 5) Export in print-ready formats, and 6) Publish to platforms like Amazon KDP.',
      delay: 0.2,
    },
    {
      id: 3,
      question:
        'What makes Aillustra different from other AI image generators?',
      answer:
        'Aillustra is specifically trained to create coloring book illustrations with clean, well-defined lines, properly spaced coloring areas, and no filled-in black sections. Unlike general AI image generators, our proprietary Aillustra-dev model understands the specific requirements of coloring books and optimizes illustrations accordingly.',
      delay: 0.3,
    },
    {
      id: 4,
      question: 'How much can I earn selling coloring books?',
      answer:
        'Many creators earn $10,000+ monthly selling AI-generated coloring books on platforms like Amazon KDP. Earnings vary based on factors like niche selection, book quality, marketing efforts, and pricing strategy. Our platform is designed to help you maximize your potential earnings through high-quality, market-ready content.',
      delay: 0.4,
    },
    {
      id: 5,
      question: 'How detailed can my prompts be?',
      answer:
        'We encourage detailed prompts! The more specific you are about themes, styles, target age groups, and visual elements, the better our AI can match your vision. Our system also provides prompt suggestions to help you create the most effective descriptions.',
      delay: 0.5,
    },
  ];

  // Toggle question expansion
  const toggleQuestion = (id: number) => {
    setExpandedQuestions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
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

  return (
    <motion.section
      initial="offscreen"
      whileInView="onscreen"
      viewport={{ amount: 0.1 }}
      className="from-affair-50 via-affair-100 to-affair-200 relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br py-10"
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

      <div className="relative z-10 mx-auto max-w-4xl px-4">
        <motion.div variants={headerVariants} className="mb-12 text-center">
          <motion.div
            className="my-8 inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 shadow-sm backdrop-blur-sm"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ amount: 0.3 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Sparkles className="text-affair-600 h-4 w-4" />
            <span className="text-affair-500 text-xs font-medium md:text-sm">
              Frequently Asked Questions
            </span>
          </motion.div>

          <motion.h2
            className="text-affair-800 mb-4 text-3xl font-bold md:text-4xl dark:text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ amount: 0.3 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Got Questions? We've Got Answers
          </motion.h2>

          <motion.div
            className="from-affair-700 to-affair-500 mx-auto h-1 w-24 rounded-full bg-gradient-to-r"
            initial={{ width: 0 }}
            whileInView={{ width: 96 }}
            viewport={{ amount: 0.3 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          />
        </motion.div>

        {/* FAQ Items */}
        <motion.div
          className="space-y-4"
          initial="offscreen"
          whileInView="onscreen"
          viewport={{ amount: 0.1 }}
        >
          {faqData.map((faq) => (
            <motion.div
              key={faq.id}
              variants={cardVariants}
              custom={faq.delay}
              className="overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-neutral-900"
            >
              <div className="grid h-full grid-cols-1">
                <button
                  className={`group flex w-full items-center justify-between p-5 text-left focus:outline-none ${expandedQuestions[faq.id] ? 'border-b border-gray-100 dark:border-gray-800' : ''}`}
                  onClick={() => toggleQuestion(faq.id)}
                  aria-expanded={expandedQuestions[faq.id] || false}
                >
                  <span className="group-hover:text-affair-600 dark:group-hover:text-affair-400 pr-8 font-medium text-gray-900 transition-colors dark:text-white">
                    {faq.question}
                  </span>
                  <motion.div
                    animate={{ rotate: expandedQuestions[faq.id] ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex-shrink-0 text-gray-400"
                  >
                    <ChevronDown className="h-5 w-5" />
                  </motion.div>
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ${expandedQuestions[faq.id] ? 'max-h-96' : 'max-h-0'}`}
                >
                  <div className="p-5">
                    <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Contact CTA */}
        <motion.div
          className="mt-12 rounded-xl p-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h3 className="mb-2 text-xl font-medium text-gray-800 dark:text-gray-200">
            Still have questions?
          </h3>
          <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
            We're here to help you create amazing coloring books with Aillustra
          </p>
          <motion.button
            className="bg-affair-600 hover:bg-affair-700 rounded-full px-6 py-2 text-sm font-medium text-white"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Contact Support
          </motion.button>
        </motion.div>
      </div>
    </motion.section>
  );
}
