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
  maxPulseOpacity: number; // Renamed from baseOpacity, defines peak opacity during pulse
  animationDelay: number; 
  driftDurationX: number;
  driftDurationY: number;
  pulseDuration: number; // Duration for one pulse cycle (appear/disappear/blur)
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
          opacity: maxPulseOpacity * 0.5, // Static icons have a fixed, dim opacity
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
      animate={{ opacity: 1, x: '-50%', y: '-50%' }} // Fade in the container to enable child animations
      transition={{ duration: 0.5, delay: animationDelay * 0.2 }} 
    >
      {/* Inner div for continuous drift, opacity pulse, blur pulse, and glow pulse animations */}
      <motion.div
        animate={{
          x: [0, driftXAmount, 0, -driftXAmount, 0],
          y: [0, driftYAmount, 0, -driftYAmount, 0],
          opacity: [maxPulseOpacity * 0.15, maxPulseOpacity], 
          filter: ['blur(2.5px)', 'blur(0px)'], 
          // Glow effect using boxShadow, synced with opacity and blur
          // hsla(var(--primary-rgb), alpha_value) for theme-aware color
          boxShadow: [
            '0 0 0px 0px hsla(var(--primary-rgb), 0)',        // Start/End: no glow, transparent
            '0 0 15px 5px hsla(var(--primary-rgb), 0.4)', // Peak: visible glow, themed color
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
          boxShadow: { // Transition for the glow effect
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
