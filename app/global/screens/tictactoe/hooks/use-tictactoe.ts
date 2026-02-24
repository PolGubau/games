import { useCallback, useState } from "react";
import type { Board, GameMode, GameState } from "../domain/types";
import { INITIAL_BOARD } from "../domain/types";
import { applyMove, checkWinner, getBestMove, isDraw } from "../domain/utilities";

function createInitialState(mode: GameMode): GameState {
  return {
    board: [...INITIAL_BOARD] as Board,
    currentPlayer: "X",
    mode,
    status: "playing",
    winner: null,
    winningLine: null,
  };
}

export function useTictactoe() {
  const [gameState, setGameState] = useState<GameState | null>(null);

  const startGame = useCallback((mode: GameMode) => {
    setGameState(createInitialState(mode));
  }, []);

  const resetGame = useCallback(() => {
    setGameState((prev) => (prev ? createInitialState(prev.mode) : null));
  }, []);

  const goToIdle = useCallback(() => {
    setGameState(null);
  }, []);

  const handleCellClick = useCallback(
    (index: number) => {
      setGameState((prev) => {
        if (!prev || prev.status !== "playing") return prev;
        if (prev.board[index] !== null) return prev;

        const newBoard = applyMove(prev.board, index, prev.currentPlayer);
        const result = checkWinner(newBoard);

        if (result) {
          return {
            ...prev,
            board: newBoard,
            status: "won",
            winner: result.winner,
            winningLine: result.line,
          };
        }

        if (isDraw(newBoard)) {
          return { ...prev, board: newBoard, status: "draw" };
        }

        const nextPlayer = prev.currentPlayer === "X" ? "O" : "X";

        // If AI mode and it's O's turn, compute AI move
        if (prev.mode === "ai" && nextPlayer === "O") {
          const aiIndex = getBestMove(newBoard);
          const boardAfterAI = applyMove(newBoard, aiIndex, "O");
          const aiResult = checkWinner(boardAfterAI);

          if (aiResult) {
            return {
              ...prev,
              board: boardAfterAI,
              status: "won",
              winner: aiResult.winner,
              winningLine: aiResult.line,
              currentPlayer: "X",
            };
          }

          if (isDraw(boardAfterAI)) {
            return { ...prev, board: boardAfterAI, status: "draw", currentPlayer: "X" };
          }

          return { ...prev, board: boardAfterAI, currentPlayer: "X" };
        }

        return { ...prev, board: newBoard, currentPlayer: nextPlayer };
      });
    },
    [],
  );

  return { gameState, startGame, resetGame, goToIdle, handleCellClick };
}
