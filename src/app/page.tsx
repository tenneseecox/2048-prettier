'use client';

import { memo, useMemo, useState } from 'react';
import { Board } from '@/components/game/Board';
import { Controls } from '@/components/game/Controls';
import { ScoreBoard } from '@/components/game/ScoreBoard';
import { WinModal } from '@/components/game/WinModal';
import { LoseModal } from '@/components/game/LoseModal';
import { AdvancedWinModal } from '@/components/game/AdvancedWinModal';
import { StatsDashboard } from '@/components/game/StatsDashboard';
import { useGameState } from '@/hooks/useGameState';
import { Toaster } from '@/components/ui/sonner';

const GameHeader = memo(function GameHeader({ 
  startNewGame
}: { 
  startNewGame: () => void; 
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
          href="https://github.com/tenneseecox/2048-prettier" 
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

export default function Home() {
  const { state, moveInDirection, startNewGame, continueGame, formattedTime } = useGameState();
  const [showStats, setShowStats] = useState(false);
  
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

  // Handle win modal actions
  const handleCloseWinModal = () => {
    continueGame();
  };

  const handleViewStats = () => {
    continueGame();
    setShowStats(true);
  };

  const handleBackFromStats = () => {
    setShowStats(false);
  };

  return (
    <div className={containerClass}>
      {/* Main content area with flex-grow */}
      <div className={contentContainerClass}>
        <div className={innerContainerClass}>
          {!showStats ? (
            <>
              {/* Header row with title and controls */}
              <GameHeader 
                startNewGame={startNewGame} 
              />
              
              {/* Scoreboard */}
              <div className="w-full mb-3">
                <ScoreBoard 
                  score={state.score} 
                  bestScore={state.bestScore}
                  timer={formattedTime}
                  key={`scoreboard-${state.score}-${state.bestScore}`}
                />
              </div>
              
              {/* Game board */}
              <div className="w-full mb-3">
                <Board 
                  gameState={state} 
                  onMove={moveInDirection}
                />
              </div>
              
              {/* Win modal */}
              <WinModal 
                isOpen={state.won && !state.achieved4096 && !state.achieved8192}
                onClose={handleCloseWinModal}
                onNewGame={startNewGame}
                onContinue={handleCloseWinModal}
                onViewStats={handleViewStats}
                score={state.score}
                time={formattedTime}
              />
              
              {/* Advanced Win Modal for 4096 */}
              <AdvancedWinModal 
                isOpen={state.won && state.achieved4096 && !state.achieved8192}
                onClose={handleCloseWinModal}
                onNewGame={startNewGame}
                onContinue={handleCloseWinModal}
                onViewStats={handleViewStats}
                score={state.score}
                time={formattedTime}
                achievementLevel="4096"
              />
              
              {/* Advanced Win Modal for 8192 */}
              <AdvancedWinModal 
                isOpen={state.won && state.achieved8192}
                onClose={handleCloseWinModal}
                onNewGame={startNewGame}
                onContinue={handleCloseWinModal}
                onViewStats={handleViewStats}
                score={state.score}
                time={formattedTime}
                achievementLevel="8192"
              />
              
              {/* Lose modal */}
              <LoseModal 
                isOpen={state.over && !state.won}
                onClose={startNewGame}
                onNewGame={startNewGame}
                onViewStats={handleViewStats}
                score={state.score}
                time={formattedTime}
              />
            </>
          ) : (
            <StatsDashboard onBack={handleBackFromStats} />
          )}
        </div>
      </div>
      
      {/* Fixed height spacer */}
      <div className="h-8"></div>
      
      {/* Footer with proper spacing - always visible */}
      <div className={footerContainerClass}>
        <GameFooter />
      </div>
      
      {/* Toast notifications */}
      <Toaster position="bottom-center" />
    </div>
  );
}
