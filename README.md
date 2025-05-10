# Backend Brilliance Portfolio

This is a personal portfolio website for a Senior Node.js Backend Developer & DevOps Engineer, built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Hero Section**: Full-viewport header with gradient-clipped name, subtitle, and CV download.
- **About Me**: Professional photo, bio, skill highlights, and interactive journey timeline.
- **Skills Section**: Interactive radial display of technical skills with proficiency indicators and detailed chart views.
- **Project Showcase**: Grid of backend-focused projects with details and links.
- **GitHub Contributions**: Section to display GitHub activity (placeholder, requires API integration for real data).
- **Contact Form**: Simple form to send messages (posts to a mock API).
- **Responsive Design**: Adapts to all screen sizes, with a mobile-friendly navigation.
- **Dark Mode Theme**: Sleek and modern dark aesthetic with green gradient accents.

## Tech Stack

- **Front-end**: Next.js (App Router), React, TypeScript, Tailwind CSS
- **Styling**: ShadCN UI components, CSS variables for theming
- **Animation**: Framer Motion
- **Charts**: Recharts
- **Mock API**: Next.js API Routes for contact form

## Getting Started

### Prerequisites

- Node.js (v18 or later recommended)
- npm, yarn, or pnpm

### Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/backend-brilliance-portfolio.git
    cd backend-brilliance-portfolio
    ```

2.  **Install dependencies:**
    Choose your package manager:
    ```bash
    # Using npm
    npm install

    # Using yarn
    yarn install

    # Using pnpm
    pnpm install
    ```

3.  **Set up environment variables:**
    Create a `.env.local` file in the root of the project and add any necessary environment variables. For example:
    ```env
    # NEXT_PUBLIC_SITE_URL=http://localhost:3000 (for local dev)
    # NEXT_PUBLIC_SITE_URL=https://yourdomain.com (for production)
    NEXT_PUBLIC_GITHUB_USERNAME=yourgithubusername 
    ```
    Replace `yourgithubusername` with your actual GitHub username for the GitHub Contributions section link and placeholder.

4.  **Run the development server:**
    ```bash
    # Using npm
    npm run dev

    # Using yarn
    yarn dev

    # Using pnpm
    pnpm dev
    ```
    The application will be available at `http://localhost:9002` (or the port specified in your `package.json` scripts).

## Building for Production

```bash
# Using npm
npm run build

# Using yarn
yarn build

# Using pnpm
pnpm build
```

## Running in Production

```bash
# Using npm
npm start

# Using yarn
yarn start

# Using pnpm
pnpm start
```

## Docker

This project includes a `Dockerfile` and `docker-compose.yml` for containerization.

### Build Docker Image

```bash
docker build -t backend-brilliance-portfolio .
```

### Run with Docker Compose (for local development)

```bash
docker-compose up
```
This will build the image if it doesn't exist and start the container. The app will be accessible on `http://localhost:3000`.

## Linting and Type Checking

```bash
# Using npm
npm run lint
npm run typecheck

# Using yarn
yarn lint
yarn typecheck

# Using pnpm
pnpm lint
pnpm typecheck
```

## Customization

- **Content**: 
    - Update text ("Your Name", "yourusername", email), images, and project details in the respective components located in `src/components/sections/` and `src/components/Navbar.tsx`, `src/components/Footer.tsx`.
    - Skills data can be customized in `src/config/skills.ts`. Update skill names, proficiency levels, experience, icons, and descriptions.
- **CV**: Replace `public/placeholder-cv.pdf` with your actual CV.
- **Social Links**: Update links in `src/components/Footer.tsx` and `src/components/sections/ContactSection.tsx`.
- **GitHub Contributions**: 
    - The GitHub contributions section currently uses a placeholder image and links to the GitHub username defined in `NEXT_PUBLIC_GITHUB_USERNAME` (see `.env.local` setup).
    - To display your actual contributions dynamically (e.g., contribution graph, commits, merges), you'll need to:
        1. Securely fetch data from the GitHub API. This typically involves creating a Next.js API route that uses a GitHub Personal Access Token (PAT) with appropriate permissions. **Do not expose your PAT on the client-side.**
        2. Parse the API response and render the data. You might use a library like `octokit/rest.js` for GitHub API interaction.
        3. For a visual contribution graph, services like `https://ghchart.rshah.org/` can generate an image, or you can build a custom chart.
- **Domain & Metadata**:
    - Replace `https://yourdomain.com` in `public/sitemap.xml` and `src/app/layout.tsx` with your actual domain.
    - Update `YYYY-MM-DD` in `public/sitemap.xml` to the current date.
    - Update social media handles and image paths in `src/app/layout.tsx` for `openGraph` and `twitter` metadata.
- **Theme**: Colors and styles can be adjusted in `src/app/globals.css` and Tailwind configuration (`tailwind.config.ts`).

## Live Demo

(Link to live demo URL will be added here once deployed)

## Deployment

This project can be deployed to platforms like Vercel, Netlify, or any hosting provider that supports Node.js/Docker. A basic GitHub Actions workflow is provided in `.github/workflows/ci-cd.yml` for automated building and testing. You can extend this for deployment to your chosen platform.
```