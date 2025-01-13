import { Operation } from "./types";

export const staticOperations: Operation[] = [
  {
    operation: "2+2",
    correct: "4",
    solutions: ["4", "2", "1", "12"],
  },
  {
    operation: "3+1",
    correct: "4",
    solutions: ["4", "2", "5", "1"],
  },
  {
    operation: "2+1",
    correct: "3",
    solutions: ["3", "2", "5", "1"],
  },
  {
    operation: "2+4",
    correct: "6",
    solutions: ["3", "2", "5", "1"],
  },
  {
    operation: "2+3",
    correct: "5",
    solutions: ["3", "2", "5", "1"],
  },
  {
    operation: "2-1",
    correct: "1",
    solutions: ["3", "2", "5", "1"],
  },
  {
    operation: "2*4",
    correct: "8",
    solutions: ["8", "2", "5", "1"],
  },
  {
    operation: "4*0.5",
    correct: "2",
    solutions: ["3", "2", "5", "1"],
  },
  {
    operation: "1*0.5",
    correct: "0.5",
    solutions: ["0.5", "2", "5", "1"],
  },
  {
    operation: "2*0.5",
    correct: "1",
    solutions: ["0.5", "2", "5", "1"],
  },
  {
    operation: "3*0.5",
    correct: "1.5",
    solutions: ["0.5", "2", "1.5", "1"],
  },
  {
    operation: "3*5",
    correct: "15",
    solutions: ["50", "3", "15", "10"],
  },
  {
    operation: "3/3",
    correct: "1",
    solutions: ["3", "1", "5", "0"],
  },
  {
    operation: "1/3",
    correct: "0.33",
    solutions: ["0.33", "1", "2.3", "1.5"],
  },
  {
    operation: "1/3",
    correct: "0.33",
    solutions: ["0.33", "1", "2.3", "1.5"],
  },
];
