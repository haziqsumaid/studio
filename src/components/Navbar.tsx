"use client";

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { Menu, X, Terminal, Sun, Moon } from 'lucide-react'; // Added Sun, Moon
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { siteConfig } from '@/config/content'; 

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState<string | null>(siteConfig.navLinks[0]?.id || null); // Default to first nav item
  const framerReducedMotion = useReducedMotion();
  const [isReducedMotionActive, setIsReducedMotionActive] = useState(false);

  useEffect(() => {
    setIsReducedMotionActive(framerReducedMotion ?? false);
  }, [framerReducedMotion]);

  useEffect(() => {
    const handleScroll = () => {
      // Check if scrolled past 80% of viewport height or a fixed value like 100px
      const scrollThreshold = typeof window !== 'undefined' ? window.innerHeight * 0.1 : 100; 
      setIsScrolled(window.scrollY > scrollThreshold);

      // Update active nav item based on scroll position (basic implementation)
      let currentSection = siteConfig.navLinks[0]?.id || null;
      for (let i = siteConfig.navLinks.length - 1; i >= 0; i--) {
        const item = siteConfig.navLinks[i];
        if (item.href.startsWith('#')) {
          const element = document.getElementById(item.href.substring(1));
          if (element && element.offsetTop <= window.scrollY + 100) { // 100px offset
            currentSection = item.id;
            break;
          }
        } else if (item.href === '/') {
            // Keep 'Home' active if no other section is met or at top
             if (window.scrollY < scrollThreshold) currentSection = item.id;
        }
      }
      setActiveNavItem(currentSection);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const mobileMenuVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1, // Stagger animation
        type: "spring",
        stiffness: 300,
        damping: 25,
        duration: 0.5, 
        ease: [0.22, 1, 0.36, 1]
      },
    }),
  };
  
  const navLinkBaseClass = "text-sm font-medium transition-colors duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] px-3 py-2 rounded-md";
  const navLinkScrolledClass = "text-fg hover:text-primary"; // HSL defined in globals.css
  const navLinkTransparentClass = "text-muted-fg hover:text-fg";

  return (
    <motion.header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
        isScrolled ? "bg-bg/80 backdrop-blur-md shadow-lg border-b border-border/20" : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link href="/" className="flex items-center gap-2" onClick={closeMobileMenu}>
            <Terminal size={28} className={cn("transition-colors", isScrolled ? "text-primary" : "text-primary")} />
            <span className={cn("font-mono text-xl md:text-2xl font-bold", isScrolled ? "text-fg" : "text-fg")}>
              {'>_ '}{siteConfig.name}
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-1 relative">
            {siteConfig.navLinks.map((item) => (
              <motion.div 
                key={item.id} 
                className="relative"
                onHoverStart={() => !isReducedMotionActive && setActiveNavItem(item.id)}
                // onHoverEnd={() => !isReducedMotionActive && setActiveNavItem(null)} // Or keep active on last clicked/scrolled
              >
                <Link
                  href={item.href}
                  onClick={() => setActiveNavItem(item.id)}
                  className={cn(
                    navLinkBaseClass,
                    isScrolled ? navLinkScrolledClass : navLinkTransparentClass,
                    activeNavItem === item.id && "text-primary" // Keep active link highlighted
                  )}
                >
                  {item.label}
                </Link>
                {activeNavItem === item.id && !isReducedMotionActive && (
                  <motion.span
                    layoutId="underline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[hsl(var(--gradient-start))] via-[hsl(var(--gradient-middle))] to-[hsl(var(--gradient-end))]"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    style={{ originX: 0.5 }}
                  />
                )}
              </motion.div>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <div className="md:hidden">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="Toggle menu" className={cn(isScrolled ? "text-fg" : "text-fg")}>
                    <AnimatePresence initial={false} mode="wait">
                      {isMobileMenuOpen ? (
                        <motion.div key="x" initial={{ rotate: -90, opacity:0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.3, ease: [0.22,1,0.36,1] }}>
                          <X size={24} />
                        </motion.div>
                      ) : (
                        <motion.div key="menu" initial={{ rotate: 90, opacity:0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.3, ease: [0.22,1,0.36,1] }}>
                          <Menu size={24} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-full max-w-xs bg-bg p-6">
                  <SheetHeader className="mb-8">
                    <SheetTitle>
                       <Link href="/" className="flex items-center gap-2 text-xl font-bold" onClick={closeMobileMenu}>
                         <Terminal size={28} className="text-primary" />
                         <span className="text-fg">{'>_ '}{siteConfig.name}</span>
                      </Link>
                    </SheetTitle>
                  </SheetHeader>
                  <motion.ul
                    className="flex flex-col space-y-2"
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                  >
                    {siteConfig.navLinks.map((item, index) => (
                      <motion.li 
                        key={item.label} 
                        custom={index}
                        variants={mobileMenuVariants}
                        whileHover={!isReducedMotionActive ? { scale: 1.05, color: "hsl(var(--primary))", originX:0 } : {}}
                        transition={{ type:"spring", stiffness:400, damping:15 }}
                      >
                        <Link
                          href={item.href}
                          className="block py-3 text-lg font-medium text-fg hover:text-primary transition-colors"
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
      </div>
    </motion.header>
  );
}

    