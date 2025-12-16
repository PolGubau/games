import { useState } from "react";
import BoardLayout from "../../Layouts/BoardLayout";
import { useWordsPerMinute } from "./hooks/use-words-per-minute";
import { IdleScreen } from "./ui/idle-screen";
import { PlayingScreen } from "./ui/playing-screen";
import { FinishedScreen } from "./ui/finished-screen";
import { WPM_CONFIG } from "./domain/types";

const WordsMinutePage = () => {
  const [timeLimit, setTimeLimit] = useState<number>(WPM_CONFIG.DEFAULT_TIME);
  const [lastWpm, setLastWpm] = useState<number | undefined>(undefined);

  const {
    isPlaying,
    isFinished,
    timeRemaining,
    gameMode,
    wordState,
    stats,
    startGame,
    resetGame,
    handleInput,
    toggleMode,
    setTime,
  } = useWordsPerMinute({
    timeLimit,
    onGameEnd: (results) => {
      setLastWpm(results.wpm);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleTimeChange = (seconds: number) => {
    setTimeLimit(seconds);
    setTime(seconds);
  };

  return (
    <BoardLayout title="Words per Minute">
      <div className="flex flex-col gap-8 items-center">
        {!isPlaying && !isFinished && (
          <IdleScreen
            onStart={startGame}
            gameMode={gameMode}
            onToggleMode={toggleMode}
            timeLimit={timeLimit}
            onSetTime={handleTimeChange}
            lastScore={lastWpm}
          />
        )}

        {isPlaying && !isFinished && (
          <PlayingScreen
            currentWord={wordState.current}
            typedWord={wordState.typed}
            timeRemaining={timeRemaining}
            characterCount={stats.characterCount}
            onInput={handleInput}
            onSubmit={handleSubmit}
          />
        )}

        {isFinished && (
          <FinishedScreen stats={stats} onRestart={resetGame} />
        )}
      </div>
    </BoardLayout>
  );
};

export default WordsMinutePage;
