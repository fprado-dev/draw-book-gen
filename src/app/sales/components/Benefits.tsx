import { motion } from "framer-motion";
import { BadgeDollarSign, Bot, LucideTypeOutline, PencilRuler, Store, TypeOutline } from "lucide-react";

export const Benefits = () => {
  // Container variants for staggered children animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  // Individual card variants
  const cardVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  // Hover animation for cards
  const hoverVariants = {
    hover: {
      scale: 1.05,
      boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.1)",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
  };

  // Icon animation
  const iconVariants = {
    hidden: { scale: 0 },
    visible: {
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        delay: 0.2,
      },
    },
    hover: {
      rotate: [0, -10, 10, -10, 0],
      transition: {
        duration: 0.5,
      },
    },
  };

  // Benefits data
  const benefitsData = [
    {
      icon: <PencilRuler className="text-white w-5 h-5" />,
      title: "No Design Skills Required",
      description:
        "Create professional coloring books without any prior design experience. Our AI handles all the technical aspects.",
    },
    {
      icon: <TypeOutline className="text-white w-5 h-5" />,
      title: "Fast Creation Process",
      description:
        "Generate complete coloring books in minutes instead of weeks. Turn your ideas into print-ready pages instantly.",
    },
    {
      icon: <Bot className="text-white w-5 h-5" />,
      title: "Specialized AI Technology",
      description:
        "Our proprietary Aillustra-dev model is specifically trained to create optimal coloring book illustrations with clean lines.",
    },
    {
      icon: <LucideTypeOutline className="text-white w-5 h-5" />,
      title: "Consistent Quality",
      description:
        "Every page features well-defined lines, properly spaced coloring areas, and no filled-in black sections.",
    },
    {
      icon: <BadgeDollarSign className="text-white w-5 h-5" />,
      title: "Lucrative Opportunity",
      description:
        "Tap into a market where creators earn $10,000+ monthly selling coloring books on publishing platforms.",
    },
    {
      icon: <Store className="text-white w-5 h-5" />,
      title: "KDP Publishing Ready",
      description:
        "Generate pages optimized for Amazon KDP and other publishing platforms with the correct dimensions and formats.",
    },
  ];

  return (
    <section className="benefits-section h-screen">
      <div className="flex flex-col gap-8 mx-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center flex flex-col items-center justify-center gap-4"
        >
          <h2 className="text-4xl text-primary tracking-tighter font-bold">Why Choose us</h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-base text-muted-foreground max-w-3xl text-balance"
          >
            Transform your ideas into professional coloring books with our specialized AI technology.
            No design skills needed, just your creativity.
          </motion.p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2"
        >
          {benefitsData.map((benefit, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              className="bg-white rounded-xl p-8 border border-gray-100"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              whileHover={hoverVariants.hover}
            >
              <motion.div
                className="icon-container mb-6 p-4 bg-primary inline-block rounded-full"
                variants={iconVariants}
                whileHover="hover"
              >
                <span className="text-primary">{benefit.icon}</span>
              </motion.div>
              <h3 className="text-xl font-bold text-primary mb-3">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.description}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-8 rounded-full shadow-lg"
          >
            Start Creating Now
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default Benefits;





