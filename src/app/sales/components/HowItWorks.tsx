import { motion, Variants } from 'framer-motion';
import {
  BookOpen,
  BotIcon,
  Keyboard,
  ShoppingBag,
  Sliders,
} from 'lucide-react';

export const HowItWorks = () => {
  // Header variants
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

  // Floating background shapes
  const shapeVariants: Variants = {
    offscreen: { opacity: 0, scale: 0.8 },
    onscreen: {
      opacity: [0, 0.2, 0.1],
      scale: 1,
      transition: {
        duration: 2,
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
      className="howitworks-section relative flex min-h-screen items-center justify-center overflow-hidden py-10"
    >
      {/* Animated background shapes */}
      <motion.div
        className="bg-affair-200 absolute left-10 top-9 h-64 w-64 rounded-full blur-3xl"
        variants={shapeVariants}
      />
      <motion.div
        className="bg-affair-300 absolute bottom-20 right-10 h-80 w-80 rounded-full blur-3xl"
        variants={shapeVariants}
        transition={{ delay: 0.5 }}
      />

      <div className="container relative z-10 mx-auto px-4">
        <motion.div
          variants={headerVariants}
          className="mb-16 flex flex-col items-center justify-center gap-6 text-center"
        >
          <motion.h2
            className="from-affair-700 to-affair-500 bg-gradient-to-r bg-clip-text px-4 text-4xl font-extrabold tracking-tight text-transparent md:text-6xl lg:text-8xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ amount: 0.3 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            How it works
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ amount: 0.3 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-affair-800 max-w-md text-pretty text-sm leading-relaxed md:max-w-2xl md:text-lg"
          >
            Unleash your creativity into stunning coloring books with our
            cutting-edge AI technology. watch your ideas transform into
            professional designs instantly.
          </motion.p>

          <motion.div
            className="from-affair-700 to-affair-500 mt-2 h-1 w-24 rounded-full bg-gradient-to-r"
            initial={{ width: 0 }}
            whileInView={{ width: 96 }}
            viewport={{ amount: 0.3 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          />
        </motion.div>

        {/* Bento Grid with Masonry Layout */}
        <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 gap-4 py-0 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {steps.map((step, index) => (
            <Step
              key={step.title}
              size={steps.length}
              {...step}
              index={index}
            />
          ))}
        </div>
      </div>
    </motion.section>
  );
};

const steps = [
  {
    title: 'Describe Your Vision',
    description:
      'Enter a detailed description of the coloring book you want to create. Specify themes, styles, and target audience.',
    icon: <Keyboard />,
    hasStackedCards: true,
  },
  {
    title: 'AI Generation',
    description:
      'Our Aillustra-dev AI model processes your description and generates professional coloring book illustrations with clean, well-defined lines.',
    icon: <BotIcon />,
    hasStackedCards: false,
  },
  {
    title: 'Review & Refine',
    description:
      "Preview your generated illustrations, make adjustments, and regenerate any pages until you're completely satisfied with the results.",
    icon: <Sliders />,
    hasStackedCards: false,
  },
  {
    title: 'Compile Your Book',
    description:
      'Arrange your illustrations, add a cover page, and organize your coloring book with our intuitive drag-and-drop interface.',
    icon: <BookOpen />,
    hasStackedCards: false,
  },
  {
    title: 'Publish & Distribute',
    description:
      'Export your coloring book in print-ready formats optimized for Amazon KDP and other publishing platforms with a single click.',
    icon: <ShoppingBag />,
    hasStackedCards: true,
  },
  {
    title: 'Distribute & Sell',
    description:
      'Once your coloring book is published, you can distribute it through various channels, including Amazon KDP, bookstores, and online platforms.',
    icon: <ShoppingBag />,
    hasStackedCards: false,
  },
];

const Step = ({
  title,
  description,
  icon,
  index,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
  size: number;
  hasStackedCards: boolean;
}) => {
  // Card variants for animations
  const cardVariants = {
    offscreen: {
      opacity: 0,
      y: 50,
    },
    onscreen: () => ({
      opacity: 1,
      y: 0,
    }),
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="offscreen"
      whileInView="onscreen"
      viewport={{ amount: 0.1 }}
      custom={index * 0.1}
      className="group/feature relative flex flex-col gap-8 overflow-x-hidden border bg-white p-4 transition-all duration-200 hover:shadow-lg md:gap-16 md:p-6"
    >
      <div>
        <div className="relative z-10 mb-4 text-[#7f4a88] dark:text-[#e39774]">
          {icon}
        </div>
        <div className="relative z-10 mb-2 text-lg font-bold">
          <div className="absolute inset-y-0 left-0 h-6 w-1 origin-center rounded-br-full rounded-tr-full bg-[#7f4a88] transition-all duration-200 group-hover/feature:h-8 group-hover/feature:bg-[#e39774] dark:bg-[#e39774] dark:group-hover/feature:bg-[#7f4a88]" />
          <span className="inline-block pl-4 text-neutral-800 transition duration-200 group-hover/feature:translate-x-2 dark:text-neutral-100">
            {index + 1}. {title}
          </span>
        </div>
        <p className="relative z-10 text-sm text-neutral-600 dark:text-neutral-300">
          {description}
        </p>
      </div>
    </motion.div>
  );
};
