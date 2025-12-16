// Math game constants
export const MATH_CONFIG = {
  DEFAULT_TIME: 60, // seconds
  TIME_OPTIONS: [30, 60, 90, 120] as const,
  DEFAULT_OPERATIONS: 50,
  MIN_NUMBER: 1,
  MAX_NUMBER: 12,
  OPERATORS: ["+", "-", "*", "/"] as const,
  FALSE_ANSWERS_COUNT: 3,
  ANSWER_DELTA_RANGE: 10,
} as const;

// Operator type
export type Operator = (typeof MATH_CONFIG.OPERATORS)[number];

// Difficulty levels
export const DIFFICULTY_LEVELS = {
  EASY: { min: 1, max: 10, operators: ["+", "-"] as Operator[] },
  MEDIUM: { min: 1, max: 12, operators: ["+", "-", "*"] as Operator[] },
  HARD: { min: 1, max: 12, operators: ["+", "-", "*", "/"] as Operator[] },
} as const;

export type DifficultyLevel = keyof typeof DIFFICULTY_LEVELS;

// Operation type
export interface Operation {
  operation: string;
  correct: string;
  solutions: string[];
}

// Solved operation
export interface SolvedOperation extends Operation {
  answeredAt: Date;
  userAnswer: string;
  isCorrect: boolean;
  timeToAnswer: number; // milliseconds
}

// Game stats
export interface GameStats {
  totalOperations: number;
  correctAnswers: number;
  incorrectAnswers: number;
  accuracy: number;
  averageTime: number; // milliseconds
  score: number;
  operationsPerMinute: number;
}

// Game state
export interface GameState {
  isPlaying: boolean;
  isFinished: boolean;
  timeRemaining: number;
  timeElapsed: number;
  currentOperation: Operation | null;
  currentIndex: number;
  solvedOperations: SolvedOperation[];
  difficulty: DifficultyLevel;
}

// Game results
export interface GameResults extends GameStats {
  difficulty: DifficultyLevel;
  timeLimit: number;
  completedAt: Date;
  solvedOperations: SolvedOperation[];
}
