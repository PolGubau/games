import { useState } from "react";
import { GoHomeButton } from "~/components/go-home-button";
import { Button } from "~/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Item, ItemContent, ItemDescription, ItemTitle } from "~/components/ui/item";
import { Slider } from "~/components/ui/slider";
import type { GenerateBoardCells } from "../hooks/use-sudoku";
import { Play } from "lucide-react";
interface Props {
  onStart: GenerateBoardCells;
}

const SudokuLobby: React.FC<Props> = ({ onStart }: Props) => {
  const [difficulty, setDifficulty] = useState<number>(50);
  return (
    <div className="flex flex-col gap-1">
      <header>
        <GoHomeButton />
      </header>
      <Card>
        <CardHeader>
          <CardTitle className="flex flex-col gap-6">
            <span className="text-6xl">🧩</span>
            Sudoku
          </CardTitle>
          <CardDescription>Customize your game settings below</CardDescription>
        </CardHeader>
        <CardContent>
          <Item variant="muted">
            <ItemContent>
              <ItemTitle>Difficulty</ItemTitle>
              <ItemDescription>
                Drag the slider to set the difficulty level: lower values mean more pre-filled numbers.
              </ItemDescription>

              <div className="gap-4 grid grid-cols-[1fr_auto] mt-4 items-center">
                <Slider
                  value={[difficulty]}
                  onValueChange={([value]) => setDifficulty(value)}
                  aria-label="Difficulty"
                  name="difficulty"
                  min={0}
                  max={100}
                  step={1}
                />

                <span>
                  {difficulty}%
                </span>
              </div>
            </ItemContent>
          </Item>
        </CardContent>
        <CardFooter>
          <CardAction>
            <Button onClick={() => onStart(difficulty)}>Start Game
              <Play />
            </Button>
          </CardAction>
        </CardFooter>
      </Card>


    </div>
  );
};

export default SudokuLobby;
