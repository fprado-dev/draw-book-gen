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
      const sections = menuItems.map((item) => item.id);
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
        className="fixed left-1/2 top-2 z-50 -translate-x-1/2"
      >
        <div className="flex items-center gap-4 rounded-full border border-white/20 bg-white/10 p-2 shadow-lg backdrop-blur-lg">
          {menuItems.map((item) => (
            <ScrollLink
              key={item.id}
              to={item.id}
              spy={true}
              smooth={true}
              offset={0}
              duration={500}
              className="group relative"
            >
              <div
                className={`flex h-2 w-2 items-center justify-center rounded-full transition-all duration-300
                  ${activeSection === item.id ? 'bg-primary scale-110 shadow-lg' : 'bg-white/20 hover:bg-white/30'}
                  cursor-pointer touch-manipulation`}
              >
                <div
                  className={`h-2 w-2 rounded-full ${activeSection === item.id ? 'bg-primary' : 'bg-affair-400'}`}
                />
              </div>
              <div
                className="pointer-events-none absolute left-full ml-2 whitespace-nowrap rounded bg-white/10 px-2
                py-1 text-sm opacity-0 backdrop-blur-lg
                transition-opacity duration-200 group-hover:opacity-100"
              >
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
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-affair-50/20 shadow-sm backdrop-blur-2xl' : 'bg-transparent'}`}
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
                className={`hover:text-primary cursor-pointer text-sm font-medium transition-colors ${activeSection === item.id ? 'text-primary' : 'text-muted-foreground'}`}
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
