import { AnimatePresence } from "framer-motion";
import { PoluiProvider } from "pol-ui";
import React from "react";
import { useLocation, useRoutes } from "react-router-dom";
import HomePage, { games } from "./screens/Home/HomePage";
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
