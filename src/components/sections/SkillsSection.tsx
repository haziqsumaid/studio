
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
  initialX: number; 
  initialY: number; 
  onHover: (skill: Skill | null) => void;
  onCategoryHover: (category: SkillCategoryName | null) => void;
  isReducedMotionActive: boolean;
  theme: string | undefined;
}

const SkillBadge: React.FC<SkillBadgeProps> = ({ 
  skill, index, totalSkills, orbitRadius, iconSize, initialX, initialY,
  onHover, onCategoryHover, isReducedMotionActive, theme 
}) => {
  const angle = (index / totalSkills) * 2 * Math.PI - Math.PI / 2; 
  const xPos = orbitRadius * Math.cos(angle); 
  const yPos = orbitRadius * Math.sin(angle); 

  const ref = useRef<HTMLDivElement>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [isBadgeHovered, setIsBadgeHovered] = useState(false);

  const springConfig = { damping: 15, stiffness: 80, mass: 0.5 };
  const springX = useSpring(isReducedMotionActive ? xPos : initialX, springConfig);
  const springY = useSpring(isReducedMotionActive ? yPos : initialY, springConfig);
  const springScale = useSpring(isReducedMotionActive ? 1 : 0.3, { ...springConfig, stiffness: 100 });
  const springOpacity = useSpring(isReducedMotionActive ? 1 : 0, { damping: 20, stiffness: 100 });

  useEffect(() => {
    const currentReffed = ref.current;
    let observer: IntersectionObserver;

    if (isReducedMotionActive) {
      springX.set(xPos);
      springY.set(yPos);
      springScale.set(1);
      springOpacity.set(1);
      setIsIntersecting(true);
      return;
    }
    
    // Reset to initial animation state for observer
    springX.set(initialX);
    springY.set(initialY);
    springScale.set(0.3);
    springOpacity.set(0);
    setIsIntersecting(false);


    observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.boundingClientRect.top > 0) { // Check if element is in viewport and not above it
          if (!isIntersecting) {
            setIsIntersecting(true);
            springX.set(xPos);
            springY.set(yPos);
            springScale.set(1);
            springOpacity.set(1);
          }
        }
      },
      { threshold: 0.1 }
    );

    if (currentReffed) {
      observer.observe(currentReffed);
    }

    return () => {
      if (currentReffed) {
        observer.unobserve(currentReffed);
      }
    };
  }, [isReducedMotionActive, xPos, yPos, initialX, initialY, springX, springY, springScale, springOpacity, isIntersecting]);


  const badgeStyle = { 
    x: springX, 
    y: springY, 
    scale: springScale, 
    opacity: springOpacity, 
    translateX: '-50%', 
    translateY: '-50%' 
  };

  const progressRingRadius = iconSize + 4; 
  const progressRingCircumference = 2 * Math.PI * progressRingRadius;
  const Icon = skill.icon as IconComponent;

  const handleMouseEnter = () => {
    setIsBadgeHovered(true);
    onHover(skill);
    onCategoryHover(skill.category);
    if (!isReducedMotionActive) {
      springScale.set(1.15); 
    }
  };

  const handleMouseLeave = () => {
    setIsBadgeHovered(false);
    onHover(null);
    onCategoryHover(null);
    if (!isReducedMotionActive) {
      springScale.set(1); 
    }
  };
  
  const handleFocus = () => handleMouseEnter();
  const handleBlur = () => handleMouseLeave();

  return (
    <motion.div
      ref={ref}
      className="absolute left-1/2 top-1/2 cursor-pointer flex flex-col items-center group"
      style={{ 
        ...badgeStyle,
        zIndex: isBadgeHovered ? 20 : 1 // Ensure hovered/focused badge is on top
      }}
      onHoverStart={handleMouseEnter}
      onHoverEnd={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      role="button"
      tabIndex={0}
      aria-label={`${skill.name} - ${skill.experience}, ${skill.proficiency}% proficiency`}
    >
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.div 
              className="relative p-1 rounded-full border-2 border-transparent group-hover:border-primary/50 transition-colors duration-200 flex items-center justify-center bg-card/60 backdrop-blur-sm"
              style={{ width: (iconSize + 12) * 2, height: (iconSize + 12) * 2 }} 
              animate={!isReducedMotionActive && isBadgeHovered ? { scale:1.05, boxShadow: "0px 0px 20px hsla(var(--primary), 0.3)" } : { scale:1, boxShadow: "0px 0px 0px hsla(var(--primary), 0.0)"}}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            >
              <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox={`0 0 ${(progressRingRadius*2+6)} ${(progressRingRadius*2+6)}`}>
                 <defs>
                    <linearGradient id={`skillBadgeGradient-${skill.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="hsl(var(--gradient-start))" />
                        <stop offset="50%" stopColor="hsl(var(--gradient-middle))" />
                        <stop offset="100%" stopColor="hsl(var(--gradient-end))" />
                    </linearGradient>
                </defs>
                <motion.circle 
                  cx={progressRingRadius+3} cy={progressRingRadius+3}
                  r={progressRingRadius}
                  fill="transparent"
                  stroke={`url(#skillBadgeGradient-${skill.id})`}
                  strokeWidth="3"
                  strokeLinecap="round"
                  transform={`rotate(-90 ${progressRingRadius+3} ${progressRingRadius+3})`}
                  initial={{ strokeDashoffset: progressRingCircumference }}
                  animate={isIntersecting || isReducedMotionActive ? { 
                    strokeDashoffset: progressRingCircumference * (1 - skill.proficiency / 100),
                    r: isBadgeHovered && !isReducedMotionActive ? progressRingRadius * 1.15 : progressRingRadius,
                  } : { strokeDashoffset: progressRingCircumference }}
                  transition={isReducedMotionActive ? {duration: 0} : {
                    strokeDashoffset: { duration: 1, ease: "easeOut", delay: index * 0.08 + (isIntersecting ? 0.8 : 0) }, 
                    r: { type: 'spring', stiffness: 400, damping: 10, duration: 0.4, repeat: isBadgeHovered && !isReducedMotionActive ? Infinity : 0, repeatType: "reverse", delay: 0.2 }
                  }}
                  strokeDasharray={progressRingCircumference}
                />
              </svg>
              <motion.div
                className="z-10"
                animate={!isReducedMotionActive ? { y: isBadgeHovered ? [0, -5, 0] : 0, rotate: isBadgeHovered ? [0, 5, -5, 0] : 0 } : {}}
                transition={{ 
                  y: { duration: 0.3, ease: "easeInOut", repeat: isBadgeHovered && !isReducedMotionActive ? Infinity : 0, repeatDelay: 0.2, delay:0.05},
                  rotate: { duration: 0.4, ease: "easeInOut", repeat: isBadgeHovered && !isReducedMotionActive ? Infinity : 0, repeatDelay: 0.3, delay:0.1}
                }}
              >
                <Icon size={iconSize} className="text-primary group-hover:text-[hsl(var(--gradient-end))] transition-colors duration-200" />
              </motion.div>
            </motion.div>
          </TooltipTrigger>
          <TooltipContent 
            side="top" 
            className="custom-tooltip-content tooltip-arrow-top w-56 bg-popover/80 backdrop-blur-md text-popover-foreground p-3 rounded-lg shadow-xl border border-border/30"
            sideOffset={16} // Increased offset to avoid overlap with enlarged badge
            align="center"
            // Animate tooltip visibility with Framer Motion
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.15, delay: 0.2 } }}
            exit={{ opacity: 0, y: -10, transition: { duration: 0.1 } }}
          > 
            <p className="font-bold gradient-text text-md mb-2 text-center">{skill.name}</p>
            <div className="my-1.5">
              <div className="flex justify-between text-xs text-muted-foreground mb-0.5">
                <span>Proficiency</span>
                <span>{skill.proficiency}%</span>
              </div>
              <div className="w-full h-2 bg-muted/50 rounded-full overflow-hidden">
                <motion.div
                  className="h-full gradient-button"
                  initial={{ width: 0 }}
                  animate={{ width: `${skill.proficiency}%` }}
                  transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }} 
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">Experience: {skill.experience}</p>
            {skill.description && <p className="text-xs text-muted-foreground/80 mt-1.5 pt-1.5 border-t border-border/30 text-center">{skill.description}</p>}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      {/* Removed direct text rendering from here to prevent overlap */}
    </motion.div>
  );
};


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
      setIsDesktop(window.innerWidth >= 768);
    };
    updateDimensionsAndDevice();
    window.addEventListener('resize', updateDimensionsAndDevice);
    return () => window.removeEventListener('resize', updateDimensionsAndDevice);
  }, []);
  
  const currentIconSize = isDesktop ? ICON_SIZE_DESKTOP : ICON_SIZE_MOBILE;
  const badgeVisualDiameter = (currentIconSize + 12) * 2 + 16; // Approx diameter of the badge visual area (including padding/border)
  
  // Radar chart setup
  const radarChartContainerSize = Math.max(200, Math.min(galaxyDimensions.width * 0.35, isDesktop ? 280 : 220)); // Slightly smaller radar
  const radarVisualRadius = radarChartContainerSize * 0.5 * 0.6; // Radar chart's actual visual radius

  // Margin between radar's visual edge and inner edge of skill badges
  const marginBetweenRadarAndBadges = Math.max(30, Math.min(galaxyDimensions.width * 0.1, isDesktop ? 70 : 40)); // Adjusted margin
  
  // Minimum orbit radius to clear the radar chart comfortably
  const minOrbitRadiusDueToRadar = radarVisualRadius + (badgeVisualDiameter / 2) + marginBetweenRadarAndBadges;

  // Calculate orbit radius based on badge spacing (if it were a full circle of badges)
  const desiredBadgeSpacing = isDesktop ? 60 : 40; // Increased spacing
  const circumferenceNeededForSpacing = skills.length * (badgeVisualDiameter + desiredBadgeSpacing);
  const calculatedBadgeOrbitRadiusForSpacing = circumferenceNeededForSpacing / (2 * Math.PI);
  
  let finalBadgeOrbitRadius = Math.max(calculatedBadgeOrbitRadiusForSpacing, minOrbitRadiusDueToRadar);

  // Ensure it fits within the galaxy, leaving some padding.
  const maxGalaxyContentRadius = (Math.min(galaxyDimensions.width, galaxyDimensions.height) / 2) - (badgeVisualDiameter / 2) - (isDesktop ? 20 : 10); // Padding from edge
  finalBadgeOrbitRadius = Math.min(finalBadgeOrbitRadius, maxGalaxyContentRadius > 0 ? maxGalaxyContentRadius : minOrbitRadiusDueToRadar);
  finalBadgeOrbitRadius = Math.max(finalBadgeOrbitRadius, isDesktop ? 250 : 200); // Absolute minimum orbit, increased


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
    const labelRadiusOffset = Math.max(10, radarChartContainerSize * 0.05); 

    const radianAngle = (angle * Math.PI) / 180;
    const labelX = x + labelRadiusOffset * Math.cos(radianAngle);
    const labelY = y + labelRadiusOffset * Math.sin(radianAngle);

    if (angle > 10 && angle < 170) { 
       // textAnchor = "middle"; // Default
    } else if (angle > 190 && angle < 350) { 
       // textAnchor = "middle"; // Default
    } else if (angle <= 10 || angle >= 350) { 
        textAnchor = "start";
    } else { 
        textAnchor = "end";
    }

    return (
      <g transform={`translate(${labelX},${labelY})`}>
        <text
          x={0}
          y={0}
          dy={4} 
          textAnchor={textAnchor}
          fill={isRadarHovered ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))'}
          fontWeight={isRadarHovered ? 'bold' : 'normal'}
          fontSize={Math.max(8, radarChartContainerSize * 0.045)} 
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
          <RadarChart cx="50%" cy="50%" outerRadius="65%" data={radarChartData}> 
            <PolarGrid stroke={theme === 'dark' ? "hsl(var(--border)/0.3)" : "hsl(var(--muted)/0.5)"} />
            <PolarAngleAxis
              dataKey="subject"
              tickLine={false} 
              axisLine={{ stroke: theme === 'dark' ? "hsl(var(--border)/0.2)" : "hsl(var(--muted)/0.4)" }}
              tick={<CustomAngleTick />}
            />
            <PolarRadiusAxis
              angle={30} 
              domain={[0, 100]}
              tickCount={5}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: Math.max(6, radarChartContainerSize * 0.035) }}
              axisLine={false} 
              tickLine={false} 
            />
            <Radar
              name="Avg Proficiency"
              dataKey="A"
              stroke="hsl(var(--primary))"
              fill="hsl(var(--primary))"
              fillOpacity={hoveredCategory ? 0.6 : 0.4} 
              strokeWidth={hoveredCategory ? 2.5 : 1.5}
              isAnimationActive={!isReducedMotionActive}
              animationDuration={isReducedMotionActive ? 0 : 800}
            />
            <RechartsTooltip
              contentStyle={{
                backgroundColor: 'hsla(var(--popover-rgb), 0.8)', 
                backdropFilter: 'blur(6px)',
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
          orbitRadius={finalBadgeOrbitRadius}
          iconSize={currentIconSize}
          initialX={(Math.random() - 0.5) * (galaxyDimensions.width * 0.1)} // Start closer to center
          initialY={(Math.random() - 0.5) * (galaxyDimensions.height * 0.1)}
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
  const [isMobileView, setIsMobileView] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    setIsClient(true);
    setIsReducedMotionActive(framerReducedMotion === true); 

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
      <Section id="skills" title="My Tech Toolbox" className="py-16 md:py-24 min-h-[500px] md:min-h-[700px]">
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
          style={{ height: 'calc(min(90vh, 800px))' }} // Adjusted height for better spacing
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

    