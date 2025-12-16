import { AlertCircle, Trophy } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Skeleton } from '~/components/ui/skeleton';
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '~/components/ui/table';
import { useRanking } from '../application/use-ranking';
import HeartNav from './heart-nav';

export const SudokuRanking = () => {
  const { data, isLoading, error } = useRanking();

  if (isLoading) {
    return <RankingLoading />;
  }

  if (error) {
    return <RankingError error={error} />;
  }

  if (data.length === 0) {
    return <RankingEmpty />;
  }

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
            {data.map((game, index) => (
              <TableRow key={game.id}>
                <TableCell>
                  {index < 3 && (
                    <Trophy className={`inline-block mr-2 h-4 w-4 ${index === 0 ? 'text-yellow-500' :
                      index === 1 ? 'text-gray-400' :
                        'text-amber-600'
                      }`} />
                  )}
                  {new Date(game.timeStarted).toLocaleDateString()}
                </TableCell>
                <TableCell className="font-mono">{game.completionTime.string}</TableCell>
                <TableCell>
                  <span>{game.difficulty}</span>
                  <span className='text-muted-foreground'>%</span>
                </TableCell>
                <TableCell>
                  <HeartNav lives={game.lives} size={15} />
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
const RankingLoading = () => (
  <Card>
    <CardHeader>
      <Skeleton className="h-6 w-48" />
      <Skeleton className="h-4 w-64 mt-2" />
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
const RankingError = ({ error }: { error: Error }) => (
  <Card className="border-destructive">
    <CardHeader>
      <div className="flex items-center gap-2">
        <AlertCircle className="h-5 w-5 text-destructive" />
        <CardTitle>Failed to load ranking</CardTitle>
      </div>
      <CardDescription className="text-destructive">
        {error.message}
      </CardDescription>
    </CardHeader>
  </Card>
);

// Empty State Component
const RankingEmpty = () => (
  <Card>
    <CardHeader>
      <CardTitle>Your Ranking</CardTitle>
      <CardDescription>Complete your first game to see your ranking!</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Trophy className="h-16 w-16 text-muted-foreground mb-4" />
        <p className="text-lg font-medium text-muted-foreground">No games completed yet</p>
        <p className="text-sm text-muted-foreground mt-2">Start a new game above to build your ranking!</p>
      </div>
    </CardContent>
  </Card>
);
