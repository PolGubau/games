import { useEffect, useState } from "react";
import { useSudokuPersistence } from "../hooks/use-persistence";
import type { Sudoku } from "../sudoku-types";

export const useSudokuRanking = () => {

  const { getRanking } = useSudokuPersistence();
  const [ranking, setRanking] = useState<Sudoku[]>([]);

  useEffect(() => {
    const fetchRanking = async () => {
      const ranking = await getRanking();
      setRanking(ranking);
    };
    fetchRanking();
  }, [getRanking]);

  return { ranking };
}