
"use client";

import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface ParticleProps {
  id: number;
  initialX: string;
  initialY: string;
  size: number;
  duration: number;
  delay: number;
}

const Particle = ({ id, initialX, initialY, size, duration, delay }: ParticleProps) => {
  const framerReducedMotion = useReducedMotion(); // Original hook call
  const [isReducedMotionActive, setIsReducedMotionActive] = useState(false);

  useEffect(() => {
    // Safely set the reduced motion state on the client
    setIsReducedMotionActive(framerReducedMotion ?? false);
  }, [framerReducedMotion]);


  if (isReducedMotionActive) {
    // Render static particles if reduced motion is enabled
    return (
      <div
        style={{
          position: 'absolute',
          left: initialX,
          top: initialY,
          width: size,
          height: size,
          backgroundColor: 'hsla(var(--primary), 0.3)', // Use a visible static color
          borderRadius: '50%', // Simpler shape for static fallback
          opacity: 0.5, // Ensure it's not too distracting
        }}
      />
    );
  }

  // Render animated particles if reduced motion is not enabled
  return (
    <motion.div
      key={id}
      style={{
        position: 'absolute',
        left: initialX,
        top: initialY,
        width: size,
        height: size,
        clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
        backgroundColor: 'hsla(var(--primary), 0.15)',
      }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{
        opacity: [0, 0.7, 0],
        scale: [0.5, 1.2, 0.5],
        x: ['0%', `${Math.random() * 100 - 50}%`, '0%'],
        y: ['0%', `${Math.random() * 100 - 50}%`, '0%'],
      }}
      transition={{
        duration: duration,
        ease: "linear",
        repeat: Infinity,
        delay: delay,
      }}
    />
  );
};

export function ParticleBackground() {
  const [particles, setParticles] = useState<ParticleProps[]>([]);
  const numParticles = 20;

  useEffect(() => {
    const newParticles: ParticleProps[] = [];
    if (typeof window !== 'undefined') { // Ensure Math.random runs client-side
      for (let i = 0; i < numParticles; i++) {
        newParticles.push({
          id: i,
          initialX: `${Math.random() * 100}%`,
          initialY: `${Math.random() * 100}%`,
          size: Math.random() * 15 + 5,
          duration: Math.random() * 10 + 10,
          delay: Math.random() * 5,
        });
      }
      setParticles(newParticles);
    }
  }, []);

  // Ensure particles are only rendered on the client after mount to avoid hydration issues
  if (particles.length === 0) {
    return null; 
  }

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {particles.map((particle) => (
        <Particle key={particle.id} {...particle} />
      ))}
    </div>
  );
}
