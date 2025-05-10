"use client";

import React, { useRef, useEffect, useState } from 'react';
import { motion, useReducedMotion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import type { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Dot } from 'lucide-react';

export interface Milestone {
  id: string;
  year: string;
  title: string;
  description: string;
  icon?: ReactNode;
  details?: string; // For the back of the card
}

interface MilestoneCardProps {
  milestone: Milestone;
  isReducedMotion: boolean;
}

function MilestoneCard({ milestone, isReducedMotion }: MilestoneCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = (e: React.MouseEvent | React.KeyboardEvent) => {
    // Prevent flipping if the click is on an interactive element within the card (if any)
    if ((e.target as HTMLElement).closest('a, button')) {
        return;
    }
    if (!isReducedMotion) {
      setIsFlipped(!isFlipped);
    }
  };
  
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className="relative w-64 sm:w-72 md:w-80 h-full flex-shrink-0" // Ensure height is consistent
      style={{ perspective: 1000, scrollSnapAlign: 'start' }}
    >
      <motion.div
        ref={cardRef}
        className="relative w-full h-full cursor-pointer group"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
        onClick={handleFlip}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleFlip(e); } }}
        tabIndex={0}
        role="button"
        aria-pressed={isFlipped}
        aria-label={`View details for ${milestone.title}`}
      >
        {/* Front of the card */}
        <motion.div
          className="absolute w-full h-full"
          style={{ backfaceVisibility: "hidden" }}
        >
          <Card className="h-full bg-card/70 backdrop-blur-md border-border/30 shadow-lg flex flex-col">
            <CardHeader className="pb-2 sm:pb-3">
              <div className="flex items-center justify-between mb-1 sm:mb-2">
                <span className="text-xs sm:text-sm font-semibold text-primary">{milestone.year}</span>
                {milestone.icon && <div className="text-primary/80 transition-transform group-hover:scale-110">{React.cloneElement(milestone.icon as React.ReactElement, { className: "w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" })}</div>}
              </div>
              <CardTitle id={`milestone-title-${milestone.id}`} className="text-base sm:text-lg md:text-xl text-foreground">{milestone.title}</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 pb-3 sm:pb-4 flex-grow">
              <p id={`milestone-desc-${milestone.id}`} className="text-xs sm:text-sm text-muted-foreground line-clamp-4">{milestone.description}</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Back of the card */}
        <motion.div
          className="absolute w-full h-full"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <Card className="h-full bg-primary/10 backdrop-blur-md border-primary/50 shadow-xl flex flex-col items-center justify-center p-4">
            <CardTitle className="text-lg text-primary mb-2 text-center">{milestone.title}</CardTitle>
            <CardContent className="text-center text-sm text-primary-foreground/80 overflow-y-auto scrollbar-thin max-h-full">
              <p>{milestone.details || "More details coming soon."}</p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
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

  const { scrollXProgress } = useScroll({ container: timelineRef });
  const linePathLength = useTransform(scrollXProgress, [0, 1], reducedMotion ? 1 : [0, 1]);

  const [containerWidth, setContainerWidth] = useState(0);
  const [contentWidth, setContentWidth] = useState(0);
  const [cardWidth, setCardWidth] = useState(256); // Default w-64

  useEffect(() => {
    const calculateWidths = () => {
      if (timelineRef.current) {
        const firstCard = timelineRef.current.querySelector(':scope > div > div') as HTMLElement; // Select the MilestoneCard's motion.div
        if (firstCard) {
            const cs = getComputedStyle(firstCard);
            const cardActualWidth = firstCard.offsetWidth + parseFloat(cs.marginLeft) + parseFloat(cs.marginRight);
            setCardWidth(cardActualWidth > 0 ? cardActualWidth : 256 + 16); // w-64 + space-x-4
        }
        setContainerWidth(timelineRef.current.offsetWidth);
        setContentWidth(timelineRef.current.scrollWidth);
      }
    };

    if (typeof window !== 'undefined') {
      calculateWidths(); // Initial calculation
      const resizeObserver = new ResizeObserver(calculateWidths);
      if(timelineRef.current) resizeObserver.observe(timelineRef.current);
      
      // Fallback for browsers not supporting ResizeObserver on scrollWidth changes effectively
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
        className="overflow-x-auto pb-4 scrollbar-thin hide-native-scrollbar" // Class to hide native scrollbar if needed for custom one
        style={{ cursor: reducedMotion ? 'default' : (contentWidth > containerWidth ? 'grab' : 'default'), scrollSnapType: 'x mandatory' }}
      >
        <motion.div
          className="flex space-x-4 sm:space-x-6 relative py-2 min-w-max h-[280px] sm:h-[300px]" // Ensure min-w-max for scrollWidth and fixed height
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
          {milestones.length > 1 && !reducedMotion && (
            <svg
              className="absolute top-1/2 left-0 h-1 pointer-events-none -translate-y-[calc(50%-0.5px)] z-0"
              style={{ width: contentWidth ? `${contentWidth - (milestones.length > 0 ? cardWidth/2 + cardWidth/2 -16 : 0)}px`: '100%' }} // More accurate line width
              aria-hidden="true"
            >
              <motion.line
                x1={`${cardWidth / 4}px`} y1="1" // Start line from center of first card approx
                x2={`calc(100% - ${cardWidth / 4}px)`} y2="1" // End line at center of last card approx
                stroke="hsl(var(--primary))"
                strokeWidth="2"
                initial={{ pathLength: 0 }}
                style={{ pathLength: linePathLength }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              />
            </svg>
          )}
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