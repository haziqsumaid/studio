"use client";

import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Section } from '@/components/Section';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { skillsData, skillCategories, type Skill } from '@/config/skills';
import { cn } from '@/lib/utils';

const sectionVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 12 } },
};

const skillItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 120, damping: 10 } },
};

interface SkillItemProps {
  skill: Skill;
  isReducedMotion: boolean;
}

const SkillItem: React.FC<SkillItemProps> = ({ skill, isReducedMotion }) => {
  const [progressValue, setProgressValue] = useState(0);

  useEffect(() => {
    // Animate progress bar on mount if not reduced motion
    if (!isReducedMotion) {
      const timer = setTimeout(() => setProgressValue(skill.proficiency), 100);
      return () => clearTimeout(timer);
    } else {
      setProgressValue(skill.proficiency);
    }
  }, [skill.proficiency, isReducedMotion]);

  return (
    <motion.div
      variants={skillItemVariants}
      className="mb-6 p-3 rounded-md bg-card/30 hover:bg-card/50 transition-colors duration-200"
    >
      <TooltipProvider delayDuration={150}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center mb-2">
              <skill.icon size={22} className="text-primary mr-3 shrink-0" />
              <div className="flex-grow">
                <p className="font-semibold text-foreground text-sm leading-tight">{skill.name}</p>
                <p className="text-xs text-muted-foreground">{skill.experience}</p>
              </div>
            </div>
          </TooltipTrigger>
          {skill.description && (
            <TooltipContent side="top" className="max-w-xs bg-popover text-popover-foreground p-2 rounded-md shadow-lg border border-border text-xs">
              <p className="font-bold gradient-text">{skill.name}</p>
              <p>{skill.description}</p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
      <Progress
        value={progressValue}
        className="h-2 w-full bg-muted/50"
        indicatorClassName="bg-gradient-to-r from-[hsl(var(--gradient-start))] via-[hsl(var(--gradient-middle))] to-[hsl(var(--gradient-end))]"
        aria-label={`${skill.name} proficiency: ${skill.proficiency}%`}
      />
    </motion.div>
  );
};

export function SkillsSection() {
  const [isClient, setIsClient] = useState(false);
  const framerReducedMotion = useReducedMotion();
  const [isReducedMotionActive, setIsReducedMotionActive] = useState(true);

  useEffect(() => {
    setIsClient(true);
    setIsReducedMotionActive(framerReducedMotion ?? false);
  }, [framerReducedMotion]);

  if (!isClient) {
    return (
      <Section id="skills" title="My Tech Toolbox" className="py-16 md:py-24 min-h-[500px]">
        <div className="text-center text-muted-foreground">Loading skills...</div>
      </Section>
    );
  }

  return (
    <Section id="skills" title="My Tech Toolbox" className="py-20 md:py-28 lg:py-32">
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        variants={sectionVariants}
        initial={isReducedMotionActive ? "visible" : "hidden"}
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        {skillCategories.map((category) => (
          <motion.div key={category.name} variants={cardVariants}>
            <Card className="h-full bg-card/60 backdrop-blur-md border-border/30 shadow-xl hover:shadow-2xl transition-shadow duration-300 flex flex-col">
              <CardHeader className="pb-4">
                <div className="flex items-center mb-2">
                  <category.icon size={28} className="text-primary mr-3" />
                  <CardTitle className="text-xl gradient-text">{category.name}</CardTitle>
                </div>
                <CardDescription className="text-sm text-muted-foreground leading-relaxed">
                  {category.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2 flex-grow">
                <motion.div
                  variants={{
                    visible: { transition: { staggerChildren: isReducedMotionActive ? 0 : 0.07 } },
                    hidden: {},
                  }}
                  initial={isReducedMotionActive ? "visible" : "hidden"}
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                >
                  {skillsData
                    .filter((skill) => skill.category === category.name)
                    .map((skill) => (
                      <SkillItem key={skill.id} skill={skill} isReducedMotion={isReducedMotionActive} />
                    ))}
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
}