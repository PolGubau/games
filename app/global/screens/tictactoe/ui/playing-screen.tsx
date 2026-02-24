import { motion } from "motion/react";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { Button } from "~/components/ui/button";
import type { GameState } from "../domain/types";

interface PlayingScreenProps {
  gameState: GameState;
  onCellClick: (index: number) => void;
  onReset: () => void;
  onGoHome: () => void;
}

function getStatusMessage(gameState: GameState): string {
  if (gameState.status === "won") {
    if (gameState.mode === "ai") {
      return gameState.winner === "X" ? "🎉 You win!" : "🤖 AI wins!";
    }
    return `🎉 Player ${gameState.winner} wins!`;
  }
  if (gameState.status === "draw") return "🤝 It's a draw!";
  if (gameState.mode === "ai") return "Your turn (X)";
  return `Player ${gameState.currentPlayer}'s turn`;
}

export function PlayingScreen({ gameState, onCellClick, onReset, onGoHome }: PlayingScreenProps) {
  const { board, status, winningLine } = gameState;
  const isFinished = status === "won" || status === "draw";

  return (
    <section className="flex flex-col gap-8 items-center justify-center min-h-[60vh] w-full max-w-lg mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h3 className="text-2xl font-bold">{getStatusMessage(gameState)}</h3>
      </motion.div>

      {/* Board */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="grid grid-cols-3 gap-2 w-full max-w-xs"
      >
        {board.map((cell, i) => {
          const isWinning = winningLine?.includes(i) ?? false;
          return (
            <motion.button
              key={i}
              type="button"
              onClick={() => onCellClick(i)}
              disabled={cell !== null || isFinished}
              whileHover={cell === null && !isFinished ? { scale: 1.05 } : {}}
              whileTap={cell === null && !isFinished ? { scale: 0.95 } : {}}
              className={`aspect-square rounded-xl text-4xl font-bold flex items-center justify-center transition-colors
                ${isWinning ? "bg-primary text-primary-foreground" : "bg-secondary hover:bg-secondary/80"}
                ${cell === null && !isFinished ? "cursor-pointer" : "cursor-default"}
              `}
            >
              {cell && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  {cell}
                </motion.span>
              )}
            </motion.button>
          );
        })}
      </motion.div>

      {/* Action buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex gap-4 w-full max-w-xs"
      >
        <Button
          variant="secondary"
          size="lg"
          className="rounded-full h-12 gap-2"
          onClick={onGoHome}
        >
          <ArrowLeft className="w-4 h-4" />
          Home
        </Button>
        <Button
          size="lg"
          className="flex-1 rounded-full h-12 gap-2"
          onClick={onReset}
        >
          <RotateCcw className="w-4 h-4" />
          {isFinished ? "Play again" : "Restart"}
        </Button>
      </motion.div>
    </section>
  );
}
