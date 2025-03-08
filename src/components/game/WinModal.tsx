'use client';

import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { PlayIcon, BarChartIcon, X, Trophy } from 'lucide-react';

interface WinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNewGame: () => void;
  onContinue: () => void;
  onViewStats: () => void;
  score: number;
  time: string; // Time it took to reach 2048
}

// Collection of funny messages that will randomly display
const FUNNY_MESSAGES = [
  "Only 1% of players reach this. Maybe you should go touch grass.",
  "Congrats! You've officially spent too much time sliding tiles around.",
  "Achievement unlocked: 2048! Your productivity today: -100%",
  "You've reached 2048! Your friends would be impressed... if you told them.",
  "2048 achieved! That's either impressive or concerning, we're not sure.",
  "You're in the top 1% of players! Your parents must be so... confused.",
  "2048! That's like winning the nerd Olympics. Wear that medal proudly.",
  "Impressive! Now imagine if you applied this focus to literally anything else.",
  "You've mastered 2048! Next challenge: remembering what sunlight feels like.",
  "Elite status achieved! Your brain cells thank you, your schedule does not.",
  "You've joined the 2048 club! We meet on Thursdays, bring snacks.",
  "2048 achieved! Your brain cells are doing a victory dance right now.",
  "Impressive! Your puzzle-solving skills would make Einstein nod approvingly.",
  "You've reached mathematical greatness! Or you're just really stubborn. Either way, bravo!",
  "2048 unlocked! Your dedication to not doing actual work is admirable.",
  "Congratulations! You now qualify for the 'Suspiciously Good at Merging Numbers' award.",
  "Achievement unlocked: Making numbers do what you want! If only budgeting was this fun.",
  "You've mastered 2048! Next challenge: explaining to others why this is exciting.",
  "Welcome to the 1% club! We don't have jackets, just bragging rights.",
  "Your tile-merging skills are officially legendary. Use this power wisely.",
  "2048 reached! Your fingers deserve a tiny vacation after all that swiping.",
  "Puzzle master status: confirmed! Your brain thanks you for the workout.",
  "You did it! The numbers have officially surrendered to your strategic genius.",
  "Congratulations on your digital math wizardry! Real-world math may still apply.",
  "2048 achieved! Somewhere, a mathematics professor is inexplicably proud.",
  "You've conquered 2048! Feel free to add this to your resume under 'Special Skills'.",
  "Success! Your dedication to this game is both impressive and slightly concerning.",
  "2048 mastered! Your pattern recognition skills would make AI jealous.",
  "Achievement unlocked: Making powers of 2 bend to your will!",
  "Congratulations! You've officially earned the right to humble-brag about this.",
  "You've reached 2048! Your thumbs should be considered lethal weapons now.",
  "Math victory achieved! No calculators were harmed in this accomplishment.",
  "2048 conquered! Your brain deserves a trophy and possibly a nap.",
  "You've joined an elite group of players who really, really like merging numbers.",
  "Impressive win! Your strategic thinking is matched only by your determination to procrastinate.",
  "Congratulations! This witty message was definitely crafted by a human developer who spent hours being creative and not at all by an AI that was told to 'be funny'."
];

