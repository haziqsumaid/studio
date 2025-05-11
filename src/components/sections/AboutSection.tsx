"use client";

import React, { useRef } from 'react'; // Added React import
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { Section } from '@/components/Section';
import { DynamicPhoto } from '@/components/sections/about/DynamicPhoto';
import { JourneyTimeline, type Milestone } from '@/components/sections/about/JourneyTimeline';
import { ScrollProgressBar } from './about/ScrollProgressBar'; // New import
import { Briefcase, GitMerge, Users, Database as DatabaseLucide, ShoppingBag } from 'lucide-react';

const journeyMilestones: Milestone[] = [
  {
    id: "1",
    year: "2018",
    title: "Started My Tech Journey",
    description: "Dived into the world of backend development, focusing on Node.js and building foundational skills.",
    icon: <Briefcase className="text-primary" />,
    details: "Explored various backend frameworks and database technologies. Contributed to small open-source projects to gain practical experience."
  },
  {
    id: "2",
    year: "2020",
    title: "Joined eComInnovate",
    description: "Contributed to developing scalable APIs and microservices for cutting-edge e-commerce platforms.",
    icon: <ShoppingBag className="text-primary" />,
    details: "Led the development of a new inventory management microservice. Optimized API performance, reducing latency by 30%. Integrated third-party payment gateways."
  },
  {
    id: "3",
    year: "2022",
    title: "Mastering DevOps & CI/CD",
    description: "Designed and implemented robust CI/CD pipelines using Docker, Kubernetes, and various automation tools.",
    icon: <GitMerge className="text-primary" />,
    details: "Automated build, test, and deployment processes across multiple environments. Implemented infrastructure-as-code using Terraform. Improved system monitoring and alerting."
  },
  {
    id: "4",
    year: "2023",
    title: "Scaling Database Architectures",
    description: "Focused on optimizing and scaling database solutions like MongoDB Atlas to handle high-traffic applications.",
    icon: <DatabaseLucide className="text-primary" />,
    details: "Redesigned database schemas for improved query performance. Implemented sharding and replication strategies for MongoDB. Conducted performance tuning and load testing."
  },
   {
    id: "5",
    year: "Present",
    title: "Senior Backend Developer",
    description: "Leading backend architecture, mentoring junior developers, and driving innovation in Node.js & DevOps.",
    icon: <Users className="text-primary" />,
    details: "Architecting new features and systems. Providing technical guidance and mentorship to team members. Exploring emerging technologies and best practices."
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
    x: direction === 'left' ? -30 : direction === 'right' ? 30 : 0,
    y: direction === 'bottom' ? 30 : direction === 'top' ? -30 : 0,
  }),
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: { type: 'spring', stiffness: 60, damping: 15 },
  },
};

export function AboutSection() {
  const sectionWrapperRef = useRef<HTMLDivElement>(null); // Ref for the entire About section wrapper
  const { scrollYProgress } = useScroll({
    target: sectionWrapperRef, // Use the wrapper ref for scroll progress tracking
    offset: ["start start", "end end"], 
  });
  const reducedMotion = useReducedMotion();

  const rotateX = useTransform(scrollYProgress, [0, 1], reducedMotion ? [0, 0] : [3, -3]);

  return (
    <div ref={sectionWrapperRef} className="relative"> {/* Wrapper for ScrollProgressBar context */}
      <ScrollProgressBar scrollYProgress={scrollYProgress} />
      <Section id="about" className="overflow-hidden"> {/* Section component for padding and container */}
        <motion.div
          style={{ perspective: '1200px' }}
        >
          <motion.div
            style={{ rotateX: reducedMotion ? 0 : rotateX }}
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.05 }}
            className="bg-card/30 backdrop-blur-lg p-4 sm:p-6 md:p-10 rounded-xl shadow-2xl border border-border/20"
          >
            <motion.h2
              variants={itemVariants}
              custom="top"
              className="text-3xl md:text-4xl font-bold mb-8 sm:mb-10 md:mb-12 text-center gradient-text"
            >
              A Bit About My Journey
            </motion.h2>

            {/* Grid layout for desktop, stacked for mobile */}
            <div className="flex flex-col md:grid md:grid-cols-12 gap-8 md:gap-10 lg:gap-12 items-start mb-12 md:mb-16">
              <motion.div
                variants={itemVariants}
                custom={reducedMotion ? "bottom" : "left"}
                className="w-full md:col-span-4 flex justify-center items-center" // Full width on mobile for centering
              >
                <DynamicPhoto
                  src="https://picsum.photos/id/1005/400/400"
                  alt="Your Name - Professional Portrait"
                />
              </motion.div>
              <motion.div
                variants={itemVariants}
                custom={reducedMotion ? "bottom" : "right"}
                className="w-full md:col-span-8" // Full width on mobile
              >
                <JourneyTimeline milestones={journeyMilestones} />
              </motion.div>
            </div>

            {/* SkillUniverse removed, will be replaced by TechSkillsSection */}
          </motion.div>
        </motion.div>
      </Section>
    </div>
  );
}
