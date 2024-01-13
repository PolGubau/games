import { Link } from "react-router-dom";
import MainLayout from "../../Layouts/MainLayout";
import { motion, useIsPresent } from "framer-motion";

const HomePage = () => {
  const isPresent = useIsPresent();

  const games = [
    {
      name: "Memo",
      description:
        "Find all the pairs of tiles in the least amount of time possible",
      link: "/memo",
    },
    {
      name: "Words per minute",
      description: "Type as many words as you can in 60 seconds",
      link: "/words-minute",
    },
  ];

  return (
    <MainLayout>
      <ul className="grid grid-cols-1 md:grid-cols-2 rounded-[70px] gap-8 justify-center h-full p-[30px] font-bold text-center">
        {games.map((game) => (
          <Link to={game.link} key={game.name}>
            <motion.li
              whileHover={{
                scale: 0.95,
                transition: { duration: 0.5, ease: "circOut" },
              }}
              whileTap={{ scale: 0.9 }}
              className=" bg-primary shadow-lg h-full p-8 gap-8 md:p-40 rounded-3xl md:rounded-[70px] hover:brightness-110"
            >
              <h3 className="text-3xl md:text-7xl text-primary-900">
                {game.name}
              </h3>
              <p className="text-lg text-primary-700 px-32">
                {game.description}
              </p>
            </motion.li>{" "}
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
