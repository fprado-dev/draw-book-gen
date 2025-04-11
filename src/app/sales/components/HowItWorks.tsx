import { motion, useAnimation, useInView } from "framer-motion";
import {
  BookCopy,
  BookOpen,
  ChevronRight,
  DollarSign,
  Palette,
  Pencil,
  ShoppingCart,
  Sparkles,
  Upload,
  Wand2
} from "lucide-react";
import { useEffect, useRef } from "react";

export const HowItWorks = () => {
  // Animation controls for the timeline
  const timelineControls = useAnimation();
  const stepsControls = useAnimation();

  // Refs for intersection observer
  const timelineRef = useRef(null);
  const isInView = useInView(timelineRef, { once: false, amount: 0.2 });

  // Steps data with icons and descriptions
  const steps = [
    {
      icon: <Wand2 size={28} />,
      title: "Generate Ideas",
      description: "Describe your coloring book concept and let our AI generate professional illustrations.",
      color: "bg-blue-500",
      iconBg: "bg-blue-100"
    },
    {
      icon: <Pencil size={28} />,
      title: "Refine Designs",
      description: "Our AI creates clean, well-defined lines perfect for coloring books with properly spaced areas.",
      color: "bg-purple-500",
      iconBg: "bg-purple-100"
    },
    {
      icon: <BookCopy size={28} />,
      title: "Compile Book",
      description: "Organize your pages into a complete coloring book with our easy-to-use interface.",
      color: "bg-green-500",
      iconBg: "bg-green-100"
    },
    {
      icon: <Upload size={28} />,
      title: "Publish & Sell",
      description: "Export your book in KDP-ready format and start selling on Amazon and other platforms.",
      color: "bg-amber-500",
      iconBg: "bg-amber-100"
    }
  ];

  // Timeline animation when component comes into view
  useEffect(() => {
    if (isInView) {
      timelineControls.start({
        scaleY: 1,
        transition: { duration: 1.5, ease: "easeOut" }
      });

      stepsControls.start(i => ({
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.5,
          delay: 0.3 + i * 0.2,
          ease: "easeOut"
        }
      }));
    } else {
      timelineControls.start({ scaleY: 0 });
      stepsControls.start({ opacity: 0, y: 50 });
    }
  }, [isInView, timelineControls, stepsControls]);

  return (
    <section className="py-20 min-h-screen bg-gradient-to-b from-gray-50 to-white" ref={timelineRef}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-800 mb-4">How Aillustra Works</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Create professional coloring books in four simple steps with our AI-powered platform
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Vertical timeline line */}
          <motion.div
            className="absolute left-1/2 top-0 bottom-0 w-1 bg-gray-200 -z-10 origin-top hidden lg:block"
            style={{ left: "calc(50% - 0.5px)" }}
            initial={{ scaleY: 0 }}
            animate={timelineControls}
          />

          {/* Step cards */}
          {steps.map((step, index) => (
            <motion.div
              key={index}
              custom={index}
              initial={{ opacity: 0, y: 50 }}
              animate={stepsControls}
              className="relative"
            >
              <div className="bg-white rounded-xl p-6 shadow-lg h-full flex flex-col">
                {/* Step number with connecting line */}
                <div className="flex items-center justify-center mb-6 relative">
                  <motion.div
                    className={`w-16 h-16 rounded-full ${step.iconBg} flex items-center justify-center relative z-10`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <span className={`text-${step.color.split('-')[1]}-600`}>{step.icon}</span>
                  </motion.div>

                  {/* Horizontal connector line (visible only on larger screens) */}
                  {index < steps.length - 1 && (
                    <motion.div
                      className="absolute top-1/2 left-full w-full h-1 bg-gray-200 -z-10 hidden lg:block"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.7, delay: 0.5 + index * 0.2 }}
                      style={{ transformOrigin: "left" }}
                    />
                  )}

                  {/* Step number badge */}
                  <motion.div
                    className={`absolute -top-2 -right-2 w-8 h-8 rounded-full ${step.color} text-white flex items-center justify-center text-sm font-bold z-20`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.7 + index * 0.2 }}
                  >
                    {index + 1}
                  </motion.div>
                </div>

                <h3 className="text-xl font-bold mb-3 text-gray-800">{step.title}</h3>
                <p className="text-gray-600 mb-4">{step.description}</p>

                {/* Animated arrow to next step */}
                {index < steps.length - 1 && (
                  <motion.div
                    className="mt-auto flex justify-end text-gray-400 lg:hidden"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    <ChevronRight />
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Results section */}
        <motion.div
          className="mt-16 bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-2xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 30 }}
          transition={{ duration: 0.7, delay: 1.2 }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0 md:mr-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <Sparkles className="mr-2 text-amber-500" size={24} />
                Start Earning with Your Creativity
              </h3>
              <p className="text-gray-700 mb-6">
                Join creators who earn $10,000+ monthly selling AI-generated coloring books on Amazon KDP and other platforms.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 px-8 rounded-full shadow-lg flex items-center"
              >
                <ShoppingCart className="mr-2" size={20} />
                Start Creating Now
              </motion.button>
            </div>
            <div className="flex space-x-4">
              {[
                { label: "Average Creation Time", value: "15 min", icon: <BookOpen size={20} className="text-blue-500" /> },
                { label: "Potential Monthly Earnings", value: "$10,000+", icon: <DollarSign size={20} className="text-green-500" /> },
                { label: "Design Skills Required", value: "None", icon: <Palette size={20} className="text-purple-500" /> }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -5 }}
                  className="bg-white p-4 rounded-lg shadow-md text-center"
                >
                  <div className="flex justify-center mb-2">{stat.icon}</div>
                  <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

