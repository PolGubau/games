import type { Operation } from "./types";

/**
 * Genera un array de operaciones matemáticas únicas.
 * @param count Número de operaciones a generar
 * @returns Array de operaciones
 */
export function generateOperations(count: number): Operation[] {
	const ops = ["+", "-", "*", "/"];
	const generated = new Set<string>();
	const result: Operation[] = [];

	while (result.length < count) {
		const a = Math.floor(Math.random() * 5) + 2;
		const b = Math.floor(Math.random() * 6) + 1;
		const op = ops[Math.floor(Math.random() * ops.length)];

		if (op === "/" && (b === 0 || a % b !== 0)) continue;

		const expr = `${a}${op}${b}`;
		if (generated.has(expr)) continue;

		// biome-ignore lint/security/noGlobalEval: <explanation>
		const correct = eval(expr).toString();
		const falseAnswers = new Set<string>();

		while (falseAnswers.size < 3) {
			const delta = Math.floor(Math.random() * 21) - 10;
			const wrong = (Number.parseInt(correct) + delta).toString();
			if (wrong !== correct) falseAnswers.add(wrong);
		}

		const all = Array.from(falseAnswers)
			.concat(correct)
			.sort(() => Math.random() - 0.5);

		generated.add(expr);
		result.push({
			operation: expr,
			correct,
			solutions: all,
		});
	}

	return result;
}
