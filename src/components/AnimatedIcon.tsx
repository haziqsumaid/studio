// src/components/AnimatedIcon.tsx
"use client";

import type { Icon } from 'lucide-react';
import { motion, type Variants } from 'framer-motion';
import type { FC } from 'react';

interface AnimatedIconProps {
  IconComponent: Icon;
  initialX: string; 
  initialY: string; 
  driftXAmount: number; 
  driftYAmount: number; 
  baseOpacity: number; // This is the target opacity after initial fade-in, and for static icons
  pulseOpacityFactor: number; 
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
  baseOpacity, // Target opacity
  pulseOpacityFactor,
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
          transform: 'translate(-50%, -50%)', // Center the icon
          opacity: baseOpacity, // Use the passed baseOpacity directly
        }}
      >
        <IconComponent size={size} color={color} />
      </div>
    );
  }

  // Outer div for initial positioning and fade-in
  return (
    <motion.div
      style={{
        position: 'absolute',
        left: initialX,
        top: initialY,
        // x/y transforms are for centering relative to left/top, handled in initial/animate
      }}
      initial={{ opacity: 0, x: '-50%', y: '-50%' }} // Start transparent and centered
      animate={{ opacity: baseOpacity, x: '-50%', y: '-50%' }} // Fade in to baseOpacity, remain centered
      transition={{ duration: 1, delay: animationDelay * 0.3 }} // Initial fade-in delay
    >
      {/* Inner div for continuous drift and pulse animations, starting after the initial fade-in */}
      <motion.div
        // x and y here are relative to the parent motion.div's final position (which is centered)
        animate={{
          x: [0, driftXAmount, 0, -driftXAmount, 0],
          y: [0, driftYAmount, 0, -driftYAmount, 0],
          // Opacity pulses around the already established baseOpacity (from parent's animate).
          // The child's opacity animation will take over for this element.
          opacity: [baseOpacity, baseOpacity * pulseOpacityFactor, baseOpacity],
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
          }
        }}
      >
        <IconComponent size={size} color={color} />
      </motion.div>
    </motion.div>
  );
};

export default AnimatedIcon;
