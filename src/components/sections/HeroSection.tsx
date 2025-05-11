"use client";

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Keyboard } from 'lucide-react';
import { GradientText } from '@/components/GradientText';
import { motion, useMotionValue, useTransform, useSpring, useReducedMotion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ParticleBackground } from '@/components/ParticleBackground'; // Assuming this is react-tsparticles or similar
import { ScrollPrompt } from '@/components/ScrollPrompt';
import { siteConfig } from '@/config/content';
// import Lottie from 'lottie-react'; // If using Lottie
// import keyboardAnimation from '@/assets/keyboard-lottie.json'; // Path to your Lottie JSON

const typingSpeed = 100;
const deletingSpeed = 50;
const delayBetweenRoles = 2000;

export function HeroSection() {
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  
  const [isClient, setIsClient] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  // Magnetic effect for headline
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 120, mass: 0.5 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);
  
  // Parallax for layers (simplified for headline and button)
  const parallaxStrength = reducedMotion ? 0 : 0.03;
  const nameRotateX = useTransform(springY, [-100, 100], [parallaxStrength * 10, -parallaxStrength * 10]);
  const nameRotateY = useTransform(springX, [-100, 100], [-parallaxStrength * 10, parallaxStrength * 10]);

  const buttonRotateX = useTransform(springY, [-100, 100], [parallaxStrength * 5, -parallaxStrength * 5]);
  const buttonRotateY = useTransform(springX, [-100, 100], [-parallaxStrength * 5, parallaxStrength * 5]);


  useEffect(() => {
    setIsClient(true);
    const currentHeroRef = heroRef.current;

    const handleMouseMove = (event: MouseEvent) => {
      if (currentHeroRef && !reducedMotion) {
        const rect = currentHeroRef.getBoundingClientRect();
        mouseX.set(event.clientX - rect.left - rect.width / 2);
        mouseY.set(event.clientY - rect.top - rect.height / 2);
      }
    };
    
    const handleMouseLeave = () => {
        if(!reducedMotion) {
            mouseX.set(0);
            mouseY.set(0);
        }
    };

    if (currentHeroRef) {
      currentHeroRef.addEventListener('mousemove', handleMouseMove);
      currentHeroRef.addEventListener('mouseleave', handleMouseLeave);
    }
    
    return () => {
      currentHeroRef?.removeEventListener('mousemove', handleMouseMove);
      currentHeroRef?.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [reducedMotion, mouseX, mouseY]);


  useEffect(() => { // Typewriter effect
    if (!isClient || reducedMotion) {
      setDisplayedText(siteConfig.roles[0]);
      return;
    }

    let timeoutId: NodeJS.Timeout;
    if (isDeleting) {
      if (displayedText.length > 0) {
        timeoutId = setTimeout(() => {
          setDisplayedText((prev) => prev.slice(0, -1));
        }, deletingSpeed);
      } else {
        setIsDeleting(false);
        setCurrentRoleIndex((prevIndex) => (prevIndex + 1) % siteConfig.roles.length);
      }
    } else {
      if (displayedText.length < siteConfig.roles[currentRoleIndex].length) {
        timeoutId = setTimeout(() => {
          setDisplayedText((prev) => siteConfig.roles[currentRoleIndex].slice(0, prev.length + 1));
        }, typingSpeed);
      } else {
        timeoutId = setTimeout(() => {
          setIsDeleting(true);
        }, delayBetweenRoles);
      }
    }
    return () => clearTimeout(timeoutId);
  }, [displayedText, isDeleting, currentRoleIndex, reducedMotion, isClient]);

  const cvButtonVariants = reducedMotion ? {} : {
    initial: { scale: 1, boxShadow: "0px 0px 8px hsla(var(--primary-rgb), 0.0)" },
    hover: {
      scale: [1, 1.05, 1, 1.1, 1],
      boxShadow: "0px 0px 20px hsla(var(--primary-rgb), 0.6), 0px 0px 35px hsla(var(--primary-rgb), 0.4)",
      transition: {
        scale: { duration: 0.8, ease: "easeInOut", repeat: Infinity, repeatDelay: 0.3 },
        boxShadow: { duration: 0.8, ease: "easeInOut", repeat: Infinity, repeatDelay: 0.3 },
      }
    },
    tap: { scale: 0.95 }
  };
  
  return (
    <section 
      ref={heroRef} 
      id="hero" 
      className="h-screen flex flex-col items-center justify-center bg-bg relative overflow-hidden p-4"
      style={{ perspective: '1200px' }}
    >
      {isClient && <ParticleBackground />}
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.div
          style={{ 
            x: reducedMotion ? 0 : springX, 
            y: reducedMotion ? 0 : springY,
            rotateX: nameRotateX,
            rotateY: nameRotateY,
            transformStyle: 'preserve-3d',
          }}
          className="mb-4 md:mb-6"
          transition={{ type:'spring', stiffness:300, damping:30 }}
        >
          <h1 
            className="text-display-sm sm:text-display-md lg:text-display-lg font-extrabold gradient-text"
          >
            {siteConfig.name.toUpperCase()}
          </h1>
        </motion.div>

        <motion.p
          className={cn(
            "text-subheadline-sm sm:text-subheadline-md md:text-subheadline-lg mb-8 md:mb-10 max-w-3xl mx-auto font-mono h-12 md:h-16",
            "flex items-center justify-center text-muted-fg"
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4, ease: [0.22,1,0.36,1] }}
          aria-live="polite"
        >
          <span className={isClient && !reducedMotion ? "typing-cursor" : ""}>
            {displayedText}
          </span>
        </motion.p>
        
        {/* Lottie Keyboard Accent - Placeholder, assuming you have a Lottie JSON */}
        {/* {isClient && !reducedMotion && (
          <motion.div 
            className="w-24 h-24 md:w-32 md:h-32 mx-auto mb-8 md:mb-10"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.6, type: "spring", stiffness: 150 }}
          >
            <Lottie animationData={keyboardAnimation} loop={false} />
          </motion.div>
        )} */}
         {!isClient && !reducedMotion && ( // Fallback if Lottie isn't used or for SSR
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.5, type: "spring", stiffness: 150 }}
            className="mb-8 md:mb-10 flex justify-center"
          >
            <Keyboard size={40} className="text-primary/70" />
          </motion.div>
        )}


        <motion.div
          className="inline-block"
           style={{ 
            rotateX: buttonRotateX,
            rotateY: buttonRotateY,
            transformStyle: 'preserve-3d'
          }}
          initial={{ opacity: 0, y: reducedMotion ? 0 : 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: reducedMotion ? 0.5 : 1.2, ease: [0.22,1,0.36,1] }}
        >
          <motion.div
             variants={cvButtonVariants}
             initial="initial"
             whileHover="hover"
             whileTap="tap"
             className="rounded-lg"
          >
            <Button asChild size="lg" className="gradient-button hover:gradient-button-inverted rounded-lg px-8 py-3 text-base md:text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
              <Link href={siteConfig.cvUrl} target="_blank" rel="noopener noreferrer" download>
                <Download className="mr-2 h-5 w-5" />
                {siteConfig.hero.cvButtonText}
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
      {isClient && <ScrollPrompt />}
    </section>
  );
}

    