// Game constants
export const GAME_CONFIG = {
  GRID_SIZE: 5,
  TOTAL_PAIRS: 10,
  HINT_DISPLAY_TIME: 2000,
  CARD_FLIP_DELAY: 400,
} as const;

// Tile type
export interface Tile {
  id: string;
  icon: React.ComponentType;
  color: string;
}

export type TileId = Tile["id"];

// Game state
export interface GameState {
  guessed: TileId[];
  selected: TileId[];
  win: boolean;
  hint: TileId[];
  time: number;
  hintsUsed: number;
}

// Game stats for persistence
export interface GameStats {
  bestTime: number;
  gamesPlayed: number;
  gamesWon: number;
  totalHintsUsed: number;
  averageTime: number;
}

// Card specs for rendering
export interface CardSpecs {
  disabled?: boolean;
  className: string;
  onClick?: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLButtonElement>) => void;
  style?: React.CSSProperties;
}
