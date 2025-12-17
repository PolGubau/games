import { ArrowLeft, BadgeQuestionMark, Lightbulb, RotateCcw } from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router";
import { Button, buttonVariants } from "~/components/ui/button";
import { ButtonGroup } from "~/components/ui/button-group";
import { Tooltip } from "~/components/ui/tooltip";
import { cn } from "~/lib/utils";
import { useIsMobile } from "~/shared/hooks/use-media-query";
import BoardLayout from "../../Layouts/BoardLayout";
import { tilesData } from "./data";
import FinishPage from "./finish-page";
import { useMemo } from "./use-memo";

// Each tile has an icon and a pastel color

export interface Tile {
  id: string;
  icon: typeof Lightbulb;
  color: string;
}
export type TileId = Tile["id"];

export const MemoPage = () => {
  return (
    <BoardLayout title="Memo">
      <Board />
    </BoardLayout>
  );
};

const Board = () => {
  const {
    guessed,
    selected,
    win,
    hint,
    handleReset,
    getHint,
    isVisible,
    setSelected,
    setHint,
    hintsUsed,
    time,
  } = useMemo();
  const isMobile = useIsMobile();

  const cardsLen = tilesData.length; // 20
  const rowLen = 5; // 5


  const specs = (tile: Tile, idx: number) => {
    const tileId = tile.id;

    const baseSpecs = {
      baseClassname:
        "flex items-center justify-center p-4 md:p-6 lg:p-8 text-primary-900 transition-all flex-1",
      firstCard: "rounded-ss-2xl",
      lastOfFirstRow: "rounded-se-2xl",
      firstOfLastRow: "rounded-es-2xl",
      lastCard: "rounded-ee-2xl",
    };

    const alwaysClasses = cn(
      idx === 0 && baseSpecs.firstCard,
      idx === rowLen - 1 && baseSpecs.lastOfFirstRow,
      idx === cardsLen - rowLen && baseSpecs.firstOfLastRow,
      idx === cardsLen - 1 && baseSpecs.lastCard,
      baseSpecs.baseClassname,
    );

    if (isVisible(tileId))
      return {
        ...baseSpecs,
        disabled: true,
        className: cn(baseSpecs.baseClassname, alwaysClasses),
      };

    return {
      ...baseSpecs,
      rotateY: 180,
      key: tile.id,
      whileHover: { scale: 0.95, transition: { duration: 0.1 } },
      whileTap: { scale: 0.9, transition: { duration: 0.1 } },
      className: cn(
        "focus:outline-none focus-visible:ring-2 bg-muted focus:bg-foreground/10 transition-all text-primary-800",
        alwaysClasses,
        baseSpecs.baseClassname,
      ),

      onKeyDown: (e: React.KeyboardEvent<HTMLButtonElement>) => {
        if (e.key === "Enter") {
          setSelected([...selected, tileId]);
        }
      },
      onClick: () => selected.length < 2 && setSelected([...selected, tileId]),
    };
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const timeout = setTimeout(() => {
      // delete the first element of the array (oldest hint)
      setHint((prev) => prev.slice(1));
    }, 200);
    return () => clearTimeout(timeout);
  }, [hint]);

  const isThisTileHinted = (id: TileId) => hint.includes(id) || hint.includes(`${id}-copy`);

  if (win) return <FinishPage onReset={handleReset} hintsUsed={hintsUsed} time={time} />;

  return (
    <main className="flex flex-col gap-8 items-center justify-center">
      <section className="flex gap-8 flex-col sm:flex-row h-full w-full justify-center">
        <aside className="flex sm:flex-col gap-4 sm:items-center items-center sm:justify-between h-auto">
          <nav className="flex sm:flex-col gap-4 items-center justify-between w-full">
            <p className="flex justify-center items-end">
              <span className="text-4xl"> {guessed.length / 2}</span>
              <span className="flex gap-1 items-center">/</span>
              <span className="flex gap-1 items-center">{tilesData.length / 2}</span>
            </p>
            <ButtonGroup
              orientation={isMobile ? "horizontal" : "vertical"}
              aria-label="Media controls"
              className="h-fit"
            >
              <Link to={"/"} className={buttonVariants({ size: "icon-lg", variant: "outline" })}>
                <Tooltip label="Return home (the game won't be saved)">
                  <ArrowLeft />
                </Tooltip>
              </Link>
              <Button variant="outline" size="icon-lg" onClick={handleReset} tooltip="Reset the game" className="group">
                <RotateCcw className="group-active:rotate-180 transition-all" />
              </Button>
              <Button variant="outline" size="icon-lg" onClick={getHint} tooltip="Get a hint">
                <Lightbulb />
              </Button>
            </ButtonGroup>
          </nav>
          {hintsUsed > 0 && (
            <p className="md:flex hidden text-lg">
              <span>
                {hintsUsed} hint{hintsUsed > 1 && "s"}
              </span>
            </p>
          )}
        </aside>
        <ul
          className="grid grid-cols-5 w-full gap-0.5 xl:gap-2 p-1 h-full animate-in fade-in"
        >
          {tilesData.map((tile, idx) => {
            return (
              <button
                key={tile.id}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setSelected([...selected, tile.id]);
                  }
                }}
                {...specs(tile, idx)}
                style={{
                  backgroundColor: isVisible(tile.id)
                    ? tile.color
                    : isThisTileHinted(tile.id)
                      ? "rgba(255, 255, 255, 0.5)"
                      : undefined,
                }}
              >
                <div className="opacity-70 text-4xl md:text-5xl lg:text-6xl xl:text-7xl ">
                  {isVisible(tile.id) ? <tile.icon size={36} /> : <BadgeQuestionMark size={36} className="opacity-50" />}
                </div>
              </button>
            );
          })}
        </ul>
      </section>
    </main >
  );
};

