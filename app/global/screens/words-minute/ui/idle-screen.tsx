import { Play } from "lucide-react";
import { GoHomeButton } from "~/components/go-home-button";
import { Button } from "~/components/ui/button";
import { ButtonGroup } from "~/components/ui/button-group";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Item, ItemContent, ItemDescription, ItemTitle } from "~/components/ui/item";
import type { GameMode } from "../domain/types";
import { WPM_CONFIG } from "../domain/types";

interface IdleScreenProps {
  onStart: () => void;
  gameMode: GameMode;
  onToggleMode: () => void;
  timeLimit: number;
  onSetTime: (seconds: number) => void;
  lastScore?: number;
}

export function IdleScreen({
  onStart,
  gameMode,
  onToggleMode,
  timeLimit,
  onSetTime,
  lastScore,
}: IdleScreenProps) {
  const isFirstVisit = lastScore === undefined;
  const title = isFirstVisit ? "How fast can you type?" : "Ready for another round?";
  const description = isFirstVisit
    ? "Test your typing speed and accuracy"
    : `You scored ${lastScore} WPM!`;
  return (
    <div className="flex flex-col gap-1 w-full">
      <header>
        <GoHomeButton />
      </header>
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent >

          <Item variant="outline">
            <ItemContent>
              <ItemTitle>Game Mode</ItemTitle>
              <ItemDescription>
                {gameMode === "strict"
                  ? "Strict mode: Only correct characters are accepted"
                  : "Normal mode: Type freely and correct mistakes"}

              </ItemDescription>

              <ButtonGroup orientation="horizontal" className="mt-4">
                <Button
                  type="button"
                  onClick={onToggleMode}
                  variant={gameMode === "normal" ? "default" : "secondary"}
                >
                  Normal
                </Button>
                <Button
                  type="button"
                  onClick={onToggleMode}
                  variant={gameMode === "strict" ? "default" : "secondary"}

                >
                  Strict
                </Button>
              </ButtonGroup>
            </ItemContent>
          </Item>


          {/*  */}
          <Item variant="outline">
            <ItemContent>
              <ItemTitle>Time Limit</ItemTitle>
              <ItemDescription>Choose how long each typing test will last</ItemDescription>

              <ButtonGroup orientation="horizontal" className="mt-4">
                {WPM_CONFIG.TIME_OPTIONS.map((time) => (
                  <Button
                    key={time}
                    type="button"
                    onClick={() => onSetTime(time)}
                    variant={timeLimit === time ? "default" : "secondary"}
                  >

                    {time}s
                  </Button>
                ))}
              </ButtonGroup>
            </ItemContent>
          </Item>
        </CardContent>
        <CardFooter>
          <CardAction>
            <Button onClick={() => onStart()}>Start Game
              <Play />

            </Button>
          </CardAction>
        </CardFooter>
      </Card>


    </div>

  );
}
