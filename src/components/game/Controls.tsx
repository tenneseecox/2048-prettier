'use client';

import { memo, useMemo } from 'react';
import { Button } from '@/components/ui/button';

interface ControlsProps {
  onNewGame: () => void;
}

export const Controls = memo(function Controls({ 
  onNewGame
}: ControlsProps) {
  // Memoize button classes to prevent recalculation
  const newGameButtonClass = useMemo(() => 
    "h-9 px-4 font-medium bg-blue-500 hover:bg-blue-600 shadow-md",
    []
  );
  
  return (
    <div className="flex items-center gap-2">
      <Button 
        variant="default" 
        size="sm"
        className={newGameButtonClass}
        onClick={onNewGame}
      >
        New Game
      </Button>
    </div>
  );
}); 