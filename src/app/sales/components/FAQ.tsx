"use client";

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
  const [expandedQuestions, setExpandedQuestions] = useState<Record<number, boolean>>({});

  // FAQ data
  const faqData: FAQItem[] = [
    {
      id: 1,
      question: "Do I need design skills to use Aillustra?",
      answer: "No design skills required! Aillustra's AI technology handles all the technical aspects of creating professional coloring book illustrations. Our platform is designed to be intuitive and user-friendly, allowing anyone to create stunning coloring books regardless of their artistic background.",
      delay: 0.1
    },
    {
      id: 2,
      question: "How do I create my first coloring book?",
      answer: "Creating your first coloring book is simple: 1) Describe your vision using our prompt system, 2) Let our AI generate illustrations based on your description, 3) Review and refine the results, 4) Compile your book with our drag-and-drop interface, 5) Export in print-ready formats, and 6) Publish to platforms like Amazon KDP.",
      delay: 0.2
    },
    {
      id: 3,
      question: "What makes Aillustra different from other AI image generators?",
      answer: "Aillustra is specifically trained to create coloring book illustrations with clean, well-defined lines, properly spaced coloring areas, and no filled-in black sections. Unlike general AI image generators, our proprietary Aillustra-dev model understands the specific requirements of coloring books and optimizes illustrations accordingly.",
      delay: 0.3
    },
    {
      id: 4,
      question: "How much can I earn selling coloring books?",
      answer: "Many creators earn $10,000+ monthly selling AI-generated coloring books on platforms like Amazon KDP. Earnings vary based on factors like niche selection, book quality, marketing efforts, and pricing strategy. Our platform is designed to help you maximize your potential earnings through high-quality, market-ready content.",
      delay: 0.4
    },
    {
      id: 5,
      question: "How detailed can my prompts be?",
      answer: "We encourage detailed prompts! The more specific you are about themes, styles, target age groups, and visual elements, the better our AI can match your vision. Our system also provides prompt suggestions to help you create the most effective descriptions.",
      delay: 0.5
    },
  ];

  // Toggle question expansion
  const toggleQuestion = (id: number) => {
    setExpandedQuestions(prev => ({
      ...prev,
      [id]: !prev[id]
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

  return (
    <motion.section
      initial="offscreen"
      whileInView="onscreen"
      viewport={{ amount: 0.1 }}
      className="min-h-screen flex items-center justify-center py-10 relative overflow-hidden bg-gradient-to-br from-affair-50 via-affair-100 to-affair-200"
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

      <div className="max-w-4xl mx-auto relative z-10 px-4">
        <motion.div
          variants={headerVariants}
          className="text-center mb-12"
        >
          <motion.div
            className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm my-8"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ amount: 0.3 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Sparkles className="text-affair-600 w-4 h-4" />
            <span className="text-xs md:text-sm font-medium text-affair-500">Frequently Asked Questions</span>
          </motion.div>

          <motion.h2
            className="text-3xl md:text-4xl font-bold text-affair-800 dark:text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ amount: 0.3 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Got Questions? We've Got Answers
          </motion.h2>

          <motion.div
            className="w-24 h-1 bg-gradient-to-r from-affair-700 to-affair-500 rounded-full mx-auto"
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
              className="border border-gray-100 dark:border-gray-800 rounded-lg overflow-hidden bg-white dark:bg-neutral-900 shadow-sm"
            >
              <div className="grid grid-cols-1 h-full">
                <button
                  className={`w-full text-left p-5 flex justify-between items-center focus:outline-none group ${expandedQuestions[faq.id] ? 'border-b border-gray-100 dark:border-gray-800' : ''}`}
                  onClick={() => toggleQuestion(faq.id)}
                  aria-expanded={expandedQuestions[faq.id] || false}
                >
                  <span className="font-medium text-gray-900 dark:text-white group-hover:text-affair-600 dark:group-hover:text-affair-400 transition-colors pr-8">
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
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
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
          className="mt-12 p-6 rounded-xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200 mb-2">Still have questions?</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
            We're here to help you create amazing coloring books with Aillustra
          </p>
          <motion.button
            className="px-6 py-2 bg-affair-600 hover:bg-affair-700 text-white rounded-full text-sm font-medium"
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
