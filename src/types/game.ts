export type TileValue = 2 | 4 | 8 | 16 | 32 | 64 | 128 | 256 | 512 | 1024 | 2048 | 4096 | 8192 | 16384 | 32768 | 65536 | null;

export interface Tile {
  id: string;
  value: Exclude<TileValue, null>;
  position: Position;
  mergedFrom?: Tile[];
  isNew?: boolean;
}

export interface Position {
  x: number;
  y: number;
}

export interface Vector {
  x: number;
  y: number;
}

export type Direction = 'up' | 'right' | 'down' | 'left';

export interface GameState {
  board: (Tile | null)[][];
  score: number;
  bestScore: number;
  won: boolean;
  over: boolean;
  tilesToRemove: Tile[];
  tilesToAdd: Tile[];
  moved: boolean;
  achievedMilestones?: number[];
}

export type GameAction = 
  | { type: 'INITIALIZE' }
  | { type: 'LOAD_SAVED_STATE' }
  | { type: 'MOVE', direction: Direction }
  | { type: 'NEW_GAME' }
  | { type: 'CONTINUE_GAME' };

export interface AnimationState {
  isAnimating: boolean;
  tilePositions: Map<string, Position>;
} 