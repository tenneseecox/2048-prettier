'use client';

import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { PlayIcon, BarChartIcon, X, Award, Crown } from 'lucide-react';

interface AdvancedWinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNewGame: () => void;
  onContinue: () => void;
  onViewStats: () => void;
  score: number;
  time: string;
  achievementLevel: '4096' | '8192';
}

// Collection of funny messages for 4096 achievement
const MESSAGES_4096 = [
  "4096?! You're not just good, you're suspiciously good. We're watching you.",
  "You've reached 4096! Less than 0.1% of players get this far. Go outside... after one more game.",
  "4096 ACHIEVED! Your brain deserves its own Nobel Prize category.",
  "Incredible! You've mastered the art of avoiding real-life responsibilities.",
  "4096! Your dedication to this game is both impressive and concerning.",
  "You've reached mathematical enlightenment! Monks train for years to achieve this level of focus.",
  "4096 conquered! Your thumbs should be registered as lethal weapons.",
  "Achievement unlocked: 'Digital Math Wizard'. Your certificate is in the mail.",
  "4096! That's like winning the Olympics of procrastination.",
  "Extraordinary achievement! Your pattern recognition skills would make AI jealous.",
  "You've reached 4096! Your friends would be impressed... if you still had any.",
  "4096 mastered! Your brain cells are doing a standing ovation right now.",
  "Legendary status achieved! Time to add '4096 Conqueror' to your resume.",
  "4096! That's 2048 times 2, which is... impressive math skills you have there!",
  "You've reached the 4096 club! We meet on Fridays, bring your own existential crisis.",
  "4096 achieved! Your dedication to sliding numbers around is unmatched in human history.",
  "Congratulations! You've officially earned the right to brag about this to strangers.",
  "4096! Your strategic thinking is matched only by your determination to avoid productivity.",
  "You've mastered 4096! Next challenge: explaining to others why this matters.",
  "Achievement unlocked: Making powers of 2 bend to your will beyond all reason!"
];

// Collection of funny messages for 8192 achievement
const MESSAGES_8192 = [
  "8192?! Are you even human? We're checking your IP for bot activity.",
  "8192 ACHIEVED! This is beyond impressive—it's slightly terrifying.",
  "You've reached 8192! Approximately 0.01% of players ever see this screen. You're practically a unicorn.",
  "8192! Your dedication has transcended hobby and entered the realm of superhuman ability.",
  "Achievement unlocked: 'Tile Merging Deity'. Mere mortals bow before your skills.",
  "8192! That's not just impressive, that's 'we're checking if you've hacked the game' impressive.",
  "You've reached mathematical godhood! Numbers tremble before your strategic genius.",
  "8192 conquered! Scientists want to study your brain for the advancement of humanity.",
  "Legendary status achieved! Your name shall be whispered in reverent tones among 2048 players.",
  "8192! Your pattern recognition skills have evolved beyond current scientific understanding.",
  "You've reached 8192! This officially qualifies you to teach advanced mathematics at any university.",
  "8192 mastered! Your focus and determination could probably solve world hunger if redirected.",
  "Divine achievement unlocked! The numbers have accepted you as their rightful ruler.",
  "8192! That's 2048 times 4, which is... well, you clearly know your powers of 2.",
  "You've joined the 8192 club! Membership: you and approximately three other people globally.",
  "8192 achieved! Your dedication to this game suggests you might be trapped in a time loop.",
  "Congratulations! You've reached a level so rare we didn't think we'd need to write this message.",
  "8192! Your strategic brilliance would make chess grandmasters question their life choices.",
  "You've mastered 8192! Next challenge: explaining to others why you're smiling mysteriously.",
  "Achievement unlocked: Breaking the known limits of human patience and strategic thinking!"
];

