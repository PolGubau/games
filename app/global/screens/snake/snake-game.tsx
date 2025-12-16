import { useEffect } from "react";
import BoardLayout from "../../Layouts/BoardLayout";
import { useSnakeGame } from "./hooks/use-snake-game";
import { IdleScreen } from "./ui/idle-screen";
import { PlayingScreen } from "./ui/playing-screen";
import { GameOverScreen } from "./ui/game-over-screen";
import { KEY_MAPPINGS } from "./domain/types";

function SnakeBoard() {
  const {
    gameState,
    snake,
    foodPosition,
    stats,
    isPaused,
    difficulty,
    startGame,
    resetGame,
    togglePause,
    changeDirection,
    changeDifficulty,
  } = useSnakeGame();

  useEffect(() => {
    if (gameState !== "playing") return;

    const handleKeyPress = (e: KeyboardEvent) => {
      const key = e.key;

      // Pause controls
      if (key === " " || key.toLowerCase() === "p") {
        e.preventDefault();
        togglePause();
        return;
      }

      // Direction controls
      const direction = KEY_MAPPINGS[key];
      if (direction) {
        e.preventDefault();
        changeDirection(direction);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [gameState, changeDirection, togglePause]);

  return (
    <main className="p-8 flex flex-col gap-8 items-center justify-center min-h-[calc(100vh-4rem)]">
      {gameState === "idle" && (
        <IdleScreen
          difficulty={difficulty}
          onDifficultyChange={changeDifficulty}
          onStart={startGame}
          highScore={stats.highScore}
          lastScore={stats.score > 0 ? stats.score : undefined}
        />
      )}      {gameState === "playing" && (
        <PlayingScreen
          snake={snake}
          foodPosition={foodPosition}
          isPaused={isPaused}
          stats={stats}
          onPause={togglePause}
          onReset={resetGame}
          onDirectionChange={changeDirection}
        />
      )}

      {gameState === "gameOver" && (
        <GameOverScreen
          stats={stats}
          onRestart={startGame}
        />
      )}
    </main>
  );
}

export const SnakePage = () => {
  return (
    <BoardLayout title="Snake">
      <SnakeBoard />
    </BoardLayout>
  );
};
