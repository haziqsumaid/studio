"use client";

import { motion, useReducedMotion, useAnimation } from 'framer-motion';
import type { ReactNode } from 'react';
import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export interface Skill {
  id: string;
  name: string;
  icon: ReactNode;
  proficiency: number; // 0-100
  yearsOfExperience?: string; 
}

interface SkillUniverseProps {
  skills: Skill[];
}

const SkillBadge = ({ skill, angle, radius, index }: { skill: Skill; angle: number; radius: number; index: number }) => {
  const controls = useAnimation();
  const reducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const x = radius * Math.cos(angle);
  const y = radius * Math.sin(angle);

  const initialX = radius * 1.5 * Math.cos(angle);
  const initialY = radius * 1.5 * Math.sin(angle);

  useEffect(() => {
    const currentRef = ref.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          controls.start("visible");
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(currentRef);
    return () => observer.disconnect();
  }, [controls]);

  const badgeVariants = {
    hidden: {
      opacity: 0,
      x: reducedMotion ? x : initialX,
      y: reducedMotion ? y : initialY,
      scale: reducedMotion ? 1 : 0.5,
    },
    visible: {
      opacity: 1,
      x: x,
      y: y,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: reducedMotion ? 120 : 50,
        damping: reducedMotion ? 20 : 10,
        delay: reducedMotion ? 0 : index * 0.1,
      },
    },
  };

  const progressRingVariants = {
    hidden: { pathLength: 0 },
    visible: {
      pathLength: skill.proficiency / 100,
      transition: { duration: reducedMotion ? 0 : 1.5, ease: 'easeOut', delay: reducedMotion ? 0 : index * 0.1 + 0.5 },
    },
  };
  
  const hoverEffects = reducedMotion ? {} : {
    scale: 1.15,
    zIndex: 10,
    boxShadow: "0px 0px 20px hsla(var(--primary), 0.5)",
    rotate: 5,
  };

  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            ref={ref}
            variants={badgeVariants}
            initial="hidden"
            animate={controls}
            whileHover={hoverEffects}
            className={cn(
              "absolute flex flex-col items-center justify-center w-24 h-24 md:w-28 md:h-28 rounded-full bg-card/50 backdrop-blur-sm border border-border/30 shadow-md p-2 cursor-pointer group",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-background focus-visible:ring-offset-card"
            )}
            style={{ 
              left: `calc(50% - 3rem + ${x}px)`, 
              top: `calc(50% - 3rem + ${y}px)`,  
            }}
            tabIndex={0} // Make it focusable
          >
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
              <circle
                cx="50" cy="50" r="45"
                fill="transparent"
                stroke="hsl(var(--border))"
                strokeWidth="4"
                opacity="0.3"
              />
              <motion.circle
                cx="50" cy="50" r="45"
                fill="transparent"
                stroke="url(#skillGradient)"
                strokeWidth="5"
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
                variants={progressRingVariants}
              />
              <defs>
                <linearGradient id="skillGradient" gradientTransform="rotate(90)">
                  <stop offset="0%" stopColor="hsl(var(--gradient-start))" />
                  <stop offset="50%" stopColor="hsl(var(--gradient-middle))" />
                  <stop offset="100%" stopColor="hsl(var(--gradient-end))" />
                </linearGradient>
              </defs>
            </svg>
            <div className="relative z-10 flex flex-col items-center text-center">
              <motion.div 
                className="text-primary mb-1 scale-125 transition-colors duration-200 group-hover:text-[hsl(var(--gradient-middle))]"
              >
                {skill.icon}
              </motion.div>
              <span className="text-xs font-medium text-foreground truncate w-full px-1">{skill.name}</span>
            </div>
          </motion.div>
        </TooltipTrigger>
        {skill.yearsOfExperience && !reducedMotion && (
          <TooltipContent side="top" className="bg-popover text-popover-foreground border-border shadow-lg rounded-md px-3 py-1.5 text-xs">
            <p>{skill.yearsOfExperience}</p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
};

export function SkillUniverse({ skills }: SkillUniverseProps) {
  const radius = 150; 
  const numSkills = skills.length;
  const angleStep = (2 * Math.PI) / numSkills;
  const reducedMotion = useReducedMotion();

  return (
    <div className="mt-16 mb-8">
      <h3 className="text-2xl font-semibold text-foreground mb-12 text-center gradient-text">My Tech Constellation</h3>
      <div className="relative w-full aspect-square max-w-lg mx-auto flex items-center justify-center">
        {!reducedMotion && (
            <motion.div 
                className="absolute w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center shadow-xl"
                animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
                <motion.div 
                    className="w-12 h-12 bg-primary/20 rounded-full shadow-inner"
                    animate={{ scale: [1, 0.9, 1]}}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                />
            </motion.div>
        )}
         <span className={cn("text-sm font-semibold text-foreground/80 z-10", reducedMotion && "text-lg")}>
            {reducedMotion ? "Core Skills" : "Skills"}
          </span>

        {skills.map((skill, index) => (
          <SkillBadge
            key={skill.id}
            skill={skill}
            angle={index * angleStep}
            radius={reducedMotion ? radius * 0.8 : radius}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}