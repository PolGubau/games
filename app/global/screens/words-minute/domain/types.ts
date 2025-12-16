// Words Per Minute game constants
export const WPM_CONFIG = {
  DEFAULT_TIME: 60, // seconds
  TIME_OPTIONS: [15, 30, 60, 120] as const,
  MIN_WORD_LENGTH: 3,
  MAX_WORD_LENGTH: 12,
  CHARACTERS_PER_WORD: 5, // Standard for WPM calculation
} as const;

// Game modes
export type GameMode = "strict" | "normal";

// Game states
export type GameStatus = "idle" | "playing" | "finished";

// Word state
export interface WordState {
  current: string;
  typed: string;
  isCorrect: boolean;
}

// Game statistics
export interface GameStats {
  characterCount: number;
  correctWords: number;
  incorrectWords: number;
  accuracy: number;
  wpm: number;
  rawWpm: number;
  timeElapsed: number;
}

// Game state
export interface GameState {
  status: GameStatus;
  mode: GameMode;
  timeLimit: number;
  timeRemaining: number;
  word: WordState;
  stats: GameStats;
}

// Results interface
export interface GameResults extends GameStats {
  timeLimit: number;
  mode: GameMode;
  completedAt: Date;
}
