'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3Icon, ArrowLeftIcon } from 'lucide-react';

interface StatsDashboardProps {
  onBack: () => void;
}

export const StatsDashboard = memo(function StatsDashboard({ onBack }: StatsDashboardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full flex flex-col gap-4"
    >
      <div className="flex items-center justify-between mb-2">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onBack}
          className="text-slate-400 hover:text-slate-300"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to Game
        </Button>
        
        <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
          Game Statistics
        </h2>
      </div>
      
      <Card className="w-full p-8 flex flex-col items-center justify-center bg-slate-900/80 border-slate-800/80 min-h-[300px]">
        <BarChart3Icon className="h-16 w-16 text-slate-700 mb-4" />
        
        <h3 className="text-xl font-bold text-slate-300 mb-2">
          Statistics Coming Soon
        </h3>
        
        <p className="text-slate-400 text-center max-w-md">
          We&apos;re working on tracking your game statistics and achievements.
          Check back soon for detailed insights into your 2048 performance!
        </p>
      </Card>
    </motion.div>
  );
}); 