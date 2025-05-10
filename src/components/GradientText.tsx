import { cn } from '@/lib/utils';
import type { HTMLAttributes } from 'react';

interface GradientTextProps extends HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
}

export function GradientText({ children, className, ...props }: GradientTextProps) {
  return (
    <span className={cn('gradient-text', className)} {...props}>
      {children}
    </span>
  );
}
