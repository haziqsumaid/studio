import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { MotionConfig } from 'framer-motion';

export const metadata: Metadata = {
  title: 'Backend Brilliance Portfolio | Node.js & DevOps Engineer',
  description: 'Personal portfolio of a Senior Node.js Backend Developer & DevOps Engineer, showcasing backend projects, skills, and expertise.',
  openGraph: {
    title: 'Backend Brilliance Portfolio | Node.js & DevOps Engineer',
    description: 'Showcasing backend projects, skills, and expertise in Node.js and DevOps.',
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000', 
    siteName: 'Backend Brilliance Portfolio',
    // images: [ 
    //   {
    //     url: `${process.env.NEXT_PUBLIC_SITE_URL}/og-image.png`,
    //     width: 1200,
    //     height: 630,
    //     alt: 'Backend Brilliance Portfolio',
    //   },
    // ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Backend Brilliance Portfolio | Node.js & DevOps Engineer',
    description: 'Showcasing backend projects, skills, and expertise in Node.js and DevOps.',
    // images: [`${process.env.NEXT_PUBLIC_SITE_URL}/twitter-image.png`], 
    // creator: '@yourtwitterhandle', 
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  // icons: { 
  //   icon: '/favicon.ico',
  //   apple: '/apple-touch-icon.png',
  // },
  // manifest: '/manifest.json', 
};

export const viewport: Viewport = {
  // themeColor will be managed by ThemeProvider based on current theme
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning> {/* suppressHydrationWarning for next-themes or manual theme management */}
      <body className={cn('antialiased bg-background text-foreground font-sans')}>
        <ThemeProvider>
          <MotionConfig reducedMotion="user">
            <Navbar />
            <main className="pt-16"> {/* Add padding-top to account for sticky navbar height */}
              {children}
            </main>
            <Footer />
            <Toaster />
          </MotionConfig>
        </ThemeProvider>
      </body>
    </html>
  );
}
