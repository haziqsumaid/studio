
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { Github, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import type { HTMLMotionProps } from 'framer-motion';

// Define Project interface here or import from a shared types file
export interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  imageHint?: string;
  tech: string[];
  githubUrl?: string;
  liveDemoUrl?: string;
}

interface ProjectRowProps {
  project: Project;
  index: number;
}

// Animation variants based on the prompt
const rowVariants = (i: number) => ({
  hidden: { opacity: 0, x: i % 2 === 1 ? 50 : -50 }, // Even index (0, 2) from left, Odd index (1, 3) from right
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } }
});

const imageHover = (index: number) => ({
  hover: {
    scale: 1.05,
    rotate: index % 2 === 0 ? 2 : -2, // Odd rows (image left) rotate one way, even rows (image right) rotate other way
    transition: { type: 'spring', stiffness: 200, damping: 20 }
  }
});

const textRevealContainerVariants = { // Added a container variant for text content staggering
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15, // Stagger children of the text container
      delayChildren: 0.2, // Delay children after row animation
    }
  }
};

const textRevealChildVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
};

const badgeVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: 'easeOut' } }
};


export function ProjectRow({ project, index }: ProjectRowProps) {
  const isReduced = useReducedMotion();
  const isEvenRow = index % 2 === 1; // 0-indexed: 0 is odd (first), 1 is even (second)

  const handleRowKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Enter') {
      if (project.liveDemoUrl && project.liveDemoUrl !== '#') {
        window.open(project.liveDemoUrl, '_blank');
      } else if (project.githubUrl) {
        window.open(project.githubUrl, '_blank');
      }
    }
  };

  const buttonTapProps: HTMLMotionProps<"a"> = isReduced ? {} : { whileTap: { scale: 0.95 }, transition: { duration: 0.2 } };

  return (
    <motion.article
      className={cn(
        "relative", // For gradient bar positioning
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-background rounded-lg", // Accessibility: Focus
        // Desktop layout: 2-column grid
        "lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center",
        // Mobile layout: single column stack
        "flex flex-col space-y-6 lg:space-y-0" 
      )}
      variants={!isReduced ? rowVariants(index) : { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.5 }}}}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }} // Trigger when 20% of the row is visible
      tabIndex={0} // Accessibility: Make row focusable
      onKeyDown={handleRowKeyDown} // Accessibility: Trigger CTA on Enter
      aria-labelledby={`project-title-${project.id}`}
    >
      {/* Gradient Accent Bar - Spans full width of the article */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-400 via-green-400 to-lime-400 mb-6 rounded-t-lg" />

      {/* Image Section - order changes based on row index for desktop */}
      <motion.figure
        className={cn(
          "w-full pt-8 lg:pt-0", // Add padding top to account for gradient bar
          isEvenRow ? "lg:order-2" : "lg:order-1"
        )}
        variants={!isReduced ? imageHover(index) : undefined}
        whileHover={!isReduced ? "hover" : undefined}
      >
        <div className="aspect-w-16 aspect-h-9 rounded-xl overflow-hidden shadow-2xl border border-border/20">
          <Image
            src={project.imageUrl}
            alt={project.title}
            layout="fill"
            objectFit="cover"
            className="rounded-xl" // Ensure image itself is rounded if needed, or rely on overflow-hidden
            loading="lazy"
            placeholder="blur"
            blurDataURL={`data:image/svg+xml;base64,${Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 5"><filter id="b"><feGaussianBlur stdDeviation="1"/></filter><rect width="100%" height="100%" fill="#777" filter="url(#b)"/></svg>`).toString('base64')}`}
            data-ai-hint={project.imageHint || "tech project showcase"}
          />
        </div>
      </motion.figure>

      {/* Text Content Section - order changes based on row index for desktop */}
      <motion.div
        className={cn(
          "flex flex-col space-y-4 lg:space-y-5 pt-4 lg:pt-0",
           isEvenRow ? "lg:order-1" : "lg:order-2"
        )}
        variants={!isReduced ? textRevealContainerVariants : undefined} // Use container for staggering
        initial="hidden" // Initial for children will be handled by stagger
        whileInView="visible" // Animate children when this container is in view
        viewport={{ once: true, amount: 0.3 }} // Fine-tune amount if needed
      >
        <motion.h3
          id={`project-title-${project.id}`}
          className="text-2xl md:text-3xl font-bold gradient-text"
          variants={!isReduced ? textRevealChildVariants : undefined}
        >
          {project.title}
        </motion.h3>

        <motion.div
          className="flex flex-wrap gap-2 items-center"
          variants={!isReduced ? textRevealChildVariants : undefined} // Stagger parent for badges
        >
          {project.tech.map((techStack) => (
            <TooltipProvider key={techStack} delayDuration={100}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div variants={!isReduced ? badgeVariants : undefined}>
                    <Badge variant="secondary" className="bg-secondary/70 border-border text-xs cursor-default">
                      {techStack}
                    </Badge>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent className="bg-popover/80 backdrop-blur-sm text-popover-foreground p-2 rounded-md shadow-lg border border-border/30">
                  <p className="text-xs font-medium">{techStack}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </motion.div>

        <motion.p
          className="text-muted-foreground text-sm md:text-base leading-relaxed"
          variants={!isReduced ? textRevealChildVariants : undefined}
        >
          {project.description}
        </motion.p>

        <motion.div 
          className="flex flex-wrap gap-3 pt-2"
          variants={!isReduced ? textRevealChildVariants : undefined}
        >
          {project.githubUrl && (
            <Button asChild variant="outline" size="sm" className="border-primary/50 text-primary/80 hover:border-primary hover:text-primary hover:bg-primary/10 transition-colors">
              <motion.a href={project.githubUrl} target="_blank" rel="noopener noreferrer" {...buttonTapProps} >
                <Github size={18} className="mr-2" /> GitHub
              </motion.a>
            </Button>
          )}
          {project.liveDemoUrl && project.liveDemoUrl !== '#' && (
            <Button asChild variant="default" size="sm" className="gradient-button">
              <motion.a href={project.liveDemoUrl} target="_blank" rel="noopener noreferrer" {...buttonTapProps}>
                <ExternalLink size={18} className="mr-2" /> Live Demo
              </motion.a>
            </Button>
          )}
        </motion.div>
      </motion.div>
    </motion.article>
  );
}
