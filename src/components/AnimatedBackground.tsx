// src/components/AnimatedBackground.tsx
"use client";

import { useState, useEffect, useMemo } from 'react';
import { useReducedMotion } from 'framer-motion';
import AnimatedIcon from './AnimatedIcon';
import {
  Terminal, Code2, GitBranch, Cpu, Database, Server, Brackets, Network, Binary, Workflow, Layers, SquareCode, Variable, FunctionSquare, Sigma, Asterisk, GitCommit, GitPullRequest, Cable
} from 'lucide-react';
import type { Icon } from 'lucide-react';

const ALL_ICONS: Icon[] = [
  Terminal, Code2, GitBranch, Cpu, Database, Server, Brackets, Network, Binary, Workflow, Layers, SquareCode, Variable, FunctionSquare, Sigma, Asterisk, GitCommit, GitPullRequest, Cable
];

const NUM_ICONS_DESKTOP = 12; // Number of icons for desktop
const NUM_ICONS_MOBILE = 6;   // Number of icons for mobile
const NUM_ICONS_STATIC_REDUCED_MOTION = 5; // Number of static icons for reduced motion

interface IconConfig {
  id: string;
  Component: Icon;
  initialX: string;
  initialY: string;
  driftXAmount: number;
  driftYAmount: number;
  baseOpacity: number;
  pulseOpacityFactor: number;
  animationDelay: number;
  driftDurationX: number;
  driftDurationY: number;
  pulseDuration: number;
  size: number;
}

const getRandom = (min: number, max: number) => Math.random() * (max - min) + min;

export function AnimatedBackground() {
  const [isClient, setIsClient] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const [isReducedMotionActive, setIsReducedMotionActive] = useState(true); 

  useEffect(() => {
    setIsClient(true);
    // Check for prefersReducedMotion only on the client after mount
    // prefersReducedMotion hook might return undefined initially
    setIsReducedMotionActive(!!prefersReducedMotion); 
  }, [prefersReducedMotion]);

  const iconConfigs = useMemo(() => {
    if (!isClient) return []; // Ensure Math.random is only called client-side

    const isMobileView = typeof window !== 'undefined' && window.innerWidth < 768;
    
    if (isReducedMotionActive) {
        const staticIconsConfig = [];
        // Positions for static icons, ensuring they are somewhat spread out
        const positions = [
            { x: '15%', y: '20%' }, { x: '85%', y: '30%' },
            { x: '50%', y: '50%' },
            { x: '25%', y: '80%' }, { x: '75%', y: '70%' },
        ];
        for (let i = 0; i < NUM_ICONS_STATIC_REDUCED_MOTION; i++) {
            staticIconsConfig.push({
                id: `static-icon-${i}`,
                Component: ALL_ICONS[i % ALL_ICONS.length],
                initialX: positions[i % positions.length].x,
                initialY: positions[i % positions.length].y,
                driftXAmount: 0, driftYAmount: 0, baseOpacity: 0.06, pulseOpacityFactor: 1, // Static, non-pulsing
                animationDelay: 0, driftDurationX: 0, driftDurationY: 0, pulseDuration: 0,
                size: isMobileView ? 18 : 22,
            });
        }
        return staticIconsConfig;
    }

    // Full animation configuration
    const numIcons = isMobileView ? NUM_ICONS_MOBILE : NUM_ICONS_DESKTOP;
    const configs: IconConfig[] = [];
    const gridCells = numIcons * 2; // Create more cells than icons to allow spacing
    const takenCells = new Set<string>();

    for (let i = 0; i < numIcons; i++) {
      let cellX: number, cellY: number, cellKey: string;
      let attempts = 0;
      // Try to find an empty "approximate" cell to avoid direct visual overlap
      do {
        cellX = Math.floor(getRandom(0, Math.sqrt(gridCells)));
        cellY = Math.floor(getRandom(0, Math.sqrt(gridCells)));
        cellKey = `${cellX}-${cellY}`;
        attempts++;
      } while (takenCells.has(cellKey) && attempts < 50);
      takenCells.add(cellKey);

      const posX = (cellX / Math.sqrt(gridCells)) * 90 + 5; // % position
      const posY = (cellY / Math.sqrt(gridCells)) * 90 + 5; // % position

      configs.push({
        id: `icon-${i}`,
        Component: ALL_ICONS[i % ALL_ICONS.length],
        initialX: `${posX}%`,
        initialY: `${posY}%`,
        driftXAmount: getRandom(isMobileView ? 20 : 40, isMobileView ? 50 : 80),
        driftYAmount: getRandom(isMobileView ? 15 : 30, isMobileView ? 40 : 60),
        baseOpacity: getRandom(0.05, 0.12), // Range: 5% to 12%
        pulseOpacityFactor: getRandom(1.5, 2.0), // Pulse up to 1.5x-2x base opacity
        animationDelay: getRandom(0.1, numIcons * 0.15), // Staggered delay up to ~1.8s for 12 icons
        driftDurationX: getRandom(isMobileView ? 10 : 6, isMobileView ? 18 : 12), // Slower on mobile
        driftDurationY: getRandom(isMobileView ? 10 : 6, isMobileView ? 18 : 12), // Slower on mobile
        pulseDuration: getRandom(4, 7), // Slow pulse
        size: isMobileView ? 18 : 24,
      });
    }
    return configs;
  }, [isClient, isReducedMotionActive]);

  if (!isClient) {
    // Avoid rendering on server if Math.random is involved in setup,
    // or if reduced motion state isn't confirmed yet.
    return null; 
  }

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden="true"> 
      {iconConfigs.map(config => (
        <AnimatedIcon
          key={config.id}
          IconComponent={config.Component}
          initialX={config.initialX}
          initialY={config.initialY}
          driftXAmount={config.driftXAmount}
          driftYAmount={config.driftYAmount}
          baseOpacity={config.baseOpacity}
          pulseOpacityFactor={config.pulseOpacityFactor}
          animationDelay={config.animationDelay}
          driftDurationX={config.driftDurationX}
          driftDurationY={config.driftDurationY}
          pulseDuration={config.pulseDuration}
          size={config.size}
          color="hsl(var(--muted-foreground))" 
          isReducedMotion={isReducedMotionActive}
        />
      ))}
    </div>
  );
}
