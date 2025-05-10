import Image from 'next/image';
import { Section } from '@/components/Section';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Github } from 'lucide-react';

export function GithubContributionsSection() {
  const githubUsername = 'yourusername'; // Replace with your GitHub username or use an env variable

  return (
    <Section id="contributions" title="My GitHub Contributions">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-card/50 backdrop-blur-sm overflow-hidden">
          <CardHeader className="items-center">
            <CardTitle className="text-2xl gradient-text flex items-center">
              <Github className="mr-2" />
              Activity Overview
            </CardTitle>
            <CardDescription className="text-muted-foreground text-center">
              A snapshot of my coding activity over the past year.
              <br />
              Displaying contributions for user: <code className='font-mono text-primary'>{githubUsername}</code>
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center p-4 md:p-6">
            <div className="w-full rounded-lg shadow-lg overflow-hidden border border-border">
              <Image
                // Using a placeholder image. 
                // For live chart, you could use: `https://ghchart.rshah.org/${githubUsername}`
                // Ensure to handle cases where the username might be invalid or the service is down.
                // Or, embed a more sophisticated solution.
                src={`https://picsum.photos/seed/${githubUsername}-ghchart/1200/325`}
                alt={`GitHub contributions chart for ${githubUsername}`}
                width={1200}
                height={325}
                className="w-full h-auto object-contain bg-muted"
                data-ai-hint="github activity chart"
                priority={false} // Not critical for LCP
              />
            </div>
            <p className="text-xs text-muted-foreground mt-4 text-center">
              This is a placeholder representation. For live data, integrate with a service like <a href="https://ghchart.rshah.org/" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">ghchart.rshah.org</a> or the GitHub API.
            </p>
          </CardContent>
        </Card>
      </div>
    </Section>
  );
}
