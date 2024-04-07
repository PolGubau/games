import { motion } from "framer-motion";
import { PiArrowCounterClockwiseBold, PiArrowLeftBold } from "react-icons/pi";
import { Link } from "react-router-dom";
import { Tooltip } from "pol-ui";
import BoardLayout from "../../Layouts/BoardLayout";
import { useState } from "react";
import FinishPage from "./finish-page";

// Each tile has an icon and a pastel color

export interface Tile {
  id: string;
  icon: JSX.Element;
  color: string;
}
export type TileId = Tile["id"];

export const Wordle = () => {
  return (
    <BoardLayout title="Wordle">
      <Board />
    </BoardLayout>
  );
};

const Board = () => {
  // Wordle game, you need to guess a word in 6 tries.
  // The word is 5 letters long and is composed of 5 different letters.
  // The game will tell you if a letter is in the word, if it's in the right place, or if it's not in the word at all.

  // The word to guess
  const word = "gubau";

  const ATTEMPS = 5;
  const LENGTH = 5;

  // The current attempt
  const [currentAttempt, setCurrentAttempt] = useState(0); // <- The current attempt, from 0 to 6
  // The current letter in the input

  const [inputValues, setInputValues] = useState<string[]>([]); // <- The current input values
  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValues((prev) => {
      const copy = [...prev];
      copy[currentAttempt] = value;
      return copy;
    });

    // evaluate if it's the last letter
    if (value.length === LENGTH) {
      // evaluate the word
      const isCorrect = value === word;
      // 1. Check if the word is correct, if it is, show the finish page
      if (isCorrect) {
        return (
          <FinishPage
            onReset={() => {
              setCurrentAttempt(0);
              setInputValues([]);
            }}
          />
        );
      }
      // 2. If it's not correct, check if the word is in the list of words
      // 3. If it's not in the list of words, show an error message and delete the input
      // 4. If it's in the list of words, show the number of letters that are in the word and the number of letters that are in the right place
    }
  };

  return (
    <main className="p-8 flex flex-col gap-8  items-center justify-center  ">
      <section className="flex gap-8 flex-col sm:flex-row h-full w-full justify-center">
        <div className="flex gap-4 sm:items-center items-center sm:justify-between sticky top-0 h-auto">
          <nav className="flex sm:flex-col gap-4 items-center">
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
            </Tooltip>{" "}
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
                onClick={() => {
                  alert("reset");
                }}
                className="aspect-square  bg-primary-900 text-primary-50 rounded-full text-4xl p-4 focus-visible:ring-4 focus-visible:ring-offset-4 focus-visible:ring-primary-700 focus-visible:ring-offset-secondary-50 focus:outline-none flex justify-center items-center"
              >
                <PiArrowCounterClockwiseBold />
              </motion.button>{" "}
            </Tooltip>
          </nav>

          <div className="h-auto  rounded-2xl flex-col items-center justify-center place-items-center">
            <div className="flex gap-4 items-center">
              <p className="text-2xl">Attempt: {currentAttempt}</p>
              <p className="text-2xl">Word: {word}</p>
            </div>
            <div className="flex flex-col gap-1">
              <input
                className="border-4"
                maxLength={LENGTH}
                type="text"
                max={LENGTH}
                onChange={handleChangeInput}
              />
            </div>
            <pre>{JSON.stringify(inputValues, null, 2)}</pre>
            <section className="flex gap-2 flex-col">
              {Array.from({ length: ATTEMPS }).map((_, attempt) => (
                <div className="flex" key={attempt}>
                  {Array.from({ length: LENGTH }).map((_, letterIndex) => {
                    const isThisAttempt = attempt === currentAttempt;

                    const isSelected =
                      isThisAttempt &&
                      letterIndex < inputValues[attempt]?.length;
                    return (
                      <div
                        key={letterIndex}
                        className={`w-10 h-10  border   text-4xl text-center ${
                          isSelected
                            ? "border-primary-500 "
                            : "border-primary-900 "
                        }`}
                      >
                        {currentAttempt === attempt && (
                          <>{inputValues[attempt]?.[letterIndex]}</>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </section>
          </div>
        </div>
      </section>
    </main>
  );
};
