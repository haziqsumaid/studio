"use client";

import { Section } from '@/components/Section';
import { DynamicPhoto } from '@/components/sections/about/DynamicPhoto';
import { JourneyTimeline, type Milestone } from '@/components/sections/about/JourneyTimeline';
import { SkillUniverse, type Skill } from '@/components/sections/about/SkillUniverse';
import { Briefcase, GitMerge, Users, Type, Container, Cloud, Cpu, Database, ShoppingBag, Code, Zap, Brain } from 'lucide-react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const DatabaseIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
);

const ApiIcon = (props: React.SVGProps<SVGSVGElement>) => (
 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 2a10 10 0 1 0 10 10H12V2Z"/>
    <path d="M12 12a10 10 0 0 0 10-10Z"/>
  </svg>
);


const skillsData: Skill[] = [
  { id: 'ts', name: 'TypeScript', icon: <Type size={24} />, proficiency: 90, yearsOfExperience: "5+ Years" },
  { id: 'nodejs', name: 'Node.js', icon: <Zap size={24} />, proficiency: 95, yearsOfExperience: "6+ Years" },
  { id: 'express', name: 'Express.js', icon: <Code size={24} />, proficiency: 90, yearsOfExperience: "6+ Years" },
  { id: 'docker', name: 'Docker', icon: <Container size={24} />, proficiency: 85, yearsOfExperience: "4+ Years" },
  { id: 'cicd', name: 'CI/CD', icon: <GitMerge size={24} />, proficiency: 80, yearsOfExperience: "4+ Years" },
  { id: 'aws', name: 'AWS', icon: <Cloud size={24} />, proficiency: 75, yearsOfExperience: "3+ Years" },
  { id: 'devops', name: 'DevOps', icon: <Cpu size={24} />, proficiency: 80, yearsOfExperience: "5+ Years" },
  { id: 'api', name: 'API Design', icon: <ApiIcon size={24} />, proficiency: 95, yearsOfExperience: "6+ Years" },
  { id: 'mongodb', name: 'MongoDB', icon: <DatabaseIcon size={24} />, proficiency: 85, yearsOfExperience: "5+ Years" },
  { id: 'genai', name: 'Generative AI', icon: <Brain size={24} />, proficiency: 70, yearsOfExperience: "1+ Year" },
];

const journeyMilestones: Milestone[] = [
  {
    id: "1",
    year: "2018",
    title: "Started My Tech Journey",
    description: "Dived into the world of backend development, focusing on Node.js and building foundational skills.",
    icon: <Briefcase size={28} className="text-primary" />,
  },
  {
    id: "2",
    year: "2020",
    title: "Joined eComInnovate",
    description: "Contributed to developing scalable APIs and microservices for cutting-edge e-commerce platforms.",
    icon: <ShoppingBag size={28} className="text-primary" />,
  },
  {
    id: "3",
    year: "2022",
    title: "Mastering DevOps & CI/CD",
    description: "Designed and implemented robust CI/CD pipelines using Docker, Kubernetes, and various automation tools.",
    icon: <GitMerge size={28} className="text-primary" />,
  },
  {
    id: "4",
    year: "2023",
    title: "Scaling Database Architectures",
    description: "Focused on optimizing and scaling database solutions like MongoDB Atlas to handle high-traffic applications.",
    icon: <DatabaseIcon size={28} className="text-primary" />,
  },
   {
    id: "5",
    year: "Present",
    title: "Senior Backend Developer",
    description: "Leading backend architecture, mentoring junior developers, and driving innovation in Node.js & DevOps.",
    icon: <Users size={28} className="text-primary" />,
  },
];

const sectionVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: (direction: 'left' | 'right' | 'bottom' | 'top' = 'bottom') => ({
    opacity: 0,
    x: direction === 'left' ? -50 : direction === 'right' ? 50 : 0,
    y: direction === 'bottom' ? 50 : direction === 'top' ? -50 : 0,
  }),
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: { type: 'spring', stiffness: 60, damping: 15 },
  },
};

export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const reducedMotion = useReducedMotion();

  const rotateX = useTransform(scrollYProgress, [0, 1], reducedMotion ? 0 : [5, -5]);

  return (
    <Section id="about" ref={sectionRef} className="overflow-hidden">
      <motion.div
        style={{ perspective: '1000px' }} 
      >
        <motion.div
          style={{ rotateX: reducedMotion ? 0 : rotateX }} 
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }} 
          className="bg-card/30 backdrop-blur-lg p-6 md:p-10 rounded-xl shadow-2xl border border-border/20"
        >
          <motion.h2
            variants={itemVariants}
            custom="top" 
            className="text-3xl md:text-4xl font-bold mb-12 text-center gradient-text"
          >
            A Bit About My Journey
          </motion.h2>

          <div className="grid md:grid-cols-12 gap-8 md:gap-12 items-start mb-16">
            <motion.div
              variants={itemVariants}
              custom="left" 
              className="md:col-span-4 flex justify-center items-center"
            >
              <DynamicPhoto
                src="https://picsum.photos/id/1005/400/400" 
                alt="Your Name - Professional Portrait"
              />
            </motion.div>
            <motion.div
              variants={itemVariants}
              custom="right" 
              className="md:col-span-8"
            >
              <JourneyTimeline milestones={journeyMilestones} />
            </motion.div>
          </div>

          <motion.div variants={itemVariants} custom="bottom"> 
            <SkillUniverse skills={skillsData} />
          </motion.div>
        </motion.div>
      </motion.div>
    </Section>
  );
}