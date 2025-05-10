
"use client";

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { Menu, X, Terminal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

const navItems = [
  { id: 'home', href: '/', label: 'Home', isExternal: false },
  { id: 'about', href: '#about', label: 'About', isExternal: false },
  { id: 'skills', href: '#skills', label: 'Skills', isExternal: false },
  { id: 'projects', href: '#projects', label: 'Projects', isExternal: false },
  { id: 'contributions', href: '#contributions', label: 'Contributions', isExternal: false },
  { id: 'contact', href: '#contact', label: 'Contact', isExternal: false },
];

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredNavItem, setHoveredNavItem] = useState<string | null>(null);
  const framerReducedMotion = useReducedMotion();
  const [isReducedMotionActive, setIsReducedMotionActive] = useState(false);

  useEffect(() => {
    // Safely set reduced motion state on client
    setIsReducedMotionActive(framerReducedMotion ?? false);
  }, [framerReducedMotion]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); 
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const mobileNavItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <motion.header
      initial={{ backgroundColor: 'hsla(var(--background-rgb), 0)' }} // Use background-rgb for hsla
      animate={{
        backgroundColor: isScrolled ? 'hsla(var(--background-rgb), 0.6)' : 'hsla(var(--background-rgb), 0)', // Adjusted opacity
        backdropFilter: isScrolled ? 'blur(8px)' : 'none', 
      }}
      transition={{ duration: 0.3 }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50",
        isScrolled && "shadow-lg border-b border-border/20"
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold" onClick={closeMobileMenu}>
            <Terminal size={28} className="text-[hsl(var(--primary))]" />
            <span className="gradient-text">Your Name</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-1 relative">
            {navItems.map((item) => (
              <motion.div key={item.id} className="relative px-3 py-2" onHoverStart={() => setHoveredNavItem(item.id)} onHoverEnd={() => setHoveredNavItem(null)}>
                <Link
                  href={item.href}
                  target={item.isExternal ? "_blank" : "_self"}
                  rel={item.isExternal ? "noopener noreferrer" : ""}
                  className={cn(
                    "text-sm font-medium transition-colors",
                    isScrolled ? "text-foreground hover:text-foreground/80" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {item.label}
                </Link>
                {hoveredNavItem === item.id && !isReducedMotionActive && (
                  <motion.div
                    layoutId="lava-underline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 gradient-button"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                )}
              </motion.div>
            ))}
            {!hoveredNavItem && !isReducedMotionActive && (
              <motion.div layoutId="lava-underline" className="absolute bottom-0 left-0 right-0 h-0.5 opacity-0" />
            )}
          </nav>

          <div className="hidden md:flex items-center">
            <ThemeToggle />
          </div>

          <div className="md:hidden flex items-center">
            <ThemeToggle />
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Toggle menu">
                  <AnimatePresence initial={false} mode="wait">
                    {isMobileMenuOpen ? (
                      <motion.div key="x" initial={{ rotate: -90, opacity:0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                        <X size={24} />
                      </motion.div>
                    ) : (
                      <motion.div key="menu" initial={{ rotate: 90, opacity:0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                        <Menu size={24} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full max-w-xs bg-background p-6">
                <SheetHeader className="mb-8">
                  <SheetTitle>
                     <Link href="/" className="flex items-center gap-2 text-2xl font-bold" onClick={closeMobileMenu}>
                       <Terminal size={28} className="text-[hsl(var(--primary))]" />
                       <span className="gradient-text">Your Name</span>
                    </Link>
                  </SheetTitle>
                </SheetHeader>
                <motion.ul
                  className="flex flex-col space-y-4"
                  variants={{
                    visible: { transition: { staggerChildren: isReducedMotionActive ? 0 : 0.1 } },
                    hidden: {},
                  }}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                >
                  {navItems.map((item) => (
                    <motion.li key={item.label} variants={mobileNavItemVariants}>
                      <Link
                        href={item.href}
                        target={item.isExternal ? "_blank" : "_self"}
                        rel={item.isExternal ? "noopener noreferrer" : ""}
                        className="block py-2 text-lg font-medium text-foreground hover:gradient-text"
                        onClick={closeMobileMenu}
                      >
                        {item.label}
                      </Link>
                    </motion.li>
                  ))}
                </motion.ul>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
