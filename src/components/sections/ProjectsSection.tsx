
"use client";

import { Section } from '@/components/Section';
import { ProjectRow, type Project } from '@/components/sections/projects/ProjectRow';
import { motion, useReducedMotion } from 'framer-motion';

const projectsData: Project[] = [
  {
    id: '1',
    title: 'Scalable E-commerce API',
    description: 'Designed and implemented a high-performance RESTful API for an e-commerce platform, focusing on microservices architecture, efficient database querying, and secure payment gateway integration.',
    imageUrl: 'https://picsum.photos/seed/projectApi/600/400',
    imageHint: 'API development',
    tech: ['Node.js', 'Express.js', 'MongoDB', 'Docker', 'Stripe API', 'JWT'],
    githubUrl: 'https://github.com/yourusername/ecommerce-api',
    liveDemoUrl: '#', 
  },
  {
    id: '2',
    title: 'Real-time Search Indexing Service',
    description: 'Developed a robust search indexing service using Elasticsearch, enabling lightning-fast full-text search capabilities across millions of documents. Implemented data synchronization pipelines.',
    imageUrl: 'https://picsum.photos/seed/projectSearch/600/400',
    imageHint: 'search indexing',
    tech: ['Elasticsearch', 'Node.js', 'Kafka', 'Redis', 'TypeScript'],
    githubUrl: 'https://github.com/yourusername/search-service',
  },
  {
    id: '3',
    title: 'Automated CI/CD Pipeline for Microservices',
    description: 'Engineered a comprehensive CI/CD pipeline for a suite of microservices using GitHub Actions, Docker, and Kubernetes. Automated testing, building, and deployment, significantly reducing release times.',
    imageUrl: 'https://picsum.photos/seed/projectCICD/600/400',
    imageHint: 'DevOps pipeline',
    tech: ['GitHub Actions', 'Docker', 'Kubernetes', 'AWS EKS', 'Terraform'],
    githubUrl: 'https://github.com/yourusername/cicd-pipeline-config',
  },
    {
    id: '4',
    title: 'Serverless Data Processing Workflow',
    description: 'Built a serverless data processing workflow on AWS Lambda and Step Functions for ETL tasks. Optimized for cost-efficiency and scalability, handling large volumes of incoming data streams.',
    imageUrl: 'https://picsum.photos/seed/projectServerless/600/400',
    imageHint: 'serverless architecture',
    tech: ['AWS Lambda', 'Step Functions', 'API Gateway', 'DynamoDB', 'Serverless Framework'],
    githubUrl: 'https://github.com/yourusername/serverless-etl',
    liveDemoUrl: '#',
  },
];

export function ProjectsSection() {
  const isReduced = useReducedMotion();

  return (
    <Section id="projects" aria-labelledby="projects-heading" className="py-16 md:py-24" fadeIn={false}>
      <motion.h2 
        id="projects-heading" 
        className="text-3xl md:text-4xl font-bold mb-12 md:mb-16 text-center gradient-text"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        Featured Projects
      </motion.h2>
      <div className="flex flex-col space-y-16 md:space-y-24">
        {projectsData.map((project, index) => (
          <ProjectRow key={project.id} project={project} index={index} />
        ))}
      </div>
    </Section>
  );
}
