"use client";




const LogoUrl = "https://hisxtgeirxvxlbpczvpb.supabase.co/storage/v1/object/sign/placeholders/aillustra-logo.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwbGFjZWhvbGRlcnMvYWlsbHVzdHJhLWxvZ28ucG5nIiwiaWF0IjoxNzQ0NDAxNzkxLCJleHAiOjIwNTk3NjE3OTF9.jNIZXs5AHFSzKNxQkRHSKgHD_uewI5ZM99095oOIc9A"; // Replace with your logo path

const thumbnails = [
  {
    title: 'Livro de Animais',
    image: 'https://hisxtgeirxvxlbpczvpb.supabase.co/storage/v1/object/public/users-generated-images/1a56bf2a-4c53-47bb-a3c2-7a6cebb8a3a0/1744330321700.jpg',
  },
  {
    title: 'Mandalas',
    image: 'https://hisxtgeirxvxlbpczvpb.supabase.co/storage/v1/object/public/users-generated-images/1a56bf2a-4c53-47bb-a3c2-7a6cebb8a3a0/1744329721140.jpg',
  },
  {
    title: 'Flores e Jardins',
    image: 'https://hisxtgeirxvxlbpczvpb.supabase.co/storage/v1/object/public/users-generated-images/1a56bf2a-4c53-47bb-a3c2-7a6cebb8a3a0/1744217400874.jpg',
  },
  {
    title: 'Paisagens',
    image: 'https://hisxtgeirxvxlbpczvpb.supabase.co/storage/v1/object/public/users-generated-images/1a56bf2a-4c53-47bb-a3c2-7a6cebb8a3a0/1744215255785.jpg',
  },
  {
    title: 'Livro de Animais',
    image: 'https://hisxtgeirxvxlbpczvpb.supabase.co/storage/v1/object/public/users-generated-images/1a56bf2a-4c53-47bb-a3c2-7a6cebb8a3a0/1744137165966.jpg',
  },
  {
    title: 'Mandalas Coloridas',
    image: 'https://hisxtgeirxvxlbpczvpb.supabase.co/storage/v1/object/public/users-generated-images/1a56bf2a-4c53-47bb-a3c2-7a6cebb8a3a0/1744136901849.jpg',
  },
  {
    title: 'Mandalas Coloridas',
    image: 'https://hisxtgeirxvxlbpczvpb.supabase.co/storage/v1/object/public/users-generated-images/1a56bf2a-4c53-47bb-a3c2-7a6cebb8a3a0/1744133215242.jpg',
  },
  {
    title: 'Mandalas Coloridas',
    image: 'https://hisxtgeirxvxlbpczvpb.supabase.co/storage/v1/object/public/users-generated-images/1a56bf2a-4c53-47bb-a3c2-7a6cebb8a3a0/1744129137459.jpg',
  },
  {
    title: 'Mandalas Coloridas',
    image: 'https://hisxtgeirxvxlbpczvpb.supabase.co/storage/v1/object/public/users-generated-images/1a56bf2a-4c53-47bb-a3c2-7a6cebb8a3a0/1744129021226.jpg',
  },
  {
    title: 'Mandalas Coloridas',
    image: 'https://hisxtgeirxvxlbpczvpb.supabase.co/storage/v1/object/public/users-generated-images/1a56bf2a-4c53-47bb-a3c2-7a6cebb8a3a0/1744128126451.jpg',
  },
  {
    title: 'Mandalas Coloridas',
    image: 'https://hisxtgeirxvxlbpczvpb.supabase.co/storage/v1/object/public/users-generated-images/1a56bf2a-4c53-47bb-a3c2-7a6cebb8a3a0/1744127664105.jpg',
  }
];


import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown, Sparkles, Video, Wand2 } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import Marquee from 'react-fast-marquee';

export const HeroSection = () => {
  // For scroll progress tracking
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.2], [0, -50]);

  // For animated text
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const animatedTexts = ["Imagination", "Creativity", "Artistry", "Passion"];

  // For mouse parallax effect
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Thumbnail data


  // Update mouse position for parallax effect
  useEffect(() => {
    const handleMouseMove = (e: any) => {
      setMousePosition({
        x: e.clientX / window.innerWidth - 0.5,
        y: e.clientY / window.innerHeight - 0.5
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Cycle through animated text
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex(prev => (prev + 1) % animatedTexts.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidde">
      {/* Progress indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-[#7f4a88] origin-left z-50"
        style={{ scaleX: scrollYProgress }}
      />



      {/* Main content */}
      <motion.div
        className="relative z-10 flex flex-col gap-4 items-center justify-center min-h-screen px-4"
      >
        {/* Logo with parallax effect */}
        <motion.div
          className=" flex flex-col items-center justify-center gap-8"
          style={{
            x: mousePosition.x * 20,
            y: mousePosition.y * 20
          }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="relative flex items-center justify-center overflow-hidden">
            <Image
              src={LogoUrl} // Replace with your logo path
              alt="Aillustra Logo"
              width={420}
              height={120}
              className="relative z-10"
            />
          </div>

          <motion.p
            className="text-xl md:text-2xl text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            No design skills required. Create professional coloring books with AI in minutes.
          </motion.p>

          <div className='flex gap-4'>
            {/* CTA buttons with hover animations */}
            <motion.div
              className="flex flex-col sm:flex-row gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <motion.button
                className="px-8 py-4 bg-[#7f4a88] text-white rounded-full shadow-lg flex items-center justify-center"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 10px 25px rgba(127, 74, 136, 0.3)"
                }}
                whileTap={{ scale: 0.98 }}
              >
                <Wand2 className="mr-2" size={20} />
                <span>Start Creating Now</span>
              </motion.button>


            </motion.div>
            <motion.div
              className="flex flex-col sm:flex-row gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <motion.button
                className="px-8 py-4 border border-primary bg-primary-foreground text-primary rounded-full shadow-lg flex items-center justify-center"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 10px 25px rgba(127, 74, 136, 0.3)"
                }}
                whileTap={{ scale: 0.98 }}
              >
                <Video className="mr-2" size={20} />
                <span>Watch Demo</span>
              </motion.button>


            </motion.div>
          </div>
        </motion.div>


        <motion.div className='mt-24' initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >


          <Marquee autoFill className='' pauseOnHover speed={60} gradient={true} direction="left">
            {thumbnails.map((img, i) => (
              <div key={`left-${i}`} className="mx-2">
                <Image
                  src={img.image}
                  alt={`Thumbnail ${i}`}
                  width={180}
                  height={280}
                  className="rounded-lg border"
                />
              </div>
            ))}
          </Marquee>
        </motion.div>


        {/* Floating features */}
        <div className="absolute top-10 left-0 right-0 flex flex-col items-center gap-4 justify-center">
          <motion.div
            className="flex flex-wrap justify-center gap-4 max-w-3xl px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            {[
              { text: "AI-Powered Design", icon: <Sparkles size={16} /> },
              { text: "KDP Ready", icon: <Sparkles size={16} /> },
              { text: "$10,000+ Monthly Potential", icon: <Sparkles size={16} /> }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md text-[#7f4a88] flex items-center"
                whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(127, 74, 136, 0.2)" }}
              >
                <span className="mr-2">{feature.icon}</span>
                <span className="font-medium">{feature.text}</span>
              </motion.div>
            ))}
          </motion.div>

        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-[#7f4a88]"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ChevronDown size={24} />
        </motion.div>
      </motion.div>
    </section>
  );
};




