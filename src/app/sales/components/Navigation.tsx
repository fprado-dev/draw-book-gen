'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Link as ScrollLink } from 'react-scroll';

const menuItems = [
  { id: 'hero', label: 'Home' },
  { id: 'benefits', label: 'Benefits' },
  { id: 'howItWorks', label: 'How It Works' },
  { id: 'demo', label: 'Demo' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'faq', label: 'FAQ' },
  { id: 'finalCta', label: 'Get Started' },
];

export function Navigation() {
  const [activeSection, setActiveSection] = useState('hero');
  const [isScrolled, setIsScrolled] = useState(false);

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

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-md shadow-sm' : 'bg-transparent'}`}
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
                offset={-80}
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