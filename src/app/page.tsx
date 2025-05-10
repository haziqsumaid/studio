import { HeroSection } from '@/components/sections/HeroSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { ProjectsSection } from '@/components/sections/ProjectsSection';
import { ContactSection } from '@/components/sections/ContactSection';
import { AiSuggestionsSection } from '@/components/sections/AiSuggestionsSection';

export default function Home() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <ProjectsSection />
      <AiSuggestionsSection />
      <ContactSection />
    </>
  );
}
