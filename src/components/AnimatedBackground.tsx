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

const NUM_ICONS_DESKTOP = 12; 
const NUM_ICONS_MOBILE = 6;   
const NUM_ICONS_STATIC_REDUCED_MOTION = 5; 

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
  const framerReducedMotion = useReducedMotion();
  const [isReducedMotionActive, setIsReducedMotionActive] = useState(true); // Default true for SSR, client will update

  useEffect(() => {
    setIsClient(true);
    // Set based on hook's value once available on client
    // framerReducedMotion can be null initially on client before it resolves
    setIsReducedMotionActive(framerReducedMotion === true); 
  }, [framerReducedMotion]);

  const iconConfigs = useMemo(() => {
    if (!isClient) return []; 

    const isMobileView = typeof window !== 'undefined' && window.innerWidth < 768;
    const testVisibilityOpacity = 0.5; // TEST: Increased opacity for better visibility

    if (isReducedMotionActive) {
        const staticIconsConfig = [];
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
                driftXAmount: 0, driftYAmount: 0, 
                baseOpacity: testVisibilityOpacity, // TEST: Use increased opacity
                pulseOpacityFactor: 1, 
                animationDelay: 0, driftDurationX: 0, driftDurationY: 0, pulseDuration: 0,
                size: isMobileView ? 18 : 22,
            });
        }
        return staticIconsConfig;
    }

    const numIcons = isMobileView ? NUM_ICONS_MOBILE : NUM_ICONS_DESKTOP;
    const configs: IconConfig[] = [];
    const gridCells = numIcons * 2; 
    const takenCells = new Set<string>();

    for (let i = 0; i < numIcons; i++) {
      let cellX: number, cellY: number, cellKey: string;
      let attempts = 0;
      do {
        cellX = Math.floor(getRandom(0, Math.sqrt(gridCells)));
        cellY = Math.floor(getRandom(0, Math.sqrt(gridCells)));
        cellKey = `${cellX}-${cellY}`;
        attempts++;
      } while (takenCells.has(cellKey) && attempts < 50);
      takenCells.add(cellKey);

      const posX = (cellX / Math.sqrt(gridCells)) * 90 + 5; 
      const posY = (cellY / Math.sqrt(gridCells)) * 90 + 5; 

      configs.push({
        id: `icon-${i}`,
        Component: ALL_ICONS[i % ALL_ICONS.length],
        initialX: `${posX}%`,
        initialY: `${posY}%`,
        driftXAmount: getRandom(isMobileView ? 20 : 40, isMobileView ? 50 : 80),
        driftYAmount: getRandom(isMobileView ? 15 : 30, isMobileView ? 40 : 60),
        baseOpacity: testVisibilityOpacity, // TEST: Use increased opacity
        pulseOpacityFactor: getRandom(1.2, 1.5), // Pulse up to 1.2x-1.5x base opacity
        animationDelay: getRandom(0.1, numIcons * 0.15), 
        driftDurationX: getRandom(isMobileView ? 10 : 6, isMobileView ? 18 : 12), 
        driftDurationY: getRandom(isMobileView ? 10 : 6, isMobileView ? 18 : 12), 
        pulseDuration: getRandom(4, 7), 
        size: isMobileView ? 18 : 24,
      });
    }
    return configs;
  }, [isClient, isReducedMotionActive]);

  if (!isClient) {
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
          baseOpacity={config.baseOpacity} // Will use testVisibilityOpacity
          pulseOpacityFactor={config.pulseOpacityFactor}
          animationDelay={config.animationDelay}
          driftDurationX={config.driftDurationX}
          driftDurationY={config.driftDurationY}
          pulseDuration={config.pulseDuration}
          size={config.size}
          color="hsl(var(--muted-foreground))" // Using theme color, opacity change should make it visible
          // color="red" // Alternative test: use a hardcoded bright color
          isReducedMotion={isReducedMotionActive}
        />
      ))}
    </div>
  );
}
