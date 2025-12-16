import type { Route } from "./+types/snake";
import { SnakePage } from "~/global/screens/snake/snake-game";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Snake Game - Classic Snake" },
    {
      name: "description",
      content: "Play the classic Snake game with multiple difficulty levels",
    },
  ];
}

export default function Snake() {
  return <SnakePage />;
}
