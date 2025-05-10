import type { Metadata, Viewport } from 'next';
// Removed: import { GeistSans } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';

// Removed: GeistSans font object was not a Google Font and was also applied incorrectly.
// const geistSans = GeistSans({
//   variable: '--font-geist-sans',
//   subsets: ['latin'],
// });

export const metadata: Metadata = {
  title: 'Backend Brilliance Portfolio | Node.js & DevOps Engineer',
  description: 'Personal portfolio of a Senior Node.js Backend Developer & DevOps Engineer, showcasing backend projects, skills, and expertise.',
  openGraph: {
    title: 'Backend Brilliance Portfolio | Node.js & DevOps Engineer',
    description: 'Showcasing backend projects, skills, and expertise in Node.js and DevOps.',
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000', // Replace with actual URL
    siteName: 'Backend Brilliance Portfolio',
    // images: [ // Add a an image for social sharing
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
    // images: [`${process.env.NEXT_PUBLIC_SITE_URL}/twitter-image.png`], // Add a Twitter-specific image
    // creator: '@yourtwitterhandle', // Add your Twitter handle
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
  icons: { // Add favicon links if you have them
    // icon: '/favicon.ico',
    // apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json', // If you have a manifest.json
};

export const viewport: Viewport = {
  themeColor: '#0A0F0D', // Dark mode base
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      {/*
        The 'font-sans' class from Tailwind CSS will apply the default sans-serif font stack.
        The previous 'geistSans.variable' was attempting to use '--font-geist-sans' as a class name,
        which is incorrect for applying a font via next/font and would not have worked as intended.
      */}
      <body className={cn('antialiased bg-background text-foreground font-sans')}>
        <Navbar />
        <main className="pt-16"> {/* Add padding-top to account for sticky navbar height */}
          {children}
        </main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
