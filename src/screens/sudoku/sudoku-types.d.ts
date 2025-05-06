export interface Cell {
	value: number;
	isLocked: boolean;
}
type Row = Cell[];
type Board = Row[];

export type Sudoku = {
	id: string;
	difficulty: number;
	completionTime: Date | null;
	board: Board;
	timeStarted: Date;
	timeFinished: Date | null;
	lives: number;
	difficulty: number;
	win: 0 | 1;
	lost: 0 | 1;
};
