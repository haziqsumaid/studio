
"use client";

import Link from 'next/link';
import { Section } from '@/components/Section';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Github } from 'lucide-react';
import { FadeInOnScroll } from '../FadeInOnScroll';
import { useEffect, useState } from 'react';

interface ContributionDay {
  date: string;
  count: number;
  // color: string; // Original color from API, not used for styling here
  // intensity: number; // Original intensity from API
}

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
        <Card className="bg-card/50 backdrop-blur-sm overflow-hidden">
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
              <CardDescription className="text-muted-foreground text-center">
                Loading contributions for <code className="font-mono text-primary">{githubUsername}</code>...
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center p-4 md:p-6">
            <div className="w-full max-w-3xl p-4 bg-background rounded-lg border border-border shadow-inner">
              {isLoading && (
                <div className="h-32 flex items-center justify-center">
                    <p className="text-center text-muted-foreground">Loading contributions graph...</p>
                </div>
              )}
              {error && (
                 <div className="h-32 flex items-center justify-center">
                    <p className="text-center text-destructive">{error}</p>
                </div>
              )}
              {!isLoading && !error && contributions.length > 0 && (
                <div className="grid grid-flow-col grid-rows-7 gap-1 justify-start overflow-x-auto scrollbar-thin pb-2">
                  {contributions.flat().map((day, index) => {
                    const count = day.count;
                    let opacity = 0;
                    if (count > 0) {
                      // Scale opacity: 0.2 for 1 contribution, up to 1.0 for 10+ contributions
                      opacity = Math.min(0.2 + (count / 10) * 0.8, 1); 
                    }

                    return (
                      <div
                        key={day.date || `day-${index}`}
                        className="h-3 w-3 rounded-sm shrink-0" // Added shrink-0 for safety in flex/grid
                        style={{
                          backgroundColor: count === 0
                            ? 'hsl(var(--muted))'
                            : `hsla(var(--primary-rgb), ${opacity})`,
                        }}
                        title={`${count} contribution${count === 1 ? '' : 's'} on ${new Date(day.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}`}
                      />
                    );
                  })}
                </div>
              )}
              {!isLoading && !error && contributions.length === 0 && githubUsername !== "yourusername" && (
                 <div className="h-32 flex items-center justify-center">
                    <p className="text-center text-muted-foreground">No contributions found for {githubUsername} in the last year.</p>
                </div>
              )}
            </div>
            
            <Button 
              asChild 
              variant="outline" 
              size="sm" 
              className="mt-6 border-primary/50 text-primary/80 hover:border-primary hover:text-primary hover:bg-primary/10 transition-colors"
              disabled={githubUsername === "yourusername" || !githubUsername}
            >
              <Link href={`https://github.com/${githubUsername}`} target="_blank" rel="noopener noreferrer">
                <Github className="mr-2 h-4 w-4" /> View GitHub Profile
              </Link>
            </Button>
          </CardContent>
        </Card>
      </FadeInOnScroll>
    </Section>
  );
}

