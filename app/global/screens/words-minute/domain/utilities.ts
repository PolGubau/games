import { words } from "../words.json";
import { WPM_CONFIG } from "./types";
import type { GameStats } from "./types";

/**
 * Get a random word from the word list
 */
export function getRandomWord(): string {
  const randomIndex = Math.floor(Math.random() * words.length);
  return words[randomIndex];
}

/**
 * Get a random word with length constraints
 */
export function getRandomWordInRange(
  minLength: number = WPM_CONFIG.MIN_WORD_LENGTH,
  maxLength: number = WPM_CONFIG.MAX_WORD_LENGTH,
): string {
  const filteredWords = words.filter(
    (word) => word.length >= minLength && word.length <= maxLength,
  );
  const randomIndex = Math.floor(Math.random() * filteredWords.length);
  return filteredWords[randomIndex] || getRandomWord();
}

/**
 * Validate if typed word matches target word
 */
export function validateWord(typed: string, target: string): boolean {
  return typed.toLowerCase().trim() === target.toLowerCase().trim();
}

/**
 * Check if current character being typed is correct
 */
export function isCharacterCorrect(typed: string, target: string, position: number): boolean {
  if (position >= target.length) return false;
  return typed[position]?.toLowerCase() === target[position]?.toLowerCase();
}

/**
 * Calculate Words Per Minute (WPM)
 * Standard: (characters typed / 5) / (time in minutes)
 */
export function calculateWPM(characterCount: number, timeElapsed: number): number {
  if (timeElapsed === 0) return 0;
  const minutes = timeElapsed / 60;
  const words = characterCount / WPM_CONFIG.CHARACTERS_PER_WORD;
  return Math.round(words / minutes);
}

/**
 * Calculate Raw WPM (without accuracy adjustment)
 */
export function calculateRawWPM(totalCharacters: number, timeElapsed: number): number {
  if (timeElapsed === 0) return 0;
  const minutes = timeElapsed / 60;
  const words = totalCharacters / WPM_CONFIG.CHARACTERS_PER_WORD;
  return Math.round(words / minutes);
}

/**
 * Calculate accuracy percentage
 */
export function calculateAccuracy(correctWords: number, totalWords: number): number {
  if (totalWords === 0) return 100;
  return Math.round((correctWords / totalWords) * 100);
}

/**
 * Get stats object from current game data
 */
export function getGameStats(
  characterCount: number,
  correctWords: number,
  incorrectWords: number,
  timeElapsed: number,
): GameStats {
  const totalWords = correctWords + incorrectWords;
  const accuracy = calculateAccuracy(correctWords, totalWords);
  const wpm = calculateWPM(characterCount, timeElapsed);
  const totalCharacters = characterCount + incorrectWords * WPM_CONFIG.CHARACTERS_PER_WORD;
  const rawWpm = calculateRawWPM(totalCharacters, timeElapsed);

  return {
    characterCount,
    correctWords,
    incorrectWords,
    accuracy,
    wpm,
    rawWpm,
    timeElapsed,
  };
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
 * Get performance level based on WPM
 */
export function getPerformanceLevel(wpm: number): {
  level: string;
  color: string;
  description: string;
} {
  if (wpm < 20) {
    return {
      level: "Beginner",
      color: "text-gray-500",
      description: "Keep practicing!",
    };
  }
  if (wpm < 40) {
    return {
      level: "Intermediate",
      color: "text-blue-500",
      description: "Good progress!",
    };
  }
  if (wpm < 60) {
    return {
      level: "Advanced",
      color: "text-green-500",
      description: "Great typing!",
    };
  }
  if (wpm < 80) {
    return {
      level: "Expert",
      color: "text-purple-500",
      description: "Excellent skills!",
    };
  }
  return {
    level: "Master",
    color: "text-yellow-500",
    description: "Outstanding performance!",
  };
}
