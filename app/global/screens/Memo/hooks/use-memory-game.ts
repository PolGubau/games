import { useCallback, useEffect, useMemo, useState } from "react";
import { tilesData } from "../data";
import { GAME_CONFIG } from "../types";
import type { TileId } from "../types";
import { useTimer } from "./use-timer";

export function useMemoryGame() {
  const [guessed, setGuessed] = useState<TileId[]>([]);
  const [selected, setSelected] = useState<TileId[]>([]);
  const [win, setWin] = useState(false);
  const [hint, setHint] = useState<TileId[]>([]);
  const [hintsUsed, setHintsUsed] = useState(0);

  const { time, start: startTimer, reset: resetTimer, stop: stopTimer } = useTimer();

  // Start timer on first selection
  useEffect(() => {
    if (selected.length > 0 && time === 0) {
      startTimer();
    }
  }, [selected, time, startTimer]);

  // Handle card matching
  useEffect(() => {
    if (selected.length !== 2) return;

    const [first, second] = selected;
    const firstTile = tilesData.find((tile) => tile.id === first);
    const secondTile = tilesData.find((tile) => tile.id === second);

    if (firstTile && secondTile && firstTile.icon === secondTile.icon) {
      setGuessed((prev) => [...prev, first, second]);
    }

    const timeout = setTimeout(() => {
      setSelected([]);
    }, GAME_CONFIG.CARD_FLIP_DELAY);

    return () => clearTimeout(timeout);
  }, [selected]);

  // Check win condition
  useEffect(() => {
    if (guessed.length === tilesData.length && guessed.length > 0) {
      setWin(true);
      stopTimer();
    }
  }, [guessed, stopTimer]);

  // Handle hint logic
  const getHint = useCallback(() => {
    const notGuessed = tilesData.filter((tile) => !guessed.includes(tile.id));
    const notGuessedWithoutCopy = notGuessed.filter((tile) => !tile.id.includes("-copy"));

    if (notGuessedWithoutCopy.length === 0) return;

    const randomTile =
      notGuessedWithoutCopy[Math.floor(Math.random() * notGuessedWithoutCopy.length)];
    const pairId = randomTile.id.includes("-copy")
      ? randomTile.id.replace("-copy", "")
      : `${randomTile.id}-copy`;

    setHint([randomTile.id, pairId]);
    setHintsUsed((prev) => prev + 1);

    setTimeout(() => {
      setHint([]);
    }, GAME_CONFIG.HINT_DISPLAY_TIME);
  }, [guessed]);

  const handleReset = useCallback(() => {
    setSelected([]);
    setGuessed([]);
    setWin(false);
    setHint([]);
    setHintsUsed(0);
    resetTimer();
  }, [resetTimer]);

  const selectCard = useCallback(
    (tileId: TileId) => {
      if (selected.length < 2 && !selected.includes(tileId)) {
        setSelected((prev) => [...prev, tileId]);
      }
    },
    [selected],
  );

  const isVisible = useCallback(
    (id: TileId) => selected.includes(id) || guessed.includes(id) || hint.includes(id),
    [selected, guessed, hint],
  );

  const isHinted = useCallback((id: TileId) => hint.includes(id), [hint]);

  const gameStats = useMemo(
    () => ({
      totalCards: tilesData.length,
      guessedCards: guessed.length,
      remainingPairs: (tilesData.length - guessed.length) / 2,
      progress: (guessed.length / tilesData.length) * 100,
    }),
    [guessed],
  );

  return {
    guessed,
    selected,
    win,
    hint,
    hintsUsed,
    time,
    handleReset,
    getHint,
    isVisible,
    isHinted,
    selectCard,
    gameStats,
  };
}
