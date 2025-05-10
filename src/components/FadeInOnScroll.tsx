"use client";

import { useRef, useEffect, useState, type ReactNode, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface FadeInOnScrollProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  delay?: string; // e.g., "delay-100", "delay-200"
  threshold?: number;
  className?: string;
}

export function FadeInOnScroll({ 
  children, 
  delay = "delay-0", 
  threshold = 0.1, 
  className, 
  ...props 
}: FadeInOnScrollProps) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold }
    );

    const currentElement = elementRef.current;
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [threshold]);

  return (
    <div
      ref={elementRef}
      className={cn(
        "transition-all duration-700 ease-out",
        delay,
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
