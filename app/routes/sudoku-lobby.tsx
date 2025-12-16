import SudokuPage from "~/global/screens/sudoku/sudoku-lobby-page";
import type { Route } from "./+types/sudoku";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Sudoku | Games - Pol Gubau Amores" },
    { name: "description", content: "Play fun games like Sudoku and Math challenges!" },
  ];
}

export default function Sudoku() {
  return <SudokuPage />;
}
