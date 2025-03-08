import { Direction, GameState, Position, Tile, TileValue } from "@/types/game";

// Cache for vectors to avoid recreating them
const DIRECTION_VECTORS = {
  up: { x: 0, y: -1 },
  right: { x: 1, y: 0 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 }
};

// Pre-computed traversal indices
const TRAVERSAL_INDICES = Array(4).fill(0).map((_, i) => i);
const REVERSED_TRAVERSAL_INDICES = [...TRAVERSAL_INDICES].reverse();

// Counter for generating unique IDs
let tileIdCounter = 0;

/**
 * Generates a unique ID for tiles
 */
function generateTileId(): string {
  tileIdCounter++;
  return `${Date.now()}-${tileIdCounter}-${Math.random().toString(36).substring(2, 7)}`;
}

/**
 * Creates a new game state with initial values
 */
export function createInitialGameState(): GameState {
  const board = createEmptyBoard();
  const initialState: GameState = {
    board,
    score: 0,
    bestScore: 0,
    won: false,
    over: false,
    tilesToRemove: [],
    tilesToAdd: [],
    moved: false,
    winAcknowledged: false,
    achieved4096: false,
    achieved8192: false,
  };

  // Add two initial tiles
  addRandomTile(initialState);
  addRandomTile(initialState);

  return initialState;
}

/**
 * Creates an empty 4x4 board
 */
export function createEmptyBoard(): (Tile | null)[][] {
  // Create a single array and then slice it for each row to avoid multiple Array.fill calls
  const row = Array(4).fill(null);
  return [row.slice(), row.slice(), row.slice(), row.slice()];
}

/**
 * Adds a random tile (90% chance of 2, 10% chance of 4) to a random empty cell
 */
export function addRandomTile(state: GameState): void {
  const emptyCells = findEmptyCells(state.board);
  
  if (emptyCells.length === 0) return;
  
  const randomPosition = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  const value = Math.random() < 0.9 ? 2 : 4;
  
  const tile: Tile = {
    id: generateTileId(),
    value: value as Exclude<TileValue, null>,
    position: randomPosition,
    isNew: true,
  };
  
  state.board[randomPosition.y][randomPosition.x] = tile;
  state.tilesToAdd.push(tile);
}

/**
 * Returns an array of positions of empty cells
 */
export function findEmptyCells(board: (Tile | null)[][]): Position[] {
  const emptyCells: Position[] = [];
  
  // Optimize by pre-allocating capacity and using a single loop
  for (let y = 0; y < 4; y++) {
    for (let x = 0; x < 4; x++) {
      if (board[y][x] === null) {
        emptyCells.push({ x, y });
      }
    }
  }
  
  return emptyCells;
}

/**
 * Check if the game is over (no more moves possible)
 */
export function isGameOver(state: GameState): boolean {
  // If there are empty cells, game is not over
  if (findEmptyCells(state.board).length > 0) return false;
  
  // Check if any adjacent tiles can be merged
  const board = state.board;
  for (let y = 0; y < 4; y++) {
    for (let x = 0; x < 4; x++) {
      const tile = board[y][x];
      if (tile) {
        const tileValue = tile.value;
        // Check right neighbor
        if (x < 3 && board[y][x + 1] && board[y][x + 1]?.value === tileValue) {
          return false;
        }
        // Check bottom neighbor
        if (y < 3 && board[y + 1][x] && board[y + 1][x]?.value === tileValue) {
          return false;
        }
      }
    }
  }
  
  return true;
}

/**
 * Check if the player has won (reached 2048)
 */
export function hasWon(state: GameState): boolean {
  const board = state.board;
  for (let y = 0; y < 4; y++) {
    for (let x = 0; x < 4; x++) {
      const tile = board[y][x];
      if (tile && tile.value >= 2048) {
        return true;
      }
    }
  }
  
  return false;
}

/**
 * Get the vector for a direction - using cached vectors
 */
export function getVector(direction: Direction): { x: number; y: number } {
  return DIRECTION_VECTORS[direction];
}

/**
 * Builds traversal order based on the direction
 */
