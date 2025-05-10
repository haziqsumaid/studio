# Backend Brilliance Portfolio

This is a personal portfolio website for a Senior Node.js Backend Developer & DevOps Engineer, built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Hero Section**: Full-viewport header with gradient-clipped name, subtitle, and CV download.
- **About Me**: Professional photo, bio, and skills showcase.
- **Project Showcase**: Grid of backend-focused projects with details and links.
- **AI Email Suggestions**: A tool to help reword email messages using generative AI.
- **Contact Form**: Simple form to send messages (posts to a mock API).
- **Responsive Design**: Adapts to all screen sizes, with a mobile-friendly navigation.
- **Dark Mode Theme**: Sleek and modern dark aesthetic with green gradient accents.

## Tech Stack

- **Front-end**: Next.js (App Router), React, TypeScript, Tailwind CSS
- **Styling**: ShadCN UI components, CSS variables for theming
- **AI Integration**: Genkit for email rewording suggestions
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
    Create a `.env.local` file in the root of the project and add any necessary environment variables. For example, for the Genkit AI features to work, you might need Google AI API keys:
    ```env
    GOOGLE_API_KEY=your_google_api_key_here
    # NEXT_PUBLIC_SITE_URL=http://localhost:3000 (for local dev)
    # NEXT_PUBLIC_SITE_URL=https://yourdomain.com (for production)
    ```
    Refer to Genkit and Google AI documentation for more details on obtaining API keys.

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

### Genkit Development
To run the Genkit development server for AI flow testing (optional, if you are modifying AI flows):
```bash
npm run genkit:dev
# or
yarn genkit:dev
```
This typically runs on port 3400.

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

- **Content**: Update text, images, and project details in the respective components located in `src/components/sections/`.
- **CV**: Replace `public/placeholder-cv.pdf` with your actual CV.
- **Social Links**: Update links in `src/components/Footer.tsx` and `src/components/sections/ContactSection.tsx`.
- **Domain & Metadata**:
    - Replace `https://yourdomain.com` in `public/sitemap.xml` and `src/app/layout.tsx` with your actual domain.
    - Update `YYYY-MM-DD` in `public/sitemap.xml` to the current date.
    - Update social media handles and image paths in `src/app/layout.tsx` for `openGraph` and `twitter` metadata.
- **Theme**: Colors and styles can be adjusted in `src/app/globals.css` and Tailwind configuration (`tailwind.config.ts`).

## Live Demo

(Link to live demo URL will be added here once deployed)

## Deployment

This project can be deployed to platforms like Vercel, Netlify, or any hosting provider that supports Node.js/Docker. A basic GitHub Actions workflow is provided in `.github/workflows/ci-cd.yml` for automated building and testing. You can extend this for deployment to your chosen platform.
