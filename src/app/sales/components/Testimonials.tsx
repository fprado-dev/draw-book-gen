import { AnimatePresence, motion, useInView } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote, Star, Users } from 'lucide-react';
import Image from 'next/image';
import { useRef, useState } from 'react';

const TestimonialsPage = () => {
  // Testimonial data
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Children's Book Author",
      image: "https://avatar.iran.liara.run/public/90", // Replace with actual image paths
      content: "Aillustra transformed my creative process. I went from spending weeks on illustrations to generating an entire coloring book in a single afternoon. The AI perfectly captures my style while maintaining the clean lines needed for coloring books.",
      rating: 5,
      earnings: "$12,500 monthly on Amazon KDP"
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Digital Entrepreneur",
      image: "https://avatar.iran.liara.run/public/47",
      content: "With zero artistic skills, I was able to create and publish 5 coloring books in my first month using Aillustra. The platform is intuitive, and the AI-generated illustrations are consistently high quality. My passive income has been growing steadily since day one.",
      rating: 5,
      earnings: "$8,700 monthly on Amazon KDP"
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      role: "Art Teacher",
      image: "https://avatar.iran.liara.run/public/36",
      content: "As an art teacher, I needed custom coloring pages for my students that aligned with our curriculum. Aillustra has been a game-changer for my classroom. I can quickly generate themed coloring books that engage my students and support their learning.",
      rating: 5,
      earnings: "$5,200 monthly on Amazon KDP"
    },
    {
      id: 4,
      name: "David Thompson",
      role: "Retired Accountant",
      image: "https://avatar.iran.liara.run/public/17",
      content: "I started using Aillustra as a retirement hobby, but it quickly turned into a profitable side business. The platform makes it so easy to create professional coloring books that sell well. I'm now earning more in retirement than I expected!",
      rating: 4,
      earnings: "$7,300 monthly on Amazon KDP"
    },
    {
      id: 5,
      name: "Priya Patel",
      role: "Graphic Designer",
      image: "https://avatar.iran.liara.run/public/26",
      content: "Even as a professional designer, I find Aillustra incredibly valuable. It speeds up my workflow and helps me explore new creative directions. The clean lines and well-defined spaces in the generated illustrations are perfect for coloring books.",
      rating: 5,
      earnings: "$15,200 monthly on Amazon KDP"
    },
    {
      id: 6,
      name: "Gabriela Marinho",
      role: "Kids Teacher",
      image: "https://avatar.iran.liara.run/public/26",
      content: "Even as a professional designer, I find Aillustra incredibly valuable. It speeds up my workflow and helps me explore new creative directions. The clean lines and well-defined spaces in the generated illustrations are perfect for coloring books.",
      rating: 5,
      earnings: "$5,200 monthly on Etsy"
    }
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
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
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
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
      scale: 0.8,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    })
  };

  const floatingVariants = {
    initial: { y: 0 },
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <section className="overflow-hidden h-screen">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          ref={headerRef}
          className="text-center mb-16"
          variants={containerVariants}
          initial="hidden"
          animate={isHeaderInView ? "visible" : "hidden"}
        >
          <motion.div
            className="inline-block mb-4"
            variants={itemVariants}
          >
            <motion.div
              className="flex items-center justify-center w-16 h-16 mx-auto bg-[#7f4a88]/10 rounded-full"
              animate={{
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Users size={32} className="text-[#7f4a88]" />
            </motion.div>
          </motion.div>
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-[#7f4a88] mb-4"
            variants={itemVariants}
          >
            Success Stories
          </motion.h2>
          <motion.p
            className="text-xl text-gray-600 max-w-3xl mx-auto"
            variants={itemVariants}
          >
            Hear from creators who transformed their ideas into profitable coloring books with Aillustra
          </motion.p>
        </motion.div>

        {/* Featured Testimonial */}
        <div className="mb-20 relative">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={cardVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-5xl mx-auto"
            >
              <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Image Side */}
                <div className="relative h-80 md:h-auto bg-[#7f4a88]/10">
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-white shadow-xl">
                      <Image
                        src={testimonials[currentIndex].image}
                        alt={testimonials[currentIndex].name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </motion.div>
                  <motion.div
                    className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg"
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                  >
                    <h3 className="text-xl font-bold text-[#7f4a88]">{testimonials[currentIndex].name}</h3>
                    <p className="text-gray-600">{testimonials[currentIndex].role}</p>
                    <div className="flex items-center mt-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={i < testimonials[currentIndex].rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}
                        />
                      ))}
                    </div>
                  </motion.div>
                </div>

                {/* Content Side */}
                <div className="p-8 md:p-12 relative">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  >
                    <Quote size={48} className="text-[#7f4a88]/20 absolute top-6 left-6" />
                    <div className="relative z-10">
                      <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                        "{testimonials[currentIndex].content}"
                      </p>
                      <div className="bg-[#7f4a88]/10 rounded-xl p-4 inline-block">
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
          <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between px-4 md:px-8 pointer-events-none">
            <motion.button
              className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-[#7f4a88] pointer-events-auto"
              onClick={prevTestimonial}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronLeft size={24} />
            </motion.button>
            <motion.button
              className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-[#7f4a88] pointer-events-auto"
              onClick={nextTestimonial}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronRight size={24} />
            </motion.button>
          </div>
        </div>

        {/* Testimonial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              className={`bg-white rounded-xl shadow-lg p-6 ${index === currentIndex ? "ring-2 ring-[#7f4a88]" : ""
                }`}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true, amount: 0.3 }}
              whileHover={{ y: -10, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1);
                setCurrentIndex(index);
              }}
            >
              <div className="flex items-center mb-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">{testimonial.name}</h3>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-gray-700 mb-4 line-clamp-3">"{testimonial.content}"</p>
              <div className="flex justify-between items-center">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={i < testimonial.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}
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
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isStatsInView ? "visible" : "hidden"}
        >
          {[
            { label: "Happy Creators", value: "2,500+", icon: "👨‍🎨" },
            { label: "Books Published", value: "12,000+", icon: "📚" },
            { label: "Average Monthly Earnings", value: "$8,400", icon: "💰" }
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-xl shadow-lg p-8 text-center"
              variants={itemVariants}
              whileHover={{
                y: -10,
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
              }}
            >
              <motion.div
                className="text-4xl mb-4"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 1
                }}
              >
                {stat.icon}
              </motion.div>
              <motion.h3
                className="text-3xl font-bold text-[#7f4a88] mb-2"
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{
                  opacity: 1,
                  scale: 1,
                  transition: {
                    type: "spring",
                    stiffness: 100
                  }
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
          <h3 className="text-2xl md:text-3xl font-bold text-[#7f4a88] mb-6">Ready to Create Your Success Story?</h3>
          <motion.button
            className="px-8 py-4 bg-[#7f4a88] text-white rounded-full shadow-lg text-lg font-medium"
            whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgba(127, 74, 136, 0.4), 0 10px 10px -5px rgba(127, 74, 136, 0.1)" }}
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
