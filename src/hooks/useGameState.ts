import { useReducer, useEffect, useCallback, useState, useMemo } from 'react';
import { GameAction, GameState, Direction } from '@/types/game';
import { createInitialGameState, move } from '@/lib/gameLogic';
import { toast } from 'sonner';

// Local storage keys
const STORAGE_KEYS = {
  BEST_SCORE: '2048-prettier-best-score',
  GAME_STATE: '2048-prettier-game-state',
  TIMER: '2048-prettier-timer'
};

// Only major milestone values get toast notifications
const MILESTONE_VALUES = [256, 512, 1024, 2048, 4096, 8192];

// Load game state from localStorage
const loadGameState = (): GameState | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    const savedState = localStorage.getItem(STORAGE_KEYS.GAME_STATE);
    if (!savedState) return null;
    
    const parsedState = JSON.parse(savedState) as GameState;
    // Validate the loaded state has the correct structure
    if (!parsedState.board || !Array.isArray(parsedState.board)) {
      return null;
    }
    
    return parsedState;
  } catch (error) {
    console.error('Error loading game state:', error);
    return null;
  }
};

// Save game state to localStorage
const saveGameState = (state: GameState): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEYS.GAME_STATE, JSON.stringify(state));
  } catch (error) {
    console.error('Error saving game state:', error);
  }
};

// Load timer from localStorage
const loadTimer = (): number => {
  if (typeof window === 'undefined') return 0;
  
  try {
    const savedTimer = localStorage.getItem(STORAGE_KEYS.TIMER);
    return savedTimer ? parseInt(savedTimer, 10) : 0;
  } catch (error) {
    console.error('Error loading timer:', error);
    return 0;
  }
};

// Save timer to localStorage
const saveTimer = (time: number): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEYS.TIMER, time.toString());
  } catch (error) {
    console.error('Error saving timer:', error);
  }
};

// Load best score from localStorage
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

// Create initial game state
const createInitialPersistedState = (): GameState => {
  const initialState = createInitialGameState();
  return {
    ...initialState,
    bestScore: 0, // Will be updated after mount
    achievedMilestones: [],
    achieved4096: false,
    achieved8192: false
  };
};

