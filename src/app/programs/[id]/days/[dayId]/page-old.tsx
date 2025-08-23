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
  getExerciseById,
  getExerciseDisplayName,
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
  tutorialUrl: string;
  isSuperset?: boolean;
  supersetLabel?: string; // A1, A2, B1, B2
  supersetGroup?: string; // A, B
}

// Novos exercícios necessários para os programas completos
const additionalExercises = [
  { id: 37, name: "Standing Mid-Chest Cable Fly" },
  { id: 38, name: "Banded Hip Abductions" },
  { id: 39, name: "RKC Plank" },
  { id: 40, name: "Close-Grip Dumbbell Press" },
  { id: 41, name: "Seated Weighted Calf Raise" }
];

// Estrutura para supersets
interface SupersetGroup {
  type: 'superset';
  label: string; // A, B, etc.
  exercises: Array<{
    exerciseId: number;
    sets: number;
    repsTarget: string;
    label: string; // A1, A2, B1, B2
    perLeg?: boolean;
    perSide?: boolean;
  }>;
}

interface RegularExercise {
  type: 'regular';
  exerciseId: number;
  sets: number;
  repsTarget: string;
  perLeg?: boolean;
  perSide?: boolean;
}

type ExerciseGroup = SupersetGroup | RegularExercise;

