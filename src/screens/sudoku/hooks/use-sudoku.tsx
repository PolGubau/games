import { useEffect, useState } from "react";
import { Board, Cell, Row } from "../sudoku-types";
import { generateBoard } from "../functions";
/* We want to create a sudoku game in this page, we need to generate the board, the data, the logic, the UI, etc.
    
     First we need to create the array of values as a 2D array.

     Keep in mind:
        - The board is 9x9
        - The board is divided in 9 3x3 squares
        - Each row can only have one of each number
        - Each column can only have one of each number
        - Each 3x3 square can only have one of each number
        - The board must have at least 17 numbers to be solvable
        - The board must have at most 81 numbers to be solvable
        - The board must have a unique solution
        - The board must be solvable without guessing
     */
export const useSudoku = () => {
  const STARTING_LIVES = 3;
  const COLS = 9;
  const ROWS = 9;
  const MIN_SHOWED_CELLS = 17;
  const MAX_SHOWED_CELLS = 81;
  const TOTAL_CELLS = COLS * ROWS;
  const initialValue = new Array(TOTAL_CELLS).fill(0);
  const [timeStarted, setTimeStarted] = useState<Date | undefined>(undefined);
  const [timeFinished, setTimeFinished] = useState<Date | undefined>(undefined);
  const [timeAgo, setTimeAgo] = useState<string>("");
  const [errors, setErrors] = useState<number>(0);
  const [win, setWin] = useState<boolean>(false);
  const [lost, setLost] = useState<boolean>(false);
  const [board, setBoard] = useState<Board>(initialValue);
  const [result, setResult] = useState<Cell["value"][]>(initialValue);
  const [difficulty, setDifficulty] = useState<number>(50);

  const lockedAmount = board.flat().filter((cell) => cell.isLocked).length;
  const emptyCells = TOTAL_CELLS - lockedAmount;

  useEffect(() => {
    if (emptyCells === 0) {
      setTimeFinished(new Date());
      setWin(true);
    }
  }, [emptyCells]);

  useEffect(() => {
    if (errors === STARTING_LIVES) {
      setLost(true);
    }
  }, [errors]);

  const handleStartGame = () => {
    // flatted array with the values of the board in correct order
    const board = generateBoard(initialValue);

    const boardWithHoles: Cell[] = board.map((cell: number) => {
      // use difficulty as a scale to determine if the cell is locked or not
      // the max difficulty is 100, the min is 0
      // the max possible amount of empty cells is MAX_SHOWED_CELLS
      // the min possible amount of empty cells is MIN_SHOWED_CELLS

      const difficultyPercent = difficulty / 100;

      const scale = Math.floor(
        (MAX_SHOWED_CELLS - MIN_SHOWED_CELLS) * difficultyPercent +
          MIN_SHOWED_CELLS
      );
      const isLocked = Math.random() * 100 > scale;
      return {
        value: cell,
        isLocked,
      };
    });

    const rows: Row[] = boardWithHoles.reduce(
      (rows: Row[], cell: Cell, index: number) => {
        const row = Math.floor(index / ROWS);
        rows[row] = rows[row] || [];
        rows[row].push(cell);
        return rows;
      },
      []
    );

    setBoard(rows);
    setResult(board);
    setTimeStarted(new Date());
  };

  const handleCheckCell = ({
    value,
    cellRow,
    cellColumn,
  }: {
    value: number;
    cellRow: number;
    cellColumn: number;
  }) => {
    // check from the result array if the value is correct
    const correctValue = result[cellRow * ROWS + cellColumn];

    if (value !== correctValue) {
      setErrors((errors) => errors + 1);
    } else {
      // update the board
      const newBoard = [...board];
      newBoard[cellRow][cellColumn].isLocked = true;
      setBoard(newBoard);
    }
  };

  const calculateTimeDiff = (timeStarted: Date, timeFinished: Date) => {
    const diff = timeFinished.getTime() - timeStarted.getTime();
    let minutes = Math.floor(diff / 1000 / 60);
    let seconds = Math.floor((diff / 1000) % 60);
    let hours = Math.floor(minutes / 60);

    minutes = minutes % 60;
    seconds = seconds % 60;
    hours = hours % 60;

    const timeAgo = `${hours ? `${hours}h ` : ""}${
      minutes ? `${minutes}m ` : ""
    }${seconds}s`;
    return timeAgo;
  };

  const resetGame = () => {
    setWin(false);
    setLost(false);
    setErrors(0);
    setTimeStarted(undefined);
    setTimeFinished(undefined);
    setBoard(initialValue);
    setResult(initialValue);
  };

  // calculate the time ago
  useEffect(() => {
    if (timeStarted) {
      const interval = setInterval(() => {
        const now = new Date();
        setTimeAgo(calculateTimeDiff(timeStarted, now));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timeStarted]);

  const percentDone = Math.floor((emptyCells / TOTAL_CELLS) * 100);

  const timeUsed =
    timeStarted && timeFinished && calculateTimeDiff(timeStarted, timeFinished);
  return {
    timeStarted,
    errors,
    win,
    lost,
    board,
    handleStartGame,
    handleCheckCell,
    setDifficulty,
    timeAgo,
    timeUsed: String(timeUsed),
    percentDone,
    resetGame,
    difficulty,
    lives: STARTING_LIVES - errors,
  };
};
