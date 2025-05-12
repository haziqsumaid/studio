"use client";

import React, { useRef, useEffect, useState } from 'react';
import { motion, useReducedMotion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import type { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Dot } from 'lucide-react';
import { MilestoneCard } from './MilestoneCard'; // Ensure MilestoneCard is imported

export interface Milestone {
  id: string;
  year: string;
  title: string;
  description: string;
  icon?: ReactNode;
  details?: string; // For the back of the card
}

interface JourneyTimelineProps {
  milestones: Milestone[];
}

const timelineContainerVariants = {
  visible: { transition: { staggerChildren: 0.2 } },
  hidden: {},
};

export function JourneyTimeline({ milestones }: JourneyTimelineProps) {
  const timelineRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const [activeMilestoneIndex, setActiveMilestoneIndex] = useState(0);

  // const { scrollXProgress } = useScroll({ container: timelineRef }); // No longer needed for central line
  // const linePathLength = useTransform(scrollXProgress, [0, 1], reducedMotion ? 1 : [0, 1]); // No longer needed

  const [containerWidth, setContainerWidth] = useState(0);
  const [contentWidth, setContentWidth] = useState(0);
  const [cardWidth, setCardWidth] = useState(256); // Default w-64

  useEffect(() => {
    const calculateWidths = () => {
      if (timelineRef.current) {
        const firstCard = timelineRef.current.querySelector(':scope > div > div') as HTMLElement;
        if (firstCard) {
            const cs = getComputedStyle(firstCard);
            const cardActualWidth = firstCard.offsetWidth + parseFloat(cs.marginLeft) + parseFloat(cs.marginRight);
            setCardWidth(cardActualWidth > 0 ? cardActualWidth : 256 + 16);
        }
        setContainerWidth(timelineRef.current.offsetWidth);
        setContentWidth(timelineRef.current.scrollWidth);
      }
    };

    if (typeof window !== 'undefined') {
      calculateWidths(); 
      const resizeObserver = new ResizeObserver(calculateWidths);
      if(timelineRef.current) resizeObserver.observe(timelineRef.current);
      
      const intervalId = setInterval(calculateWidths, 500);

      return () => {
        if(timelineRef.current) resizeObserver.unobserve(timelineRef.current);
        clearInterval(intervalId);
      };
    }
  }, [milestones]);
  
  useEffect(() => {
    const currentTimelineRef = timelineRef.current;
    const handleScroll = () => {
      if (currentTimelineRef && cardWidth > 0) {
        const scrollLeft = currentTimelineRef.scrollLeft;
        const newIndex = Math.round(scrollLeft / cardWidth);
        setActiveMilestoneIndex(newIndex);
      }
    };
    currentTimelineRef?.addEventListener('scroll', handleScroll, { passive: true });
    return () => currentTimelineRef?.removeEventListener('scroll', handleScroll);
  }, [cardWidth]);


  const scrollToMilestone = (index: number) => {
    if (timelineRef.current && cardWidth > 0) {
      timelineRef.current.scrollTo({
        left: index * cardWidth,
        behavior: reducedMotion ? 'auto' : 'smooth',
      });
      setActiveMilestoneIndex(index);
    }
  };

  const dragConstraints = reducedMotion ? {} : {
    right: 0,
    left: -(contentWidth > containerWidth ? contentWidth - containerWidth : 0),
  };

  return (
    <div className="relative w-full">
      <h3 className="text-xl sm:text-2xl font-semibold text-foreground mb-6 sm:mb-8 gradient-text">My Professional Path</h3>
      <div
        ref={timelineRef}
        className="overflow-x-auto pb-4 scrollbar-thin hide-native-scrollbar" 
        style={{ cursor: reducedMotion ? 'default' : (contentWidth > containerWidth ? 'grab' : 'default'), scrollSnapType: 'x mandatory' }}
      >
        <motion.div
          className="flex space-x-4 sm:space-x-6 relative py-2 min-w-max h-[280px] sm:h-[300px]" 
          drag={!reducedMotion && contentWidth > containerWidth ? "x" : false}
          dragConstraints={dragConstraints}
          variants={timelineContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          onDragStart={() => { if (!reducedMotion && contentWidth > containerWidth && timelineRef.current) timelineRef.current.style.cursor = 'grabbing'; }}
          onDragEnd={() => { if (!reducedMotion && contentWidth > containerWidth && timelineRef.current) timelineRef.current.style.cursor = 'grab'; }}
        >
          {milestones.map((milestone, index) => (
            <MilestoneCard
              key={milestone.id}
              milestone={milestone}
              isReducedMotion={reducedMotion || false}
            />
          ))}
          {/* Removed the SVG line drawing progress in the center of cards */}
        </motion.div>
      </div>

      {/* Mobile Pagination Dots */}
      {milestones.length > 1 && (
        <div className="flex md:hidden justify-center items-center space-x-1 mt-4">
            <Button variant="ghost" size="icon" onClick={() => scrollToMilestone(Math.max(0, activeMilestoneIndex -1))} disabled={activeMilestoneIndex === 0} aria-label="Previous milestone">
                <ChevronLeft className="h-5 w-5"/>
            </Button>
          {milestones.map((_, index) => (
            <button
              key={`dot-${index}`}
              onClick={() => scrollToMilestone(index)}
              className={cn(
                "p-1 rounded-full transition-colors",
                activeMilestoneIndex === index ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
              aria-label={`Go to milestone ${index + 1}`}
              aria-current={activeMilestoneIndex === index ? "step" : undefined}
            >
              <Dot size={activeMilestoneIndex === index ? 32 : 24} strokeWidth={activeMilestoneIndex === index ? 3 : 2.5} />
            </button>
          ))}
           <Button variant="ghost" size="icon" onClick={() => scrollToMilestone(Math.min(milestones.length - 1, activeMilestoneIndex + 1))} disabled={activeMilestoneIndex === milestones.length - 1} aria-label="Next milestone">
                <ChevronRight className="h-5 w-5"/>
            </Button>
        </div>
      )}
      {!reducedMotion && contentWidth > containerWidth && (
        <p className="text-xs text-muted-foreground text-center mt-4 sm:mt-6">
          Drag or scroll horizontally to explore the timeline.
        </p>
      )}
    </div>
  );
}
