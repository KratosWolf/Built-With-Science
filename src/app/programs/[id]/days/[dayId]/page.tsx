'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  getProgramById, 
  getProgramDays, 
  mockExercises, 
  mockExerciseVariations,
  mockLastSetCache,
  getLastSet,
  type WorkoutSet,
  type ExerciseVariation 
} from '@/lib/mock-data/workout-data';
import { ProgressionSuggestion } from '@/components/ui/progression-suggestion';
import { RestTimer } from '@/components/ui/rest-timer';
import { notFound } from 'next/navigation';

interface WorkoutPageProps {
  params: { id: string; dayId: string };
}

interface ExerciseSetData {
  exerciseId: number;
  exerciseName: string;
  targetReps: string;
  sets: Array<{
    setNumber: number;
    weight?: number;
    reps?: number;
    restMinutes?: number;
    restSeconds?: number;
    difficulty?: 'easy' | 'ok' | 'hard';
    rpe?: number;
  }>;
  selectedVariation: number;
  variations: ExerciseVariation[];
}

// Mock data para exercícios do dia (baseado no day_exercises.csv)
const mockDayExercises = {
  1: [ // Full Body A (program_day_id: 1) - Expandido para treino mais completo
    { exerciseId: 11, sets: 3, repsTarget: "8-10" }, // Flat Dumbbell Press
    { exerciseId: 10, sets: 3, repsTarget: "6-12" }, // Dumbbell Romanian Deadlift
    { exerciseId: 17, sets: 3, repsTarget: "8-10" }, // Lat Pulldown
    { exerciseId: 35, sets: 3, repsTarget: "8-10" }, // Walking Lunges (quad focus)
    { exerciseId: 6, sets: 3, repsTarget: "12-15" }, // Cable Lateral Raise
    { exerciseId: 12, sets: 2, repsTarget: "10-12" }, // Hammer Curls
    { exerciseId: 7, sets: 2, repsTarget: "10-12" }, // Cable Pushdowns
  ],
  2: [ // Full Body B (program_day_id: 2) - Expandido para treino mais completo
    { exerciseId: 20, sets: 3, repsTarget: "8-10" }, // Quad-Focused Leg Press
    { exerciseId: 24, sets: 3, repsTarget: "6-8" }, // Seated Dumbbell Shoulder Press
    { exerciseId: 25, sets: 3, repsTarget: "10-15" }, // Seated Leg Curls
    { exerciseId: 13, sets: 3, repsTarget: "10-15" }, // Incline DB Overhead Extensions
    { exerciseId: 22, sets: 3, repsTarget: "8-10" }, // Seated Cable Row (mid/upper back)
    { exerciseId: 21, sets: 2, repsTarget: "12-15" }, // Rear Delt Cable Row
    { exerciseId: 34, sets: 3, repsTarget: "12-15" }, // Standing Weighted Calf Raise
  ],
  3: [ // Full Body C (program_day_id: 3) - Expandido para treino mais completo
    { exerciseId: 3, sets: 3, repsTarget: "6-8" }, // Barbell Deadlift
    { exerciseId: 26, sets: 3, repsTarget: "10-15" }, // Seated Leg Extensions
    { exerciseId: 6, sets: 3, repsTarget: "15-20" }, // Cable Lateral Raise
    { exerciseId: 23, sets: 3, repsTarget: "10-15" }, // Seated Dumbbell Curls
    { exerciseId: 18, sets: 3, repsTarget: "8-10" }, // Low Incline Dumbbell Press
    { exerciseId: 16, sets: 3, repsTarget: "8-10" }, // Lat Focused Cable Row
    { exerciseId: 32, sets: 2, repsTarget: "15-20" }, // Standing Face Pulls
  ],
  4: [ // Upper 1 (program_day_id: 4)
    { exerciseId: 11, sets: 3, repsTarget: "8-10" }, // Flat Dumbbell Press
    { exerciseId: 17, sets: 3, repsTarget: "6-12" }, // Lat Pulldown
    { exerciseId: 24, sets: 3, repsTarget: "6-8" }, // Seated Dumbbell Shoulder Press
    { exerciseId: 8, sets: 3, repsTarget: "10-15" }, // Dumbbell Fly
    { exerciseId: 22, sets: 3, repsTarget: "10-12" }, // Seated Cable Row (mid/upper back)
    { exerciseId: 32, sets: 2, repsTarget: "10" }, // Standing Face Pulls
  ],
  5: [ // Lower 1 (Quad Focus) (program_day_id: 5)
    { exerciseId: 1, sets: 3, repsTarget: "8-10" }, // Barbell Back Squat
    { exerciseId: 35, sets: 3, repsTarget: "8-10" }, // Walking Lunges (quad focus)
    { exerciseId: 34, sets: 3, repsTarget: "10-15" }, // Standing Weighted Calf Raise
    { exerciseId: 27, sets: 2, repsTarget: "30" }, // Side Plank
  ],
  6: [ // Upper 2 (program_day_id: 6)
    { exerciseId: 18, sets: 3, repsTarget: "8-10" }, // Low Incline Dumbbell Press
    { exerciseId: 16, sets: 3, repsTarget: "10-12" }, // Lat Focused Cable Row
    { exerciseId: 11, sets: 3, repsTarget: "8-10" }, // Flat Dumbbell Press
    { exerciseId: 21, sets: 3, repsTarget: "12-15" }, // Rear Delt Cable Row
    { exerciseId: 6, sets: 3, repsTarget: "15-20" }, // Cable Lateral Raise
    { exerciseId: 32, sets: 2, repsTarget: "10" }, // Standing Face Pulls
  ],
  7: [ // Lower 2 (Glute Focus) (program_day_id: 7)
    { exerciseId: 3, sets: 3, repsTarget: "6-8" }, // Barbell Deadlift
    { exerciseId: 29, sets: 3, repsTarget: "8-10" }, // Single-Leg Leg Press
    { exerciseId: 4, sets: 3, repsTarget: "10-15" }, // Barbell Hip Thrust
    { exerciseId: 19, sets: 3, repsTarget: "10-15" }, // Lying Leg Curls
  ],
  8: [ // Upper (program_day_id: 8)
    { exerciseId: 2, sets: 3, repsTarget: "8-10" }, // Barbell Bench Press
    { exerciseId: 22, sets: 3, repsTarget: "10-12" }, // Seated Cable Row (mid/upper back)
    { exerciseId: 24, sets: 3, repsTarget: "6-8" }, // Seated Dumbbell Shoulder Press
    { exerciseId: 5, sets: 3, repsTarget: "8-10" }, // Barbell Row (lat focus)
    { exerciseId: 33, sets: 3, repsTarget: "10-15" }, // Standing High To Low Cable Fly
    { exerciseId: 9, sets: 3, repsTarget: "15-20" }, // Dumbbell Lateral Raise
    { exerciseId: 32, sets: 3, repsTarget: "10" }, // Standing Face Pulls
  ],
  9: [ // Lower 1 (Quad Focus) (program_day_id: 9)
    { exerciseId: 31, sets: 3, repsTarget: "8-10" }, // Smith Machine Squat
    { exerciseId: 36, sets: 3, repsTarget: "8-10" }, // Weighted Step-Ups
    { exerciseId: 28, sets: 3, repsTarget: "10-15" }, // Single Leg Weighted Calf Raise
    { exerciseId: 27, sets: 2, repsTarget: "30" }, // Side Plank
  ],
  10: [ // Push (program_day_id: 10)
    { exerciseId: 18, sets: 3, repsTarget: "8-10" }, // Low Incline Dumbbell Press
    { exerciseId: 8, sets: 3, repsTarget: "8-10" }, // Dumbbell Fly
    { exerciseId: 11, sets: 3, repsTarget: "10-15" }, // Flat Dumbbell Press
    { exerciseId: 9, sets: 3, repsTarget: "8-10" }, // Dumbbell Lateral Raise
    { exerciseId: 13, sets: 3, repsTarget: "12-15" }, // Incline DB Overhead Extensions
    { exerciseId: 7, sets: 3, repsTarget: "15-20" }, // Cable Pushdowns
  ],
  11: [ // Pull (program_day_id: 11)
    { exerciseId: 15, sets: 3, repsTarget: "8-10" }, // Kneeling Lat Pulldown
    { exerciseId: 16, sets: 3, repsTarget: "6-12" }, // Lat Focused Cable Row
    { exerciseId: 21, sets: 3, repsTarget: "10-12" }, // Rear Delt Cable Row
    { exerciseId: 14, sets: 3, repsTarget: "12-15" }, // Incline Dumbbell Curls
    { exerciseId: 12, sets: 3, repsTarget: "8-10" }, // Hammer Curls
    { exerciseId: 32, sets: 2, repsTarget: "10" }, // Standing Face Pulls
  ],
  12: [ // Lower 2 (Glute Focus) (program_day_id: 12)
    { exerciseId: 3, sets: 3, repsTarget: "8-10" }, // Barbell Deadlift
    { exerciseId: 29, sets: 3, repsTarget: "8-10" }, // Single-Leg Leg Press
    { exerciseId: 30, sets: 3, repsTarget: "10-15" }, // Smith Machine Hip Thrust
    { exerciseId: 19, sets: 3, repsTarget: "10-15" }, // Lying Leg Curls
  ],
};

