
"use client";

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Keyboard } from 'lucide-react';
import { GradientText } from '@/components/GradientText';
import { motion, useMotionValue, useTransform, useReducedMotion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { cn } from '@/lib/utils';
// import { ParticleBackground } from '@/components/ParticleBackground'; // ParticleBackground removed
import { ScrollPrompt } from '@/components/ScrollPrompt';

const roles = [
  "< Backend Developer />",
  "< DevOps Engineer />",
  "< Ai/ML Engineer />"
];
const typingSpeed = 120;
const deletingSpeed = 60;
const delayBetweenRoles = 1800;

export function HeroSection() {
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  
  const [isClient, setIsClient] = useState(false);
  const [heroActualDimensions, setHeroActualDimensions] = useState({ width: 0, height: 0 }); 

  const heroRef = useRef<HTMLElement>(null);

  const mouseX = useMotionValue(0); // Initialize to 0, will be updated
  const mouseY = useMotionValue(0); // Initialize to 0, will be updated


  const framerReducedMotion = useReducedMotion();
  const [isReducedMotionActive, setIsReducedMotionActive] = useState(true); // Default true for SSR

  useEffect(() => {
    setIsClient(true);
    setIsReducedMotionActive(framerReducedMotion ?? false); // Set based on hook after mount

    const currentHeroRef = heroRef.current;
    if (currentHeroRef) {
      const rect = currentHeroRef.getBoundingClientRect();
      setHeroActualDimensions({ width: rect.width, height: rect.height });
      // Set initial motion values relative to the center of the element IF NEEDED
      // For parallax triggered by mouse over element, this might be set to rect.width / 2, rect.height / 2
      // But if parallax is based on viewport mouse, then 0,0 is fine or event.clientX/Y directly.
      // For this implementation, we'll set them to center for the rotate effect on mouse move.
      mouseX.set(rect.width / 2);
      mouseY.set(rect.height / 2);


      const handleMouseMove = (event: MouseEvent) => {
        // No currentHeroRef check needed here as listener is removed on unmount
        const localRect = currentHeroRef.getBoundingClientRect(); 
        mouseX.set(event.clientX - localRect.left);
        mouseY.set(event.clientY - localRect.top);
      };
      currentHeroRef.addEventListener('mousemove', handleMouseMove);
      
      // Reset on mouse leave to avoid sticky rotation
      const handleMouseLeave = () => {
        mouseX.set(heroActualDimensions.width / 2);
        mouseY.set(heroActualDimensions.height / 2);
      };
      currentHeroRef.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        currentHeroRef.removeEventListener('mousemove', handleMouseMove);
        currentHeroRef.removeEventListener('mouseleave', handleMouseLeave);
      }
    }
  }, [framerReducedMotion, mouseX, mouseY, heroActualDimensions.width, heroActualDimensions.height]); // Added heroActualDimensions to dependency array


  const rotateXConfig = !isClient || isReducedMotionActive ? 0 : useTransform(mouseY, [0, heroActualDimensions.height || 600], [10, -10]);
  const rotateYConfig = !isClient || isReducedMotionActive ? 0 : useTransform(mouseX, [0, heroActualDimensions.width || 800], [-10, 10]);

  const buttonRotateXConfig = !isClient || isReducedMotionActive ? 0 : useTransform(mouseY, [0, heroActualDimensions.height || 600], [5, -5]);
  const buttonRotateYConfig = !isClient || isReducedMotionActive ? 0 : useTransform(mouseX, [0, heroActualDimensions.width || 800], [-5, 5]);
  
  const rotateX = typeof rotateXConfig === 'number' ? rotateXConfig : useSpring(rotateXConfig, { stiffness: 300, damping: 30 });
  const rotateY = typeof rotateYConfig === 'number' ? rotateYConfig : useSpring(rotateYConfig, { stiffness: 300, damping: 30 });
  
  const buttonRotateX = typeof buttonRotateXConfig === 'number' ? buttonRotateXConfig : useSpring(buttonRotateXConfig, { stiffness: 200, damping: 20 });
  const buttonRotateY = typeof buttonRotateYConfig === 'number' ? buttonRotateYConfig : useSpring(buttonRotateYConfig, { stiffness: 200, damping: 20 });


  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (!isClient || isReducedMotionActive) { 
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
  }, [displayedText, isDeleting, currentRoleIndex, isReducedMotionActive, isClient]);

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
  const yourName = process.env.NEXT_PUBLIC_YOUR_NAME || "Portfolio";
  const cvPath = process.env.NEXT_PUBLIC_CV_PATH || "/CV.pdf";


  return (
    <section ref={heroRef} id="hero" className="min-h-screen flex items-center justify-center bg-transparent relative overflow-hidden" style={{ perspective: '1000px' }}>
      {/* Global AnimatedBackground is now used in layout.tsx, so ParticleBackground removed from here */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10"> {/* Ensure content is above global background */}
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
            <GradientText>HAZIQ SUMAID</GradientText>
          </motion.h1>
        </motion.div>

        <motion.p
          className={cn(
            "text-xl sm:text-2xl md:text-3xl mb-10 max-w-3xl mx-auto font-mono",
            "h-16 sm:h-20 md:h-24", 
            "flex items-center justify-center"
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          aria-live="polite"
          aria-atomic="true"
        >
          <GradientText className={isClient && !isReducedMotionActive ? "typing-cursor" : ""}>
            {isClient ? displayedText : roles[0]}
          </GradientText>
          <span className="invisible" aria-hidden="true">&nbsp;</span>
        </motion.p>
        
        {isClient && !isReducedMotionActive && ( 
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
              <Link href={cvPath} target="_blank" rel="noopener noreferrer" download={`${yourName}_CV.pdf`}>
                <Download className="mr-2 h-5 w-5" />
                Download CV
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
      {isClient && <ScrollPrompt />} 
    </section>
  );
}
