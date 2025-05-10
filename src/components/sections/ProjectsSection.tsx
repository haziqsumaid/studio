import { Section } from '@/components/Section';
import { ProjectCard, type Project } from '@/components/ProjectCard';

const projectsData: Project[] = [
  {
    id: '1',
    title: 'Scalable E-commerce API',
    description: 'Designed and implemented a high-performance RESTful API for an e-commerce platform, focusing on microservices architecture, efficient database querying, and secure payment gateway integration.',
    imageUrl: 'https://picsum.photos/seed/project1/600/400',
    imageHint: 'API development',
    tech: ['Node.js', 'Express.js', 'MongoDB', 'Docker', 'Stripe API', 'JWT'],
    githubUrl: 'https://github.com/yourusername/ecommerce-api',
    liveDemoUrl: '#', // Replace with actual demo URL if available
  },
  {
    id: '2',
    title: 'Real-time Search Indexing Service',
    description: 'Developed a robust search indexing service using Elasticsearch, enabling lightning-fast full-text search capabilities across millions of documents. Implemented data synchronization pipelines.',
    imageUrl: 'https://picsum.photos/seed/project2/600/400',
    imageHint: 'search indexing',
    tech: ['Elasticsearch', 'Node.js', 'Kafka', 'Redis', 'TypeScript'],
    githubUrl: 'https://github.com/yourusername/search-service',
  },
  {
    id: '3',
    title: 'Automated CI/CD Pipeline for Microservices',
    description: 'Engineered a comprehensive CI/CD pipeline for a suite of microservices using GitHub Actions, Docker, and Kubernetes. Automated testing, building, and deployment, significantly reducing release times.',
    imageUrl: 'https://picsum.photos/seed/project3/600/400',
    imageHint: 'DevOps pipeline',
    tech: ['GitHub Actions', 'Docker', 'Kubernetes', 'AWS EKS', 'Terraform'],
    githubUrl: 'https://github.com/yourusername/cicd-pipeline-config',
  },
    {
    id: '4',
    title: 'Serverless Data Processing Workflow',
    description: 'Built a serverless data processing workflow on AWS Lambda and Step Functions for ETL tasks. Optimized for cost-efficiency and scalability, handling large volumes of incoming data streams.',
    imageUrl: 'https://picsum.photos/seed/project4/600/400',
    imageHint: 'serverless architecture',
    tech: ['AWS Lambda', 'Step Functions', 'API Gateway', 'DynamoDB', 'Serverless Framework'],
    githubUrl: 'https://github.com/yourusername/serverless-etl',
    liveDemoUrl: '#',
  },
];

export function ProjectsSection() {
  return (
    <Section id="projects" title="Featured Projects">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projectsData.map((project, index) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </Section>
  );
}
