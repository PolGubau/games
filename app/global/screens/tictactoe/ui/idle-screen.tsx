import { motion } from "motion/react";
import { ArrowLeft, Users, Bot } from "lucide-react";
import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import type { GameMode } from "../domain/types";

interface IdleScreenProps {
  onStart: (mode: GameMode) => void;
}

export function IdleScreen({ onStart }: IdleScreenProps) {
  return (
    <section className="text-center grid gap-8 items-center justify-center min-h-[60vh] w-full max-w-lg mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex gap-6 flex-col justify-center items-center"
      >
        <span className="text-6xl">⭕</span>
        <h3 className="text-4xl md:text-6xl font-bold">Tic-Tac-Toe</h3>
        <p className="text-lg text-muted-foreground">
          Choose your game mode
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col gap-4 w-full"
      >
        <Button
          size="lg"
          className="w-full rounded-full text-lg h-14 gap-2"
          onClick={() => onStart("human")}
        >
          <Users className="w-5 h-5" />
          2 Players
        </Button>

        <Button
          size="lg"
          variant="secondary"
          className="w-full rounded-full text-lg h-14 gap-2"
          onClick={() => onStart("ai")}
        >
          <Bot className="w-5 h-5" />
          vs AI
        </Button>

        <Link
          to="/"
          className="flex items-center justify-center gap-2 text-muted-foreground hover:text-primary transition-colors mt-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>
      </motion.div>
    </section>
  );
}
