import BoardLayout from "../../Layouts/BoardLayout";
import { useTictactoe } from "./hooks/use-tictactoe";
import { IdleScreen } from "./ui/idle-screen";
import { PlayingScreen } from "./ui/playing-screen";

function TictactoeBoard() {
  const { gameState, startGame, resetGame, goToIdle, handleCellClick } = useTictactoe();

  return (
    <main className="p-8 flex flex-col gap-8 items-center justify-center min-h-[calc(100vh-4rem)]">
      {gameState === null ? (
        <IdleScreen onStart={startGame} />
      ) : (
        <PlayingScreen
          gameState={gameState}
          onCellClick={handleCellClick}
          onReset={resetGame}
          onGoHome={goToIdle}
        />
      )}
    </main>
  );
}

export const TictactoePage = () => {
  return (
    <BoardLayout title="Tic-Tac-Toe">
      <TictactoeBoard />
    </BoardLayout>
  );
};
