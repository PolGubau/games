import Board from "./screens/Memo/Memo";
import WordsMinutePage from "./screens/words-minute/words-minute";
import HomePage from "./screens/Home/HomePage";
import { PoluiProvider } from "pol-ui";
import { AnimatePresence } from "framer-motion";
import { useLocation, useRoutes } from "react-router-dom";
import React from "react";
function App() {
  const element = useRoutes([
    {
      path: "/",
      element: <HomePage />,
    },
    {
      path: "/memo",
      element: <Board />,
    },
    {
      path: "/words-minute",
      element: <WordsMinutePage />,
    },
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
