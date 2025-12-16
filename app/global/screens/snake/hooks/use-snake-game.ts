import { useCallback, useEffect, useRef, useState } from "react";
import type { Direction, DifficultyLevel, GameResults, GameStats, Position } from "../domain/types";
import { DIFFICULTY_LEVELS, KEY_MAPPINGS, SNAKE_CONFIG } from "../domain/types";
import {
  calculateScore,
  checkFoodCollision,
  checkSelfCollision,
  checkWallCollision,
  createInitialSnake,
  generateFoodPosition,
  getHighScore,
  getNextHeadPosition,
  isOppositeDirection,
  saveHighScore,
} from "../domain/utilities";

interface UseSnakeGameOptions {
  difficulty?: DifficultyLevel;
  onGameOver?: (results: GameResults) => void;
}

export function useSnakeGame({ difficulty = "MEDIUM", onGameOver }: UseSnakeGameOptions = {}) {
  const [snake, setSnake] = useState<Position[]>(createInitialSnake());
  const [direction, setDirection] = useState<Direction>("RIGHT");
  const [foodPosition, setFoodPosition] = useState<Position>(() =>
    generateFoodPosition(createInitialSnake()),
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [foodEaten, setFoodEaten] = useState(0);
  const [gameTime, setGameTime] = useState(0);
  const [currentDifficulty, setCurrentDifficulty] = useState<DifficultyLevel>(difficulty);
  const [highScore, setHighScore] = useState(getHighScore());

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const directionRef = useRef<Direction>(direction);
  const foodPositionRef = useRef<Position>(foodPosition);
  const speedRef = useRef<number>(DIFFICULTY_LEVELS[currentDifficulty].speed);
  const snakeRef = useRef<Position[]>(snake);

  // Sync refs
  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  useEffect(() => {
    foodPositionRef.current = foodPosition;
  }, [foodPosition]);

  useEffect(() => {
    snakeRef.current = snake;
  }, [snake]);

  const speed = DIFFICULTY_LEVELS[currentDifficulty].speed;
  speedRef.current = speed;

  // Calculate food eaten from snake length (always in sync)
  const actualFoodEaten = snake.length - SNAKE_CONFIG.INITIAL_LENGTH;
  const score = calculateScore(actualFoodEaten, currentDifficulty);

  const stats: GameStats = {
    score,
    foodEaten: actualFoodEaten,
    length: snake.length,
    highScore,
    gameTime,
  };

  // Main game loop
  useEffect(() => {
    // Always clear any existing interval first
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (!isPlaying || isPaused || isGameOver) {
      return;
    }
    const interval = setInterval(() => {
      const currentSnake = snakeRef.current;
      const head = currentSnake[currentSnake.length - 1];
      const newHead = getNextHeadPosition(head, directionRef.current);

      // Check wall collision
      if (checkWallCollision(newHead)) {
        setIsGameOver(true);
        setIsPlaying(false);
        return;
      }

      // Check self collision
      if (checkSelfCollision(newHead, currentSnake)) {
        setIsGameOver(true);
        setIsPlaying(false);
        return;
      }

      // Check food
      const ateFood = checkFoodCollision(newHead, foodPositionRef.current);

      let newSnake: Position[];
      if (ateFood) {
        newSnake = [...currentSnake, newHead]; // Grow
        const newFood = generateFoodPosition(newSnake);
        setFoodPosition(newFood);
        foodPositionRef.current = newFood;
      } else {
        newSnake = [...currentSnake.slice(1), newHead]; // Normal move
      }

      // Update both ref and state
      snakeRef.current = newSnake;
      setSnake(newSnake);
    }, speedRef.current);

    intervalRef.current = interval;

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isPlaying, isPaused, isGameOver]); // Removed speed from deps
  useEffect(() => {
    if (!isPlaying || isPaused || isGameOver) return;

    const interval = setInterval(() => setGameTime((t) => t + 1), 1000);
    timeIntervalRef.current = interval;
    return () => clearInterval(interval);
  }, [isPlaying, isPaused, isGameOver]);

  // Handle game over
  useEffect(() => {
    if (isGameOver && isPlaying) {
      const newHighScore = Math.max(score, highScore);
      saveHighScore(newHighScore);
      setHighScore(newHighScore);

      const results: GameResults = {
        ...stats,
        difficulty: currentDifficulty,
        completedAt: new Date(),
      };

      onGameOver?.(results);
    }
  }, [isGameOver]);

  const startGame = useCallback(() => {
    const initialSnake = createInitialSnake();
    setSnake(initialSnake);
    setDirection("RIGHT");
    setFoodPosition(generateFoodPosition(initialSnake));
    setIsPlaying(true);
    setIsGameOver(false);
    setIsPaused(false);
    setFoodEaten(0);
    setGameTime(0);
  }, []);

  const pauseGame = useCallback(() => {
    if (!isPlaying || isGameOver) return;
    setIsPaused((prev) => !prev);
  }, [isPlaying, isGameOver]);

  const resetGame = useCallback(() => {
    const initialSnake = createInitialSnake();
    setSnake(initialSnake);
    setDirection("RIGHT");
    setFoodPosition(generateFoodPosition(initialSnake));
    setIsPlaying(false);
    setIsGameOver(false);
    setIsPaused(false);
    setFoodEaten(0);
    setGameTime(0);
  }, []);

  const changeDirection = useCallback(
    (newDirection: Direction) => {
      if (!isPlaying || isGameOver) return;
      if (isOppositeDirection(direction, newDirection)) return;
      setDirection(newDirection);
    },
    [isPlaying, isGameOver, direction],
  );

  const handleKeyPress = useCallback(
    (key: string) => {
      // Pause with Space or P
      if (key === " " || key === "p" || key === "P") {
        pauseGame();
        return;
      }

      // Change direction
      const mappedDirection = KEY_MAPPINGS[key];
      if (mappedDirection) {
        changeDirection(mappedDirection);
      }
    },
    [changeDirection, pauseGame],
  );

  const changeDifficulty = useCallback(
    (newDifficulty: DifficultyLevel) => {
      if (isPlaying) return; // Don't allow difficulty change during game
      setCurrentDifficulty(newDifficulty);
    },
    [isPlaying],
  );

  const gameState = isGameOver ? "gameOver" : isPlaying ? "playing" : "idle";

  return {
    snake,
    direction,
    foodPosition,
    isPlaying,
    isGameOver,
    isPaused,
    difficulty: currentDifficulty,
    gameState,
    stats,
    startGame,
    togglePause: pauseGame,
    resetGame,
    changeDirection,
    handleKeyPress,
    changeDifficulty,
  };
}
