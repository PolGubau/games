import { useEffect, useState } from "react";
import BoardLayout from "../../Layouts/BoardLayout";
import { generateOperations } from "./data";
import Game from "./screens/Game";
import MathIdlePage from "./screens/Idle";
import type { Operation, SolvedOperation } from "./types";

const def = {
	initialTime: 60,
};

export const MathPage = () => {
	return (
		<BoardLayout title="Math">
			<Board />
		</BoardLayout>
	);
};

export const useMath = () => {
	const [idx, setIdx] = useState<number>(-1);
	const [time, setTime] = useState<number>(0);

	const [operations, setOperations] = useState<Operation[]>([]);

	const [answered, setAnswered] = useState<SolvedOperation[]>([]);

	const currentOperation = operations[idx];

	const handleAnswer = (answer: string) => {
		//
		if (Number.isNaN(Number(answer))) {
			alert("Please enter a valid number");
			return;
		}
		if (!currentOperation) {
			console.error("No operation to solve");
			return;
		}
		const newAnswer: SolvedOperation = {
			...currentOperation,
			at: new Date(),
			answered: answer,
		};
		setAnswered((prev) => [...prev, newAnswer]);

		//
		setIdx((prev) => prev + 1);
	};

	const start = () => {
		setIdx(0);
		setOperations(generateOperations(100));
		setAnswered([]);
		setTime(def.initialTime);
	};
	useEffect(() => {
		if (operations.length - 1 === idx) {
			setIdx(-1);

			setTime(0);
		}
	}, [idx, operations]);

	useEffect(() => {
		if (time > 0) {
			const timeout = setTimeout(() => setTime(time - 1), 1000);
			return () => clearTimeout(timeout);
		}
	}, [time]);

	return { currentOperation, answered, start, handleAnswer, time };
};

export const Board = () => {
	const { currentOperation, time, start, handleAnswer, answered } = useMath();

	return (
		<section className="p-4 flex justify-center h-full flex-col gap-8 items-center">
			{!time ? (
				<MathIdlePage onStart={start} done={answered} />
			) : (
				<Game
					reset={start}
					operation={currentOperation as Operation}
					onSubmit={(o) => handleAnswer(o)}
					time={time}
				/>
			)}
		</section>
	);
};