// Game state reducer
function gameReducer(state: GameState, action: GameAction): GameState {
  let newState: GameState;
  
  switch (action.type) {
    case 'INITIALIZE':
      newState = createInitialPersistedState();
      break;
      
    case 'LOAD_SAVED_STATE':
      const savedState = loadGameState();
      if (savedState) {
        newState = {
          ...savedState,
          bestScore: Math.max(savedState.bestScore, loadBestScore())
        };
      } else {
        newState = {
          ...createInitialPersistedState(),
          bestScore: loadBestScore()
        };
      }
      break;
      
    case 'MOVE':
      // Create a deep copy of the current state
      newState = JSON.parse(JSON.stringify(state)) as GameState;
      
      // Store previous values for comparison
      const previousBestScore = newState.bestScore;
      const previousScore = newState.score;
      
      // Apply move and update state
      move(newState, action.direction);
      
      // Force a re-render if score changed
      if (newState.score !== previousScore) {
        // Score changed, ensure UI updates
        newState = { ...newState };
      }
      
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
      
      // Check for milestone achievements
      newState.tilesToAdd.forEach(tile => {
        // Check for 4096 and 8192 achievements
        if (tile.value === 4096) {
          newState.achieved4096 = true;
          newState.won = true;
          newState.winAcknowledged = false;
        } else if (tile.value === 8192) {
          newState.achieved8192 = true;
          newState.won = true;
          newState.winAcknowledged = false;
        }
        
        if (MILESTONE_VALUES.includes(tile.value) && !newState.achievedMilestones?.includes(tile.value)) {
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
      break;
      
    case 'NEW_GAME':
      // Start a new game while preserving best score
      newState = {
        ...createInitialGameState(),
        bestScore: state.bestScore,
        achievedMilestones: [], // Reset milestones for the new game
        achieved4096: false,    // Reset 4096 achievement
        achieved8192: false     // Reset 8192 achievement
      };
      break;
      
    case 'CONTINUE_GAME':
      // Continue playing after winning
      newState = {
        ...state,
        won: false,
        winAcknowledged: true, // Mark that the player has acknowledged the win
        // Keep the achievement flags so we don't show the same modal again
      };
      break;
      
    case 'SIMULATE_WIN':
      // Simulate winning the game
      newState = {
        ...state,
        won: true,
        winAcknowledged: false, // Set to false to show the win modal
      };
      break;
      
    case 'SIMULATE_LOSE':
      // Simulate losing the game
      newState = {
        ...state,
        over: true,
        won: false,
      };
      break;
      
    case 'SIMULATE_4096':
      // Simulate achieving 4096 tile
      newState = {
        ...state,
        won: true,
        achieved4096: true,
        winAcknowledged: false,
      };
      break;
      
    case 'SIMULATE_8192':
      // Simulate achieving 8192 tile
      newState = {
        ...state,
        won: true,
        achieved8192: true,
        winAcknowledged: false,
      };
      break;
      
    default:
      return state;
  }
  
  // Auto-save state after each action (except INITIALIZE)
  if (action.type !== 'INITIALIZE') {
    saveGameState(newState);
  }
  return newState;
}

// Custom hook for game state management
export function useGameState() {
  // Initialize with a clean state for SSR
  const [state, dispatch] = useReducer(gameReducer, null, createInitialPersistedState);
  
  // Timer state
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  
  // Load persisted state after mount
  useEffect(() => {
    dispatch({ type: 'LOAD_SAVED_STATE' });
    setTimer(loadTimer());
  }, []);
  
  // Save timer whenever it changes
  useEffect(() => {
    if (timer > 0) { // Only save non-zero timer values
      saveTimer(timer);
    }
  }, [timer]);
  
  // Start/stop timer based on game state
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
    
    // Stop timer when game is over or won
    if (state.over || state.won) {
      setIsTimerRunning(false);
    }
    
    // Resume timer if continuing after win
    if (state.winAcknowledged && !state.over && !isTimerRunning && state.moved) {
      setIsTimerRunning(true);
    }
  }, [state.moved, state.score, state.over, state.won, state.winAcknowledged, isTimerRunning]);
  
  // Timer interval
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer(prevTimer => {
          const newTimer = prevTimer + 1;
          saveTimer(newTimer);
          return newTimer;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning]);
  
  // Handle keyboard events - already optimized with useCallback
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (state.over) return;
    
    // Debug hotkey to simulate win (Shift+K)
    if (event.key === 'K' && event.shiftKey) {
      event.preventDefault();
      dispatch({ type: 'SIMULATE_WIN' });
      return;
    }
    
    // Debug hotkey to simulate lose (Shift+L)
    if (event.key === 'L' && event.shiftKey) {
      event.preventDefault();
      dispatch({ type: 'SIMULATE_LOSE' });
      return;
    }
    
    // Debug hotkey to simulate 4096 achievement (Shift+N)
    if (event.key === 'N' && event.shiftKey) {
      event.preventDefault();
      dispatch({ type: 'SIMULATE_4096' });
      return;
    }
    
    // Debug hotkey to simulate 8192 achievement (Shift+M)
    if (event.key === 'M' && event.shiftKey) {
      event.preventDefault();
      dispatch({ type: 'SIMULATE_8192' });
      return;
    }
    
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
  }, [state.over, dispatch]);
  
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
    // Toast removed - now using LoseModal instead
  }, [state.over]);
  
  // Show toast when game is won (only once)
  useEffect(() => {
    // Toast removed to avoid duplication with modal
    // The modal now serves as the notification for reaching 2048
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
  }), [
    state, 
    state.score, // Explicitly include score in dependency array
    timer, 
    formattedTime, 
    moveInDirection, 
    startNewGame, 
    continueGame
  ]);
} 