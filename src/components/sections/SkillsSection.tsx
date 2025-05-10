
"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, useAnimation, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import type { LucideProps } from 'lucide-react';
import { Section } from '@/components/Section';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from '@/lib/utils';
import { skillsData, skillCategories, type Skill } from '@/config/skills';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  Tooltip as RechartsTooltip,
  BarChart as RechartsBarChart, // Renamed to avoid conflict
  XAxis,
  YAxis,
  Bar,
  CartesianGrid,
} from 'recharts';
import { useTheme } from '@/contexts/ThemeContext';

const ICON_SIZE = 28;
const RING_RADIUS = 22;
const RING_STROKE_WIDTH = 2.5;

interface SkillBadgeProps {
  skill: Skill;
  index: number;
  totalSkills: number;
  radius: number;
  isReducedMotion: boolean;
  centerOffset: { x: number; y: number };
}

const SkillBadge: React.FC<SkillBadgeProps> = ({ skill, index, totalSkills, radius, isReducedMotion, centerOffset }) => {
  const controls = useAnimation();
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // Proficiency ring animation
  const pathLengthScrollRange = isReducedMotion ? [0,0] as [number,number] : [0.2, 0.8];
  const animatedPathLength = useTransform(scrollYProgress, pathLengthScrollRange, [0, skill.proficiency / 100]);

  // Calculate positions
  const angle = (index / totalSkills) * 2 * Math.PI - Math.PI / 2; // Start from top

  const finalX = radius * Math.cos(angle) + centerOffset.x;
  const finalY = radius * Math.sin(angle) + centerOffset.y;

  const initialOrbitRadiusFactor = 1.8; // How much further out they start for the animation
  const actualInitialX = isReducedMotion ? finalX : (radius * initialOrbitRadiusFactor) * Math.cos(angle) + centerOffset.x;
  const actualInitialY = isReducedMotion ? finalY : (radius * initialOrbitRadiusFactor) * Math.sin(angle) + centerOffset.y;

  const itemVariants = {
    hidden: {
      opacity: 0,
      scale: 0.3,
      x: actualInitialX, // Use defined values
      y: actualInitialY, // Use defined values
      rotate: isReducedMotion ? 0 : (Math.random() - 0.5) * 45 // Slight random initial rotation
    },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      x: finalX, // Animate to finalX
      y: finalY, // Animate to finalY
      transition: {
        type: 'spring',
        stiffness: isReducedMotion ? 300 : 80,
        damping: isReducedMotion ? 30 : 15,
        delay: isReducedMotion ? 0 : index * 0.08 + 0.3
      }
    }
  };

  useEffect(() => {
    const currentRef = ref.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          controls.start("visible");
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (currentRef) observer.observe(currentRef);
    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [controls]);


  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            ref={ref}
            className="absolute group left-0 top-0"
            variants={itemVariants}
            initial="hidden"
            animate={controls}
            whileHover={!isReducedMotion ? {
              scale: 1.25,
              zIndex: 50,
              rotate: (Math.random() - 0.5) * 10,
              boxShadow: '0 0 20px hsla(var(--gradient-middle), 0.5)',
              transition: { type: 'spring', stiffness: 350, damping: 15, duration: 0.3 },
            } : {}}
            style={{ width: (RING_RADIUS + RING_STROKE_WIDTH) * 2 + 20, height: (RING_RADIUS + RING_STROKE_WIDTH) * 2 + 40 }}
            >
            <div className="relative flex flex-col items-center">
              <svg
                width={(RING_RADIUS + RING_STROKE_WIDTH) * 2}
                height={(RING_RADIUS + RING_STROKE_WIDTH) * 2}
                viewBox={`0 0 ${(RING_RADIUS + RING_STROKE_WIDTH) * 2} ${(RING_RADIUS + RING_STROKE_WIDTH) * 2}`}
                className="mb-1.5 rotate-[-90deg]"
              >
                <circle
                  cx={RING_RADIUS + RING_STROKE_WIDTH}
                  cy={RING_RADIUS + RING_STROKE_WIDTH}
                  r={RING_RADIUS}
                  fill="transparent"
                  stroke="hsl(var(--muted))"
                  strokeOpacity={0.3}
                  strokeWidth={RING_STROKE_WIDTH}
                />
                <motion.circle
                  cx={RING_RADIUS + RING_STROKE_WIDTH}
                  cy={RING_RADIUS + RING_STROKE_WIDTH}
                  r={RING_RADIUS}
                  fill="transparent"
                  stroke="url(#skillRingGradient)"
                  strokeWidth={RING_STROKE_WIDTH}
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * RING_RADIUS}
                  strokeDashoffset={0}
                  style={{ pathLength: animatedPathLength }}
                  transition={{ duration: 0 }}
                />
                <defs>
                    <linearGradient id="skillRingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="hsl(var(--gradient-start))" />
                        <stop offset="50%" stopColor="hsl(var(--gradient-middle))" />
                        <stop offset="100%" stopColor="hsl(var(--gradient-end))" />
                    </linearGradient>
                </defs>
              </svg>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                 <skill.icon size={ICON_SIZE*0.9} className="text-foreground group-hover:text-[hsl(var(--gradient-middle))] transition-colors duration-200" />
              </div>
            </div>
            <p className="text-[11px] text-center text-muted-foreground group-hover:text-[hsl(var(--gradient-middle))] transition-colors duration-200 mt-0.5 whitespace-nowrap">
              {skill.name}
            </p>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent side="top" className="bg-popover text-popover-foreground p-2 rounded-md shadow-lg border border-border text-xs pointer-events-none">
          <p className="font-bold gradient-text">{skill.name}</p>
          <p>Proficiency: <span className="font-semibold">{skill.proficiency}%</span></p>
          <p>Experience: <span className="font-semibold">{skill.experience}</span></p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const MemoizedRadarChart = React.memo(RadarChart);
