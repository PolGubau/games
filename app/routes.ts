import { type RouteConfig, index, prefix, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("memo", "routes/memo.tsx"),
  ...prefix("sudoku", [index("routes/sudoku-lobby.tsx"), route(":id", "routes/sudoku-game.tsx")]),
  route("words-per-minute", "routes/words-minute.tsx"),
  route("math", "routes/math.tsx"),
  route("snake", "routes/snake.tsx"),
  route("2048", "routes/2048.tsx"),
] satisfies RouteConfig;
