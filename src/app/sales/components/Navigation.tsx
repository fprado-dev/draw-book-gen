'use client';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { motion } from 'framer-motion';
import { Menu } from 'lucide-react';
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
        {/* Desktop Navigation */}
        <ul className="hidden md:flex items-center justify-center space-x-8">
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

        {/* Mobile Navigation */}
        <div className="md:hidden flex justify-end">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="size-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-white/20 backdrop-blur-lg border-l border-white/30 shadow-xl">
              <nav className="flex flex-col gap-4">
                {menuItems.map((item) => {
                  const setOpen = (open: boolean) => {
                    const trigger = document.querySelector('[data-state]');
                    if (trigger) {
                      trigger.setAttribute('data-state', open ? 'open' : 'closed');
                    }
                  };

                  return (
                    <ScrollLink
                      key={item.id}
                      to={item.id}
                      spy={true}
                      smooth={true}
                      offset={-80}
                      duration={500}
                      onClick={() => setOpen(false)}
                      className={`cursor-pointer text-lg font-medium transition-all duration-300 hover:text-primary p-3 rounded-lg
                        ${activeSection === item.id ? 'text-primary bg-white/10' : 'text-muted-foreground'}
                        hover:bg-white/20 hover:shadow-md hover:scale-105 active:scale-95`}
                    >
                      {item.label}
                    </ScrollLink>
                  );
                })}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.nav>
  );
}