import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '~/components/ui/table';
import { useSudokuRanking } from '../application/use-ranking';
import { Item, ItemContent, ItemDescription, ItemTitle } from '~/components/ui/item';
import { Slider } from '@radix-ui/react-slider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import MiniSudoku from '../screens/mini-sudoku';
import HeartNav from '../components/heartNav';


export const SudokuRanking = () => {
  const { ranking } = useSudokuRanking();
  return (

    <Card>
      <CardHeader>
        <CardTitle>Your Ranking</CardTitle>
        <CardDescription>Thanks for playing!</CardDescription>
      </CardHeader>
      <CardContent>


        <Table>
          <TableCaption>Your previous games</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Played Date</TableHead>
              <TableHead>Completion Time</TableHead>
              <TableHead>Difficulty</TableHead>
              <TableHead>Remaining lives</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ranking.map((game) => (
              <TableRow key={game.id}>

                <TableCell>{new Date(game.timeStarted).toLocaleDateString()}</TableCell>
                <TableCell>{game.completionTime.string}</TableCell>
                <TableCell>
                  <span>
                    {game.difficulty}
                  </span>
                  <span className='text-muted-foreground'>%</span>

                </TableCell>
                <TableCell>
                  <HeartNav lives={game.lives} size={15} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>Total</TableCell>
              <TableCell>
                {ranking.length} games played
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </CardContent>
    </Card>

  )
}
