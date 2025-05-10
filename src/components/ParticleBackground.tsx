
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

const NUM_PARTICLES = 50; // Increased for better visibility
const PARTICLE_COLOR_HSL = "hsl(var(--primary))"; 

export function ParticleBackground() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameId = useRef<number | null>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const currentContainer = containerRef.current;
    if (currentContainer) {
      const observer = new ResizeObserver(entries => {
        for (let entry of entries) {
          setContainerSize({ width: entry.contentRect.width, height: entry.contentRect.height });
        }
      });
      observer.observe(currentContainer);
      // Set initial size explicitly after observer is set up
      setContainerSize({ width: currentContainer.offsetWidth, height: currentContainer.offsetHeight });
      return () => {
        observer.disconnect();
        if (animationFrameId.current) {
          cancelAnimationFrame(animationFrameId.current);
        }
      };
    }
  }, []);

  const initializeParticles = useCallback(() => {
    const { width, height } = containerSize;
    if (width === 0 || height === 0) {
        setParticles([]); // Clear particles if container has no size
        return;
    }

    const newParticles: Particle[] = [];
    for (let i = 0; i < NUM_PARTICLES; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2 + 1, 
        opacity: Math.random() * 0.4 + 0.1, // Slightly increased opacity for better visibility
        vx: (Math.random() - 0.5) * 0.2, 
        vy: (Math.random() - 0.5) * 0.2,
      });
    }
    setParticles(newParticles);
  }, [containerSize]);

  useEffect(() => {
    // Initialize particles when containerSize is first determined or changes
    initializeParticles();
  }, [initializeParticles]);

  useEffect(() => {
    if (particles.length === 0 || containerSize.width === 0 || containerSize.height === 0) {
        if (animationFrameId.current) {
            cancelAnimationFrame(animationFrameId.current);
            animationFrameId.current = null;
        }
      return;
    }

    const { width, height } = containerSize;

    const animateParticles = () => {
      setParticles(prevParticles =>
        prevParticles.map(p => {
          let newX = p.x + p.vx;
          let newY = p.y + p.vy;

          if (newX + p.size < 0) newX = width + p.size;
          else if (newX - p.size > width) newX = -p.size;
          
          if (newY + p.size < 0) newY = height + p.size;
          else if (newY - p.size > height) newY = -p.size;

          return { ...p, x: newX, y: newY };
        })
      );
      animationFrameId.current = requestAnimationFrame(animateParticles);
    };

    // Start animation only if not already running
    if (!animationFrameId.current) {
        animationFrameId.current = requestAnimationFrame(animateParticles);
    }
    
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null; 
      }
    };
  }, [particles, containerSize]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 -z-10 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      {particles.map(particle => (
        <div
          key={particle.id}
          className="rounded-full"
          style={{
            position: 'absolute',
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: PARTICLE_COLOR_HSL,
            opacity: particle.opacity,
            transform: `translate(-50%, -50%)` 
          }}
        />
      ))}
    </div>
  );
}
