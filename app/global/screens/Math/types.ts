export type Operation = {
  operation: string;
  correct: string;
  solutions: string[];
};

export type SolvedOperation = Operation & {
  at: Date;
  answered: string;
};
