'use client';

import { memo, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrophyIcon, HashIcon, ClockIcon } from 'lucide-react';

interface ScoreBoardProps {
  score: number;
  bestScore: number;
  timer?: string;
}

export const ScoreBoard = memo(function ScoreBoard({ score, bestScore, timer }: ScoreBoardProps) {
  return (
    <div className="grid grid-cols-3 w-full text-center rounded-md bg-slate-900/70 border border-slate-800/90 shadow-sm overflow-hidden">
      <ScoreItem 
        key={`score-${score}`}
        icon={<HashIcon className="h-4 w-4" />}
        label="SCORE"
        value={score}
        highlight={score > 0}
      />
      
      <ScoreItem 
        key={`best-${bestScore}`}
        icon={<TrophyIcon className="h-4 w-4" />}
        label="BEST"
        value={bestScore}
      />
      
      <ScoreItem 
        key={`timer-${timer}`}
        icon={<ClockIcon className="h-4 w-4" />}
        label="TIME"
        valueText={timer || '00:00'}
        isTimer={true}
      />
    </div>
  );
});

interface ScoreItemProps {
  icon: React.ReactNode;
  label: string;
  value?: number;
  valueText?: string;
  highlight?: boolean;
  isTimer?: boolean;
}

// Memoize the ScoreItem component to prevent unnecessary re-renders
const ScoreItem = memo(function ScoreItem({ 
  icon, 
  label, 
  value, 
  valueText, 
  highlight = false, 
  isTimer = false 
}: ScoreItemProps) {
  // Memoize the display value to prevent recalculation
  const displayValue = useMemo(() => 
    valueText || (value !== undefined ? value.toString() : '0'),
    [valueText, value]
  );
  
  // Memoize the class name to prevent recalculation
  const valueClassName = useMemo(() => 
    `font-bold text-lg ${highlight ? "text-blue-400" : "text-slate-200"}`,
    [highlight]
  );
  
  // Optimize by conditionally rendering based on isTimer
  if (isTimer) {
    // Timer doesn't need animation
    return (
      <div className="py-2 px-3 flex flex-col items-center justify-center">
        <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
          {icon}
          <span>{label}</span>
        </div>
        <div className={valueClassName}>
          {displayValue}
        </div>
      </div>
    );
  }
  
  // Score values get subtle animations
  return (
    <div className="py-2 px-3 flex flex-col items-center justify-center">
      <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
        {icon}
        <span>{label}</span>
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={`${label}-${displayValue}`}
          initial={{ opacity: 0.8, y: -2 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0.8, y: 2 }}
          transition={{ duration: 0.15 }}
          className={valueClassName}
        >
          {displayValue}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}); 