const MemoizedBarChart = React.memo(RechartsBarChart);


export function SkillsSection() {
  const [isMobile, setIsMobile] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const framerReducedMotion = useReducedMotion();
  const [isReducedMotionActive, setIsReducedMotionActive] = useState(true); // Default true for server

  const { theme } = useTheme();
  const [chartKey, setChartKey] = useState(0);

  useEffect(() => {
    setIsClient(true);
    setIsReducedMotionActive(framerReducedMotion ?? false); // Set based on hook once client-side
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [framerReducedMotion]);

  useEffect(() => {
    setChartKey(prevKey => prevKey + 1);
  }, [theme]);

  const radarChartData = useMemo(() => skillCategories.map(category => {
    const categorySkills = skillsData.filter(s => s.category === category.name);
    const avgProficiency = categorySkills.length > 0
      ? Math.round(categorySkills.reduce((acc, s) => acc + s.proficiency, 0) / categorySkills.length)
      : 0;
    return {
      subject: category.name,
      A: avgProficiency,
      fullMark: 100,
    };
  }), []);

  const barChartData = useMemo(() => {
    return skillsData
      .sort((a, b) => b.proficiency - a.proficiency)
      .slice(0, 5) // Top 5 skills
      .map(skill => ({ name: skill.name, proficiency: skill.proficiency }));
  }, []);


  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: isReducedMotionActive ? 0 : 0.15, delayChildren: 0.2 }
    },
  };

  const headingVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'circOut' } },
  };

  const [galaxyRadius, setGalaxyRadius] = useState(250);
  const [centerOffset, setCenterOffset] = useState({ x: 0, y: 0 });
  const galaxyContainerRef = useRef<HTMLDivElement>(null);
  const radarChartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isClient || !galaxyContainerRef.current || !radarChartContainerRef.current) return;

    const updateLayout = () => {
      if (galaxyContainerRef.current && radarChartContainerRef.current) {
        const containerWidth = galaxyContainerRef.current.offsetWidth;
        const containerHeight = galaxyContainerRef.current.offsetHeight;
        
        const newRadius = Math.min(containerWidth, containerHeight) / 2 - Math.max(ICON_SIZE, RING_RADIUS * 2) / 2 - 20; // 20 for padding
        setGalaxyRadius(Math.max(180, newRadius));

        setCenterOffset({ x: containerWidth / 2, y: containerHeight / 2 });
      }
    };
    
    updateLayout();
    window.addEventListener('resize', updateLayout);
    
    const resizeObserver = new ResizeObserver(updateLayout);
    if (galaxyContainerRef.current) resizeObserver.observe(galaxyContainerRef.current);
    if (radarChartContainerRef.current) resizeObserver.observe(radarChartContainerRef.current);

    return () => {
      window.removeEventListener('resize', updateLayout);
      if (galaxyContainerRef.current) resizeObserver.unobserve(galaxyContainerRef.current);
      if (radarChartContainerRef.current) resizeObserver.unobserve(radarChartContainerRef.current);
    };
  }, [isClient]);


  if (!isClient) {
    return (
      <Section id="skills" title="My Tech Toolbox" className="py-16 md:py-24 min-h-[500px]">
        <div className="text-center text-muted-foreground">Loading skills...</div>
      </Section>
    );
  }

  // Mobile View: Accordion
  if (isMobile) {
    return (
      <Section id="skills" title="My Tech Toolbox" className="py-16 md:py-20">
        <Accordion type="single" collapsible className="w-full max-w-xl mx-auto">
          {skillCategories.map((category) => (
            <AccordionItem value={category.name} key={category.name} className="border-border/50">
              <AccordionTrigger className="hover:no-underline py-4 text-left group">
                <div className="flex items-center gap-3">
                  <category.icon size={22} className="text-primary transition-transform group-data-[state=open]:rotate-12" />
                  <span className="text-lg font-semibold text-foreground group-hover:gradient-text transition-all">
                    {category.name}
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="bg-card/20 rounded-b-md p-1">
                <p className="text-sm text-muted-foreground mb-4 px-3 pt-2">{category.description}</p>
                <div className="grid grid-cols-2 xs:grid-cols-3 gap-3 p-3">
                  {skillsData
                    .filter((skill) => skill.category === category.name)
                    .map((skill) => (
                      <Card key={skill.id} className="p-3 bg-card/50 hover:bg-card/80 transition-colors duration-200 shadow-sm hover:shadow-md">
                        <div className="flex items-center gap-2 mb-1.5">
                          <skill.icon size={18} className="text-primary" />
                          <p className="font-medium text-sm text-foreground">{skill.name}</p>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{skill.experience}</p>
                         <div className="w-full bg-muted/50 rounded-full h-2 overflow-hidden">
                           <motion.div
                            className="bg-gradient-to-r from-[hsl(var(--gradient-start))] to-[hsl(var(--gradient-middle))] h-2 rounded-full"
                            initial={{width: isReducedMotionActive ? `${skill.proficiency}%` : "0%"}}
                            whileInView={{width: `${skill.proficiency}%`}}
                            viewport={{once: true, amount: 0.8}}
                            transition={{duration: isReducedMotionActive ? 0: 0.6, ease: 'easeOut', delay:0.2}}
                            />
                        </div>
                      </Card>
                    ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Section>
    );
  }

  // Desktop View: Radial Galaxy with central Radar Chart
  return (
    <Section id="skills" className="py-24 md:py-32 lg:py-40 overflow-hidden">
       <motion.h2
        id="skills-heading"
        variants={headingVariants}
        initial={isReducedMotionActive ? "visible" : "hidden"}
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        className="text-4xl md:text-5xl font-bold mb-20 md:mb-28 text-center gradient-text"
      >
        My Tech Toolbox
      </motion.h2>

      <motion.div
        ref={galaxyContainerRef}
        className="relative w-full max-w-4xl mx-auto" // Increased max-width for more space
        style={{ height: 'calc(min(80vw, 700px))' }} // Ensure height for galaxy
        variants={sectionVariants}
        initial={isReducedMotionActive ? "visible" : "hidden"}
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        {/* Central Radar Chart - positioned absolutely in the center of galaxyContainerRef */}
        <motion.div
            ref={radarChartContainerRef}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 
                       w-[60%] h-[60%] sm:w-[55%] sm:h-[55%] md:w-[50%] md:h-[50%] lg:w-[45%] lg:h-[45%]"
            style={{ maxWidth: '450px', maxHeight: '450px' }} // Cap radar chart size
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{ opacity: 1, scale: 1, transition: { delay: isReducedMotionActive ? 0 : skillsData.length * 0.07 + 0.5, duration: 0.8, ease: "circOut" } }}
        >
          <ResponsiveContainer key={chartKey} width="100%" height="100%">
            <MemoizedRadarChart cx="50%" cy="50%" outerRadius="75%" data={radarChartData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
              <defs>
                <radialGradient id="radarGradientCore" cx="50%" cy="50%" r="60%">
                  <stop offset="0%" stopColor={theme === 'dark' ? "hsla(var(--gradient-start), 0.5)" : "hsla(var(--gradient-start), 0.7)"} />
                  <stop offset="70%" stopColor={theme === 'dark' ? "hsla(var(--gradient-middle), 0.3)" : "hsla(var(--gradient-middle), 0.5)"} />
                  <stop offset="100%" stopColor={theme === 'dark' ? "hsla(var(--gradient-end), 0.1)" : "hsla(var(--gradient-end), 0.3)"} />
                </radialGradient>
              </defs>
              <PolarGrid stroke={theme === 'dark' ? "hsla(var(--border), 0.2)" : "hsla(var(--muted), 0.4)"} />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 500 }}
                className="select-none"
              />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
              <Radar
                name="Avg. Proficiency"
                dataKey="A"
                stroke="hsl(var(--primary))"
                fill="url(#radarGradientCore)"
                fillOpacity={0.7}
                strokeWidth={2.5}
                dot={{ r: 3, fill: 'hsl(var(--primary))', strokeWidth: 0 }}
                activeDot={{ r: 5, stroke: 'hsl(var(--background))', strokeWidth: 1.5, fill: 'hsl(var(--primary))' }}
              />
              <RechartsTooltip
                contentStyle={{
                    backgroundColor: 'hsla(var(--popover-rgb), 0.85)',
                    backdropFilter: 'blur(5px)',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: 'var(--radius)',
                    boxShadow: 'var(--shadow-lg)'
                }}
                labelStyle={{ color: 'hsl(var(--popover-foreground))', fontWeight: 'bold', marginBottom: '4px', fontSize:'13px' }}
                itemStyle={{ color: 'hsl(var(--popover-foreground))', fontSize:'12px' }}
                cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1, strokeDasharray: '3 3' }}
              />
              <Legend
                wrapperStyle={{
                    color: 'hsl(var(--muted-foreground))',
                    paddingTop: '15px',
                    fontSize: '11px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                }}
                align="center"
                iconSize={8}
                />
            </MemoizedRadarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Orbiting Skill Badges */}
        {isClient && skillsData.map((skill, index) => (
          <SkillBadge
            key={skill.id}
            skill={skill}
            index={index}
            totalSkills={skillsData.length}
            radius={galaxyRadius} // This radius is for the orbit around the center
            isReducedMotion={isReducedMotionActive}
            centerOffset={centerOffset}
          />
        ))}
      </motion.div>

    </Section>
  );
}

      