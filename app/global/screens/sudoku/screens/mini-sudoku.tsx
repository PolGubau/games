import type { Sudoku } from "../sudoku-types";
import { cn } from "~/lib/utils";
interface Props {
  board: Sudoku["board"];
}
const MiniSudoku = ({ board }: Props) => {
  return (
    <table cellPadding={0} cellSpacing={0}>
      {board.map((row, rowIndex) => (
        <tr
          className=" border-secondary [&:nth-child(3)]:border-b [&:nth-child(6)]:border-b"
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
          key={rowIndex}
        >
          {row?.map((cell, cellIndex) => (
            <td
              className={cn(
                "  border-secondary aspect-square w-2 h-2 [&:nth-child(3)]:border-r [&:nth-child(6)]:border-r ",
                {
                  "bg-secondary-400": cell.isLocked,
                  "bg-secondary-100": !cell.isLocked,
                },
              )}
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              key={cellIndex}
            />
          ))}
        </tr>
      ))}
    </table>
  );
};

export default MiniSudoku;
