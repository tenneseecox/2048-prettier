'use client';

import { memo, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { AnimatePresence, motion } from 'framer-motion';

interface ControlsProps {
  onNewGame: () => void;
  onContinue?: () => void;
  gameWon: boolean;
  gameOver?: boolean;
}

export const Controls = memo(function Controls({ 
  onNewGame, 
  onContinue, 
  gameWon
}: ControlsProps) {
  // Memoize button classes to prevent recalculation
  const newGameButtonClass = useMemo(() => 
    "h-9 px-4 font-medium bg-blue-500 hover:bg-blue-600 shadow-md",
    []
  );
  
  const continueButtonClass = useMemo(() => 
    "h-9 px-4 font-medium bg-green-500/10 text-green-400 border-green-500/30 hover:bg-green-500/20 shadow-md",
    []
  );
  
  // Memoize animation properties
  const continueButtonAnimation = useMemo(() => ({
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
    transition: { duration: 0.2 }
  }), []);
  
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
      
      <AnimatePresence>
        {gameWon && onContinue && (
          <motion.div
            {...continueButtonAnimation}
          >
            <Button 
              variant="outline" 
              size="sm"
              className={continueButtonClass}
              onClick={onContinue}
            >
              Continue
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}); 