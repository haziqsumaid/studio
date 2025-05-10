import {
  Codepen,
  Github,
  Gitlab,
  Linkedin,
  Twitter,
  Terminal,
  Briefcase,
  Cloud,
  Database,
  DollarSign,
  GitMerge,
  Heart,
  Layers,
  LifeBuoy,
  Moon,
  Palette,
  Search,
  Settings,
  Share2,
  Shield,
  Sliders,
  Smartphone,
  Sparkles,
  Sun,
  ThumbsUp,
  ToggleLeft,
  TrendingUp,
  User,
  Users,
  Wifi,
  Zap,
  Cpu,
  Server,
  Container,
  Gauge,
  Wrench,
  type LucideProps,
} from 'lucide-react';
import type { ForwardRefExoticComponent, RefAttributes } from 'react';

// Helper type for Lucide icons
type IconComponent = ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;


export interface Skill {
  id: string;
  name: string;
  icon: IconComponent;
  proficiency: number; // 0-100
  experience: string; // e.g., "3+ Years"
  category: SkillCategoryName;
  relatedSkills?: string[]; // IDs of related skills for constellation lines
  description?: string;
}

export interface SkillCategory {
  name: SkillCategoryName;
  icon: IconComponent;
  description: string;
}

export type SkillCategoryName = "Backend Development" | "DevOps & Cloud" | "Databases" | "Tools & Technologies" | "Frontend Familiarity";

export const skillCategories: SkillCategory[] = [
  { 
    name: "Backend Development", 
    icon: Server,
    description: "Expertise in building robust and scalable server-side applications."
  },
  { 
    name: "DevOps & Cloud", 
    icon: Cloud,
    description: "Proficient in automating infrastructure, CI/CD pipelines, and cloud deployments."
  },
  { 
    name: "Databases",
    icon: Database,
    description: "Skilled in designing, managing, and optimizing various database systems."
  },
  { 
    name: "Tools & Technologies", 
    icon: Wrench,
    description: "Adept with a wide range of development tools, version control systems, and more."
  },
  {
    name: "Frontend Familiarity",
    icon: Palette,
    description: "Comfortable working with frontend technologies to build cohesive full-stack solutions."
  }
];

