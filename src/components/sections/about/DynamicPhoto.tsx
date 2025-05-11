"use client";

import React, { useEffect, useRef, useState } from 'react'; // Added React import
import Image from 'next/image';
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform, useAnimation } from 'framer-motion';
import { cn } from '@/lib/utils';

interface DynamicPhotoProps {
  src: string;
  alt: string;
  className?: string;
}

export function DynamicPhoto({ src, alt, className }: DynamicPhotoProps) {
  const [isRevealed, setIsRevealed] = useState(false);
  const photoRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const ringControls = useAnimation();
  const photoControls = useAnimation();

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 200, mass: 0.5 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const currentRef = photoRef.current;
    if (!currentRef) return;

    const handleMouseMove = (event: MouseEvent) => {
      if (currentRef) {
        const rect = currentRef.getBoundingClientRect();
        mouseX.set(event.clientX - rect.left - rect.width / 2);
        mouseY.set(event.clientY - rect.top - rect.height / 2);
      }
    };
    
    const handleMouseLeave = () => {
        mouseX.set(0);
        mouseY.set(0);
    }

    currentRef.addEventListener('mousemove', handleMouseMove);
    currentRef.addEventListener('mouseleave', handleMouseLeave);

    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
          await ringControls.start("animate"); 
          await photoControls.start("animate"); 
          if (!reducedMotion) {
             ringControls.start("pulse"); 
          }
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(currentRef);

    return () => {
      currentRef?.removeEventListener('mousemove', handleMouseMove);
      currentRef?.removeEventListener('mouseleave', handleMouseLeave);
      observer.disconnect();
      ringControls.stop();
      photoControls.stop();
    };
  }, [mouseX, mouseY, ringControls, photoControls, reducedMotion]);

  const glintX = useTransform(smoothMouseX, [-150, 150], ['20%', '80%']);
  const glintY = useTransform(smoothMouseY, [-150, 150], ['20%', '80%']);

  const ringVariants = {
    initial: {
      pathLength: 0,
      opacity: 0,
    },
    animate: {
      pathLength: 1,
      opacity: 1,
      transition: { duration: 1, ease: "circOut", delay: 0.2 },
    },
    pulse: { 
      scale: [1, 1.03, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 2.5,
        ease: "easeInOut",
        repeat: Infinity,
        repeatDelay: 1,
      }
    }
  };

  const photoMaskVariants = {
    initial: { clipPath: reducedMotion ? "inset(0% 0% 0% 0%)" : "inset(0% 0% 0% 100%)" }, // Wipe from LEFT to RIGHT
    animate: { 
      clipPath: "inset(0% 0% 0% 0%)",
      transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: reducedMotion ? 0 : 0.6 }
    },
  };

  return (
    <div
      ref={photoRef}
      className={cn(
        "relative w-64 h-64 md:w-80 md:h-80 rounded-full group",
        className
      )}
    >
      <motion.svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <motion.circle
          cx="50"
          cy="50"
          r="48"
          stroke="url(#gradient-border-dynamic-photo)" 
          strokeWidth="3"
          variants={ringVariants}
          initial="initial"
          animate={ringControls}
        />
        <defs>
          <linearGradient id="gradient-border-dynamic-photo" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--gradient-start))" />
            <stop offset="50%" stopColor="hsl(var(--gradient-middle))" />
            <stop offset="100%" stopColor="hsl(var(--gradient-end))" />
          </linearGradient>
        </defs>
      </motion.svg>

      <motion.div
        className="w-full h-full rounded-full overflow-hidden relative"
        variants={photoMaskVariants}
        initial="initial"
        animate={photoControls}
      >
        <Image
          src={src}
          alt={alt}
          layout="fill"
          objectFit="cover"
          className="transform scale-105"
          data-ai-hint="professional portrait"
          priority
        />
        {!reducedMotion && isRevealed && (
            <motion.div
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                    background: `radial-gradient(circle at ${glintX} ${glintY}, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 30%)`,
                    mixBlendMode: 'overlay',
                }}
                aria-hidden="true"
            />
        )}
      </motion.div>
    </div>
  );
}
