"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion, useAnimation, useScroll, useTransform } from 'framer-motion';
import { Section } from '@/components/Section';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend as RechartsLegend, Tooltip as RechartsTooltip } from 'recharts';
import { skillsData, skillCategories, type Skill, type SkillCategory } from '@/config/skills';
import { cn } from '@/lib/utils';
import type { IconComponent } from '@/config/skills';
import { useTheme } from '@/contexts/ThemeContext';

const ICON_SIZE_DESKTOP = 28;
const ICON_SIZE_MOBILE = 32;

interface SkillBadgeProps {
  skill: Skill;
  index: number;
  totalSkills: number;
  radius: number; // Orbit radius for desktop
  centerOffset?: { x: number; y: number }; // Center of the galaxy for desktop
  onHover: (skill: Skill | null) => void;
  onCategoryHover: (category: SkillCategoryName | null) => void;
  isReducedMotion: boolean;
  theme: string | undefined;
  isMobileView?: boolean; // To adapt rendering if used in mobile carousel
}

const SkillBadge: React.FC<SkillBadgeProps> = ({ skill, index, totalSkills, radius, centerOffset = {x:0, y:0}, onHover, onCategoryHover, isReducedMotion, theme, isMobileView = false }) => {
  const angle = (index / totalSkills) * 2 * Math.PI - Math.PI / 2;
  const finalX = radius * Math.cos(angle) + centerOffset.x;
  const finalY = radius * Math.sin(angle) + centerOffset.y;

  const controls = useAnimation();
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [isBadgeHovered, setIsBadgeHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isIntersecting) { // Ensure it runs only once on intersection
          setIsIntersecting(true);
          if (!isReducedMotion) {
             // Animate from center for galaxy view
            controls.start({
              opacity: 1,
              scale: 1,
              x: finalX,
              y: finalY,
              rotate: 0,
              transition: { type: 'spring', damping: 15, stiffness: 80, delay: index * 0.08 + 0.3 },
            });
          } else {
            controls.start({ opacity: 1, scale: 1, x: finalX, y: finalY, rotate:0, transition: { duration: 0 }});
          }
        //   observer.unobserve(entry.target); // Keep observing if needed for re-animation, or unobserve
        }
      },
      { threshold: 0.1 } // Trigger when 10% of the item is visible
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }
    return () => {
      if (currentRef) observer.unobserve(currentRef);
      observer.disconnect();
    };
  }, [controls, finalX, finalY, isReducedMotion, index, isIntersecting]); // Added isIntersecting to deps

  const badgeVariants = {
    initial: { // Start from center for galaxy
      opacity: 0,
      scale: 0.3,
      x: centerOffset.x, 
      y: centerOffset.y,
      rotate: isReducedMotion ? 0 : (Math.random() - 0.5) * 90
    },
    // visible state is handled by controls.start
    hover: {
      scale: 1.15, // Slightly larger scale for the whole badge
      zIndex: 20, // Ensure hovered badge is on top
      boxShadow: `0 0 25px 8px hsla(var(--primary), 0.4)`,
      transition: { type: 'spring', stiffness: 300, damping: 10 },
    },
  };
  
  const progressRingInitialRadius = 28;
  const progressRingHoverRadius = 31; // approx 1.1 * 28

  const Icon = skill.icon as IconComponent;
  const iconSize = isMobileView ? ICON_SIZE_MOBILE : ICON_SIZE_DESKTOP;

  const handleMouseEnter = () => {
    setIsBadgeHovered(true);
    onHover(skill);
    onCategoryHover(skill.category);
  };

  const handleMouseLeave = () => {
    setIsBadgeHovered(false);
    onHover(null);
    onCategoryHover(null);
  };
  
  const handleFocus = () => {
    setIsBadgeHovered(true); // Show hover effects on focus
    onHover(skill);
    onCategoryHover(skill.category);
  };

  const handleBlur = () => {
    setIsBadgeHovered(false);
    onHover(null);
    onCategoryHover(null);
  };


  return (
    <motion.div
      ref={ref}
      className="absolute cursor-pointer flex flex-col items-center group"
      variants={badgeVariants}
      initial="initial"
      animate={controls}
      whileHover={isReducedMotion ? undefined : "hover"}
      onHoverStart={handleMouseEnter}
      onHoverEnd={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      style={{ width: 72, height: 90 }} // Fixed size, increased height for name
      role="button"
      tabIndex={0}
      aria-label={`${skill.name} - ${skill.experience} experience, ${skill.proficiency}% proficiency`}
    >
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="relative w-16 h-16 p-1 bg-card/60 backdrop-blur-sm rounded-full border-2 border-primary/30 group-hover:border-primary transition-colors duration-200 flex items-center justify-center">
              <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 60 60"> {/* Allow overflow for pulse */}
                <motion.circle
                  cx="30" cy="30"
                  r={progressRingInitialRadius}
                  fill="transparent"
                  stroke={theme === 'dark' ? "hsl(var(--muted)/0.3)" : "hsl(var(--border)/0.5)"}
                  strokeWidth="3"
                  animate={{ r: isBadgeHovered && !isReducedMotion ? progressRingHoverRadius : progressRingInitialRadius }}
                  transition={{ type: 'spring', stiffness: 300, damping: 15, duration: 0.4 }}
                />
                <motion.circle
                  cx="30" cy="30"
                  r={progressRingInitialRadius}
                  fill="transparent"
                  stroke="url(#skillBadgeGradient)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  transform="rotate(-90 30 30)"
                  initial={{ strokeDashoffset: 2 * Math.PI * progressRingInitialRadius }}
                  animate={isIntersecting || isReducedMotion ? { 
                    strokeDashoffset: 2 * Math.PI * progressRingInitialRadius * (1 - skill.proficiency / 100),
                    r: isBadgeHovered && !isReducedMotion ? progressRingHoverRadius : progressRingInitialRadius,
                  } : { strokeDashoffset: 2 * Math.PI * progressRingInitialRadius }}
                  transition={isReducedMotion ? {duration: 0} : {
                    strokeDashoffset: { duration: 1, ease: "easeOut", delay: index * 0.08 + 0.8 },
                    r: { type: 'spring', stiffness: 300, damping: 15, duration: 0.4 }
                  }}
                  style={{ strokeDasharray: 2 * Math.PI * progressRingInitialRadius }}
                />
              </svg>
              <motion.div
                animate={{ y: isBadgeHovered && !isReducedMotion ? [0, -5, 0] : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut", times: [0, 0.5, 1], delay: 0.05 }}
                className="z-10"
              >
                <Icon size={iconSize} className="text-primary group-hover:text-[hsl(var(--gradient-end))] transition-colors duration-200" />
              </motion.div>
            </div>
          </TooltipTrigger>
          <TooltipContent 
            side="top" 
            className="custom-tooltip-content tooltip-arrow-top w-52" // Added custom classes
            sideOffset={10}
          >
            <p className="font-bold gradient-text text-sm mb-1.5">{skill.name}</p>
            <div className="my-1">
              <div className="flex justify-between text-xs text-muted-foreground mb-0.5">
                <span>Proficiency</span>
                <span>{skill.proficiency}%</span>
              </div>
              <div className="w-full h-1.5 bg-muted/50 rounded-full overflow-hidden">
                <motion.div
                  className="h-full gradient-button"
                  initial={{ width: 0 }}
                  // Animate width when tooltip becomes visible (driven by Tooltip's open state)
                  // This is a simplified approach; true on-visibility animation is harder with Radix Tooltip
                  // For now, it animates once based on proficiency.
                  style={{ width: `${skill.proficiency}%` }}
                  // animate={{ width: `${skill.proficiency}%` }} // This would animate on each render of tooltip
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1.5">Experience: {skill.experience}</p>
            {skill.description && <p className="text-xs text-muted-foreground/80 mt-1 pt-1 border-t border-border/30">{skill.description}</p>}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <p className="mt-1.5 text-xs text-center text-muted-foreground group-hover:text-foreground transition-colors truncate w-full px-1">{skill.name}</p>
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

interface SkillGalaxyProps {
  skills: Skill[];
  categories: SkillCategory[];
  onSkillHover: (skill: Skill | null) => void;
  onCategoryHover: (category: SkillCategoryName | null) => void;
  isReducedMotion: boolean;
  theme: string | undefined;
  hoveredCategory: SkillCategoryName | null;
}

const SkillGalaxy: React.FC<SkillGalaxyProps> = ({ skills, categories, onSkillHover, onCategoryHover, isReducedMotion, theme, hoveredCategory }) => {
  const [containerSize, setContainerSize] = useState({ width: 500, height: 500 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        const smallerDim = Math.min(clientWidth, clientHeight);
        const effectiveSize = Math.max(smallerDim, 350); 
        setContainerSize({ width: effectiveSize, height: effectiveSize });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Radar chart outer radius relative to its own container (which is 70% of SkillGalaxy)
  const radarChartOuterRadius = containerSize.width * 0.7 * 0.35; // e.g. 70% of galaxy width * 35% for radar chart
  // Badge orbit radius relative to SkillGalaxy container width. Must be larger than radar.
  const badgeOrbitRadius = Math.max(radarChartOuterRadius + 60, containerSize.width * 0.38); // Ensure badges are outside radar by at least 60px
  
  const centerOffset = { x: 0, y: 0 };

  const radarChartData = useMemo(() => {
    return categories.map(category => {
      const categorySkills = skills.filter(s => s.category === category.name);
      const avgProficiency = categorySkills.length > 0
        ? categorySkills.reduce((sum, s) => sum + s.proficiency, 0) / categorySkills.length
        : 0;
      return {
        subject: category.name,
        A: Math.max(10, avgProficiency), // Value for this category
        fullMark: 100,
      };
    });
  }, [skills, categories]);

  const CustomAngleTick = ({ x, y, payload, hoveredCategory }: any) => {
    const isHovered = payload.value === hoveredCategory;
    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dy={4} // Adjust vertical alignment
          textAnchor={ (x > containerSize.width * 0.7 * 0.5) ? "start" : (x < containerSize.width * 0.7 * 0.5 * -1) ? "end" : "middle" } // Dynamic text anchor
          fill={isHovered ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))'}
          fontWeight={isHovered ? 'bold' : 'normal'}
          fontSize={10}
          className="transition-all duration-200"
        >
          {payload.value}
        </text>
      </g>
    );
  };

  return (
    <div ref={containerRef} className="w-full h-full relative flex items-center justify-center">
      <motion.div 
        className="absolute inset-0 flex items-center justify-center pointer-events-auto"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1, transition: { delay: isReducedMotion ? 0 : 0.5, duration: 0.8, ease: "circOut" } }}
      >
        <ResponsiveContainer width="70%" height="70%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarChartData}> {/* Radar outer radius relative to this container */}
            <PolarGrid stroke={theme === 'dark' ? "hsl(var(--border)/0.3)" : "hsl(var(--muted)/0.5)"} />
            <PolarAngleAxis
              dataKey="subject"
              tick={<CustomAngleTick hoveredCategory={hoveredCategory} />}
              axisLine={{ stroke: theme === 'dark' ? "hsl(var(--border)/0.2)" : "hsl(var(--muted)/0.4)" }}
              tickLine={{ stroke: theme === 'dark' ? "hsl(var(--border)/0.2)" : "hsl(var(--muted)/0.4)" }}
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
                fontSize: '10px',
                boxShadow: 'var(--shadow-md)'
              }}
              itemStyle={{ color: 'hsl(var(--popover-foreground))' }}
              labelStyle={{ color: 'hsl(var(--gradient-middle))', fontWeight: 'bold' }}
              cursor={{ fill: 'hsla(var(--primary-rgb), 0.1)' }}
              wrapperStyle={{ zIndex: 50 }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </motion.div>

      {skills.map((skill, index) => (
        <SkillBadge
          key={skill.id}
          skill={skill}
          index={index}
          totalSkills={skills.length}
          radius={badgeOrbitRadius}
          centerOffset={centerOffset}
          onHover={onSkillHover}
          onCategoryHover={onCategoryHover}
          isReducedMotion={isReducedMotion}
          theme={theme}
        />
      ))}
    </div>
  );
};


export function SkillsSection() {
  const [activeSkill, setActiveSkill] = useState<Skill | null>(null);
  const [hoveredCategory, setHoveredCategory] = useState<SkillCategoryName | null>(null);
  const [isClient, setIsClient] = useState(false);
  const framerReducedMotion = useReducedMotion();
  const [isReducedMotionActive, setIsReducedMotionActive] = useState(true);
  const [isMobileView, setIsMobileView] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    setIsClient(true);
    setIsReducedMotionActive(framerReducedMotion ?? false);

    const checkMobile = () => setIsMobileView(window.innerWidth < 768); // md breakpoint
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
                        <TooltipProvider key={skill.id} delayDuration={200}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Card className="bg-background/50 p-3 rounded-md shadow-sm cursor-default">
                                <div className="flex items-center mb-1.5">
                                  <Icon size={ICON_SIZE_MOBILE} className="text-primary mr-2.5 shrink-0" />
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
                              </Card>
                            </TooltipTrigger>
                            <TooltipContent 
                              side="bottom" 
                              className="custom-tooltip-content w-48" // Added custom class
                              sideOffset={6}
                            >
                               <p className="font-bold gradient-text text-sm mb-1.5">{skill.name}</p>
                                <div className="my-1">
                                  <div className="flex justify-between text-xs text-muted-foreground mb-0.5">
                                    <span>Proficiency</span>
                                    <span>{skill.proficiency}%</span>
                                  </div>
                                  <div className="w-full h-1.5 bg-muted/50 rounded-full overflow-hidden">
                                    <div
                                      className="h-full gradient-button"
                                      style={{ width: `${skill.proficiency}%` }}
                                    />
                                  </div>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1.5">Experience: {skill.experience}</p>
                                {skill.description && <p className="text-xs text-muted-foreground/80 mt-1 pt-1 border-t border-border/30">{skill.description}</p>}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
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
              {activeSkill && !isMobileView && ( // Only show central skill detail card on desktop
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="absolute top-0 md:top-4 left-1/2 -translate-x-1/2 z-30 w-[90%] max-w-sm pointer-events-none" // Ensure it's above badges but below tooltips
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
                      <div className="my-1">
                        <div className="flex justify-between text-xs text-muted-foreground mb-0.5">
                            <span>Proficiency</span>
                            <span>{activeSkill.proficiency}%</span>
                        </div>
                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                            <motion.div
                                className="h-full gradient-button"
                                initial={{ width: 0 }}
                                animate={{ width: `${activeSkill.proficiency}%` }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                            />
                        </div>
                      </div>
                      {activeSkill.description && <p className="text-xs text-muted-foreground mt-2">{activeSkill.description}</p>}
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

          <div className="relative w-full max-w-2xl lg:max-w-3xl xl:max-w-4xl aspect-square mx-auto mt-16 md:mt-24 lg:mt-28">
             <SkillGalaxy
                skills={skillsData}
                categories={skillCategories}
                onSkillHover={setActiveSkill}
                onCategoryHover={setHoveredCategory}
                isReducedMotion={isReducedMotionActive}
                theme={theme}
                hoveredCategory={hoveredCategory}
              />
          </div>
        </div>
      )}
      </motion.div>
    </Section>
  );
}
