import { type RouteConfig, index, prefix, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("memo", "routes/memo.tsx"),
  ...prefix("sudoku", [index("routes/sudoku-lobby.tsx"), route(":id", "routes/sudoku-game.tsx")]),
] satisfies RouteConfig;