export function buildTraversal(direction: Direction): { x: number[]; y: number[] } {
  const vector = getVector(direction);
  
  // Use pre-computed arrays instead of creating new ones
  return {
    x: vector.x === 1 ? REVERSED_TRAVERSAL_INDICES : TRAVERSAL_INDICES,
    y: vector.y === 1 ? REVERSED_TRAVERSAL_INDICES : TRAVERSAL_INDICES
  };
}

/**
 * Find the farthest position a tile can move in a direction
 */
export function findFarthestPosition(
  board: (Tile | null)[][],
  position: Position,
  vector: { x: number; y: number }
): { farthest: Position; next: Position | null } {
  let previous: Position = { x: position.x, y: position.y };
  let cell: Position = { x: position.x, y: position.y };
  
  // Optimize by checking boundaries first and then in the loop
  const maxX = 3, maxY = 3;
  
  do {
    previous = cell;
    cell = {
      x: previous.x + vector.x,
      y: previous.y + vector.y
    };
  } while (
    cell.x >= 0 && cell.x <= maxX &&
    cell.y >= 0 && cell.y <= maxY &&
    board[cell.y][cell.x] === null
  );
  
  // If we hit a boundary or another tile
  const next = (
    cell.x >= 0 && cell.x <= maxX &&
    cell.y >= 0 && cell.y <= maxY
  ) ? cell : null;
  
  return {
    farthest: previous,
    next
  };
}

/**
 * Perform a move in the given direction
 */
export function move(state: GameState, direction: Direction): void {
  const vector = getVector(direction);
  const traversals = buildTraversal(direction);
  const board = state.board;
  
  // Track if the board changed
  state.moved = false;
  state.tilesToRemove = [];
  state.tilesToAdd = [];
  
  // Save all tile positions and remove merged indicators
  for (let y = 0; y < 4; y++) {
    for (let x = 0; x < 4; x++) {
      const tile = board[y][x];
      if (tile) {
        // Reset tile properties for new move
        delete tile.mergedFrom;
        delete tile.isNew;
      }
    }
  }
  
  // Traverse the grid in the right direction and move tiles
  const yIndices = traversals.y;
  const xIndices = traversals.x;
  
  for (let i = 0; i < 4; i++) {
    const y = yIndices[i];
    for (let j = 0; j < 4; j++) {
      const x = xIndices[j];
      const tile = board[y][x];
      
      if (tile) {
        const positions = findFarthestPosition(board, { x, y }, vector);
        const farthest = positions.farthest;
        const next = positions.next;
        
        // Only update the tile position if it can move
        const canMove = !(farthest.x === x && farthest.y === y);
        
        if (canMove) {
          state.moved = true;
        }
        
        // Check if we can merge with the next position
        if (next && board[next.y][next.x] && board[next.y][next.x]?.value === tile.value) {
          const mergeTile = board[next.y][next.x] as Tile;
          const newValue = tile.value * 2 as Exclude<TileValue, null>;
          
          // Create a merged tile with a unique ID
          const mergedTile: Tile = {
            id: generateTileId(),
            value: newValue,
            position: { x: next.x, y: next.y },
            mergedFrom: [tile, mergeTile]
          };
          
          // Remove the original tiles
          board[y][x] = null;
          board[next.y][next.x] = null;
          
          // Add the merged tile
          board[next.y][next.x] = mergedTile;
          
          // Update the score
          state.score += newValue;
          
          // Track tiles to remove and add for animation
          state.tilesToRemove.push(tile, mergeTile);
          state.tilesToAdd.push(mergedTile);
          
          state.moved = true;
        } else {
          // Just move the tile
          board[y][x] = null;
          board[farthest.y][farthest.x] = {
            ...tile,
            position: { x: farthest.x, y: farthest.y }
          };
        }
      }
    }
  }
  
  // If the board changed, add a new random tile
  if (state.moved) {
    addRandomTile(state);
    
    // Check if game is over
    state.over = isGameOver(state);
    
    // Only check for win if player hasn't already won and acknowledged it
    if (!state.won && !state.winAcknowledged) {
      state.won = hasWon(state);
    }
  }
} 