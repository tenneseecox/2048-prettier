import { useEffect, useRef, useCallback } from 'react';
import { Direction } from '@/types/game';

// Reduced threshold for faster swipe detection
const SWIPE_THRESHOLD = 30; 

export function useSwipeDetection(elementRef: React.RefObject<HTMLElement>, onSwipe: (direction: Direction) => void) {
  // Use refs instead of state for better performance during fast gameplay
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const touchEndX = useRef(0);
  const touchEndY = useRef(0);
  
  // Handle touch start
  const handleTouchStart = useCallback((e: TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    touchEndX.current = e.touches[0].clientX; // Initialize end position to start position
    touchEndY.current = e.touches[0].clientY;
  }, []);
  
  // Handle touch move
  const handleTouchMove = useCallback((e: TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
    touchEndY.current = e.touches[0].clientY;
    
    // Optional: Process swipe during move for even faster response
    // Uncomment if you want swipe to trigger during movement rather than on touch end
    /*
    const deltaX = touchEndX.current - touchStartX.current;
    const deltaY = touchEndY.current - touchStartY.current;
    const isHorizontalSwipe = Math.abs(deltaX) > Math.abs(deltaY);
    
    if (Math.max(Math.abs(deltaX), Math.abs(deltaY)) >= SWIPE_THRESHOLD) {
      let direction: Direction;
      
      if (isHorizontalSwipe) {
        direction = deltaX > 0 ? 'right' : 'left';
      } else {
        direction = deltaY > 0 ? 'down' : 'up';
      }
      
      // Reset to prevent multiple triggers
      touchStartX.current = touchEndX.current;
      touchStartY.current = touchEndY.current;
      
      onSwipe(direction);
    }
    */
  }, []);
  
  // Handle touch end
  const handleTouchEnd = useCallback(() => {
    // Calculate the horizontal and vertical distances
    const deltaX = touchEndX.current - touchStartX.current;
    const deltaY = touchEndY.current - touchStartY.current;
    
    // Determine if the swipe was horizontal or vertical
    const isHorizontalSwipe = Math.abs(deltaX) > Math.abs(deltaY);
    
    // Only process swipes with sufficient distance
    if (Math.max(Math.abs(deltaX), Math.abs(deltaY)) >= SWIPE_THRESHOLD) {
      let direction: Direction;
      
      if (isHorizontalSwipe) {
        direction = deltaX > 0 ? 'right' : 'left';
      } else {
        direction = deltaY > 0 ? 'down' : 'up';
      }
      
      onSwipe(direction);
    }
  }, [onSwipe]);
  
  // Attach event listeners with passive option for better performance
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    
    // Using passive: true for better performance on mobile
    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: true });
    element.addEventListener('touchend', handleTouchEnd);
    
    // Cleanup on unmount
    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [elementRef, handleTouchStart, handleTouchMove, handleTouchEnd]);
} 