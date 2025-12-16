import ConfettiExplosion from "react-confetti-explosion";
import { Link } from "react-router";
import { GoHomeButton } from "~/components/go-home-button";
import { buttonVariants } from "~/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
interface Props {
  timeUsed: string | undefined;
  difficulty: number;
}

const SudokuWin: React.FC<Props> = ({ timeUsed, difficulty }) => {
  return (
    <div className="flex flex-col">
      <Card>
        <CardHeader>
          <CardTitle>Congratulations! 🎉</CardTitle>
          <CardDescription>{`You beat the sudoku 
          ${timeUsed ? `in ${timeUsed}!` : ""}
          with a difficulty of ${difficulty}%`}</CardDescription>
        </CardHeader>
        <CardContent>


        </CardContent>
        <CardFooter>
          <CardAction>
            <GoHomeButton />
          </CardAction>
          <CardAction>
            <Link to="/sudoku/" className={buttonVariants({ variant: "default" })}>Play again</Link>
          </CardAction>
        </CardFooter>
      </Card>

      <ConfettiExplosion />

    </div>
  );
};

export default SudokuWin;
