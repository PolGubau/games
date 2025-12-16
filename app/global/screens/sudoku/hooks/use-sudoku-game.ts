import { useCallback, useEffect, useMemo, useState } from "react";
import type { Board, CellPosition, Sudoku } from "../domain/types";
import { SUDOKU_CONFIG } from "../domain/types";
import { getCompletionPercentage, getEmptyCells, validateCell } from "../domain/validators";
import { useTimer } from "../../Memo/hooks/use-timer";

interface UseSudokuGameOptions {
  initialBoard: Board;
  difficulty: number;
  onWin?: (sudoku: Sudoku) => void;
  onLose?: (sudoku: Sudoku) => void;
}

export function useSudokuGame({ initialBoard, difficulty, onWin, onLose }: UseSudokuGameOptions) {
  const [board, setBoard] = useState<Board>(initialBoard);
  const [lives, setLives] = useState<number>(SUDOKU_CONFIG.MAX_LIVES);
  const [selectedCell, setSelectedCell] = useState<CellPosition | null>(null);
  const [isNotesMode, setIsNotesMode] = useState(false);
  const [gameId] = useState(() => crypto.randomUUID());
  const [timeStarted] = useState(new Date());
  const [isGameOver, setIsGameOver] = useState(false);
  const [isWon, setIsWon] = useState(false);

  const { time, start, stop } = useTimer();

  // Start timer on mount
  useEffect(() => {
    start();
    return () => stop();
  }, [start, stop]);

  // Check win condition
  const isBoardComplete = useMemo(() => {
    return board.every((row) => row.every((cell) => cell.value > 0 && !cell.isError));
  }, [board]);

  // Game stats
  const stats = useMemo(() => {
    const emptyCells = getEmptyCells(board);
    const completion = getCompletionPercentage(board);

    return {
      emptyCells: emptyCells.length,
      completion,
      lives,
      time,
    };
  }, [board, lives, time]);

  // Handle win
  useEffect(() => {
    if (isBoardComplete && !isGameOver) {
      stop();
      setIsWon(true);
      setIsGameOver(true);

      const timeFinished = new Date();
      const sudoku: Sudoku = {
        id: gameId,
        difficulty,
        board,
        timeStarted,
        timeFinished,
        completionTime: {
          string: `${time}s`,
          diff: timeFinished,
        },
        lives,
        win: 1,
        lost: 0,
      };

      onWin?.(sudoku);
    }
  }, [
    isBoardComplete,
    isGameOver,
    gameId,
    difficulty,
    board,
    timeStarted,
    lives,
    time,
    stop,
    onWin,
  ]);

  // Handle lose
  useEffect(() => {
    if (lives <= 0 && !isGameOver) {
      stop();
      setIsGameOver(true);

      const timeFinished = new Date();
      const sudoku: Sudoku = {
        id: gameId,
        difficulty,
        board,
        timeStarted,
        timeFinished,
        completionTime: {
          string: `${time}s`,
          diff: timeFinished,
        },
        lives,
        win: 0,
        lost: 1,
      };

      onLose?.(sudoku);
    }
  }, [lives, isGameOver, gameId, difficulty, board, timeStarted, time, stop, onLose]);

  const handleCellSelect = useCallback((position: CellPosition) => {
    setSelectedCell((prev) => {
      if (prev?.row === position.row && prev?.col === position.col) {
        return null; // Deselect if clicking same cell
      }
      return position;
    });
  }, []);

  const handleValueInput = useCallback(
    (value: number) => {
      if (!selectedCell || isGameOver) return;

      const { row, col } = selectedCell;
      const cell = board[row][col];

      if (cell.isLocked) return;

      if (isNotesMode) {
        // Toggle note
        setBoard((prev) => {
          const newBoard = prev.map((r) => r.map((c) => ({ ...c })));
          const notes = newBoard[row][col].notes || [];

          if (notes.includes(value)) {
            newBoard[row][col].notes = notes.filter((n) => n !== value);
          } else {
            newBoard[row][col].notes = [...notes, value].sort();
          }

          return newBoard;
        });
      } else {
        // Set value
        const validation = validateCell(board, selectedCell, value);

        setBoard((prev) => {
          const newBoard = prev.map((r) => r.map((c) => ({ ...c })));
          newBoard[row][col].value = value;
          newBoard[row][col].isError = !validation.isValid;
          newBoard[row][col].notes = undefined; // Clear notes when setting value

          return newBoard;
        });

        // Lose life if invalid
        if (!validation.isValid) {
          setLives((prev) => prev - 1);
        }
      }
    },
    [selectedCell, board, isNotesMode, isGameOver],
  );

  const handleCellClear = useCallback(() => {
    if (!selectedCell || isGameOver) return;

    const { row, col } = selectedCell;
    const cell = board[row][col];

    if (cell.isLocked) return;

    setBoard((prev) => {
      const newBoard = prev.map((r) => r.map((c) => ({ ...c })));
      newBoard[row][col].value = 0;
      newBoard[row][col].isError = false;
      newBoard[row][col].notes = undefined;
      return newBoard;
    });
  }, [selectedCell, board, isGameOver]);

  const toggleNotesMode = useCallback(() => {
    setIsNotesMode((prev) => !prev);
  }, []);

  const handleReset = useCallback(() => {
    setBoard(initialBoard);
    setLives(SUDOKU_CONFIG.MAX_LIVES);
    setSelectedCell(null);
    setIsNotesMode(false);
    setIsGameOver(false);
    setIsWon(false);
    start();
  }, [initialBoard, start]);

  return {
    board,
    lives,
    selectedCell,
    isNotesMode,
    isGameOver,
    isWon,
    stats,
    handleCellSelect,
    handleValueInput,
    handleCellClear,
    toggleNotesMode,
    handleReset,
  };
}
