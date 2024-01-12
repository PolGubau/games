import { Route, Routes } from "react-router-dom";
import Board from "./screens/Memo/Memo";
import WordsMinutePage from "./screens/words-minute/words-minute";
import HomePage from "./screens/Home/HomePage";
import { PoluiProvider } from "pol-ui";

function App() {
  return (
    <PoluiProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/memo" element={<Board />} />
        <Route path="/words-minute" element={<WordsMinutePage />} />
      </Routes>
    </PoluiProvider>
  );
}

export default App;
