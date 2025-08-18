'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { mockPrograms, mockProgramDays, mockExercises } from '@/lib/mock-data/workout-data';

interface WorkoutHistoryEntry {
  id: number;
  date: string;
  programName: string;
  dayName: string;
  duration: number; // minutes
  exercises: number;
  totalSets: number;
  totalVolume: number; // kg
}

// Mock workout history data
const mockWorkoutHistory: WorkoutHistoryEntry[] = [
  {
    id: 1,
    date: '2024-01-15',
    programName: '4-day Program',
    dayName: 'Upper 1',
    duration: 68,
    exercises: 6,
    totalSets: 18,
    totalVolume: 2450
  },
  {
    id: 2,
    date: '2024-01-13',
    programName: '4-day Program',
    dayName: 'Lower 1 (Quad Focus)',
    duration: 72,
    exercises: 5,
    totalSets: 15,
    totalVolume: 2890
  },
  {
    id: 3,
    date: '2024-01-11',
    programName: '4-day Program',
    dayName: 'Upper 2',
    duration: 65,
    exercises: 6,
    totalSets: 17,
    totalVolume: 2320
  },
  {
    id: 4,
    date: '2024-01-09',
    programName: '4-day Program',
    dayName: 'Lower 2 (Glute Focus)',
    duration: 70,
    exercises: 5,
    totalSets: 16,
    totalVolume: 2650
  },
  {
    id: 5,
    date: '2024-01-07',
    programName: '4-day Program',
    dayName: 'Upper 1',
    duration: 66,
    exercises: 6,
    totalSets: 18,
    totalVolume: 2380
  }
];

export default function HistoryPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  
  const filteredHistory = mockWorkoutHistory.filter(workout => {
    if (selectedPeriod === 'all') return true;
    
    const workoutDate = new Date(workout.date);
    const now = new Date();
    
    switch (selectedPeriod) {
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return workoutDate >= weekAgo;
      case 'month':
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return workoutDate >= monthAgo;
      case 'year':
        const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        return workoutDate >= yearAgo;
      default:
        return true;
    }
  });

  const totalWorkouts = filteredHistory.length;
  const totalVolume = filteredHistory.reduce((sum, w) => sum + w.totalVolume, 0);
  const avgDuration = filteredHistory.length > 0 
    ? Math.round(filteredHistory.reduce((sum, w) => sum + w.duration, 0) / filteredHistory.length)
    : 0;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Workout History</h1>
            <p className="text-gray-600">Track your progress and see your workout statistics</p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/programs">New Workout</Link>
          </Button>
        </div>

        {/* Period Filter */}
        <div className="flex gap-2 mb-6">
          {[
            { value: 'all', label: 'All Time' },
            { value: 'week', label: 'Last Week' },
            { value: 'month', label: 'Last Month' },
            { value: 'year', label: 'Last Year' }
          ].map((period) => (
            <Button
              key={period.value}
              variant={selectedPeriod === period.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPeriod(period.value)}
            >
              {period.label}
            </Button>
          ))}
        </div>

        {/* Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Workouts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{totalWorkouts}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Volume</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{totalVolume.toLocaleString()} kg</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Avg Duration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{formatDuration(avgDuration)}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Consistency</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {totalWorkouts > 0 ? Math.round((totalWorkouts / 30) * 100) : 0}%
              </div>
              <div className="text-xs text-gray-500">Last 30 days</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Workout History List */}
      <div className="space-y-4">
        {filteredHistory.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <div className="text-gray-400 mb-4">
                  <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No workouts found</h3>
                <p className="text-gray-600 mb-4">Start your fitness journey by completing your first workout!</p>
                <Button asChild>
                  <Link href="/programs">Choose a Program</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredHistory.map((workout) => (
            <Card key={workout.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{workout.dayName}</CardTitle>
                    <CardDescription>{workout.programName}</CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{formatDate(workout.date)}</div>
                    <div className="text-sm text-gray-600">{formatDuration(workout.duration)}</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-blue-600">{workout.exercises}</div>
                    <div className="text-xs text-gray-600">Exercises</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-green-600">{workout.totalSets}</div>
                    <div className="text-xs text-gray-600">Sets</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-purple-600">{workout.totalVolume.toLocaleString()}</div>
                    <div className="text-xs text-gray-600">Volume (kg)</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
