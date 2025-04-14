import { AnimatePresence, motion, useInView } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote, Star, Users } from 'lucide-react';
import Image from 'next/image';
import { useRef, useState } from 'react';

const TestimonialsPage = () => {
  // Testimonial data
  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: "Children's Book Author",
      image: 'https://avatar.iran.liara.run/public/90', // Replace with actual image paths
      content:
        'Aillustra transformed my creative process. I went from spending weeks on illustrations to generating an entire coloring book in a single afternoon. The AI perfectly captures my style while maintaining the clean lines needed for coloring books.',
      rating: 5,
      earnings: '$12,500 monthly on Amazon KDP',
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'Digital Entrepreneur',
      image: 'https://avatar.iran.liara.run/public/47',
      content:
        'With zero artistic skills, I was able to create and publish 5 coloring books in my first month using Aillustra. The platform is intuitive, and the AI-generated illustrations are consistently high quality. My passive income has been growing steadily since day one.',
      rating: 5,
      earnings: '$8,700 monthly on Amazon KDP',
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      role: 'Art Teacher',
      image: 'https://avatar.iran.liara.run/public/36',
      content:
        'As an art teacher, I needed custom coloring pages for my students that aligned with our curriculum. Aillustra has been a game-changer for my classroom. I can quickly generate themed coloring books that engage my students and support their learning.',
      rating: 5,
      earnings: '$5,200 monthly on Amazon KDP',
    },
    {
      id: 4,
      name: 'David Thompson',
      role: 'Retired Accountant',
      image: 'https://avatar.iran.liara.run/public/17',
      content:
        "I started using Aillustra as a retirement hobby, but it quickly turned into a profitable side business. The platform makes it so easy to create professional coloring books that sell well. I'm now earning more in retirement than I expected!",
      rating: 4,
      earnings: '$7,300 monthly on Amazon KDP',
    },
    {
      id: 5,
      name: 'Priya Patel',
      role: 'Graphic Designer',
      image: 'https://avatar.iran.liara.run/public/26',
      content:
        'Even as a professional designer, I find Aillustra incredibly valuable. It speeds up my workflow and helps me explore new creative directions. The clean lines and well-defined spaces in the generated illustrations are perfect for coloring books.',
      rating: 5,
      earnings: '$15,200 monthly on Amazon KDP',
    },
    {
      id: 6,
      name: 'Gabriela Marinho',
      role: 'Kids Teacher',
      image: 'https://avatar.iran.liara.run/public/26',
      content:
        'Even as a professional designer, I find Aillustra incredibly valuable. It speeds up my workflow and helps me explore new creative directions. The clean lines and well-defined spaces in the generated illustrations are perfect for coloring books.',
      rating: 5,
      earnings: '$5,200 monthly on Etsy',
    },
  ];

  // State for featured testimonial
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  // Refs for scroll animations
  const headerRef = useRef(null);
  const statsRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true, amount: 0.5 });
  const isStatsInView = useInView(statsRef, { once: true, amount: 0.5 });

  // Navigation functions
  const nextTestimonial = () => {
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setDirection(-1);
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length
    );
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 },
    },
  };

  const cardVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.8,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
      scale: 0.8,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    }),
  };

  const floatingVariants = {
    initial: { y: 0 },
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <section className="h-screen overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          ref={headerRef}
          className="mb-16 text-center"
          variants={containerVariants}
          initial="hidden"
          animate={isHeaderInView ? 'visible' : 'hidden'}
        >
          <motion.div className="mb-4 inline-block" variants={itemVariants}>
            <motion.div
              className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#7f4a88]/10"
              animate={{
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <Users size={32} className="text-[#7f4a88]" />
            </motion.div>
          </motion.div>
          <motion.h2
            className="mb-4 text-4xl font-bold text-[#7f4a88] md:text-5xl"
            variants={itemVariants}
          >
            Success Stories
          </motion.h2>
          <motion.p
            className="mx-auto max-w-3xl text-xl text-gray-600"
            variants={itemVariants}
          >
            Hear from creators who transformed their ideas into profitable
            coloring books with Aillustra
          </motion.p>
        </motion.div>

        {/* Featured Testimonial */}
        <div className="relative mb-20">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={cardVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="mx-auto max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl"
            >
              <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Image Side */}
                <div className="relative h-80 bg-[#7f4a88]/10 md:h-auto">
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    <div className="relative h-48 w-48 overflow-hidden rounded-full border-4 border-white shadow-xl md:h-64 md:w-64">
                      <Image
                        src={testimonials[currentIndex].image}
                        alt={testimonials[currentIndex].name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </motion.div>
                  <motion.div
                    className="absolute bottom-6 left-6 right-6 rounded-xl bg-white/90 p-4 shadow-lg backdrop-blur-sm"
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                  >
                    <h3 className="text-xl font-bold text-[#7f4a88]">
                      {testimonials[currentIndex].name}
                    </h3>
                    <p className="text-gray-600">
                      {testimonials[currentIndex].role}
                    </p>
                    <div className="mt-2 flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={
                            i < testimonials[currentIndex].rating
                              ? 'fill-yellow-500 text-yellow-500'
                              : 'text-gray-300'
                          }
                        />
                      ))}
                    </div>
                  </motion.div>
                </div>

                {/* Content Side */}
                <div className="relative p-8 md:p-12">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  >
                    <Quote
                      size={48}
                      className="absolute left-6 top-6 text-[#7f4a88]/20"
                    />
                    <div className="relative z-10">
                      <p className="mb-8 text-xl leading-relaxed text-gray-700">
                        "{testimonials[currentIndex].content}"
                      </p>
                      <div className="inline-block rounded-xl bg-[#7f4a88]/10 p-4">
                        <motion.p
                          className="font-bold text-[#7f4a88]"
                          variants={floatingVariants}
                          initial="initial"
                          animate="animate"
                        >
                          Earning: {testimonials[currentIndex].earnings}
                        </motion.p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="pointer-events-none absolute left-0 right-0 top-1/2 flex -translate-y-1/2 justify-between px-4 md:px-8">
            <motion.button
              className="pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#7f4a88] shadow-lg"
              onClick={prevTestimonial}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronLeft size={24} />
            </motion.button>
            <motion.button
              className="pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#7f4a88] shadow-lg"
              onClick={nextTestimonial}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronRight size={24} />
            </motion.button>
          </div>
        </div>

        {/* Testimonial Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              className={`rounded-xl bg-white p-6 shadow-lg ${
                index === currentIndex ? 'ring-2 ring-[#7f4a88]' : ''
              }`}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true, amount: 0.3 }}
              whileHover={{
                y: -10,
                boxShadow:
                  '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              }}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1);
                setCurrentIndex(index);
              }}
            >
              <div className="mb-4 flex items-center">
                <div className="relative mr-4 h-12 w-12 overflow-hidden rounded-full">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">
                    {testimonial.name}
                  </h3>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
              <p className="mb-4 line-clamp-3 text-gray-700">
                "{testimonial.content}"
              </p>
              <div className="flex items-center justify-between">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={
                        i < testimonial.rating
                          ? 'fill-yellow-500 text-yellow-500'
                          : 'text-gray-300'
                      }
                    />
                  ))}
                </div>
                <motion.span
                  className="text-sm font-medium text-[#7f4a88]"
                  whileHover={{ scale: 1.05 }}
                >
                  View Details
                </motion.span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <motion.div
          ref={statsRef}
          className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          animate={isStatsInView ? 'visible' : 'hidden'}
        >
          {[
            { label: 'Happy Creators', value: '2,500+', icon: '👨‍🎨' },
            { label: 'Books Published', value: '12,000+', icon: '📚' },
            { label: 'Average Monthly Earnings', value: '$8,400', icon: '💰' },
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="rounded-xl bg-white p-8 text-center shadow-lg"
              variants={itemVariants}
              whileHover={{
                y: -10,
                boxShadow:
                  '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              }}
            >
              <motion.div
                className="mb-4 text-4xl"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 1,
                }}
              >
                {stat.icon}
              </motion.div>
              <motion.h3
                className="mb-2 text-3xl font-bold text-[#7f4a88]"
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{
                  opacity: 1,
                  scale: 1,
                  transition: {
                    type: 'spring',
                    stiffness: 100,
                  },
                }}
                viewport={{ once: true }}
              >
                {stat.value}
              </motion.h3>
              <p className="text-gray-600">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h3 className="mb-6 text-2xl font-bold text-[#7f4a88] md:text-3xl">
            Ready to Create Your Success Story?
          </h3>
          <motion.button
            className="rounded-full bg-[#7f4a88] px-8 py-4 text-lg font-medium text-white shadow-lg"
            whileHover={{
              scale: 1.05,
              boxShadow:
                '0 20px 25px -5px rgba(127, 74, 136, 0.4), 0 10px 10px -5px rgba(127, 74, 136, 0.1)',
            }}
            whileTap={{ scale: 0.98 }}
          >
            Start Creating Now
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsPage;
