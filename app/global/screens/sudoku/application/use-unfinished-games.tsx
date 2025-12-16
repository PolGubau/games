import { useCallback, useEffect, useState } from "react";
import { useSudokuPersistence } from "../hooks/use-persistence";
import type { Sudoku } from "../sudoku-types";

interface UseUnfinishedGamesResult {
  data: Sudoku[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  deleteGame: (sudoku: Sudoku) => Promise<void>;
}

export function useUnfinishedGames(): UseUnfinishedGamesResult {
  const { getUnfinishedSudoku, deleteSudoku } = useSudokuPersistence();
  const [data, setData] = useState<Sudoku[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchUnfinishedGames = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const games = await getUnfinishedSudoku();
      setData(games);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch unfinished games"),
      );
      console.error("Error fetching unfinished games:", err);
    } finally {
      setIsLoading(false);
    }
  }, [getUnfinishedSudoku]);

  const deleteGame = useCallback(
    async (sudoku: Sudoku) => {
      try {
        await deleteSudoku(sudoku);
        await fetchUnfinishedGames();
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to delete game"),
        );
        console.error("Error deleting game:", err);
      }
    },
    [deleteSudoku, fetchUnfinishedGames],
  );

  useEffect(() => {
    fetchUnfinishedGames();
  }, [fetchUnfinishedGames]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchUnfinishedGames,
    deleteGame,
  };
}