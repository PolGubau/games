import { memo, useCallback, useEffect, useState } from "react";
import BoardLayout from "../../Layouts/BoardLayout";
import { getRandom } from "../../utilities";
import { staticOperations } from "./data";
import Game from "./screens/Game";
import MathIdlePage from "./screens/Idle";
import { Operation, SolvedOperation } from "./types";

export const MathPage = () => {
  return (
    <BoardLayout title="Math">
      <Board />
    </BoardLayout>
  );
};

export const useMath = () => {
  const [idx, setIdx] = useState<number>(-1);
  const [time, setTime] = useState<number>(0);

  const operations = staticOperations;

  const [answered, setAnswered] = useState<SolvedOperation[]>([]);

  const questionList = useCallback(() => {
    const shuffledOperations = operations;

    return shuffledOperations;
  }, []);

  const currentOperation = questionList()[idx];

  const handleAnswer = (answer: string) => {
    //
    if (!currentOperation) {
      console.error("No operation to solve");
      return;
    }
    const newAnswer: SolvedOperation = {
      ...currentOperation,
      at: new Date(),
      answered: answer,
    };
    setAnswered((prev) => [...prev, newAnswer]);

    //
    setIdx((prev) => prev + 1);
  };

  const start = () => {
    setIdx(0);
    setAnswered([]);
    setTime(60);
  };
  useEffect(() => {
    if (questionList().length - 1 === idx) {
      setTime(0);
    }
  }, [idx]);
  useEffect(() => {
    if (time > 0) {
      const timeout = setTimeout(() => setTime(time - 1), 1000);
      return () => clearTimeout(timeout);
    }
  }, [time]);

  return { currentOperation, answered, start, handleAnswer, time };
};

export const Board = () => {
  const { currentOperation, time, start, handleAnswer, answered } = useMath();

  return (
    <section className="p-4 flex justify-center h-full flex-col gap-8 items-center">
      {!time ? (
        <MathIdlePage onStart={start} done={answered} />
      ) : (
        <Game
          operation={currentOperation as Operation}
          onSubmit={(o) => handleAnswer(o)}
          time={time}
        />
      )}
    </section>
  );
};
