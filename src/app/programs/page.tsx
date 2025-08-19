import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { mockPrograms, mockProgramDays } from '@/lib/mock-data/workout-data';

export default function ProgramsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Choose Your Program</h1>
        <p className="text-gray-600">
          Select a science-based workout program that fits your schedule and goals.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {mockPrograms.map((program) => {
          const programDays = mockProgramDays.filter(pd => pd.program_id === program.id).sort((a, b) => a.day_index - b.day_index);
          
          return (
            <Card key={program.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {program.name}
                  <span className="text-sm font-normal bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {programDays.length} days
                  </span>
                </CardTitle>
                <CardDescription>
                  {program.id === 1 && "Perfect for beginners or those with limited time. Full body workouts 3x per week."}
                  {program.id === 2 && "Ideal for intermediate lifters. Upper/lower split for balanced development."}
                  {program.id === 3 && "Advanced program for experienced lifters. Maximum volume and specialization."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  {programDays.map((day) => (
                    <div key={day.id} className="text-sm text-gray-600 flex items-center gap-2">
                      <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium">
                        {day.day_index}
                      </span>
                      {day.day_name}
                    </div>
                  ))}
                </div>
                
                <Button asChild className="w-full">
                  <Link href={`/programs/${program.id}`}>
                    Start {program.name}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-12 text-center">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>🧬 Science-Based Design</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-base">
              All programs are designed based on scientific research for optimal muscle growth, 
              strength development, and recovery. Each exercise includes multiple variations 
              with video tutorials from certified trainers.
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

