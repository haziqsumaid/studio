import Link from 'next/link';
import { Github, Linkedin, Twitter } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-background border-t border-border/50 py-8 text-center text-muted-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center space-x-6 mb-4">
          <Link href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-muted-foreground hover:text-foreground transition-colors">
            <Github size={24} />
          </Link>
          <Link href="https://linkedin.com/in/yourusername" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-muted-foreground hover:text-foreground transition-colors">
            <Linkedin size={24} />
          </Link>
          <Link href="https://twitter.com/yourusername" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="text-muted-foreground hover:text-foreground transition-colors">
            <Twitter size={24} />
          </Link>
        </div>
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Your Name. All rights reserved.
        </p>
        <p className="text-xs mt-2">
          Built with Next.js and Tailwind CSS.
        </p>
      </div>
    </footer>
  );
}
