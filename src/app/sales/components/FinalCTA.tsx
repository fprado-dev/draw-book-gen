'use client';

import { Badge } from '@/components/ui/badge';
import { motion, Variants } from 'framer-motion';
import { Video, Wand2 } from 'lucide-react';
import { redirect } from 'next/navigation';

const CTAPage = () => {

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
    <motion.div
      initial="offscreen"
      whileInView="onscreen"
      viewport={{ amount: 0.1 }}
      className="howitworks-section container relative mx-auto flex min-h-screen items-center justify-center overflow-hidden px-4"
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

      <div className="relative z-10 max-w-5xl">
        <motion.div
          variants={headerVariants}
          className="flex flex-col items-center gap-8 text-center"
        >
          <motion.h2
            className="from-affair-700 to-affair-500 bg-gradient-to-r bg-clip-text text-4xl font-extrabold tracking-tight text-transparent md:text-6xl lg:text-8xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ amount: 0.3 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Ready to Start Your Coloring Book Journey?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ amount: 0.3 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-affair-800 w-full max-w-md text-pretty text-center text-sm leading-relaxed md:max-w-2xl md:text-lg"
          >
            Join thousands of creators who are earning passive income with
            Aillustra's AI-powered coloring book platform
          </motion.p>
          <motion.div
            className="from-affair-700 to-affair-500 mx-auto mb-12 h-1 w-24 rounded-full bg-gradient-to-r"
            initial={{ width: 0 }}
            whileInView={{ width: 96 }}
            viewport={{ amount: 0.3 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          />
        </motion.div>

        {/* CTA Box */}
        <motion.div
          className="from-affair-600 to-affair-800 rounded-2xl bg-gradient-to-br p-8 text-center text-white shadow-xl md:p-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.3 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <motion.p
            className="mx-auto mb-6 max-w-xl text-base text-white/90 sm:mb-8 sm:max-w-2xl sm:text-lg"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ amount: 0.3 }}
            transition={{ delay: 1.2, duration: 0.5 }}
          >
            Join thousands of creators who are already earning passive income
            with Aillustra. No design skills required, just your creativity and
            our AI technology.
          </motion.p>

          {renderCTA()}
        </motion.div>

        {/* Social Proof */}
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ amount: 0.3 }}
          transition={{ delay: 1.5, duration: 0.6 }}
        >
          <motion.p
            className="text-muted-foreground mb-4 text-xs"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.7 }}
            viewport={{ amount: 0.3 }}
            transition={{ delay: 1.6 }}
          >
            Trusted by over 10,000+ creators worldwide
          </motion.p>

          <div className="flex flex-wrap justify-center gap-2 opacity-60">
            {['Amazon KDP', 'Etsy', 'Lulu', 'IngramSpark'].map(
              (partner, index) => (
                <motion.div
                  key={partner}
                  className="text-muted-foreground mb-4 text-xs font-medium"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ amount: 0.3 }}
                  transition={{ delay: 1.7 + index * 0.1 }}
                >
                  <Badge variant="outline">{partner}</Badge>
                </motion.div>
              )
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CTAPage;

function renderCTA() {
  const buttonVariants: Variants = {
    offscreen: { opacity: 0, scale: 0.8 },
    onscreen: {
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        delay: 0.6,
      },
    },
    hover: {
      scale: 1.05,
      boxShadow: '0 10px 25px -5px rgba(127, 74, 136, 0.5)',
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 10,
      },
    },
    tap: {
      scale: 0.95,
    },
  };
  return (
    <div className="flex w-full justify-center gap-4">
      <motion.div className="flex gap-4 sm:flex-row">
        <motion.button
          className="text-primary flex min-w-[100px] cursor-pointer items-center justify-center rounded-full bg-white px-4 py-2 shadow-lg sm:px-8 sm:py-2 "
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          onClick={() => redirect('/sign-in')}
        >
          <Wand2 className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
          <span className="min-2xl:text-sm text-xs">Start Creating Now</span>
        </motion.button>
      </motion.div>
      <motion.div className="flex gap-4 sm:flex-row">
        <motion.button
          variants={buttonVariants}
          className="flex  min-w-[100px] cursor-pointer items-center justify-center rounded-full border border-white bg-transparent px-4 py-2 text-white shadow-lg sm:px-8 sm:py-2"
          whileHover="hover"
          whileTap="tap"
        >
          <Video className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
          <span className="min-2xl:text-sm text-xs">Watch Demo</span>
        </motion.button>
      </motion.div>
    </div>
  );
}
