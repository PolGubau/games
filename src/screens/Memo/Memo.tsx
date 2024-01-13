import { useEffect } from "react";
import { tilesData } from "./data";
import { motion, useIsPresent } from "framer-motion";
import { twMerge } from "tailwind-merge";
import MainLayout from "../../Layouts/MainLayout";
import {
  PiArrowCounterClockwiseBold,
  PiArrowLeftBold,
  PiLightbulbBold,
} from "react-icons/pi";
import { TbQuestionMark } from "react-icons/tb";
import { useMemo } from "./use-memo";
import FinishPage from "./finish-page";
import { Link } from "react-router-dom";
import { Tooltip } from "pol-ui";

// Each tile has an icon and a pastel color

export interface Tile {
  id: string;
  icon: JSX.Element;
  color: string;
}
export type TileId = Tile["id"];

const MemoPage = () => {
  const isPresent = useIsPresent();

  return (
    <MainLayout title="Memo">
      <Board />
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

const Board = () => {
  const {
    guessed,
    selected,
    win,
    hint,
    handleReset,
    getHint,
    isVisible,
    setSelected,
    setHint,
    hintsUsed,
    time,
  } = useMemo();
  const list = {
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.03,
      },
    },
    hidden: {
      opacity: 0,
      transition: {
        when: "afterChildren",
      },
    },
  };

  const item = {
    visible: { opacity: 1, y: 0 },
    hidden: { opacity: 0, y: 20 },
  };

  const specs = (tile: Tile) => {
    const tileId = tile.id;

    const baseSpecs = {
      baseClassname:
        "flex  rounded-2xl items-center justify-center  md:p-8 text-primary-900 transition-all flex-1  max-w-[150px]",
    };

    if (isVisible(tileId))
      return {
        ...baseSpecs,
        disabled: true,
        className: twMerge(baseSpecs.baseClassname, ""),
      };

    return {
      ...baseSpecs,
      rotateY: 180,

      whileHover: {
        scale: 0.95,
        transition: { duration: 0.1 },
      },
      whileTap: {
        scale: 0.9,

        transition: { duration: 0.1 },
      },
      className: twMerge(
        baseSpecs.baseClassname,
        "focus:outline-none focus-visible:ring-4 focus-visible:ring-offset-4 focus-visible:ring-primary-700 focus-visible:ring-offset-secondary-50 bg-secondary focus:bg-secondary-700 text-secondary-800"
      ),

      onKeyDown: (e: React.KeyboardEvent<HTMLButtonElement>) => {
        if (e.key === "Enter") {
          setSelected([...selected, tileId]);
        }
      },
      onClick: () => selected.length < 2 && setSelected([...selected, tileId]),
    };
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      // delete the first element of the array (oldest hint)
      setHint((prev) => prev.slice(1));
    }, 200);
    return () => clearTimeout(timeout);
  }, [hint]);

  const isThisTileHinted = (id: TileId) =>
    hint.includes(id) || hint.includes(`${id}-copy`);

  if (win)
    return (
      <FinishPage onReset={handleReset} hintsUsed={hintsUsed} time={time} />
    );

  return (
    <main className="p-8 flex flex-col gap-8  items-center justify-center  ">
      <section className="flex gap-8 flex-col sm:flex-row h-full w-full justify-center">
        <div className="flex sm:flex-col gap-4 sm:items-center items-center sm:justify-between sticky top-0 h-auto">
          <div className="flex sm:flex-col gap-4 items-center">
            <p className="flex justify-center items-end">
              <span className="text-4xl"> {guessed.length / 2}</span>
              <span>/ {tilesData.length / 2}</span>
            </p>
            <Tooltip content="Return home (the game won't be saved)">
              <Link to={"/"}>
                <motion.button
                  layoutId="backButton"
                  whileHover={{
                    scale: 1.1,
                    rotate: -10,
                  }}
                  whileTap={{
                    scale: 0.9,
                  }}
                  className=" bg-primary-900 text-primary-50 rounded-full text-4xl p-4 focus-visible:ring-4 focus-visible:ring-offset-4 focus-visible:ring-primary-700 focus-visible:ring-offset-secondary-50 focus:outline-none flex justify-center items-center"
                >
                  <PiArrowLeftBold />
                </motion.button>
              </Link>
            </Tooltip>{" "}
            <Tooltip content="Reset the game">
              <motion.button
                layoutId="resetButton"
                whileHover={{
                  rotate: -10,
                  scale: 1.1,
                }}
                whileTap={{
                  scale: 0.9,
                  rotate: -360,
                }}
                whileFocus={{
                  scale: 1.1,
                  rotate: -20,
                }}
                onClick={handleReset}
                className="aspect-square  bg-primary-900 text-primary-50 rounded-full text-4xl p-4 focus-visible:ring-4 focus-visible:ring-offset-4 focus-visible:ring-primary-700 focus-visible:ring-offset-secondary-50 focus:outline-none flex justify-center items-center"
              >
                <PiArrowCounterClockwiseBold />
              </motion.button>{" "}
            </Tooltip>
            <Tooltip content="Get a hint">
              <motion.button
                layoutId="hintButton"
                whileHover={{
                  rotate: -10,
                  scale: 1.1,
                }}
                whileTap={{
                  scale: 0.9,
                }}
                whileFocus={{
                  scale: 1.1,
                  rotate: -20,
                }}
                onClick={getHint}
                className="aspect-square bg-primary-900 text-primary-50 rounded-full text-4xl p-4 focus-visible:ring-4 focus-visible:ring-offset-4 focus-visible:ring-primary-700 focus-visible:ring-offset-secondary-50 focus:outline-none flex justify-center items-center"
              >
                <PiLightbulbBold />
              </motion.button>
            </Tooltip>
          </div>
          {hintsUsed > 0 && (
            <p className="md:flex hidden text-xl">
              <span>
                {hintsUsed} hint{hintsUsed > 1 && "s"}
              </span>
            </p>
          )}
        </div>
        <motion.ul
          initial="hidden"
          animate="visible"
          variants={list}
          className="grid grid-cols-4 xl:grid-cols-5 md:w-fit gap-3 xl:gap-8 rounded-2xl p-1  h-full  "
        >
          {tilesData.map((tile) => {
            return (
              <motion.button
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setSelected([...selected, tile.id]);
                  }
                }}
                key={tile.id}
                variants={item}
                {...specs(tile)}
                style={{
                  backgroundColor: isVisible(tile.id)
                    ? tile.color
                    : isThisTileHinted(tile.id)
                    ? "rgba(255, 255, 255, 0.5)"
                    : undefined,
                }}
              >
                <div className="opacity-70 text-5xl sm:text-7xl md:text-6xl lg:text-6xl xl:text-7xl ">
                  {isVisible(tile.id) ? tile.icon : <TbQuestionMark />}
                </div>
              </motion.button>
            );
          })}
        </motion.ul>
      </section>
    </main>
  );
};

export default MemoPage;
