
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { ChevronDown, ChevronRight, BarChart3, CircleDotDashed, Briefcase, type LucideProps, Cpu, Server, Container, Gauge, Wrench, Palette } from 'lucide-react';
import { Section } from '@/components/Section';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from '@/lib/utils';
import { skillsData, skillCategories, centralNode, type Skill, type SkillCategory } from '@/config/skills';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import { useTheme } from '@/contexts/ThemeContext';


const ICON_SIZE = 28; // For radial layout
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
  const { theme } = useTheme(); // For chart colors

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // Animate proficiency ring based on scroll
  const proficiencyPathLength = useTransform(scrollYProgress, [0.3, 0.7], [0, skill.proficiency / 100]);

  const angle = (index / totalSkills) * 2 * Math.PI - Math.PI / 2; // Start from top
  const x = radius * Math.cos(angle);
  const y = radius * Math.sin(angle);

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.5, x: 0, y: 0 },
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
        // Only start animation when scrolling down into view
        if (entry.isIntersecting && entry.boundingClientRect.top > 0) {
          controls.start("visible");
        }
      }, // Corrected comma placement
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
            className="absolute group"
            variants={itemVariants}
            initial={isReducedMotion ? { opacity:1, scale:1, x:x, y:y } : "hidden"}
            animate={controls}
            whileHover={!isReducedMotion ? { 
              scale: 1.2, 
              zIndex: 10, 
              transition: { type: 'spring', stiffness: 300 },
              rotate: 5, // Soft rotation on hover
              boxShadow: '0 0 12px hsla(var(--gradient-middle), 0.4)' // Neon glow
            } : {}}
            >
            <div className="relative flex flex-col items-center">
              <svg 
                width={(RING_RADIUS + RING_STROKE_WIDTH) * 2}
                height={(RING_RADIUS + RING_STROKE_WIDTH) * 2}
                viewBox={`0 0 ${(RING_RADIUS + RING_STROKE_WIDTH) * 2} ${(RING_RADIUS + RING_STROKE_WIDTH) * 2}`}
                className="mb-1 rotate-[-90deg]" // Rotate to start at the top
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
                  stroke="hsl(var(--primary))" // Uses primary green for progress
                  strokeWidth={RING_STROKE_WIDTH}
                  strokeDasharray={2 * Math.PI * RING_RADIUS}
                  strokeDashoffset={0} // Animate strokeDashoffset if pathLength doesn't work as expected
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

const MemoizedBarChart = React.memo(BarChart);
const MemoizedRadarChart = React.memo(RadarChart);


