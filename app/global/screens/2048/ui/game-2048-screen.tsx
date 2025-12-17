import { CheckCircle2Icon, Move, RotateCcw, Trophy, Undo2 } from "lucide-react";
import { GoHomeButton } from "~/components/go-home-button";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import BoardLayout from "~/global/Layouts/BoardLayout";
import { useGame2048 } from "../hooks/use-game-2048";
import { Board } from "./board";
import { GameOver } from "./game-over";
import { GameWon } from "./game-won";
import { ButtonGroup } from "~/components/ui/button-group";

export function Game2048Screen() {
  const { gameState, stats, move, newGame, continueGame, undo } = useGame2048();

  return (
    <BoardLayout title="2048">
      <div className="flex flex-col gap-4">
        <GoHomeButton />
        <header className="flex items-center justify-between">
          <h1 className="text-5xl font-bold text-primary">2048</h1>

          <ButtonGroup orientation={"horizontal"}>
            <Button
              onClick={undo}
              disabled={!gameState.canUndo}
              variant="outline"
              size="icon"
            >
              <Undo2 className="w-5 h-5" />
            </Button>
            <Button onClick={newGame} variant="outline" size="icon">
              <RotateCcw className="w-5 h-5" />
            </Button>
          </ButtonGroup>
        </header>

        <div className="grid md:grid-cols-[auto_1fr] gap-4">

          <section id="scores" className="flex gap-4 md:flex-col flex-1 min-w-50">
            <ScoreCard label="Score" value={stats.score} icon={<CheckCircle2Icon className="size-5" />} />
            <ScoreCard label="Best" value={stats.bestScore} icon={<Trophy className="size-5" />} />
            <ScoreCard label="Moves" value={stats.moves} icon={<Move className="size-5" />} />
          </section>

          {/* Game Board */}
          <div className="relative mx-auto w-full max-h-[80dvh]">
            <Board tiles={gameState.tiles} onSwipe={move} />

            {/* Overlays */}
            {gameState.status === "won" && (
              <GameWon onContinue={continueGame} onNewGame={newGame} />
            )}
            {gameState.status === "lost" && (
              <GameOver stats={stats} onNewGame={newGame} />
            )}
          </div>
        </div>

        <div className="text-center text-sm text-muted-foreground animate-in fade-in-50 mt-2">
          <p>Use arrow keys or WASD to move tiles</p>
          <p className="mt-1">Swipe on mobile</p>
        </div>
      </div>
    </BoardLayout>
  );
}

function ScoreCard({ label, value, icon }: { label: string; value: number; icon?: React.ReactNode }) {
  return (
    <Alert className="">
      {icon}
      <AlertDescription>{label}</AlertDescription>
      <AlertTitle>{value}</AlertTitle>
    </Alert>
  );
}
