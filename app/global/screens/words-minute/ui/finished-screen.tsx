import { motion } from "motion/react";
import { ArrowLeft, RotateCcw, Trophy, Target, Zap, Award } from "lucide-react";
import ConfettiExplosion from "react-confetti-explosion";
import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import { Tooltip } from "~/components/ui/tooltip";
import type { GameStats } from "../domain/types";
import { getPerformanceLevel } from "../domain/utilities";

interface FinishedScreenProps {
  stats: GameStats;
  onRestart: () => void;
}

export function FinishedScreen({ stats, onRestart }: FinishedScreenProps) {
  const performance = getPerformanceLevel(stats.wpm);
  const showConfetti = stats.wpm >= 60; // Show confetti for advanced+ typists

  return (
    <section className="text-center grid gap-8 items-center justify-center min-h-[60vh]">
      {showConfetti && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <ConfettiExplosion
            force={0.8}
            duration={3000}
            particleCount={200}
            width={1600}
          />
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex gap-6 flex-col justify-center items-center"
      >
        {/* Main Score */}
        <div className="flex flex-col items-center gap-2">
          <Trophy className={`w-16 h-16 ${performance.color}`} />
          <h3 className="text-5xl md:text-7xl font-bold">
            <span className={performance.color}>{stats.wpm}</span>
            <span className="text-2xl md:text-4xl text-muted-foreground ml-2">WPM</span>
          </h3>
          <p className={`text-xl font-semibold ${performance.color}`}>
            {performance.level}
          </p>
          <p className="text-muted-foreground">{performance.description}</p>
        </div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8 w-full max-w-3xl"
        >
          {/* Accuracy */}
          <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-secondary/50">
            <Target className="w-8 h-8 text-blue-500" />
            <div className="text-3xl font-bold">{stats.accuracy}%</div>
            <div className="text-sm text-muted-foreground">Accuracy</div>
          </div>

          {/* Raw WPM */}
          <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-secondary/50">
            <Zap className="w-8 h-8 text-yellow-500" />
            <div className="text-3xl font-bold">{stats.rawWpm}</div>
            <div className="text-sm text-muted-foreground">Raw WPM</div>
          </div>

          {/* Correct Words */}
          <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-secondary/50">
            <Award className="w-8 h-8 text-green-500" />
            <div className="text-3xl font-bold">{stats.correctWords}</div>
            <div className="text-sm text-muted-foreground">Correct</div>
          </div>

          {/* Characters */}
          <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-secondary/50">
            <Trophy className="w-8 h-8 text-purple-500" />
            <div className="text-3xl font-bold">{stats.characterCount}</div>
            <div className="text-sm text-muted-foreground">Characters</div>
          </div>
        </motion.div>

        {/* Additional Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-sm text-muted-foreground mt-4"
        >
          {stats.incorrectWords > 0 && (
            <p>
              Incorrect words: <span className="text-red-500 font-semibold">{stats.incorrectWords}</span>
            </p>
          )}
          <p>
            Total words typed: <span className="font-semibold">{stats.correctWords + stats.incorrectWords}</span>
          </p>
        </motion.div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex gap-4 w-full max-w-md mx-auto"
      >
        <Tooltip label="Return home">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to="/"
              className="aspect-square bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-full p-4 focus-visible:ring-4 focus-visible:ring-primary focus:outline-none flex justify-center items-center"
            >
              <ArrowLeft className="w-6 h-6" />
            </Link>
          </motion.div>
        </Tooltip>

        <motion.div
          className="flex-1"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            autoFocus
            onClick={onRestart}
            size="lg"
            className="w-full rounded-full text-lg h-14 gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            Play Again
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
