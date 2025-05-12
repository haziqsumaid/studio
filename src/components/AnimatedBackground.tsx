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
  maxPulseOpacity: number; 
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
  const [isReducedMotionActive, setIsReducedMotionActive] = useState(true); 

  useEffect(() => {
    setIsClient(true);
    setIsReducedMotionActive(framerReducedMotion === true); 
  }, [framerReducedMotion]);

  const iconConfigs = useMemo(() => {
    if (!isClient) return []; 

    const isMobileView = typeof window !== 'undefined' && window.innerWidth < 768;
    const targetMaxPulseOpacity = getRandom(0.1, 0.2); // Slightly increased maxPulseOpacity range

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
                maxPulseOpacity: 0.1, 
                animationDelay: 0, driftDurationX: 0, driftDurationY: 0, 
                pulseDuration: 0, 
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
        maxPulseOpacity: targetMaxPulseOpacity, 
        animationDelay: getRandom(0.1, numIcons * 0.15), 
        driftDurationX: getRandom(isMobileView ? 10 : 8, isMobileView ? 18 : 15), 
        driftDurationY: getRandom(isMobileView ? 10 : 8, isMobileView ? 18 : 15), 
        pulseDuration: getRandom(2.5, 5), 
        size: isMobileView ? 18 : 24,
      });
    }
    return configs;
  }, [isClient, isReducedMotionActive]);

  if (!isClient) {
    return null; 
  }

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none animated-bg-container" aria-hidden="true"> 
      {iconConfigs.map(config => (
        <AnimatedIcon
          key={config.id}
          IconComponent={config.Component}
          initialX={config.initialX}
          initialY={config.initialY}
          driftXAmount={config.driftXAmount}
          driftYAmount={config.driftYAmount}
          maxPulseOpacity={config.maxPulseOpacity} 
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