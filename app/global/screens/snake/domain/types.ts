// Snake game constants
export const SNAKE_CONFIG = {
  GRID_SIZE: 20, // Grid cells per row/column
  CELL_SIZE: 5, // Size percentage per cell (100 / 20 = 5)
  INITIAL_SPEED: 150, // milliseconds
  MIN_SPEED: 50,
  SPEED_INCREMENT: 5, // Speed increase per food eaten
  INITIAL_LENGTH: 3,
  FOOD_POINTS: 10,
  BOARD_SIZE: 100, // percentage
} as const;

// Direction type
export type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";

// Position on the grid
export interface Position {
  x: number;
  y: number;
}

// Snake segment
export interface SnakeSegment extends Position {
  index: number;
}

// Game difficulty
export const DIFFICULTY_LEVELS = {
  EASY: { speed: 150, speedIncrement: 3 },
  MEDIUM: { speed: 100, speedIncrement: 5 },
  HARD: { speed: 70, speedIncrement: 7 },
  EXTREME: { speed: 50, speedIncrement: 10 },
} as const;

export type DifficultyLevel = keyof typeof DIFFICULTY_LEVELS;

// Game stats
export interface GameStats {
  score: number;
  foodEaten: number;
  length: number;
  highScore: number;
  gameTime: number; // seconds
}

// Game state
export interface GameState {
  snake: Position[];
  direction: Direction;
  foodPosition: Position;
  isPlaying: boolean;
  isGameOver: boolean;
  isPaused: boolean;
  speed: number;
  stats: GameStats;
  difficulty: DifficultyLevel;
}

// Game results
export interface GameResults extends GameStats {
  difficulty: DifficultyLevel;
  completedAt: Date;
}

// Key mappings
export const KEY_MAPPINGS: Record<string, Direction> = {
  ArrowUp: "UP",
  ArrowDown: "DOWN",
  ArrowLeft: "LEFT",
  ArrowRight: "RIGHT",
  w: "UP",
  W: "UP",
  s: "DOWN",
  S: "DOWN",
  a: "LEFT",
  A: "LEFT",
  d: "RIGHT",
  D: "RIGHT",
} as const;