export const skillsData: Skill[] = [
  // Backend Development
  {
    id: 'nodejs',
    name: 'Node.js',
    icon: Codepen, // Using Codepen as a generic "code" icon; consider a Node.js specific SVG if available/needed
    proficiency: 95,
    experience: '6+ Years',
    category: 'Backend Development',
    description: 'Extensive experience in building high-performance, scalable backend services and APIs using Node.js and its ecosystem.',
    relatedSkills: ['typescript', 'express', 'nestjs']
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    icon: Sparkles, // Placeholder - no direct Lucide icon for TS
    proficiency: 90,
    experience: '5+ Years',
    category: 'Backend Development',
    description: 'Utilizing TypeScript for robust, type-safe JavaScript development, enhancing code quality and maintainability.',
     relatedSkills: ['nodejs', 'nestjs', 'react']
  },
  {
    id: 'express',
    name: 'Express.js',
    icon: Layers,
    proficiency: 90,
    experience: '5+ Years',
    category: 'Backend Development',
    description: 'Proficient in creating RESTful APIs and web applications using the Express.js framework.',
    relatedSkills: ['nodejs']
  },
  {
    id: 'nestjs',
    name: 'NestJS',
    icon: Briefcase, // Placeholder
    proficiency: 80,
    experience: '3+ Years',
    category: 'Backend Development',
    description: 'Building efficient, scalable, and maintainable server-side applications with NestJS, leveraging its modular architecture.',
    relatedSkills: ['nodejs', 'typescript']
  },
  {
    id: 'api-design',
    name: 'API Design',
    icon: Share2,
    proficiency: 92,
    experience: '6+ Years',
    category: 'Backend Development',
    description: 'Designing and implementing RESTful and GraphQL APIs with a focus on security, performance, and developer experience.',
    relatedSkills: ['nodejs', 'express', 'graphql']
  },
  {
    id: 'graphql',
    name: 'GraphQL',
    icon: GitMerge, // Placeholder
    proficiency: 75,
    experience: '2+ Years',
    category: 'Backend Development',
    description: 'Developing efficient data-fetching APIs using GraphQL, enabling clients to request exactly what they need.',
    relatedSkills: ['api-design', 'nodejs']
  },

  // DevOps & Cloud
  {
    id: 'docker',
    name: 'Docker',
    icon: Container,
    proficiency: 90,
    experience: '5+ Years',
    category: 'DevOps & Cloud',
    description: 'Containerizing applications with Docker for consistent development, testing, and production environments.',
    relatedSkills: ['kubernetes', 'ci-cd', 'aws']
  },
  {
    id: 'kubernetes',
    name: 'Kubernetes (K8s)',
    icon: Settings, // Placeholder, K8s logo is specific
    proficiency: 80,
    experience: '4+ Years',
    category: 'DevOps & Cloud',
    description: 'Orchestrating containerized applications at scale using Kubernetes, managing deployments, and ensuring high availability.',
    relatedSkills: ['docker', 'aws-eks', 'ci-cd']
  },
  {
    id: 'aws',
    name: 'AWS',
    icon: Cloud,
    proficiency: 88,
    experience: '5+ Years',
    category: 'DevOps & Cloud',
    description: 'Leveraging a wide range of AWS services (EC2, S3, RDS, Lambda, EKS, API Gateway) for building and deploying cloud solutions.',
    relatedSkills: ['docker', 'kubernetes', 'ci-cd', 'terraform']
  },
  {
    id: 'ci-cd',
    name: 'CI/CD Pipelines',
    icon: GitMerge,
    proficiency: 92,
    experience: '5+ Years',
    category: 'DevOps & Cloud',
    description: 'Designing and implementing automated CI/CD pipelines using tools like GitHub Actions, Jenkins, and GitLab CI.',
    relatedSkills: ['docker', 'kubernetes', 'aws', 'github']
  },
  {
    id: 'terraform',
    name: 'Terraform',
    icon: Layers, // Placeholder
    proficiency: 85,
    experience: '3+ Years',
    category: 'DevOps & Cloud',
    description: 'Managing infrastructure as code (IaC) using Terraform for reproducible and version-controlled cloud environments.',
    relatedSkills: ['aws', 'kubernetes']
  },
   {
    id: 'aws-eks',
    name: 'AWS EKS',
    icon: Settings, 
    proficiency: 78,
    experience: '3+ Years',
    category: 'DevOps & Cloud',
    description: 'Deploying, managing, and scaling containerized applications using Amazon Elastic Kubernetes Service.',
    relatedSkills: ['kubernetes', 'aws', 'docker']
  },


  // Databases
  {
    id: 'mongodb',
    name: 'MongoDB',
    icon: Database,
    proficiency: 90,
    experience: '5+ Years',
    category: 'Databases',
    description: 'Working with MongoDB for NoSQL data storage, including schema design, indexing, and performance optimization.',
  },
  {
    id: 'postgresql',
    name: 'PostgreSQL',
    icon: Database,
    proficiency: 85,
    experience: '4+ Years',
    category: 'Databases',
    description: 'Utilizing PostgreSQL for relational database needs, including complex queries, transactions, and data integrity.',
  },
  {
    id: 'redis',
    name: 'Redis',
    icon: Zap, // Represents speed/caching
    proficiency: 80,
    experience: '4+ Years',
    category: 'Databases',
    description: 'Implementing Redis for caching, session management, and real-time data processing.',
  },

  // Tools & Technologies
  {
    id: 'git',
    name: 'Git',
    icon: Github,
    proficiency: 98,
    experience: '7+ Years',
    category: 'Tools & Technologies',
    description: 'Expert in version control using Git, including branching strategies, merging, and collaboration workflows.',
  },
  {
    id: 'linux',
    name: 'Linux/Unix',
    icon: Terminal,
    proficiency: 90,
    experience: '7+ Years',
    category: 'Tools & Technologies',
    description: 'Proficient in Linux/Unix environments, shell scripting, and system administration tasks.',
  },
  {
    id: 'nginx',
    name: 'Nginx',
    icon: Server, 
    proficiency: 82,
    experience: '4+ Years',
    category: 'Tools & Technologies',
    description: 'Configuring and managing Nginx as a reverse proxy, load balancer, and web server.',
  },
  
  // Frontend Familiarity
  {
    id: 'react',
    name: 'React.js',
    icon: Sparkles, // Placeholder
    proficiency: 70,
    experience: '3+ Years',
    category: 'Frontend Familiarity',
    description: 'Familiar with building user interfaces using React.js, enabling effective collaboration with frontend teams.',
    relatedSkills: ['typescript']
  },
  {
    id: 'tailwind',
    name: 'Tailwind CSS',
    icon: Palette,
    proficiency: 65,
    experience: '2+ Years',
    category: 'Frontend Familiarity',
    description: 'Comfortable styling applications with Tailwind CSS for rapid UI development.',
  }
];

export const centralNode = {
  id: 'core-skills',
  name: 'Core Skills',
  icon: Cpu,
};

// Define relationships for constellation lines (desktop only)
// This is a simplified representation; actual line drawing would need coordinates.
export const skillRelationships: { [key: string]: string[] } = {
  'nodejs': ['typescript', 'express', 'nestjs', 'api-design', 'graphql', 'docker'],
  'docker': ['kubernetes', 'aws', 'ci-cd', 'nodejs'],
  'aws': ['docker', 'kubernetes', 'ci-cd', 'terraform', 'aws-eks', 'mongodb', 'postgresql'],
  'ci-cd': ['docker', 'kubernetes', 'aws', 'github', 'terraform'],
  'kubernetes': ['docker', 'aws', 'aws-eks', 'terraform'],
};
