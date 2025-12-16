import { AlertCircle, Play, Trash2 } from 'lucide-react';
import { Link } from 'react-router';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '~/components/ui/alert-dialog';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Skeleton } from '~/components/ui/skeleton';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table';
import { useUnfinishedGames } from '../application/use-unfinished-games';
import MiniSudoku from '../screens/mini-sudoku';
import HeartNav from './heart-nav';

export const UnfinishedGames = () => {
  const { data, isLoading, error, deleteGame } = useUnfinishedGames();

  if (isLoading) {
    return <UnfinishedGamesLoading />;
  }

  if (error) {
    return <UnfinishedGamesError error={error} />;
  }

  if (data.length === 0) {
    return null; // No mostrar la tarjeta si no hay juegos sin terminar
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Continue your last games</CardTitle>
        <CardDescription>No stress, your progress is saved automatically, continue whenever you're ready.</CardDescription>
      </CardHeader>
      <CardContent>


        <Table>
          <TableCaption>Continue your last games</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Play</TableHead>
              <TableHead>Preview</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Lives</TableHead>
              <TableHead>Difficulty</TableHead>
              <TableHead>Delete</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((game) => (
              <TableRow key={game.id}>
                <TableCell>
                  <Link to={`/sudoku/${game.id}`}>
                    <Button size="icon">
                      <Play className="text-xl" />
                    </Button>
                  </Link>
                </TableCell>
                <TableCell>
                  <MiniSudoku board={game.board} />
                </TableCell>
                <TableCell>{game.timeStarted.toLocaleString()}</TableCell>
                <TableCell>
                  <HeartNav lives={game.lives} size={15} />
                </TableCell>
                <TableCell>{game.difficulty}%</TableCell>
                <TableCell>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                      >
                        <Trash2 className="text-xl" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure you want to delete this game?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. Are you sure you want to delete the game started on {game.timeStarted.toLocaleString()}?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteGame(game)}>Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>



                </TableCell>
              </TableRow>
            ))}
          </TableBody>

        </Table>
      </CardContent>
    </Card>
  );
};

// Loading State Component
const UnfinishedGamesLoading = () => (
  <Card>
    <CardHeader>
      <Skeleton className="h-6 w-64" />
      <Skeleton className="h-4 w-96 mt-2" />
    </CardHeader>
    <CardContent className="space-y-3">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-16 w-full" />
      <Skeleton className="h-16 w-full" />
      <Skeleton className="h-16 w-full" />
    </CardContent>
  </Card>
);

// Error State Component
const UnfinishedGamesError = ({ error }: { error: Error }) => (
  <Card className="border-destructive">
    <CardHeader>
      <div className="flex items-center gap-2">
        <AlertCircle className="h-5 w-5 text-destructive" />
        <CardTitle>Failed to load unfinished games</CardTitle>
      </div>
      <CardDescription className="text-destructive">
        {error.message}
      </CardDescription>
    </CardHeader>
  </Card>
);
