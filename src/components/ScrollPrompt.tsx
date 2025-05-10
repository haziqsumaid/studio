
"use client";

import { motion, useReducedMotion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';

export function ScrollPrompt() {
  const [isVisible, setIsVisible] = useState(false); // Start invisible, then fade in
  const framerReducedMotion = useReducedMotion();
  const [isReducedMotionActive, setIsReducedMotionActive] = useState(true); // Default to true to avoid flash of animation server-side

  useEffect(() => {
    // Safely set reduced motion state on client
    setIsReducedMotionActive(framerReducedMotion ?? false);
  }, [framerReducedMotion]);


  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true); // Set to true to allow fade-in animation
      }
    };

    window.addEventListener('scroll', handleScroll);
    // Initial check to set visibility for fade-in on load (if not scrolled)
    // Delay initial visibility slightly to ensure other animations start
    const timer = setTimeout(() => handleScroll(), 500);


    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, []);

  if (isReducedMotionActive || !isVisible) { // Check isVisible for fade out logic
    return null;
  }

  return (
    <motion.div
      className="absolute bottom-10 left-1/2 -translate-x-1/2"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : -10 }} // Animate opacity based on isVisible
      exit={{ opacity: 0, y: 10 }}
      transition={{ delay: isVisible ? 1.5 : 0, duration: 0.5 }} // Delay appearance only if visible
    >
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <ChevronDown size={36} className="text-foreground/50" />
      </motion.div>
    </motion.div>
  );
}
