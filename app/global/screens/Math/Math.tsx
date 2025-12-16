import { useState } from "react";
import BoardLayout from "../../Layouts/BoardLayout";
import { useMathGame } from "./hooks/use-math-game";
import { IdleScreen } from "./ui/idle-screen";
import { PlayingScreen } from "./ui/playing-screen";
import { FinishedScreen } from "./ui/finished-screen";
import { MATH_CONFIG } from "./domain/types";
import type { DifficultyLevel } from "./domain/types";

export const MathPage = () => {
  const [timeLimit, setTimeLimit] = useState<number>(MATH_CONFIG.DEFAULT_TIME);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>("MEDIUM");
  const [lastResults, setLastResults] = useState<{
    score: number;
    correct: number;
    total: number;
  } | undefined>(undefined);

  const {
    isPlaying,
    isFinished,
    timeRemaining,
    currentOperation,
    currentIndex,
    totalOperations,
    stats,
    solvedOperations,
    startGame,
    resetGame,
    handleAnswer,
    changeDifficulty,
    changeTimeLimit,
  } = useMathGame({
    timeLimit,
    difficulty,
    operationsCount: MATH_CONFIG.DEFAULT_OPERATIONS,
    onGameEnd: (results) => {
      setLastResults({
        score: results.score,
        correct: results.correctAnswers,
        total: results.totalOperations,
      });
    },
  });

  const handleDifficultyChange = (newDifficulty: DifficultyLevel) => {
    setDifficulty(newDifficulty);
    changeDifficulty(newDifficulty);
  };

  const handleTimeChange = (seconds: number) => {
    setTimeLimit(seconds);
    changeTimeLimit(seconds);
  };

  return (
    <BoardLayout title="Math Challenge">
      <div className="p-4 pt-8 flex flex-col gap-8 items-center md:pt-20 min-h-[60vh]">
        {!isPlaying && !isFinished && (
          <IdleScreen
            onStart={startGame}
            difficulty={difficulty}
            onDifficultyChange={handleDifficultyChange}
            timeLimit={timeLimit}
            onTimeChange={handleTimeChange}
            lastResults={lastResults}
            solvedOperations={solvedOperations}
          />
        )}

        {isPlaying && !isFinished && currentOperation && (
          <PlayingScreen
            operation={currentOperation}
            timeRemaining={timeRemaining}
            currentIndex={currentIndex}
            totalOperations={totalOperations}
            onAnswer={handleAnswer}
            onReset={resetGame}
          />
        )}

        {isFinished && <FinishedScreen stats={stats} onRestart={resetGame} />}
      </div>
    </BoardLayout>
  );
};

