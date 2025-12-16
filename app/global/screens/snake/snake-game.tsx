import { useEffect, useRef, useState } from "react";
import Food from "./components/food";
import Snake from "./components/snake";
import BoardLayout from "../../Layouts/BoardLayout";
import { Button } from "~/components/ui/button";

const randomFoodPosition = () => {
  const pos = { x: 0, y: 0 };
  let x = Math.floor(Math.random() * 96);
  let y = Math.floor(Math.random() * 96);
  pos.x = x - (x % 4);
  pos.y = y - (y % 4);
  return pos;
};

const initialSnake = {
  snake: [
    { x: 0, y: 0 },
    { x: 4, y: 0 },
    { x: 8, y: 0 },
  ],
  direction: "ArrowRight",
  speed: 100,
};

function SnakeBoard() {
  const [snake, setSnake] = useState(initialSnake.snake);
  const [lastDirection, setLastDirection] = useState(initialSnake.direction);
  const [foodPosition, setFoodPosition] = useState(randomFoodPosition);
  const [isStarted, setIsStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const playgroundRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isStarted) return;

    if (
      snake[snake.length - 1].x === 100 ||
      snake[snake.length - 1].x === 0 ||
      snake[snake.length - 1].y === 100 ||
      snake[snake.length - 1].y === -4
    ) {
      setGameOver(true);
      return;
    }
    const interval = setInterval(move, initialSnake.speed);
    return () => clearInterval(interval);
  });

  const move = () => {
    const tmpSnake = [...snake];
    let x = tmpSnake[tmpSnake.length - 1].x,
      y = tmpSnake[tmpSnake.length - 1].y;
    switch (lastDirection) {
      case "ArrowUp":
        y -= 4;
        break;
      case "ArrowRight":
        x += 4;
        break;
      case "ArrowDown":
        y += 4;
        break;
      case "ArrowLeft":
        x -= 4;
        break;
      default:
        break;
    }

    tmpSnake.push({
      x,
      y,
    });
    if (x !== foodPosition.x || y !== foodPosition.y) tmpSnake.shift();
    else setFoodPosition(randomFoodPosition());
    setSnake(tmpSnake);
  };

  return (
    <main className="p-8 flex flex-col gap-8  items-center justify-center  ">
      <section className="flex gap-8 flex-col sm:flex-row h-full w-full justify-center">
        <div
          className="size-125 bg-primary-900   flex flex-col items-center justify-center text-primary-50 relative rounded-lg overflow-hidden"
          onKeyDown={(e) => setLastDirection(e.key)}
          ref={playgroundRef}
          tabIndex={0}
        >
          {isStarted && <div className="count"> score: {snake.length - 3}</div>}

          {!isStarted && (
            <>
              <Button
                className="text-black"
                onClick={() => {
                  setIsStarted(true);
                  playgroundRef.current?.focus();
                }}
                type="submit"
              >
                Start
              </Button>
            </>
          )}
          {gameOver && (
            <>
              <div className="game-over text">Game Over!</div>
              <Button
                className="text-black"
                onClick={() => {
                  setIsStarted(true);
                  setGameOver(false);
                  setSnake(initialSnake.snake);
                  setLastDirection(initialSnake.direction);
                  playgroundRef.current?.focus();
                }}
                type="submit"
              >
                Restart
              </Button>
            </>
          )}
          <Snake snake={snake} />
          {!gameOver && <Food position={foodPosition} />}
        </div>
      </section>
    </main>
  );
}
const SnakePage = () => {
  return (
    <BoardLayout title="Snake">
      <SnakeBoard />
    </BoardLayout>
  );
};
export default SnakePage;
