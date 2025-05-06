import { useCallback } from "react";
import { db } from "../db/db";
import type { Board, Sudoku } from "../sudoku-types";

export const useSudokuPersistence = () => {
	/* we want to:

1. get the old sudokus on this device
2. save the new sudoku to the list of saved sudokus
3. get the ranking of the saved sudokus
4. able to continue / delete a sudoku that's neither win or lost

*/
	const getSudoku = async (id: string) => {
		return await db.sudoku.where("id").equals(id).first();
	};

	const putSudoku = async (sudoku: Sudoku) => {
		await db.sudoku.put(sudoku);
	};
	const looseLife = async (id: string) => {
		const thisSudoku = await db.sudoku.where("id").equals(id).first();

		if (!thisSudoku) {
			console.error("Sudoku not found");
			return;
		}

		thisSudoku.lives -= 1;

		await db.sudoku.update(thisSudoku.id, thisSudoku);
	};

	const saveBoard = async (id: string, board: Board) => {
		const thisSudoku = await db.sudoku.where("id").equals(id).first();

		if (!thisSudoku) {
			console.error("Sudoku not found");
			return;
		}

		thisSudoku.board = board;

		await db.sudoku.update(thisSudoku.id, thisSudoku);
	};

	const deleteSudoku = async (sudoku: Sudoku) => {
		await db.sudoku.delete(sudoku.id);
	};
	const getRanking = useCallback(async (): Promise<Sudoku[]> => {
		const ranking = await db.sudoku
			.where("win")
			.equals(1)
			.sortBy("completionTime");

		return ranking;
	}, []);
	const getUnfinishedSudoku = useCallback(async (): Promise<Sudoku[]> => {
		// both win and lost are 0
		const unfinishedSudoku = await db.sudoku
			.where("win")
			.equals(0)
			.and((sudoku) => sudoku.lost === 0)
			.toArray();

		return unfinishedSudoku;
	}, []);

	const ranking = getRanking();
	const createSudoku = async (
		board: Board,
		difficulty: number,
	): Promise<Sudoku> => {
		const newSudoku: Sudoku = {
			id: crypto.randomUUID(),
			difficulty: difficulty,
			completionTime: {
				diff: new Date(),
				string: "0:00",
			},
			board,
			timeStarted: new Date(),
			timeFinished: null,
			lives: 3,
			win: 0,
			lost: 0,
		};

		await db.sudoku.add(newSudoku);

		return newSudoku;
	};

	const getStats = async () => {
		// return stats about your games (win streak, win %, average time, etc)

		const allGames = await db.sudoku.toArray();
		const allWins = await db.sudoku.where("win").equals(1).toArray();
		const allLost = await db.sudoku.where("lost").equals(1).toArray();
		const allFinished = await db.sudoku
			.where("win")
			.equals(1)
			.or("lost")
			.equals(1)
			.toArray();
		const allUnfinished = await db.sudoku
			.where("win")
			.equals(0)
			.and((sudoku) => sudoku.lost === 0)
			.toArray();

		const winPercentage = (allWins.length / allFinished.length) * 100;

		return {
			allGames,
			allWins,
			allLost,
			allFinished,
			allUnfinished,
			winPercentage,
		};
	};

	return {
		putSudoku,
		saveBoard,
		deleteSudoku,
		getRanking,
		ranking,
		createSudoku,
		getSudoku,
		looseLife,
		getUnfinishedSudoku,
		getStats,
	};
};
