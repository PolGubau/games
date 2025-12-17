import { motion } from "motion/react";
import { Button } from "~/components/ui/button";
import { useState } from "react";
import ConfettiExplosion from "react-confetti-explosion";

interface GameWonProps {
  onContinue: () => void;
  onNewGame: () => void;
}

export function GameWon({ onContinue, onNewGame }: GameWonProps) {
  const [isExploding, setIsExploding] = useState(true);

  return (
    <>
      {isExploding && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
          <ConfettiExplosion
            force={0.8}
            duration={3000}
            particleCount={250}
            width={1600}
            onComplete={() => setIsExploding(false)}
          />
        </div>
      )}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 flex items-center justify-center bg-black/70 rounded-xl backdrop-blur-sm"
      >
        <div className="text-center space-y-6 p-8">
          <motion.h2
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="text-6xl font-bold text-yellow-400"
          >
            You Win!
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-white"
          >
            Congratulations! You reached 2048!
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex gap-4 justify-center"
          >
            <Button onClick={onContinue} size="lg" variant="default">
              Continue Playing
            </Button>
            <Button onClick={onNewGame} size="lg" variant="outline">
              New Game
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
}
