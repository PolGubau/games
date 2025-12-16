// Sudoku constants
export const SUDOKU_CONFIG = {
  COLS: 9,
  ROWS: 9,
  TOTAL_CELLS: 81,
  MIN_SHOWED_CELLS: 17,
  MAX_SHOWED_CELLS: 81,
  BOX_SIZE: 3,
  MAX_LIVES: 3,
} as const;

// Cell type
export interface Cell {
  value: number;
  isLocked: boolean;
  isError?: boolean;
  notes?: number[];
}

export type Row = Cell[];
export type Board = Row[];

// Sudoku game state
export interface Sudoku {
  id: string;
  difficulty: number;
  board: Board;
  timeStarted: Date;
  timeFinished: Date | null;
  completionTime: {
    string: string;
    diff: Date;
  };
  lives: number;
  win: 0 | 1;
  lost: 0 | 1;
}

// Validation result
export interface ValidationResult {
  isValid: boolean;
  conflicts: {
    row: boolean;
    column: boolean;
    box: boolean;
  };
}

// Cell position
export interface CellPosition {
  row: number;
  col: number;
}

// Difficulty levels
export const DIFFICULTY_LEVELS = {
  EASY: 30,
  MEDIUM: 50,
  HARD: 70,
  EXPERT: 85,
} as const;

export type DifficultyLevel = (typeof DIFFICULTY_LEVELS)[keyof typeof DIFFICULTY_LEVELS];
