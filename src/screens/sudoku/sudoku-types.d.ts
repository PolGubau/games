export interface Cell {
  value: number;
  isLocked: boolean;
}
type Row = Cell[];
type Board = Row[];
