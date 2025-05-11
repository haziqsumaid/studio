"use client";
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { Milestone } from './JourneyTimeline';

interface MilestoneCardProps {
  milestone: Milestone;
  isReducedMotion: boolean;
}

export function MilestoneCard({ milestone, isReducedMotion }: MilestoneCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  
  const handleFlip = (e: React.MouseEvent | React.KeyboardEvent) => {
    if ((e.target as HTMLElement).closest('a, button:not([role="button"])')) { // Allow card itself if it's role=button
      return;
    }
    if (!isReducedMotion) {
      setIsFlipped(!isFlipped);
    }
  };

  return (
    <div
      className={cn(
        "relative z-10 flex-shrink-0 w-64 sm:w-72 md:w-80 h-[260px] sm:h-[280px]", // Fixed height for consistent flip
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-lg"
      )}
      style={{ perspective: 1000, scrollSnapAlign: 'start' }} // Add perspective for 3D flip
    >
      <motion.div
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
          <Card 
            className="h-full bg-card/70 backdrop-blur-md border-border/30 shadow-lg flex flex-col transition-all duration-300 group-hover:shadow-xl group-focus-visible:ring-2 group-focus-visible:ring-primary"
            // @ts-ignore TODO: fix type framer-motion with asChild of shadcn
            whileHover={!isReducedMotion ? { 
              scale: 1.03, 
              boxShadow: "0px 8px 25px hsla(var(--gradient-middle), 0.2), 0px 0px 15px hsla(var(--gradient-middle), 0.1)",
              transition: { type: "spring", stiffness: 300 }
            } : {}}
          >
            <CardHeader className="pb-2 sm:pb-3">
              <div className="flex items-center justify-between mb-1 sm:mb-2">
                <span className="text-xs sm:text-sm font-semibold text-primary">{milestone.year}</span>
                {milestone.icon && <div className="text-primary/80 transition-transform group-hover:scale-110">{React.cloneElement(milestone.icon as React.ReactElement, { className: "w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" })}</div>}
              </div>
              <CardTitle id={`milestone-title-${milestone.id}`} className="text-base sm:text-lg md:text-xl text-foreground">{milestone.title}</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 pb-3 sm:pb-4 flex-grow overflow-hidden">
              <p id={`milestone-desc-${milestone.id}`} className="text-xs sm:text-sm text-muted-foreground line-clamp-4 sm:line-clamp-5">
                {milestone.description}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Back of the card */}
        <motion.div
          className="absolute w-full h-full"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <Card className="h-full bg-card/90 backdrop-blur-lg border-primary/70 shadow-xl flex flex-col items-center justify-center p-4 overflow-hidden">
            <CardTitle className="text-lg sm:text-xl text-primary mb-2 text-center">{milestone.title}</CardTitle>
            <CardContent className="text-center text-xs sm:text-sm text-foreground/90 overflow-y-auto scrollbar-thin w-full px-2">
              <p>{milestone.details || "More information about this milestone is coming soon!"}</p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
