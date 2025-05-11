
import type { Config } from "tailwindcss";
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      'xs': '475px', 
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      ...defaultTheme.screens, // Keep if you still want default xl, 2xl etc. but override sm,md,lg,xl
    },
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', ...defaultTheme.fontFamily.sans],
        mono: ['var(--font-jetbrains-mono)', ...defaultTheme.fontFamily.mono],
      },
      colors: {
        bg: 'hsl(var(--bg) / <alpha-value>)',
        fg: 'hsl(var(--fg) / <alpha-value>)',
        'muted-bg': 'hsl(var(--muted-bg) / <alpha-value>)',
        'muted-fg': 'hsl(var(--muted-fg) / <alpha-value>)',
        primary: {
          DEFAULT: 'hsl(var(--primary) / <alpha-value>)',
          foreground: 'hsl(var(--primary-foreground) / <alpha-value>)',
          dark: 'hsl(var(--primary-dark) / <alpha-value>)',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary) / <alpha-value>)',
          foreground: 'hsl(var(--secondary-foreground) / <alpha-value>)',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted) / <alpha-value>)',
          foreground: 'hsl(var(--muted-foreground) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent) / <alpha-value>)',
          foreground: 'hsl(var(--accent-foreground) / <alpha-value>)',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive) / <alpha-value>)',
          foreground: 'hsl(var(--destructive-foreground) / <alpha-value>)',
        },
        border: 'hsl(var(--border) / <alpha-value>)',
        input: 'hsl(var(--input) / <alpha-value>)',
        ring: 'hsl(var(--ring) / <alpha-value>)',
        card: {
          DEFAULT: 'hsl(var(--card) / <alpha-value>)',
          foreground: 'hsl(var(--card-foreground) / <alpha-value>)',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover) / <alpha-value>)',
          foreground: 'hsl(var(--popover-foreground) / <alpha-value>)',
        },
        chart: {
          'git-0': 'hsl(var(--chart-git-0) / <alpha-value>)',
          'git-1': 'hsl(var(--chart-git-1) / <alpha-value>)',
          'git-2': 'hsl(var(--chart-git-2) / <alpha-value>)',
          'git-3': 'hsl(var(--chart-git-3) / <alpha-value>)',
          'git-4': 'hsl(var(--chart-git-4) / <alpha-value>)',
          '1': 'hsl(var(--chart-1) / <alpha-value>)',
          '2': 'hsl(var(--chart-2) / <alpha-value>)',
          '3': 'hsl(var(--chart-3) / <alpha-value>)',
          '4': 'hsl(var(--chart-4) / <alpha-value>)',
          '5': 'hsl(var(--chart-5) / <alpha-value>)',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        },
        blink: {
          '0%, 100%': { opacity: '0' },
          '50%': { opacity: '1' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.3s cubic-bezier(0.22,1,0.36,1)',
        'accordion-up': 'accordion-up 0.3s cubic-bezier(0.22,1,0.36,1)',
        blink: 'blink 1s step-end infinite',
      },
      fontSize: {
        // Base font size is 1rem (16px)
        // H1: 4rem (desktop), 3rem (tablet), 2.5rem (mobile)
        'display-lg': ['4rem', { lineHeight: '1.1', fontWeight: '800' }], // lg:text-display-lg
        'display-md': ['3rem', { lineHeight: '1.1', fontWeight: '800' }], // md:text-display-md
        'display-sm': ['2.5rem', { lineHeight: '1.2', fontWeight: '800' }], // text-display-sm (mobile default for H1)

        // H2: 2.5rem / 2rem / 1.75rem, weight 700
        'headline-lg': ['2.5rem', { lineHeight: '1.2', fontWeight: '700' }],
        'headline-md': ['2rem', { lineHeight: '1.2', fontWeight: '700' }],
        'headline-sm': ['1.75rem', { lineHeight: '1.3', fontWeight: '700' }],

        // H3: 1.75rem / 1.5rem / 1.25rem, weight 600
        'subheadline-lg': ['1.75rem', { lineHeight: '1.3', fontWeight: '600' }],
        'subheadline-md': ['1.5rem', { lineHeight: '1.4', fontWeight: '600' }],
        'subheadline-sm': ['1.25rem', { lineHeight: '1.4', fontWeight: '600' }],
        
        // Paragraphs: 1rem, weight 400
        // Code: 0.95rem
        'code': ['0.95rem', { lineHeight: '1.4' }],
      }
    }
  },
  plugins: [
    require("tailwindcss-animate"),
    require('tailwind-scrollbar')({ nocompatible: true }),
    require('@tailwindcss/aspect-ratio'),
  ],
} satisfies Config;

    