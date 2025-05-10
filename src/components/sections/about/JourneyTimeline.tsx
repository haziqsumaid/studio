"use client";

import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
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
  hidden: { 
    opacity: 0, 
    x: 50, // Slide from right
  }, 
  visible: {
    opacity: 1,
    x: 0,
    transition: { 
      type: 'spring', 
      stiffness: 80, 
      damping: 15 
    },
  },
};

const timelineContainerVariants = {
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
  hidden: {},
};


export function JourneyTimeline({ milestones }: JourneyTimelineProps) {
  const timelineRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  const { scrollXProgress } = useScroll({ container: timelineRef });
  const linePathLength = useTransform(scrollXProgress, [0, 1], reducedMotion ? 1 : [0, 1]);

  const [containerWidth, setContainerWidth] = useState(0);
  const [contentWidth, setContentWidth] = useState(0);

  useEffect(() => {
    const calculateWidths = () => {
      if (timelineRef.current) {
        setContainerWidth(timelineRef.current.offsetWidth);
        setContentWidth(timelineRef.current.scrollWidth);
      }
    };
    calculateWidths();
    window.addEventListener('resize', calculateWidths);
    // Recalculate on milestones change as content width might change
    return () => window.removeEventListener('resize', calculateWidths);
  }, [milestones]);

  const dragConstraints = reducedMotion ? {} : {
    right: 0,
    left: -(contentWidth > containerWidth ? contentWidth - containerWidth : 0),
  };
  
  return (
    <div className="relative w-full">
      <h3 className="text-2xl font-semibold text-foreground mb-6 gradient-text">My Professional Path</h3>
      <div
        ref={timelineRef}
        className="overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-primary" // Removed scrollbar-track-primary/20, changed pb-6 to pb-4
        style={{ cursor: reducedMotion ? 'default' : (contentWidth > containerWidth ? 'grab' : 'default'), scrollSnapType: 'x mandatory' }}
      >
        <motion.div 
          className="flex space-x-6 relative py-2" // Added py-2 for some internal vertical padding
          drag={!reducedMotion && contentWidth > containerWidth ? "x" : false}
          dragConstraints={dragConstraints}
          variants={timelineContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          onDragStart={() => { if (!reducedMotion && contentWidth > containerWidth && timelineRef.current) timelineRef.current.style.cursor = 'grabbing'; }}
          onDragEnd={() => { if (!reducedMotion && contentWidth > containerWidth && timelineRef.current) timelineRef.current.style.cursor = 'grab'; }}
        >
          {/* SVG for connecting lines */}
          {milestones.length > 1 && !reducedMotion && ( // Hide line if reduced motion
            <svg 
              className="absolute top-1/2 left-0 h-1 pointer-events-none -translate-y-1/2 z-0" 
              style={{ width: `${contentWidth}px`, overflow: 'visible' }}
              aria-hidden="true"
            >
              <motion.line
                x1="0" y1="0.5" // Centered within the 0.25rem (h-1) height SVG
                x2="100%" y2="0.5"
                stroke="hsl(var(--primary))"
                strokeWidth="2" // Line thickness
                initial={{ pathLength: 0 }}
                style={{ pathLength: linePathLength }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              />
            </svg>
          )}

          {milestones.map((milestone) => (
            <motion.div
              key={milestone.id}
              custom='right'
              variants={cardVariants}
              className={cn(
                "relative z-10 flex-shrink-0 w-72 md:w-80",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-lg"
              )}
              style={{ scrollSnapAlign: 'start' }}
              whileHover={!reducedMotion ? { 
                scale: 1.03, 
                boxShadow: "0px 8px 25px hsla(var(--gradient-middle), 0.2), 0px 0px 15px hsla(var(--gradient-middle), 0.1)", // Enhanced hover shadow
                transition: { type: "spring", stiffness: 300 }
              } : {}}
              tabIndex={0}
              role="article"
              aria-labelledby={`milestone-title-${milestone.id}`}
              aria-describedby={`milestone-desc-${milestone.id}`}
            >
              <Card className="h-full bg-card/70 backdrop-blur-md border-border/30 shadow-lg group transition-shadow hover:shadow-xl">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-primary">{milestone.year}</span>
                    {milestone.icon && <div className="text-primary/80 transition-transform group-hover:scale-110">{milestone.icon}</div>}
                  </div>
                  <CardTitle id={`milestone-title-${milestone.id}`} className="text-xl text-foreground">{milestone.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p id={`milestone-desc-${milestone.id}`} className="text-sm text-muted-foreground">{milestone.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
      {!reducedMotion && contentWidth > containerWidth && (
         <p className="text-xs text-muted-foreground text-center mt-4"> {/* Changed mt-2 to mt-4 */}
          Drag or scroll horizontally to explore the timeline.
        </p>
      )}
    </div>
  );
}

