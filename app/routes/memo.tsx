import { MemoPage } from "~/global/screens/Memo/Memo";
import type { Route } from "./+types/memo";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Memo | Games - Pol Gubau Amores" },
    { name: "description", content: "Play fun games like Sudoku and Math challenges!" },
  ];
}

export default function Memo() {
  return <MemoPage />;
}
