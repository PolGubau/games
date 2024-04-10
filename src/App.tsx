import Board from "./screens/Memo/Memo";
import WordsMinutePage from "./screens/words-minute/words-minute";
import HomePage, { games } from "./screens/Home/HomePage";
import { PoluiProvider } from "pol-ui";
import { AnimatePresence } from "framer-motion";
import { useLocation, useRoutes } from "react-router-dom";
import React from "react";
import SudokuPage from "./screens/sudoku/sudoku-page";
import { Wordle } from "./screens/Wordle/Wordle";
function App() {
  const element = useRoutes([
    {
      path: "/",
      element: <HomePage />,
    },
    ...games.map((game) => ({
      path: game.link,
      element: game.element,
    })),
  ]);
  const location = useLocation();

  if (!element) return null;

  return (
    <PoluiProvider>
      <AnimatePresence mode="wait" initial={false}>
        {React.cloneElement(element, { key: location.pathname })}
      </AnimatePresence>
    </PoluiProvider>
  );
}

export default App;
