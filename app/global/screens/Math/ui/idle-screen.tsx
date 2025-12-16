import { motion } from "motion/react";
import { ArrowLeft, Play, Brain } from "lucide-react";
import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import { Tooltip } from "~/components/ui/tooltip";
import type { DifficultyLevel, SolvedOperation } from "../domain/types";
import { MATH_CONFIG, DIFFICULTY_LEVELS } from "../domain/types";
import { Card } from "~/components/ui/card";
import { twMerge } from "tailwind-merge";

interface IdleScreenProps {
  onStart: () => void;
  difficulty: DifficultyLevel;
  onDifficultyChange: (difficulty: DifficultyLevel) => void;
  timeLimit: number;
  onTimeChange: (seconds: number) => void;
  lastResults?: {
    score: number;
    correct: number;
    total: number;
  };
  solvedOperations?: SolvedOperation[];
}

export function IdleScreen({
  onStart,
  difficulty,
  onDifficultyChange,
  timeLimit,
  onTimeChange,
  lastResults,
  solvedOperations,
}: IdleScreenProps) {
  const hasResults = lastResults && lastResults.total > 0;

  return (
    <section className="text-center grid gap-8 items-center justify-center min-h-[60vh] w-full max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex gap-6 flex-col justify-center items-center"
      >
        {hasResults ? (
          <>
            <Brain className="w-16 h-16 text-primary" />
            <h3 className="text-4xl md:text-6xl max-w-150 font-bold">
              You scored <span className="text-primary font-bold">{lastResults.score}</span> points!
            </h3>
            <p className="text-lg text-muted-foreground">
              {lastResults.correct} correct out of {lastResults.total} operations
            </p>
          </>
        ) : (
          <>
            <Brain className="w-20 h-20 text-primary" />
            <h3 className="text-4xl md:text-6xl max-w-150 font-bold">
              Math Challenge
            </h3>
            <p className="text-lg text-muted-foreground">
              Solve as many operations as you can!
            </p>
          </>
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

        <p className="text-sm text-muted-foreground max-w-md">
          {difficulty === "EASY" && "Addition and subtraction (1-10)"}
          {difficulty === "MEDIUM" && "Addition, subtraction, and multiplication (1-12)"}
          {difficulty === "HARD" && "All operations including division (1-12)"}
        </p>

        {/* Time Selection */}
        <div className="flex gap-4 items-center mt-2">
          <label className="text-sm font-medium">Time Limit:</label>
          <div className="flex gap-2">
            {MATH_CONFIG.TIME_OPTIONS.map((time) => (
              <button
                key={time}
                type="button"
                onClick={() => onTimeChange(time)}
                className={`px-4 py-2 rounded-lg transition-colors ${timeLimit === time
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
              >
                {time}s
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Previous Results */}
      {solvedOperations && solvedOperations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full"
        >
          <h4 className="text-lg font-semibold mb-4">Previous Results:</h4>
          <div className="max-h-60 overflow-y-auto">
            <ul className="flex flex-wrap gap-3 justify-center">
              {solvedOperations.map((op, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.02 }}
                >
                  <Card
                    className={twMerge(
                      "px-3 py-2 min-w-32 text-center transition-all hover:scale-105",
                      op.isCorrect ? "bg-green-500/20 border-green-500" : "bg-red-500/20 border-red-500"
                    )}
                  >
                    <div className="text-sm font-mono">
                      {op.operation} =
                      {op.isCorrect ? (
                        <span className="ml-1 font-bold">{op.userAnswer}</span>
                      ) : (
                        <span className="ml-1">
                          <span className="line-through opacity-60">{op.userAnswer}</span>
                          <span className="ml-1 font-bold text-green-500">{op.correct}</span>
                        </span>
                      )}
                    </div>
                  </Card>
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>
      )}

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
            {hasResults ? "Play Again" : "Start Game"}
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
