import { useEffect } from "react";
import { tilesData } from "./data";
import { motion } from "framer-motion";
import { twMerge } from "tailwind-merge";
import {
	PiArrowCounterClockwiseBold,
	PiArrowLeftBold,
	PiLightbulbBold,
} from "react-icons/pi";
import { TbQuestionMark } from "react-icons/tb";
import { useMemo } from "./use-memo";
import FinishPage from "./finish-page";
import { Link } from "react-router-dom";
import { Tooltip } from "pol-ui";
import BoardLayout from "../../Layouts/BoardLayout";

// Each tile has an icon and a pastel color

export interface Tile {
	id: string;
	icon: JSX.Element;
	color: string;
}
export type TileId = Tile["id"];

const MemoPage = () => {
	return (
		<BoardLayout title="Memo">
			<Board />
		</BoardLayout>
	);
};

const Board = () => {
	const {
		guessed,
		selected,
		win,
		hint,
		handleReset,
		getHint,
		isVisible,
		setSelected,
		setHint,
		hintsUsed,
		time,
	} = useMemo();
	const list = {
		visible: {
			opacity: 1,
			transition: {
				when: "beforeChildren",
				staggerChildren: 0.03,
			},
		},
		hidden: {
			opacity: 0,
			transition: {
				when: "afterChildren",
			},
		},
	};
	const cardsLen = tilesData.length; // 20
	const rowLen = 5; // 5
	const item = {
		visible: { opacity: 1, y: 0 },
		hidden: { opacity: 0, y: 20 },
	};

	const specs = (tile: Tile, idx: number) => {
		const tileId = tile.id;

		const baseSpecs = {
			baseClassname:
				"flex  items-center justify-center p-4 md:p-6 lg:p-8 text-primary-900 transition-all flex-1 max-w-[150px]",
			firstCard: "rounded-ss-2xl",
			lastOfFirstRow: "rounded-se-2xl",
			firstOfLastRow: "rounded-es-2xl",
			lastCard: "rounded-ee-2xl",
		};

		const alwaysClasses = twMerge(
			idx === 0 && baseSpecs.firstCard,
			idx === rowLen - 1 && baseSpecs.lastOfFirstRow,
			idx === cardsLen - rowLen && baseSpecs.firstOfLastRow,
			idx === cardsLen - 1 && baseSpecs.lastCard,
			baseSpecs.baseClassname,
		);

		if (isVisible(tileId))
			return {
				...baseSpecs,
				disabled: true,
				className: twMerge(baseSpecs.baseClassname, alwaysClasses),
			};

		return {
			...baseSpecs,
			rotateY: 180,
			key: tile.id,
			whileHover: { scale: 0.95, transition: { duration: 0.1 } },
			whileTap: { scale: 0.9, transition: { duration: 0.1 } },
			className: twMerge(
				"focus:outline-none focus-visible:ring-4 focus-visible:ring-offset-4 focus-visible:ring-primary-700 focus-visible:ring-offset-secondary-50 bg-secondary focus:bg-secondary-700 text-secondary-800",
				alwaysClasses,
				baseSpecs.baseClassname,
			),

			onKeyDown: (e: React.KeyboardEvent<HTMLButtonElement>) => {
				if (e.key === "Enter") {
					setSelected([...selected, tileId]);
				}
			},
			onClick: () => selected.length < 2 && setSelected([...selected, tileId]),
		};
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		const timeout = setTimeout(() => {
			// delete the first element of the array (oldest hint)
			setHint((prev) => prev.slice(1));
		}, 200);
		return () => clearTimeout(timeout);
	}, [hint]);

	const isThisTileHinted = (id: TileId) =>
		hint.includes(id) || hint.includes(`${id}-copy`);

	if (win)
		return (
			<FinishPage onReset={handleReset} hintsUsed={hintsUsed} time={time} />
		);

	return (
		<main className="p-8 flex flex-col gap-8 items-center justify-center">
			<section className="flex gap-8 flex-col sm:flex-row h-full w-full justify-center">
				<div className="flex sm:flex-col gap-4 sm:items-center items-center sm:justify-between sticky top-0 h-auto">
					<nav className="flex sm:flex-col gap-4 items-center">
						<p className="flex justify-center items-end">
							<span className="text-4xl"> {guessed.length / 2}</span>
							<span>/ {tilesData.length / 2}</span>
						</p>
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
									className=" bg-primary-900 text-primary-50 rounded-full md:text-4xl p-4 focus-visible:ring-4 focus-visible:ring-offset-4 focus-visible:ring-primary-700 focus-visible:ring-offset-secondary-50 focus:outline-none flex justify-center items-center"
								>
									<PiArrowLeftBold />
								</motion.button>
							</Link>
						</Tooltip>{" "}
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
								onClick={handleReset}
								className="aspect-square  bg-primary-900 text-primary-50 rounded-full md:text-4xl p-4 focus-visible:ring-4 focus-visible:ring-offset-4 focus-visible:ring-primary-700 focus-visible:ring-offset-secondary-50 focus:outline-none flex justify-center items-center"
							>
								<PiArrowCounterClockwiseBold />
							</motion.button>{" "}
						</Tooltip>
						<Tooltip label="Get a hint">
							<motion.button
								layoutId="hintButton"
								whileHover={{
									rotate: -10,
									scale: 1.1,
								}}
								whileTap={{
									scale: 0.9,
								}}
								whileFocus={{
									scale: 1.1,
									rotate: -20,
								}}
								onClick={getHint}
								className="aspect-square bg-primary-900 text-primary-50 rounded-full md:text-4xl p-4 focus-visible:ring-4 focus-visible:ring-offset-4 focus-visible:ring-primary-700 focus-visible:ring-offset-secondary-50 focus:outline-none flex justify-center items-center"
							>
								<PiLightbulbBold />
							</motion.button>
						</Tooltip>
					</nav>
					{hintsUsed > 0 && (
						<p className="md:flex hidden text-xl">
							<span>
								{hintsUsed} hint{hintsUsed > 1 && "s"}
							</span>
						</p>
					)}
				</div>
				<motion.ul
					initial="hidden"
					animate="visible"
					variants={list}
					className="grid grid-cols-5 w-fit gap-0.5 xl:gap-2 p-1 h-full "
				>
					{tilesData.map((tile, idx) => {
						return (
							<motion.button
								key={tile.id}
								onKeyDown={(e) => {
									if (e.key === "Enter") {
										setSelected([...selected, tile.id]);
									}
								}}
								variants={item}
								{...specs(tile, idx)}
								style={{
									backgroundColor: isVisible(tile.id)
										? tile.color
										: isThisTileHinted(tile.id)
											? "rgba(255, 255, 255, 0.5)"
											: undefined,
								}}
							>
								<div className="opacity-70 text-4xl md:text-5xl lg:text-6xl xl:text-7xl ">
									{isVisible(tile.id) ? tile.icon : <TbQuestionMark />}
								</div>
							</motion.button>
						);
					})}
				</motion.ul>
			</section>
		</main>
	);
};

export default MemoPage;
