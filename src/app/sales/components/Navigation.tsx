'use client';

import { useIsMobile } from '@/hooks/use-mobile';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Link as ScrollLink } from 'react-scroll';

const menuItems = [
  { id: 'hero', label: 'Home' },
  { id: 'benefits', label: 'Benefits' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'howItWorks', label: 'How It Works' },
  { id: 'faq', label: 'FAQ' },
  { id: 'finalCta', label: 'Get Started' },
];

export function Navigation() {
  const [activeSection, setActiveSection] = useState('hero');
  const [isScrolled, setIsScrolled] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      // Find the current section
      const sections = menuItems.map(item => item.id);
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isMobile) {
    return (
      <motion.nav
        initial={{ y: 0, opacity: 0, transition: { duration: 1 } }}
        animate={{ y: 0, opacity: 1, transition: { duration: 1 } }}
        className="fixed top-2 left-1/2 -translate-x-1/2 z-50"
      >
        <div className="flex items-center gap-4 p-2 rounded-full bg-white/10 backdrop-blur-lg border border-white/20 shadow-lg">
          {menuItems.map((item) => (
            <ScrollLink
              key={item.id}
              to={item.id}
              spy={true}
              smooth={true}
              offset={0}
              duration={500}
              className="relative group"
            >
              <div
                className={`w-2 h-2 rounded-full flex items-center justify-center transition-all duration-300
                  ${activeSection === item.id ? 'bg-primary shadow-lg scale-110' : 'bg-white/20 hover:bg-white/30'}
                  cursor-pointer touch-manipulation`}
              >
                <div className={`w-2 h-2 rounded-full ${activeSection === item.id ? 'bg-primary' : 'bg-affair-400'}`} />
              </div>
              <div className="absolute left-full ml-2 py-1 px-2 rounded bg-white/10 backdrop-blur-lg
                opacity-0 group-hover:opacity-100 transition-opacity duration-200
                whitespace-nowrap text-sm pointer-events-none">
                {item.label}
              </div>
            </ScrollLink>
          ))}

        </div>
      </motion.nav>
    );
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-affair-50/20 backdrop-blur-2xl shadow-sm' : 'bg-transparent'}`}
    >
      <div className="container mx-auto px-4 py-4">
        <ul className="flex items-center justify-center space-x-8">
          {menuItems.map((item) => (
            <li key={item.id}>
              <ScrollLink
                to={item.id}
                spy={true}
                smooth={true}
                activeClass="active"
                offset={0}
                duration={500}
                className={`cursor-pointer text-sm font-medium transition-colors hover:text-primary ${activeSection === item.id ? 'text-primary' : 'text-muted-foreground'}`}
              >
                {item.label}
              </ScrollLink>
            </li>
          ))}

        </ul>
      </div>
    </motion.nav>
  );

}