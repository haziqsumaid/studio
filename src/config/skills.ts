
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
  Package,
  Brain,
  Scaling,
  LayoutPanelLeft,
} from 'lucide-react';
import type { ForwardRefExoticComponent, RefAttributes } from 'react';

// Helper type for Lucide icons
export type IconComponent = ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;


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
  icon: IconComponent; // Icon for the category itself (e.g., for accordion headers)
  description: string;
}

export type SkillCategoryName = 
  | "Backend Development" 
  | "DevOps & Cloud" 
  | "Databases" 
  | "Tools & Technologies" 
  | "Frontend Familiarity"
  | "AI/ML Engineering";

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
    icon: LayoutPanelLeft,
    description: "Comfortable working with frontend technologies to build cohesive full-stack solutions."
  },
  {
    name: "AI/ML Engineering",
    icon: Brain,
    description: "Experience in developing and deploying AI/ML models and solutions."
  }
];

export const skillsData: Skill[] = [
  // Backend Development
  {
    id: 'nodejs',
    name: 'Node.js',
    icon: Package, 
    proficiency: 95,
    experience: '6+ Years',
    category: 'Backend Development',
    description: 'Extensive experience in building high-performance, scalable backend services and APIs using Node.js and its ecosystem.',
    relatedSkills: ['typescript', 'express', 'nestjs']
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    icon: Codepen, // Using Codepen as it often features TS snippets. Could be generic 'code' icon too.
    proficiency: 90,
    experience: '5+ Years',
    category: 'Backend Development',
    description: 'Utilizing TypeScript for robust, type-safe JavaScript development, enhancing code quality and maintainability.',
     relatedSkills: ['nodejs', 'nestjs', 'react']
  },
  {
    id: 'express',
    name: 'Express.js',
    icon: Layers, // Represents middleware layers
    proficiency: 90,
    experience: '5+ Years',
    category: 'Backend Development',
    description: 'Proficient in creating RESTful APIs and web applications using the Express.js framework.',
    relatedSkills: ['nodejs']
  },
  {
    id: 'nestjs',
    name: 'NestJS',
    icon: Briefcase, // Often associated with professional/structured frameworks
    proficiency: 80,
    experience: '3+ Years',
    category: 'Backend Development',
    description: 'Building efficient, scalable, and maintainable server-side applications with NestJS, leveraging its modular architecture.',
    relatedSkills: ['nodejs', 'typescript']
  },
  {
    id: 'api-design',
    name: 'API Design (REST & GraphQL)',
    icon: Share2, // Represents connections/interfaces
    proficiency: 92,
    experience: '6+ Years',
    category: 'Backend Development',
    description: 'Designing and implementing RESTful and GraphQL APIs with a focus on security, performance, and developer experience.',
    relatedSkills: ['nodejs', 'express', 'graphql']
  },
  {
    id: 'graphql',
    name: 'GraphQL',
    icon: GitMerge, // Placeholder, represents structured queries merging data
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
    icon: Settings, // Represents complex orchestration/configuration
    proficiency: 80,
    experience: '4+ Years',
    category: 'DevOps & Cloud',
    description: 'Orchestrating containerized applications at scale using Kubernetes, managing deployments, and ensuring high availability.',
    relatedSkills: ['docker', 'aws-eks', 'ci-cd']
  },
  {
    id: 'aws',
    name: 'AWS',
    icon: Cloud, // Direct representation
    proficiency: 88,
    experience: '5+ Years',
    category: 'DevOps & Cloud',
    description: 'Leveraging a wide range of AWS services (EC2, S3, RDS, Lambda, EKS, API Gateway) for building and deploying cloud solutions.',
    relatedSkills: ['docker', 'kubernetes', 'ci-cd', 'terraform']
  },
  {
    id: 'ci-cd',
    name: 'CI/CD Pipelines',
    icon: GitMerge, // Represents merging and flowing code
    proficiency: 92,
    experience: '5+ Years',
    category: 'DevOps & Cloud',
    description: 'Designing and implementing automated CI/CD pipelines using tools like GitHub Actions, Jenkins, and GitLab CI.',
    relatedSkills: ['docker', 'kubernetes', 'aws', 'github']
  },
  {
    id: 'terraform',
    name: 'Terraform',
    icon: Layers, // Represents infrastructure layers
    proficiency: 85,
    experience: '3+ Years',
    category: 'DevOps & Cloud',
    description: 'Managing infrastructure as code (IaC) using Terraform for reproducible and version-controlled cloud environments.',
    relatedSkills: ['aws', 'kubernetes']
  },
   {
    id: 'aws-eks',
    name: 'AWS EKS',
    icon: Scaling, // Represents scaling Kubernetes clusters
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
    icon: Database, // Could use a variant if desired, but Database is generic enough
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
    icon: Github, // Direct representation
    proficiency: 98,
    experience: '7+ Years',
    category: 'Tools & Technologies',
    description: 'Expert in version control using Git, including branching strategies, merging, and collaboration workflows.',
  },
  {
    id: 'linux',
    name: 'Linux/Unix',
    icon: Terminal, // Represents command-line interface
    proficiency: 90,
    experience: '7+ Years',
    category: 'Tools & Technologies',
    description: 'Proficient in Linux/Unix environments, shell scripting, and system administration tasks.',
  },
  {
    id: 'nginx',
    name: 'Nginx',
    icon: Server, // Represents server software
    proficiency: 82,
    experience: '4+ Years',
    category: 'Tools & Technologies',
    description: 'Configuring and managing Nginx as a reverse proxy, load balancer, and web server.',
  },

  // Frontend Familiarity
  {
    id: 'react',
    name: 'React.js',
    icon: Sparkles, // Represents modern UI/dynamic components
    proficiency: 70,
    experience: '3+ Years',
    category: 'Frontend Familiarity',
    description: 'Familiar with building user interfaces using React.js, enabling effective collaboration with frontend teams.',
    relatedSkills: ['typescript']
  },
  {
    id: 'tailwind',
    name: 'Tailwind CSS',
    icon: Palette, // Represents styling/design
    proficiency: 65,
    experience: '2+ Years',
    category: 'Frontend Familiarity',
    description: 'Comfortable styling applications with Tailwind CSS for rapid UI development.',
  },
  // AI/ML Engineering
  {
    id: 'python',
    name: 'Python',
    icon: Codepen, // General coding icon, Python logo is specific
    proficiency: 85,
    experience: '4+ Years',
    category: 'AI/ML Engineering',
    description: 'Developing ML models and data processing scripts using Python and its rich ecosystem (NumPy, Pandas, Scikit-learn).',
    relatedSkills: ['scikit-learn', 'tensorflow', 'pytorch']
  },
  {
    id: 'tensorflow',
    name: 'TensorFlow',
    icon: Brain, // Represents neural networks/deep learning
    proficiency: 70,
    experience: '2+ Years',
    category: 'AI/ML Engineering',
    description: 'Building and training deep learning models with TensorFlow for various AI applications.',
    relatedSkills: ['python', 'keras']
  },
  {
    id: 'pytorch',
    name: 'PyTorch',
    icon: Cpu, // Often used for GPU accelerated tasks in ML
    proficiency: 75,
    experience: '2+ Years',
    category: 'AI/ML Engineering',
    description: 'Experience with PyTorch for flexible research and development of deep learning models.',
    relatedSkills: ['python']
  },
  {
    id: 'scikit-learn',
    name: 'Scikit-learn',
    icon: Gauge, // Represents model evaluation/metrics
    proficiency: 80,
    experience: '3+ Years',
    category: 'AI/ML Engineering',
    description: 'Utilizing Scikit-learn for classical machine learning tasks, model selection, and preprocessing.',
    relatedSkills: ['python']
  },
];

