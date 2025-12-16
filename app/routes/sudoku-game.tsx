import SudokuBoardLayout from "~/global/screens/sudoku/screens/Sudoku-board";
import type { Route } from "./+types/sudoku";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Sudoku Game | Games - Pol Gubau Amores" },
    { name: "description", content: "Play fun games like Sudoku and Math challenges!" },
  ];
}

export default function Sudoku() {
  return <SudokuBoardLayout />;
}
