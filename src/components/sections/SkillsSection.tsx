
"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useReducedMotion, useAnimation, useSpring } from 'framer-motion';
import { Section } from '@/components/Section';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend as RechartsLegend, Tooltip as RechartsTooltip } from 'recharts';
import { skillsData, skillCategories, type Skill, type SkillCategory } from '@/config/skills';
import { cn } from '@/lib/utils';
import type { IconComponent } from '@/config/skills';
import { useTheme } from '@/contexts/ThemeContext';


interface SkillBadgeProps {
  skill: Skill;
  index: number;
  totalSkills: number;
  radius: number;
  centerOffset?: { x: number; y: number };
  onHover: (skill: Skill | null) => void;
  isReducedMotion: boolean;
  isSelected: boolean;
  theme: string | undefined;
}

const SkillBadge: React.FC<SkillBadgeProps> = ({ skill, index, totalSkills, radius, centerOffset = {x:0, y:0}, onHover, isReducedMotion, theme }) => {
  const angle = (index / totalSkills) * 2 * Math.PI - Math.PI / 2; 
  const finalX = radius * Math.cos(angle) + centerOffset.x;
  const finalY = radius * Math.sin(angle) + centerOffset.y;
  
  const initialOrbitRadius = radius * 0.3; 
  const initialAngle = angle + Math.PI / 4; 
  const entryX = initialOrbitRadius * Math.cos(initialAngle) + centerOffset.x;
  const entryY = initialOrbitRadius * Math.sin(initialAngle) + centerOffset.y;

  const controls = useAnimation();
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.boundingClientRect.top > 0) { 
          setIsIntersecting(true);
          controls.start("visible");
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }
    
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [controls]);

  const badgeVariants = {
    initial: { 
      opacity: 0, 
      scale: 0.3, 
      x: entryX, 
      y: entryY,
      rotate: isReducedMotion ? 0 : (Math.random() - 0.5) * 45
    },
    visible: {
      opacity: 1,
      scale: 1, // Ensure target scale is 1
      x: finalX,
      y: finalY,
      rotate: 0,
      transition: { type: 'spring', damping: 15, stiffness: 80, delay: isReducedMotion ? 0 : index * 0.07 + 0.3 },
    },
    hover: {
      scale: 1.25,
      zIndex: 10,
      boxShadow: `0 0 20px 5px hsla(var(--primary), 0.5)`,
      // Transition for hover state itself is fine
    },
  };
  
  const progressRingVariants = {
    hidden: { strokeDashoffset: 2 * Math.PI * 28 }, 
    visible: { 
      strokeDashoffset: 2 * Math.PI * 28 * (1 - skill.proficiency / 100),
      transition: { duration: isReducedMotion ? 0 : 1, ease: "easeOut", delay: isReducedMotion ? 0 : index * 0.07 + 0.8 }
    }
  };

  const Icon = skill.icon as IconComponent;

  return (
    <motion.div
      ref={ref}
      className="absolute cursor-pointer flex flex-col items-center group"
      variants={badgeVariants}
      initial="initial"
      animate={controls}
      whileHover="hover"
      onHoverStart={() => onHover(skill)}
      onHoverEnd={() => onHover(null)}
      // Add a default transition to govern animations back from hover to visible state
      transition={{ type: "spring", stiffness: 150, damping: 20 }}
      style={{ width: 72, height: 72 }} 
      role="button"
      tabIndex={0}
      aria-label={`${skill.name} - ${skill.experience} experience, ${skill.proficiency}% proficiency`}
    >
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="relative w-16 h-16 p-2 bg-card/60 backdrop-blur-sm rounded-full border-2 border-primary/30 group-hover:border-primary transition-colors duration-200 flex items-center justify-center">
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 60 60">
                <circle
                  cx="30" cy="30" r="28"
                  fill="transparent"
                  stroke={theme === 'dark' ? "hsl(var(--muted)/0.3)" : "hsl(var(--border)/0.5)"}
                  strokeWidth="3"
                />
                <motion.circle
                  cx="30" cy="30" r="28"
                  fill="transparent"
                  stroke="url(#skillBadgeGradient)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  transform="rotate(-90 30 30)"
                  variants={progressRingVariants}
                  initial="hidden"
                  animate={isIntersecting || isReducedMotion ? "visible" : "hidden"}
                  style={{ strokeDasharray: 2 * Math.PI * 28 }}
                />
              </svg>
              <Icon size={28} className="text-primary group-hover:text-[hsl(var(--gradient-end))] transition-colors duration-200 z-10" />
            </div>
          </TooltipTrigger>
          <TooltipContent side="top" className="bg-popover text-popover-foreground p-2 rounded-md shadow-lg border border-border text-xs max-w-xs">
            <p className="font-bold gradient-text">{skill.name}</p>
            <p className="text-xs">Category: <span className="font-medium">{skill.category}</span></p>
            <p className="text-xs">Proficiency: <span className="font-medium">{skill.proficiency}%</span></p>
            <p className="text-xs">Experience: <span className="font-medium">{skill.experience}</span></p>
            {skill.description && <p className="mt-1.5 text-muted-foreground/90 text-xs">{skill.description}</p>}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <p className="mt-1 text-xs text-center text-muted-foreground group-hover:text-foreground transition-colors truncate w-full px-1">{skill.name}</p>
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <linearGradient id="skillBadgeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--gradient-start))" />
            <stop offset="50%" stopColor="hsl(var(--gradient-middle))" />
            <stop offset="100%" stopColor="hsl(var(--gradient-end))" />
          </linearGradient>
        </defs>
      </svg>
    </motion.div>
  );
};


