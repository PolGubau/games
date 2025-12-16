import type { DifficultyLevel, Operation, SolvedOperation } from "./types";
import { DIFFICULTY_LEVELS, MATH_CONFIG } from "./types";

/**
 * Generate unique mathematical operations
 */
export function generateOperations(
  count: number,
  difficulty: DifficultyLevel = "MEDIUM",
): Operation[] {
  const config = DIFFICULTY_LEVELS[difficulty];
  const generated = new Set<string>();
  const result: Operation[] = [];

  while (result.length < count) {
    const a = Math.floor(Math.random() * (config.max - config.min + 1)) + config.min;
    const b = Math.floor(Math.random() * (config.max - config.min + 1)) + config.min;
    const op = config.operators[Math.floor(Math.random() * config.operators.length)];

    // Skip division if not evenly divisible or b is 0
    if (op === "/" && (b === 0 || a % b !== 0)) continue;

    const expr = `${a} ${op} ${b}`;
    if (generated.has(expr)) continue;

    const correct = calculateOperation(a, b, op).toString();
    const solutions = generateSolutions(correct);

    generated.add(expr);
    result.push({
      operation: expr,
      correct,
      solutions,
    });
  }

  return result;
}

/**
 * Calculate the result of an operation
 */
function calculateOperation(a: number, b: number, op: string): number {
  switch (op) {
    case "+":
      return a + b;
    case "-":
      return a - b;
    case "*":
      return a * b;
    case "/":
      return Math.floor(a / b);
    default:
      return 0;
  }
}

/**
 * Generate false answers along with the correct one
 */
function generateSolutions(correct: string): string[] {
  const falseAnswers = new Set<string>();
  const correctNum = parseInt(correct, 10);

  while (falseAnswers.size < MATH_CONFIG.FALSE_ANSWERS_COUNT) {
    const delta =
      Math.floor(Math.random() * (MATH_CONFIG.ANSWER_DELTA_RANGE * 2 + 1)) -
      MATH_CONFIG.ANSWER_DELTA_RANGE;
    if (delta === 0) continue;

    const wrong = (correctNum + delta).toString();
    if (wrong !== correct && !falseAnswers.has(wrong)) {
      falseAnswers.add(wrong);
    }
  }

  // Shuffle and return
  return Array.from(falseAnswers)
    .concat(correct)
    .sort(() => Math.random() - 0.5);
}

/**
 * Calculate accuracy percentage
 */
export function calculateAccuracy(correct: number, total: number): number {
  if (total === 0) return 100;
  return Math.round((correct / total) * 100);
}

/**
 * Calculate average time per operation
 */
export function calculateAverageTime(operations: SolvedOperation[]): number {
  if (operations.length === 0) return 0;
  const totalTime = operations.reduce((sum, op) => sum + op.timeToAnswer, 0);
  return Math.round(totalTime / operations.length);
}

/**
 * Calculate operations per minute
 */
export function calculateOperationsPerMinute(operationsCount: number, timeElapsed: number): number {
  if (timeElapsed === 0) return 0;
  const minutes = timeElapsed / 60;
  return Math.round(operationsCount / minutes);
}

/**
 * Calculate score based on correct answers and speed
 */
export function calculateScore(operations: SolvedOperation[]): number {
  return operations.reduce((score, op) => {
    if (!op.isCorrect) return score;

    // Base points for correct answer
    let points = 100;

    // Bonus for speed (max 50 bonus points for answers under 2 seconds)
    const speedBonus = Math.max(0, 50 - Math.floor(op.timeToAnswer / 40));
    points += speedBonus;

    return score + points;
  }, 0);
}

/**
 * Format time as MM:SS
 */
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

/**
 * Format milliseconds as seconds with decimal
 */
export function formatMilliseconds(ms: number): string {
  return `${(ms / 1000).toFixed(2)}s`;
}

/**
 * Get performance level based on accuracy and speed
 */
export function getPerformanceLevel(stats: { accuracy: number; averageTime: number }): {
  level: string;
  color: string;
  description: string;
} {
  const { accuracy, averageTime } = stats;

  // Average time in seconds
  const avgSeconds = averageTime / 1000;

  if (accuracy < 50) {
    return {
      level: "Beginner",
      color: "text-gray-500",
      description: "Keep practicing!",
    };
  }

  if (accuracy < 70 || avgSeconds > 5) {
    return {
      level: "Novice",
      color: "text-blue-500",
      description: "You're improving!",
    };
  }

  if (accuracy < 85 || avgSeconds > 3) {
    return {
      level: "Skilled",
      color: "text-green-500",
      description: "Great job!",
    };
  }

  if (accuracy < 95 || avgSeconds > 2) {
    return {
      level: "Expert",
      color: "text-purple-500",
      description: "Excellent performance!",
    };
  }

  return {
    level: "Master",
    color: "text-yellow-500",
    description: "Outstanding! You're a math genius!",
  };
}
