// 2048 game configuration
export const GAME_2048_CONFIG = {
  GRID_SIZE: 4, // 4x4 grid
  INITIAL_TILES: 2, // Start with 2 tiles
  WIN_VALUE: 2048,
  TILE_VALUES: [2, 4] as const, // Possible starting values
  TILE_SPAWN_PROBABILITY: 0.9, // 90% chance of spawning 2, 10% for 4
} as const;

export type Position = {
  x: number;
  y: number;
};

export type Tile = {
  id: string;
  position: Position;
  value: number;
};

export type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";

export type GameStatus = "idle" | "playing" | "won" | "lost";

export type GameState = {
  tiles: Tile[];
  score: number;
  bestScore: number;
  status: GameStatus;
  canUndo: boolean;
  hasWonBefore: boolean; // Track if player already won and chose to continue
};

export type GameStats = {
  score: number;
  bestScore: number;
  moves: number;
  largestTile: number;
};
