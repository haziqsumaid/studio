"use client";

import Link from 'next/link';
import { Github, Linkedin, Twitter } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { siteConfig } from '@/config/content';

const iconHoverVariants = {
  hover: {
    scale: 1.25, // Increased pop
    color: "hsl(var(--primary))",
    transition: { type: "spring", stiffness: 400, damping: 15 } // More responsive spring
  },
  initial: {
    scale: 1,
    color: "hsl(var(--muted-fg))"
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
    <footer className="bg-muted-bg border-t border-border py-8 text-center text-muted-fg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center space-x-6 mb-6">
          <motion.div initial="initial" whileHover="hover" variants={variants}>
            <Link href={siteConfig.socialLinks.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-muted-fg hover:text-primary transition-colors">
              <Github size={24} />
            </Link>
          </motion.div>
          <motion.div initial="initial" whileHover="hover" variants={variants}>
            <Link href={siteConfig.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-muted-fg hover:text-primary transition-colors">
              <Linkedin size={24} />
            </Link>
          </motion.div>
          <motion.div initial="initial" whileHover="hover" variants={variants}>
            <Link href={siteConfig.socialLinks.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="text-muted-fg hover:text-primary transition-colors">
              <Twitter size={24} />
            </Link>
          </motion.div>
        </div>
        <p className="text-sm">
          {siteConfig.footer.copyrightText}
        </p>
        <p className="text-xs mt-2 opacity-75">
          {siteConfig.footer.madeWithText}
        </p>
      </div>
    </footer>
  );
}

    