'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
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
import { ArrowLeft, ArrowRight, Play, Pause, RotateCcw, Timer } from 'lucide-react';

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

export default function WorkoutPage() {
  const params = useParams();
  const programId = parseInt(params.id as string);
  const dayId = parseInt(params.dayId as string);
  
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
      
      return {
        exerciseId: dayEx.exerciseId,
        exerciseName: exercise?.name || 'Unknown Exercise',
        targetReps: dayEx.repsTarget,
        sets: Array.from({ length: dayEx.sets }, (_, i) => ({
          setNumber: i + 1,
          weight: undefined,
          reps: undefined,
          restMinutes: undefined,
          restSeconds: undefined,
          difficulty: undefined,
          rpe: undefined,
        })),
        selectedVariation: 1,
        variations: variations,
      };
    });
    
    setExerciseData(initialData);
  }, [currentDay, dayId]);

  // Timer para workout
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (workoutStarted) {
      interval = setInterval(() => {
        setWorkoutTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [workoutStarted]);

  if (!program || !currentDay) {
    notFound();
  }

  const currentExercise = exerciseData[currentExerciseIndex];

  const updateSet = (exerciseIndex: number, setIndex: number, field: string, value: any) => {
    setExerciseData(prev => {
      const updated = [...prev];
      updated[exerciseIndex].sets[setIndex] = {
        ...updated[exerciseIndex].sets[setIndex],
        [field]: value
      };
      return updated;
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startRest = (minutes: number = 0, seconds: number = 0) => {
    const totalSeconds = minutes * 60 + seconds;
    if (totalSeconds > 0) {
      setRestTimer(totalSeconds);
      setIsResting(true);
    }
  };

  const skipRest = () => {
    setIsResting(false);
    setRestTimer(0);
  };

  const completeRest = () => {
    setIsResting(false);
    setRestTimer(0);
  };

  if (!workoutStarted) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Link href={`/programs/${programId}`} className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to {program.name}
        </Link>

        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">{currentDay.day_name}</h1>
          <p className="text-gray-600 mb-8">{program.name} - Day {currentDay.day_index}</p>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🏋️ Ready to Start?
              </CardTitle>
              <CardDescription>
                This workout contains {exerciseData.length} exercises. Make sure you have your equipment ready!
              </CardDescription>
            </CardHeader>
          </Card>

          <div className="space-y-4 mb-8">
            {exerciseData.map((exercise, index) => (
              <div key={exercise.exerciseId} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{exercise.exerciseName}</h3>
                  <p className="text-sm text-gray-600">{exercise.sets.length} sets</p>
                </div>
              </div>
            ))}
          </div>

          <Button 
            onClick={() => setWorkoutStarted(true)} 
            className="w-full py-6 text-lg"
            size="lg"
          >
            Start Workout
          </Button>
        </div>
      </div>
    );
  }

  if (!currentExercise) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Workout Complete! 🎉</h1>
        <p className="text-gray-600 mb-8">
          Total time: {formatTime(workoutTimer)}
        </p>
        <Link href={`/programs/${programId}`}>
          <Button>Back to Program</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Link href={`/programs/${programId}`} className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800">
          <ArrowLeft className="h-4 w-4" />
          Back to {program.name}
        </Link>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Timer className="h-4 w-4" />
          {formatTime(workoutTimer)}
        </div>
      </div>

      {/* Exercise Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold">{currentExercise.exerciseName}</h1>
          <span className="text-sm text-gray-600">
            Exercise {currentExerciseIndex + 1} of {exerciseData.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentExerciseIndex + 1) / exerciseData.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Exercise Variations */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Exercise Variation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {currentExercise.variations.map((variation) => (
              <div key={variation.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{variation.variation_name}</p>
                  <a 
                    href={variation.youtube_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Watch Tutorial →
                  </a>
                </div>
                <Button
                  variant={currentExercise.selectedVariation === variation.variation_index ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setExerciseData(prev => {
                      const updated = [...prev];
                      updated[currentExerciseIndex].selectedVariation = variation.variation_index;
                      return updated;
                    });
                  }}
                >
                  {currentExercise.selectedVariation === variation.variation_index ? "Selected" : "Select"}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Progression Suggestion */}
      <div className="mb-6">
        <ProgressionSuggestion
          exerciseId={currentExercise.exerciseId}
          exerciseName={currentExercise.exerciseName}
          targetReps={currentExercise.targetReps}
          lastSet={getLastSet('mock-user-123', currentExercise.exerciseId, currentExercise.selectedVariation)}
          onAcceptSuggestion={(weight, reps) => {
            updateSet(currentExerciseIndex, 0, 'weight', weight);
            updateSet(currentExerciseIndex, 0, 'reps', reps);
          }}
          userAggressiveness="standard"
        />
      </div>

      {/* Sets Tracking */}
      <div className="space-y-4 mb-6">
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
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Weight (kg)</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={set.weight || ''}
                    onChange={(e) => updateSet(currentExerciseIndex, setIndex, 'weight', parseFloat(e.target.value) || undefined)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Reps</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={set.reps || ''}
                    onChange={(e) => updateSet(currentExerciseIndex, setIndex, 'reps', parseInt(e.target.value) || undefined)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Rest (min)</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={set.restMinutes || ''}
                    onChange={(e) => updateSet(currentExerciseIndex, setIndex, 'restMinutes', parseInt(e.target.value) || undefined)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Rest (sec)</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={set.restSeconds || ''}
                    onChange={(e) => updateSet(currentExerciseIndex, setIndex, 'restSeconds', parseInt(e.target.value) || undefined)}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Difficulty</label>
                <div className="flex gap-2 mt-1">
                  {['easy', 'ok', 'hard'].map((difficulty) => (
                    <Button
                      key={difficulty}
                      variant={set.difficulty === difficulty ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateSet(currentExerciseIndex, setIndex, 'difficulty', difficulty)}
                    >
                      {difficulty === 'easy' ? '😊 Easy' : difficulty === 'ok' ? '😐 OK' : '😤 Hard'}
                    </Button>
                  ))}
                </div>
              </div>

              {set.restMinutes || set.restSeconds ? (
                <Button
                  onClick={() => startRest(set.restMinutes || 0, set.restSeconds || 0)}
                  className="w-full"
                  variant="outline"
                >
                  Start Rest Timer ({(set.restMinutes || 0)}:{(set.restSeconds || 0).toString().padStart(2, '0')})
                </Button>
              ) : null}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Rest Timer */}
      {isResting && (
        <div className="mb-6">
          <RestTimer
            initialSeconds={restTimer}
            isActive={isResting}
            onComplete={completeRest}
            onSkip={skipRest}
          />
        </div>
      )}

      {/* Navigation */}
      <div className="flex gap-4">
        <Button
          variant="outline"
          onClick={() => setCurrentExerciseIndex(prev => Math.max(0, prev - 1))}
          disabled={currentExerciseIndex === 0}
          className="flex-1"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous Exercise
        </Button>
        <Button
          onClick={() => setCurrentExerciseIndex(prev => Math.min(exerciseData.length - 1, prev + 1))}
          disabled={currentExerciseIndex === exerciseData.length - 1}
          className="flex-1"
        >
          Next Exercise
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}