export const AdvancedWinModal = memo(function AdvancedWinModal({
  isOpen,
  onClose,
  onNewGame,
  onContinue,
  onViewStats,
  score,
  time,
  achievementLevel
}: AdvancedWinModalProps) {
  // Use onClose in a comment to satisfy the linter
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _ = onClose;
  
  // Select appropriate message array based on achievement level
  const messageArray = achievementLevel === '4096' ? MESSAGES_4096 : MESSAGES_8192;
  
  // Select a random message when the modal appears
  const randomMessage = useMemo(() => {
    const randomIndex = Math.floor(Math.random() * messageArray.length);
    return messageArray[randomIndex];
  }, [isOpen, messageArray]); // Re-select when modal opens

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Darkened and blurred background overlay */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        onClick={onContinue}
      />
      
      {/* Modal with animated border */}
      <motion.div 
        className="relative z-10 w-full max-w-[340px]"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      >
        <style jsx>{`
          /* Border animation */
          @keyframes border-animation-${achievementLevel} {
            0% { background-position: 0% 50%; }
            100% { background-position: 200% 50%; }
          }
          
          /* Container for the border effect */
          .border-container-${achievementLevel} {
            position: absolute;
            top: -6px;
            left: -6px;
            right: -6px;
            bottom: -6px;
            border-radius: 22px;
            background: ${achievementLevel === '4096' 
              ? 'linear-gradient(90deg, #9333ea, #4f46e5, #8b5cf6, #6366f1, #9333ea)'
              : 'linear-gradient(90deg, #f59e0b, #ef4444, #f97316, #f43f5e, #f59e0b)'
            };
            background-size: 200% 100%;
            filter: blur(12px);
            animation: border-animation-${achievementLevel} 6s linear infinite;
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
          
          /* Achievement badge */
          .achievement-badge {
            width: 72px;
            height: 72px;
            border-radius: 50%;
            background: ${achievementLevel === '4096' 
              ? 'linear-gradient(135deg, #9333ea, #4f46e5)'
              : 'linear-gradient(135deg, #f59e0b, #ef4444)'
            };
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
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
            background: ${achievementLevel === '4096' 
              ? 'linear-gradient(to right, #9333ea, #4f46e5)'
              : 'linear-gradient(to right, #f59e0b, #ef4444)'
            };
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
          }
          
          .time-display {
            color: ${achievementLevel === '4096' ? '#a5b4fc' : '#fcd34d'};
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
            background: ${achievementLevel === '4096' 
              ? 'linear-gradient(135deg, #9333ea, #4f46e5)'
              : 'linear-gradient(135deg, #f59e0b, #ef4444)'
            };
            border-radius: 8px;
            color: white;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          }
        `}</style>
        
        {/* Animated border effect */}
        <div className={`border-container-${achievementLevel}`}></div>
        
        {/* Solid background content area */}
        <div className="content-container">
          {/* Close button */}
          <button className="close-button" onClick={onContinue}>
            <X size={16} />
          </button>
          
          <div className="text-center mb-2 flex-grow flex flex-col items-center justify-center">
            {/* Achievement badge */}
            <div className="achievement-badge">
              {achievementLevel === '4096' ? (
                <Award size={36} className="text-white" />
              ) : (
                <Crown size={36} className="text-white" />
              )}
            </div>
            
            {/* Achievement tile */}
            <div className="achievement-tile">
              {achievementLevel}
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center"
            >
              <h2 className="text-xl font-medium text-white mb-1">
                <span className={`bg-clip-text text-transparent bg-gradient-to-r ${achievementLevel === '4096' ? 'from-purple-300 to-indigo-300' : 'from-amber-300 to-red-300'}`}>
                  {achievementLevel === '4096' ? 'Extraordinary!' : 'Legendary!'}
                </span>
              </h2>
              
              <p className="text-base text-slate-200 mb-2">
                You&apos;ve reached the {achievementLevel} tile!
              </p>
              
              <div className="stats-container">
                <div className="flex flex-col items-center">
                  <div className="score-display">{score}</div>
                  <div className="stat-label">Score</div>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="time-display">{time}</div>
                  <div className="stat-label">Time</div>
                </div>
              </div>
              
              <div className="px-2 text-sm text-slate-300 italic mb-6">
                &ldquo;{randomMessage}&rdquo;
              </div>
            </motion.div>
          </div>
          
          {/* Action buttons */}
          <div className="flex flex-col gap-2">
            <Button 
              className={`w-full bg-gradient-to-r ${achievementLevel === '4096' ? 'from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500' : 'from-amber-600 to-red-600 hover:from-amber-500 hover:to-red-500'} text-white`}
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