// Mock data para exercícios do dia baseado nos screenshots reais
const mockDayExercises: Record<number, ExerciseGroup[]> = {
  // 3-DAY PROGRAM
  1: [ // Full Body A (8 exercícios)
    { type: 'regular', exerciseId: 10, sets: 3, repsTarget: "8-10" }, // Dumbbell Romanian Deadlift
    { type: 'regular', exerciseId: 17, sets: 3, repsTarget: "6-12" }, // Lat Pulldown
    { type: 'regular', exerciseId: 35, sets: 3, repsTarget: "8-10", perLeg: true }, // Walking Lunges (quad focus)
    {
      type: 'superset',
      label: 'A',
      exercises: [
        { exerciseId: 37, sets: 3, repsTarget: "10-15", label: 'A1' }, // Standing Mid-Chest Cable Fly
        { exerciseId: 9, sets: 3, repsTarget: "15-20", label: 'A2' } // Dumbbell Lateral Raise
      ]
    },
    {
      type: 'superset',
      label: 'B',
      exercises: [
        { exerciseId: 28, sets: 3, repsTarget: "10-15", label: 'B1' }, // Single Leg Weighted Calf Raise
        { exerciseId: 32, sets: 3, repsTarget: "1-10", label: 'B2' } // Standing Face Pulls
      ]
    }
  ],
  2: [ // Full Body B (8 exercícios)
    { type: 'regular', exerciseId: 20, sets: 3, repsTarget: "8-10" }, // Quad-Focused Leg Press
    { type: 'regular', exerciseId: 24, sets: 3, repsTarget: "6-8" }, // Seated Dumbbell Shoulder Press
    { type: 'regular', exerciseId: 25, sets: 3, repsTarget: "10-15" }, // Seated Leg Curls
    {
      type: 'superset',
      label: 'A',
      exercises: [
        { exerciseId: 5, sets: 3, repsTarget: "10-12", label: 'A1' }, // Barbell Row (mid/upper back)
        { exerciseId: 40, sets: 3, repsTarget: "10+", label: 'A2' } // Close-Grip Dumbbell Press
      ]
    },
    { type: 'regular', exerciseId: 13, sets: 3, repsTarget: "10-15" }, // Incline DB Overhead Extensions
    {
      type: 'superset',
      label: 'B',
      exercises: [
        { exerciseId: 41, sets: 3, repsTarget: "10-15", label: 'B1' }, // Seated Weighted Calf Raise
        { exerciseId: 39, sets: 3, repsTarget: "30-60s", label: 'B2' } // RKC Plank
      ]
    }
  ],
  3: [ // Full Body C (8 exercícios)
    { type: 'regular', exerciseId: 3, sets: 3, repsTarget: "6-8" }, // Barbell Deadlift
    {
      type: 'superset',
      label: 'A',
      exercises: [
        { exerciseId: 18, sets: 3, repsTarget: "10-12", label: 'A1' }, // Low Incline Dumbbell Press
        { exerciseId: 5, sets: 3, repsTarget: "10-12", label: 'A2' } // Barbell Row (mid/upper back)
      ]
    },
    { type: 'regular', exerciseId: 26, sets: 3, repsTarget: "10-15" }, // Seated Leg Extensions
    { type: 'regular', exerciseId: 6, sets: 3, repsTarget: "15-20" }, // Cable Lateral Raise
    { type: 'regular', exerciseId: 23, sets: 3, repsTarget: "10-15" }, // Seated Dumbbell Curls
    {
      type: 'superset',
      label: 'B',
      exercises: [
        { exerciseId: 32, sets: 3, repsTarget: "1-10", label: 'B1' }, // Standing Face Pulls
        { exerciseId: 27, sets: 3, repsTarget: "1-5", label: 'B2', perSide: true } // Side Plank
      ]
    }
  ],

  // 4-DAY PROGRAM
  4: [ // Upper 1 (8 exercícios)
    { type: 'regular', exerciseId: 11, sets: 3, repsTarget: "8-10" }, // Flat Dumbbell Press
    { type: 'regular', exerciseId: 17, sets: 3, repsTarget: "6-12" }, // Lat Pulldown
    { type: 'regular', exerciseId: 24, sets: 3, repsTarget: "6-8" }, // Seated Dumbbell Shoulder Press
    { type: 'regular', exerciseId: 8, sets: 3, repsTarget: "10-15" }, // Dumbbell Fly
    { type: 'regular', exerciseId: 22, sets: 3, repsTarget: "10-12" }, // Seated Cable Row (mid/upper back)
    {
      type: 'superset',
      label: 'A',
      exercises: [
        { exerciseId: 14, sets: 3, repsTarget: "8-10", label: 'A1' }, // Incline Dumbbell Curls
        { exerciseId: 9, sets: 3, repsTarget: "15-20", label: 'A2' } // Dumbbell Lateral Raise
      ]
    },
    { type: 'regular', exerciseId: 32, sets: 3, repsTarget: "1-10" } // Standing Face Pulls
  ],
  5: [ // Lower 1 (Quad Focus) (7 exercícios)
    { type: 'regular', exerciseId: 1, sets: 3, repsTarget: "8-10" }, // Barbell Back Squat
    {
      type: 'superset',
      label: 'A',
      exercises: [
        { exerciseId: 10, sets: 3, repsTarget: "8-10", label: 'A1' }, // Dumbbell Romanian Deadlift
        { exerciseId: 26, sets: 3, repsTarget: "10-15", label: 'A2' } // Seated Leg Extensions
      ]
    },
    { type: 'regular', exerciseId: 35, sets: 3, repsTarget: "8-10", perLeg: true }, // Walking Lunges (quad focus)
    { type: 'regular', exerciseId: 34, sets: 3, repsTarget: "10-15" }, // Standing Weighted Calf Raise
    { type: 'regular', exerciseId: 27, sets: 2, repsTarget: "30s", perSide: true } // Side Plank
  ],
  6: [ // Upper 2 (8 exercícios)
    { type: 'regular', exerciseId: 18, sets: 3, repsTarget: "8-10" }, // Low Incline Dumbbell Press
    { type: 'regular', exerciseId: 16, sets: 3, repsTarget: "10-12" }, // Lat Focused Cable Row
    { type: 'regular', exerciseId: 11, sets: 3, repsTarget: "8-10" }, // Flat Dumbbell Press
    { type: 'regular', exerciseId: 21, sets: 3, repsTarget: "12-15" }, // Rear Delt Cable Row
    { type: 'regular', exerciseId: 6, sets: 3, repsTarget: "15-20" }, // Cable Lateral Raise
    {
      type: 'superset',
      label: 'A',
      exercises: [
        { exerciseId: 12, sets: 3, repsTarget: "8-10", label: 'A1' }, // Hammer Curls
        { exerciseId: 13, sets: 3, repsTarget: "10-15", label: 'A2' } // Incline DB Overhead Extensions
      ]
    },
    { type: 'regular', exerciseId: 32, sets: 3, repsTarget: "1-10" } // Standing Face Pulls
  ],
  7: [ // Lower 2 (Glute Focus) (6 exercícios)
    { type: 'regular', exerciseId: 3, sets: 3, repsTarget: "6-8" }, // Barbell Deadlift
    { type: 'regular', exerciseId: 29, sets: 3, repsTarget: "8-10", perLeg: true }, // Single-Leg Leg Press
    { type: 'regular', exerciseId: 4, sets: 3, repsTarget: "10-15" }, // Barbell Hip Thrust
    { type: 'regular', exerciseId: 19, sets: 3, repsTarget: "10-15" }, // Lying Leg Curls
    {
      type: 'superset',
      label: 'A',
      exercises: [
        { exerciseId: 38, sets: 3, repsTarget: "1-12", label: 'A1' }, // Banded Hip Abductions
        { exerciseId: 41, sets: 3, repsTarget: "8-10", label: 'A2' } // Seated Weighted Calf Raise
      ]
    }
  ],

  // 5-DAY PROGRAM
  8: [ // Upper (7 exercícios)
    { type: 'regular', exerciseId: 2, sets: 3, repsTarget: "8-10" }, // Barbell Bench Press
    { type: 'regular', exerciseId: 22, sets: 3, repsTarget: "10-12" }, // Seated Cable Row (mid/upper back)
    { type: 'regular', exerciseId: 24, sets: 3, repsTarget: "6-8" }, // Seated Dumbbell Shoulder Press
    { type: 'regular', exerciseId: 5, sets: 3, repsTarget: "8-10" }, // Barbell Row (lat focus)
    { type: 'regular', exerciseId: 33, sets: 3, repsTarget: "10-15" }, // Standing High To Low Cable Fly
    { type: 'regular', exerciseId: 9, sets: 3, repsTarget: "15-20" }, // Dumbbell Lateral Raise
    { type: 'regular', exerciseId: 32, sets: 3, repsTarget: "10" } // Standing Face Pulls
  ],
  9: [ // Lower 1 (Quad Focus) (6 exercícios)
    { type: 'regular', exerciseId: 31, sets: 3, repsTarget: "8-10" }, // Smith Machine Squat
    {
      type: 'superset',
      label: 'A',
      exercises: [
        { exerciseId: 10, sets: 3, repsTarget: "8-10", label: 'A1' }, // Dumbbell Romanian Deadlift
        { exerciseId: 26, sets: 3, repsTarget: "10-15", label: 'A2' } // Seated Leg Extensions
      ]
    },
    { type: 'regular', exerciseId: 36, sets: 3, repsTarget: "8-10", perLeg: true }, // Weighted Step-Ups
    { type: 'regular', exerciseId: 28, sets: 3, repsTarget: "10-15" }, // Single Leg Weighted Calf Raise
    { type: 'regular', exerciseId: 27, sets: 2, repsTarget: "30s", perSide: true } // Side Plank
  ],
  10: [ // Push (6 exercícios)
    { type: 'regular', exerciseId: 18, sets: 3, repsTarget: "8-10" }, // Low Incline Dumbbell Press
    { type: 'regular', exerciseId: 8, sets: 3, repsTarget: "10-15" }, // Dumbbell Fly
    { type: 'regular', exerciseId: 11, sets: 3, repsTarget: "8-10" }, // Flat Dumbbell Press
    { type: 'regular', exerciseId: 9, sets: 3, repsTarget: "15-20" }, // Dumbbell Lateral Raise
    { type: 'regular', exerciseId: 13, sets: 3, repsTarget: "10-15" }, // Incline DB Overhead Extensions
    { type: 'regular', exerciseId: 7, sets: 3, repsTarget: "8-10" } // Cable Pushdowns
  ],
  11: [ // Pull (6 exercícios)
    { type: 'regular', exerciseId: 15, sets: 3, repsTarget: "6-12" }, // Kneeling Lat Pulldown
    { type: 'regular', exerciseId: 16, sets: 3, repsTarget: "10-12" }, // Lat Focused Cable Row
    { type: 'regular', exerciseId: 21, sets: 3, repsTarget: "12-15" }, // Rear Delt Cable Row
    { type: 'regular', exerciseId: 14, sets: 3, repsTarget: "8-10" }, // Incline Dumbbell Curls
    { type: 'regular', exerciseId: 12, sets: 3, repsTarget: "8-10" }, // Hammer Curls
    { type: 'regular', exerciseId: 32, sets: 2, repsTarget: "10" } // Standing Face Pulls
  ],
  12: [ // Lower 2 (Glute Focus) (6 exercícios)
    { type: 'regular', exerciseId: 3, sets: 3, repsTarget: "6-8" }, // Barbell Deadlift
    { type: 'regular', exerciseId: 29, sets: 3, repsTarget: "8-10", perLeg: true }, // Single-Leg Leg Press
    { type: 'regular', exerciseId: 30, sets: 3, repsTarget: "10-15" }, // Smith Machine Hip Thrust
    { type: 'regular', exerciseId: 19, sets: 3, repsTarget: "10-15" }, // Lying Leg Curls
    {
      type: 'superset',
      label: 'A',
      exercises: [
        { exerciseId: 38, sets: 3, repsTarget: "1-12", label: 'A1' }, // Banded Hip Abductions
        { exerciseId: 41, sets: 3, repsTarget: "8-10", label: 'A2' } // Seated Weighted Calf Raise
      ]
    }
  ]
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
    const dayExerciseGroups = mockDayExercises[dayId] || [];
    
    const initialData: ExerciseSetData[] = [];
    
    dayExerciseGroups.forEach(group => {
      if (group.type === 'regular') {
        const exercise = getExerciseById(group.exerciseId);
        const variations = mockExerciseVariations.filter(v => v.exercise_id === group.exerciseId);
        
        initialData.push({
          exerciseId: group.exerciseId,
          exerciseName: getExerciseDisplayName(group.exerciseId, group.perLeg, group.perSide),
          targetReps: group.repsTarget,
          sets: Array.from({ length: group.sets }, (_, i) => ({
            setNumber: i + 1,
            weight: undefined,
            reps: undefined,
            restMinutes: undefined,
            restSeconds: undefined,
            difficulty: undefined,
            rpe: undefined,
          })),
          tutorialUrl: variations[0]?.youtube_url || '#',
          isSuperset: false
        });
      } else if (group.type === 'superset') {
        // Add each exercise in the superset
        group.exercises.forEach(supersetEx => {
          const exercise = getExerciseById(supersetEx.exerciseId);
          const variations = mockExerciseVariations.filter(v => v.exercise_id === supersetEx.exerciseId);
          
          initialData.push({
            exerciseId: supersetEx.exerciseId,
            exerciseName: getExerciseDisplayName(supersetEx.exerciseId, supersetEx.perLeg, supersetEx.perSide),
            targetReps: supersetEx.repsTarget,
            sets: Array.from({ length: supersetEx.sets }, (_, i) => ({
              setNumber: i + 1,
              weight: undefined,
              reps: undefined,
              restMinutes: undefined,
              restSeconds: undefined,
              difficulty: undefined,
              rpe: undefined,
            })),
            tutorialUrl: variations[0]?.youtube_url || '#',
            isSuperset: true,
            supersetLabel: supersetEx.label,
            supersetGroup: group.label
          });
        });
      }
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
                This workout contains {exerciseData.length} exercises{exerciseData.some(e => e.isSuperset) ? ' (including supersets)' : ''}. Make sure you have your equipment ready!
              </CardDescription>
            </CardHeader>
          </Card>

          <div className="space-y-4 mb-8">
            {exerciseData.map((exercise, index) => (
              <div key={`${exercise.exerciseId}-${index}`} className={`flex items-center gap-4 p-4 rounded-lg ${
                exercise.isSuperset ? 'bg-blue-50 border-l-4 border-blue-500' : 'bg-gray-50'
              }`}>
                <div className={`w-8 h-8 text-white rounded-full flex items-center justify-center font-semibold text-sm ${
                  exercise.isSuperset ? 'bg-blue-600' : 'bg-gray-500'
                }`}>
                  {exercise.isSuperset ? exercise.supersetLabel : index + 1}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">
                    {exercise.exerciseName}
                    {exercise.isSuperset && (
                      <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        Superset {exercise.supersetGroup}
                      </span>
                    )}
                  </h3>
                  <p className="text-sm text-gray-600">{exercise.sets.length} sets • {exercise.targetReps} reps</p>
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
          <div>
            <h1 className="text-2xl font-bold">
              {currentExercise.isSuperset && (
                <span className="inline-block bg-blue-100 text-blue-800 text-sm font-semibold px-2 py-1 rounded mr-2">
                  {currentExercise.supersetLabel}
                </span>
              )}
              {currentExercise.exerciseName}
            </h1>
            {currentExercise.isSuperset && (
              <p className="text-sm text-gray-600 mt-1">
                Superset {currentExercise.supersetGroup} - Perform back-to-back with minimal rest
              </p>
            )}
          </div>
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

      {/* Exercise Tutorial */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Tutorial Video</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 border rounded-lg bg-blue-50">
            <div>
              <p className="font-medium text-blue-900">{currentExercise.exerciseName}</p>
              <p className="text-sm text-blue-700 mt-1">Official tutorial for proper form and technique</p>
            </div>
            <a 
              href={currentExercise.tutorialUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              🎥 Watch Tutorial
            </a>
          </div>
        </CardContent>
      </Card>

      {/* Progression Suggestion */}
      <div className="mb-6">
        <ProgressionSuggestion
          exerciseId={currentExercise.exerciseId}
          exerciseName={currentExercise.exerciseName}
          targetReps={currentExercise.targetReps}
          lastSet={getLastSet('mock-user-123', currentExercise.exerciseId, 1)}
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
                  <label className="text-base font-medium text-gray-700 mb-2 block">Weight (kg)</label>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const currentWeight = set.weight || 0;
                        const newWeight = Math.max(0, currentWeight - 2.5);
                        updateSet(currentExerciseIndex, setIndex, 'weight', newWeight);
                      }}
                      className="h-12 w-12 text-lg"
                    >
                      -
                    </Button>
                    <Input
                      type="number"
                      placeholder="0"
                      value={set.weight || ''}
                      onChange={(e) => updateSet(currentExerciseIndex, setIndex, 'weight', parseFloat(e.target.value) || undefined)}
                      className="text-center text-lg h-12 font-semibold"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const currentWeight = set.weight || 0;
                        const newWeight = currentWeight + 2.5;
                        updateSet(currentExerciseIndex, setIndex, 'weight', newWeight);
                      }}
                      className="h-12 w-12 text-lg"
                    >
                      +
                    </Button>
                  </div>
                </div>
                <div>
                  <label className="text-base font-medium text-gray-700 mb-2 block">Reps</label>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const currentReps = set.reps || 0;
                        const newReps = Math.max(0, currentReps - 1);
                        updateSet(currentExerciseIndex, setIndex, 'reps', newReps);
                      }}
                      className="h-12 w-12 text-lg"
                    >
                      -
                    </Button>
                    <Input
                      type="number"
                      placeholder="0"
                      value={set.reps || ''}
                      onChange={(e) => updateSet(currentExerciseIndex, setIndex, 'reps', parseInt(e.target.value) || undefined)}
                      className="text-center text-lg h-12 font-semibold"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const currentReps = set.reps || 0;
                        const newReps = currentReps + 1;
                        updateSet(currentExerciseIndex, setIndex, 'reps', newReps);
                      }}
                      className="h-12 w-12 text-lg"
                    >
                      +
                    </Button>
                  </div>
                </div>
                  />
                </div>
              </div>

              {!currentExercise.isSuperset && (
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
              )}
              
              {currentExercise.isSuperset && (
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-blue-800 font-medium">🔄 Superset Exercise</p>
                  <p className="text-xs text-blue-600 mt-1">
                    Complete this set, then immediately move to the next exercise in this superset with minimal rest.
                  </p>
                </div>
              )}

              {/* Quick Actions */}
              <div className="flex flex-wrap gap-2 pt-2 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (setIndex > 0) {
                      const prevSet = currentExercise.sets[setIndex - 1];
                      if (prevSet.weight) updateSet(currentExerciseIndex, setIndex, 'weight', prevSet.weight);
                      if (prevSet.reps) updateSet(currentExerciseIndex, setIndex, 'reps', prevSet.reps);
                    }
                  }}
                  className="text-xs"
                  disabled={setIndex === 0}
                >
                  📋 Copy Last Set
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const lastSet = getLastSet('mock-user-123', currentExercise.exerciseId, 1);
                    if (lastSet) {
                      updateSet(currentExerciseIndex, setIndex, 'weight', lastSet.weight_kg || 0);
                      updateSet(currentExerciseIndex, setIndex, 'reps', lastSet.reps || 0);
                    }
                  }}
                  className="text-xs"
                >
                  🔄 Use Last Workout
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const currentWeight = set.weight || 0;
                    updateSet(currentExerciseIndex, setIndex, 'weight', currentWeight + 2.5);
                  }}
                  className="text-xs bg-green-50 hover:bg-green-100"
                >
                  ⬆️ +2.5kg
                </Button>
              </div>

              <div>
                <label className="text-base font-medium text-gray-700">Difficulty</label>
                <div className="flex gap-2 mt-2">
                  {['easy', 'ok', 'hard'].map((difficulty) => (
                    <Button
                      key={difficulty}
                      variant={set.difficulty === difficulty ? "default" : "outline"}
                      size="sm"
                      className="flex-1 h-10"
                      onClick={() => updateSet(currentExerciseIndex, setIndex, 'difficulty', difficulty)}
                    >
                      {difficulty === 'easy' ? '😊 Easy' : difficulty === 'ok' ? '😐 OK' : '😤 Hard'}
                    </Button>
                  ))}
                </div>
              </div>

              {!currentExercise.isSuperset && (
                <div className="space-y-2">
                  <label className="text-base font-medium text-gray-700">Rest Timer</label>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => startRest(1, 0)}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      ⏱️ 1min
                    </Button>
                    <Button
                      onClick={() => startRest(2, 0)}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      ⏱️ 2min
                    </Button>
                    <Button
                      onClick={() => startRest(3, 0)}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      ⏱️ 3min
                    </Button>
                    {(set.restMinutes || set.restSeconds) && (
                      <Button
                        onClick={() => startRest(set.restMinutes || 0, set.restSeconds || 0)}
                        variant="default"
                        size="sm"
                        className="flex-1"
                      >
                        🎯 {(set.restMinutes || 0)}:{(set.restSeconds || 0).toString().padStart(2, '0')}
                      </Button>
                    )}
                  </div>
                </div>
              )}
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
          {/* Check if next exercise is part of the same superset */}
          {currentExercise.isSuperset && 
           currentExerciseIndex < exerciseData.length - 1 && 
           exerciseData[currentExerciseIndex + 1].supersetGroup === currentExercise.supersetGroup
            ? 'Next in Superset'
            : 'Next Exercise'
          }
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}