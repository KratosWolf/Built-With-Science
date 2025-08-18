import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { mockPrograms, mockProgramDays, getProgramById, getProgramDays } from '@/lib/mock-data/workout-data';
import { notFound } from 'next/navigation';

interface ProgramDetailPageProps {
  params: { id: string };
}

export default function ProgramDetailPage({ params }: ProgramDetailPageProps) {
  const programId = parseInt(params.id);
  const program = getProgramById(programId);
  const programDays = getProgramDays(programId);

  if (!program) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="outline" asChild>
            <Link href="/programs">← Back to Programs</Link>
          </Button>
        </div>
        
        <h1 className="text-3xl font-bold mb-2">{program.name}</h1>
        <p className="text-gray-600">
          {programDays.length} workout days designed for optimal muscle development and strength gains.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {programDays.map((day) => (
          <Card key={day.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Day {day.day_index}</span>
                <span className="text-sm font-normal bg-green-100 text-green-800 px-2 py-1 rounded">
                  Ready
                </span>
              </CardTitle>
              <CardDescription className="text-lg font-medium">
                {day.day_name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-sm text-gray-600">
                  {day.day_name.includes('Full Body') && "Complete full body workout targeting all major muscle groups"}
                  {day.day_name.includes('Upper') && "Upper body focus: chest, back, shoulders, and arms"}
                  {day.day_name.includes('Lower') && "Lower body focus with emphasis on specified muscle groups"}
                  {day.day_name.includes('Push') && "Push movements: chest, shoulders, triceps"}
                  {day.day_name.includes('Pull') && "Pull movements: back, biceps, rear delts"}
                </div>
                
                <Button asChild className="w-full">
                  <Link href={`/programs/${programId}/days/${day.id}`}>
                    Start Workout
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-12">
        <Card>
          <CardHeader>
            <CardTitle>Program Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{programDays.length}</div>
                <div className="text-sm text-gray-600">Workout Days</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">36</div>
                <div className="text-sm text-gray-600">Total Exercises</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">78</div>
                <div className="text-sm text-gray-600">Exercise Variations</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

