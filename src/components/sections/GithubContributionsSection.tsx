"use client";

import Link from 'next/link';
import { Section } from '@/components/Section';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Github } from 'lucide-react';
import { FadeInOnScroll } from '../FadeInOnScroll';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ContributionDay {
  date: string;
  count: number;
  // color: string; // Original color from API, not used for styling here
  // intensity: number; // Original intensity from API
}

const gridContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.005, // Adjust for desired effect with many cells
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

export function GithubContributionsSection() {
  const githubUsername = process.env.NEXT_PUBLIC_GITHUB_USERNAME || "yourusername";
  const [contributions, setContributions] = useState<ContributionDay[][]>([]);
  const [totalContributions, setTotalContributions] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!githubUsername) {
      setError("GitHub username is not configured.");
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
        setContributions([]);
        setTotalContributions(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContributions();
  }, [githubUsername]);

  return (
    <Section id="contributions" title="My GitHub Contributions">
      <FadeInOnScroll>
        <Card className="bg-card/50 backdrop-blur-sm overflow-hidden shadow-xl">
          <CardHeader className="items-center">
            <CardTitle className="text-2xl gradient-text flex items-center">
              <Github className="mr-2" /> Activity Overview
            </CardTitle>
            {!isLoading && !error && (
              <CardDescription className="text-muted-foreground text-center">
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
                <CardDescription className="text-muted-foreground text-center">
                  Loading contributions for <code className="font-mono text-primary">{githubUsername}</code>...
                </CardDescription>
              </motion.div>
            )}
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center p-4 md:p-6">
            <div className="w-full max-w-3xl p-4 bg-background/70 rounded-lg border border-border shadow-inner">
              {isLoading && (
                 <motion.div
                    className="h-32 flex items-center justify-center"
                    variants={loadingTextVariants}
                    initial="initial"
                    animate="animate"
                    transition={loadingTextVariants.transition}
                  >
                    <p className="text-center text-muted-foreground">Loading contributions graph...</p>
                </motion.div>
              )}
              {error && (
                 <div className="h-32 flex items-center justify-center">
                    <p className="text-center text-destructive">{error}</p>
                </div>
              )}
              {!isLoading && !error && contributions.length > 0 && (
                <motion.div
                  className="grid grid-flow-col grid-rows-7 gap-1 justify-start overflow-x-auto scrollbar-thin pb-2"
                  variants={gridContainerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {contributions.flat().map((day, index) => {
                    const count = day.count;
                    let contributionStrengthOpacity = 0; // Renamed from 'opacity'
                    if (count > 0) {
                      contributionStrengthOpacity = Math.min(0.15 + (count / 10) * 0.85, 1); 
                    }

                    return (
                      <TooltipProvider key={day.date || `day-${index}`} delayDuration={100}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <motion.div
                              variants={cellVariants}
                              className="h-3 w-3 rounded-sm shrink-0 cursor-default"
                              style={{
                                backgroundColor: count === 0
                                  ? 'hsl(var(--muted))'
                                  : `rgba(var(--primary-rgb), ${contributionStrengthOpacity})`,
                              }}
                              whileHover={{ scale: 1.75, zIndex: 10, transition: { duration: 0.15, type:"spring", stiffness:400, damping:10 } }}
                            />
                          </TooltipTrigger>
                           <TooltipContent className="bg-popover text-popover-foreground p-1.5 text-xs rounded-md shadow-lg border border-border">
                             <p>{`${count} contribution${count === 1 ? '' : 's'}`}</p>
                             <p>{new Date(day.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                           </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    );
                  })}
                </motion.div>
              )}
              {!isLoading && !error && contributions.length === 0 && githubUsername !== "yourusername" && (
                 <div className="h-32 flex items-center justify-center">
                    <p className="text-center text-muted-foreground">No contributions found for {githubUsername} in the last year.</p>
                </div>
              )}
            </div>
            
            <motion.div
              whileHover={{ scale: 1.05, transition: { type: "spring", stiffness: 300 } }}
              className="mt-6"
            >
              <Button 
                asChild 
                variant="outline" 
                size="sm" 
                className="border-primary/50 text-primary/80 hover:border-primary hover:text-primary hover:bg-primary/10 transition-colors"
                disabled={githubUsername === "yourusername" || !githubUsername}
              >
                <Link href={`https://github.com/${githubUsername}`} target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-4 w-4" /> View GitHub Profile
                </Link>
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </FadeInOnScroll>
    </Section>
  );
}