const SkillGalaxy: React.FC<{
  skills: Skill[];
  categories: SkillCategory[];
  onSkillHover: (skill: Skill | null) => void;
  isReducedMotion: boolean;
  theme: string | undefined;
}> = ({ skills, categories, onSkillHover, isReducedMotion, theme }) => {
  const [containerSize, setContainerSize] = useState({ width: 500, height: 500 });
  const galaxyRef = useRef<HTMLDivElement>(null); // Ref for the galaxy container (badges orbit around this)
  const radarChartContainerRef = useRef<HTMLDivElement>(null); // Ref for the radar chart's direct parent

  useEffect(() => {
    const updateSize = () => {
      if (galaxyRef.current) {
        const { clientWidth, clientHeight } = galaxyRef.current;
        // Use the larger dimension for radius calculation to ensure badges fit well
        const largerDim = Math.max(clientWidth, clientHeight); 
        const effectiveSize = Math.max(largerDim, 400); // Minimum effective size
        setContainerSize({ width: effectiveSize * 0.95, height: effectiveSize * 0.95 });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Radius for skill badges, relative to the galaxy container size
  const radius = Math.min(containerSize.width, containerSize.height) * 0.38; // Adjusted for better spacing with central chart
  const centerOffset = { x: 0, y: 0 }; 

  const radarChartData = useMemo(() => {
    return categories.map(category => {
      const categorySkills = skills.filter(s => s.category === category.name);
      const avgProficiency = categorySkills.length > 0
        ? categorySkills.reduce((sum, s) => sum + s.proficiency, 0) / categorySkills.length
        : 0;
      return {
        subject: category.name,
        A: Math.max(10, avgProficiency), 
        fullMark: 100,
      };
    });
  }, [skills, categories]);

  return (
    // Main container for the entire galaxy and chart area
    <div ref={galaxyRef} className="w-full h-full relative flex items-center justify-center">
      {/* Radar Chart Container - positioned absolutely in the center of galaxyRef */}
      <motion.div
        ref={radarChartContainerRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0" // Centering the chart container
        style={{ width: '55%', height: '55%' }} // Explicit size for the chart container
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1, transition: { delay: isReducedMotion ? 0 : 0.5, duration: 0.8, ease: "circOut" } }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarChartData}> {/* outerRadius relative to its container */}
            <PolarGrid stroke={theme === 'dark' ? "hsl(var(--border)/0.3)" : "hsl(var(--muted)/0.5)"} />
            <PolarAngleAxis 
              dataKey="subject" 
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} 
            />
            <PolarRadiusAxis 
              angle={30} 
              domain={[0, 100]} 
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 8 }}
              axisLine={{ stroke: theme === 'dark' ? "hsl(var(--border)/0.2)" : "hsl(var(--muted)/0.4)" }}
              tickLine={{ stroke: theme === 'dark' ? "hsl(var(--border)/0.2)" : "hsl(var(--muted)/0.4)" }}
            />
            <Radar 
              name="Avg Proficiency" 
              dataKey="A" 
              stroke="hsl(var(--primary))" 
              fill="hsl(var(--primary))" 
              fillOpacity={0.4} 
              strokeWidth={1.5}
            />
            <RechartsTooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--popover))',
                border: '1px solid hsl(var(--border))',
                borderRadius: 'var(--radius)',
                color: 'hsl(var(--popover-foreground))',
                fontSize: '12px',
                boxShadow: 'var(--shadow-md)'
              }}
              itemStyle={{ color: 'hsl(var(--popover-foreground))' }}
              labelStyle={{ color: 'hsl(var(--gradient-middle))', fontWeight: 'bold' }}
              cursor={{ fill: 'hsla(var(--primary-rgb), 0.1)' }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Skill Badges Orbiting - positioned relative to galaxyRef */}
      {skills.map((skill, index) => (
        <SkillBadge
          key={skill.id}
          skill={skill}
          index={index}
          totalSkills={skills.length}
          radius={radius} // Use the calculated radius
          centerOffset={centerOffset} // Badges orbit the center of galaxyRef
          onHover={onSkillHover}
          isReducedMotion={isReducedMotion}
          isSelected={false} 
          theme={theme}
        />
      ))}
    </div>
  );
};


