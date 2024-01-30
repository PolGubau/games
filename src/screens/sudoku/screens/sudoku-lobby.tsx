import { Button, Label, RangeSlider, Tooltip } from "pol-ui";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { PiArrowLeftBold } from "react-icons/pi";
interface Props {
  onStart: () => void;
  setDifficulty: (difficulty: number) => void;
}

const SudokuLobby: React.FC<Props> = ({ onStart, setDifficulty }: Props) => {
  return (
    <div className="p-4 pt-8 flex flex-col gap-8 items-center h-auto justify-between md:justify-center ">
      <h3 className="text-2xl md:text-5xl max-w-[600px] text-center font-bold ">
        Are you ready to beat the sudoku? 🧐
      </h3>
      <div className="flex flex-col gap-2 justify-center w-full max-w-[500px] text-center">
        <Label htmlFor="difficulty" className="text-lg md:text-2xl">
          How hard do you want it to be? 😈
        </Label>
        <RangeSlider
          min={0}
          max={100}
          step={1}
          defaultValue={50}
          onChange={(e) => {
            const value = parseInt(e.target.value);
            setDifficulty(value);
          }}
          id="difficulty"
          className="w-full max-w-[500px]"
        />
      </div>

      <p className="flex gap-2 w-full max-w-[600px]">
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

        <Button
          autoFocus
          onClick={onStart}
          fullSized
          className="bg-primary-900 rounded-full text-primary-50 text-4xl p-4 flex flex-1 h-[70px]"
        >
          Start
        </Button>
      </p>
    </div>
  );
};

export default SudokuLobby;
