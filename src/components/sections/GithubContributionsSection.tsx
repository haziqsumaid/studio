"use client";

import Link from 'next/link';
import { Section } from '@/components/Section';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Github } from 'lucide-react';
import { FadeInOnScroll } from '../FadeInOnScroll';
import { useEffect, useState, useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";


interface ContributionDay {
  date: string;
  count: number;
}

const gridContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.005, 
    },
  },
};

const cellVariants = {
  hidden: { opacity: 0, scale: 0.3 },
  visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 300, damping: 20 } },
};

const loadingTextVariants = {
  initial: { opacity: 0.5 },
  animate: { opacity: [0.5, 1, 0.5] },
  transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
};

// Adjusted opacity for better visibility of green shades
const CONTRIBUTION_LEVEL_COLORS = [
  'hsl(var(--muted))', // 0 contributions
  'hsla(var(--chart-git-1))', // Level 1 (was 0.2)
  'hsla(var(--chart-git-2))', // Level 2 (was 0.4)
  'hsla(var(--chart-git-3))', // Level 3 (was 0.7)
  'hsla(var(--chart-git-4))', // Level 4 (Full Green, no change)
];

const getContributionColor = (count: number, maxContributionsInPeriod: number = 10): string => {
  if (count === 0) return CONTRIBUTION_LEVEL_COLORS[0];
  if (maxContributionsInPeriod === 0) return CONTRIBUTION_LEVEL_COLORS[1]; // If max is 0 but count > 0, show lightest green
  if (count >= maxContributionsInPeriod * 0.75) return CONTRIBUTION_LEVEL_COLORS[4];
  if (count >= maxContributionsInPeriod * 0.5) return CONTRIBUTION_LEVEL_COLORS[3];
  if (count >= maxContributionsInPeriod * 0.25) return CONTRIBUTION_LEVEL_COLORS[2];
  return CONTRIBUTION_LEVEL_COLORS[1];
};


