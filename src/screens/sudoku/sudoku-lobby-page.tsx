import { useEffect, useState } from "react";
import BoardLayout from "../../Layouts/BoardLayout";
import { useSudokuPersistence } from "./hooks/use-persistence";
import { useSudoku } from "./hooks/use-sudoku";
import SudokuLobby from "./screens/sudoku-lobby";
import type { Sudoku } from "./sudoku-types";
import { IconButton } from "pol-ui";
import { TbPlayerPlay, TbTrash } from "react-icons/tb";
import { Link } from "react-router-dom";
import MiniSudoku from "./screens/mini-sudoku";

const BoardComponent = () => {
	const { generateBoardCells } = useSudoku();
	const { getRanking, getUnfinishedSudoku, deleteSudoku } =
		useSudokuPersistence();
	const [ranking, setRanking] = useState<Sudoku[]>([]);
	const [unfinishedSudoku, setUnfinishedSudoku] = useState<Sudoku[]>([]);
	useEffect(() => {
		const fetchRanking = async () => {
			const ranking = await getRanking();
			setRanking(ranking);
		};
		fetchRanking();
	}, [getRanking]);

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
		<section>
			<SudokuLobby onStart={generateBoardCells} />

			{unfinishedSudoku.length > 0 && (
				<div className="flex flex-col gap-4 items-center justify-center p-4 border-t border-secondary/50 mx-6 mt-10 overflow-x-auto ">
					<h3 className="text-xl md:text-2xl text-center ">
						Continue your last games
					</h3>
					<table cellSpacing={5} cellPadding={10}>
						<tr>
							<th className="px-4 py-1 text-start">Preview</th>
							<th className="px-4 py-1 text-start">Time</th>
							<th className="px-4 py-1 text-start">Lives</th>
							<th className="px-4 py-1 text-start">Difficulty</th>
							<th className="px-4 py-1 text-start">Continue</th>
							<th className="px-4 py-1 text-start">Delete</th>
						</tr>
						{unfinishedSudoku.map((item, index) => {
							const lives = item.lives === 1 ? "1 Life" : `${item.lives} Lives`;
							const difficulty = `${item.difficulty}%`;
							return (
								<tr
									// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
									key={index}
								>
									<td className="py-1">
										<MiniSudoku board={item.board} />
									</td>
									<td className="px-4 py-1 text-start">
										{item.timeStarted.toLocaleString()}
									</td>
									<td className="px-4 py-1 text-start">{lives}</td>
									<td className="px-4 py-1 text-start">{difficulty}</td>
									<td className="px-4 py-1 text-start">
										<Link to={`/sudoku/${item.id}`}>
											<IconButton className="text-2xl">
												<TbPlayerPlay className="text-2xl" />
											</IconButton>
										</Link>
									</td>
									<td className="px-4 py-1 text-start">
										<IconButton
											color="error"
											className="text-2xl"
											onClick={() => handleDeleteSudokuAndRefresh(item)}
										>
											<TbTrash className="text-2xl" />
										</IconButton>
									</td>
								</tr>
							);
						})}
					</table>
				</div>
			)}
			{ranking.length > 0 && (
				<div className="flex flex-col gap-4 items-center justify-center p-4 border-t border-secondary/50 mx-6 mt-10 overflow-x-auto">
					<h3 className="text-2xl md:text-3xl max-w-[800px] text-center font-bold ">
						Ranking
					</h3>
					<ul className="flex flex-col gap-2">
						<div className="text-xl grid grid-cols-3 gap-6 items-center font-bold">
							<span>Time</span>
							<span>Lives</span>
							<span className="flex gap-2 items-center">
								<span className="max-md:hidden">Difficulty</span>
							</span>
						</div>
						{ranking.map((item, index) => {
							const timeUsed = new Date(
								// biome-ignore lint/style/noNonNullAssertion: <explanation>
								item.completionTime!,
							).toLocaleString();

							const lives = item.lives === 1 ? "1 Life" : `${item.lives} Lives`;
							const difficulty = `${item.difficulty}%`;
							return (
								<li
									// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
									key={index}
									className="text-xl grid grid-cols-3 gap-4 items-center"
								>
									<span>{timeUsed}</span>
									<span>{lives}</span>
									<span>{difficulty}</span>
								</li>
							);
						})}
					</ul>
				</div>
			)}
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
