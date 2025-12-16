import { motion } from "motion/react";
import { GoHomeButton } from "~/components/go-home-button";
import BoardLayout from "../../../Layouts/BoardLayout";
import HeartNav from "../ui/heart-nav";
import { calculateTimeDiff, useSudoku } from "../hooks/use-sudoku";
import SudokuLost from "./sudoku-lost";
import SudokuWin from "./sudoku-win";
const item = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
};
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.01,
    },
  },
};
const SudokuBoard = () => {
  const { handleCheckCell, sudoku, percentDone } = useSudoku();

  if (!sudoku) return null;

  const { lives, board } = sudoku;

  const getTimeUsed = calculateTimeDiff(sudoku.timeStarted, new Date()).string;

  if (sudoku?.lost) {
    return <SudokuLost />;
  }
  if (sudoku?.win) {
    return <SudokuWin timeUsed={getTimeUsed} difficulty={sudoku?.difficulty} />;
  }

  return (
    <section className="flex justify-center items-center flex-col gap-4 h-full">
      <article className="gap-2 grid grid-rows-[auto_1fr] items-center">
        <div className="flex gap-4 items-center justify-between">
          <GoHomeButton />
          <div className="flex gap-2 items-center">
            <span>{percentDone} %</span>
            <HeartNav lives={lives} />
          </div>
        </div>
        <motion.table
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl  "
          variants={container}
          initial="hidden"
          animate="show"
        >
          <tbody>
            {board.map((row, rowIndex) => (
              <tr
                className="flex border-muted nth-3:border-b-4 nth-6:border-b-4"
                key={rowIndex}
              >
                {row?.map((cell, cellIndex) => (
                  <motion.td
                    variants={item}
                    className="border border-muted w-full h-full aspect-square  sm:w-10 sm:h-10 md:w-14 md:h-14 lg:w-16 lg:h-16  flex justify-center items-center nth-3:border-r-4 nth-6:border-r-4 "
                    key={cellIndex}
                  >
                    {cell.isLocked ? (
                      <motion.div
                        initial={{
                          opacity: 0,
                          scale: 0.5,
                        }}
                        animate={{
                          opacity: 1,
                          scale: 1,
                        }}
                        exit={{
                          opacity: 0,
                          scale: 0.5,
                        }}
                        transition={{
                          type: "spring",
                          duration: 0.2,
                        }}
                      >
                        {cell.value}
                      </motion.div>
                    ) : (
                      <motion.input
                        initial={{
                          opacity: 0,
                          scale: 0.5,
                        }}
                        animate={{
                          opacity: 1,
                          scale: 1,
                        }}
                        exit={{
                          opacity: 0,
                          scale: 0.5,
                        }}
                        transition={{
                          type: "spring",
                          duration: 0.2,
                        }}
                        className="text-center transition-all h-full w-full focus:outline-none focus:bg-primary/20 bg-primary/10"
                        max={9}
                        min={1}
                        inputMode="numeric"
                        value={""}
                        pattern="[0-9]"
                        maxLength={1}
                        minLength={1}
                        onChange={(e) => {
                          handleCheckCell({
                            sudoku,
                            value: Number(e.target.value),
                            cellRow: rowIndex,
                            cellColumn: cellIndex,
                          });
                        }}
                      />
                    )}
                  </motion.td>
                ))}
              </tr>
            ))}
          </tbody>
        </motion.table>
      </article>
    </section>
  );
};

const SudokuBoardLayout = () => {
  return (
    <BoardLayout title="Sudoku">
      <SudokuBoard />
    </BoardLayout>
  );
};

export default SudokuBoardLayout;
