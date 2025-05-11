"use client";
import type { MotionValue } from 'framer-motion';
import { motion } from 'framer-motion';

interface ScrollProgressBarProps {
  scrollYProgress: MotionValue<number>;
}

export function ScrollProgressBar({ scrollYProgress }: ScrollProgressBarProps) {
  return (
    <motion.div
      className="fixed top-16 left-0 right-0 h-1 origin-left z-[60] gradient-button" // Increased z-index to be above navbar blur
      style={{ 
        scaleX: scrollYProgress,
        // Ensure transform origin is correctly set, Framer Motion usually handles this for scaleX
      }} 
      aria-hidden="true"
    />
  );
}
