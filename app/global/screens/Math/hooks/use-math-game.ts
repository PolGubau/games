import { useCallback, useEffect, useState } from "react";
import type {
  DifficultyLevel,
  GameResults,
  GameStats,
  Operation,
  SolvedOperation,
} from "../domain/types";
import { MATH_CONFIG } from "../domain/types";
import {
  calculateAccuracy,
  calculateAverageTime,
  calculateOperationsPerMinute,
  calculateScore,
  generateOperations,
} from "../domain/utilities";

interface UseMathGameOptions {
  timeLimit?: number;
  difficulty?: DifficultyLevel;
  operationsCount?: number;
  onGameEnd?: (results: GameResults) => void;
}

export function useMathGame({
  timeLimit = MATH_CONFIG.DEFAULT_TIME,
  difficulty = "MEDIUM",
  operationsCount = MATH_CONFIG.DEFAULT_OPERATIONS,
  onGameEnd,
}: UseMathGameOptions = {}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);
  const [operations, setOperations] = useState<Operation[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [solvedOperations, setSolvedOperations] = useState<SolvedOperation[]>([]);
  const [currentDifficulty, setCurrentDifficulty] = useState<DifficultyLevel>(difficulty);
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());

  // Current operation
  const currentOperation = operations[currentIndex] || null;

  // Calculate time elapsed
  const timeElapsed = timeLimit - timeRemaining;

  // Calculate stats
  const correctAnswers = solvedOperations.filter((op) => op.isCorrect).length;
  const incorrectAnswers = solvedOperations.filter((op) => !op.isCorrect).length;
  const accuracy = calculateAccuracy(correctAnswers, solvedOperations.length);
  const averageTime = calculateAverageTime(solvedOperations);
  const score = calculateScore(solvedOperations);
  const operationsPerMinute = calculateOperationsPerMinute(solvedOperations.length, timeElapsed);

  const stats: GameStats = {
    totalOperations: solvedOperations.length,
    correctAnswers,
    incorrectAnswers,
    accuracy,
    averageTime,
    score,
    operationsPerMinute,
  };

  // Timer effect
  useEffect(() => {
    if (!isPlaying || timeRemaining <= 0) return;

    const timer = setTimeout(() => {
      setTimeRemaining((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [isPlaying, timeRemaining]);

  // End game when time runs out or all operations completed
  useEffect(() => {
    if (isPlaying && (timeRemaining <= 0 || currentIndex >= operations.length)) {
      handleGameEnd();
    }
  }, [isPlaying, timeRemaining, currentIndex, operations.length]);

  // Reset question start time when operation changes
  useEffect(() => {
    if (currentOperation) {
      setQuestionStartTime(Date.now());
    }
  }, [currentOperation]);

  const handleGameEnd = useCallback(() => {
    setIsPlaying(false);
    setIsFinished(true);

    const results: GameResults = {
      ...stats,
      difficulty: currentDifficulty,
      timeLimit,
      completedAt: new Date(),
      solvedOperations,
    };

    onGameEnd?.(results);
  }, [stats, currentDifficulty, timeLimit, solvedOperations, onGameEnd]);

  const startGame = useCallback(() => {
    const newOperations = generateOperations(operationsCount, currentDifficulty);
    setOperations(newOperations);
    setCurrentIndex(0);
    setSolvedOperations([]);
    setTimeRemaining(timeLimit);
    setIsPlaying(true);
    setIsFinished(false);
    setQuestionStartTime(Date.now());
  }, [operationsCount, currentDifficulty, timeLimit]);

  const resetGame = useCallback(() => {
    setOperations([]);
    setCurrentIndex(0);
    setSolvedOperations([]);
    setTimeRemaining(timeLimit);
    setIsPlaying(false);
    setIsFinished(false);
  }, [timeLimit]);

  const handleAnswer = useCallback(
    (answer: string) => {
      if (!currentOperation || !isPlaying || isFinished) return;

      const timeToAnswer = Date.now() - questionStartTime;
      const isCorrect = answer === currentOperation.correct;

      const solvedOperation: SolvedOperation = {
        ...currentOperation,
        answeredAt: new Date(),
        userAnswer: answer,
        isCorrect,
        timeToAnswer,
      };

      setSolvedOperations((prev) => [...prev, solvedOperation]);
      setCurrentIndex((prev) => prev + 1);
    },
    [currentOperation, isPlaying, isFinished, questionStartTime],
  );

  const changeDifficulty = useCallback(
    (newDifficulty: DifficultyLevel) => {
      if (isPlaying) return; // Don't allow difficulty change during game
      setCurrentDifficulty(newDifficulty);
    },
    [isPlaying],
  );

  const changeTimeLimit = useCallback(
    (seconds: number) => {
      if (isPlaying) return; // Don't allow time change during game
      setTimeRemaining(seconds);
    },
    [isPlaying],
  );

  return {
    // Game state
    isPlaying,
    isFinished,
    timeRemaining,
    timeElapsed,
    currentOperation,
    currentIndex,
    totalOperations: operations.length,
    difficulty: currentDifficulty,

    // Stats
    stats,
    solvedOperations,

    // Actions
    startGame,
    resetGame,
    handleAnswer,
    changeDifficulty,
    changeTimeLimit,
  };
}