export const WinModal = memo(function WinModal({
  isOpen,
  onClose,
  onNewGame,
  onContinue,
  onViewStats,
  score,
  time
}: WinModalProps) {
  // Use onClose in a comment to satisfy the linter
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _ = onClose;
  
  // Select a random message when the modal appears
  const randomMessage = useMemo(() => {
    const randomIndex = Math.floor(Math.random() * FUNNY_MESSAGES.length);
    return FUNNY_MESSAGES[randomIndex];
  }, [isOpen]); // Re-select when modal opens

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Darkened and blurred background overlay */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={onContinue}
      />
      
      {/* Modal with rainbow border */}
      <motion.div 
        className="relative z-10 w-full max-w-[340px]"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      >
        <style jsx>{`
          /* Rainbow border animation */
          @keyframes rainbow-move {
            0% { background-position: 0% 50%; }
            100% { background-position: 200% 50%; }
          }
          
          /* Container for the rainbow border effect */
          .border-container {
            position: absolute;
            top: -6px;
            left: -6px;
            right: -6px;
            bottom: -6px;
            border-radius: 22px;
            background: linear-gradient(
              90deg,
              #ff3b30,
              #ff9500,
              #ffcc00,
              #4cd964,
              #5ac8fa,
              #007aff,
              #af52de,
              #ff3b30
            );
            background-size: 200% 100%;
            filter: blur(12px);
            animation: rainbow-move 6s linear infinite;
            z-index: -1;
          }
          
          /* Solid background content area */
          .content-container {
            position: relative;
            border-radius: 16px;
            background: rgba(10, 15, 30, 0.9);
            backdrop-filter: blur(12px);
            padding: 28px 24px;
            z-index: 1;
            box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);
            display: flex;
            flex-direction: column;
            min-height: 420px;
          }
          
          /* Custom close button */
          .close-button {
            position: absolute;
            top: 12px;
            right: 12px;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: rgba(255, 255, 255, 0.7);
            background: rgba(255, 255, 255, 0.1);
            border: none;
            cursor: pointer;
            transition: all 0.2s ease;
            z-index: 10;
          }
          
          .close-button:hover {
            background: rgba(255, 255, 255, 0.2);
            color: rgba(255, 255, 255, 1);
          }
          
          /* Trophy badge */
          .trophy-badge {
            width: 64px;
            height: 64px;
            border-radius: 50%;
            background: linear-gradient(135deg, #ffcc00, #ff9500);
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px;
            box-shadow: 0 4px 12px rgba(255, 204, 0, 0.3);
          }
          
          /* Score and time display */
          .stats-container {
            display: flex;
            align-items: flex-start;
            justify-content: center;
            gap: 40px;
            margin: 16px 0 24px;
          }
          
          .score-display, .time-display {
            font-size: 32px;
            font-weight: 600;
            text-align: center;
            line-height: 1;
          }
          
          .score-display {
            background: linear-gradient(to right, #3b82f6, #8b5cf6);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
          }
          
          .time-display {
            color: #5eead4;
          }
          
          .stat-label {
            font-size: 12px;
            color: rgba(148, 163, 184, 0.8);
            margin-top: 4px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            text-align: center;
          }
          
          /* Achievement tile */
          .achievement-tile {
            font-size: 24px;
            font-weight: 700;
            width: 80px;
            height: 80px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 16px;
            background: linear-gradient(135deg, #3b82f6, #8b5cf6);
            border-radius: 8px;
            color: white;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          }
        `}</style>
        
        {/* Rainbow border effect */}
        <div className="border-container"></div>
        
        {/* Solid background content area */}
        <div className="content-container">
          {/* Close button */}
          <button className="close-button" onClick={onContinue}>
            <X size={16} />
          </button>
          
          <div className="text-center mb-2 flex-grow flex flex-col items-center justify-center">
            {/* Trophy badge */}
            <div className="trophy-badge">
              <Trophy size={32} className="text-white" />
            </div>
            
            {/* Achievement tile */}
            <div className="achievement-tile">
              2048
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center"
            >
              <h2 className="text-xl font-medium text-white mb-1">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-indigo-400">
                  Congratulations!
                </span>
              </h2>
              
              <p className="text-base text-slate-200 mb-2">
                You&apos;ve reached the 2048 tile!
              </p>
              
              <div className="stats-container">
                <div className="flex flex-col items-center">
                  <div className="score-display">{score}</div>
                  <div className="stat-label">Score</div>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="time-display">
                    {time}
                  </div>
                  <div className="stat-label">Time</div>
                </div>
              </div>
              
              <div className="px-2 text-sm text-slate-300 italic mb-6">
                &ldquo;{randomMessage}&rdquo;
              </div>
            </motion.div>
          </div>
          
          {/* Action buttons - updated to match AdvancedWinModal */}
          <div className="flex flex-col gap-2">
            <Button 
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white"
              onClick={onContinue}
            >
              <PlayIcon className="mr-2 h-4 w-4" />
              Continue Playing
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
              onClick={onViewStats}
            >
              <BarChartIcon className="mr-2 h-4 w-4" />
              View Stats
            </Button>
            
            <Button 
              variant="ghost" 
              className="w-full text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              onClick={onNewGame}
            >
              New Game
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}); 