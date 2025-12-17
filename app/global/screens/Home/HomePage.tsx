import { Link } from "react-router";
import MainLayout from "../../Layouts/MainLayout";
export const games = [
  {
    name: "Memo",
    description: "Find all the pairs of tiles",
    link: "/memo",
  },
  {
    name: "Words per minute",
    description: "Test your typing speed",
    link: "/words-per-minute",
  },
  {
    name: "Sudoku",
    description: "Fill the board with numbers",
    link: "/sudoku",
  },

  {
    name: "Snake",
    description: "Eat the food and grow",
    link: "/snake",
  },

  {
    name: "Math",
    description: "Solve easy operations",
    link: "/math",
  },
  {
    name: "2048",
    description: "Reach the 2048 tile",
    link: "/2048",
  },
];
const HomePage = () => {

  return (
    <MainLayout>
      <ul className="grid grid-cols-1 lg:grid-cols-2 gap-2 justify-center h-full">
        {games.map((game) => (
          <li key={game.name}>
            <Link to={game.link} className="bg-muted group ease-in-out transition-all hover:ring-4 focus:ring-6 ring-primary h-full p-4 sm:p-8 lg:p-20 rounded-xl flex flex-col justify-center hover:scale-[97%] focus:scale-95">
              <p className="text-lg text-primary/70">{game.description}</p>
              <h3 className="text-3xl sm:text-5xl xl:text-7xl text-primary">{game.name}</h3>
            </Link>
          </li>
        ))}
      </ul>

    </MainLayout>
  );
};

export default HomePage;
