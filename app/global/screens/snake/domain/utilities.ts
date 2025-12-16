import type { Direction, Position } from "./types";
import { SNAKE_CONFIG } from "./types";

/**
 * Generate random food position on the grid
 */
export function generateFoodPosition(snake: Position[]): Position {
  let position: Position;
  let attempts = 0;
  const maxAttempts = 100;

  do {
    const x = Math.floor(Math.random() * SNAKE_CONFIG.GRID_SIZE) * SNAKE_CONFIG.CELL_SIZE;
    const y = Math.floor(Math.random() * SNAKE_CONFIG.GRID_SIZE) * SNAKE_CONFIG.CELL_SIZE;
    position = { x, y };
    attempts++;
  } while (isPositionOnSnake(position, snake) && attempts < maxAttempts);

  return position;
}

/**
 * Check if a position is occupied by the snake
 */
export function isPositionOnSnake(position: Position, snake: Position[]): boolean {
  return snake.some((segment) => segment.x === position.x && segment.y === position.y);
}

/**
 * Get the next head position based on direction
 */
export function getNextHeadPosition(head: Position, direction: Direction): Position {
  const newHead = { ...head };

  switch (direction) {
    case "UP":
      newHead.y -= SNAKE_CONFIG.CELL_SIZE;
      break;
    case "DOWN":
      newHead.y += SNAKE_CONFIG.CELL_SIZE;
      break;
    case "LEFT":
      newHead.x -= SNAKE_CONFIG.CELL_SIZE;
      break;
    case "RIGHT":
      newHead.x += SNAKE_CONFIG.CELL_SIZE;
      break;
  }

  return newHead;
}

/**
 * Check if the snake has collided with walls
 */
export function checkWallCollision(head: Position): boolean {
  const maxPosition = (SNAKE_CONFIG.GRID_SIZE - 1) * SNAKE_CONFIG.CELL_SIZE;
  return head.x < 0 || head.x > maxPosition || head.y < 0 || head.y > maxPosition;
}

/**
 * Check if the snake has collided with itself
 */
export function checkSelfCollision(head: Position, body: Position[]): boolean {
  // Check against body (excluding the head itself)
  return body.slice(0, -1).some((segment) => segment.x === head.x && segment.y === head.y);
}

/**
 * Check if snake head is at food position
 */
export function checkFoodCollision(head: Position, food: Position): boolean {
  return head.x === food.x && head.y === food.y;
}

/**
 * Check if a direction is opposite to another
 */
export function isOppositeDirection(current: Direction, next: Direction): boolean {
  return (
    (current === "UP" && next === "DOWN") ||
    (current === "DOWN" && next === "UP") ||
    (current === "LEFT" && next === "RIGHT") ||
    (current === "RIGHT" && next === "LEFT")
  );
}

/**
 * Create initial snake in the center of the board
 */
export function createInitialSnake(): Position[] {
  const snake: Position[] = [];
  const centerY = Math.floor(SNAKE_CONFIG.GRID_SIZE / 2) * SNAKE_CONFIG.CELL_SIZE;
  const startX = Math.floor(SNAKE_CONFIG.GRID_SIZE / 3) * SNAKE_CONFIG.CELL_SIZE;

  for (let i = 0; i < SNAKE_CONFIG.INITIAL_LENGTH; i++) {
    snake.push({
      x: startX + i * SNAKE_CONFIG.CELL_SIZE,
      y: centerY,
    });
  }
  return snake;
}

/**
 * Calculate score based on food eaten and difficulty
 */
export function calculateScore(foodEaten: number, difficulty: string): number {
  const basePoints = SNAKE_CONFIG.FOOD_POINTS;
  const difficultyMultiplier =
    difficulty === "EXTREME" ? 2 : difficulty === "HARD" ? 1.5 : difficulty === "MEDIUM" ? 1.2 : 1;
  return Math.floor(foodEaten * basePoints * difficultyMultiplier);
}

/**
 * Format time as MM:SS
 */
export function formatGameTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

/**
 * Get high score from localStorage
 */
export function getHighScore(): number {
  if (typeof window === "undefined") return 0;
  const stored = localStorage.getItem("snake-high-score");
  return stored ? parseInt(stored, 10) : 0;
}

/**
 * Save high score to localStorage
 */
export function saveHighScore(score: number): void {
  if (typeof window === "undefined") return;
  const currentHigh = getHighScore();
  if (score > currentHigh) {
    localStorage.setItem("snake-high-score", score.toString());
  }
}

/**
 * Get performance level based on score
 */
export function getPerformanceLevel(score: number): {
  label: string;
  color: string;
  message: string;
} {
  if (score < 50) {
    return {
      label: "Beginner",
      color: "#6B7280",
      message: "Keep practicing!",
    };
  }
  if (score < 150) {
    return {
      label: "Novice",
      color: "#3B82F6",
      message: "You're getting better!",
    };
  }
  if (score < 300) {
    return {
      label: "Skilled",
      color: "#10B981",
      message: "Nice moves!",
    };
  }
  if (score < 500) {
    return {
      label: "Expert",
      color: "#A855F7",
      message: "Impressive skills!",
    };
  }
  return {
    label: "Master",
    color: "#EAB308",
    message: "Snake Master! Outstanding!",
  };
}
