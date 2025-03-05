import { useReducer, useEffect, useCallback, useState, useMemo } from 'react';
import { GameAction, GameState, Direction } from '@/types/game';
import { createInitialGameState, move } from '@/lib/gameLogic';
import { toast } from 'sonner';

// Local storage keys
const STORAGE_KEYS = {
  BEST_SCORE: '2048-prettier-best-score',
  GAME_STATE: '2048-prettier-game-state'
};

// Only major milestone values get toast notifications
const MILESTONE_VALUES = [256, 512, 1024, 2048, 4096, 8192];

// Load best score from localStorage - memoized to avoid repeated parsing
const loadBestScore = (): number => {
  if (typeof window === 'undefined') return 0;
  
  try {
    const savedScore = localStorage.getItem(STORAGE_KEYS.BEST_SCORE);
    return savedScore ? parseInt(savedScore, 10) : 0;
  } catch (error) {
    console.error('Error loading best score:', error);
    return 0;
  }
};

// Save best score to localStorage
const saveBestScore = (score: number): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEYS.BEST_SCORE, score.toString());
  } catch (error) {
    console.error('Error saving best score:', error);
  }
};

// Create initial game state with persisted best score
const createPersistedGameState = (): GameState => {
  const initialState = createInitialGameState();
  return {
    ...initialState,
    bestScore: loadBestScore()
  };
};

// Game state reducer
function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'INITIALIZE':
      // Initialize or reset game state with persisted best score
      return createPersistedGameState();
      
    case 'MOVE':
      // Create a deep copy of the current state
      const newState = JSON.parse(JSON.stringify(state)) as GameState;
      
      // Store previous values for comparison
      const previousBestScore = newState.bestScore;
      
      // Apply move and update state
      move(newState, action.direction);
      
      // Update best score if needed
      if (newState.score > newState.bestScore) {
        newState.bestScore = newState.score;
        saveBestScore(newState.score);
        
        // Only show best score toast when it's a significant improvement (100+ points)
        if (newState.bestScore > previousBestScore + 100) {
          toast.success('New Best Score!', {
            description: `${newState.bestScore} points`,
            duration: 1500
          });
        }
      }
      
      // Check for milestone achievements ONLY for significant tiles
      // and only if they haven't been achieved in this game session
      newState.tilesToAdd.forEach(tile => {
        if (MILESTONE_VALUES.includes(tile.value) && !newState.achievedMilestones?.includes(tile.value)) {
          // Add this milestone to the current game's achieved milestones
          if (!newState.achievedMilestones) {
            newState.achievedMilestones = [];
          }
          newState.achievedMilestones.push(tile.value);
          
          const emoji = tile.value >= 1024 ? '🔥' : (tile.value >= 512 ? '🎯' : '👏');
          
          toast.success(`${emoji} ${tile.value} Tile!`, {
            description: tile.value >= 1024 ? "Amazing achievement!" : "Great job!",
            duration: 1500
          });
        }
      });
      
      return newState;
      
    case 'NEW_GAME':
      // Start a new game while preserving best score
      // Reset achieved milestones for the new game
      return {
        ...createPersistedGameState(),
        achievedMilestones: [] // Reset milestones for the new game
      };
      
    case 'CONTINUE_GAME':
      // Continue playing after winning
      return {
        ...state,
        won: false,
      };
      
    default:
      return state;
  }
}

// Custom hook for game state management
export function useGameState() {
  // Initialize game state using reducer
  const [state, dispatch] = useReducer(gameReducer, null, () => ({
    ...createPersistedGameState(),
    achievedMilestones: [] // Initialize with empty achievements for this game session
  }));
  
  // Timer state
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  
  // Start timer when game starts
  useEffect(() => {
    // Start timer on first move
    if (state.moved && !isTimerRunning) {
      setIsTimerRunning(true);
    }
    
    // Reset timer on new game
    if (!state.moved && state.score === 0) {
      setTimer(0);
      setIsTimerRunning(false);
    }
    
    // Stop timer when game is over
    if (state.over) {
      setIsTimerRunning(false);
    }
  }, [state.moved, state.score, state.over, isTimerRunning]);
  
  // Timer interval - optimized with useCallback
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer(prevTimer => prevTimer + 1);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning]);
  
  // Handle keyboard events - already optimized with useCallback
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (state.over) return;
    
    let direction: Direction | null = null;
    
    // Arrow keys
    if (event.key === 'ArrowUp') direction = 'up';
    else if (event.key === 'ArrowRight') direction = 'right';
    else if (event.key === 'ArrowDown') direction = 'down';
    else if (event.key === 'ArrowLeft') direction = 'left';
    
    // WASD keys
    else if (event.key === 'w' || event.key === 'W') direction = 'up';
    else if (event.key === 'd' || event.key === 'D') direction = 'right';
    else if (event.key === 's' || event.key === 'S') direction = 'down';
    else if (event.key === 'a' || event.key === 'A') direction = 'left';
    
    if (direction) {
      event.preventDefault();
      dispatch({ type: 'MOVE', direction });
    }
  }, [state.over]);
  
  // Set up event listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    
    // Cleanup on unmount
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
  
  // Show toast when game is over (only once)
  useEffect(() => {
    if (state.over) {
      toast.error('Game Over!', {
        description: `Final score: ${state.score} | Time: ${formatTime(timer)}`,
        duration: 3000
      });
    }
  }, [state.over, state.score, timer]);
  
  // Show toast when game is won (only once)
  useEffect(() => {
    if (state.won) {
      toast.success('You reached 2048!', {
        description: 'Continue playing to reach even higher scores!',
        duration: 3000
      });
    }
  }, [state.won]);
  
  // Format timer as MM:SS - memoized to avoid recalculation
  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);
  
  // Memoize formatted time to prevent unnecessary recalculations
  const formattedTime = useMemo(() => formatTime(timer), [formatTime, timer]);
  
  // Actions to expose - already optimized with useCallback
  const moveInDirection = useCallback((direction: Direction) => {
    dispatch({ type: 'MOVE', direction });
  }, []);
  
  const startNewGame = useCallback(() => {
    dispatch({ type: 'NEW_GAME' });
  }, []);
  
  const continueGame = useCallback(() => {
    dispatch({ type: 'CONTINUE_GAME' });
  }, []);
  
  // Memoize the return value to prevent unnecessary re-renders
  return useMemo(() => ({
    state,
    timer,
    formattedTime,
    moveInDirection,
    startNewGame,
    continueGame,
  }), [state, timer, formattedTime, moveInDirection, startNewGame, continueGame]);
} 