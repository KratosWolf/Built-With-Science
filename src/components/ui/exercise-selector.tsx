'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  getUserExerciseById, 
  getUserExerciseVariations, 
  getExerciseVideoUrl,
  getProgressionSuggestion,
  type ProgressionSuggestion 
} from '@/lib/mock-data/user-exercises';
import type { ExerciseVariation } from '@/lib/mock-data/workout-data';
import { Play, ExternalLink } from 'lucide-react';

interface ExerciseSelectorProps {
  exerciseId: number;
  sets: number;
  repsTarget: string;
  isSuperset?: boolean;
  supersetLabel?: string;
  onDataChange?: (data: ExerciseSetData) => void;
}

interface ExerciseSetData {
  exerciseId: number;
  selectedVariationIndex: number;
  videoUrl: string;
  sets: Array<{
    setNumber: number;
    weight?: number;
    reps?: number;
    difficulty?: 'easy' | 'medium' | 'hard' | 'max_effort' | 'failed';
  }>;
}

interface LastExerciseCache {
  exerciseId: number;
  variationIndex: number;
  weight: number;
  reps: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'max_effort' | 'failed';
  updatedAt: string;
}

export function ExerciseSelector({ 
  exerciseId, 
  sets, 
  repsTarget, 
  isSuperset, 
  supersetLabel,
  onDataChange 
}: ExerciseSelectorProps) {
  const exercise = getUserExerciseById(exerciseId);
  const variations = getUserExerciseVariations(exerciseId);
  
  const [selectedVariationIndex, setSelectedVariationIndex] = useState(1);
  const [exerciseSets, setExerciseSets] = useState<ExerciseSetData['sets']>([]);
  const [lastCache, setLastCache] = useState<LastExerciseCache | null>(null);
  const [suggestion, setSuggestion] = useState<ProgressionSuggestion | null>(null);

  // Carregar cache do último treino
  useEffect(() => {
    const cacheKey = `exercise_cache_${exerciseId}`;
    const cached = localStorage.getItem(cacheKey);
    
    if (cached) {
      try {
        const parsedCache: LastExerciseCache = JSON.parse(cached);
        setLastCache(parsedCache);
        setSelectedVariationIndex(parsedCache.variationIndex);
        
        // Gerar sugestão baseada no último treino
        const progressionSuggestion = getProgressionSuggestion(
          parsedCache.weight,
          parsedCache.reps,
          parsedCache.difficulty,
          repsTarget
        );
        setSuggestion(progressionSuggestion);
        
        // Pré-preencher com dados sugeridos
        const newSets = Array.from({ length: sets }, (_, index) => ({
          setNumber: index + 1,
          weight: progressionSuggestion.suggested.weight || parsedCache.weight,
          reps: progressionSuggestion.suggested.reps || parsedCache.reps,
          difficulty: 'medium' as const
        }));
        setExerciseSets(newSets);
        
      } catch (error) {
        console.warn('Error parsing exercise cache:', error);
      }
    } else {
      // Inicializar sets vazios se não há cache
      const newSets = Array.from({ length: sets }, (_, index) => ({
        setNumber: index + 1,
      }));
      setExerciseSets(newSets);
    }
  }, [exerciseId, sets, repsTarget]);

  // Salvar cache quando dados mudarem
  const saveToCache = (setData: ExerciseSetData['sets'][0]) => {
    if (setData.weight && setData.reps && setData.difficulty) {
      const cacheData: LastExerciseCache = {
        exerciseId,
        variationIndex: selectedVariationIndex,
        weight: setData.weight,
        reps: setData.reps,
        difficulty: setData.difficulty,
        updatedAt: new Date().toISOString()
      };
      
      const cacheKey = `exercise_cache_${exerciseId}`;
      localStorage.setItem(cacheKey, JSON.stringify(cacheData));
    }
  };

  const updateSetData = (setIndex: number, field: string, value: any) => {
    const newSets = [...exerciseSets];
    newSets[setIndex] = { ...newSets[setIndex], [field]: value };
    setExerciseSets(newSets);
    
    // Salvar no cache se o set está completo
    if (field === 'difficulty' && newSets[setIndex].weight && newSets[setIndex].reps) {
      saveToCache(newSets[setIndex]);
    }
    
    // Notificar componente pai
    if (onDataChange) {
      onDataChange({
        exerciseId,
        selectedVariationIndex,
        videoUrl: getExerciseVideoUrl(exerciseId, selectedVariationIndex),
        sets: newSets
      });
    }
  };

  const handleVariationChange = (newVariationIndex: string) => {
    const varIndex = parseInt(newVariationIndex);
    setSelectedVariationIndex(varIndex);
  };

  const currentVideoUrl = getExerciseVideoUrl(exerciseId, selectedVariationIndex);
  const selectedVariation = variations.find(v => v.variation_index === selectedVariationIndex);

  if (!exercise || variations.length === 0) {
    return (
      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="text-red-500">Exercício não encontrado (ID: {exerciseId})</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`mb-6 ${isSuperset ? 'border-l-4 border-l-blue-500' : ''}`}>
      <CardContent className="p-6">
        {/* Header do Exercício */}
        <div className="flex items-center gap-4 mb-4">
          {isSuperset && (
            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
              {supersetLabel}
            </div>
          )}
          <div className="flex-1">
            <h3 className="text-lg font-semibold">{exercise.name}</h3>
            <div className="text-sm text-gray-500">
              {sets} sets • {repsTarget} reps
            </div>
          </div>
        </div>

        {/* Dropdown de Variações */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Variação do Exercício:
          </label>
          <Select
            value={selectedVariationIndex.toString()}
            onValueChange={handleVariationChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione uma variação" />
            </SelectTrigger>
            <SelectContent>
              {variations.map((variation) => (
                <SelectItem 
                  key={variation.id} 
                  value={variation.variation_index.toString()}
                >
                  <div className="flex items-center gap-2">
                    {variation.is_primary && (
                      <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs">
                        PRINCIPAL
                      </span>
                    )}
                    {variation.variation_name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* URL do Vídeo */}
        {currentVideoUrl && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Play className="h-4 w-4 text-red-600" />
                <span className="text-sm font-medium">Tutorial:</span>
                <span className="text-sm text-gray-600 truncate max-w-xs">
                  {selectedVariation?.variation_name}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(currentVideoUrl, '_blank')}
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-3 w-3" />
                Abrir
              </Button>
            </div>
          </div>
        )}

        {/* Sugestão de Progressão */}
        {suggestion && lastCache && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-2">
              <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                SUGESTÃO
              </div>
              <div className="text-sm">
                <div className="font-medium text-blue-900 mb-1">
                  Baseado no último treino:
                </div>
                <div className="text-blue-700">
                  {suggestion.reason}
                </div>
                <div className="text-xs text-blue-600 mt-1">
                  Último: {lastCache.weight}kg × {lastCache.reps} reps ({lastCache.difficulty})
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sets */}
        <div className="space-y-3">
          {exerciseSets.map((set, index) => (
            <div key={set.setNumber} className="flex items-center gap-3 p-3 border rounded-lg">
              <div className="text-sm font-medium w-16">
                Set {set.setNumber}:
              </div>
              
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="Peso (kg)"
                  value={set.weight || ''}
                  onChange={(e) => updateSetData(index, 'weight', parseFloat(e.target.value) || undefined)}
                  className="w-24"
                />
                <span className="text-sm text-gray-500">kg</span>
              </div>

              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="Reps"
                  value={set.reps || ''}
                  onChange={(e) => updateSetData(index, 'reps', parseInt(e.target.value) || undefined)}
                  className="w-20"
                />
                <span className="text-sm text-gray-500">reps</span>
              </div>

              <Select
                value={set.difficulty || ''}
                onValueChange={(value) => updateSetData(index, 'difficulty', value)}
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Dificuldade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">😎 Easy - I could have done 3 more reps</SelectItem>
                  <SelectItem value="medium">😊 Medium - I could have done 2 more reps</SelectItem>
                  <SelectItem value="hard">😅 Hard - I could have done 1 more rep</SelectItem>
                  <SelectItem value="max_effort">🔥 Max effort - I could not have done any more reps</SelectItem>
                  <SelectItem value="failed">💥 Failed - I tried to do another rep but couldn't</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}