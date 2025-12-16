import { ArrowLeft } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router";
import { twMerge } from "tailwind-merge";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Tooltip } from "~/components/ui/tooltip";
import type { SolvedOperation } from "../types";
//
const MathIdlePage = (props: { onStart: () => void; done?: SolvedOperation[] }) => {
  const { done, onStart } = props;

  const wins = done?.filter((q) => q.answered === q.correct);

  const texts = {
    idle: {
      title: "How many operations can you solve in 60s?",
      button: "Start",
    },
    end: {
      title: `You did ${done?.length} operations with ${wins?.length} correct!`,
      button: "Play again",
    },
  };

  const text = done?.length ? texts.end : texts.idle;

  return (
    <section className="flex flex-col gap-6 justify-center items-center w-full max-w-4xl">
      {/*  */}
      <h3 className="text-3xl w-full md:text-5xl max-w-[600px] font-bold text-center">
        {text.title}
      </h3>
      <p className="flex gap-2 w-full flex-1 ">
        <Tooltip label="Return home (the game won't be saved)">
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
              className="aspect-square bg-primary-900 text-primary-50 rounded-full text-4xl p-4 focus-visible:ring-4 focus-visible:ring-offset-4 focus-visible:ring-primary-700 focus-visible:ring-offset-secondary-50 focus:outline-none flex justify-center items-center  h-[70px]"
            >
              <ArrowLeft />
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
            onClick={() => onStart()}

            className="bg-primary-900 rounded-full text-primary-50 text-4xl p-4  flex flex-1 h-[70px]"
          >
            {text.button}
          </Button>
        </motion.div>
      </p>
      <ul className="flex flex-wrap gap-4">
        {done?.map((w) => {
          const isCorrect = w.correct.includes(w.answered);
          return (
            <li key={w.operation}>
              <Card
                className={twMerge(
                  isCorrect ? "bg-success-300" : "bg-error",
                  "min-w-[150px] flex gap-1",
                )}
              >
                <h4 className="text-xl flex gap-1">
                  {w.operation} =
                  {isCorrect ? (
                    w.answered
                  ) : (
                    <div className="flex gap-1">
                      <span className="line-through opacity-65">{w.answered}</span>
                      <span>{w.correct}</span>
                    </div>
                  )}
                </h4>
              </Card>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default MathIdlePage;
