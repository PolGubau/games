import BoardLayout from "../../Layouts/BoardLayout";
import { useSudoku } from "./hooks/use-sudoku";
import SudokuLobby from "./screens/sudoku-lobby";
import SudokuLost from "./screens/sudoku-lost";
import SudokuWin from "./screens/sudoku-win";
import HeartNav from "./components/heartNav";
import { motion } from "framer-motion";

const BoardComponent = () => {
  const {
    timeStarted,
    win,
    lost,
    board,
    lives,
    handleStartGame,
    handleCheckCell,
    setDifficulty,
    timeAgo,
    difficulty,
    timeUsed,
    resetGame,
  } = useSudoku();

  if (!timeStarted) {
    return (
      <SudokuLobby onStart={handleStartGame} setDifficulty={setDifficulty} />
    );
  }
  if (lost) {
    return <SudokuLost resetGame={resetGame} />;
  }
  if (win) {
    return (
      <SudokuWin
        timeUsed={timeUsed}
        difficulty={difficulty}
        resetGame={resetGame}
      />
    );
  }
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.01,
      },
    },
  };

  const item = {
    hidden: { opacity: 0 },
    show: { opacity: 1 },
  };
  return (
    <section className="flex justify-center items-center p-4">
      <article className="gap-2 grid grid-rows-[auto,1fr] items-center">
        <div className="flex gap-4 items-center">
          <HeartNav lives={lives} />
          <motion.p
            // exit={{ y: 20, opacity: 0, position: "absolute" }}
            // initial={{ y: -20, opacity: 0 }}
            // animate={{ y: 0, opacity: 1 }}
            key={"countdoww" + timeAgo}
          >
            {timeAgo}
          </motion.p>
        </div>
        <motion.table
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl  "
          variants={container}
          initial="hidden"
          animate="show"
        >
          {board.map((row, rowIndex) => (
            <tr
              className="flex border-secondary [&:nth-child(3)]:border-b-4 [&:nth-child(6)]:border-b-4"
              key={rowIndex}
            >
              {row.map((cell, cellIndex) => (
                <motion.td
                  variants={item}
                  className="border border-secondary w-full h-full aspect-square  sm:w-10 sm:h-10 md:w-14 md:h-14 lg:w-16 lg:h-16  flex justify-center items-center [&:nth-child(3)]:border-r-4 [&:nth-child(6)]:border-r-4 "
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
                      className="text-center transition-all h-full w-full focus:outline-none focus:bg-primary bg-secondary/50"
                      max={9}
                      min={1}
                      value={""}
                      pattern="[0-9]"
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
                </motion.td>
              ))}
            </tr>
          ))}
        </motion.table>
      </article>
    </section>
  );
};

const SudokuPage = () => {
  return (
    <BoardLayout title="Sudoku">
      <BoardComponent />
    </BoardLayout>
  );
};

export default SudokuPage;
