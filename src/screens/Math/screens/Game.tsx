import { Button, IconButton } from "pol-ui";
import type { Operation } from "../types";
import { TbReload } from "react-icons/tb";

const Game = (props: {
	operation: Operation;
	onSubmit: (solutions: string) => void;
	time: number;
	reset: () => void;
}) => {
	const { operation, onSubmit, time } = props;

	return (
		<>
			<div>
				<IconButton
					className="absolute top-4 left-4"
					onClick={() => props.reset()}
				>
					<TbReload className="text-3xl" />
				</IconButton>
			</div>
			<h2 className="text-6xl font-bold z-10">{operation.operation}</h2>
			<ul className="grid grid-cols-4 gap-2 w-full z-10 max-w-3xl">
				{operation.solutions.map((o) => {
					return (
						<li key={o}>
							<Button
								style={{
									fontSize: 24,
								}}
								innerClassname="text-3xl w-full text-center flex justify-center"
								className="p-3 text-secondary-900 w-full text-center flex justify-center"
								onClick={() => onSubmit(o)}
							>
								{o}
							</Button>
						</li>
					);
				})}
			</ul>
			<div
				className="fixed top-0 right-0 w-full border-l border-primary transition-all h-full bg-primary/30 border-4"
				style={{
					// expand the bar as time goes by (from 0 to 100%) less time = more width
					width: `${100 - (time / 60) * 100}%`,
				}}
			/>
		</>
	);
};

export default Game;