export function GithubContributionsSection() {
  const githubUsername = process.env.NEXT_PUBLIC_GITHUB_USERNAME || "yourusername";
  const [contributions, setContributions] = useState<ContributionDay[][]>([]);
  const [totalContributions, setTotalContributions] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const reducedMotion = useReducedMotion();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    if (!githubUsername) {
      setError("GitHub username is not configured. Please set NEXT_PUBLIC_GITHUB_USERNAME in your .env file.");
      setIsLoading(false);
      setContributions([]);
      setTotalContributions(0);
      return;
    }
    
    if (githubUsername === "yourusername") {
      setError("Please set your GitHub username in .env.local (NEXT_PUBLIC_GITHUB_USERNAME) to see your contributions.");
      setIsLoading(false);
      setContributions([]);
      setTotalContributions(0);
      return;
    }

    setIsLoading(true);
    setError(null);
    const fetchContributions = async () => {
      try {
        // Using a more reliable API for GitHub contributions
        const res = await fetch(
          `https://github-contributions-api.jogruber.de/v4/${githubUsername}?y=last`
        );
        if (!res.ok) {
          throw new Error(`Failed to fetch contributions: ${res.status} ${res.statusText}`);
        }
        const data = await res.json();
        if (!data.contributions || !data.total || typeof data.total.lastYear === 'undefined') {
          console.warn("GitHub API response might be malformed:", data);
          throw new Error('Invalid data format from GitHub contributions API');
        }
        setContributions(data.contributions);
        setTotalContributions(data.total.lastYear);
      } catch (err) {
        console.error('Error fetching GitHub contributions:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred while fetching contributions.');
        setContributions([]); // Clear contributions on error
        setTotalContributions(0); // Clear total on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchContributions();
  }, [githubUsername, isClient]);

  const maxContributionsInFetchedData = useMemo(() => {
    if (!contributions || contributions.length === 0) return 10; // Default if no data or error
    return contributions.flat().reduce((max, day) => Math.max(max, day ? day.count : 0), 0) || 10; // Added check for day
  }, [contributions]);


  return (
    <Section id="contributions" title="My GitHub Contributions">
      <FadeInOnScroll>
        <Card className="bg-card/50 backdrop-blur-sm overflow-hidden shadow-xl transform transition-all duration-500 hover:shadow-2xl hover:scale-[1.01]">
          <CardHeader className="items-center pb-4">
            <motion.div 
              initial={reducedMotion ? {} : { opacity: 0, y: -20 }}
              animate={reducedMotion ? {} : { opacity: 1, y: 0, transition: { delay: 0.2, duration: 0.5 } }}
            >
              <CardTitle className="text-2xl gradient-text flex items-center">
                <Github className="mr-2" /> Activity Overview
              </CardTitle>
            </motion.div>
            {!isLoading && !error && (
              <CardDescription className="text-muted-foreground text-center pt-1">
                {totalContributions} contributions in the last year for <code className="font-mono text-primary">{githubUsername}</code>
              </CardDescription>
            )}
             {isLoading && (
              <motion.div
                variants={loadingTextVariants}
                initial="initial"
                animate="animate"
                transition={loadingTextVariants.transition}
              >
                <CardDescription className="text-muted-foreground text-center pt-1">
                  Loading contributions for <code className="font-mono text-primary">{githubUsername}</code>...
                </CardDescription>
              </motion.div>
            )}
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center p-4 md:p-6">
            <div className="w-full max-w-3xl p-4 bg-background/70 rounded-lg border border-border shadow-inner">
              {isLoading && (
                 <motion.div
                    className="h-40 flex items-center justify-center"
                    variants={loadingTextVariants}
                    initial="initial"
                    animate="animate"
                    transition={loadingTextVariants.transition}
                  >
                    <p className="text-center text-muted-foreground">Loading contributions graph...</p>
                </motion.div>
              )}
              {error && (
                 <div className="h-40 flex items-center justify-center">
                    <p className="text-center text-destructive px-4">{error}</p>
                </div>
              )}
              {!isLoading && !error && contributions.length > 0 && (
                <motion.div
                  className="grid grid-flow-col grid-rows-7 gap-1 justify-start overflow-x-auto scrollbar-thin pb-2"
                  variants={reducedMotion ? {} : gridContainerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {contributions.flat().filter(day => day).map((day, index) => { // Added filter for potentially null/undefined days
                    const color = getContributionColor(day.count, maxContributionsInFetchedData);

                    return (
                      <TooltipProvider key={day.date || `day-${index}`} delayDuration={100}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <motion.div
                              variants={reducedMotion ? {} : cellVariants}
                              className="h-3.5 w-3.5 rounded-sm shrink-0 cursor-default"
                              style={{ backgroundColor: color }}
                              whileHover={!reducedMotion ? { 
                                scale: 1.85, 
                                zIndex: 10, 
                                boxShadow: `0 0 8px ${color === 'hsl(var(--muted))' ? 'hsla(var(--muted-foreground), 0.5)' : color}`,
                                transition: { duration: 0.15, type:"spring", stiffness:400, damping:10 } 
                              } : {}}
                            />
                          </TooltipTrigger>
                           <TooltipContent className="bg-popover text-popover-foreground p-1.5 text-xs rounded-md shadow-lg border border-border">
                             <p className="font-semibold">{`${day.count} contribution${day.count === 1 ? '' : 's'}`}</p>
                             <p className="text-muted-foreground">{new Date(day.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                           </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    );
                  })}
                </motion.div>
              )}
              {!isLoading && !error && contributions.length === 0 && githubUsername !== "yourusername" && (
                 <div className="h-40 flex items-center justify-center">
                    <p className="text-center text-muted-foreground">No contributions found for {githubUsername} in the last year.</p>
                </div>
              )}
            </div>
            
            <motion.div
              whileHover={!reducedMotion ? { scale: 1.05, transition: { type: "spring", stiffness: 300 } } : {}}
              className="mt-6"
            >
              <Button 
                asChild 
                variant="outline" 
                size="sm" 
                // className="gradient-button-outline"
                disabled={isLoading || githubUsername === "yourusername" || !githubUsername} // Added isLoading to disabled check
              >
                <Link href={`https://github.com/${githubUsername}`} target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-4 w-4" /> <span>View GitHub Profile</span>
                </Link>
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </FadeInOnScroll>
    </Section>
  );
}