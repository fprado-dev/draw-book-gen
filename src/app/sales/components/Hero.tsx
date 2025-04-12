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


import { motion, useScroll, Variants } from 'framer-motion';
import { BadgeDollarSign, ChevronDown, Sparkles, Store, Video, Wand2 } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import Marquee from 'react-fast-marquee';

export const HeroSection = () => {
  // For scroll progress tracking
  const { scrollYProgress } = useScroll();

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




  return (
    <motion.section
      initial="offscreen"
      whileInView="onscreen"
      viewport={{ amount: 0.3 }}
      className="relative h-screen w-full">
      {/* Progress indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-primary origin-left z-50"
        style={{ scaleX: scrollYProgress }}
      />



      {/* Main content */}
      <motion.div
        className="relative h-full flex flex-col items-center justify-evenly"
      >
        {/* Logo with parallax effect */}
        <motion.div
          className="flex flex-col items-center gap-8 justify-center w-full max-w-6xl mx-auto"
          variants={logoVariant}
        >
          <motion.div
            // style={{
            //   x: mousePosition.x * 50,
            //   y: mousePosition.y * 50
            // }}
            className="relative flex items-center justify-center overflow-hidden w-full max-w-3xs md:max-w-sm">
            <Image
              src={LogoUrl}
              alt="Aillustra Logo"
              width={420}
              height={120}
              className="relative z-10 w-full h-auto"
            />
          </motion.div>


          <motion.p
            variants={textVariant}
            className="text-sm sm:text-xl md:text-2xl text-muted-foreground text-center max-w-2xl px-4"
          >
            Transform your ideas into magical illustrations with AI - Your creative journey starts here!

          </motion.p>

          {/* CTA buttons with hover animations */}
          <div className='flex gap-4 w-full justify-center'>
            <motion.div

              className="flex sm:flex-row gap-4"
            >
              <motion.button
                className="cursor-pointer px-4 sm:px-8 py-2 sm:py-2 bg-primary text-white rounded-full shadow-lg flex items-center justify-center min-w-[100px]"
                variants={buttonsVariant}
                whileHover="hover"
                whileTap="tap"
              >
                <Wand2 className="mr-2 w-3 h-3 sm:w-4 sm:h-4" />
                <span className='text-xs'>Start Creating Now</span>
              </motion.button>
            </motion.div>
            <motion.div
              className="flex sm:flex-row gap-4"

            >
              <motion.button
                variants={buttonsVariant}
                className="cursor-pointer  px-4 sm:px-8 py-2 sm:py-2 border-primary border bg-transparent text-primary rounded-full shadow-lg flex items-center justify-center min-w-[100px]"
                whileHover="hover"
                whileTap="tap"
              >
                <Video className="mr-2 w-3 h-3 sm:w-4 sm:h-4" />
                <span className='text-xs'>Watch Demo</span>
              </motion.button>
            </motion.div>
          </div>
        </motion.div>


        {/* Thumbnails with parallax effect */}
        <motion.div
          className='w-full'
          variants={thumbnailsVariant}
        >
          <Marquee autoFill pauseOnHover speed={60} gradient={true} direction="left">
            {thumbnails.map((img, i) => (
              <motion.div

                key={`left-${i}`} className="mx-2">
                <Image
                  src={img.image}
                  alt={`Thumbnail ${i}`}
                  width={140}
                  height={220}
                  className="rounded-lg border sm:w-[160px] sm:h-[250px] md:w-[180px] md:h-[280px] object-cover"
                />
              </motion.div>
            ))}
          </Marquee>
        </motion.div>


        {/* Floating features */}
        <motion.div
          variants={benefitsVariant}
          className="flex flex-col items-center gap-4 justify-center w-full max-w-6xl mx-auto px-4">
          <motion.div
            className="flex flex-wrap justify-center gap-2 md:gap-4 max-w-3xl"

          >
            {[
              { text: "AI-Powered Design", icon: <Sparkles className='w-3 h-3 sm:w-4 sm:h-4' /> },
              { text: "KDP Ready", icon: <Store className='w-3 h-3 sm:w-4 sm:h-4' /> },
              { text: "$10,000+ Monthly Potential", icon: <BadgeDollarSign className='w-3 h-3 sm:w-4 sm:h-4' /> }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white/80 backdrop-blur-sm px-3 sm:px-4 py-2 rounded-full shadow-md text-primary flex items-center text-xs sm:text-base"


              >
                <span className="mr-2">{feature.icon}</span>
                <span className="font-medium">{feature.text}</span>
              </motion.div>
            ))}

          </motion.div>

        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          variants={scrollIndicatorVariant}
          initial="offscreen"
          whileInView="onscreen"
          viewport={{ amount: 0.3 }}
          className="text-primary animate-bounce"
        >
          <ChevronDown className='w-8 h-8 text-primary' />
        </motion.div>

      </motion.div>

    </motion.section>
  );
};



const logoVariant: Variants = {
  offscreen: {
    opacity: 0, y: -100
  },
  onscreen: {
    opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" }
  },
};

const textVariant: Variants = {
  offscreen: {
    opacity: 0, y: -20
  },
  onscreen: {
    opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" }
  },
};

const buttonsVariant: Variants = {
  offscreen: {
    opacity: 0, y: -10
  },
  onscreen: {
    opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut", delay: 0.3 }
  },
  hover: {
    scale: 1.05, transition: { duration: 0.2, ease: "easeInOut" }
  },
  tap: {
    scale: 0.95, transition: { duration: 0.1, ease: "easeInOut" }
  }
};

const thumbnailsVariant: Variants = {
  offscreen: {
    opacity: 0, y: -10
  },
  onscreen: {
    opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut", delay: 0.6 }
  },
};

const benefitsVariant: Variants = {
  offscreen: {
    opacity: 0, y: -50
  },
  onscreen: {
    opacity: 1, y: 0, transition: { duration: 1.5, ease: "easeOut", delay: 0.3 }
  },
};

const scrollIndicatorVariant: Variants = {
  offscreen: {
    opacity: 0, y: -50
  },
  onscreen: {
    opacity: 1, y: 0, transition: { duration: 1.5, ease: "easeOut", delay: 0.3 }
  },
};


