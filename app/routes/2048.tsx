import { Game2048Screen } from "~/global/screens/2048/ui/game-2048-screen";

export function meta() {
  return [
    { title: "2048 - Games" },
    { name: "description", content: "Join the numbers and get to the 2048 tile!" },
  ];
}

export default function Game2048() {
  return <Game2048Screen />;
}
