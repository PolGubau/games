import { useEffect, useState } from "react";
import { getRandomWord } from "./utilities";
import IdlePage from "./idle-page";
import BoardLayout from "../../Layouts/BoardLayout";

const Board = () => {
  const [characterCount, setCharacterCount] = useState(0);
  const [buffer, setBuffer] = useState("");

  const [onlyWriteIfCorrect, setOnlyWriteIfCorrect] = useState<boolean>(true);

  const [time, setTime] = useState<number>(0); // in seconds
  const [word, setWord] = useState(() => getRandomWord());

  const validateTyped = (typed: string, target: string) => {
    if (typed.toLowerCase() === target.toLowerCase()) {
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

    const typed = e.target.value.toLowerCase();
    if (
      typed[typed.length - 1].toLowerCase() ===
        word[typed.length - 1].toLowerCase() ||
      !onlyWriteIfCorrect
    ) {
      setBuffer(typed);
    }

    validateTyped(typed, word);
  };

  const toggleOnlyWriteIfCorrect = () => {
    setOnlyWriteIfCorrect((prev) => !prev);
  };

  return (
    <div className="md:p-8 pt-8 flex flex-col gap-8 items-center md:pt-40">
      {time === 0 ? (
        <IdlePage
          characterCount={characterCount}
          toggleOnlyWriteIfCorrect={toggleOnlyWriteIfCorrect}
          setTime={setTime}
          onlyWriteIfCorrect={onlyWriteIfCorrect}
        />
      ) : (
        <div>
          <p className="text-primary-900 z-10 w-fit">{time}s</p>
          <form
            onSubmit={handleSubmit}
            className="relative flex gap-2 items-center z-10 w-fit "
          >
            <label
              htmlFor="word"
              className="text-3xl sm:text-4xl md:text-6xl xl:text-7xl rounded-2xl px-2 py-1 absolute opacity-40"
            >
              {word}
            </label>
            <input
              autoComplete="off"
              autoFocus
              spellCheck={false}
              autoCapitalize="off"
              autoCorrect="off"
              className="text-3xl sm:text-4xl md:text-6xl xl:text-7xl rounded-2xl px-2 py-1 border-none focus:outline-none bg-transparent w-fit"
              id="word"
              type="text"
              value={buffer}
              onChange={handleChangeInput}
            />
          </form>
          <div className="text-primary-900 z-20 w-fit">{characterCount}⭐</div>
          <div
            className="fixed top-0 right-0 w-full transition-all h-full bg-primary/50  "
            style={{
              // expand the bar as time goes by (from 0 to 100%) less time = more width
              width: `${100 - (time / 60) * 100}%`,
            }}
          />
        </div>
      )}
    </div>
  );
};

const WordsMinutePage = () => {
  return (
    <BoardLayout title="Words per minute">
      <Board />
    </BoardLayout>
  );
};

export default WordsMinutePage;
