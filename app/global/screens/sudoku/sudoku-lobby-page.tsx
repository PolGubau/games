import BoardLayout from "../../Layouts/BoardLayout";
import { useSudoku } from "./hooks/use-sudoku";
import SudokuLobby from "./screens/sudoku-lobby";
import { SudokuRanking } from "./ui/ranking";
import { UnfinishedGames } from "./ui/unfinished-games";

const BoardComponent = () => {
	const { generateBoardCells } = useSudoku();


	return (
		<section className="flex flex-col gap-8 w-full overflow-x-hidden">
			<SudokuLobby onStart={generateBoardCells} />
			<UnfinishedGames />
			<SudokuRanking />
		</section>
	);
};

const SudokuPage = () => {
	return (
		<BoardLayout title="Sudoku">
			<BoardComponent />
		</BoardLayout>
	);
};

export default SudokuPage;
