import { Button, Tooltip } from "pol-ui";
import { Link } from "react-router-dom";
import { motion, useIsPresent } from "framer-motion";
import { PiArrowLeftBold } from "react-icons/pi";
interface Props {
  resetGame: () => void;
}

const SudokuLost: React.FC<Props> = ({ resetGame }) => {
  const isPresent = useIsPresent();

  return (
    <div className="p-4 pt-8 flex flex-col gap-8 items-center  md:pt-40 h-auto relative">
      <div className="z-10 flex flex-col gap-8 w-full items-center">
        <h3 className="text-3xl md:text-5xl max-w-[600px] text-center font-bold text-error-900 ">
          {`Ohhh :(`}
        </h3>
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
          <Button
            autoFocus
            onClick={resetGame}
            fullSized
            className="bg-primary-900 rounded-full text-primary-50 text-4xl p-4 flex flex-1 h-[70px]"
          >
            Try again
          </Button>
        </p>
      </div>
      <motion.div
        initial={{ scaleY: 0 }}
        animate={{
          scaleY: 1,
          transition: { duration: 0.5, ease: "circOut" },
        }}
        exit={{ scaleY: 1, transition: { duration: 0.5, ease: "circIn" } }}
        style={{ originY: isPresent ? 0 : 1 }}
        className="absolute bottom-0 left-0 right-0 h-full bg-red-400 pointer-events-none"
      />
    </div>
  );
};

export default SudokuLost;
