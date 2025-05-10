import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { GradientText } from '@/components/GradientText';
import { FadeInOnScroll } from '@/components/FadeInOnScroll';
import Link from 'next/link';

export function HeroSection() {
  return (
    <section id="hero" className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      <div className="absolute inset-0 -z-10 opacity-5">
        {/* Optional subtle background pattern or graphic */}
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <FadeInOnScroll>
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold mb-6">
            <GradientText>Your Name</GradientText>
          </h1>
        </FadeInOnScroll>
        <FadeInOnScroll delay="delay-200">
          <p className="text-xl sm:text-2xl md:text-3xl text-muted-foreground mb-10 max-w-3xl mx-auto">
            Node.js Backend Developer & DevOps Engineer
          </p>
        </FadeInOnScroll>
        <FadeInOnScroll delay="delay-400">
          <Button asChild size="lg" className="gradient-button rounded-lg px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
            <Link href="/placeholder-cv.pdf" target="_blank" download="YourName_CV.pdf">
              <Download className="mr-2 h-5 w-5" />
              Download CV
            </Link>
          </Button>
        </FadeInOnScroll>
      </div>
    </section>
  );
}