export function SkillsSection() {
  const [activeSkill, setActiveSkill] = useState<Skill | null>(null);
  const [isClient, setIsClient] = useState(false);
  const framerReducedMotion = useReducedMotion();
  const [isReducedMotionActive, setIsReducedMotionActive] = useState(true); 
  const [isMobileView, setIsMobileView] = useState(false);
  const { theme } = useTheme(); 

  useEffect(() => {
    setIsClient(true);
    setIsReducedMotionActive(framerReducedMotion ?? false);

    const checkMobile = () => setIsMobileView(window.innerWidth < 768); 
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [framerReducedMotion]);

  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
  };


  if (!isClient) {
    return (
      <Section id="skills" title="My Tech Toolbox" className="py-16 md:py-24 min-h-[500px]">
        <div className="text-center text-muted-foreground">Loading skills...</div>
      </Section>
    );
  }

  return (
    <Section id="skills" title="My Tech Toolbox" className="py-20 md:py-28 lg:py-32 overflow-hidden">
       <motion.div
        variants={sectionVariants}
        initial={isReducedMotionActive ? "visible" : "hidden"}
        whileInView="visible"
        viewport={{ once: true, amount: 0.05 }}
      >
      {isMobileView ? (
        <Accordion type="single" collapsible className="w-full space-y-4">
          {skillCategories.map((category) => (
            <AccordionItem key={category.name} value={category.name} className="bg-card/60 backdrop-blur-md border-border/30 shadow-lg rounded-lg">
              <AccordionTrigger className="p-4 hover:no-underline">
                <div className="flex items-center">
                  <category.icon size={24} className="text-primary mr-3" />
                  <span className="text-lg font-semibold gradient-text">{category.name}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-4 pt-0">
                <p className="text-sm text-muted-foreground mb-4">{category.description}</p>
                <div className="grid grid-cols-1 xs:grid-cols-2 gap-4">
                  {skillsData
                    .filter((skill) => skill.category === category.name)
                    .map((skill) => {
                      const Icon = skill.icon;
                      return (
                        <Card key={skill.id} className="bg-background/50 p-3 rounded-md shadow-sm">
                          <div className="flex items-center mb-1.5">
                            <Icon size={20} className="text-primary mr-2.5 shrink-0" />
                            <div className="flex-grow">
                              <p className="font-semibold text-foreground text-sm leading-tight">{skill.name}</p>
                              <p className="text-xs text-muted-foreground">{skill.experience}</p>
                            </div>
                          </div>
                          <div className="relative h-2 w-full bg-muted/50 rounded-full overflow-hidden">
                            <motion.div
                              className="absolute top-0 left-0 h-full gradient-button rounded-full"
                              initial={{ width: 0 }}
                              whileInView={{ width: `${skill.proficiency}%` }}
                              viewport={{ once: true, amount: 0.8 }}
                              transition={{ duration: isReducedMotionActive ? 0 : 0.5, ease: 'easeOut' }}
                            />
                          </div>
                           <TooltipProvider delayDuration={100}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <p className="text-xs text-muted-foreground mt-1.5 truncate cursor-default">{skill.description || "..."}</p>
                                </TooltipTrigger>
                                {skill.description && (
                                <TooltipContent side="bottom" className="max-w-[200px] bg-popover text-popover-foreground p-2 rounded-md shadow-lg border border-border text-xs">
                                    <p>{skill.description}</p>
                                </TooltipContent>
                                )}
                            </Tooltip>
                           </TooltipProvider>
                        </Card>
                      );
                    })}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <div className="relative flex flex-col items-center justify-center w-full min-h-[650px] md:min-h-[750px] lg:min-h-[850px]">
            <AnimatePresence>
              {activeSkill && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="absolute top-4 md:top-8 left-1/2 -translate-x-1/2 z-20 w-full max-w-md"
                >
                  <Card className="bg-card/80 backdrop-blur-lg shadow-2xl border border-border/50">
                    <CardHeader>
                      <CardTitle className="gradient-text flex items-center">
                        {React.createElement(activeSkill.icon, { size: 24, className: "mr-2" })}
                        {activeSkill.name}
                      </CardTitle>
                       <CardDescription>Category: {activeSkill.category}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-1">Experience: {activeSkill.experience}</p>
                      <p className="text-sm text-muted-foreground mb-2">Proficiency: {activeSkill.proficiency}%</p>
                      {activeSkill.description && <p className="text-xs text-muted-foreground">{activeSkill.description}</p>}
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

          <div className="relative w-full max-w-2xl lg:max-w-3xl xl:max-w-4xl aspect-square mx-auto mt-10 md:mt-16 lg:mt-20">
             <SkillGalaxy
                skills={skillsData}
                categories={skillCategories}
                onSkillHover={setActiveSkill}
                isReducedMotion={isReducedMotionActive}
                theme={theme}
              />
          </div>
        </div>
      )}
      </motion.div>
    </Section>
  );
}

    