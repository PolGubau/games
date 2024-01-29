import { Button } from "pol-ui";
import { useEffect, useMemo, useState } from "react";
import BoardLayout from "../../Layouts/BoardLayout";
import { generateBoard } from "./functions";
import ConfettiExplosion from "react-confetti-explosion";
interface Cell {
  value: number;
  isLocked: boolean;
}
type Row = Cell[];
type Board = Row[];

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
const SudokuPage = () => {
  const LIVES = 3;
  const COLS = 9;
  const ROWS = 9;
  const CELL_MIN_NUMBER = 1;
  const CELL_MAX_NUMBER = 9;
  const MIN_NUMBER_GENERATION = 17;
  const TOTAL_CELLS = COLS * ROWS;
  const initialValue = new Array(TOTAL_CELLS).fill(0);
  const [timeStarted, setTimeStarted] = useState<Date | undefined>(undefined);

  const [errors, setErrors] = useState<number>(0);
  const [win, setWin] = useState<boolean>(false);
  const [lost, setLost] = useState<boolean>(false);
  const [board, setBoard] = useState<Board>(initialValue);
  const [result, setResult] = useState<Cell["value"][]>(initialValue);

  const lockedAmount = board.flat().filter((cell) => cell.isLocked).length;
  const emptyCells = TOTAL_CELLS - lockedAmount;

  useEffect(() => {
    if (emptyCells === 0) {
      setWin(true);
    }
  }, [emptyCells]);

  useEffect(() => {
    if (errors === LIVES) {
      setLost(true);
    }
  }, [errors]);

  const handleStartGame = () => {
    // flatted array with the values of the board in correct order
    const board = generateBoard(initialValue);

    const boardWithHoles: Cell[] = board.map((cell: number) => {
      const isLocked = Math.random() > 0.5;
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

  return (
    <BoardLayout title="Sudoku">
      <section className="flex justify-center items-center">
        {!timeStarted ? (
          <p>
            Press start to begin
            <Button outline onClick={handleStartGame}>
              Start
            </Button>
          </p>
        ) : (
          <>
            {Array.from({ length: LIVES - errors }, (_, index) => (
              <span key={index}>❤️</span>
            ))}
            {errors === LIVES ? (
              <p>Game over</p>
            ) : (
              <table className="">
                {board.map((row, rowIndex) => (
                  <tr
                    className="flex border-black [&:nth-child(3)]:border-b-4 [&:nth-child(6)]:border-b-4"
                    key={rowIndex}
                  >
                    {row.map((cell, cellIndex) => (
                      <td
                        className="border border-black w-10 h-10 flex justify-center items-center [&:nth-child(3)]:border-r-4 [&:nth-child(6)]:border-r-4 "
                        key={cellIndex}
                      >
                        {cell.isLocked ? (
                          cell.value
                        ) : (
                          <input
                            className="text-center transition-all h-full w-full focus:outline-none focus:bg-primary bg-secondary/50"
                            max={9}
                            min={1}
                            placeholder={cell.value.toString()}
                            value={""}
                            maxLength={1}
                            minLength={1}
                            onChange={(e) => {
                              handleCheckCell({
                                value: Number(e.target.value),
                                cellRow: rowIndex,
                                cellColumn: cellIndex,
                              });
                            }}
                          />
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </table>
            )}
          </>
        )}
      </section>
    </BoardLayout>
  );
};

export default SudokuPage;
