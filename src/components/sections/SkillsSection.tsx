
"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, useAnimation, useReducedMotion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ChevronDown, type LucideProps, Cpu, Settings, BarChart2, PieChart } from 'lucide-react';
import { Section } from '@/components/Section';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from '@/lib/utils';
import { skillsData, skillCategories, centralNode as originalCentralNode, type Skill, type SkillCategory } from '@/config/skills';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip as RechartsTooltip,
  Legend,
} from 'recharts';
import { useTheme } from '@/contexts/ThemeContext';


const ICON_SIZE = 28;
const RING_RADIUS = 20;
const RING_STROKE_WIDTH = 3;

interface SkillBadgeProps {
  skill: Skill;
  index: number;
  totalSkills: number;
  radius: number;
  isReducedMotion: boolean;
}

const SkillBadge: React.FC<SkillBadgeProps> = ({ skill, index, totalSkills, radius, isReducedMotion }) => {
  const controls = useAnimation();
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const proficiencyPathLength = useTransform(scrollYProgress, [0.3, 0.7], [0, skill.proficiency / 100]);

  const angle = (index / totalSkills) * 2 * Math.PI - Math.PI / 2;
  const x = radius * Math.cos(angle);
  const y = radius * Math.sin(angle);

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.5, x: 0, y: 0 }, // x and y are transforms
    visible: {
      opacity: 1,
      scale: 1,
      x: x,
      y: y,
      transition: { type: 'spring', stiffness: 100, damping: 15, delay: index * 0.05 }
    }
  };

  useEffect(() => {
    const currentRef = ref.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.boundingClientRect.top > 0) {
          controls.start("visible");
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
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            ref={ref}
            className="absolute group left-1/2 top-1/2" // Added left-1/2 top-1/2 to center the origin for translation
            variants={itemVariants}
            initial={isReducedMotion ? { opacity:1, scale:1, x:x, y:y } : "hidden"}
            animate={controls}
            whileHover={!isReducedMotion ? {
              scale: 1.2,
              zIndex: 10,
              transition: { type: 'spring', stiffness: 300 },
              rotate: 5,
              boxShadow: '0 0 12px hsla(var(--gradient-middle), 0.4)'
            } : {}}
            >
            <div className="relative flex flex-col items-center">
              <svg
                width={(RING_RADIUS + RING_STROKE_WIDTH) * 2}
                height={(RING_RADIUS + RING_STROKE_WIDTH) * 2}
                viewBox={`0 0 ${(RING_RADIUS + RING_STROKE_WIDTH) * 2} ${(RING_RADIUS + RING_STROKE_WIDTH) * 2}`}
                className="mb-1 rotate-[-90deg]"
              >
                <circle
                  cx={RING_RADIUS + RING_STROKE_WIDTH}
                  cy={RING_RADIUS + RING_STROKE_WIDTH}
                  r={RING_RADIUS}
                  fill="transparent"
                  stroke="hsl(var(--muted))"
                  strokeWidth={RING_STROKE_WIDTH}
                />
                <motion.circle
                  cx={RING_RADIUS + RING_STROKE_WIDTH}
                  cy={RING_RADIUS + RING_STROKE_WIDTH}
                  r={RING_RADIUS}
                  fill="transparent"
                  stroke="hsl(var(--primary))"
                  strokeWidth={RING_STROKE_WIDTH}
                  strokeDasharray={2 * Math.PI * RING_RADIUS}
                  strokeDashoffset={0}
                  style={{ pathLength: isReducedMotion ? skill.proficiency / 100 : proficiencyPathLength }}
                  transition={isReducedMotion ? {duration: 0} : { duration: 0.5, ease: "easeOut" }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                 <skill.icon size={ICON_SIZE} className="text-foreground group-hover:text-[hsl(var(--gradient-middle))] transition-colors" />
              </div>
            </div>
            <p className="text-xs text-center text-muted-foreground group-hover:text-[hsl(var(--gradient-middle))] transition-colors mt-1 whitespace-nowrap">
              {skill.name}
            </p>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent side="top" className="bg-popover text-popover-foreground p-2 rounded-md shadow-lg border border-border">
          <p className="font-semibold">{skill.name}</p>
          <p>Proficiency: {skill.proficiency}%</p>
          <p>Experience: {skill.experience}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const MemoizedRadarChart = React.memo(RadarChart);


export function SkillsSection() {
  const [isMobile, setIsMobile] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const framerReducedMotion = useReducedMotion();
  const [isReducedMotionActive, setIsReducedMotionActive] = useState(true);

  const { theme } = useTheme();

  useEffect(() => {
    setIsClient(true);
    setIsReducedMotionActive(framerReducedMotion ?? false);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [framerReducedMotion]);

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


  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: isReducedMotionActive ? 0 : 0.1 }
    },
  };

  const headingVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };


  const [galaxyRadius, setGalaxyRadius] = useState(200);
  const galaxyContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isClient) return;
    const updateRadius = () => {
      if (galaxyContainerRef.current) {
        const containerWidth = galaxyContainerRef.current.offsetWidth;
        // Adjust radius based on container width, ensuring badges orbit around the central radar chart.
        const radarChartDiameterEstimate = Math.min(containerWidth * 0.6, 420); // Estimate radar chart size
        setGalaxyRadius(Math.max(radarChartDiameterEstimate / 2 + 80, containerWidth * 0.35, 250)); // Increased spacing slightly
      }
    };
    updateRadius();
    window.addEventListener('resize', updateRadius);
    return () => window.removeEventListener('resize', updateRadius);
  }, [isClient]);


  if (!isClient) {
    return (
      <Section id="skills" title="My Tech Toolbox" className="py-16 md:py-24 min-h-[500px]">
        <div className="text-center text-muted-foreground">Loading skills...</div>
      </Section>
    );
  }

  if (isMobile) {
    return (
      <Section id="skills" title="My Tech Toolbox" className="py-16">
        <Accordion type="single" collapsible className="w-full">
          {skillCategories.map((category) => (
            <AccordionItem value={category.name} key={category.name}>
              <AccordionTrigger className="hover:no-underline text-left">
                <div className="flex items-center gap-3">
                  <category.icon size={20} className="text-primary" />
                  <span className="text-lg font-medium text-foreground">{category.name}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-muted-foreground mb-4 px-1">{category.description}</p>
                <div className="grid grid-cols-2 xs:grid-cols-3 gap-4 p-1">
                  {skillsData
                    .filter((skill) => skill.category === category.name)
                    .map((skill) => (
                      <Card key={skill.id} className="p-3 bg-card/50 hover:bg-card/80 transition-colors">
                        <div className="flex items-center gap-2 mb-1">
                          <skill.icon size={20} className="text-primary" />
                          <p className="font-semibold text-sm text-foreground">{skill.name}</p>
                        </div>
                        <p className="text-xs text-muted-foreground">{skill.experience}</p>
                         <div className="w-full bg-muted rounded-full h-1.5 mt-2">
                           <motion.div
                            className="bg-primary h-1.5 rounded-full"
                            initial={{width: isReducedMotionActive ? `${skill.proficiency}%` : "0%"}}
                            whileInView={{width: `${skill.proficiency}%`}}
                            viewport={{once: true, amount: 0.8}}
                            transition={{duration: isReducedMotionActive ? 0: 0.5, ease: 'easeOut'}}
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

  return (
    <Section id="skills" className="py-24 md:py-40 overflow-hidden">
       <motion.h2
        id="skills-heading"
        variants={headingVariants}
        initial={isReducedMotionActive ? "visible" : "hidden"}
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        className="text-3xl md:text-4xl font-bold mb-12 md:mb-20 text-center gradient-text"
      >
        My Tech Toolbox
      </motion.h2>

      <motion.div
        ref={galaxyContainerRef}
        className="relative flex items-center justify-center min-h-[450px] sm:min-h-[550px] md:min-h-[650px] lg:min-h-[700px] p-4"
        variants={sectionVariants}
        initial={isReducedMotionActive ? "visible" : "hidden"}
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {/* Central Radar Chart */}
        <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] md:w-[380px] md:h-[380px] lg:w-[420px] lg:h-[420px]"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1, transition: { delay: isReducedMotionActive ? 0 : 0.3, duration: 0.7, ease: "circOut" } }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <MemoizedRadarChart cx="50%" cy="50%" outerRadius="75%" data={radarChartData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
              <defs>
                <radialGradient id="radarGradient" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="hsl(var(--gradient-start))" stopOpacity={0.7} />
                  <stop offset="60%" stopColor="hsl(var(--gradient-middle))" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="hsl(var(--gradient-end))" stopOpacity={0.3} />
                </radialGradient>
              </defs>
              <PolarGrid stroke={theme === 'dark' ? "hsla(var(--border), 0.3)" : "hsla(var(--muted), 0.5)"} />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11, fontWeight: 500 }}
                className="select-none"
              />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
              <Radar
                name="Avg. Proficiency"
                dataKey="A"
                stroke="hsl(var(--primary))"
                fill="url(#radarGradient)"
                strokeWidth={2}
                dot={{ r: 3, fill: 'hsl(var(--primary))', strokeWidth: 0 }}
                activeDot={{ r: 5, stroke: 'hsl(var(--background))', strokeWidth: 2 }}
              />
              <RechartsTooltip
                contentStyle={{
                    backgroundColor: 'hsla(var(--popover-rgb), 0.8)', 
                    backdropFilter: 'blur(4px)',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: 'var(--radius)',
                    boxShadow: '0 4px 12px hsla(var(--primary-rgb, var(--primary)), 0.1)'
                }}
                labelStyle={{ color: 'hsl(var(--popover-foreground))', fontWeight: 'bold', marginBottom: '4px' }}
                itemStyle={{ color: 'hsl(var(--popover-foreground))' }}
              />
              <Legend
                wrapperStyle={{
                    color: 'hsl(var(--muted-foreground))',
                    paddingTop: '10px', // Adjusted padding to avoid overlap
                    fontSize: '12px',
                    display: 'flex',
                    justifyContent: 'center',
                    width: '100%', // Ensure legend takes full width for centering
                }}
                align="center" // Center legend items
                iconSize={10}
                />
            </MemoizedRadarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Orbiting Skill Badges */}
        {skillsData.map((skill, index) => (
          <SkillBadge
            key={skill.id}
            skill={skill}
            index={index}
            totalSkills={skillsData.length}
            radius={galaxyRadius}
            isReducedMotion={isReducedMotionActive}
          />
        ))}
      </motion.div>
    </Section>
  );
}

    