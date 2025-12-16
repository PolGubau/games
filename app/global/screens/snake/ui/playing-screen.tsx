import { motion } from "motion/react";
import { Pause, Play, RotateCcw, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "~/components/ui/button";
import type { GameStats, Position, Direction } from "../domain/types";
import { SNAKE_CONFIG } from "../domain/types";
import { formatGameTime } from "../domain/utilities";
import { useIsMobile } from "~/shared/hooks/use-media-query";

interface PlayingScreenProps {
  snake: Position[];
  foodPosition: Position;
  isPaused: boolean;
  stats: GameStats;
  onPause: () => void;
  onReset: () => void;
  onDirectionChange: (direction: Direction) => void;
}

export function PlayingScreen({
  snake,
  foodPosition,
  isPaused,
  stats,
  onPause,
  onReset,
  onDirectionChange,
}: PlayingScreenProps) {
  const isMobile = useIsMobile();

  return (
    <div className="relative flex flex-col items-center justify-center gap-6 w-full max-w-4xl mx-auto">
      {/* Controls */}
      <div className="flex gap-2 items-center justify-between w-full px-4">
        <Button size="icon" variant="ghost" onClick={onReset}>
          <RotateCcw className="w-5 h-5" />
        </Button>

        <div className="flex gap-6 items-center text-sm">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Score:</span>
            <span className="text-xl font-bold text-primary">{stats.score}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Length:</span>
            <span className="text-lg font-semibold">{stats.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Time:</span>
            <span className="text-lg font-semibold">{formatGameTime(stats.gameTime)}</span>
          </div>
        </div>

        <Button size="icon" variant="ghost" onClick={onPause}>
          {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
        </Button>
      </div>

      {/* Game Board */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative bg-secondary rounded-lg overflow-hidden border-4 border-primary/20"
        style={{
          width: "min(90vw, 600px)",
          height: "min(90vw, 600px)",
        }}
      >
        {/* Grid Lines */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none opacity-10"
          xmlns="http://www.w3.org/2000/svg"
        >
          {Array.from({ length: SNAKE_CONFIG.GRID_SIZE + 1 }).map((_, i) => {
            const pos = (i * SNAKE_CONFIG.CELL_SIZE) + "%";
            return (
              <g key={i}>
                <line x1={pos} y1="0" x2={pos} y2="100%" stroke="currentColor" strokeWidth="1" />
                <line x1="0" y1={pos} x2="100%" y2={pos} stroke="currentColor" strokeWidth="1" />
              </g>
            );
          })}
        </svg>

        {/* Snake */}
        {snake.map((segment, index) => {
          const isHead = index === snake.length - 1;
          const opacity = 0.7 + (index / snake.length) * 0.3; // More visible: 0.7 to 1.0

          return (
            <motion.div
              key={`snake-${index}`}
              className={`absolute ${isHead ? "rounded-md z-20" : "rounded-sm z-10"}`}
              style={{
                left: `${segment.x}%`,
                top: `${segment.y}%`,
                width: `${SNAKE_CONFIG.CELL_SIZE}%`,
                height: `${SNAKE_CONFIG.CELL_SIZE}%`,
                backgroundColor: isHead ? "#16a34a" : `rgba(34, 197, 94, ${opacity})`,
                border: isHead ? "2px solid #15803d" : undefined,
              }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.1 }}
            />
          );
        })}

        {/* Food */}
        <motion.div
          key={`food-${foodPosition.x}-${foodPosition.y}`}
          className="absolute rounded-full bg-red-500 z-0"
          style={{
            left: `${foodPosition.x}%`,
            top: `${foodPosition.y}%`,
            width: `${SNAKE_CONFIG.CELL_SIZE}%`,
            height: `${SNAKE_CONFIG.CELL_SIZE}%`,
          }}
          initial={{ scale: 0 }}
          animate={{ scale: [1, 1.3, 1] }}
          transition={{
            duration: 0.8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />

        {/* Pause Overlay */}
        {isPaused && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <div className="text-center">
              <h3 className="text-4xl font-bold text-white mb-4">Paused</h3>
              <p className="text-white/80">Press Space or P to resume</p>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Mobile Controls */}
      {isMobile && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-3 gap-2 w-full max-w-xs"
        >
          <div className="col-start-2">
            <Button
              size="lg"
              variant="outline"
              className="w-full h-16 active:scale-95 transition-transform"
              onClick={() => onDirectionChange("UP")}
              disabled={isPaused}
            >
              <ArrowUp className="w-6 h-6" />
            </Button>
          </div>
          <div className="col-start-1">
            <Button
              size="lg"
              variant="outline"
              className="w-full h-16 active:scale-95 transition-transform"
              onClick={() => onDirectionChange("LEFT")}
              disabled={isPaused}
            >
              <ArrowLeft className="w-6 h-6" />
            </Button>
          </div>
          <div className="col-start-2">
            <Button
              size="lg"
              variant="outline"
              className="w-full h-16 active:scale-95 transition-transform"
              onClick={() => onDirectionChange("DOWN")}
              disabled={isPaused}
            >
              <ArrowDown className="w-6 h-6" />
            </Button>
          </div>
          <div className="col-start-3 row-start-2">
            <Button
              size="lg"
              variant="outline"
              className="w-full h-16 active:scale-95 transition-transform"
              onClick={() => onDirectionChange("RIGHT")}
              disabled={isPaused}
            >
              <ArrowRight className="w-6 h-6" />
            </Button>
          </div>
        </motion.div>
      )}

      {/* Controls Hint */}
      {!isMobile && (
        <p className="text-sm text-muted-foreground">
          Use Arrow Keys or WASD • Press Space to Pause
        </p>
      )}
    </div>
  );
}
