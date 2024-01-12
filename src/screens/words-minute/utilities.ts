import { words } from "./words.json";

export const getRandomWord = (): string => {
  const randomIndex = Math.floor(Math.random() * words.length);
  return words[randomIndex];
};
