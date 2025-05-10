
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
  const framerReducedMotion = useReducedMotion();
  const [isReducedMotionActive, setIsReducedMotionActive] = useState(true); // Default to true for server
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setIsReducedMotionActive(framerReducedMotion ?? false);
  }, [framerReducedMotion]);

  if (!isClient) {
    // Don't render particle div on server or before client-side hydration determines reduced motion
    return null;
  }

  if (isReducedMotionActive) {
    // Render static particles if reduced motion is enabled
    return (
      <div
        style={{
          position: 'absolute',
          left: initialX, // These values are now from client-side Math.random
          top: initialY,
          width: size,
          height: size,
          backgroundColor: 'hsla(var(--primary), 0.3)',
          borderRadius: '50%',
          opacity: 0.5,
        }}
      />
    );
  }

  // Render animated particles
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
        x: ['0%', `${Math.random() * 100 - 50}%`, '0%'], // Math.random() is fine here as it's client-only animation
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
  const [isClient, setIsClient] = useState(false);
  const numParticles = 20;

  useEffect(() => {
    setIsClient(true);
    const newParticles: ParticleProps[] = [];
    // Math.random is now only called on the client after mount
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
  }, []); // Empty dependency array ensures this runs once on mount on the client

  if (!isClient || particles.length === 0) {
    // Don't render anything on the server or if particles haven't been initialized
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