// Define relationships for constellation lines (desktop only)
// This is a simplified representation; actual line drawing would need coordinates.
export const skillRelationships: { [key: string]: string[] } = {
  'nodejs': ['typescript', 'express', 'nestjs', 'api-design', 'graphql', 'docker', 'mongodb', 'postgresql'],
  'docker': ['kubernetes', 'aws', 'ci-cd', 'nodejs', 'python'],
  'aws': ['docker', 'kubernetes', 'ci-cd', 'terraform', 'aws-eks', 'mongodb', 'postgresql', 'sagemaker'],
  'ci-cd': ['docker', 'kubernetes', 'aws', 'github', 'terraform', 'linux'],
  'kubernetes': ['docker', 'aws', 'aws-eks', 'terraform', 'ci-cd'],
  'python': ['scikit-learn', 'tensorflow', 'pytorch', 'docker'],
  'typescript': ['nodejs', 'nestjs', 'react'],
  'tensorflow': ['python', 'keras'], // Assuming Keras might be another skill or implied
  'pytorch': ['python'],
  'scikit-learn': ['python'],
  'git': ['github', 'ci-cd'], // GitHub is a platform using Git
  'mongodb': ['nodejs', 'aws'],
  'postgresql': ['nodejs', 'aws'],
  'react': ['typescript', 'tailwind'],
};
