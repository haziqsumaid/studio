import { HeroSection } from '@/components/sections/HeroSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { ProjectsSection } from '@/components/sections/ProjectsSection';
import { ContactSection } from '@/components/sections/ContactSection';
// import { GithubContributionsSection } from '@/components/sections/GithubContributionsSection'; // Temporarily removed

export default function Home() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <ProjectsSection />
      {/* <GithubContributionsSection /> */} {/* Temporarily removed */}
      <ContactSection />
    </>
  );
}