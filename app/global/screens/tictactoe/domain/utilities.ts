import type { Board, Cell, Player } from "./types";
import { WINNING_LINES } from "./types";

export function checkWinner(board: Board): { winner: Player; line: number[] } | null {
  for (const line of WINNING_LINES) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a] as Player, line };
    }
  }
  return null;
}

export function isDraw(board: Board): boolean {
  return board.every((cell) => cell !== null) && checkWinner(board) === null;
}

function minimax(board: Board, isMaximizing: boolean): number {
  const result = checkWinner(board);
  if (result) return result.winner === "O" ? 10 : -10;
  if (isDraw(board)) return 0;

  if (isMaximizing) {
    let best = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        const newBoard = [...board] as Board;
        newBoard[i] = "O";
        best = Math.max(best, minimax(newBoard, false));
      }
    }
    return best;
  }

  let best = Infinity;
  for (let i = 0; i < 9; i++) {
    if (board[i] === null) {
      const newBoard = [...board] as Board;
      newBoard[i] = "X";
      best = Math.min(best, minimax(newBoard, true));
    }
  }
  return best;
}

export function getBestMove(board: Board): number {
  let bestVal = -Infinity;
  let bestMove = -1;

  for (let i = 0; i < 9; i++) {
    if (board[i] === null) {
      const newBoard = [...board] as Board;
      newBoard[i] = "O";
      const moveVal = minimax(newBoard, false);
      if (moveVal > bestVal) {
        bestVal = moveVal;
        bestMove = i;
      }
    }
  }
  return bestMove;
}

export function applyMove(board: Board, index: number, player: Player): Board {
  const newBoard = [...board] as Board;
  newBoard[index] = player;
  return newBoard;
}
