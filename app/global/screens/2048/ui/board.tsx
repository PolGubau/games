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
  const gridStyle = {
    gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
    gridTemplateRows: `repeat(${gridSize}, 1fr)`,
  };

  return (
    <div
      ref={boardRef}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative aspect-square w-full bg-primary rounded-xl p-2"
    >
      {/* Background grid */}
      <div className="grid gap-2 w-full h-full" style={gridStyle}>
        {Array.from({ length: gridSize * gridSize }, (_, i) => (
          <div key={i} className="bg-muted-foreground rounded-lg" />
        ))}
      </div>

      {/* Tiles layer */}
      <div className="absolute inset-2 grid gap-2" style={gridStyle}>
        {/* Ghost cells maintain grid structure */}
        {/* {Array.from({ length: gridSize * gridSize }, (_, i) => (
          <div key={`ghost-${i}`} className="pointer-events-none" />
        ))} */}
        {/* Active tiles */}
        {tiles.map((tile) => (
          <TileComponent key={tile.id} tile={tile} />
        ))}
      </div>
    </div>
  );
}
