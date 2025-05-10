
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Section } from '@/components/Section';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Github } from 'lucide-react';
import { FadeInOnScroll } from '../FadeInOnScroll';

export function GithubContributionsSection() {
  const githubUsername = process.env.NEXT_PUBLIC_GITHUB_USERNAME || "yourusername"; 

  return (
    <Section id="contributions" title="My GitHub Contributions">
      <FadeInOnScroll>
        <Card className="bg-card/50 backdrop-blur-sm overflow-hidden">
          <CardHeader className="items-center">
            <CardTitle className="text-2xl gradient-text flex items-center">
              <Github className="mr-2" /> Activity Overview
            </CardTitle>
            <CardDescription className="text-muted-foreground text-center">
              A snapshot of my coding activity over the past year.
              <br />
              Displaying contributions for user: <code className="font-mono text-primary">{githubUsername}</code>
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center p-4 md:p-6">
            <div className="w-full max-w-3xl rounded-lg shadow-lg overflow-hidden border border-border">
              <Image
                src={`https://picsum.photos/seed/${githubUsername}-ghchart/1200/325`}
                alt={`GitHub contributions chart for ${githubUsername}`}
                width={1200}
                height={325}
                className="w-full h-auto object-contain bg-muted"
                data-ai-hint="github activity chart"
                priority={false} 
              />
            </div>
            <p className="text-xs text-muted-foreground mt-4 text-center">
              This is a placeholder representation. For live data, you would typically integrate with a service 
              like <Link href={`https://ghchart.rshah.org/${githubUsername}`} target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">ghchart.rshah.org</Link> or 
              implement a backend solution to fetch data from the GitHub API.
            </p>
            <Button asChild variant="outline" size="sm" className="mt-6 border-primary/50 text-primary/80 hover:border-primary hover:text-primary hover:bg-primary/10 transition-colors">
              <Link href={`https://github.com/${githubUsername}`} target="_blank" rel="noopener noreferrer">
                <Github className="mr-2 h-4 w-4" /> View My GitHub Profile
              </Link>
            </Button>
          </CardContent>
        </Card>
      </FadeInOnScroll>
    </Section>
  );
}
