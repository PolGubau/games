import { Play, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import BoardLayout from "../../Layouts/BoardLayout";
import { useSudokuPersistence } from "./hooks/use-persistence";
import { useSudoku } from "./hooks/use-sudoku";
import MiniSudoku from "./screens/mini-sudoku";
import SudokuLobby from "./screens/sudoku-lobby";
import type { Sudoku } from "./sudoku-types";
import { Button } from "~/components/ui/button";
import { SudokuRanking } from "./ui/ranking";

const BoardComponent = () => {
	const { generateBoardCells } = useSudoku();
	const { getRanking, getUnfinishedSudoku, deleteSudoku } = useSudokuPersistence();
	const [ranking, setRanking] = useState<Sudoku[]>([]);
	const [unfinishedSudoku, setUnfinishedSudoku] = useState<Sudoku[]>([]);


	useEffect(() => {
		const fetchUnfinishedSudoku = async () => {
			const sudoku = await getUnfinishedSudoku();
			setUnfinishedSudoku(sudoku);
		};
		fetchUnfinishedSudoku();
	}, [getUnfinishedSudoku]);

	const handleDeleteSudokuAndRefresh = async (sudoku: Sudoku) => {
		await deleteSudoku(sudoku);
		const updatedUnfinishedSudoku = await getUnfinishedSudoku();
		setUnfinishedSudoku(updatedUnfinishedSudoku);
	};
	return (
		<section className="flex flex-col gap-8 w-full">
			<SudokuLobby onStart={generateBoardCells} />

			{unfinishedSudoku.length > 0 && (
				<div className="text-sm flex flex-col gap-4 p-4 border-t border-secondary/50 md:mx-6 mt-10 overflow-x-auto ">
					<h3 className="text-lg md:text-xl">Continue your last games</h3>
					<table cellSpacing={5} cellPadding={10}>
						<tr>
							<th className="px-2 py-1 text-start">Play</th>
							<th className="px-2 py-1 text-start max-sm:hidden">Preview</th>
							<th className="px-2 py-1 text-start">Time</th>
							<th className="px-2 py-1 text-start max-sm:hidden">Lives</th>
							<th className="px-2 py-1 text-start">Difficulty</th>
							<th className="px-2 py-1 text-start">Delete</th>
						</tr>
						{unfinishedSudoku.map((item, index) => {
							const lives = item.lives === 1 ? "1 Life" : `${item.lives} Lives`;
							const difficulty = `${item.difficulty}%`;
							return (
								<tr
									// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
									key={index}
								>
									<td className="px-2 py-1 text-start">
										<Link to={`/sudoku/${item.id}`}>
											<Button size="icon">
												<Play className="text-xl" />
											</Button>
										</Link>
									</td>
									<td className="py-1 max-sm:hidden">
										<MiniSudoku board={item.board} />
									</td>
									<td className="px-2 py-1 text-start">{item.timeStarted.toLocaleString()}</td>
									<td className="px-2 py-1 text-start max-sm:hidden">{lives}</td>
									<td className="px-2 py-1 text-start">{difficulty}</td>

									<td className="px-2 py-1 text-start">
										<Button size="icon"
											color="error"
											onClick={() => handleDeleteSudokuAndRefresh(item)}
										>
											<Trash2 className="text-xl" />
										</Button>
									</td>
								</tr>
							);
						})}
					</table>
				</div>
			)}
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
