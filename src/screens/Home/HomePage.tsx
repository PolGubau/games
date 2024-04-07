import { Link } from "react-router-dom";
import MainLayout from "../../Layouts/MainLayout";
import { motion, useIsPresent } from "framer-motion";
import MemoPage from "../Memo/Memo";
import WordsMinutePage from "../words-minute/words-minute";
import SudokuPage from "../sudoku/sudoku-page";
import { Wordle } from "../Wordle/Wordle";

const HomePage = () => {
  const isPresent = useIsPresent();

  const games = [
    {
      name: "Memo",
      description: "Find all the pairs of tiles",
      link: "/memo",
      element: <MemoPage />,
    },
    {
      name: "Words per minute",
      description: "Type as many words as you can",
      link: "/words-minute",
      element: <WordsMinutePage />,
    },
    {
      name: "Sudoku",
      description: "Fill the board with numbers",
      link: "/sudoku",
      element: <SudokuPage />,
    },
    {
      name: "Wordle",
      description: "Guess the word with limited attemps",
      link: "/wordle",
      element: <Wordle />,
    },
  ];

  return (
    <MainLayout>
      <ul className="grid grid-cols-1 lg:grid-cols-2 rounded-[70px] gap-8 justify-center h-full p-[30px] font-bold text-center">
        {games.map((game) => (
          <Link to={game.link} key={game.name}>
            <motion.li
              whileHover={{
                scale: 0.95,
              }}
              whileTap={{ scale: 0.9 }}
              className="bg-primary transition-all hover:ring-4 ring-primary ring-offset-secondary-50 hover:ring-offset-4 h-full lg:p-8 p-4 xl:p-20 rounded-3xl xl:rounded-[70px] hover:brightness-110 flex flex-col justify-center"
            >
              <p className="text-lg text-primary-700">{game.description}</p>
              <h3 className="text-3xl sm:text-5xl xl:text-7xl text-primary-900">
                {game.name}
              </h3>
            </motion.li>
          </Link>
        ))}
      </ul>
      <motion.div
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0, transition: { duration: 0.5, ease: "circOut" } }}
        exit={{ scaleX: 1, transition: { duration: 0.5, ease: "circIn" } }}
        style={{ originX: isPresent ? 0 : 1 }}
        className="privacy-screen"
      />
    </MainLayout>
  );
};

export default HomePage;
