import { cn } from '@/lib/utils';
import { FadeInOnScroll } from './FadeInOnScroll';

interface SectionProps {
  id: string;
  className?: string;
  children: React.ReactNode;
  title?: string;
  titleClassName?: string;
  fadeIn?: boolean;
  delay?: string;
}

export function Section({ id, className, children, title, titleClassName, fadeIn = true, delay }: SectionProps) {
  const content = (
    <section id={id} className={cn("py-16 md:py-24", className)}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {title && (
          <h2 className={cn("text-3xl md:text-4xl font-bold mb-12 text-center gradient-text", titleClassName)}>
            {title}
          </h2>
        )}
        {children}
      </div>
    </section>
  );

  if (fadeIn) {
    return <FadeInOnScroll delay={delay}>{content}</FadeInOnScroll>;
  }

  return content;
}
