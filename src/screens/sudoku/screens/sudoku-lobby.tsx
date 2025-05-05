import { motion } from "framer-motion";
import { Button, Tooltip } from "pol-ui";
import { useState } from "react";
import { PiArrowLeftBold } from "react-icons/pi";
import { Link } from "react-router-dom";
import type { GenerateBoardCells } from "../hooks/use-sudoku";
interface Props {
	onStart: GenerateBoardCells;
}

const SudokuLobby: React.FC<Props> = ({ onStart }: Props) => {
	const [difficulty, setDifficulty] = useState<number>(50);
	return (
		<div className="p-4 pt-8 flex flex-col gap-8 items-center h-auto justify-between md:justify-center ">
			<div className="flex flex-col gap-2 justify-center w-full max-w-[500px] text-center">
				<h3 className="text-3xl md:text-5xl max-w-[600px]">
					Are you ready to beat the sudoku?🧐
				</h3>
				<div className="flex flex-col justify-center w-full pt-8">
					<label htmlFor="difficulty" className="text-lg md:text-xl">
						How hard do you want it to be? 😈
					</label>
					<nav className="grid grid-cols-[1fr,auto] gap-2 items-center">
						<input
							type="range"
							min="0"
							id="difficulty"
							name="difficulty"
							max="100"
							value={difficulty}
							className="w-full max-w-[500px]"
							onChange={(e) => {
								setDifficulty(Number(e.target.value));
							}}
							step="1"
						/>

						<span>{difficulty} %</span>
					</nav>
				</div>
			</div>
			<div className="gap-2 w-full max-w-[600px] grid grid-cols-[auto,1fr] items-center">
				<Tooltip label="Return home (the game won't be saved)">
					<motion.div
						className="w-full flex flex-1"
						layoutId="backButton"
						whileHover={{
							scale: 1.1,
							rotate: -5,
						}}
						whileTap={{
							scale: 0.9,
						}}
					>
						<Link
							to={"/"}
							className="aspect-square  bg-primary-900 text-primary-50 rounded-full text-4xl p-4 focus-visible:ring-4 focus-visible:ring-offset-4 focus-visible:ring-primary-700 focus-visible:ring-offset-secondary-50 focus:outline-none flex justify-center items-center  h-[70px]"
						>
							<PiArrowLeftBold />
						</Link>
					</motion.div>
				</Tooltip>

				<Button
					autoFocus
					onClick={() => onStart(difficulty)}
					fullSized
					className="bg-primary-900 rounded-full text-primary-50 text-4xl p-4 flex flex-1 h-[70px]"
				>
					Start
				</Button>
			</div>
		</div>
	);
};

export default SudokuLobby;
