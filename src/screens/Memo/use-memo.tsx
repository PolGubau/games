import { useEffect, useState } from "react";
import { TileId } from "./Memo";
import { tilesData } from "./data";

export const useMemo = () => {
  const START_WINNING = false;

  const [guessed, setGuessed] = useState<TileId[]>([]); // Array of already guessed tiles
  const [selected, setSelected] = useState<TileId[]>([]); // Array of selected tiles (max 2)
  const [win, setWin] = useState<boolean>(START_WINNING); //true if all tiles are guessed
  const [hint, setHint] = useState<TileId[]>([]); // Array of highlighted tiles (max 2)

  const [time, setTime] = useState<number>(0); // in seconds

  const [hintsUsed, setHintsUsed] = useState<number>(0); // Number of hints used

  const handleReset = () => {
    setSelected([]);
    setGuessed([]);
    setWin(false);
    setHint([]);
    setTime(0);
    setHintsUsed(0);
  };
  /**
   * @name getHint
   * Get a random tile id add it to the hint array
   * Just the ones that are not guessed and not already hinted
   * The hint will be removed after 200ms
   * Only adds the ones without -copy appended
   * @returns void
   * @see hint
   * @see guessed
   * @see tilesData
   *
   */
  const getHint = () => {
    const notGuessed = tilesData.filter((tile) => !guessed.includes(tile.id));
    // the IDs are a stringified number and it's pair it is the same number with "-copy" appended so we can get a random tile id and it's pair by doing this

    // we select the pair that has no -copy appended
    const notGuessedWithoutCopy = notGuessed.filter(
      (tile) => !notGuessed.map((tile) => tile.id).includes(`${tile.id}-copy`)
    );

    // we get a random tile id
    const randomTileId =
      notGuessedWithoutCopy[
        Math.floor(Math.random() * notGuessedWithoutCopy.length)
      ].id;

    // once checking, we will also cover the tile with the -copy appended, so now we just need to add the tile id and it's pair to the hint array

    setHintsUsed((prev) => prev + 1);

    setHint([...hint, randomTileId]);
  };
  const getTile = (id: TileId) => tilesData.find((tile) => tile.id === id);

  useEffect(() => {
    if (selected.length === 2) {
      const [first, second] = selected;
      const firstTile = getTile(first);
      const secondTile = getTile(second);

      if (firstTile && secondTile && firstTile.icon === secondTile.icon) {
        setGuessed([...guessed, first, second]);
      }

      const timeout = setTimeout(() => {
        setSelected([]);
      }, 400);

      return () => clearTimeout(timeout);
    }
  }, [selected]);

  useEffect(() => {
    if (guessed.length === tilesData.length) {
      setWin(true);
    }
  }, [guessed]);

  useEffect(() => {
    if (time > 0 && !win) {
      const timeout = setTimeout(() => setTime(time - 1), 1000);
      return () => clearTimeout(timeout);
    }
  }, [time]);

  const isVisible = (id: TileId) =>
    selected.includes(id) || guessed.includes(id);

  return {
    guessed,
    selected,
    win,
    hint,
    handleReset,
    isVisible,
    setSelected,
    setHint,
    getHint,
    hintsUsed,
    time,
  };
};
