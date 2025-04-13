import { AnimatePresence, motion, useInView, useScroll, useSpring, Variants } from "framer-motion";
import {
  BadgeDollarSign,
  Bot,
  ChevronRight,
  LucideTypeOutline,
  PencilRuler,
  Sparkles,
  Store,
  TypeOutline
} from "lucide-react";
import { useRef } from "react";

export const BentoBenefits = () => {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.1 });
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const opacity = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Benefits data with additional properties for layout
  const benefitsData = [
    {
      id: 1,
      icon: <PencilRuler className="text-white w-5 h-5" />,
      title: "No Design Skills Required",
      description:
        "Create professional coloring books without any prior design experience. Our AI handles all the technical aspects.",
      width: 1,
      height: 1,
      color: "bg-gradient-to-br from-affair-600 to-affair-800",
      delay: 0.1
    },
    {
      id: 2,
      icon: <TypeOutline className="text-white w-5 h-5" />,
      title: "Fast Creation Process",
      description:
        "Generate complete coloring books in minutes instead of weeks. Turn your ideas into print-ready pages instantly.",
      width: 2,
      height: 1,
      color: "bg-gradient-to-br from-affair-500 to-affair-700",
      delay: 0.2
    },
    {
      id: 3,
      icon: <Bot className="text-white w-5 h-5" />,
      title: "Specialized AI Technology",
      description:
        "Our proprietary Aillustra-dev model is specifically trained to create optimal coloring book illustrations with clean lines.",
      width: 1,
      height: 2,
      color: "bg-gradient-to-br from-affair-600 to-affair-800",
      delay: 0.3
    },
    {
      id: 4,
      icon: <LucideTypeOutline className="text-white w-5 h-5" />,
      title: "Consistent Quality",
      description:
        "Every page features well-defined lines, properly spaced coloring areas, and no filled-in black sections.",
      width: 1,
      height: 1,
      color: "bg-gradient-to-br from-affair-500 to-affair-700",
      delay: 0.4
    },
    {
      id: 5,
      icon: <BadgeDollarSign className="text-white w-5 h-5" />,
      title: "Lucrative Opportunity",
      description:
        "Tap into a market where creators earn $10,000+ monthly selling coloring books on publishing platforms.",
      width: 2,
      height: 1,
      color: "bg-gradient-to-br from-affair-600 to-affair-800",
      delay: 0.5
    },
    {
      id: 6,
      icon: <Store className="text-white w-5 h-5" />,
      title: "KDP Publishing Ready",
      description:
        "Generate pages optimized for Amazon KDP and other publishing platforms with the correct dimensions and formats.",
      width: 1,
      height: 1,
      color: "bg-gradient-to-br from-affair-500 to-affair-700",
      delay: 0.6
    },
  ];

  // Card variants for animations
  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.9,
      rotateX: 10
    },
    visible: (delay: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 15,
        delay: delay
      }
    }),
    exit: {
      opacity: 0,
      y: -30,
      scale: 0.9,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  // Header variants
  const headerVariants: Variants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        delay: 0.1
      }
    },
    exit: {
      opacity: 0,
      y: -30,
      transition: {
        duration: 0.3
      }
    }
  };

  // Floating background shapes
  const shapeVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
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
    <section
      ref={containerRef}
      className="benefits-section pt-10 relative overflow-hidden bg-affair-50/10"
      style={{
        minHeight: "100vh",
        perspective: "1000px"
      }}
    >
      {/* Animated background shapes */}
      <motion.div
        className="absolute top-20 left-10 w-64 h-64 rounded-full bg-affair-200 blur-3xl"
        variants={shapeVariants}
        initial="hidden"
        animate="visible"
      />
      <motion.div
        className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-affair-300 blur-3xl"
        variants={shapeVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.5 }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <AnimatePresence>
          {isInView && (
            <motion.div
              variants={headerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="text-center flex flex-col items-center justify-center gap-6 mb-16"
            >
              <motion.div
                className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm mb-2"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <Sparkles className="text-affair-600 w-4 h-4" />
                <span className="text-sm font-medium text-affair-900">Revolutionizing Coloring Book Creation</span>
              </motion.div>

              <motion.h2
                className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-affair-700 to-affair-500 tracking-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                Why Choose Us
              </motion.h2>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="text-lg text-affair-800 max-w-2xl text-balance leading-relaxed"
              >
                Transform your ideas into professional coloring books with our specialized AI technology.
                No design skills needed, just your creativity and our powerful tools.
              </motion.p>

              <motion.div
                className="w-24 h-1 bg-gradient-to-r from-affair-700 to-affair-500 rounded-full mt-2"
                initial={{ width: 0 }}
                animate={{ width: 96 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bento Grid with Masonry Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-7xl mx-auto px-4 sm:px-6">
          <AnimatePresence>
            {isInView && benefitsData.map((benefit) => (
              <motion.div
                key={benefit.id}
                className={`rounded-xl overflow-hidden shadow-md bg-white backdrop-blur-sm border border-affair-100
                           ${benefit.width > 1 ? 'sm:col-span-2' : ''} relative group`}
                variants={cardVariants}
                custom={benefit.delay}
                initial="hidden"
                animate="visible"
                exit="exit"
                whileHover={{
                  y: -5,
                  scale: 1.02,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                }}
              >
                <div className="p-4 sm:p-6 h-full flex flex-col">
                  <motion.div
                    className={`icon-container mb-4 p-3 ${benefit.color} inline-block rounded-xl shadow-md`}
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{
                      scale: 1,
                      rotate: 0,
                      transition: {
                        type: "spring",
                        stiffness: 200,
                        delay: benefit.delay + 0.2
                      }
                    }}
                    whileHover={{
                      scale: 1.2,
                      rotate: [0, -10, 10, -5, 0],
                      transition: { duration: 0.6 }
                    }}
                  >
                    {benefit.icon}
                  </motion.div>

                  <h3 className="text-xl font-bold text-affair-900 mb-2">{benefit.title}</h3>

                  <p className="text-affair-700 flex-grow text-sm">{benefit.description}</p>

                  <motion.div
                    className="mt-4 flex items-center text-sm font-medium text-affair-600 opacity-0 group-hover:opacity-100"
                    initial={{ x: -10, opacity: 0 }}
                    whileHover={{ x: 5 }}
                    animate={{ x: 0, opacity: 1, transition: { delay: benefit.delay + 0.4 } }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <span>Learn more</span>
                    <ChevronRight className="ml-1 w-4 h-4" />
                  </motion.div>
                </div>

                {/* Subtle gradient overlay */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-transparent to-affair-50 opacity-0 group-hover:opacity-100"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>


      </div>
    </section>
  );
};

export default BentoBenefits;
