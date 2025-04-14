"use client";

import { Badge } from '@/components/ui/badge';
import { motion, Variants } from 'framer-motion';
import { CheckCircle, Star, Video, Wand2, Zap } from 'lucide-react';
import { redirect } from 'next/navigation';

const CTAPage = () => {
  // Features data
  const features = [
    {
      title: "AI-Powered Creation",
      description: "Generate professional coloring book illustrations in minutes with our specialized AI model",
      icon: <Zap className="w-5 h-5 text-white" />,
      delay: 0.2
    },
    {
      title: "No Design Skills Required",
      description: "Create stunning coloring books without any artistic background or technical knowledge",
      icon: <CheckCircle className="w-5 h-5 text-white" />,
      delay: 0.3
    },
    {
      title: "KDP Ready Exports",
      description: "Export print-ready files optimized for Amazon KDP and other publishing platforms",
      icon: <Star className="w-5 h-5 text-white" />,
      delay: 0.4
    }
  ];

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
    <motion.div
      initial="offscreen"
      whileInView="onscreen"
      viewport={{ amount: 0.1 }}
      className="howitworks-section mx-auto container px-4 min-h-screen flex items-center justify-center relative overflow-hidden"
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

      <div className="max-w-5xl relative z-10">
        <motion.div
          variants={headerVariants}
          className="text-center flex flex-col items-center gap-8"
        >
          <motion.h2
            className="text-4xl md:text-6xl lg:text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-affair-700 to-affair-500 tracking-tight"
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
            className="text-pretty text-center w-full text-sm md:text-lg text-affair-800 max-w-md md:max-w-2xl leading-relaxed"
          >
            Join thousands of creators who are earning passive income with Aillustra's AI-powered coloring book platform

          </motion.p>
          <motion.div
            className="w-24 h-1 bg-gradient-to-r from-affair-700 to-affair-500 rounded-full mx-auto mb-12"
            initial={{ width: 0 }}
            whileInView={{ width: 96 }}
            viewport={{ amount: 0.3 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          />
        </motion.div>

        {/* CTA Box */}
        <motion.div
          className="bg-gradient-to-br from-affair-600 to-affair-800 rounded-2xl p-8 md:p-12 text-white text-center shadow-xl"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.3 }}
          transition={{ delay: 1, duration: 0.6 }}
        >


          <motion.p
            className="text-white/90 text-base sm:text-lg mb-6 sm:mb-8 max-w-xl sm:max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ amount: 0.3 }}
            transition={{ delay: 1.2, duration: 0.5 }}
          >
            Join thousands of creators who are already earning passive income with Aillustra. No design skills required, just your creativity and our AI technology.
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
            className="text-xs text-muted-foreground mb-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.7 }}
            viewport={{ amount: 0.3 }}
            transition={{ delay: 1.6 }}
          >
            Trusted by over 10,000+ creators worldwide
          </motion.p>

          <div className="flex flex-wrap justify-center gap-2 opacity-60">
            {["Amazon KDP", "Etsy", "Lulu", "IngramSpark"].map((partner, index) => (
              <motion.div
                key={partner}
                className="text-xs text-muted-foreground font-medium mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ amount: 0.3 }}
                transition={{ delay: 1.7 + (index * 0.1) }}
              >
                <Badge variant="outline">{partner}</Badge>
              </motion.div>
            ))}
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
        type: "spring",
        stiffness: 100,
        delay: 0.6
      }
    },
    hover: {
      scale: 1.05,
      boxShadow: "0 10px 25px -5px rgba(127, 74, 136, 0.5)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    },
    tap: {
      scale: 0.95
    }
  };
  return <div className='flex gap-4 w-full justify-center'>
    <motion.div

      className="flex sm:flex-row gap-4"
    >
      <motion.button
        className="cursor-pointer px-4 sm:px-8 py-2 sm:py-2 bg-white text-primary rounded-full shadow-lg flex items-center justify-center min-w-[100px] "
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        onClick={() => redirect("/sign-in")}
      >
        <Wand2 className="mr-2 w-3 h-3 sm:w-4 sm:h-4" />
        <span className='text-xs min-2xl:text-sm'>Start Creating Now</span>
      </motion.button>
    </motion.div>
    <motion.div
      className="flex sm:flex-row gap-4"

    >
      <motion.button
        variants={buttonVariants}
        className="cursor-pointer  px-4 sm:px-8 py-2 sm:py-2 border-white border bg-transparent text-white rounded-full shadow-lg flex items-center justify-center min-w-[100px]"
        whileHover="hover"
        whileTap="tap"
      >
        <Video className="mr-2 w-3 h-3 sm:w-4 sm:h-4" />
        <span className='text-xs min-2xl:text-sm'>Watch Demo</span>
      </motion.button>
    </motion.div>
  </div>;
}