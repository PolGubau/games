import type { Route } from "./+types/tictactoe";
import { TictactoePage } from "~/global/screens/tictactoe/tictactoe-game";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Tic-Tac-Toe - 3 en raya" },
    { name: "description", content: "Play Tic-Tac-Toe against a friend or the AI" },
  ];
}

export default function Tictactoe() {
  return <TictactoePage />;
}
