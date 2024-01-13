import ConfettiExplosion from "react-confetti-explosion";
import { motion } from "framer-motion";
import { PiArrowCounterClockwiseBold, PiArrowLeftBold } from "react-icons/pi";
import { Link } from "react-router-dom";
import { Tooltip } from "pol-ui";

interface Props {
  onReset: () => void;
  hintsUsed: number;
  time: number;
}
const FinishPage: React.FC<Props> = ({ onReset, hintsUsed, time }) => {
  return (
    <div className="flex flex-col items-center  gap-8 p-8 mt-20">
      <ConfettiExplosion />
      <h1 className="text-7xl sm:text-7xl font-semibold">You win!</h1>

      {Boolean(time) && <p>You finished in {time} seconds.</p>}
      {Boolean(hintsUsed) && (
        <p>
          You used {hintsUsed} hint{hintsUsed > 1 && "s"}.
        </p>
      )}

      <div className="flex gap-4 justify-center">
        <Tooltip content="Return home (the game won't be saved)">
          <Link to={"/"}>
            <motion.button
              layoutId="backButton"
              whileHover={{
                scale: 1.1,
                rotate: -10,
              }}
              whileTap={{
                scale: 0.9,
              }}
              className=" bg-primary-900 text-primary-50 rounded-full text-4xl p-4 focus-visible:ring-4 focus-visible:ring-offset-4 focus-visible:ring-primary-700 focus-visible:ring-offset-secondary-50 focus:outline-none flex justify-center items-center"
            >
              <PiArrowLeftBold />
            </motion.button>
          </Link>
        </Tooltip>
        <Tooltip content="Reset the game">
          <motion.button
            layoutId="resetButton"
            whileHover={{
              rotate: -10,
              scale: 1.1,
            }}
            whileTap={{
              scale: 0.9,
              rotate: -360,
            }}
            whileFocus={{
              scale: 1.1,
              rotate: -20,
            }}
            onClick={onReset}
            className="aspect-square  bg-primary-900 text-primary-50 rounded-full text-4xl p-4 focus-visible:ring-4 focus-visible:ring-offset-4 focus-visible:ring-primary-700 focus-visible:ring-offset-secondary-50 focus:outline-none flex justify-center items-center"
          >
            <PiArrowCounterClockwiseBold />
          </motion.button>
        </Tooltip>
      </div>
    </div>
  );
};

export default FinishPage;
