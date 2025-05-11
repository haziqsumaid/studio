
"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion, useAnimation, useSpring } from 'framer-motion';
import { Section } from '@/components/Section';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  centerOffset: { x: number; y: number };
  iconSize: number;
  onHover: (skill: Skill | null) => void;
  onCategoryHover: (category: SkillCategoryName | null) => void;
  isReducedMotion: boolean;
  theme: string | undefined;
}

const SkillBadge: React.FC<SkillBadgeProps> = ({ 
  skill, index, totalSkills, orbitRadius, centerOffset, iconSize, 
  onHover, onCategoryHover, isReducedMotion, theme 
}) => {
  const angle = (index / totalSkills) * 2 * Math.PI - Math.PI / 2;
  const finalX = orbitRadius * Math.cos(angle) + centerOffset.x;
  const finalY = orbitRadius * Math.sin(angle) + centerOffset.y;

  const controls = useAnimation();
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [isBadgeHovered, setIsBadgeHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const springX = useSpring(centerOffset.x, { damping: 15, stiffness: 80, mass: 0.5 });
  const springY = useSpring(centerOffset.y, { damping: 15, stiffness: 80, mass: 0.5 });
  const springScale = useSpring(0.3, { damping: 15, stiffness: 100 });
  const springOpacity = useSpring(0, { damping: 20, stiffness: 100 });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isIntersecting && entry.boundingClientRect.top > 0) { 
          setIsIntersecting(true);
          if (!isReducedMotion) {
            setTimeout(() => {
              springX.set(finalX);
              springY.set(finalY);
              springScale.set(1);
              springOpacity.set(1);
            }, index * 80); 
          } else {
            controls.start({ opacity: 1, scale: 1, x: finalX, y: finalY, transition: { duration: 0 }});
          }
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
       controls.start({ 
        x: centerOffset.x, 
        y: centerOffset.y, 
        scale: isReducedMotion ? 1: 0.3, 
        opacity: isReducedMotion ? 1: 0,
        transition: { duration: 0 } 
      });
    }
    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReducedMotion, finalX, finalY, centerOffset.x, centerOffset.y, springX, springY, springScale, springOpacity, controls, index]);


  const badgeStyle = isReducedMotion ? { x: finalX, y: finalY } : {
    x: springX,
    y: springY,
    scale: springScale,
    opacity: springOpacity,
  };

  const progressRingRadius = iconSize + 4; 
  const progressRingCircumference = 2 * Math.PI * progressRingRadius;

  const Icon = skill.icon as IconComponent;

  const handleMouseEnter = () => {
    setIsBadgeHovered(true);
    onHover(skill);
    onCategoryHover(skill.category);
    if (!isReducedMotion) {
      controls.start({ scale: 1.15, zIndex: 20, rotate: (Math.random() -0.5) * 10, transition: { type: 'spring', stiffness: 300, damping: 10 } });
    }
  };

  const handleMouseLeave = () => {
    setIsBadgeHovered(false);
    onHover(null);
    onCategoryHover(null);
    if (!isReducedMotion) {
      controls.start({ scale: 1, zIndex: 1, rotate:0, transition: { type: 'spring', stiffness: 300, damping: 15 } });
    }
  };
  
  const handleFocus = () => handleMouseEnter();
  const handleBlur = () => handleMouseLeave();

  return (
    <motion.div
      ref={ref}
      className="absolute cursor-pointer flex flex-col items-center group"
      style={{ ...badgeStyle, width: (iconSize + 12) * 2 + 16, height: (iconSize + 12) * 2 + 30 }} // Adjusted for consistent layout box
      animate={controls}
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
              initial={false} 
              animate={{ 
                scale: isBadgeHovered && !isReducedMotion ? 1.0 : 1,
              }}
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
                {/* Removed the background ring based on user request */}
                <motion.circle // Progress ring
                  cx={progressRingRadius+3} cy={progressRingRadius+3}
                  r={progressRingRadius}
                  fill="transparent"
                  stroke={`url(#skillBadgeGradient-${skill.id})`}
                  strokeWidth="3" // Keep stroke width consistent
                  strokeLinecap="round"
                  transform={`rotate(-90 ${progressRingRadius+3} ${progressRingRadius+3})`}
                  initial={{ strokeDashoffset: progressRingCircumference }}
                  animate={isIntersecting || isReducedMotion ? { 
                    strokeDashoffset: progressRingCircumference * (1 - skill.proficiency / 100),
                    r: isBadgeHovered && !isReducedMotion ? progressRingRadius * 1.1 : progressRingRadius, 
                  } : { strokeDashoffset: progressRingCircumference }}
                  transition={isReducedMotion ? {duration: 0} : {
                    strokeDashoffset: { duration: 1, ease: "easeOut", delay: index * 0.08 + (isIntersecting ? 0.8 : 0) }, 
                    r: { type: 'spring', stiffness: 400, damping: 10, duration: 0.4, repeat: isBadgeHovered ? Infinity : 0, repeatType: "reverse" }
                  }}
                  strokeDasharray={progressRingCircumference}
                />
              </svg>
              <motion.div
                className="z-10"
                animate={{ y: isBadgeHovered && !isReducedMotion ? [0, -5, 0] : 0 }} 
                transition={{ duration: 0.3, ease: "easeInOut", repeat: isBadgeHovered ? Infinity : 0, repeatDelay: 0.2, delay:0.05}}
              >
                <Icon size={iconSize} className="text-primary group-hover:text-[hsl(var(--gradient-end))] transition-colors duration-200" />
              </motion.div>
            </motion.div>
          </TooltipTrigger>
          <TooltipContent 
            side="top" 
            className="custom-tooltip-content tooltip-arrow-top w-52 bg-popover/80 backdrop-blur-md text-popover-foreground p-3 rounded-lg shadow-xl border border-border/30"
            sideOffset={12}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            // @ts-ignore TODO: fix type framer-motion with asChild of shadcn
            transition={{ duration: 0.15, delay:0.2 }} 
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
  
  const centerOffset = { x: 0, y: 0 }; 

  const currentIconSize = isDesktop ? ICON_SIZE_DESKTOP : ICON_SIZE_MOBILE;
  const badgeBoxWidth = (currentIconSize + 12) * 2 + 16; // Outer div width from SkillBadge
  const desiredBadgeSpacing = isDesktop ? 20 : 15; // More space on desktop
  const badgeVisualRadius = currentIconSize + 4; // Radius of the circular progress part

  const circumferenceNeeded = skills.length * (badgeBoxWidth / 2 + desiredBadgeSpacing); // Use half box width for tighter packing if needed, or full
  
  let calculatedBadgeOrbitRadius = circumferenceNeeded / (2 * Math.PI);
  calculatedBadgeOrbitRadius = Math.max(calculatedBadgeOrbitRadius, 150); // Min radius to avoid extreme crowding

  const minAestheticOrbitRadius = Math.min(galaxyDimensions.width / 2.2, galaxyDimensions.height / 2.2, isDesktop ? 250 : 200); 
  const finalBadgeOrbitRadius = Math.max(calculatedBadgeOrbitRadius, minAestheticOrbitRadius);

  const marginBetweenRadarAndBadgeVisuals = Math.min(galaxyDimensions.width * 0.08, 30); // Increased margin
  const maxRadarOuterRadius = Math.max(0, finalBadgeOrbitRadius - badgeVisualRadius - marginBetweenRadarAndBadgeVisuals);
  
  let targetRadarSize = Math.max(galaxyDimensions.width * 0.25, 150); // Radar aims for 25% of galaxy, min 150px
  let finalRadarContainerSize = Math.min(targetRadarSize, maxRadarOuterRadius * 2); // Ensure radar fits inside badges
  finalRadarContainerSize = Math.max(finalRadarContainerSize, 120); // Min practical radar size

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
    const angle = payload.angle; // Angle in degrees from Recharts
    const labelRadiusOffset = 10; // How far out the label is from axis end

    // Calculate position with offset
    const radianAngle = (angle * Math.PI) / 180;
    const labelX = x + labelRadiusOffset * Math.cos(radianAngle);
    const labelY = y + labelRadiusOffset * Math.sin(radianAngle);


    if (angle > 10 && angle < 170) { // Bottom half
        // textAnchor = y > (finalRadarContainerSize / 2) ? "middle" : "middle"; // Could adjust based on y too
    } else if (angle > 190 && angle < 350) { // Top half
        // textAnchor = y < (finalRadarContainerSize / 2) ? "middle" : "middle";
    } else if (angle <= 10 || angle >= 350) { // Right side
        textAnchor = "start";
    } else { // Left side
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
          <RadarChart cx="50%" cy="50%" outerRadius="65%" data={radarChartData}> 
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
          orbitRadius={finalBadgeOrbitRadius}
          centerOffset={centerOffset} 
          iconSize={currentIconSize}
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
    setIsReducedMotionActive(framerReducedMotion === true); 

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