export default async function WorkoutPage({ params }: WorkoutPageProps) {
  const resolvedParams = await params;
  const programId = parseInt(resolvedParams.id);
  const dayId = parseInt(resolvedParams.dayId);
  
  const program = getProgramById(programId);
  const programDays = getProgramDays(programId);
  const currentDay = programDays.find(day => day.id === dayId);
  
  const [exerciseData, setExerciseData] = useState<ExerciseSetData[]>([]);
  const [workoutStarted, setWorkoutStarted] = useState(false);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [workoutTimer, setWorkoutTimer] = useState(0);
  const [restTimer, setRestTimer] = useState(0);
  const [isResting, setIsResting] = useState(false);

  useEffect(() => {
    if (!currentDay) return;
    
    // Buscar exercícios para este dia (mock data)
    const dayExercises = mockDayExercises[dayId as keyof typeof mockDayExercises] || [];
    
    const initialData: ExerciseSetData[] = dayExercises.map(dayEx => {
      const exercise = mockExercises.find(e => e.id === dayEx.exerciseId);
      const variations = mockExerciseVariations.filter(v => v.exercise_id === dayEx.exerciseId);
                    const lastSet = getLastSet('mock-user-123', dayEx.exerciseId, 1);
      
      return {
        exerciseId: dayEx.exerciseId,
        exerciseName: exercise?.name || 'Unknown Exercise',
        targetReps: dayEx.repsTarget,
        selectedVariation: 1,
        variations,
        sets: Array.from({ length: dayEx.sets }, (_, i) => ({
          setNumber: i + 1,
          weight: lastSet?.weight_kg,
          reps: lastSet?.reps,
          restMinutes: Math.floor((lastSet?.rest_sec || 120) / 60),
          restSeconds: (lastSet?.rest_sec || 120) % 60,
        }))
      };
    });
    
    setExerciseData(initialData);
  }, [currentDay, dayId]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (workoutStarted) {
      interval = setInterval(() => {
        setWorkoutTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [workoutStarted]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isResting && restTimer > 0) {
      interval = setInterval(() => {
        setRestTimer(prev => {
          if (prev <= 1) {
            setIsResting(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isResting, restTimer]);

  if (!program || !currentDay) {
    notFound();
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startWorkout = () => {
    setWorkoutStarted(true);
  };

  const updateSet = (exerciseIndex: number, setIndex: number, field: string, value: any) => {
    setExerciseData(prev => {
      const newData = [...prev];
      newData[exerciseIndex].sets[setIndex] = {
        ...newData[exerciseIndex].sets[setIndex],
        [field]: value
      };
      return newData;
    });
  };

  const completeSet = (exerciseIndex: number, setIndex: number) => {
    const set = exerciseData[exerciseIndex].sets[setIndex];
    const totalRestSeconds = (set.restMinutes || 0) * 60 + (set.restSeconds || 0);
    
    if (totalRestSeconds > 0) {
      setRestTimer(totalRestSeconds);
      setIsResting(true);
    }
  };

  const nextExercise = () => {
    if (currentExerciseIndex < exerciseData.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
    }
  };

  const prevExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(prev => prev - 1);
    }
  };

  const finishWorkout = () => {
    // Aqui você salvaria os dados do treino
    alert('Treino concluído! Dados salvos localmente.');
  };

  if (!workoutStarted) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <Button variant="outline" asChild className="mb-4">
              <Link href={`/programs/${programId}`}>← Back to {program.name}</Link>
            </Button>
            
            <h1 className="text-3xl font-bold mb-2">{currentDay.day_name}</h1>
            <p className="text-gray-600">{program.name} - Day {currentDay.day_index}</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>🏋️ Ready to Start?</CardTitle>
              <CardDescription>
                This workout contains {exerciseData.length} exercises. Make sure you have your equipment ready!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-2">
                  {exerciseData.map((exercise, idx) => (
                    <div key={exercise.exerciseId} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {idx + 1}
                      </span>
                      <div>
                        <div className="font-medium">{exercise.exerciseName}</div>
                        <div className="text-sm text-gray-600">{exercise.sets.length} sets</div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Button onClick={startWorkout} size="lg" className="w-full">
                  Start Workout
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const currentExercise = exerciseData[currentExerciseIndex];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header com timer */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">{currentDay.day_name}</h1>
            <p className="text-gray-600">Exercise {currentExerciseIndex + 1} of {exerciseData.length}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">{formatTime(workoutTimer)}</div>
            <div className="text-sm text-gray-600">Workout Time</div>
          </div>
        </div>

        {/* Rest Timer */}
        {isResting && (
          <div className="mb-6">
            <RestTimer
              initialSeconds={restTimer}
              isActive={isResting}
              onComplete={() => setIsResting(false)}
              onSkip={() => setIsResting(false)}
            />
          </div>
        )}
      </div>

      {currentExercise && (
        <div className="max-w-4xl mx-auto">
          {/* Exercise Info */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{currentExercise.exerciseName}</span>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={prevExercise}
                    disabled={currentExerciseIndex === 0}
                  >
                    ← Prev
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={nextExercise}
                    disabled={currentExerciseIndex === exerciseData.length - 1}
                  >
                    Next →
                  </Button>
                </div>
              </CardTitle>
              <CardDescription>
                {currentExercise.variations.length > 0 && (
                  <div className="flex items-center gap-2 mt-2">
                    <span>Variation:</span>
                    <select 
                      className="border rounded px-2 py-1 text-sm"
                      value={currentExercise.selectedVariation}
                      onChange={(e) => {
                        const newData = [...exerciseData];
                        newData[currentExerciseIndex].selectedVariation = parseInt(e.target.value);
                        setExerciseData(newData);
                      }}
                    >
                      {currentExercise.variations.map(variation => (
                        <option key={variation.variation_index} value={variation.variation_index}>
                          {variation.variation_name}
                        </option>
                      ))}
                    </select>
                    {currentExercise.variations.find(v => v.variation_index === currentExercise.selectedVariation)?.youtube_url && (
                      <Button variant="outline" size="sm" asChild>
                        <a 
                          href={currentExercise.variations.find(v => v.variation_index === currentExercise.selectedVariation)?.youtube_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          🎥 Tutorial
                        </a>
                      </Button>
                    )}
                  </div>
                )}
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Progression Suggestion */}
          <div className="mb-6">
            <ProgressionSuggestion
              exerciseId={currentExercise.exerciseId}
              exerciseName={currentExercise.exerciseName}
              targetReps={currentExercise.targetReps}
              lastSet={getLastSet('mock-user-123', currentExercise.exerciseId, currentExercise.selectedVariation)}
              onAcceptSuggestion={(weight, reps) => {
                // Aplicar sugestão ao primeiro set
                updateSet(currentExerciseIndex, 0, 'weight', weight);
                updateSet(currentExerciseIndex, 0, 'reps', reps);
              }}
              userAggressiveness="standard"
            />
          </div>

          {/* Sets Tracking */}
          <div className="space-y-4">
            {currentExercise.sets.map((set, setIndex) => (
              <Card key={setIndex} className="border-2">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center justify-between">
                    <span>Set {set.setNumber}</span>
                    <span className="text-sm font-normal bg-gray-100 text-gray-700 px-2 py-1 rounded">
                      Target: {currentExercise.targetReps} reps
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Weight (kg)</label>
                      <Input
                        type="number"
                        value={set.weight || ''}
                        onChange={(e) => updateSet(currentExerciseIndex, setIndex, 'weight', parseFloat(e.target.value) || undefined)}
                        placeholder="0"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Reps</label>
                      <Input
                        type="number"
                        value={set.reps || ''}
                        onChange={(e) => updateSet(currentExerciseIndex, setIndex, 'reps', parseInt(e.target.value) || undefined)}
                        placeholder="0"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Rest (min)</label>
                      <Input
                        type="number"
                        value={set.restMinutes || ''}
                        onChange={(e) => updateSet(currentExerciseIndex, setIndex, 'restMinutes', parseInt(e.target.value) || undefined)}
                        placeholder="2"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Rest (sec)</label>
                      <Input
                        type="number"
                        max="59"
                        value={set.restSeconds || ''}
                        onChange={(e) => updateSet(currentExerciseIndex, setIndex, 'restSeconds', parseInt(e.target.value) || undefined)}
                        placeholder="0"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Difficulty</label>
                      <select 
                        className="w-full border rounded px-3 py-2"
                        value={set.difficulty || ''}
                        onChange={(e) => updateSet(currentExerciseIndex, setIndex, 'difficulty', e.target.value || undefined)}
                      >
                        <option value="">Select</option>
                        <option value="easy">Easy</option>
                        <option value="ok">OK</option>
                        <option value="hard">Hard</option>
                      </select>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => completeSet(currentExerciseIndex, setIndex)}
                    disabled={!set.weight || !set.reps}
                    className="w-full"
                  >
                    Complete Set {set.setNumber}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Navigation */}
          <div className="mt-8 flex gap-4 justify-between">
            <Button 
              variant="outline" 
              onClick={prevExercise}
              disabled={currentExerciseIndex === 0}
            >
              ← Previous Exercise
            </Button>
            
            {currentExerciseIndex === exerciseData.length - 1 ? (
              <Button onClick={finishWorkout} className="bg-green-600 hover:bg-green-700">
                Finish Workout 🎉
              </Button>
            ) : (
              <Button onClick={nextExercise}>
                Next Exercise →
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
