'use client';

import { Tile as TileType } from '@/types/game';
import { useEffect, useState, useMemo, memo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TileProps {
  tile: TileType;
  cellSize: number;
  gapSize?: number;
}

// Memoize the tile component to prevent unnecessary re-renders
export const Tile = memo(function Tile({ tile, cellSize, gapSize = 12 }: TileProps) {
  const [isNew, setIsNew] = useState(tile.isNew);
  const [isMerged, setIsMerged] = useState(!!tile.mergedFrom);
  
  // Reset animation flags after animation completes
  useEffect(() => {
    if (isNew) {
      const timer = setTimeout(() => setIsNew(false), 150);
      return () => clearTimeout(timer);
    }
    
    if (isMerged) {
      const timer = setTimeout(() => setIsMerged(false), 150);
      return () => clearTimeout(timer);
    }
  }, [isNew, isMerged]);
  
  // Memoize color calculations to avoid recalculating on every render
  const tileColor = useMemo(() => {
    const colors: Record<number, string> = {
      2: 'from-blue-500/95 to-blue-600/95',
      4: 'from-indigo-500/95 to-indigo-600/95',
      8: 'from-violet-500/95 to-violet-600/95',
      16: 'from-purple-500/95 to-purple-600/95',
      32: 'from-fuchsia-500/95 to-fuchsia-600/95',
      64: 'from-pink-500/95 to-pink-600/95',
      128: 'from-rose-500/95 to-rose-600/95',
      256: 'from-orange-500/95 to-orange-600/95',
      512: 'from-amber-500/95 to-amber-600/95',
      1024: 'from-yellow-500/95 to-yellow-600/95',
      2048: 'from-lime-500/95 to-lime-600/95',
      4096: 'from-green-500/95 to-green-600/95',
      8192: 'from-emerald-500/95 to-emerald-600/95',
    };
    
    return colors[tile.value] || 'from-cyan-500/95 to-cyan-600/95';
  }, [tile.value]);
  
  // Memoize glow calculations
  const borderGlow = useMemo(() => {
    const glows: Record<number, string> = {
      2: 'rgba(59, 130, 246, 0.6)',
      4: 'rgba(99, 102, 241, 0.6)',
      8: 'rgba(139, 92, 246, 0.6)',
      16: 'rgba(168, 85, 247, 0.6)',
      32: 'rgba(217, 70, 239, 0.6)',
      64: 'rgba(236, 72, 153, 0.6)',
      128: 'rgba(244, 63, 94, 0.6)',
      256: 'rgba(249, 115, 22, 0.6)',
      512: 'rgba(245, 158, 11, 0.6)',
      1024: 'rgba(234, 179, 8, 0.6)',
      2048: 'rgba(132, 204, 22, 0.6)',
      4096: 'rgba(34, 197, 94, 0.6)',
      8192: 'rgba(16, 185, 129, 0.6)',
    };
    
    return glows[tile.value] || 'rgba(6, 182, 212, 0.6)';
  }, [tile.value]);
  
  // Memoize font size class
  const fontSizeClass = useMemo(() => {
    if (tile.value < 100) return 'text-3xl sm:text-4xl';
    if (tile.value < 1000) return 'text-2xl sm:text-3xl';
    if (tile.value < 10000) return 'text-xl sm:text-2xl';
    return 'text-lg sm:text-xl';
  }, [tile.value]);
  
  // Calculate position
  const x = tile.position.x * (cellSize + gapSize);
  const y = tile.position.y * (cellSize + gapSize);
  
  // Memoize style object to prevent recalculation
  const tileStyle = useMemo(() => ({
    width: `${cellSize}px`,
    height: `${cellSize}px`,
    zIndex: isMerged ? 20 : 10,
    boxShadow: `0 0 12px ${borderGlow}, inset 0 0 8px rgba(255, 255, 255, 0.15)`,
  }), [cellSize, isMerged, borderGlow]);
  
  // Optimize animation transitions
  const transitions = useMemo(() => ({
    x: { type: 'spring', stiffness: 600, damping: 30, mass: 1 },
    y: { type: 'spring', stiffness: 600, damping: 30, mass: 1 },
    scale: { 
      type: 'tween', 
      duration: 0.15,
      ease: 'easeInOut'
    },
    opacity: { duration: 0.1 }
  }), []);
  
  return (
    <motion.div
      className={cn(
        "absolute rounded-lg flex items-center justify-center",
        "font-medium text-white backdrop-blur-sm",
        "bg-gradient-to-br border border-white/20",
        fontSizeClass,
        tileColor
      )}
      style={tileStyle}
      initial={{ 
        scale: isNew ? 0 : 1, 
        opacity: isNew ? 0 : 1, 
        x, 
        y 
      }}
      animate={{ 
        x, 
        y,
        scale: isMerged ? [1, 1.1, 1] : isNew ? [0, 1] : 1,
        opacity: 1
      }}
      transition={transitions}
    >
      {/* Tile value */}
      <span className="relative z-10">{tile.value}</span>
    </motion.div>
  );
}); 