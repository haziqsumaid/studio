# Backend Brilliance Portfolio

This is a personal portfolio website for a Senior Node.js Backend Developer & DevOps Engineer, built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Hero Section**: Full-viewport header with gradient-clipped name, subtitle, and CV download.
- **About Me**: Professional photo, bio, skill highlights, and interactive journey timeline.
- **Skills Section**: Interactive radial display of technical skills with proficiency indicators and detailed chart views.
- **Project Showcase**: Grid of backend-focused projects with details and links.
- **GitHub Contributions**: Section to display GitHub activity (dynamically fetched for configured user).
- **Contact Form**: Form to send messages, integrated with Nodemailer to send emails to a specified address.
- **Responsive Design**: Adapts to all screen sizes, with a mobile-friendly navigation.
- **Dark Mode Theme**: Sleek and modern dark aesthetic with green gradient accents, and a light mode alternative.

## Tech Stack

- **Front-end**: Next.js (App Router), React, TypeScript, Tailwind CSS
- **Styling**: ShadCN UI components, CSS variables for theming
- **Animation**: Framer Motion
- **Charts**: Recharts
- **Email**: Nodemailer for contact form submissions
- **API**: Next.js API Routes for contact form

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
    Create a `.env.local` file in the root of the project and add the following environment variables:
    ```env
    # General Site Configuration
    # NEXT_PUBLIC_SITE_URL=http://localhost:3000 (for local dev)
    # NEXT_PUBLIC_SITE_URL=https://yourdomain.com (for production)
    
    # GitHub Contributions Section
    NEXT_PUBLIC_GITHUB_USERNAME=yourgithubusername 

    # Nodemailer Configuration (for Contact Form)
    SMTP_HOST=your_smtp_host_address
    SMTP_PORT=your_smtp_port # (e.g., 587 for TLS, 465 for SSL)
    SMTP_USER=your_smtp_username # (often your email address)
    SMTP_PASS=your_smtp_password_or_app_password
    NODEMAILER_SENDER_EMAIL=your_verified_sender_email_address # Email address that will send the contact form submissions
    NODEMAILER_SENDER_NAME="Your Portfolio Contact Form" # (Optional, for the 'from' field display name)
    # The receiving email for contact form submissions is hardcoded in src/app/api/contact/route.ts as 'haziqsumaid4@gmail.com'
    ```
    Replace placeholder values (like `yourgithubusername`, `your_smtp_host_address`, etc.) with your actual credentials and settings. For Nodemailer, ensure your email provider's SMTP settings are used. For Gmail, you might need to enable "Less secure app access" or generate an "App Password".

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
This will build the image if it doesn't exist and start the container. The app will be accessible on `http://localhost:3000`. Ensure your `.env.local` variables are either passed to the Docker environment or the Dockerfile is updated to include them at build time if necessary for production builds.

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
    - Update text (e.g., "Your Name", "yourusername", email in `src/components/sections/ContactSection.tsx`), images, and project details in the respective components located in `src/components/sections/` and `src/components/Navbar.tsx`, `src/components/Footer.tsx`.
    - Skills data can be customized in `src/config/skills.ts`. Update skill names, proficiency levels, experience, icons, and descriptions.
- **CV**: Replace `public/placeholder-cv.pdf` with your actual CV. The link is in `src/components/sections/HeroSection.tsx`.
- **Social Links**: Update links in `src/components/Footer.tsx` and `src/components/sections/ContactSection.tsx`.
- **GitHub Contributions**: 
    - Set `NEXT_PUBLIC_GITHUB_USERNAME` in your `.env.local` file.
    - The section dynamically fetches and displays contributions for this username.
- **Contact Form Email**: The email address that *receives* submissions is hardcoded as `haziqsumaid4@gmail.com` in `src/app/api/contact/route.ts`. Change this if needed. The email address that *sends* these notifications is configured via `NODEMAILER_SENDER_EMAIL` in `.env.local`.
- **Domain & Metadata**:
    - Replace `https://yourdomain.com` in `public/sitemap.xml` and `src/app/layout.tsx` with your actual domain.
    - Update `YYYY-MM-DD` in `public/sitemap.xml` to the current date.
    - Update social media handles and image paths in `src/app/layout.tsx` for `openGraph` and `twitter` metadata.
- **Theme**: Colors and styles can be adjusted in `src/app/globals.css` and Tailwind configuration (`tailwind.config.ts`). The site supports light and dark modes.

## Live Demo

(Link to live demo URL will be added here once deployed)

## Deployment

This project can be deployed to platforms like Vercel, Netlify, or any hosting provider that supports Node.js/Docker. A basic GitHub Actions workflow is provided in `.github/workflows/ci-cd.yml` for automated building and testing. You can extend this for deployment to your chosen platform. Remember to configure your production environment variables on your hosting platform.
```