import type { Board, CellPosition, ValidationResult } from "./types";
import { SUDOKU_CONFIG } from "./types";

/**
 * Validates if a value can be placed at a specific position
 */
export function validateCell(
  board: Board,
  position: CellPosition,
  value: number,
): ValidationResult {
  const { row, col } = position;

  const conflicts = {
    row: checkRow(board, row, value, col),
    column: checkColumn(board, col, value, row),
    box: checkBox(board, row, col, value),
  };

  return {
    isValid: !conflicts.row && !conflicts.column && !conflicts.box,
    conflicts,
  };
}

/**
 * Check if value exists in row (excluding current column)
 */
function checkRow(board: Board, row: number, value: number, excludeCol: number): boolean {
  return board[row].some((cell, colIndex) => colIndex !== excludeCol && cell.value === value);
}

/**
 * Check if value exists in column (excluding current row)
 */
function checkColumn(board: Board, col: number, value: number, excludeRow: number): boolean {
  return board.some((row, rowIndex) => rowIndex !== excludeRow && row[col].value === value);
}

/**
 * Check if value exists in 3x3 box
 */
function checkBox(board: Board, row: number, col: number, value: number): boolean {
  const boxStartRow = Math.floor(row / SUDOKU_CONFIG.BOX_SIZE) * SUDOKU_CONFIG.BOX_SIZE;
  const boxStartCol = Math.floor(col / SUDOKU_CONFIG.BOX_SIZE) * SUDOKU_CONFIG.BOX_SIZE;

  for (let r = boxStartRow; r < boxStartRow + SUDOKU_CONFIG.BOX_SIZE; r++) {
    for (let c = boxStartCol; c < boxStartCol + SUDOKU_CONFIG.BOX_SIZE; c++) {
      if (r === row && c === col) continue;
      if (board[r][c].value === value) return true;
    }
  }

  return false;
}

/**
 * Get all empty cells in the board
 */
export function getEmptyCells(board: Board): CellPosition[] {
  const emptyCells: CellPosition[] = [];

  board.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      if (!cell.isLocked) {
        emptyCells.push({ row: rowIndex, col: colIndex });
      }
    });
  });

  return emptyCells;
}

/**
 * Calculate completion percentage
 */
export function getCompletionPercentage(board: Board): number {
  const totalCells = SUDOKU_CONFIG.TOTAL_CELLS;
  const filledCells = board.flat().filter((cell) => cell.isLocked).length;
  return Math.round((filledCells / totalCells) * 100);
}

/**
 * Format time difference
 */
export function formatTimeDiff(
  timeStarted: Date,
  timeFinished: Date,
): { string: string; diff: Date } {
  const diff = timeFinished.getTime() - timeStarted.getTime();
  const diffDate = new Date(diff);

  const hours = Math.floor(diff / 1000 / 60 / 60);
  const minutes = Math.floor((diff / 1000 / 60) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  const parts: string[] = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  parts.push(`${seconds}s`);

  return {
    string: parts.join(" "),
    diff: diffDate,
  };
}
