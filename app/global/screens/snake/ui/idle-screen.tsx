import { motion } from "motion/react";
import { ArrowLeft, Play, Trophy } from "lucide-react";
import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import { Tooltip } from "~/components/ui/tooltip";
import type { DifficultyLevel } from "../domain/types";
import { DIFFICULTY_LEVELS } from "../domain/types";

interface IdleScreenProps {
  onStart: () => void;
  difficulty: DifficultyLevel;
  onDifficultyChange: (difficulty: DifficultyLevel) => void;
  highScore: number;
  lastScore?: number;
}

export function IdleScreen({
  onStart,
  difficulty,
  onDifficultyChange,
  highScore,
  lastScore,
}: IdleScreenProps) {
  const hasLastScore = lastScore !== undefined && lastScore > 0;

  return (
    <section className="text-center grid gap-8 items-center justify-center min-h-[60vh] w-full max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex gap-6 flex-col justify-center items-center"
      >
        {hasLastScore ? (
          <>
            <Trophy className="w-16 h-16 text-primary" />
            <h3 className="text-4xl md:text-6xl max-w-150 font-bold">
              Score: <span className="text-primary font-bold">{lastScore}</span>
            </h3>
            {lastScore >= highScore && lastScore > 0 && (
              <p className="text-lg text-yellow-500 font-semibold">🏆 New High Score!</p>
            )}
          </>
        ) : (
          <>
            <div className="text-6xl">🐍</div>
            <h3 className="text-4xl md:text-6xl max-w-150 font-bold">Snake Game</h3>
            <p className="text-lg text-muted-foreground">
              Eat food, grow long, don't crash!
            </p>
          </>
        )}

        {/* High Score Display */}
        {highScore > 0 && (
          <div className="text-lg text-muted-foreground">
            High Score: <span className="text-primary font-semibold">{highScore}</span>
          </div>
        )}

        {/* Difficulty Selection */}
        <div className="flex gap-4 items-center mt-6">
          <label className="text-sm font-medium">Difficulty:</label>
          <div className="flex gap-2">
            {(Object.keys(DIFFICULTY_LEVELS) as DifficultyLevel[]).map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => onDifficultyChange(level)}
                className={`px-4 py-2 rounded-lg transition-colors ${difficulty === level
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        <div className="text-sm text-muted-foreground max-w-md space-y-1">
          <p>
            <span className="font-semibold">Speed:</span> {DIFFICULTY_LEVELS[difficulty].speed}ms
          </p>
          <p>
            <span className="font-semibold">Speed increase per food:</span>{" "}
            {DIFFICULTY_LEVELS[difficulty].speedIncrement}ms
          </p>
        </div>

        {/* Controls Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-4 p-4 bg-secondary/50 rounded-lg max-w-md"
        >
          <h4 className="font-semibold mb-2">Controls:</h4>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>🎮 Arrow Keys or WASD to move</p>
            <p>⏸️ Space or P to pause</p>
          </div>
        </motion.div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex gap-4 w-full max-w-md mx-auto"
      >
        <Tooltip label="Return home">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/"
              className="aspect-square bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-full p-4 focus-visible:ring-4 focus-visible:ring-primary focus:outline-none flex justify-center items-center"
            >
              <ArrowLeft className="w-6 h-6" />
            </Link>
          </motion.div>
        </Tooltip>

        <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button autoFocus onClick={onStart} size="lg" className="w-full rounded-full text-lg h-14 gap-2">
            <Play className="w-5 h-5" />
            {hasLastScore ? "Play Again" : "Start Game"}
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
