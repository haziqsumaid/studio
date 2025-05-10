import Image from 'next/image';
import { Section } from '@/components/Section';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Type, Briefcase, Container, GitMerge, Cloud, Cpu } from 'lucide-react';

const skills = [
  { name: 'TypeScript', icon: <Type size={18} /> },
  { name: 'Node.js', icon: <Briefcase size={18} /> },
  { name: 'Express.js', icon: <Briefcase size={18} /> },
  { name: 'Docker', icon: <Container size={18} /> },
  { name: 'CI/CD', icon: <GitMerge size={18} /> },
  { name: 'AWS', icon: <Cloud size={18} /> },
  { name: 'DevOps', icon: <Cpu size={18} /> },
  { name: 'API Design', icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 10 10H12V2Z"/><path d="M12 12a10 10 0 0 0 10-10Z"/></svg>}, // Custom API icon
  { name: 'MongoDB', icon: <DatabaseIcon size={18} /> },
];

// Placeholder for Database icon if not in lucide-react
function DatabaseIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
  )
}


export function AboutSection() {
  return (
    <Section id="about" title="About Me">
      <div className="grid md:grid-cols-3 gap-12 items-center">
        <div className="md:col-span-1 flex justify-center">
          <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden shadow-xl border-4 border-[hsl(var(--gradient-middle))]">
            <Image
              src="https://picsum.photos/400/400"
              alt="Your Name - Professional Portrait"
              layout="fill"
              objectFit="cover"
              className="transform hover:scale-105 transition-transform duration-500"
              data-ai-hint="professional portrait"
            />
          </div>
        </div>
        <div className="md:col-span-2">
          <Card className="bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl gradient-text">A Bit About My Journey</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-muted-foreground">
              <p className="text-lg">
                Hello! I'm a passionate Senior Node.js Backend Developer and DevOps Engineer with a knack for building scalable, efficient, and robust systems. My journey in tech has been driven by a constant curiosity and a desire to solve complex problems.
              </p>
              <p>
                I thrive in environments where I can leverage my expertise in backend architecture, API development, and cloud infrastructure to deliver high-quality software solutions. I'm a firm believer in clean code, automation, and continuous improvement.
              </p>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Core Skills:</h3>
                <div className="flex flex-wrap gap-3">
                  {skills.map((skill) => (
                    <Badge key={skill.name} variant="secondary" className="text-sm px-3 py-1.5 flex items-center gap-2 bg-secondary/70 border-border hover:bg-secondary transition-colors">
                      {skill.icon}
                      {skill.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Section>
  );
}
