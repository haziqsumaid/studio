
"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  vx: number; // velocity x
  vy: number; // velocity y
}

const NUM_PARTICLES = 25;
const PARTICLE_COLOR_HSL = "hsl(var(--primary))"; // Using primary color from theme

export function ParticleBackground() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameId = useRef<number | null>(null);

  const initializeParticles = useCallback(() => {
    if (!containerRef.current) return;
    const { offsetWidth: width, offsetHeight: height } = containerRef.current;
    if (width === 0 || height === 0) return; // Avoid division by zero or no-op if container not sized

    const newParticles: Particle[] = [];
    for (let i = 0; i < NUM_PARTICLES; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2 + 1, // Size 1px to 3px
        opacity: Math.random() * 0.3 + 0.05, // Opacity 0.05 to 0.35, making them more subtle
        vx: (Math.random() - 0.5) * 0.2, // Very slow velocity
        vy: (Math.random() - 0.5) * 0.2,
      });
    }
    setParticles(newParticles);
  }, []);

  useEffect(() => {
    // Initial setup
    const timer = setTimeout(() => { // Delay initialization slightly to ensure containerRef is sized
        initializeParticles();
    }, 100);
    
    window.addEventListener('resize', initializeParticles);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', initializeParticles);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [initializeParticles]);

  useEffect(() => {
    if (!containerRef.current || particles.length === 0) return;

    const { offsetWidth: width, offsetHeight: height } = containerRef.current;
    if (width === 0 || height === 0) return;


    const animateParticles = () => {
      setParticles(prevParticles =>
        prevParticles.map(p => {
          let newX = p.x + p.vx;
          let newY = p.y + p.vy;

          // Boundary conditions (wrap around)
          if (newX + p.size < 0) newX = width + p.size;
          else if (newX - p.size > width) newX = -p.size;
          
          if (newY + p.size < 0) newY = height + p.size;
          else if (newY - p.size > height) newY = -p.size;

          return { ...p, x: newX, y: newY };
        })
      );
      animationFrameId.current = requestAnimationFrame(animateParticles);
    };

    animationFrameId.current = requestAnimationFrame(animateParticles);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [particles]); // Rerun if particles array re-initializes or container dimensions might change

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 -z-10 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      {particles.map(particle => (
        <div
          key={particle.id}
          className="rounded-full" // Using Tailwind for rounded-full
          style={{
            position: 'absolute',
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: PARTICLE_COLOR_HSL,
            opacity: particle.opacity,
            transform: `translate(-50%, -50%)` // Center the particle on its x,y
          }}
        />
      ))}
    </div>
  );
}
