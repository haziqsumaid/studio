// src/components/AnimatedIcon.tsx
"use client";

import type { Icon } from 'lucide-react';
import { motion } from 'framer-motion';
import type { FC } from 'react';

interface AnimatedIconProps {
  IconComponent: Icon;
  initialX: string; 
  initialY: string; 
  driftXAmount: number; 
  driftYAmount: number; 
  maxPulseOpacity: number; 
  animationDelay: number; 
  driftDurationX: number;
  driftDurationY: number;
  pulseDuration: number; 
  size?: number;
  color?: string;
  isReducedMotion: boolean;
}

const AnimatedIcon: FC<AnimatedIconProps> = ({
  IconComponent,
  initialX,
  initialY,
  driftXAmount,
  driftYAmount,
  maxPulseOpacity, 
  animationDelay,
  driftDurationX,
  driftDurationY,
  pulseDuration,
  size = 24,
  color = 'currentColor',
  isReducedMotion,
}) => {

  if (isReducedMotion) {
    // Render static icon for reduced motion
    return (
      <div
        style={{
          position: 'absolute',
          left: initialX,
          top: initialY,
          transform: 'translate(-50%, -50%)', 
          opacity: maxPulseOpacity * 0.5, 
        }}
      >
        <IconComponent size={size} color={color} />
      </div>
    );
  }

  // Outer div for initial positioning and making the element available for child animations
  return (
    <motion.div
      style={{
        position: 'absolute',
        left: initialX,
        top: initialY,
      }}
      initial={{ opacity: 0, x: '-50%', y: '-50%' }} 
      animate={{ opacity: 1, x: '-50%', y: '-50%' }} 
      transition={{ duration: 0.5, delay: animationDelay * 0.2 }} 
    >
      {/* Inner div for continuous drift, opacity pulse, blur pulse, and glow pulse animations */}
      <motion.div
        animate={{
          x: [0, driftXAmount, 0, -driftXAmount, 0],
          y: [0, driftYAmount, 0, -driftYAmount, 0],
          opacity: [maxPulseOpacity * 0.3, maxPulseOpacity * 0.9], // Adjusted opacity range for better visibility
          filter: ['blur(2.5px)', 'blur(0px)'], 
          boxShadow: [
            '0 0 0px 0px hsla(var(--glow-color-rgb), 0)', // Use --glow-color-rgb
            '0 0 15px 5px hsla(var(--glow-color-rgb), 0.4)', // Use --glow-color-rgb
          ],
        }}
        transition={{
          x: {
            duration: driftDurationX,
            repeat: Infinity,
            ease: 'easeInOut', 
            repeatType: 'mirror', 
            delay: animationDelay, 
          },
          y: {
            duration: driftDurationY,
            repeat: Infinity,
            ease: 'easeInOut',
            repeatType: 'mirror',
            delay: animationDelay + driftDurationY * 0.33, 
          },
          opacity: {
            duration: pulseDuration, 
            repeat: Infinity,
            ease: 'easeInOut', 
            repeatType: 'mirror', 
            delay: animationDelay, 
          },
          filter: {
            duration: pulseDuration, 
            repeat: Infinity,
            ease: 'easeInOut', 
            repeatType: 'mirror', 
            delay: animationDelay,
          },
          boxShadow: { 
            duration: pulseDuration,
            repeat: Infinity,
            ease: 'easeInOut',
            repeatType: 'mirror',
            delay: animationDelay,
          }
        }}
      >
        <IconComponent size={size} color={color} />
      </motion.div>
    </motion.div>
  );
};

export default AnimatedIcon;