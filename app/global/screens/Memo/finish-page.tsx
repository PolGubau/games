import ConfettiExplosion from "react-confetti-explosion";
import { motion } from "motion/react";
import { RotateCcw, ArrowLeft } from "lucide-react";
import { Link } from "react-router";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/ui/tooltip";

interface Props {
	onReset: () => void;
	hintsUsed: number;
	time: number;
}
const FinishPage: React.FC<Props> = ({ onReset, hintsUsed, time }) => {
	return (
		<div className="flex flex-col items-center  gap-8 p-8 mt-20 text-center">
			<ConfettiExplosion />
			<h1 className="text-7xl sm:text-7xl font-semibold text-center">You win!</h1>

			{Boolean(time) && <p>You finished in {time} seconds.</p>}
			{Boolean(hintsUsed) && (
				<p>
					You used {hintsUsed} hint{hintsUsed > 1 && "s"}.
				</p>
			)}

			<div className="flex gap-4 justify-center">
				<Tooltip label="Return home (the game won't be saved)">
					<Link to={"/"}>
						<motion.button
							layoutId="backButton"
							whileHover={{
								scale: 1.1,
								rotate: -10,
							}}
							whileTap={{
								scale: 0.9,
							}}
							className=" bg-primary-900 text-primary-50 rounded-full text-4xl p-4 focus-visible:ring-4 focus-visible:ring-offset-4 focus-visible:ring-primary-700 focus-visible:ring-offset-secondary-50 focus:outline-none flex justify-center items-center"
						>
							<ArrowLeft />
						</motion.button>
					</Link>
				</Tooltip>
				<Tooltip label="Reset the game">
					<motion.button
						layoutId="resetButton"
						whileHover={{
							rotate: -10,
							scale: 1.1,
						}}
						whileTap={{
							scale: 0.9,
							rotate: -360,
						}}
						whileFocus={{
							scale: 1.1,
							rotate: -20,
						}}
						onClick={onReset}
						className="aspect-square  bg-primary-900 text-primary-50 rounded-full text-4xl p-4 focus-visible:ring-4 focus-visible:ring-offset-4 focus-visible:ring-primary-700 focus-visible:ring-offset-secondary-50 focus:outline-none flex justify-center items-center"
					>
						<RotateCcw />
					</motion.button>
				</Tooltip>
			</div>
		</div>
	);
};

export default FinishPage;
