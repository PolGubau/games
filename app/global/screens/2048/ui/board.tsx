import { useCallback, useRef } from "react";
import type { Direction, Tile as TileType } from "../domain/types";
import { GAME_2048_CONFIG } from "../domain/types";
import { TileComponent } from "./tile";

interface BoardProps {
  tiles: TileType[];
  onSwipe: (direction: Direction) => void;
}

export function Board({ tiles, onSwipe }: BoardProps) {
  const boardRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  // Handle touch/swipe
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!touchStartRef.current) return;

      const deltaX = e.changedTouches[0].clientX - touchStartRef.current.x;
      const deltaY = e.changedTouches[0].clientY - touchStartRef.current.y;
      const threshold = 50;

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (Math.abs(deltaX) > threshold) {
          onSwipe(deltaX > 0 ? "RIGHT" : "LEFT");
        }
      } else {
        // Vertical swipe
        if (Math.abs(deltaY) > threshold) {
          onSwipe(deltaY > 0 ? "DOWN" : "UP");
        }
      }

      touchStartRef.current = null;
    },
    [onSwipe]
  );

  const gridSize = GAME_2048_CONFIG.GRID_SIZE;

  return (
    <div
      ref={boardRef}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative aspect-square w-full bg-primary rounded-xl p-2 gap-2 grid"
      style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
    >
      {/* Background cells */}
      {Array.from({ length: gridSize * gridSize }).map((_, i) => (
        <div
          key={i}
          className="aspect-square bg-muted-foreground rounded-lg"
        />
      ))}

      {/* Tiles */}
      {tiles.map((tile) => (
        <TileComponent key={tile.id} tile={tile} />
      ))}
    </div>
  );
}
