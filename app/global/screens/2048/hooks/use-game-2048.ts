import { useCallback, useEffect, useState } from "react";
import type { Direction, GameState, GameStats } from "../domain/types";
import {
  createInitialState,
  createRandomTile,
  getLargestTile,
  hasLost,
  hasWon,
  moveTiles,
  saveBestScore,
  tilesHaveMoved,
} from "../domain/utilities";

export function useGame2048() {
  const [gameState, setGameState] = useState<GameState>(createInitialState);
  const [previousState, setPreviousState] = useState<GameState | null>(null);
  const [moves, setMoves] = useState(0);

  const stats: GameStats = {
    score: gameState.score,
    bestScore: gameState.bestScore,
    moves,
    largestTile: getLargestTile(gameState.tiles),
  };

  // Handle keyboard input
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (gameState.status !== "playing") return;

      let direction: Direction | null = null;

      switch (event.key) {
        case "ArrowUp":
        case "w":
        case "W":
          direction = "UP";
          break;
        case "ArrowDown":
        case "s":
        case "S":
          direction = "DOWN";
          break;
        case "ArrowLeft":
        case "a":
        case "A":
          direction = "LEFT";
          break;
        case "ArrowRight":
        case "d":
        case "D":
          direction = "RIGHT";
          break;
      }

      if (direction) {
        event.preventDefault();
        move(direction);
      }
    },
    [gameState.status, gameState.tiles],
  );

  // Register keyboard listener
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Move tiles in a direction
  const move = useCallback(
    (direction: Direction) => {
      if (gameState.status !== "playing") return;

      const { tiles: newTiles, scoreGained } = moveTiles(gameState.tiles, direction);

      // Check if anything moved
      if (!tilesHaveMoved(gameState.tiles, newTiles)) return;

      // Save previous state for undo
      setPreviousState(gameState);

      // Add new tile
      const newTile = createRandomTile(newTiles);
      if (newTile) newTiles.push(newTile);

      const newScore = gameState.score + scoreGained;
      const newBestScore = Math.max(newScore, gameState.bestScore);

      // Save best score
      saveBestScore(newBestScore);

      // Update game state
      const newState: GameState = {
        tiles: newTiles,
        score: newScore,
        bestScore: newBestScore,
        status: "playing",
        canUndo: true,
      };

      // Check win/loss conditions
      if (hasWon(newTiles)) {
        newState.status = "won";
      } else if (hasLost(newTiles)) {
        newState.status = "lost";
      }

      setGameState(newState);
      setMoves((m) => m + 1);
    },
    [gameState],
  );

  // Start new game
  const newGame = useCallback(() => {
    setGameState(createInitialState());
    setPreviousState(null);
    setMoves(0);
  }, []);

  // Continue playing after winning
  const continueGame = useCallback(() => {
    setGameState((prev) => ({ ...prev, status: "playing" }));
  }, []);

  // Undo last move
  const undo = useCallback(() => {
    if (previousState && gameState.canUndo) {
      setGameState({ ...previousState, canUndo: false });
      setPreviousState(null);
      setMoves((m) => Math.max(0, m - 1));
    }
  }, [previousState, gameState.canUndo]);

  return {
    gameState,
    stats,
    move,
    newGame,
    continueGame,
    undo,
  };
}
