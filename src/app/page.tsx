'use client';

import { memo, useMemo } from 'react';
import { Board } from '@/components/game/Board';
import { Controls } from '@/components/game/Controls';
import { ScoreBoard } from '@/components/game/ScoreBoard';
import { useGameState } from '@/hooks/useGameState';
import { Toaster } from '@/components/ui/sonner';
import { AnimatePresence, motion } from 'framer-motion';

const GameHeader = memo(function GameHeader({ 
  startNewGame, 
  continueGame, 
  gameWon 
}: { 
  startNewGame: () => void; 
  continueGame: () => void; 
  gameWon: boolean;
}) {
  return (
    <div className="w-full flex justify-between items-center mb-3">
      <div className="flex items-baseline">
        <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
          2048
        </h1>
        <span className="text-sm sm:text-base text-blue-400/80 ml-1.5">
          Prettier
        </span>
      </div>
      
      <Controls 
        onNewGame={startNewGame} 
        onContinue={continueGame}
        gameWon={gameWon}
      />
    </div>
  );
});

const GameFooter = memo(function GameFooter() {
  return (
    <footer className="text-xs sm:text-sm text-slate-400 text-center w-full">
      <p className="mb-0.5">Use your keyboard arrow keys or WASD to play.</p>
      <p>
        2048 Prettier • 
        <a 
          href="https://github.com/your-username/2048-prettier" 
          target="_blank" 
          rel="noopener noreferrer"
          className="ml-1 text-blue-400 hover:text-blue-300 transition-colors"
        >
          View on GitHub
        </a>
      </p>
    </footer>
  );
});

const GameStatusMessages = memo(function GameStatusMessages({
  won,
  over,
  startNewGame
}: {
  won: boolean;
  over: boolean;
  startNewGame: () => void;
}) {
  // Memoize animation properties
  const winAnimation = useMemo(() => ({
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 }
  }), []);
  
  const gameOverAnimation = useMemo(() => ({
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 }
  }), []);
  
  return (
    <AnimatePresence>
      {won && (
        <motion.div
          {...winAnimation}
          className="w-full text-center py-2 px-3 bg-gradient-to-r from-lime-500 to-green-500 rounded-lg text-sm font-bold text-white shadow-sm"
        >
          You reached 2048! 🎉
        </motion.div>
      )}
      
      {over && (
        <motion.button
          onClick={startNewGame}
          {...gameOverAnimation}
          className="w-full text-center py-2 px-3 bg-gradient-to-r from-slate-700 to-slate-800 rounded-lg text-sm font-bold text-white shadow-sm border border-slate-600/30 hover:bg-gradient-to-r hover:from-slate-600 hover:to-slate-700 transition-colors cursor-pointer"
        >
          Game Over! Click to try again
        </motion.button>
      )}
    </AnimatePresence>
  );
});

export default function Home() {
  const { state, moveInDirection, startNewGame, continueGame, formattedTime } = useGameState();
  
  // Memoize container classes to prevent recalculation
  const containerClass = useMemo(() => 
    "relative h-screen flex flex-col bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 overflow-hidden",
    []
  );
  
  const contentContainerClass = useMemo(() => 
    "flex-grow flex flex-col items-center justify-center pt-4",
    []
  );
  
  const innerContainerClass = useMemo(() => 
    "w-full max-w-[min(95vw,_600px)] mx-auto px-4",
    []
  );
  
  const footerContainerClass = useMemo(() => 
    "flex-shrink-0 flex items-center justify-center py-4 relative z-10 mt-auto mb-4",
    []
  );

  return (
    <div className={containerClass}>
      {/* Main content area with flex-grow */}
      <div className={contentContainerClass}>
        <div className={innerContainerClass}>
          {/* Header row with title and controls */}
          <GameHeader 
            startNewGame={startNewGame} 
            continueGame={continueGame} 
            gameWon={state.won} 
          />
          
          {/* Scoreboard */}
          <div className="w-full mb-3">
            <ScoreBoard 
              score={state.score} 
              bestScore={state.bestScore}
              timer={formattedTime}
            />
          </div>
          
          {/* Game board */}
          <div className="w-full mb-3">
            <Board 
              gameState={state} 
              onMove={moveInDirection}
            />
          </div>
          
          {/* Game status messages */}
          <GameStatusMessages 
            won={state.won} 
            over={state.over} 
            startNewGame={startNewGame} 
          />
        </div>
      </div>
      
      {/* Fixed height spacer */}
      <div className="h-8"></div>
      
      {/* Footer with proper spacing - always visible */}
      <div className={footerContainerClass}>
        <GameFooter />
      </div>
      
      <Toaster position="bottom-center" />
    </div>
  );
}