export function SkillsSection() {
  const [isMobile, setIsMobile] = useState(false);
  const [activeChartTab, setActiveChartTab] = useState<'bar' | 'radar'>('bar');
  const [isClient, setIsClient] = useState(false);
  const framerReducedMotion = useReducedMotion();
  const [isReducedMotionActive, setIsReducedMotionActive] = useState(true); 

  const { theme } = useTheme();

  useEffect(() => {
    setIsClient(true);
    setIsReducedMotionActive(framerReducedMotion ?? false);
    const checkMobile = () => setIsMobile(window.innerWidth < 768); // md breakpoint
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [framerReducedMotion]);

  const chartData = skillsData.map(skill => ({
    name: skill.name,
    Proficiency: skill.proficiency,
    category: skill.category,
  }));

  const radarChartData = skillCategories.map(category => {
    const categorySkills = skillsData.filter(s => s.category === category.name);
    const avgProficiency = categorySkills.length > 0 
      ? Math.round(categorySkills.reduce((acc, s) => acc + s.proficiency, 0) / categorySkills.length)
      : 0;
    return {
      subject: category.name,
      A: avgProficiency, // Proficiency value
      fullMark: 100,
    };
  });


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
  
  const centralNodeVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 150, delay: isReducedMotionActive ? 0 : 0.2 } },
  }
  
  const [galaxyRadius, setGalaxyRadius] = useState(200);
  const galaxyContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isClient) return;
    const updateRadius = () => {
      if (galaxyContainerRef.current) {
        const containerWidth = galaxyContainerRef.current.offsetWidth;
        setGalaxyRadius(Math.max(120, Math.min(containerWidth * 0.35, 280))); 
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
      <Section id="skills" title="My Tech Toolbox" className="py-16 md:py-24">
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
        className="text-3xl md:text-4xl font-bold mb-16 md:mb-24 text-center gradient-text"
      >
        My Tech Toolbox
      </motion.h2>

      <motion.div 
        className="grid md:grid-cols-2 gap-16 items-start"
        variants={sectionVariants}
        initial={isReducedMotionActive ? "visible" : "hidden"}
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.div 
          ref={galaxyContainerRef}
          className="md:col-span-1 relative flex items-center justify-center min-h-[400px] md:min-h-[550px] lg:min-h-[600px] p-4"
        >
          <motion.div
            variants={centralNodeVariants}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center p-4 bg-background/50 rounded-full shadow-2xl border-2 border-primary"
           >
            <centralNode.icon size={ICON_SIZE * 1.5} className="text-primary mb-2" />
            <p className="text-sm font-semibold text-center text-foreground">{centralNode.name}</p>
          </motion.div>
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

        <motion.div 
          className="md:col-span-1"
          variants={{ hidden: { opacity:0, x: 50}, visible: {opacity:1, x:0, transition: {delay: isReducedMotionActive ? 0: 0.3, duration: 0.5}}}}
        >
          <Card className="bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="gradient-text flex items-center gap-2">
                <BarChart3 size={24} /> Skill Proficiency Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Visual representation of my key skill areas.
                Detailed proficiency levels reflect self-assessment and project experience.
              </p>
              <Sheet>
                <SheetTrigger asChild >
                  <Button variant="outline" className="w-full gradient-button-outline">
                    <span>View Detailed Charts</span>
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl overflow-y-auto scrollbar-thin p-6 bg-background/95 backdrop-blur-md">
                  <SheetHeader>
                    <SheetTitle className="gradient-text text-2xl ">Detailed Skill Analysis</SheetTitle>
                    <SheetDescription className="text-muted-foreground">
                      Explore proficiency across different categories and individual skills.
                    </SheetDescription>
                  </SheetHeader>
                  <div className="my-6">
                    <div className="flex space-x-2 border-b border-border mb-4">
                      <Button 
                        variant={activeChartTab === 'bar' ? "default" : "ghost"}
                        onClick={() => setActiveChartTab('bar')}
                        className={cn(activeChartTab === 'bar' && "gradient-button text-primary-foreground")}
                      >
                        Bar Chart
                      </Button>
                      <Button
                        variant={activeChartTab === 'radar' ? "default" : "ghost"}
                        onClick={() => setActiveChartTab('radar')}
                        className={cn(activeChartTab === 'radar' && "gradient-button text-primary-foreground")}
                      >
                        Radar Chart
                      </Button>
                    </div>

                    {activeChartTab === 'bar' && (
                      <div style={{ width: '100%', height: 400 }}>
                        <h3 className="text-lg font-semibold text-foreground mb-2">Skill Proficiency (Bar)</h3>
                         <ResponsiveContainer width="100%" height="100%">
                           <MemoizedBarChart data={chartData} margin={{ top: 5, right: 20, left: -20, bottom: 50 }}>
                              <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? "hsl(var(--border))" : "hsl(var(--muted))"} />
                              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} interval={0} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} />
                              <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                              <RechartsTooltip 
                                  contentStyle={{ backgroundColor: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)'}} 
                                  labelStyle={{ color: 'hsl(var(--popover-foreground))', fontWeight: 'bold' }}
                                  itemStyle={{ color: 'hsl(var(--popover-foreground))' }} 
                              /> 
                              <Legend wrapperStyle={{ color: 'hsl(var(--muted-foreground))', paddingTop: '10px' }}/>
                              <Bar dataKey="Proficiency" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                           </MemoizedBarChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                    {activeChartTab === 'radar' && (
                      <div style={{ width: '100%', height: 400 }}>
                        <h3 className="text-lg font-semibold text-foreground mb-2">Category Proficiency (Radar)</h3>
                        <ResponsiveContainer width="100%" height="100%">
                          <MemoizedRadarChart cx="50%" cy="50%" outerRadius="80%" data={radarChartData}>
                            <PolarGrid stroke={theme === 'dark' ? "hsl(var(--border))" : "hsl(var(--muted))"}/>
                            <PolarAngleAxis dataKey="subject" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}/>
                            <Radar name="Average Proficiency" dataKey="A" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.6} />
                            <RechartsTooltip 
                                  contentStyle={{ backgroundColor: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)'}} 
                                  labelStyle={{ color: 'hsl(var(--popover-foreground))', fontWeight: 'bold' }}
                                  itemStyle={{ color: 'hsl(var(--popover-foreground))' }}
                              />
                            <Legend wrapperStyle={{ color: 'hsl(var(--muted-foreground))', paddingTop: '10px' }}/>
                          </MemoizedRadarChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </Section>
  );
}

    