import { motion } from "motion/react";
import { memo } from "react";
import type { Tile } from "../domain/types";

const TILE_COLORS: Record<number, string> = {
  2: "bg-slate-200 text-slate-700",
  4: "bg-slate-300 text-slate-800",
  8: "bg-orange-400 text-white",
  16: "bg-orange-500 text-white",
  32: "bg-orange-600 text-white",
  64: "bg-red-500 text-white",
  128: "bg-yellow-400 text-white",
  256: "bg-yellow-500 text-white",
  512: "bg-yellow-600 text-white",
  1024: "bg-yellow-700 text-white",
  2048: "bg-yellow-800 text-white",
  4096: "bg-purple-600 text-white",
  8192: "bg-purple-700 text-white",
};

const getTileColor = (value: number): string =>
  TILE_COLORS[value] || "bg-gray-800 text-white";

const getTileSize = (value: number): string => {
  if (value >= 1024) return "text-2xl";
  if (value >= 128) return "text-3xl";
  return "text-4xl";
};

interface TileComponentProps {
  tile: Tile;
}

function TileComponentBase({ tile }: TileComponentProps) {
  const { position, value, id } = tile;

  return (
    <motion.div
      key={id}
      layout
      initial={{ scale: 0.8 }}
      animate={{ scale: 1 }}
      transition={{
        layout: { type: "spring", stiffness: 300, damping: 30 },
        scale: { type: "spring", stiffness: 500, damping: 30 },
      }}
      className={`rounded-lg flex items-center justify-center font-bold w-full h-full ${getTileColor(value)} ${getTileSize(value)}`}
      style={{
        gridColumnStart: position.x + 1,
        gridRowStart: position.y + 1,
      }}
    >
      {value}
    </motion.div>
  );
}

export const TileComponent = memo(TileComponentBase, (prev, next) =>
  prev.tile.id === next.tile.id &&
  prev.tile.position.x === next.tile.position.x &&
  prev.tile.position.y === next.tile.position.y
);
