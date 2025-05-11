import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { MotionConfig } from 'framer-motion';
import { siteConfig } from '@/config/content';

const fontInter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const fontJetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  weight: ['400', '700'] 
});

export const metadata: Metadata = {
  title: `${siteConfig.name} | ${siteConfig.taglineShort}`,
  description: siteConfig.description,
  openGraph: {
    title: `${siteConfig.name} | ${siteConfig.taglineShort}`,
    description: siteConfig.description,
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000', 
    siteName: siteConfig.name,
    // images: [ 
    //   {
    //     url: `${process.env.NEXT_PUBLIC_SITE_URL}/og-image.png`, // Create an og-image.png in public
    //     width: 1200,
    //     height: 630,
    //     alt: siteConfig.name,
    //   },
    // ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.name} | ${siteConfig.taglineShort}`,
    description: siteConfig.description,
    // images: [`${process.env.NEXT_PUBLIC_SITE_URL}/twitter-image.png`], // Create a twitter-image.png in public
    // creator: siteConfig.socialLinks.twitterHandle, // Assuming you add twitterHandle to siteConfig
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
  // icons: {  // Re-enable if you have these assets
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
    <html lang="en" suppressHydrationWarning className={`${fontInter.variable} ${fontJetBrainsMono.variable}`}>
      <body className={cn('antialiased bg-bg text-fg font-sans')}>
        <ThemeProvider>
          <MotionConfig 
            transition={{ type: "spring", stiffness: 500, damping: 30, duration: 0.3, ease: [0.22,1,0.36,1] }}
            reducedMotion="user"
          >
            <Navbar />
            <main className="pt-16"> {/* Adjust if navbar height changes */}
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

    