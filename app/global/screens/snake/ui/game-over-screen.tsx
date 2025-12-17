import { RotateCcw, Trophy } from "lucide-react";
import { motion } from "motion/react";
import ConfettiExplosion from "react-confetti-explosion";
import { GoHomeButton } from "~/components/go-home-button";
import { Button } from "~/components/ui/button";
import type { GameStats } from "../domain/types";
import { formatGameTime, getPerformanceLevel } from "../domain/utilities";

interface GameOverScreenProps {
  stats: GameStats;
  onRestart: () => void;
}

export function GameOverScreen({
  stats,
  onRestart,
}: GameOverScreenProps) {
  const isHighScore = stats.score === stats.highScore;
  const performanceLevel = getPerformanceLevel(stats.score); return (
    <div className="flex flex-col items-center justify-center gap-8 w-full max-w-2xl mx-auto p-6">
      {isHighScore && <ConfettiExplosion />}

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="relative"
      >
        <div className="text-8xl">{isHighScore ? "🏆" : "🐍"}</div>
        {isHighScore && (
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.3, type: "spring" }}
            className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full"
          >
            NEW HIGH SCORE!
          </motion.div>
        )}
      </motion.div>

      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">Game Over</h2>
        <p className="text-lg text-muted-foreground">
          {isHighScore
            ? "Congratulations! New high score!"
            : performanceLevel.message}
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-primary/10 rounded-lg p-8 w-full border border-primary/20"
      >
        <div className="text-center mb-6">
          <div className="text-5xl font-bold text-primary mb-2">
            {stats.score}
          </div>
          <div className="text-sm text-muted-foreground">Final Score</div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="bg-background/50 rounded-lg p-4">
            <div className="text-2xl font-bold">{stats.length}</div>
            <div className="text-xs text-muted-foreground">Snake Length</div>
          </div>
          <div className="bg-background/50 rounded-lg p-4">
            <div className="text-2xl font-bold">{stats.foodEaten}</div>
            <div className="text-xs text-muted-foreground">Food Eaten</div>
          </div>
          <div className="bg-background/50 rounded-lg p-4">
            <div className="text-2xl font-bold">{formatGameTime(stats.gameTime)}</div>
            <div className="text-xs text-muted-foreground">Time Survived</div>
          </div>
          <div className="bg-background/50 rounded-lg p-4 flex flex-col items-center justify-center gap-1">
            <div className="flex items-center gap-1">
              <Trophy className="w-4 h-4 text-yellow-500" />
              <div className="text-2xl font-bold">{stats.highScore}</div>
            </div>
            <div className="text-xs text-muted-foreground">High Score</div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <div
            className="inline-block px-4 py-2 rounded-full text-sm font-semibold"
            style={{
              backgroundColor: `${performanceLevel.color}20`,
              color: performanceLevel.color,
            }}
          >
            {performanceLevel.label}
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex gap-4 w-full"
      >
        <GoHomeButton />

        <Button
          variant="outline"
          size="lg"
          onClick={onRestart}
          className="flex-1 gap-2"
        >
          <RotateCcw className="w-5 h-5" />
          Play Again
        </Button>
      </motion.div>
    </div>
  );
}
