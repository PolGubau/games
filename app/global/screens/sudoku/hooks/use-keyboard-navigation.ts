import { useEffect, useCallback } from "react";
import type { CellPosition } from "../domain/types";
import { SUDOKU_CONFIG } from "../domain/types";

interface UseKeyboardNavigationOptions {
  selectedCell: CellPosition | null;
  onCellSelect: (position: CellPosition) => void;
  onValueInput: (value: number) => void;
  onCellClear: () => void;
  onToggleNotes?: () => void;
  isGameOver?: boolean;
  enabled?: boolean;
}

export function useKeyboardNavigation({
  selectedCell,
  onCellSelect,
  onValueInput,
  onCellClear,
  onToggleNotes,
  isGameOver = false,
  enabled = true,
}: UseKeyboardNavigationOptions) {
  const moveSelection = useCallback(
    (direction: "up" | "down" | "left" | "right") => {
      if (!selectedCell || isGameOver || !enabled) return;

      const { row, col } = selectedCell;
      let newRow = row;
      let newCol = col;

      switch (direction) {
        case "up":
          newRow = row > 0 ? row - 1 : SUDOKU_CONFIG.ROWS - 1;
          break;
        case "down":
          newRow = row < SUDOKU_CONFIG.ROWS - 1 ? row + 1 : 0;
          break;
        case "left":
          newCol = col > 0 ? col - 1 : SUDOKU_CONFIG.COLS - 1;
          break;
        case "right":
          newCol = col < SUDOKU_CONFIG.COLS - 1 ? col + 1 : 0;
          break;
      }

      onCellSelect({ row: newRow, col: newCol });
    },
    [selectedCell, onCellSelect, isGameOver, enabled],
  );

  useEffect(() => {
    if (!enabled || isGameOver) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Arrow key navigation
      if (e.key === "ArrowUp") {
        e.preventDefault();
        moveSelection("up");
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        moveSelection("down");
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        moveSelection("left");
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        moveSelection("right");
      }
      // Number input
      else if (/^[1-9]$/.test(e.key)) {
        e.preventDefault();
        const value = parseInt(e.key, 10);
        onValueInput(value);
      }
      // Delete/Backspace to clear cell
      else if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault();
        onCellClear();
      }
      // N key to toggle notes mode
      else if (e.key === "n" || e.key === "N") {
        e.preventDefault();
        onToggleNotes?.();
      }
      // Tab to move right (Shift+Tab to move left)
      else if (e.key === "Tab") {
        e.preventDefault();
        moveSelection(e.shiftKey ? "left" : "right");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [moveSelection, onValueInput, onCellClear, onToggleNotes, enabled, isGameOver]);

  // Select first cell if none selected
  useEffect(() => {
    if (!selectedCell && enabled && !isGameOver) {
      onCellSelect({ row: 0, col: 0 });
    }
  }, [selectedCell, onCellSelect, enabled, isGameOver]);
}
