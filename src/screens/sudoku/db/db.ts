import Dexie, { type EntityTable } from "dexie";
import type { Sudoku } from "../sudoku-types";

const db = new Dexie("SudokuDB") as Dexie & {
	sudoku: EntityTable<
		Sudoku,
		"id" // primary key "id" (for the typings only)
	>;
};

// Schema declaration:
db.version(1).stores({
	sudoku: "++id, completionTime, win, lost",
});

export { db };
