import { useCallback, useEffect, useState } from "react";
import { useSudokuPersistence } from "../hooks/use-persistence";
import type { Sudoku } from "../sudoku-types";

interface UseRankingResult {
  data: Sudoku[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useRanking(): UseRankingResult {
  const { getRanking } = useSudokuPersistence();
  const [data, setData] = useState<Sudoku[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchRanking = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const ranking = await getRanking();
      setData(ranking);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch ranking"),
      );
      console.error("Error fetching ranking:", err);
    } finally {
      setIsLoading(false);
    }
  }, [getRanking]);

  useEffect(() => {
    fetchRanking();
  }, [fetchRanking]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchRanking,
  };
}