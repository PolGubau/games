import type { Direction, GameState, Position, Tile } from "./types";
import { GAME_2048_CONFIG } from "./types";

/**
 * Generate unique ID for tiles
 */
export function generateTileId(): string {
  return `tile-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Create initial game state
 */
export function createInitialState(): GameState {
  const tiles: Tile[] = [];

  // Add initial tiles
  for (let i = 0; i < GAME_2048_CONFIG.INITIAL_TILES; i++) {
    const tile = createRandomTile(tiles);
    if (tile) tiles.push(tile);
  }

  return {
    tiles,
    score: 0,
    bestScore: getBestScore(),
    status: "playing",
    canUndo: false,
    hasWonBefore: false,
  };
}

/**
 * Create a random tile in an empty position
 */
export function createRandomTile(existingTiles: Tile[]): Tile | null {
  const emptyPositions = getEmptyPositions(existingTiles);

  if (emptyPositions.length === 0) return null;

  const position = emptyPositions[Math.floor(Math.random() * emptyPositions.length)];
  const value = Math.random() < GAME_2048_CONFIG.TILE_SPAWN_PROBABILITY ? 2 : 4;

  return {
    id: generateTileId(),
    position,
    value,
  };
}

/**
 * Get all empty positions on the board
 */
export function getEmptyPositions(tiles: Tile[]): Position[] {
  const occupied = new Set(tiles.map((t) => `${t.position.x},${t.position.y}`));
  const empty: Position[] = [];

  for (let y = 0; y < GAME_2048_CONFIG.GRID_SIZE; y++) {
    for (let x = 0; x < GAME_2048_CONFIG.GRID_SIZE; x++) {
      if (!occupied.has(`${x},${y}`)) {
        empty.push({ x, y });
      }
    }
  }

  return empty;
}

/**
 * Move tiles in a direction
 */
export function moveTiles(
  tiles: Tile[],
  direction: Direction,
): { tiles: Tile[]; scoreGained: number } {
  const gridSize = GAME_2048_CONFIG.GRID_SIZE;
  const newTiles: Tile[] = [];
  let scoreGained = 0;
  const merged = new Set<string>();

  // Define movement logic based on direction
  const getLine = (index: number): Tile[] => {
    switch (direction) {
      case "LEFT":
      case "RIGHT":
        return tiles.filter((t) => t.position.y === index);
      case "UP":
      case "DOWN":
        return tiles.filter((t) => t.position.x === index);
    }
  };

  const sortLine = (line: Tile[]): Tile[] => {
    switch (direction) {
      case "LEFT":
      case "UP":
        return line.sort((a, b) =>
          direction === "LEFT" ? a.position.x - b.position.x : a.position.y - b.position.y,
        );
      case "RIGHT":
      case "DOWN":
        return line.sort((a, b) =>
          direction === "RIGHT" ? b.position.x - a.position.x : b.position.y - a.position.y,
        );
    }
  };

  const setPosition = (tile: Tile, lineIndex: number, positionInLine: number): Position => {
    switch (direction) {
      case "LEFT":
        return { x: positionInLine, y: lineIndex };
      case "RIGHT":
        return { x: gridSize - 1 - positionInLine, y: lineIndex };
      case "UP":
        return { x: lineIndex, y: positionInLine };
      case "DOWN":
        return { x: lineIndex, y: gridSize - 1 - positionInLine };
    }
  };

  // Process each line
  for (let lineIndex = 0; lineIndex < gridSize; lineIndex++) {
    const line = sortLine(getLine(lineIndex));
    let positionInLine = 0;

    for (let i = 0; i < line.length; i++) {
      const current = line[i];
      const next = line[i + 1];

      // Check if can merge with next tile
      if (next && current.value === next.value && !merged.has(current.id) && !merged.has(next.id)) {
        // Merge tiles
        const mergedTile: Tile = {
          id: generateTileId(),
          position: setPosition(current, lineIndex, positionInLine),
          value: current.value * 2,
        };
        newTiles.push(mergedTile);
        merged.add(current.id);
        merged.add(next.id);
        scoreGained += mergedTile.value;
        positionInLine++;
        i++; // Skip next tile as it's merged
      } else if (!merged.has(current.id)) {
        // Move tile
        newTiles.push({
          ...current,
          position: setPosition(current, lineIndex, positionInLine),
        });
        positionInLine++;
      }
    }
  }

  return { tiles: newTiles, scoreGained };
}

/**
 * Check if tiles have moved
 */
export function tilesHaveMoved(oldTiles: Tile[], newTiles: Tile[]): boolean {
  if (oldTiles.length !== newTiles.length) return true;

  const sortedOld = [...oldTiles].sort((a, b) => a.id.localeCompare(b.id));
  const sortedNew = [...newTiles].sort((a, b) => a.id.localeCompare(b.id));

  return sortedOld.some((tile, i) => {
    const newTile = sortedNew[i];
    return (
      tile.position.x !== newTile.position.x ||
      tile.position.y !== newTile.position.y ||
      tile.value !== newTile.value
    );
  });
}

/**
 * Check if player has won
 */
export function hasWon(tiles: Tile[]): boolean {
  return tiles.some((t) => t.value >= GAME_2048_CONFIG.WIN_VALUE);
}

/**
 * Check if player has lost (no moves available)
 */
export function hasLost(tiles: Tile[]): boolean {
  // If there are empty positions, game is not lost
  if (getEmptyPositions(tiles).length > 0) return false;

  // Check if any adjacent tiles can be merged
  const gridSize = GAME_2048_CONFIG.GRID_SIZE;

  for (const tile of tiles) {
    const { x, y } = tile.position;

    // Check right
    if (x < gridSize - 1) {
      const right = tiles.find((t) => t.position.x === x + 1 && t.position.y === y);
      if (right && right.value === tile.value) return false;
    }

    // Check down
    if (y < gridSize - 1) {
      const down = tiles.find((t) => t.position.x === x && t.position.y === y + 1);
      if (down && down.value === tile.value) return false;
    }
  }

  return true;
}

/**
 * Get best score from localStorage
 */
export function getBestScore(): number {
  if (typeof window === "undefined") return 0;
  const stored = localStorage.getItem("2048-best-score");
  return stored ? parseInt(stored, 10) : 0;
}

/**
 * Save best score to localStorage
 */
export function saveBestScore(score: number): void {
  if (typeof window === "undefined") return;
  const currentBest = getBestScore();
  if (score > currentBest) {
    localStorage.setItem("2048-best-score", score.toString());
  }
}

/**
 * Get largest tile value
 */
export function getLargestTile(tiles: Tile[]): number {
  return tiles.reduce((max, tile) => Math.max(max, tile.value), 0);
}
