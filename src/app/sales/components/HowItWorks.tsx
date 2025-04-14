import { motion, Variants } from "framer-motion";
import {
  BookOpen,
  BotIcon,
  Keyboard,
  ShoppingBag,
  Sliders
} from "lucide-react";

export const HowItWorks = () => {
  // Header variants
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

  // Floating background shapes
  const shapeVariants: Variants = {
    offscreen: { opacity: 0, scale: 0.8 },
    onscreen: {
      opacity: [0, 0.2, 0.1],
      scale: 1,
      transition: {
        duration: 2,
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
      className="howitworks-section min-h-screen flex items-center justify-center py-10 relative overflow-hidden"
    >
      {/* Animated background shapes */}
      <motion.div
        className="absolute top-9 left-10 w-64 h-64 rounded-full bg-affair-200 blur-3xl"
        variants={shapeVariants}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-affair-300 blur-3xl"
        variants={shapeVariants}
        transition={{ delay: 0.5 }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          variants={headerVariants}
          className="text-center flex flex-col items-center justify-center gap-6 mb-16"
        >
          <motion.h2
            className="text-4xl md:text-6xl lg:text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-affair-700 to-affair-500 tracking-tight px-4"
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
            className="text-pretty text-sm md:text-lg text-affair-800 max-w-md md:max-w-2xl leading-relaxed"

          >
            Unleash your creativity into stunning coloring books with our cutting-edge AI technology.
            watch your ideas transform into professional designs instantly.
          </motion.p>

          <motion.div
            className="w-24 h-1 bg-gradient-to-r from-affair-700 to-affair-500 rounded-full mt-2"
            initial={{ width: 0 }}
            whileInView={{ width: 96 }}
            viewport={{ amount: 0.3 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          />
        </motion.div>

        {/* Bento Grid with Masonry Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 relative z-10 max-w-7xl mx-auto py-0">
          {steps.map((step, index) => (
            <Step key={step.title} size={steps.length} {...step} index={index} />
          ))}
        </div>
      </div>
    </motion.section>
  );
};

const steps = [
  {
    title: "Describe Your Vision",
    description:
      "Enter a detailed description of the coloring book you want to create. Specify themes, styles, and target audience.",
    icon: <Keyboard />,
    hasStackedCards: true,
  },
  {
    title: "AI Generation",
    description:
      "Our Aillustra-dev AI model processes your description and generates professional coloring book illustrations with clean, well-defined lines.",
    icon: <BotIcon />,
    hasStackedCards: false,
  },
  {
    title: "Review & Refine",
    description:
      "Preview your generated illustrations, make adjustments, and regenerate any pages until you're completely satisfied with the results.",
    icon: <Sliders />,
    hasStackedCards: false,
  },
  {
    title: "Compile Your Book",
    description:
      "Arrange your illustrations, add a cover page, and organize your coloring book with our intuitive drag-and-drop interface.",
    icon: <BookOpen />,
    hasStackedCards: false,
  },
  {
    title: "Publish & Distribute",
    description:
      "Export your coloring book in print-ready formats optimized for Amazon KDP and other publishing platforms with a single click.",
    icon: <ShoppingBag />,
    hasStackedCards: true,
  },
  {
    title: "Distribute & Sell",
    description:
      "Once your coloring book is published, you can distribute it through various channels, including Amazon KDP, bookstores, and online platforms.",
    icon: <ShoppingBag />,
    hasStackedCards: false,
  }
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
    onscreen: (delay: number) => ({
      opacity: 1,
      y: 0,
    })
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="offscreen"
      whileInView="onscreen"
      viewport={{ amount: 0.1 }}
      custom={index * 0.1}
      className="flex flex-col gap-8 md:gap-16 border p-4 md:p-6 relative group/feature transition-all duration-200 hover:shadow-lg bg-white overflow-x-hidden"
    >
      <div>
        <div className="mb-4 relative z-10 text-[#7f4a88] dark:text-[#e39774]">
          {icon}
        </div>
        <div className="text-lg font-bold mb-2 relative z-10">
          <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-[#7f4a88] dark:bg-[#e39774] group-hover/feature:bg-[#e39774] dark:group-hover/feature:bg-[#7f4a88] transition-all duration-200 origin-center" />
          <span className="group-hover/feature:translate-x-2 pl-4 transition duration-200 inline-block text-neutral-800 dark:text-neutral-100">
            {index + 1}. {title}
          </span>
        </div>
        <p className="text-sm text-neutral-600 dark:text-neutral-300 relative z-10">
          {description}
        </p>
      </div>
    </motion.div>
  );
};
