import { useEffect, useState } from "react";
import { getRandomWord } from "./utilities";
import { Button, Checkbox } from "pol-ui";
import { motion, useIsPresent } from "framer-motion";

const WordsMinutePage = () => {
  const [characterCount, setCharacterCount] = useState(0);
  const [buffer, setBuffer] = useState("");
  const isPresent = useIsPresent();

  const [onlyWriteIfCorrect, setOnlyWriteIfCorrect] = useState<boolean>(true);

  const [time, setTime] = useState<number>(0); // in seconds
  const [word, setWord] = useState(() => getRandomWord());

  const validateTyped = (typed: string, target: string) => {
    if (typed === target) {
      setWord(() => getRandomWord());
      setBuffer("");
      setCharacterCount((prev) => prev + word.length);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    validateTyped(buffer, word);
  };

  useEffect(() => {
    if (time > 0) {
      const timeout = setTimeout(() => setTime(time - 1), 1000);
      return () => clearTimeout(timeout);
    }
  }, [time]);

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    // only modify the buffer if the typed character is what we expect

    const typed = e.target.value;
    if (
      typed[typed.length - 1] === word[typed.length - 1] ||
      !onlyWriteIfCorrect
    ) {
      setBuffer(typed);
    }

    validateTyped(typed, word);
  };

  return (
    <main className="p-8 flex flex-col gap-8  items-center justify-center">
      {time > 0 && <p className="text-slate-00">{time}</p>}
      <h1>Characters typed : {characterCount}</h1>
      {time === 0 ? (
        <>
          <label className="flex gap-2 items-center">
            <Checkbox
              checked={onlyWriteIfCorrect}
              onChange={() => {
                setOnlyWriteIfCorrect((prev) => !prev);
              }}
            />
            Only write if correct
          </label>

          <Button autoFocus onClick={() => setTime(60)}>
            Start
          </Button>
        </>
      ) : (
        <div>
          <form
            onSubmit={handleSubmit}
            className="relative flex gap-2 items-center"
          >
            <label
              htmlFor="word"
              className="text-3xl md:text-4xl xl:text-5xl rounded-2xl px-2 py-1 absolute opacity-40"
            >
              {word}
            </label>
            <input
              autoComplete="off"
              autoFocus
              className="text-3xl md:text-4xl xl:text-5xl rounded-2xl px-2 py-1 "
              id="word"
              type="text"
              value={buffer}
              onChange={handleChangeInput}
            />
            <button type="submit">Enter</button>
          </form>
          <div
            className=" fixed top-0 left-0 w-full transition-all h-full -z-10 bg-slate-700"
            style={{
              width: `${(time / 60) * 100}%`,
            }}
          ></div>
        </div>
      )}
      <motion.div
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0, transition: { duration: 0.5, ease: "circOut" } }}
        exit={{ scaleX: 1, transition: { duration: 0.5, ease: "circIn" } }}
        style={{ originX: isPresent ? 0 : 1 }}
        className="privacy-screen"
      />
    </main>
  );
};

export default WordsMinutePage;
