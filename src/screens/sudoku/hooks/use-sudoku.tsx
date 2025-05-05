import { useLiveQuery } from "dexie-react-hooks";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../db/db";
import { generateBoard } from "../functions";
import type { Cell, Row, Sudoku } from "../sudoku-types";
import { useSudokuPersistence } from "./use-persistence";
export type GenerateBoardCells = (difficulty: number) => Promise<void>;
const COLS = 9;
const ROWS = 9;
const MIN_SHOWED_CELLS = 17;
const MAX_SHOWED_CELLS = 81;
const TOTAL_CELLS = COLS * ROWS;
const emptyCeros = new Array(TOTAL_CELLS).fill(0);

export const useSudoku = () => {
	const params = useParams();
	const navigate = useNavigate();

	const id = params.id ?? "";

	const { saveBoard, createSudoku, looseLife } = useSudokuPersistence();

	const sudoku = useLiveQuery(
		() => db.sudoku.where("id").equals(id).first(),
		[id],
	);

	const [result, setResult] = useState<Cell["value"][]>(emptyCeros);

	const lockedAmount =
		sudoku?.board?.flat().filter((cell) => cell.isLocked).length || 0;
	const emptyCells = TOTAL_CELLS - lockedAmount;

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (!sudoku || sudoku.win || sudoku.lost) return;

		const handleDone = async (didWin: boolean) => {
			const finishedTime = new Date();
			const startedTime = sudoku.timeStarted || new Date();
			const doneInTime = calculateTimeDiff(startedTime, finishedTime).diff;

			const newFields: Partial<Sudoku> = {
				win: didWin ? 1 : 0,
				lost: didWin ? 0 : 1,
				completionTime: doneInTime,
				timeFinished: finishedTime,
			};
			await db.sudoku.update(id, newFields);
		};

		if (emptyCells === 0) handleDone(true);
		if (sudoku.lives === 0) handleDone(false);
	}, [emptyCells, sudoku?.lives, sudoku?.win, sudoku?.lost]);

	const generateBoardCells: GenerateBoardCells = async (difficulty) => {
		// flatted array with the values of the board in correct order
		const board = generateBoard(emptyCeros);

		const boardWithHoles: Cell[] = board.map((cell: number) => {
			// use difficulty as a scale to determine if the cell is locked or not
			// the max difficulty is 100, the min is 0
			// the max possible amount of empty cells is MAX_SHOWED_CELLS
			// the min possible amount of empty cells is MIN_SHOWED_CELLS

			const difficultyPercent = difficulty / 100;

			const scale = Math.floor(
				(MAX_SHOWED_CELLS - MIN_SHOWED_CELLS) * difficultyPercent +
					MIN_SHOWED_CELLS,
			);
			const isLocked = Math.random() * 100 > scale;

			return {
				value: cell,
				isLocked,
			};
		});

		const rows: Row[] = boardWithHoles.reduce(
			(rows: Row[], cell: Cell, index: number) => {
				const row = Math.floor(index / ROWS);
				rows[row] = rows[row] || [];
				rows[row].push(cell);
				return rows;
			},
			[],
		);

		const sudoku: Sudoku = await createSudoku(rows, difficulty);

		// save the sudoku to the local storage
		navigate(`/sudoku/${sudoku.id}`);
	};

	const handleCheckCell = ({
		sudoku,
		value,
		cellRow,
		cellColumn,
	}: {
		sudoku: Sudoku;
		value: number;
		cellRow: number;
		cellColumn: number;
	}) => {
		const { board } = sudoku;
		// check from the result array if the value is correct
		const correctValue = result[cellRow * ROWS + cellColumn];

		if (value !== correctValue) {
			looseLife(sudoku.id);
		} else {
			// update the board
			const newBoard = [...board];
			newBoard[cellRow][cellColumn].isLocked = true;
			saveBoard(sudoku.id, newBoard);
		}
	};

	const resetGame = () => {
		setResult(emptyCeros);
	};

	const percentDone = Math.floor((emptyCells / TOTAL_CELLS) * 100);

	const timeUsed =
		sudoku?.timeStarted &&
		sudoku?.timeFinished &&
		calculateTimeDiff(sudoku.timeStarted, sudoku.timeFinished);

	return {
		sudoku,
		generateBoardCells,
		handleCheckCell,
		timeUsed: String(timeUsed),
		percentDone,
		resetGame,
		lives: sudoku?.lives,
	};
};

// fns
export const calculateTimeDiff = (timeStarted: Date, timeFinished: Date) => {
	const diff = timeFinished.getTime() - timeStarted.getTime();
	const diffDate = new Date(diff);
	let minutes = Math.floor(diff / 1000 / 60);
	let seconds = Math.floor((diff / 1000) % 60);
	let hours = Math.floor(minutes / 60);

	minutes = minutes % 60;
	seconds = seconds % 60;
	hours = hours % 24;

	const string = `${hours ? `${hours}h ` : ""}${
		minutes ? `${minutes}m ` : ""
	}${seconds}s`;
	return { string, diff: diffDate };
};
