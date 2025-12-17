import { motion } from "motion/react";
import { Button } from "~/components/ui/button";
import type { GameStats } from "../domain/types";

interface GameOverProps {
  stats: GameStats;
  onNewGame: () => void;
}

export function GameOver({ stats, onNewGame }: GameOverProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 flex items-center justify-center bg-black/70 rounded-xl backdrop-blur-md"
    >
      <div className="text-center space-y-6 p-8">
        <motion.h2
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2 }}
          className="text-6xl font-bold text-red-400"
        >
          Game Over
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-2 text-white"
        >
          <p className="text-xl">No more moves available!</p>
          <div className="grid grid-cols-2 gap-4 mt-4 text-lg">
            <div>
              <div className="text-yellow-400 font-bold">{stats.score}</div>
              <div className="text-sm text-gray-300">Final Score</div>
            </div>
            <div>
              <div className="text-yellow-400 font-bold">{stats.largestTile}</div>
              <div className="text-sm text-gray-300">Largest Tile</div>
            </div>
            <div>
              <div className="text-yellow-400 font-bold">{stats.moves}</div>
              <div className="text-sm text-gray-300">Moves</div>
            </div>
            <div>
              <div className="text-yellow-400 font-bold">{stats.bestScore}</div>
              <div className="text-sm text-gray-300">Best Score</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Button onClick={onNewGame} size="lg" variant="default">
            Try Again
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}
