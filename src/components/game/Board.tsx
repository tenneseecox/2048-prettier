'use client';

import { useRef, useState, useEffect, useMemo, useCallback, memo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Tile } from './Tile';
import { GameState } from '@/types/game';
import { useSwipeDetection } from '@/hooks/useSwipeDetection';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface BoardProps {
  gameState: GameState;
  onMove: (direction: 'up' | 'right' | 'down' | 'left') => void;
}

// Memoize the Board component to prevent unnecessary re-renders
export const Board = memo(function Board({ gameState, onMove }: BoardProps) {
  const boardRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [cellSize, setCellSize] = useState(80);
  const [gapSize, setGapSize] = useState(10);
  
  // Set up swipe detection for mobile devices
  useSwipeDetection(boardRef as React.RefObject<HTMLElement>, onMove);
  
  // Memoize the resize handler to prevent recreation on each render
  const handleResize = useCallback(() => {
    updateCellSize();
  }, []);
  
  useEffect(() => {
    updateCellSize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);
  
  // Calculate cell size based on container width
  const updateCellSize = useCallback(() => {
    if (!containerRef.current) return;
    
    // Get available width from container
    const containerWidth = containerRef.current.clientWidth;
    
    // Calculate padding based on container size (consistent on all sides)
    const padding = Math.max(12, Math.min(16, Math.floor(containerWidth * 0.03)));
    
    // Determine available width for the grid
    const availableWidth = containerWidth - (padding * 2);
    
    // Calculate gap size based on available space
    const newGapSize = Math.max(8, Math.min(12, Math.floor(availableWidth * 0.03)));
    setGapSize(newGapSize);
    
    // Calculate cell size: (available width - total gaps) / number of cells
    const totalGapWidth = newGapSize * 3; // 3 gaps for 4 cells
    const newCellSize = Math.floor((availableWidth - totalGapWidth) / 4);
    
    // Ensure cell size is reasonable
    setCellSize(Math.max(60, Math.min(120, newCellSize)));
  }, []);
  
  // Calculate the total size of the board
  const boardSize = useMemo(() => (cellSize * 4) + (gapSize * 3), [cellSize, gapSize]);
  
  // Memoize the board style to prevent recalculation
  const boardStyle = useMemo(() => ({
    width: `${boardSize}px`,
    height: `${boardSize}px`,
  }), [boardSize]);
  
  // Render empty cells (background grid)
  const renderCells = useCallback(() => {
    const cells = [];
    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 4; x++) {
        cells.push(
          <div
            key={`cell-${x}-${y}`}
            className="absolute bg-slate-800/70 rounded-lg"
            style={{
              width: `${cellSize}px`,
              height: `${cellSize}px`,
              transform: `translate(${x * (cellSize + gapSize)}px, ${y * (cellSize + gapSize)}px)`,
            }}
          />
        );
      }
    }
    return cells;
  }, [cellSize, gapSize]);
  
  // Render tiles with their proper positions
  const renderTiles = useCallback(() => {
    const tiles = [];
    
    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 4; x++) {
        const tile = gameState.board[y][x];
        if (tile) {
          tiles.push(
            <Tile
              key={tile.id}
              tile={{
                ...tile,
                position: {
                  x: x,
                  y: y
                }
              }}
              cellSize={cellSize}
              gapSize={gapSize}
            />
          );
        }
      }
    }
    
    return tiles;
  }, [gameState.board, cellSize, gapSize]);
  
  // Memoize cells and tiles to prevent unnecessary recalculation
  const cells = useMemo(() => renderCells(), [renderCells]);
  const tiles = useMemo(() => renderTiles(), [renderTiles]);
  
  return (
    <div ref={containerRef} className="w-full flex items-center justify-center">
      <Card 
        className={cn(
          "w-full overflow-hidden bg-slate-900/80 border-slate-800/80 shadow-md",
          "flex items-center justify-center"
        )}
      >
        {/* Board container with consistent spacing */}
        <div 
          ref={boardRef}
          className="py-4 px-4 touch-none w-full flex items-center justify-center" 
        >
          <div 
            className="relative"
            style={boardStyle}
          >
            {/* Background grid cells */}
            {cells}
            
            {/* Animated tiles */}
            <AnimatePresence mode="popLayout">
              {tiles}
            </AnimatePresence>
          </div>
        </div>
      </Card>
    </div>
  );
}); 