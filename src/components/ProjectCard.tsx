import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Github, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

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

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="bg-card/50 backdrop-blur-sm overflow-hidden h-full flex flex-col group transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
      <div className="relative w-full h-48 overflow-hidden">
        <Image
          src={project.imageUrl}
          alt={project.title}
          layout="fill"
          objectFit="cover"
          className="transition-transform duration-500 group-hover:scale-110"
          data-ai-hint={project.imageHint || "tech project"}
        />
      </div>
      <CardHeader>
        <CardTitle className="gradient-text text-2xl">{project.title}</CardTitle>
        <div className="flex flex-wrap gap-2 mt-2">
          {project.tech.map((techStack) => (
            <Badge key={techStack} variant="secondary" className="bg-secondary/70 border-border text-xs">
              {techStack}
            </Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <CardDescription className="text-muted-foreground line-clamp-3">{project.description}</CardDescription>
      </CardContent>
      <CardFooter className="flex justify-start space-x-3 pt-4">
        {project.githubUrl && (
          <Button asChild variant="outline" size="sm" className="border-primary/50 text-primary/80 hover:border-primary hover:text-primary hover:bg-primary/10 transition-colors">
            <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer">
              <Github className="mr-2 h-4 w-4" /> GitHub
            </Link>
          </Button>
        )}
        {project.liveDemoUrl && (
          <Button asChild variant="outline" size="sm" className="border-primary/50 text-primary/80 hover:border-primary hover:text-primary hover:bg-primary/10 transition-colors">
            <Link href={project.liveDemoUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" /> Live Demo
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
