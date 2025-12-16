import { useCallback, useEffect, useState } from "react";
import type { GameMode, GameResults, GameStats, WordState } from "../domain/types";
import { WPM_CONFIG } from "../domain/types";
import { getGameStats, getRandomWord, isCharacterCorrect, validateWord } from "../domain/utilities";

interface UseWordsPerMinuteOptions {
  timeLimit?: number;
  mode?: GameMode;
  onGameEnd?: (results: GameResults) => void;
}

export function useWordsPerMinute({
  timeLimit = WPM_CONFIG.DEFAULT_TIME,
  mode = "normal",
  onGameEnd,
}: UseWordsPerMinuteOptions = {}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);
  const [currentWord, setCurrentWord] = useState(getRandomWord());
  const [typedWord, setTypedWord] = useState("");
  const [gameMode, setGameMode] = useState<GameMode>(mode);

  // Stats
  const [characterCount, setCharacterCount] = useState(0);
  const [correctWords, setCorrectWords] = useState(0);
  const [incorrectWords, setIncorrectWords] = useState(0);

  // Calculate time elapsed
  const timeElapsed = timeLimit - timeRemaining;

  // Calculate current stats
  const stats: GameStats = getGameStats(characterCount, correctWords, incorrectWords, timeElapsed);

  // Word state
  const wordState: WordState = {
    current: currentWord,
    typed: typedWord,
    isCorrect: typedWord.length > 0 && validateWord(typedWord, currentWord),
  };

  // Timer effect
  useEffect(() => {
    if (!isPlaying || timeRemaining <= 0) return;

    const timer = setTimeout(() => {
      setTimeRemaining((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [isPlaying, timeRemaining]);

  // End game when time runs out
  useEffect(() => {
    if (isPlaying && timeRemaining <= 0) {
      handleGameEnd();
    }
  }, [isPlaying, timeRemaining]);

  const handleGameEnd = useCallback(() => {
    setIsPlaying(false);
    setIsFinished(true);

    const results: GameResults = {
      ...stats,
      timeLimit,
      mode: gameMode,
      completedAt: new Date(),
    };

    onGameEnd?.(results);
  }, [stats, timeLimit, gameMode, onGameEnd]);

  const startGame = useCallback(() => {
    setIsPlaying(true);
    setIsFinished(false);
    setTimeRemaining(timeLimit);
    setCurrentWord(getRandomWord());
    setTypedWord("");
    setCharacterCount(0);
    setCorrectWords(0);
    setIncorrectWords(0);
  }, [timeLimit]);

  const resetGame = useCallback(() => {
    setIsPlaying(false);
    setIsFinished(false);
    setTimeRemaining(timeLimit);
    setCurrentWord(getRandomWord());
    setTypedWord("");
    setCharacterCount(0);
    setCorrectWords(0);
    setIncorrectWords(0);
  }, [timeLimit]);

  const handleInput = useCallback(
    (value: string) => {
      if (!isPlaying || isFinished) return;

      // In strict mode, only allow correct characters
      if (gameMode === "strict") {
        const lastChar = value[value.length - 1];
        const position = value.length - 1;

        // If character is incorrect, don't update
        if (lastChar && !isCharacterCorrect(value, currentWord, position)) {
          return;
        }
      }

      setTypedWord(value);

      // Check if word is complete and correct
      if (validateWord(value, currentWord)) {
        setCharacterCount((prev) => prev + currentWord.length);
        setCorrectWords((prev) => prev + 1);
        setCurrentWord(getRandomWord());
        setTypedWord("");
      }
    },
    [isPlaying, isFinished, gameMode, currentWord],
  );

  const skipWord = useCallback(() => {
    if (!isPlaying || isFinished) return;

    setIncorrectWords((prev) => prev + 1);
    setCurrentWord(getRandomWord());
    setTypedWord("");
  }, [isPlaying, isFinished]);

  const toggleMode = useCallback(() => {
    if (isPlaying) return; // Don't allow mode change during game
    setGameMode((prev) => (prev === "strict" ? "normal" : "strict"));
  }, [isPlaying]);

  const setTime = useCallback(
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
    gameMode,

    // Word state
    wordState,

    // Stats
    stats,

    // Actions
    startGame,
    resetGame,
    handleInput,
    skipWord,
    toggleMode,
    setTime,
  };
}
