'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExerciseSelector } from '@/components/ui/exercise-selector';
import { RestTimer } from '@/components/ui/rest-timer';
import { day1Exercises } from '@/lib/mock-data/user-exercises';
import { ArrowLeft, Timer, CheckCircle } from 'lucide-react';

export default function WorkoutPage() {
  const params = useParams();
  const programId = parseInt(params.id as string);
  const dayId = parseInt(params.dayId as string);
  
  const [isWorkoutStarted, setIsWorkoutStarted] = useState(false);
  const [completedExercises, setCompletedExercises] = useState<Set<number>>(new Set());
  const [currentExercise, setCurrentExercise] = useState(0);
  const [showRestTimer, setShowRestTimer] = useState(false);
  const [restDuration, setRestDuration] = useState(120); // 2 minutos padrão

  // Para este exemplo, usamos os exercícios do dia 1 (Full Body A)
  const exercises = day1Exercises;

  const handleExerciseComplete = (exerciseId: number) => {
    setCompletedExercises(prev => new Set(prev).add(exerciseId));
    
    // Se não é o último exercício, mostrar timer de descanso
    if (currentExercise < exercises.length - 1) {
      setShowRestTimer(true);
    }
  };

  const handleRestComplete = () => {
    setShowRestTimer(false);
    setCurrentExercise(prev => Math.min(prev + 1, exercises.length - 1));
  };

  const allExercisesCompleted = exercises.length > 0 && completedExercises.size === exercises.length;

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button asChild variant="outline">
            <Link href={`/programs/${programId}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Full Body A</h1>
            <p className="text-gray-600">Programa 3 dias • Treino 1</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-sm text-gray-500">Progresso</div>
            <div className="text-lg font-semibold">
              {completedExercises.size}/{exercises.length}
            </div>
          </div>
          {allExercisesCompleted && (
            <CheckCircle className="h-8 w-8 text-green-600" />
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(completedExercises.size / exercises.length) * 100}%` }}
          />
        </div>
        <div className="text-sm text-gray-500 mt-1">
          {Math.round((completedExercises.size / exercises.length) * 100)}% concluído
        </div>
      </div>

      {/* Rest Timer Overlay */}
      {showRestTimer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-96">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Timer className="h-5 w-5" />
                Tempo de Descanso
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RestTimer
                initialDuration={restDuration}
                onComplete={handleRestComplete}
                onSkip={handleRestComplete}
              />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Success Message */}
      {allExercisesCompleted && (
        <Card className="mb-6 border-green-200 bg-green-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <h3 className="text-lg font-semibold text-green-900">
                  Parabéns! Treino concluído! 🎉
                </h3>
                <p className="text-green-700">
                  Você completou todos os exercícios do Full Body A.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Exercises */}
      <div className="space-y-6">
        {exercises.map((exercise, index) => {
          const isCompleted = completedExercises.has(exercise.exercise_id);
          const isCurrent = index === currentExercise;
          const isSuperset = exercise.is_superset;
          
          return (
            <div 
              key={`${exercise.exercise_id}-${exercise.superset_exercise_label || ''}`}
              className={`transition-all duration-300 ${
                isCompleted ? 'opacity-75' : ''
              } ${
                isCurrent ? 'ring-2 ring-blue-500 ring-offset-2' : ''
              }`}
            >
              <ExerciseSelector
                exerciseId={exercise.exercise_id}
                sets={exercise.sets}
                repsTarget={exercise.reps_target}
                isSuperset={isSuperset}
                supersetLabel={exercise.superset_exercise_label}
                onDataChange={(data) => {
                  // Verificar se todos os sets foram completados
                  const completedSets = data.sets.filter(set => 
                    set.weight && set.reps && set.difficulty
                  ).length;
                  
                  if (completedSets === exercise.sets) {
                    handleExerciseComplete(exercise.exercise_id);
                  }
                }}
              />
              
              {isCompleted && (
                <div className="text-center mb-4">
                  <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    <CheckCircle className="h-4 w-4" />
                    Exercício Concluído
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Navigation */}
      {!allExercisesCompleted && (
        <div className="flex justify-center mt-8 space-x-4">
          <Button 
            variant="outline"
            onClick={() => setCurrentExercise(prev => Math.max(0, prev - 1))}
            disabled={currentExercise === 0}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Anterior
          </Button>
          
          <Button 
            onClick={() => setCurrentExercise(prev => Math.min(exercises.length - 1, prev + 1))}
            disabled={currentExercise === exercises.length - 1}
          >
            Próximo
            <Timer className="h-4 w-4 ml-2" />
          </Button>
        </div>
      )}

      {allExercisesCompleted && (
        <div className="flex justify-center mt-8">
          <Button asChild size="lg">
            <Link href={`/programs/${programId}`}>
              Finalizar Treino
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}