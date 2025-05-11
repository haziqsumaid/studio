
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
  initialX: number; // Initial offset from center for animation start
  initialY: number; // Initial offset from center for animation start
  onHover: (skill: Skill | null) => void;
  onCategoryHover: (category: SkillCategoryName | null) => void;
  isReducedMotion: boolean;
  theme: string | undefined;
}

const SkillBadge: React.FC<SkillBadgeProps> = ({ 
  skill, index, totalSkills, orbitRadius, iconSize, initialX, initialY,
  onHover, onCategoryHover, isReducedMotion, theme 
}) => {
  const angle = (index / totalSkills) * 2 * Math.PI - Math.PI / 2; // -Math.PI/2 to start from top
  const xPos = orbitRadius * Math.cos(angle); // Final x-offset from center
  const yPos = orbitRadius * Math.sin(angle); // Final y-offset from center

  const controls = useAnimation();
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [isBadgeHovered, setIsBadgeHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const springX = useSpring(initialX, { damping: 15, stiffness: 80, mass: 0.5 });
  const springY = useSpring(initialY, { damping: 15, stiffness: 80, mass: 0.5 });
  const springScale = useSpring(isReducedMotion ? 1 : 0.3, { damping: 15, stiffness: 100 });
  const springOpacity = useSpring(isReducedMotion ? 1: 0, { damping: 20, stiffness: 100 });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isIntersecting && entry.boundingClientRect.top > 0) { 
          setIsIntersecting(true);
          if (!isReducedMotion) {
            // Animate to final orbital position
            springX.set(xPos);
            springY.set(yPos);
            springScale.set(1);
            springOpacity.set(1);
          } else {
            // Set directly if reduced motion
            controls.start({ opacity: 1, scale: 1, x: xPos, y: yPos, transition: { duration: 0 }});
          }
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
      if (isReducedMotion) { // Set initial state for reduced motion if not intersecting yet
         controls.start({ opacity: 1, scale: 1, x: xPos, y: yPos, transition: { duration: 0 }});
      } else { // Set initial spring values for animation from center
        springX.set(initialX);
        springY.set(initialY);
        springScale.set(0.3);
        springOpacity.set(0);
      }
    }
    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReducedMotion, xPos, yPos, springX, springY, springScale, springOpacity, controls, initialX, initialY, isIntersecting]);


  const badgeStyle = isReducedMotion 
    ? { x: xPos, y: yPos, translateX: '-50%', translateY: '-50%' } 
    : { 
        x: springX, 
        y: springY, 
        translateX: '-50%', 
        translateY: '-50%', 
        scale: springScale, 
        opacity: springOpacity 
      };

  const progressRingRadius = iconSize + 4; 
  const progressRingCircumference = 2 * Math.PI * progressRingRadius;
  const Icon = skill.icon as IconComponent;

  const badgeVisualWidth = (iconSize + 12) * 2 + 16;
  const badgeVisualHeight = (iconSize + 12) * 2 + 30; // Includes text below

  const handleMouseEnter = () => {
    setIsBadgeHovered(true);
    onHover(skill);
    onCategoryHover(skill.category);
    if (!isReducedMotion) {
      // Animate scale and zIndex on hover, not full controls.start
      springScale.set(1.15); 
      // controls.start({ zIndex:20 }) // zIndex can be set directly if needed or use a separate motion value
    }
  };

  const handleMouseLeave = () => {
    setIsBadgeHovered(false);
    onHover(null);
    onCategoryHover(null);
    if (!isReducedMotion) {
      springScale.set(1); // Return to normal scale
      // controls.start({ zIndex:1 })
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
        width: badgeVisualWidth, 
        height: badgeVisualHeight,
        zIndex: isBadgeHovered ? 20 : 1 // Manage zIndex based on hover state
      }}
      animate={controls} // Used for initial reduced motion direct set
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
              style={{ width: (iconSize + 12) * 2, height: (iconSize + 12) * 2 }} // Circular part
              whileHover={!isReducedMotion ? { 
                scale: 1.0, // Keep inner circle scale, outer div handles pop via springScale
              } : {}}
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
                <motion.circle // Progress ring
                  cx={progressRingRadius+3} cy={progressRingRadius+3}
                  r={progressRingRadius}
                  fill="transparent"
                  stroke={`url(#skillBadgeGradient-${skill.id})`}
                  strokeWidth="3"
                  strokeLinecap="round"
                  transform={`rotate(-90 ${progressRingRadius+3} ${progressRingRadius+3})`}
                  initial={{ strokeDashoffset: progressRingCircumference }}
                  animate={isIntersecting || isReducedMotion ? { 
                    strokeDashoffset: progressRingCircumference * (1 - skill.proficiency / 100),
                    // Ring pulse on hover, managed by whileHover on parent or direct animation
                    r: isBadgeHovered && !isReducedMotion ? progressRingRadius * 1.1 : progressRingRadius, 
                  } : { strokeDashoffset: progressRingCircumference }}
                  transition={isReducedMotion ? {duration: 0} : {
                    strokeDashoffset: { duration: 1, ease: "easeOut", delay: index * 0.08 + (isIntersecting ? 0.8 : 0) }, 
                    r: { type: 'spring', stiffness: 400, damping: 10, duration: 0.4, repeat: isBadgeHovered && !isReducedMotion ? Infinity : 0, repeatType: "reverse" }
                  }}
                  strokeDasharray={progressRingCircumference}
                />
              </svg>
              <motion.div
                className="z-10"
                animate={!isReducedMotion ? { y: isBadgeHovered ? [0, -5, 0] : 0 } : {}}
                transition={{ duration: 0.3, ease: "easeInOut", repeat: isBadgeHovered && !isReducedMotion ? Infinity : 0, repeatDelay: 0.2, delay:0.05}}
              >
                <Icon size={iconSize} className="text-primary group-hover:text-[hsl(var(--gradient-end))] transition-colors duration-200" />
              </motion.div>
            </motion.div>
          </TooltipTrigger>
          <TooltipContent 
            side="top" 
            className="custom-tooltip-content tooltip-arrow-top w-52 bg-popover/80 backdrop-blur-md text-popover-foreground p-3 rounded-lg shadow-xl border border-border/30"
            sideOffset={12}
            // Framer Motion props for TooltipContent need to be on a motion component if used directly
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
                  animate={{ width: `${skill.proficiency}%` }}
                  transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }} 
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1.5">Experience: {skill.experience}</p>
            {skill.description && <p className="text-xs text-muted-foreground/80 mt-1 pt-1 border-t border-border/30">{skill.description}</p>}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <p className="mt-1.5 text-xs text-center text-muted-foreground group-hover:text-foreground transition-colors truncate w-full px-1">{skill.name}</p>
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
  const containerRef = useRef<HTMLDivElement>(null);
  const [galaxyDimensions, setGalaxyDimensions] = useState({ width: 500, height: 500 });
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const updateDimensionsAndDevice = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        const size = Math.min(clientWidth, clientHeight, 800); 
        setGalaxyDimensions({ width: size, height: size });
        setIsDesktop(window.innerWidth >= 768);
      }
    };
    updateDimensionsAndDevice();
    window.addEventListener('resize', updateDimensionsAndDevice);
    return () => window.removeEventListener('resize', updateDimensionsAndDevice);
  }, []);
  
  const currentIconSize = isDesktop ? ICON_SIZE_DESKTOP : ICON_SIZE_MOBILE;
  // Width of the entire SkillBadge component (circular part + text padding)
  const badgeBoxWidth = (currentIconSize + 12) * 2 + 16; 
  const desiredBadgeSpacing = isDesktop ? 30 : 20; // Increased spacing slightly

  // Calculate circumference needed based on full badge width + spacing
  const circumferenceNeeded = skills.length * (badgeBoxWidth + desiredBadgeSpacing);
  
  let calculatedBadgeOrbitRadius = circumferenceNeeded / (2 * Math.PI);
  
  // Ensure minimum radius for aesthetics and to prevent extreme crowding if few skills
  calculatedBadgeOrbitRadius = Math.max(calculatedBadgeOrbitRadius, isDesktop ? 180 : 150);

  // Aesthetic minimum radius, also constrained by half the galaxy size minus badge radius to keep badges visually within the galaxy area
  const maxGalaxyContentRadius = (Math.min(galaxyDimensions.width, galaxyDimensions.height) / 2) - (badgeBoxWidth / 2) - 10; // 10px padding from edge
  const aestheticMinOrbitRadius = Math.min(maxGalaxyContentRadius, isDesktop ? 280 : 220); // Increased max aesthetic size
  
  // Final orbit radius is the larger of what's needed for spacing vs. aesthetic minimum, but capped by container size
  let finalBadgeOrbitRadius = Math.max(calculatedBadgeOrbitRadius, aestheticMinOrbitRadius);
  finalBadgeOrbitRadius = Math.min(finalBadgeOrbitRadius, maxGalaxyContentRadius > 0 ? maxGalaxyContentRadius : aestheticMinOrbitRadius); // Ensure it fits


  const radarChartVisualRadiusPercentage = 0.65; // Radar chart outerRadius is 65% of its container
  // Margin between the radar chart's visual edge and the inner edge of skill badges
  const marginBetweenRadarAndBadges = Math.max(20, Math.min(galaxyDimensions.width * 0.05, 40)); 
  
  // Max size for radar container so badges don't overlap it: orbit radius - badge inner radius - margin
  const maxRadarContainerSizeBasedOnOrbit = 2 * (finalBadgeOrbitRadius - (currentIconSize + 4) /*progressRingRadius*/ - marginBetweenRadarAndBadges);

  // Target size for radar, e.g., 30% of galaxy, min 150px
  let targetRadarSize = Math.max(Math.min(galaxyDimensions.width, galaxyDimensions.height) * 0.3, 150);
  
  // Final radar container size is the smaller of its target or what fits inside the badge orbit
  let finalRadarContainerSize = Math.min(targetRadarSize, maxRadarContainerSizeBasedOnOrbit > 0 ? maxRadarContainerSizeBasedOnOrbit : targetRadarSize);
  finalRadarContainerSize = Math.max(finalRadarContainerSize, 120); // Absolute minimum practical radar size


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
    const labelRadiusOffset = Math.max(10, finalRadarContainerSize * 0.05); 

    const radianAngle = (angle * Math.PI) / 180;
    const labelX = x + labelRadiusOffset * Math.cos(radianAngle);
    const labelY = y + labelRadiusOffset * Math.sin(radianAngle);

    if (angle > 10 && angle < 170) { 
       // textAnchor = "middle";
    } else if (angle > 190 && angle < 350) { 
       // textAnchor = "middle";
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
          fontSize={Math.max(8, finalRadarContainerSize * 0.045)} 
          className="transition-all duration-200"
        >
          {payload.value}
        </text>
      </g>
    );
  }, [hoveredCategory, finalRadarContainerSize]);

  return (
    <div ref={containerRef} className="w-full h-full relative flex items-center justify-center">
      <motion.div 
        className="absolute" 
        style={{ width: finalRadarContainerSize, height: finalRadarContainerSize }}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1, transition: { delay: isReducedMotion ? 0 : 0.3, duration: 0.8, ease: "circOut" } }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius={`${radarChartVisualRadiusPercentage*100}%`} data={radarChartData}> 
            <PolarGrid stroke={theme === 'dark' ? "hsl(var(--border)/0.3)" : "hsl(var(--muted)/0.5)"} />
            <PolarAngleAxis
              dataKey="subject"
              tick={<CustomAngleTick />}
              axisLine={{ stroke: theme === 'dark' ? "hsl(var(--border)/0.2)" : "hsl(var(--muted)/0.4)" }}
              tickLine={{ stroke: theme === 'dark' ? "hsl(var(--border)/0.2)" : "hsl(var(--muted)/0.4)" }}
            />
            <PolarRadiusAxis
              angle={30} 
              domain={[0, 100]}
              tickCount={5}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: Math.max(6, finalRadarContainerSize * 0.035) }}
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
              isAnimationActive={!isReducedMotion}
              animationDuration={isReducedMotion ? 0 : 800}
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
          orbitRadius={finalBadgeOrbitRadius} // Use the final calculated and constrained radius
          iconSize={currentIconSize}
          initialX={0} // Start from center for orbit animation
          initialY={0}
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
  const [isReducedMotionActive, setIsReducedMotionActive] = useState(true); // Default to true for SSR
  const [isMobileView, setIsMobileView] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    setIsClient(true);
    // Ensure isReducedMotionActive is correctly set once framerReducedMotion is available
    setIsReducedMotionActive(framerReducedMotion === true); 

    const checkMobile = () => setIsMobileView(window.innerWidth < 768);
    checkMobile(); // Initial check
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [framerReducedMotion]); // Re-run when framerReducedMotion value changes

  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
  };

  if (!isClient) { // Skeleton or basic loading state for SSR / pre-hydration
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
        initial={isReducedMotionActive ? "visible" : "hidden"} // Apply initial based on reduced motion
        whileInView="visible"
        viewport={{ once: true, amount: 0.05 }} // Trigger when 5% is visible
      >
      {isMobileView ? (
        // Mobile View: Accordion
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
        // Desktop View: Skill Galaxy
        <div 
          className="relative w-full mx-auto"
          // Ensure enough height for the galaxy to not feel cramped
          style={{ height: 'calc(min(80vh, 750px))' }} 
        >
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
      )}
      </motion.div>
    </Section>
  );
}
