"use client";

import { motion, Variants } from 'framer-motion';
import { Github, Heart, Instagram, Mail, Twitter } from 'lucide-react';

export const Footer = () => {
  // Animation variants
  const containerVariants: Variants = {
    offscreen: { opacity: 0 },
    onscreen: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants: Variants = {
    offscreen: { opacity: 0, y: 20 },
    onscreen: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 50,
        damping: 10
      }
    }
  };

  const socialVariants: Variants = {
    offscreen: { opacity: 0, scale: 0.8 },
    onscreen: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    },
    hover: {
      scale: 1.2,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };

  // Social media links
  const socialLinks = [
    { icon: <Twitter className="w-4 h-4" />, href: "#twitter", label: "Twitter" },
    { icon: <Instagram className="w-4 h-4" />, href: "#instagram", label: "Instagram" },
    { icon: <Github className="w-4 h-4" />, href: "#github", label: "GitHub" },
    { icon: <Mail className="w-4 h-4" />, href: "#contact", label: "Contact" }
  ];

  return (
    <motion.footer
      initial="offscreen"
      whileInView="onscreen"
      viewport={{ amount: 0.1 }}
      className="bg-white dark:bg-affair-950 py-8 border-t border-affair-100 dark:border-affair-900"
    >
      <div className="container mx-auto px-4">
        <motion.div
          className="flex items-center justify-evenly"
          variants={containerVariants}
        >

          <motion.div
            className="text-xs text-affair-500 dark:text-affair-400 flex items-center gap-1"
            variants={itemVariants}
          >
            <span>Made with</span>
            <Heart className="w-3 h-3 text-red-500" />
            <span className="mx-1">•</span>
            <span>© {new Date().getFullYear()} Aillustra - No Skills, No Problem.</span>

          </motion.div>



        </motion.div>
      </div>
    </motion.footer>
  );
};

