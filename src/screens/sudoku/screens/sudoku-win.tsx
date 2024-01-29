import { Button, Tooltip } from "pol-ui";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { PiArrowLeftBold } from "react-icons/pi";
import ConfettiExplosion from "react-confetti-explosion";
interface Props {
  timeUsed: string | undefined;
  difficulty: number;
  resetGame: () => void;
}

const SudokuWin: React.FC<Props> = ({ resetGame, timeUsed, difficulty }) => {
  return (
    <div className="p-4 pt-8 flex flex-col gap-8 items-center md:pt-40 h-auto ">
      <hgroup className="text-center flex flex-col gap-4">
        <h3 className="text-3xl md:text-5xl max-w-[600px] text-center font-bold ">
          Congratulations! 🎉
        </h3>
        <h4>
          {`You beat the sudoku 
          ${timeUsed ? `in ${timeUsed}!` : ""}
          with a difficulty of ${difficulty}%`}
        </h4>
      </hgroup>
      <p className="flex gap-2 w-full flex-1 max-w-[600px]">
        <Tooltip content="Return home (the game won't be saved)">
          <motion.div
            className="w-full flex flex-1"
            layoutId="backButton"
            whileHover={{
              scale: 1.1,
              rotate: -5,
            }}
            whileTap={{
              scale: 0.9,
            }}
          >
            <Link
              to={"/"}
              className="aspect-square  bg-primary-900 text-primary-50 rounded-full text-4xl p-4 focus-visible:ring-4 focus-visible:ring-offset-4 focus-visible:ring-primary-700 focus-visible:ring-offset-secondary-50 focus:outline-none flex justify-center items-center  h-[70px]"
            >
              <PiArrowLeftBold />
            </Link>
          </motion.div>
        </Tooltip>
        <ConfettiExplosion />
        <Button
          autoFocus
          onClick={resetGame}
          fullSized
          className="bg-primary-900 rounded-full text-primary-50 text-4xl p-4 flex flex-1 h-[70px]"
        >
          Play again
        </Button>
      </p>
    </div>
  );
};

export default SudokuWin;
