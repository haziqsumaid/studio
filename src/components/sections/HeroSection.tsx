
"use client";

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Keyboard } from 'lucide-react';
import { GradientText } from '@/components/GradientText';
import { motion, useMotionValue, useTransform, useReducedMotion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ParticleBackground } from '@/components/ParticleBackground';
import { ScrollPrompt } from '@/components/ScrollPrompt';

const roles = [
  "< Backend Developer />",
  "< DevOps Engineer />",
  "< Open-Source Contributor />"
];
const typingSpeed = 120;
const deletingSpeed = 60;
const delayBetweenRoles = 1800;

export function HeroSection() {
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  
  const [isClient, setIsClient] = useState(false);
  const [heroActualDimensions, setHeroActualDimensions] = useState({ width: 800, height: 600 }); // Default server-side values

  const heroRef = useRef<HTMLElement>(null);

  // Initialize to center of DEFAULT dimensions for server render consistency
  const mouseX = useMotionValue(heroActualDimensions.width / 2);
  const mouseY = useMotionValue(heroActualDimensions.height / 2);

  const framerReducedMotion = useReducedMotion();
  const [isReducedMotionActive, setIsReducedMotionActive] = useState(false);

  useEffect(() => {
    // This effect runs once on mount on the client
    setIsClient(true);
    setIsReducedMotionActive(framerReducedMotion ?? false);

    if (heroRef.current) {
      const rect = heroRef.current.getBoundingClientRect();
      setHeroActualDimensions({ width: rect.width, height: rect.height });
      // Set initial mouse position to the center of the actual hero element
      mouseX.set(rect.width / 2);
      mouseY.set(rect.height / 2);
    }
  }, [framerReducedMotion, mouseX, mouseY]);

  // Mouse move handler effect
  useEffect(() => {
    if (!isClient || !heroRef.current) return; // Only run on client and if ref is available

    const currentHeroRef = heroRef.current; // Capture for cleanup
    const handleMouseMove = (event: MouseEvent) => {
      const rect = currentHeroRef.getBoundingClientRect(); // Use captured ref's rect
      mouseX.set(event.clientX - rect.left);
      mouseY.set(event.clientY - rect.top);
    };

    currentHeroRef.addEventListener('mousemove', handleMouseMove);
    return () => currentHeroRef.removeEventListener('mousemove', handleMouseMove);
  }, [isClient, mouseX, mouseY]);


  // Transforms - use heroActualDimensions which is stable on server and updates on client
  // On server and initial client render, !isClient is true, so config is [0,0] -> no rotation
  const rotateXConfig = isReducedMotionActive || !isClient ? [0, 0] : [10, -10];
  const rotateYConfig = isReducedMotionActive || !isClient ? [0, 0] : [-10, 10];
  const buttonRotateXConfig = isReducedMotionActive || !isClient ? [0, 0] : [5, -5];
  const buttonRotateYConfig = isReducedMotionActive || !isClient ? [0, 0] : [-5, 5];

  const rotateX = useTransform(mouseY, [0, heroActualDimensions.height], rotateXConfig);
  const rotateY = useTransform(mouseX, [0, heroActualDimensions.width], rotateYConfig);

  const buttonRotateX = useTransform(mouseY, [0, heroActualDimensions.height], buttonRotateXConfig);
  const buttonRotateY = useTransform(mouseX, [0, heroActualDimensions.width], buttonRotateYConfig);


  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (!isClient || isReducedMotionActive) { // Also check isClient for typewriter
      setDisplayedText(roles[0]);
      return;
    }
    if (isDeleting) {
      if (displayedText.length > 0) {
        timeoutId = setTimeout(() => {
          setDisplayedText((prev) => prev.slice(0, -1));
        }, deletingSpeed);
      } else {
        setIsDeleting(false);
        setCurrentRoleIndex((prevIndex) => (prevIndex + 1) % roles.length);
      }
    } else {
      if (displayedText.length < roles[currentRoleIndex].length) {
        timeoutId = setTimeout(() => {
          setDisplayedText((prev) => roles[currentRoleIndex].slice(0, prev.length + 1));
        }, typingSpeed);
      } else {
        timeoutId = setTimeout(() => {
          setIsDeleting(true);
        }, delayBetweenRoles);
      }
    }
    return () => clearTimeout(timeoutId);
  }, [displayedText, isDeleting, currentRoleIndex, isReducedMotionActive, isClient]); // Added isClient

  const cvButtonVariants = {
    hover: {
      scale: [1, 1.05, 1, 1.1, 1],
      boxShadow: "0px 0px 15px hsla(var(--primary), 0.5), 0px 0px 30px hsla(var(--primary), 0.3)",
      transition: {
        scale: { duration: 0.6, times: [0, 0.2, 0.4, 0.6, 1], ease: "easeInOut", repeat: Infinity, repeatDelay: 0.5 },
        boxShadow: { duration: 0.6, ease: "easeInOut", repeat: Infinity, repeatDelay: 0.5 },
      }
    },
    initial: {
      scale: 1,
      boxShadow: "0px 0px 8px hsla(var(--primary), 0.0)",
    }
  };
  const cvButtonVariantsResolved = isReducedMotionActive || !isClient ? {} : cvButtonVariants;

  return (
    <section ref={heroRef} id="hero" className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden" style={{ perspective: '1000px' }}>
      {isClient && <ParticleBackground />} {/* Conditionally render ParticleBackground */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.div
          style={{
            rotateX: rotateX,
            rotateY: rotateY,
            transformStyle: 'preserve-3d',
          }}
          className="mb-6"
        >
          <motion.h1 
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold"
            initial={{ opacity: 0, y: isReducedMotionActive ? 0 : 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          >
            <GradientText>Your Name</GradientText>
          </motion.h1>
        </motion.div>

        <motion.p
          className={cn(
            "text-xl sm:text-2xl md:text-3xl mb-10 max-w-3xl mx-auto font-mono",
            "h-16 sm:h-20 md:h-24", // Ensure consistent height for layout
            "flex items-center justify-center"
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          aria-live="polite"
          aria-atomic="true"
        >
           {/* Render placeholder or final text if not animating to avoid hydration issues for typewriter */}
          <GradientText className={isClient && !isReducedMotionActive ? "typing-cursor" : ""}>
            {isClient ? displayedText : roles[0]}
          </GradientText>
          <span className="invisible" aria-hidden="true">&nbsp;</span> {/* Prevents layout shift */}
        </motion.p>
        
        {isClient && !isReducedMotionActive && ( // Conditionally render Keyboard
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.5, type: "spring", stiffness: 150 }}
            className="mb-10 flex justify-center"
          >
            <motion.div
              animate={{
                filter: ["brightness(1)", "brightness(1.5)", "brightness(1)"],
                scale: [1, 1.05, 1],
              }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay:1 }}
            >
              <Keyboard size={48} className="text-[hsl(var(--primary))]/70" />
            </motion.div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: isReducedMotionActive ? 0 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: isReducedMotionActive ? 0.6 : 1 }}
          className="inline-block"
          style={{
            rotateX: buttonRotateX,
            rotateY: buttonRotateY,
            transformStyle: 'preserve-3d',
          }}
        >
          <motion.div
             variants={cvButtonVariantsResolved}
             initial="initial"
             whileHover="hover"
             className="rounded-lg"
          >
            <Button asChild size="lg" className="gradient-button rounded-lg px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-shadow duration-300">
              <Link href="/placeholder-cv.pdf" target="_blank" rel="noopener noreferrer" download="YourName_CV.pdf">
                <Download className="mr-2 h-5 w-5" />
                Download CV
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
      {isClient && <ScrollPrompt />} {/* Conditionally render ScrollPrompt */}
    </section>
  );
}

