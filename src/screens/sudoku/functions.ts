// given a sudoku cell, returns the row
function returnRow(cell: number) {
	return Math.floor(cell / 9);
}

// given a sudoku cell, returns the column
function returnCol(cell: number) {
	return cell % 9;
}

// given a sudoku cell, returns the 3x3 block
function returnBlock(cell: number) {
	return Math.floor(returnRow(cell) / 3) * 3 + Math.floor(returnCol(cell) / 3);
}

// given a number, a row and a sudoku, returns true if the number can be placed in the row
function isPossibleRow(number: number, row: number, sudoku: number[]) {
	for (let i = 0; i <= 8; i++) {
		if (sudoku[row * 9 + i] === number) {
			return false;
		}
	}
	return true;
}

// given a number, a column and a sudoku, returns true if the number can be placed in the column
function isPossibleCol(number: number, col: number, sudoku: number[]) {
	for (let i = 0; i <= 8; i++) {
		if (sudoku[col + 9 * i] === number) {
			return false;
		}
	}
	return true;
}

// given a number, a 3x3 block and a sudoku, returns true if the number can be placed in the block
function isPossibleBlock(number: number, block: number, sudoku: number[]) {
	for (let i = 0; i <= 8; i++) {
		if (
			sudoku[
				Math.floor(block / 3) * 27 +
					(i % 3) +
					9 * Math.floor(i / 3) +
					3 * (block % 3)
			] === number
		) {
			return false;
		}
	}
	return true;
}

// given a cell, a number and a sudoku, returns true if the number can be placed in the cell
function isPossibleNumber(cell: number, number: number, sudoku: number[]) {
	const row = returnRow(cell);
	const col = returnCol(cell);
	const block = returnBlock(cell);
	return (
		isPossibleRow(number, row, sudoku) &&
		isPossibleCol(number, col, sudoku) &&
		isPossibleBlock(number, block, sudoku)
	);
}

// given a row and a sudoku, returns true if it's a legal row
function isCorrectRow(row: number, sudoku: number[]) {
	const rightSequence = new Array(1, 2, 3, 4, 5, 6, 7, 8, 9);
	const rowTemp = new Array();
	for (let i = 0; i <= 8; i++) {
		rowTemp[i] = sudoku[row * 9 + i];
	}
	rowTemp.sort();
	return rowTemp.join() === rightSequence.join();
}

// given a column and a sudoku, returns true if it's a legal column
function isCorrectCol(col: number, sudoku: number[]) {
	const rightSequence = new Array(1, 2, 3, 4, 5, 6, 7, 8, 9);
	const colTemp = new Array();
	for (let i = 0; i <= 8; i++) {
		colTemp[i] = sudoku[col + i * 9];
	}
	colTemp.sort();
	return colTemp.join() === rightSequence.join();
}

// given a 3x3 block and a sudoku, returns true if it's a legal block
function isCorrectBlock(block: number, sudoku: number[]) {
	const rightSequence = new Array(1, 2, 3, 4, 5, 6, 7, 8, 9);
	const blockTemp = new Array();
	for (let i = 0; i <= 8; i++) {
		blockTemp[i] =
			sudoku[
				Math.floor(block / 3) * 27 +
					(i % 3) +
					9 * Math.floor(i / 3) +
					3 * (block % 3)
			];
	}
	blockTemp.sort();
	return blockTemp.join() === rightSequence.join();
}

// given a sudoku, returns true if the sudoku is solved
function isSolvedSudoku(sudoku: number[]) {
	for (let i = 0; i <= 8; i++) {
		if (
			!isCorrectBlock(i, sudoku) ||
			!isCorrectRow(i, sudoku) ||
			!isCorrectCol(i, sudoku)
		) {
			return false;
		}
	}
	return true;
}

// given a cell and a sudoku, returns an array with all possible values we can write in the cell
function determinePossibleValues(cell: number, sudoku: number[]) {
	const possible = new Array();
	for (let i = 1; i <= 9; i++) {
		if (isPossibleNumber(cell, i, sudoku)) {
			possible.unshift(i);
		}
	}
	return possible;
}

// given an array of possible values assignable to a cell, returns a random value picked from the array
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
function determineRandomPossibleValue(possible: any[], cell: number) {
	const options = possible[cell];
	if (!options || options.length === 0)
		throw new Error(`No possible values at cell ${cell}`);
	const randomPicked = Math.floor(Math.random() * options.length);
	return options[randomPicked];
}

// given a sudoku, returns a two dimension array with all possible values
function scanSudokuForUnique(sudoku: number[]) {
	const possible = new Array();
	for (let i = 0; i <= 80; i++) {
		if (sudoku[i] === 0) {
			possible[i] = new Array();
			possible[i] = determinePossibleValues(i, sudoku);
			if (possible[i].length === 0) {
				return false;
			}
		}
	}
	return possible;
}

// given an array and a number, removes the number from the array
function removeAttempt(attemptArray: number[], number: number) {
	const newArray = new Array();
	for (let i = 0; i < attemptArray.length; i++) {
		if (attemptArray[i] !== number) {
			newArray.unshift(attemptArray[i]);
		}
	}
	return newArray;
}

// given a two dimension array of possible values, returns the index of a cell where there are the less possible numbers to choose from
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
function nextRandom(possible: any[]) {
	let max = 9;
	let minChoices = 0;
	for (let i = 0; i <= 80; i++) {
		if (!possible) {
			continue;
		}
		if (possible[i] === undefined) {
			continue;
		}
		if (possible[i] !== undefined) {
			if (possible[i].length <= max && possible[i].length > 0) {
				max = possible[i].length;
				minChoices = i;
			}
		}
	}
	return minChoices;
}

export function generateBoard(s: number[]): number[] {
	let sudoku = s;
	const saved = new Array();
	const savedSudoku = new Array();
	let i = 0;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	let nextMove: any;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	let whatToTry: any;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	let attempt: any;
	while (!isSolvedSudoku(sudoku)) {
		i++;
		nextMove = scanSudokuForUnique(sudoku);
		if (nextMove === false) {
			nextMove = saved.pop();
			sudoku = savedSudoku.pop();
		}
		whatToTry = nextRandom(nextMove);
		attempt = determineRandomPossibleValue(nextMove, whatToTry);
		if (nextMove[whatToTry].length > 1) {
			nextMove[whatToTry] = removeAttempt(nextMove[whatToTry], attempt);
			saved.push(nextMove.slice());
			savedSudoku.push(sudoku.slice());
		}
		sudoku[whatToTry] = attempt;
	}
	return sudoku;
}
