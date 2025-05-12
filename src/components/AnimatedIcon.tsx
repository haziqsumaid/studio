// src/components/AnimatedIcon.tsx
"use client";

import type { Icon } from 'lucide-react';
import { motion, type Variants } from 'framer-motion';
import type { FC } from 'react';

interface AnimatedIconProps {
  IconComponent: Icon;
  initialX: string; // e.g. '50%'
  initialY: string; // e.g. '50%'
  driftXAmount: number; // e.g. 100 (for +/- 100px)
  driftYAmount: number; // e.g. 50 (for +/- 50px)
  baseOpacity: number;
  pulseOpacityFactor: number; // e.g. 1.5 (to pulse between baseOpacity and baseOpacity*pulseOpacityFactor)
  animationDelay: number; // Overall delay for this icon's animations to start
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
  baseOpacity,
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
          opacity: baseOpacity,
        }}
      >
        <IconComponent size={size} color={color} />
      </div>
    );
  }

  return (
    <motion.div
      style={{
        position: 'absolute',
        left: initialX,
        top: initialY,
        // transform: 'translate(-50%, -50%)', // Centering the icon, Framer Motion x/y are additive
      }}
      // Initial state before any animation (including the first fade-in)
      initial={{ opacity: 0, x: '-50%', y: '-50%' }} // Start transparent and centered
      // Target state for the initial fade-in
      animate={{ opacity: baseOpacity, x: '-50%', y: '-50%' }}
      // Transition for the initial fade-in
      transition={{ duration: 1, delay: animationDelay * 0.3 }}
    >
      {/* Inner div for continuous drift and pulse animations, starting after the initial fade-in */}
      <motion.div
        // The x and y here are relative to the parent motion.div's final position
        animate={{
          x: [0, driftXAmount, 0, -driftXAmount, 0],
          y: [0, driftYAmount, 0, -driftYAmount, 0],
          opacity: [baseOpacity, baseOpacity * pulseOpacityFactor, baseOpacity],
        }}
        transition={{
          // X drift
          x: {
            duration: driftDurationX,
            repeat: Infinity,
            ease: 'easeInOut', // smooth, gentle drift
            repeatType: 'mirror', // reverses direction smoothly
            delay: animationDelay, // main delay for this icon's complex animations
          },
          // Y drift
          y: {
            duration: driftDurationY,
            repeat: Infinity,
            ease: 'easeInOut',
            repeatType: 'mirror',
            delay: animationDelay + driftDurationY * 0.33, // Offset y-drift start slightly
          },
          // Opacity pulse (continuous after initial fade-in)
          opacity: {
            duration: pulseDuration,
            repeat: Infinity,
            ease: 'easeInOut',
            repeatType: 'mirror',
            delay: animationDelay, // Sync with other continuous animations
          }
        }}
      >
        <IconComponent size={size} color={color} />
      </motion.div>
    </motion.div>
  );
};

export default AnimatedIcon;
