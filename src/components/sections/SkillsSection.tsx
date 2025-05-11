/** @jsxImportSource react */
"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion, useAnimation, useSpring } from 'framer-motion';
import { Section } from '@/components/Section';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip as RechartsTooltip } from 'recharts';
import { skillsData, skillCategories, type Skill, type SkillCategory, type SkillCategoryName } from '@/config/skills';
import { cn } from '@/lib/utils';
import type { IconComponent } from '@/config/skills';
import { useTheme } from '@/contexts/ThemeContext';

const ICON_SIZE_DESKTOP = 28;
const ICON_SIZE_MOBILE = 32;


interface SkillBadgeProps {
  skill: Skill;
  index: number;
  totalSkills: number;
  orbitRadius: number;
  iconSize: number;
  onHover: (skill: Skill | null) => void;
  onCategoryHover: (category: SkillCategoryName | null) => void;
  isReducedMotionActive: boolean;
  theme: string | undefined;
}

const SkillBadge: React.FC<SkillBadgeProps> = ({ 
  skill, index, totalSkills, orbitRadius, iconSize,
  onHover, onCategoryHover, isReducedMotionActive, theme 
}) => {
  const angle = (index / totalSkills) * 2 * Math.PI - Math.PI / 2; 
  const finalX = orbitRadius * Math.cos(angle);
  const finalY = orbitRadius * Math.sin(angle);

  const initialAnimX = 0; 
  const initialAnimY = 0;

  const badgeRef = useRef<HTMLDivElement>(null);
  const [isBadgeHovered, setIsBadgeHovered] = useState(false);
  const controls = useAnimation();

  const springConfig = { damping: 15, stiffness: 80, mass: 0.5 };
  
  const springX = useSpring(isReducedMotionActive ? finalX : initialAnimX, springConfig);
  const springY = useSpring(isReducedMotionActive ? finalY : initialAnimY, springConfig);
  const springScale = useSpring(isReducedMotionActive ? 1 : 0.3, { ...springConfig, stiffness: 100 });
  const springOpacity = useSpring(isReducedMotionActive ? 1 : 0, { damping: 20, stiffness: 100 });

  useEffect(() => {
    const currentBadgeRef = badgeRef.current;
    let observer: IntersectionObserver | null = null;

    if (currentBadgeRef) { 
      if (isReducedMotionActive) {
        springX.set(finalX);
        springY.set(finalY);
        springScale.set(1);
        springOpacity.set(1);
        controls.start("visibleStatic");
      } else {
        springX.set(initialAnimX);
        springY.set(initialAnimY);
        springScale.set(0.3);
        springOpacity.set(0);
        controls.start("hidden");

        observer = new IntersectionObserver(
          (entries) => {
            const entry = entries[0];
            if (entry.isIntersecting && entry.boundingClientRect.top > 0) {
              springX.set(finalX);
              springY.set(finalY);
              springScale.set(1);
              springOpacity.set(1);
              controls.start("visible");
              if (currentBadgeRef && observer) observer.unobserve(currentBadgeRef);
            }
          },
          { threshold: 0.1 }
        );
        observer.observe(currentBadgeRef);
      }
    }
    
    return () => {
      if (currentBadgeRef && observer) {
        observer.unobserve(currentBadgeRef);
      }
    };
  }, [isReducedMotionActive, finalX, finalY, springX, springY, springScale, springOpacity, controls, initialAnimX, initialAnimY]);


  const badgeStyle = { 
    x: springX, 
    y: springY, 
    scale: springScale, 
    opacity: springOpacity, 
    translateX: '-50%', 
    translateY: '-50%' 
  };

  const progressRingOuterRadius = iconSize * 0.75 + 6; 
  const progressRingCircumference = 2 * Math.PI * progressRingOuterRadius;
  const Icon = skill.icon as IconComponent;

  const handleMouseEnter = () => {
    setIsBadgeHovered(true);
    onHover(skill);
    onCategoryHover(skill.category);
    if (!isReducedMotionActive) {
      controls.start("hover");
    }
  };

  const handleMouseLeave = () => {
    setIsBadgeHovered(false);
    onHover(null);
    onCategoryHover(null);
    if (!isReducedMotionActive) {
       controls.start(isReducedMotionActive ? "visibleStatic" : "visible");
    }
  };
  
  const handleFocus = () => handleMouseEnter();
  const handleBlur = () => handleMouseLeave();

  const badgeBaseSize = iconSize + 12; 

  return (
    <motion.div
      ref={badgeRef}
      className="absolute left-1/2 top-1/2 cursor-pointer flex flex-col items-center group"
      style={{ 
        ...badgeStyle,
        zIndex: isBadgeHovered ? 20 : 1 ,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      role="button"
      tabIndex={0}
      aria-label={`${skill.name} - ${skill.experience}, ${skill.proficiency}% proficiency`}
      animate={controls}
      variants={{
         hidden: { opacity: 0, scale: 0.3, x: initialAnimX, y: initialAnimY, rotate: isReducedMotionActive ? 0 : (Math.random() - 0.5) * 45 },
         visibleStatic: { opacity: 1, scale: 1, x: finalX, y: finalY, rotate: 0, transition: { duration: 0 } },
         visible: { 
            opacity: 1, 
            scale: 1, 
            x: finalX,
            y: finalY,
            rotate: 0,
            transition: { 
              type: "spring", 
              stiffness:150, 
              damping:20, 
              delay: isReducedMotionActive ? 0 : index * 0.08 
            }
         },
         hover: { 
            scale: 1.15, 
            rotate: isReducedMotionActive ? 0 : 5,
            boxShadow: "0px 0px 20px hsla(var(--primary), 0.4)",
            transition: { type: 'spring', stiffness: 300, damping: 15 }
         }
      }}
      initial="hidden"
    >
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.div 
              className={cn(
                "relative p-1 rounded-full border-2 border-transparent group-hover:border-primary/60 transition-colors duration-200 flex items-center justify-center bg-card/70 backdrop-blur-sm shadow-lg",
                isBadgeHovered && !isReducedMotionActive && "border-primary/60" 
              )}
              style={{ width: badgeBaseSize * 2, height: badgeBaseSize * 2 }}
            >
              <svg 
                className="absolute inset-0 w-full h-full overflow-visible pointer-events-none" 
                viewBox={`0 0 ${badgeBaseSize*2} ${badgeBaseSize*2}`} 
              >
                 <defs>
                    <linearGradient id={`skillBadgeGradient-${skill.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="hsl(var(--gradient-start))" />
                        <stop offset="50%" stopColor="hsl(var(--gradient-middle))" />
                        <stop offset="100%" stopColor="hsl(var(--gradient-end))" />
                    </linearGradient>
                </defs>
                <circle
                  cx={badgeBaseSize} cy={badgeBaseSize}
                  r={progressRingOuterRadius}
                  fill="transparent"
                  stroke="hsl(var(--border) / 0.3)" 
                  strokeWidth="3"
                />
                <motion.circle 
                  cx={badgeBaseSize} cy={badgeBaseSize} 
                  r={progressRingOuterRadius}
                  fill="transparent"
                  stroke={`url(#skillBadgeGradient-${skill.id})`}
                  strokeWidth="3"
                  strokeLinecap="round"
                  transform={`rotate(-90 ${badgeBaseSize} ${badgeBaseSize})`} 
                  initial={{ strokeDashoffset: progressRingCircumference }}
                  animate={controls} 
                  variants={{
                    hidden: { strokeDashoffset: progressRingCircumference },
                    visibleStatic: {strokeDashoffset: progressRingCircumference * (1 - skill.proficiency / 100), transition: { duration: 0 } },
                    visible: { 
                      strokeDashoffset: progressRingCircumference * (1 - skill.proficiency / 100),
                      transition: { duration: 1, ease: "circOut", delay: (index * 0.08) + (isReducedMotionActive ? 0 : 0.5) } 
                    },
                    hover: {
                       scale: isReducedMotionActive ? 1 : 1.1, 
                       transition: { duration: 0.4, type: "spring", stiffness: 300, damping: 10, repeat: isReducedMotionActive ? 0: Infinity, repeatType: "reverse" }
                    }
                  }}
                  strokeDasharray={progressRingCircumference}
                />
              </svg>
              <motion.div
                className="z-10" 
                animate={controls}
                 variants={{
                  hidden: { y:0, rotate:0},
                  visible: {y:0, rotate:0, transition: { duration: 0 }},
                  visibleStatic: {y:0, rotate:0, transition: { duration: 0 }},
                  hover: { 
                    y: isReducedMotionActive ? 0 : [0, -5, 0], 
                    rotate: isReducedMotionActive ? 0 : [0, 3, -3, 0],
                    transition:{ 
                      y: { duration: 0.4, ease: "easeInOut", repeat: isReducedMotionActive ? 0: Infinity, repeatDelay: 0.1, delay:0.05},
                      rotate: { duration: 0.5, ease: "easeInOut", repeat: isReducedMotionActive ? 0: Infinity, repeatDelay: 0.15, delay:0.1}
                    }
                  }
                }}
              >
                <Icon size={iconSize} className={cn("text-primary group-hover:text-[hsl(var(--gradient-middle))] transition-colors duration-200", isBadgeHovered && "text-[hsl(var(--gradient-middle))]")} />
              </motion.div>
            </motion.div>
          </TooltipTrigger>
          <AnimatePresence>
            {isBadgeHovered && (
              <TooltipContent 
                forceMount 
                side="top" 
                className="custom-tooltip-content tooltip-arrow-top w-56 bg-popover/85 backdrop-blur-md text-popover-foreground p-3.5 rounded-lg shadow-xl border border-border/40"
                sideOffset={18} 
                align="center"
                asChild
              > 
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1, transition: { duration: 0.15, ease:'easeOut', delay: isReducedMotionActive ? 0 : 0.05 } }}
                  exit={{ opacity: 0, y: -8, scale: 0.95, transition: { duration: 0.1, ease:'easeIn' } }}
                >
                  <p className="font-bold gradient-text text-md mb-2.5 text-center">{skill.name}</p>
                  <div className="my-2">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>Proficiency</span>
                      <span>{skill.proficiency}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-muted/60 rounded-full overflow-hidden border border-border/30">
                      <motion.div
                        className="h-full gradient-button"
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.proficiency}%` }}
                        transition={{ duration: 0.5, ease: "circOut", delay: isReducedMotionActive ? 0 : 0.15 }} 
                      />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2.5 text-center">Experience: {skill.experience}</p>
                  {skill.description && <p className="text-xs text-muted-foreground/80 mt-2 pt-2 border-t border-border/40 text-center">{skill.description}</p>}
                </motion.div>
              </TooltipContent>
            )}
          </AnimatePresence>
        </Tooltip>
      </TooltipProvider>
    </motion.div>
  );
};

let isMobileView = false; 

interface SkillGalaxyProps {
  skills: Skill[];
  categories: SkillCategory[];
  onSkillHover: (skill: Skill | null) => void;
  onCategoryHover: (category: SkillCategoryName | null) => void;
  isReducedMotionActive: boolean;
  theme: string | undefined;
  hoveredCategory: SkillCategoryName | null;
}

const SkillGalaxy: React.FC<SkillGalaxyProps> = ({ skills, categories, onSkillHover, onCategoryHover, isReducedMotionActive, theme, hoveredCategory }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [galaxyDimensions, setGalaxyDimensions] = useState({ width: 500, height: 500 });
  const [isDesktop, setIsDesktop] = useState(false);


  useEffect(() => {
    const updateDimensionsAndDevice = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        const size = Math.min(clientWidth, clientHeight, 800); 
        setGalaxyDimensions({ width: size, height: size });
      }
      const desktopCheck = window.innerWidth >= 768;
      setIsDesktop(desktopCheck);
      isMobileView = !desktopCheck; 
    };
    
    if (typeof window !== 'undefined') {
        updateDimensionsAndDevice();
        window.addEventListener('resize', updateDimensionsAndDevice);
        return () => window.removeEventListener('resize', updateDimensionsAndDevice);
    }
  }, []);
  

  const currentIconSize = isDesktop ? ICON_SIZE_DESKTOP : ICON_SIZE_MOBILE;
  const badgeVisualDiameter = (currentIconSize + 12 ) * 2 * 1.15; 
  
  const radarChartContainerSize = Math.max(220, Math.min(galaxyDimensions.width * 0.35, isDesktop ? 280 : 220));
  
  const radarVisualRadius = radarChartContainerSize * 0.5 * 0.9; 
  
  const marginBetweenRadarAndBadges = Math.max(15, Math.min(galaxyDimensions.width * 0.04, isDesktop ? 25 : 15)); 
  
  const minOrbitRadiusDueToRadar = radarVisualRadius + (badgeVisualDiameter / 2) + marginBetweenRadarAndBadges;

  const desiredBadgeSpacing = isDesktop ? 25 : 15; 
  const circumferenceNeededForSpacing = skills.length * (badgeVisualDiameter + desiredBadgeSpacing);
  const calculatedBadgeOrbitRadiusForSpacing = circumferenceNeededForSpacing / (2 * Math.PI);
  
  let finalBadgeOrbitRadius = Math.max(calculatedBadgeOrbitRadiusForSpacing, minOrbitRadiusDueToRadar);

  const maxGalaxyContentRadius = (Math.min(galaxyDimensions.width, galaxyDimensions.height) / 2) - (badgeVisualDiameter / 2) - (isDesktop ? 10 : 5);
  finalBadgeOrbitRadius = Math.min(finalBadgeOrbitRadius, maxGalaxyContentRadius > 0 ? maxGalaxyContentRadius : minOrbitRadiusDueToRadar);
  finalBadgeOrbitRadius = Math.max(finalBadgeOrbitRadius, isDesktop ? 200 : 160);


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

  const CustomAngleTick = useCallback(({ x, y, payload }: any) => {
    const isRadarHovered = payload.value === hoveredCategory;    
    let textAnchor = "middle";
    const angle = payload.angle; 
    const labelRadiusOffset = Math.max(12, radarChartContainerSize * 0.085); 

    const radianAngle = (angle * Math.PI) / 180;
    const labelX = x + labelRadiusOffset * Math.cos(radianAngle);
    const labelY = y + labelRadiusOffset * Math.sin(radianAngle);

    if (angle > 10 && angle < 170) { 
       textAnchor = "middle";
    } else if (angle > 190 && angle < 350) { 
       textAnchor = "middle";
    } else if (angle <= 10 || angle >= 350) { 
        textAnchor = "start";
    } else { 
        textAnchor = "end";
    }
    
    let dx = 0;
    if (textAnchor === "start") dx = 3;
    if (textAnchor === "end") dx = -3;

    return (
      <g transform={`translate(${labelX + dx},${labelY})`}>
        <text
          x={0}
          y={0}
          dy={4} 
          textAnchor={textAnchor}
          fill={isRadarHovered ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))'}
          fontWeight={isRadarHovered ? 'bold' : 'normal'}
          fontSize={Math.max(9, radarChartContainerSize * 0.055)} 
          className="transition-all duration-200"
        >
          {payload.value}
        </text>
      </g>
    );
  }, [hoveredCategory, radarChartContainerSize]);

  return (
    <div ref={containerRef} className="w-full h-full relative flex items-center justify-center">
      <motion.div 
        className="absolute" 
        style={{ width: radarChartContainerSize, height: radarChartContainerSize }}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1, transition: { delay: isReducedMotionActive ? 0 : 0.3, duration: 0.8, ease: "circOut" } }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="60%" data={radarChartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}> 
            <PolarGrid stroke={theme === 'dark' ? "hsl(var(--border)/0.4)" : "hsl(var(--muted)/0.6)"} />
            <PolarAngleAxis
              dataKey="subject"
              tickLine={false} 
              axisLine={{ stroke: theme === 'dark' ? "hsl(var(--border)/0.3)" : "hsl(var(--muted)/0.5)", strokeWidth: hoveredCategory ? 1.5 : 1 }}
              tick={<CustomAngleTick />}
            />
            <PolarRadiusAxis
              angle={30} 
              domain={[0, 100]}
              tickCount={5}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: Math.max(8, radarChartContainerSize * 0.045) }} 
              axisLine={false} 
              tickLine={{ stroke: theme === 'dark' ? "hsl(var(--border)/0.2)" : "hsl(var(--muted)/0.4)"}} 
            />
            <Radar
              name="Avg Proficiency"
              dataKey="A"
              stroke="hsl(var(--primary))"
              fill="hsl(var(--primary))"
              fillOpacity={hoveredCategory ? 0.7 : 0.5} 
              strokeWidth={hoveredCategory ? 3 : 2}
              dot={{ stroke: 'hsl(var(--primary))', strokeWidth: 2, r: 3, fill: 'hsl(var(--background))' }}
              activeDot={hoveredCategory ? { stroke: 'hsl(var(--background))', strokeWidth: 2.5, r: 5, fill: 'hsl(var(--primary))' } : { stroke: 'hsl(var(--primary))', strokeWidth: 1.5, r: 2.5, fill: 'hsl(var(--background))' }}
              isAnimationActive={!isReducedMotionActive}
              animationDuration={isReducedMotionActive ? 0 : 800}
              className="cursor-pointer"
            />
            <RechartsTooltip
              contentStyle={{
                backgroundColor: 'hsla(var(--popover-rgb), 0.9)', 
                backdropFilter: 'blur(10px)',
                border: '1px solid hsl(var(--border))',
                borderRadius: 'var(--radius)',
                color: 'hsl(var(--popover-foreground))',
                fontSize: '12px',
                boxShadow: 'var(--shadow-xl)'
              }}
              itemStyle={{ color: 'hsl(var(--popover-foreground))' }}
              labelStyle={{ color: 'hsl(var(--gradient-middle))', fontWeight: 'bold', marginBottom: '5px' }}
              cursor={{ fill: 'hsla(var(--primary-rgb), 0.2)' }}
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
          orbitRadius={finalBadgeOrbitRadius}
          iconSize={currentIconSize}
          onHover={onSkillHover}
          onCategoryHover={onCategoryHover}
          isReducedMotionActive={isReducedMotionActive}
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
  const [currentMobileView, setCurrentMobileView] = useState(false);

  const { theme } = useTheme();

  useEffect(() => {
    setIsClient(true);
    setIsReducedMotionActive(framerReducedMotion === true); 

    const checkMobile = () => {
      const mobileCheck = window.innerWidth < 768; 
      setCurrentMobileView(mobileCheck);
      isMobileView = mobileCheck; 
    };
    
    if (typeof window !== 'undefined') {
      checkMobile(); 
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
    }
  }, [framerReducedMotion]); 

  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
  };

  if (!isClient) { 
    return (
      <Section id="skills" title="My Tech Toolbox" className="py-16 md:py-24 min-h-[500px] md:min-h-[700px]">
        <div className="text-center text-muted-foreground">Loading skills...</div>
      </Section>
    );
  }
  
  return (
    <Section id="skills" aria-labelledby="skills-heading" className="py-20 md:py-28 lg:py-32 overflow-hidden">
       <motion.h2 
        id="skills-heading"
        className="text-3xl md:text-4xl font-bold mb-12 md:mb-16 text-center gradient-text"
        initial={{ opacity: 0, y: isReducedMotionActive ? 0 : -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: isReducedMotionActive ? 0 : 0.1 }}
      >
        My Tech Toolbox
      </motion.h2>
       <motion.div
        variants={sectionVariants}
        initial={isReducedMotionActive ? "visible" : "hidden"} 
        whileInView="visible"
        viewport={{ once: true, amount: 0.05 }} 
      >
      {currentMobileView ? (
        <Accordion type="single" collapsible className="w-full space-y-4">
          {skillCategories.map((category) => (
            <AccordionItem key={category.name} value={category.name} className="bg-card/60 backdrop-blur-md border-border/30 shadow-lg rounded-lg">
              <AccordionTrigger className="p-4 hover:no-underline focus-visible:ring-2 focus-visible:ring-ring rounded-t-lg">
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
                              <Card className="bg-background/50 p-3 rounded-md shadow-sm cursor-default focus-visible:ring-2 focus-visible:ring-ring">
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
                              className="custom-tooltip-content w-48 bg-popover/80 backdrop-blur-md text-popover-foreground p-3 rounded-lg shadow-xl border border-border/30"
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
        <div 
          className="relative w-full mx-auto"
          style={{ height: 'calc(min(90vh, 750px))' }} 
        >
             <SkillGalaxy
                skills={skillsData}
                categories={skillCategories}
                onSkillHover={setActiveSkill} 
                onCategoryHover={setHoveredCategory} 
                isReducedMotionActive={isReducedMotionActive}
                theme={theme}
                hoveredCategory={hoveredCategory}
              />
          </div>
      )}
      </motion.div>
    </Section>
  );
}
