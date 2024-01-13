import { Button, Checkbox, Tooltip } from "pol-ui";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { PiArrowLeftBold } from "react-icons/pi";
import ConfettiExplosion from "react-confetti-explosion";
interface Props {
  toggleOnlyWriteIfCorrect: () => void;
  setTime: (time: number) => void;
  onlyWriteIfCorrect: boolean;
  characterCount: number;
}
const IdlePage: React.FC<Props> = ({
  toggleOnlyWriteIfCorrect,
  setTime,
  onlyWriteIfCorrect,
  characterCount,
}: Props) => {
  return (
    <div className="text-center flex flex-col gap-4 justify-center items-center">
      {characterCount > 0 ? (
        <>
          <ConfettiExplosion />
          <h3 className="text-3xl md:text-5xl max-w-[600px]  font-bold">
            You typed{" "}
            <span className="text-primary-700 font-bold">{characterCount}</span>{" "}
            character
            {characterCount > 1 && "s"}.
          </h3>
        </>
      ) : (
        <h3 className="text-3xl md:text-5xl max-w-[600px]  font-bold">
          How many words can you type in 60 seconds?
        </h3>
      )}

      <label className="flex gap-2 items-center">
        <Checkbox
          checked={onlyWriteIfCorrect}
          onChange={() => {
            toggleOnlyWriteIfCorrect();
          }}
        />
        Only write if correct
      </label>

      <p className="flex gap-2 w-full flex-1">
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
              className="aspect-square  bg-primary-900 text-primary-50 rounded-full text-4xl p-4 focus-visible:ring-4 focus-visible:ring-offset-4 focus-visible:ring-primary-700 focus-visible:ring-offset-secondary-50 focus:outline-none flex justify-center items-center"
            >
              <PiArrowLeftBold />
            </Link>
          </motion.div>
        </Tooltip>

        <motion.div
          className="w-full flex flex-1"
          whileHover={{
            scale: 0.98,
          }}
          whileTap={{
            scale: 0.9,
          }}
        >
          <Button
            autoFocus
            onClick={() => setTime(60)}
            fullSized
            className="bg-primary-900 rounded-full text-primary-50 text-4xl p-4  flex flex-1"
          >
            Start
          </Button>
        </motion.div>
      </p>
    </div>
  );
};

export default IdlePage;
