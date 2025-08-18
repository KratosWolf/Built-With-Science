'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { calculateProgression } from '@/lib/utils/progression';
import { type LastSetCache } from '@/lib/mock-data/workout-data';

interface ProgressionSuggestionProps {
  exerciseId: number;
  exerciseName: string;
  targetReps: string;
  lastSet?: LastSetCache;
  onAcceptSuggestion: (weight: number, reps: number) => void;
  userAggressiveness?: 'conservative' | 'standard' | 'aggressive';
}

export function ProgressionSuggestion({
  exerciseId,
  exerciseName,
  targetReps,
  lastSet,
  onAcceptSuggestion,
  userAggressiveness = 'standard'
}: ProgressionSuggestionProps) {
  if (!lastSet) {
    return (
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-blue-800">💡 First Time</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-blue-700">
            This is your first time doing {exerciseName}. Start with a comfortable weight and focus on proper form.
          </p>
        </CardContent>
      </Card>
    );
  }

  const suggestion = calculateProgression({
    lastWeight: lastSet.weight_kg || 0,
    lastReps: lastSet.reps || 0,
    targetReps,
    aggressiveness: userAggressiveness
  });

  if (!suggestion) {
    return null;
  }

  const isIncrease = suggestion.suggestedWeight > (lastSet.weight_kg || 0);
  const cardColor = isIncrease ? 'green' : suggestion.suggestedWeight === (lastSet.weight_kg || 0) ? 'blue' : 'orange';

  return (
    <Card className={`border-${cardColor}-200 bg-${cardColor}-50`}>
      <CardHeader className="pb-3">
        <CardTitle className={`text-sm text-${cardColor}-800 flex items-center gap-2`}>
          {isIncrease ? '📈' : suggestion.suggested_weight === (lastSet.weight_kg || 0) ? '🎯' : '📉'} 
          Smart Suggestion
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className={`text-lg font-bold text-${cardColor}-700`}>
                {suggestion.suggestedWeight} kg
              </div>
              <div className={`text-sm text-${cardColor}-600`}>
                {suggestion.percentageChange > 0 ? '+' : ''}{suggestion.percentageChange.toFixed(1)}% from last time
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Last time</div>
              <div className="text-sm font-medium">
                {lastSet.weight_kg} kg × {lastSet.reps} reps
              </div>
            </div>
          </div>
          
          <div className={`text-sm text-${cardColor}-700 bg-white/50 p-3 rounded`}>
            <strong>Why this weight?</strong> {suggestion.rationale}
          </div>
          
          <Button 
            onClick={() => onAcceptSuggestion(suggestion.suggestedWeight, parseInt(targetReps.split('-')[0]))}
            className={`w-full bg-${cardColor}-600 hover:bg-${cardColor}-700`}
          >
            Use Suggestion ({suggestion.suggestedWeight} kg)
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
