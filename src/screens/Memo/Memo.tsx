import { useEffect, useRef, useState } from "react";
import { tilesData } from "./data";
import { AnimatePresence, motion } from "framer-motion";
import { twMerge } from "tailwind-merge";
import { keyboardKey } from "@testing-library/user-event";

// Each tile has an icon and a pastel color

export interface Tile {
  id: string;
  icon: JSX.Element;
  color: string;
}
export type TileId = Tile["id"];

const MemoPage = () => {
  return (
    <div>
      <Board />
    </div>
  );
};

const Board = () => {
  const [guessed, setGuessed] = useState<TileId[]>([]); // Array of already guessed tiles
  const [selected, setSelected] = useState<TileId[]>([]); // Array of selected tiles (max 2)

  const getTile = (id: TileId) => tilesData.find((tile) => tile.id === id);

  useEffect(() => {
    if (selected.length === 2) {
      const [first, second] = selected;
      const firstTile = getTile(first);
      const secondTile = getTile(second);

      if (firstTile && secondTile && firstTile.icon === secondTile.icon) {
        setGuessed([...guessed, first, second]);
      }

      const timeout = setTimeout(() => {
        setSelected([]);
      }, 400);

      return () => clearTimeout(timeout);
    }
  }, [selected]);

  useEffect(() => {
    if (guessed.length === tilesData.length) {
      alert("You win!");
      location.reload();
    }
  }, [guessed]);

  const isVisible = (id: TileId) =>
    selected.includes(id) || guessed.includes(id);

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
        "flex rounded-none md:rounded-2xl aspect-square items-center justify-center  sm:p-4 md:p-8 text-black transition-all ",
    };

    if (isVisible(tileId))
      return {
        ...baseSpecs,
        disabled: true,
        className: twMerge(baseSpecs.baseClassname, ""),
      };

    return {
      ...baseSpecs,
      whileHover: {
        scale: 0.95,
        transition: { duration: 0.1 },
      },
      whileTap: { scale: 0.9 },
      className: twMerge(
        baseSpecs.baseClassname,
        "focus:outline-none focus-visible:ring-4 focus-visible:ring-offset-4 focus-visible:ring-orange-700 focus-visible:ring-offset-slate-800"
      ),

      onKeyDown: (e: React.KeyboardEvent<HTMLButtonElement>) => {
        if (e.key === "Enter") {
          setSelected([...selected, tileId]);
        }
      },
      onClick: () => selected.length < 2 && setSelected([...selected, tileId]),
    };
  };

  return (
    <AnimatePresence>
      <main className="p-8 flex flex-col gap-8  items-center justify-center bg-slate-800 overflow-hidden">
        <h1>Memo</h1>
        <p>
          Gessed pairs: {guessed.length / 2} / {tilesData.length / 2}
        </p>

        <motion.ul
          initial="hidden"
          animate="visible"
          variants={list}
          className="grid grid-cols-4 md:grid-cols-5 md:gap-8  w-full max-w-4xl rounded-2xl overflow-hidden p-2"
        >
          {tilesData.map((tile, index: number) => {
            return (
              <motion.button
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setSelected([...selected, tile.id]);
                  }

                  if (e.key === "ArrowRight") {
                    setSelected([...selected, tilesData[index + 1].id]);
                  }

                  if (e.key === "ArrowLeft") {
                    setSelected([...selected, tilesData[index - 1].id]);
                  }

                  if (e.key === "ArrowUp") {
                    setSelected([...selected, tilesData[index - 5].id]);
                  }

                  if (e.key === "ArrowDown") {
                    setSelected([...selected, tilesData[index + 5].id]);
                  }
                }}
                key={tile.id}
                variants={item}
                {...specs(tile)}
                style={{
                  backgroundColor: isVisible(tile.id) ? tile.color : "#a7a7a7",
                }}
              >
                <div className="opacity-70 text-4xl sm:text-7xl md:text-8xl">
                  {isVisible(tile.id) ? tile.icon : "?"}
                </div>
              </motion.button>
            );
          })}
        </motion.ul>
      </main>
    </AnimatePresence>
  );
};

export default MemoPage;
