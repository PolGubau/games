import { motion } from "motion/react";
import type { Tile } from "../domain/types";
import { GAME_2048_CONFIG } from "../domain/types";

interface TileComponentProps {
  tile: Tile;
}

export function TileComponent({ tile }: TileComponentProps) {
  const { position, value } = tile;
  const gridSize = GAME_2048_CONFIG.GRID_SIZE;

  // Calculate position percentage
  const cellSize = 100 / gridSize;
  const gap = 0.5; // Gap percentage

  const left = position.x * (cellSize + gap);
  const top = position.y * (cellSize + gap);

  // Get color based on value
  const getTileColor = (val: number) => {
    const colors: Record<number, string> = {
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
    return colors[val] || "bg-gray-800 text-white";
  };

  // Get font size based on value
  const getFontSize = (val: number) => {
    if (val >= 1024) return "text-2xl";
    if (val >= 128) return "text-4xl";
    return "text-4xl md:text-5xl";
  };

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1, left: `${left}%`, top: `${top}%` }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 25,
      }}
      className={`absolute rounded-lg flex items-center justify-center font-bold ${getTileColor(
        value
      )} ${getFontSize(value)}`}
      style={{
        width: `${cellSize}%`,
        height: `${cellSize}%`,
      }}
    >
      {value}
    </motion.div>
  );
}
