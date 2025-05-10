"use client";

import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import type { ReactNode } from 'react';
import { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export interface Milestone {
  id: string;
  year: string;
  title: string;
  description: string;
  icon?: ReactNode;
}

interface JourneyTimelineProps {
  milestones: Milestone[];
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      type: 'spring',
      stiffness: 100,
      damping: 12,
    },
  }),
};

export function JourneyTimeline({ milestones }: JourneyTimelineProps) {
  const timelineRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  const { scrollXProgress } = useScroll({ container: timelineRef });

  // Animate SVG line drawing based on horizontal scroll
  const linePathLength = useTransform(scrollXProgress, [0, 1], reducedMotion ? [1,1] : [0, 1]);


  return (
    <div className="relative w-full">
      <h3 className="text-2xl font-semibold text-foreground mb-6 gradient-text">My Professional Path</h3>
      <div
        ref={timelineRef}
        className="flex overflow-x-auto space-x-6 pb-6 scrollbar-thin scrollbar-thumb-primary scrollbar-track-primary/20"
        style={{ cursor: 'grab' }}
        while-drag={{ cursor: 'grabbing' }}
      >
        {/* SVG for connecting lines - adjust dimensions based on content */}
        <svg className="absolute top-1/2 left-0 w-full h-1 pointer-events-none -translate-y-1/2 z-0" style={{ overflow: 'visible' }}>
          <motion.line
            x1="0"
            y1="0.5" // Center the line
            x2="100%" // Extend full width of the scrollable area
            y2="0.5"
            stroke="hsl(var(--primary))"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: reducedMotion ? 1: undefined }} // full line if reduced motion
            style={!reducedMotion ? { pathLength: linePathLength } : {}}
            transition={{ duration: 1 }}
          />
        </svg>

        {milestones.map((milestone, index) => (
          <motion.div
            key={milestone.id}
            custom={index}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5, root: timelineRef }} // Observe within the scroll container
            className="relative z-10 flex-shrink-0 w-72 md:w-80"
          >
            <Card className="h-full bg-card/70 backdrop-blur-md border-border/30 shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-primary">{milestone.year}</span>
                  {milestone.icon && <div className="text-primary/80">{milestone.icon}</div>}
                </div>
                <CardTitle className="text-xl text-foreground">{milestone.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{milestone.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      {!reducedMotion && (
         <p className="text-xs text-muted-foreground text-center mt-2">Drag or scroll horizontally to explore the timeline.</p>
      )}
    </div>
  );
}
