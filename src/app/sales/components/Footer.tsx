'use client';

import { motion, Variants } from 'framer-motion';
import { Heart } from 'lucide-react';

export const Footer = () => {
  // Animation variants
  const containerVariants: Variants = {
    offscreen: { opacity: 0 },
    onscreen: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    offscreen: { opacity: 0, y: 20 },
    onscreen: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 50,
        damping: 10,
      },
    },
  };


  return (
    <motion.footer
      initial="offscreen"
      whileInView="onscreen"
      viewport={{ amount: 0.1 }}
      className="dark:bg-affair-950 border-affair-100 dark:border-affair-900 border-t bg-white py-8"
    >
      <div className="container mx-auto px-4">
        <motion.div
          className="flex items-center justify-evenly"
          variants={containerVariants}
        >
          <motion.div
            className="text-affair-500 dark:text-affair-400 flex items-center gap-1 text-xs"
            variants={itemVariants}
          >
            <span>Made with</span>
            <Heart className="h-3 w-3 text-red-500" />
            <span className="mx-1">•</span>
            <span>
              © {new Date().getFullYear()} Aillustra - No Skills, No Problem.
            </span>
          </motion.div>
        </motion.div>
      </div>
    </motion.footer>
  );
};
