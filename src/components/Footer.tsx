
"use client";

import Link from 'next/link';
import { Github, Linkedin, Twitter } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';

const iconHoverVariants = {
  hover: {
    scale: 1.2,
    color: "hsl(var(--primary))",
    transition: { type: "spring", stiffness: 300 }
  },
  initial: {
    scale: 1,
    color: "hsl(var(--muted-foreground))"
  }
};

export function Footer() {
  const framerReducedMotion = useReducedMotion();
  const [isReducedMotionActive, setIsReducedMotionActive] = useState(false);

  useEffect(() => {
    setIsReducedMotionActive(framerReducedMotion ?? false);
  }, [framerReducedMotion]);

  const variants = isReducedMotionActive ? {} : iconHoverVariants;

  return (
    <footer className="bg-background border-t border-border/50 py-8 text-center text-muted-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center space-x-6 mb-4">
          <motion.div initial="initial" whileHover="hover" variants={variants}>
            <Link href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-muted-foreground hover:text-foreground transition-colors">
              <Github size={24} />
            </Link>
          </motion.div>
          <motion.div initial="initial" whileHover="hover" variants={variants}>
            <Link href="https://linkedin.com/in/yourusername" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-muted-foreground hover:text-foreground transition-colors">
              <Linkedin size={24} />
            </Link>
          </motion.div>
          <motion.div initial="initial" whileHover="hover" variants={variants}>
            <Link href="https://twitter.com/yourusername" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="text-muted-foreground hover:text-foreground transition-colors">
              <Twitter size={24} />
            </Link>
          </motion.div>
        </div>
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Your Name. All rights reserved.
        </p>
        <p className="text-xs mt-2">
          Built with Next.js, Tailwind CSS, and Framer Motion.
        </p>
      </div>
    </footer>
  );
}
