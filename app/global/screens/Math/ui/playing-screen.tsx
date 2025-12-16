import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { RotateCcw, Zap } from "lucide-react";
import { Button } from "~/components/ui/button";
import { formatTime } from "../domain/utilities";
import type { Operation } from "../domain/types";

interface PlayingScreenProps {
  operation: Operation;
  timeRemaining: number;
  currentIndex: number;
  totalOperations: number;
  onAnswer: (answer: string) => void;
  onReset: () => void;
}

export function PlayingScreen({
  operation,
  timeRemaining,
  currentIndex,
  totalOperations,
  onAnswer,
  onReset,
}: PlayingScreenProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // Calculate progress percentage
  const progressPercentage = ((currentIndex + 1) / totalOperations) * 100;
  const timePercentage = (timeRemaining / 60) * 100;

  // Reset selected answer when operation changes
  useEffect(() => {
    setSelectedAnswer(null);
    setIsAnimating(false);
  }, [operation]);

  const handleAnswerClick = (answer: string) => {
    if (isAnimating) return;

    setSelectedAnswer(answer);
    setIsAnimating(true);

    // Animate for a brief moment before moving to next question
    setTimeout(() => {
      onAnswer(answer);
    }, 300);
  };

  // Keyboard support
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const key = e.key;
      if (key >= "1" && key <= "4") {
        const index = parseInt(key, 10) - 1;
        if (operation.solutions[index]) {
          handleAnswerClick(operation.solutions[index]);
        }
      }
    };

    window.addEventListener("keypress", handleKeyPress);
    return () => window.removeEventListener("keypress", handleKeyPress);
  }, [operation.solutions, handleAnswerClick]); return (
    <div className="relative flex flex-col items-center justify-center min-h-[60vh] gap-8 w-full max-w-4xl mx-auto">
      {/* Progress Bars */}
      <div className="fixed top-0 left-0 w-full h-2 bg-secondary z-50 flex">
        <motion.div
          className="h-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.3 }}
        />
        <motion.div
          className="h-full bg-primary"
          initial={{ width: `${100 - progressPercentage}%` }}
          animate={{ width: `${((100 - progressPercentage) * timePercentage) / 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Reset Button */}
      <Button
        size="icon"
        variant="ghost"
        onClick={onReset}
        className="absolute top-4 left-4 z-10"
      >
        <RotateCcw className="w-5 h-5" />
      </Button>

      {/* Timer and Progress */}
      <motion.div
        key={timeRemaining}
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex items-center gap-4"
      >
        <div className="text-2xl font-bold text-primary flex items-center gap-2">
          <Zap className="w-6 h-6" />
          {formatTime(timeRemaining)}
        </div>
        <div className="text-lg text-muted-foreground">
          {currentIndex + 1} / {totalOperations}
        </div>
      </motion.div>

      {/* Operation Display */}
      <AnimatePresence mode="wait">
        <motion.div
          key={operation.operation}
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -20 }}
          transition={{ duration: 0.3, type: "spring", stiffness: 200, damping: 20 }}
          className="text-center"
        >
          <h2 className="text-6xl md:text-8xl font-bold text-primary mb-2">
            {operation.operation}
          </h2>
          <div className="text-4xl md:text-6xl text-muted-foreground">=</div>
        </motion.div>
      </AnimatePresence>

      {/* Answer Options */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-3xl"
      >
        {operation.solutions.map((solution, index) => {
          const isSelected = selectedAnswer === solution;
          const isCorrect = solution === operation.correct;

          return (
            <motion.div
              key={solution}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.05 }}
              whileHover={{ scale: isAnimating ? 1 : 1.05 }}
              whileTap={{ scale: isAnimating ? 1 : 0.95 }}
            >
              <Button
                onClick={() => handleAnswerClick(solution)}
                disabled={isAnimating}
                className={`w-full relative h-20 text-3xl font-bold transition-all ${isSelected
                  ? isCorrect
                    ? "bg-green-500 hover:bg-green-600 scale-105"
                    : "bg-red-500 hover:bg-red-600 scale-95"
                  : "bg-secondary hover:bg-secondary/80"
                  }`}
              >
                <span className="text-sm text-muted-foreground absolute top-2 left-3">{index + 1}</span>
                <span className="text-primary">{solution}</span>
              </Button>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Keyboard Hint */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-sm text-muted-foreground"
      >
        Press 1-4 on your keyboard to answer quickly
      </motion.p>

      {/* Visual Background Effect */}
      <div
        className="fixed inset-0 bg-linear-to-br from-primary/20 to-transparent pointer-events-none -z-10 transition-opacity duration-1000"
        style={{
          opacity: Math.min((100 - timePercentage) / 100, 0.3),
        }}
      />
    </div>
  );
}
