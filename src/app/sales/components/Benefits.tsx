import { motion, Variants } from 'framer-motion';
import { Bot, PencilRuler, Sparkles, TypeOutline } from 'lucide-react';

export const Benefits = () => {
  // Benefits data with additional properties for layout
  const benefitsData = [
    {
      id: 1,
      icon: <PencilRuler className="h-5 w-5 text-white" />,
      title: 'No Design Skills Required',
      description:
        'Create professional coloring books without any prior design experience. Our AI handles all the technical aspects.',
      width: 1,
      height: 1,
      color: 'bg-gradient-to-br from-affair-600 to-affair-800',
      delay: 0.1,
    },
    {
      id: 2,
      icon: <TypeOutline className="h-5 w-5 text-white" />,
      title: 'Fast Creation Process',
      description:
        'Generate complete coloring books in minutes instead of weeks. Turn your ideas into print-ready pages instantly.',
      width: 2,
      height: 1,
      color: 'bg-gradient-to-br from-affair-500 to-affair-700',
      delay: 0.2,
    },
    {
      id: 3,
      icon: <Bot className="h-5 w-5 text-white" />,
      title: 'Specialized AI Technology',
      description:
        'Our proprietary Aillustra-dev model is specifically trained to create optimal coloring book illustrations with clean lines.',
      width: 1,
      height: 2,
      color: 'bg-gradient-to-br from-affair-600 to-affair-800',
      delay: 0.3,
    },
  ];

  // Card variants for animations
  const cardVariants = {
    offscreen: {
      opacity: 0,
      y: 50,
      scale: 0.9,
      rotate: -5,
    },
    onscreen: (delay: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      rotate: 0,
      transition: {
        type: 'spring',
        stiffness: 80,
        damping: 15,
        delay: delay,
      },
    }),
  };

  // Header variants
  const headerVariants = {
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
      viewport={{ amount: 0.3 }}
      className="benefits-section from-affair-50 via-affair-100 to-affair-200 relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br py-10"
    >
      {/* Animated background shapes */}
      <motion.div
        className="bg-affair-200 absolute left-10 top-9 h-64 w-64 rounded-full blur-3xl"
        variants={shapeVariants}
      />
      <motion.div
        className="bg-affair-300 absolute bottom-20 right-10 h-80 w-80 rounded-full blur-3xl"
        variants={shapeVariants}
      />

      <div className="container relative z-10 mx-auto px-4">
        <motion.div
          variants={headerVariants}
          className="mb-16 flex flex-col items-center justify-center gap-6 text-center"
        >
          <motion.div
            className="my-4 inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 shadow-sm backdrop-blur-sm md:my-0"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ amount: 0.3 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Sparkles className="text-affair-600 h-4 w-4" />
            <span className="text-affair-500 text-xs font-medium md:text-sm">
              Revolutionizing Coloring Book Creation
            </span>
          </motion.div>

          <motion.h2
            className="from-affair-700 to-affair-500 bg-gradient-to-r bg-clip-text text-4xl font-extrabold tracking-tight text-transparent md:text-6xl lg:text-8xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ amount: 0.3 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Why Choose Us
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ amount: 0.3 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-affair-800 max-w-md text-pretty text-sm leading-relaxed md:max-w-2xl md:text-lg"
          >
            Transform your ideas into professional coloring books with our
            specialized AI technology. No design skills needed, just your
            creativity and our powerful tools.
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
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-4 sm:grid-cols-2 sm:gap-6 sm:px-6 lg:grid-cols-4">
          {benefitsData.map((benefit) => (
            <motion.div
              key={benefit.id}
              className={`border-affair-100 overflow-hidden rounded-xl border bg-white shadow-md backdrop-blur-sm
                         ${benefit.width > 1 ? 'sm:col-span-2' : ''} group relative`}
              variants={cardVariants}
              custom={benefit.delay}
              whileHover={{
                y: -5,
                rotate: [0, 1, -1, 0],
                boxShadow:
                  '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              }}
            >
              <div className="flex h-full flex-col p-4 sm:p-6">
                <motion.div
                  className={`icon-container mb-4 p-3 ${benefit.color} inline-block rounded-xl shadow-md`}
                  whileHover={{
                    scale: 1.2,
                    rotate: [0, -10, 10, -5, 0],
                    transition: { duration: 0.6 },
                  }}
                >
                  {benefit.icon}
                </motion.div>

                <h3 className="text-affair-900 mb-2 text-xl font-bold">
                  {benefit.title}
                </h3>

                <p className="text-affair-700 flex-grow text-sm">
                  {benefit.description}
                </p>
              </div>

              {/* Subtle gradient overlay */}
              <motion.div
                className="to-affair-50 absolute inset-0 bg-gradient-to-br from-transparent opacity-0 group-hover:opacity-100"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};
