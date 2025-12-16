import HomePage from "~/global/screens/Home/HomePage";
import type { Route } from "./+types/home";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Games - Pol Gubau Amores" },
    { name: "description", content: "Play fun games like Sudoku and Math challenges!" },
  ];
}

export default function Home() {
  return <HomePage />;
}
