
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { GradientText } from '@/components/GradientText';
import { FadeInOnScroll } from '@/components/FadeInOnScroll';
import Link from 'next/link';
import { ParticleBackground } from '@/components/ParticleBackground'; // Added
import { cn } from '@/lib/utils';

const roles = [
  "< Backend Developer />",
  "< DevOps Engineer />",
  "< Ai/ML Engineer />"
];
const typingSpeed = 150;
const deletingSpeed = 75;
const delayBetweenRoles = 2000;

export function HeroSection() {
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (isDeleting) {
      if (displayedText.length > 0) {
        timeoutId = setTimeout(() => {
          setDisplayedText((prev) => prev.slice(0, -1));
        }, deletingSpeed);
      } else {
        setIsDeleting(false);
        setCurrentRoleIndex((prevIndex) => (prevIndex + 1) % roles.length);
      }
    } else {
      if (displayedText.length < roles[currentRoleIndex].length) {
        timeoutId = setTimeout(() => {
          setDisplayedText((prev) => roles[currentRoleIndex].slice(0, prev.length + 1));
        }, typingSpeed);
      } else {
        timeoutId = setTimeout(() => {
          setIsDeleting(true);
        }, delayBetweenRoles);
      }
    }

    return () => clearTimeout(timeoutId);
  }, [displayedText, isDeleting, currentRoleIndex]);

  return (
    <section id="hero" className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      <ParticleBackground />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <FadeInOnScroll>
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold mb-6">
            <GradientText>Your Name</GradientText>
          </h1>
        </FadeInOnScroll>
        <FadeInOnScroll delay="delay-200">
          <p 
            className={cn(
              "text-xl sm:text-2xl md:text-3xl mb-10 max-w-3xl mx-auto",
              "h-16 sm:h-20 md:h-24", // Adjusted height for typical 1-2 lines of text-3xl
              "flex items-center justify-center" // Ensure vertical centering if text is short
            )}
            aria-live="polite"
            aria-atomic="true"
          >
            <GradientText className="typing-cursor">{displayedText}</GradientText>
            {/* Ensures a consistent height even if displayedText is empty by having a non-breaking space with visibility hidden */}
            <span className="invisible" aria-hidden="true">&nbsp;</span>
          </p>
        </FadeInOnScroll>
        <FadeInOnScroll delay="delay-400">
          <Button asChild size="lg" className="gradient-button rounded-lg px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
            <Link href="/placeholder-cv.pdf" target="_blank" rel="noopener noreferrer" download="YourName_CV.pdf">
              <Download className="mr-2 h-5 w-5" />
              Download CV
            </Link>
          </Button>
        </FadeInOnScroll>
      </div>
    </section>
  );
}
