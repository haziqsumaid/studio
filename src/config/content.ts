
export const siteConfig = {
  name: "Haziq Sumaid", // Replace with your name
  tagline: "< Backend Developer />", // Initial tagline for hero
  taglineShort: "Node.js & DevOps Engineer",
  roles: [ // For hero typewriter effect
    "< Backend Developer />",
    "< DevOps Engineer />",
    "< Open-Source Contributor />",
  ],
  cvUrl: "/placeholder-cv.pdf", // Path to your CV in the /public folder
  description: "Personal portfolio of a Senior Node.js Backend Developer & DevOps Engineer, showcasing backend projects, skills, and expertise.",
  
  navLinks: [
    { id: 'home', href: '/', label: 'Home' },
    { id: 'about', href: '#about', label: 'About' },
    { id: 'skills', href: '#skills', label: 'Skills' },
    { id: 'projects', href: '#projects', label: 'Projects' },
    { id: 'contributions', href: '#contributions', label: 'Activity' },
    { id: 'contact', href: '#contact', label: 'Contact' },
  ],

  socialLinks: {
    github: "https://github.com/yourusername", // Replace with your GitHub URL
    linkedin: "https://linkedin.com/in/yourusername", // Replace with your LinkedIn URL
    twitter: "https://twitter.com/yourusername", // Replace with your Twitter URL
    twitterHandle: "@yourusername", // For Twitter card metadata
  },

  email: "your.email@example.com", // Your contact email

  hero: {
    cvButtonText: "Download CV",
  },

  about: {
    heading: "A Bit About My Journey",
    photoAlt: "Haziq Sumaid - Professional Portrait", // Replace Your Name
    timelineHeading: "My Professional Path",
    timelineDragHint: "Drag or scroll horizontally to explore the timeline.",
    milestones: [
      {
        id: "1",
        year: "2018",
        title: "Started My Tech Journey",
        description: "Dived into the world of backend development, focusing on Node.js and building foundational skills.",
        iconName: "Briefcase", // Corresponds to Lucide icon name
        details: "Explored various backend frameworks and database technologies. Contributed to small open-source projects to gain practical experience. Focused on API design principles and database management from early on."
      },
      {
        id: "2",
        year: "2020",
        title: "Joined eComInnovate",
        description: "Contributed to developing scalable APIs and microservices for cutting-edge e-commerce platforms.",
        iconName: "ShoppingBag",
        details: "Led the development of a new inventory management microservice. Optimized API performance, reducing latency by 30%. Integrated third-party payment gateways like Stripe and PayPal. Gained experience with message queues (Kafka/RabbitMQ)."
      },
      {
        id: "3",
        year: "2022",
        title: "Mastering DevOps & CI/CD",
        description: "Designed and implemented robust CI/CD pipelines using Docker, Kubernetes, and various automation tools.",
        iconName: "GitMerge",
        details: "Automated build, test, and deployment processes across multiple environments using GitHub Actions and Jenkins. Implemented infrastructure-as-code using Terraform for AWS. Improved system monitoring and alerting with Prometheus and Grafana."
      },
      {
        id: "4",
        year: "2023",
        title: "Scaling Database Architectures",
        description: "Focused on optimizing and scaling database solutions like MongoDB Atlas and PostgreSQL to handle high-traffic applications.",
        iconName: "Database",
        details: "Redesigned database schemas for improved query performance and scalability. Implemented sharding and replication strategies for MongoDB Atlas. Conducted performance tuning, load testing, and optimized complex SQL queries."
      },
      {
        id: "5",
        year: "Present",
        title: "Senior Backend Developer",
        description: "Leading backend architecture, mentoring junior developers, and driving innovation in Node.js & DevOps.",
        iconName: "Users",
        details: "Architecting new features and systems for enterprise-level applications. Providing technical guidance and mentorship to team members. Exploring emerging technologies like serverless, event-driven architectures, and AI/ML integration."
      },
    ]
  },

  skills: {
    heading: "My Tech Toolbox",
    // Add more skill-related text if needed, e.g., for chart titles or descriptions
  },

  projects: {
    heading: "Featured Projects",
    // Project data will be defined in ProjectsSection.tsx or a separate config if it grows large
  },

  contributions: {
    heading: "My GitHub Contributions",
    description: "A snapshot of my coding activity over the past year.",
    loadingText: "Loading contributions...",
    errorText: "Could not fetch GitHub contributions. Please try again later.",
    noContributionsText: "No contributions found in the last year.",
    viewProfileButton: "View GitHub Profile",
  },

  contact: {
    heading: "Get In Touch",
    formTitle: "Send a Message",
    nameLabel: "Full Name",
    namePlaceholder: "Your Name",
    emailLabel: "Email Address",
    emailPlaceholder: "your.email@example.com",
    messageLabel: "Your Message",
    messagePlaceholder: "Let's talk about...",
    submitButtonText: "Send Message",
    submittingText: "Sending...",
    successToastTitle: "Message Sent!",
    successToastDescription: "Thanks for reaching out. I'll get back to you soon.",
    errorToastTitle: "Uh oh! Something went wrong.",
    errorToastDescription: "There was a problem sending your message. Please try again.",
    connectTitle: "Connect With Me",
    connectDescription: "Feel free to reach out via email or connect with me on social media.",
  },
  
  footer: {
    copyrightText: `© ${new Date().getFullYear()} Haziq Sumaid. All rights reserved.`, // Replace Your Name
    madeWithText: "Built with Next.js, Tailwind CSS, and Framer Motion."
  }
};

    