// Exercícios baseados no CSV do usuário - Programa 3 dias Built With Science
// Sistema inteligente com cache de último treino e sugestões automáticas

import { Exercise, ExerciseVariation } from './workout-data';

// Exercícios do programa 3 dias do usuário
export const userExercises: Exercise[] = [
  // PEITO
  { id: 1, name: "Barbell Bench Press" },
  { id: 2, name: "Flat Dumbbell Press" },
  { id: 3, name: "Flat Machine Chest Press" },
  { id: 4, name: "Flat Smith Machine Chest Press" },
  { id: 5, name: "Seated Flat Cable Press" },
  { id: 6, name: "Neutral Grip DB Press*" },
  
  // COSTAS/POSTERIOR
  { id: 7, name: "Barbell Romanian Deadlift" },
  { id: 8, name: "Dumbbell Romanian Deadlift" },
  { id: 9, name: "Hyperextensions (back/hamstring)" },
  { id: 10, name: "(Weighted) Pull-Ups" },
  { id: 11, name: "(Weighted) Chin-Ups" },
  { id: 12, name: "Banded Pull-Ups" },
  { id: 13, name: "Pull-Up Negatives" },
  { id: 14, name: "Kneeling Lat Pulldown" },
  { id: 15, name: "Lat Pulldown" },
  { id: 16, name: "Inverted Row" },
  
  // PERNAS/QUADRÍCEPS
  { id: 17, name: "Walking Lunges (quad focus)" },
  { id: 18, name: "Heel Elevated Split Squat" },
  { id: 19, name: "Bulgarian Split Squat (quad focus)" },
  { id: 20, name: "Reverse Lunges*" },
  { id: 21, name: "Weighted Step-Ups*" },
  
  // PEITO - ISOLAMENTO
  { id: 22, name: "Standing Mid-Chest Cable Fly" },
  { id: 23, name: "Seated Mid-Chest Cable Fly" },
  { id: 24, name: "Pec-Deck Machine Fly" },
  { id: 25, name: "Dumbbell Fly" },
  { id: 26, name: "Banded Push-Ups" },
  
  // OMBROS
  { id: 27, name: "Dumbbell Lateral Raise" },
  { id: 28, name: "Cable Lateral Raise" },
  { id: 29, name: "Lying Incline Lateral Raise" },
  { id: 30, name: "Lean In Lateral Raise" },
  { id: 31, name: "Wide Grip BB Upright Row (last resort)" },
  
  // PANTURRILHAS
  { id: 32, name: "Single Leg Weighted Calf Raise" },
  { id: 33, name: "Toes-Elevated Smith Machine Calf Raise" },
  { id: 34, name: "Standing Weighted Calf Raise" },
  { id: 35, name: "Leg Press Calf Raise" },
  
  // POSTERIOR DELTÓIDE
  { id: 36, name: "Standing Face Pulls" },
  { id: 37, name: "Bent Over Dumbbell Face Pulls" },
  { id: 38, name: "(Weighted) Prone Arm Circles" },
  { id: 39, name: "Wall Slides" },
];

// Variações de exercícios com URLs reais do programa favorito do usuário
export const userExerciseVariations: ExerciseVariation[] = [
  // BARBELL BENCH PRESS (id: 1) - 6 variações
  { id: 1, exercise_id: 1, variation_index: 1, variation_name: "Barbell Bench Press", youtube_url: "https://youtu.be/pCGVSBk0bIQ", is_primary: true },
  { id: 2, exercise_id: 1, variation_index: 2, variation_name: "Flat Dumbbell Press", youtube_url: "https://youtu.be/g14dhC5KYBM" },
  { id: 3, exercise_id: 1, variation_index: 3, variation_name: "Flat Machine Chest Press", youtube_url: "https://youtu.be/sO8lFa9CidE" },
  { id: 4, exercise_id: 1, variation_index: 4, variation_name: "Flat Smith Machine Chest Press", youtube_url: "https://youtu.be/3Z3C44SXSQE" },
  { id: 5, exercise_id: 1, variation_index: 5, variation_name: "Seated Flat Cable Press", youtube_url: "https://youtu.be/hPpNTAEDnxM" },
  { id: 6, exercise_id: 1, variation_index: 6, variation_name: "Neutral Grip DB Press*", youtube_url: "https://youtu.be/N-kUwH1uf9c" },

  // BARBELL ROMANIAN DEADLIFT (id: 7)
  { id: 7, exercise_id: 7, variation_index: 1, variation_name: "Barbell Romanian Deadlift", youtube_url: "https://youtu.be/Q-2telZDPRw", is_primary: true },
  { id: 8, exercise_id: 8, variation_index: 1, variation_name: "Dumbbell Romanian Deadlift", youtube_url: "https://youtu.be/Xu4DxwKWzl4", is_primary: true },
  { id: 9, exercise_id: 8, variation_index: 2, variation_name: "Dumbbell Romanian Deadlift", youtube_url: "https://youtu.be/Xu4DxwKWzl4" },
  { id: 10, exercise_id: 9, variation_index: 1, variation_name: "Hyperextensions (back/hamstring)", youtube_url: "https://youtu.be/RU5d2H_OmSc", is_primary: true },

  // (WEIGHTED) PULL-UPS (id: 10) - 7 variações  
  { id: 11, exercise_id: 10, variation_index: 1, variation_name: "(Weighted) Pull-Ups", youtube_url: "https://youtu.be/w_yuTRQd6HA", is_primary: true },
  { id: 12, exercise_id: 10, variation_index: 2, variation_name: "(Weighted) Chin-Ups", youtube_url: "https://youtu.be/-TZRdvUS7Qo" },
  { id: 13, exercise_id: 10, variation_index: 3, variation_name: "Banded Pull-Ups", youtube_url: "https://youtu.be/VGm-f5-T5no" },
  { id: 14, exercise_id: 10, variation_index: 4, variation_name: "Pull-Up Negatives", youtube_url: "https://youtu.be/SyMSay4zrsA" },
  { id: 15, exercise_id: 10, variation_index: 5, variation_name: "Kneeling Lat Pulldown", youtube_url: "https://youtu.be/4LxKeTqlpZA" },
  { id: 16, exercise_id: 10, variation_index: 6, variation_name: "Lat Pulldown", youtube_url: "https://youtu.be/AvYZZhEl7Xk" },
  { id: 17, exercise_id: 10, variation_index: 7, variation_name: "Inverted Row", youtube_url: "https://youtu.be/SyMSay4zrsA" },

  // WALKING LUNGES (id: 17) - 5 variações
  { id: 18, exercise_id: 17, variation_index: 1, variation_name: "Walking Lunges (quad focus)", youtube_url: "https://youtu.be/JB20RuTOaFc", is_primary: true },
  { id: 19, exercise_id: 17, variation_index: 2, variation_name: "Heel Elevated Split Squat", youtube_url: "https://youtu.be/bJE0-eZLa6E" },
  { id: 20, exercise_id: 17, variation_index: 3, variation_name: "Bulgarian Split Squat (quad focus)", youtube_url: "https://youtu.be/r9XtxWSTlcg" },
  { id: 21, exercise_id: 17, variation_index: 4, variation_name: "Reverse Lunges*", youtube_url: "https://youtu.be/AUEGDvCrQJA" },
  { id: 22, exercise_id: 17, variation_index: 5, variation_name: "Weighted Step-Ups*", youtube_url: "https://youtu.be/Cjc3AgmdtlA" },

  // SUPERSET A - STANDING MID-CHEST CABLE FLY (id: 22) - 5 variações
  { id: 23, exercise_id: 22, variation_index: 1, variation_name: "Standing Mid-Chest Cable Fly", youtube_url: "https://youtu.be/fyFVaCP9J-8", is_primary: true },
  { id: 24, exercise_id: 22, variation_index: 2, variation_name: "Seated Mid-Chest Cable Fly", youtube_url: "https://youtu.be/Y8E3dHNsSTU" },
  { id: 25, exercise_id: 22, variation_index: 3, variation_name: "Pec-Deck Machine Fly", youtube_url: "https://youtu.be/rnV3y1P7894" },
  { id: 26, exercise_id: 22, variation_index: 4, variation_name: "Dumbbell Fly", youtube_url: "https://youtu.be/WRn2hqy0gXU" },
  { id: 27, exercise_id: 22, variation_index: 5, variation_name: "Banded Push-Ups", youtube_url: "https://youtu.be/dI7LVElfMOg" },

  // SUPERSET A - DUMBBELL LATERAL RAISE (id: 27) - 5 variações
  { id: 28, exercise_id: 27, variation_index: 1, variation_name: "Dumbbell Lateral Raise", youtube_url: "https://youtu.be/zcO3sgAeLA0", is_primary: true },
  { id: 29, exercise_id: 27, variation_index: 2, variation_name: "Cable Lateral Raise", youtube_url: "https://youtu.be/1muit9qEctY" },
  { id: 30, exercise_id: 27, variation_index: 3, variation_name: "Lying Incline Lateral Raise", youtube_url: "https://youtu.be/upEqeI0F73M" },
  { id: 31, exercise_id: 27, variation_index: 4, variation_name: "Lean In Lateral Raise", youtube_url: "https://youtu.be/2q4kjTDg-vs" },
  { id: 32, exercise_id: 27, variation_index: 5, variation_name: "Wide Grip BB Upright Row (last resort)", youtube_url: "https://youtu.be/6BTMVh9AnCw" },

  // SUPERSET B - SINGLE LEG WEIGHTED CALF RAISE (id: 32) - 4 variações
  { id: 33, exercise_id: 32, variation_index: 1, variation_name: "Single Leg Weighted Calf Raise", youtube_url: "https://youtu.be/cRKA_Qdut7I", is_primary: true },
  { id: 34, exercise_id: 32, variation_index: 2, variation_name: "Toes-Elevated Smith Machine Calf Raise", youtube_url: "https://youtu.be/_ChZv2iluM8" },
  { id: 35, exercise_id: 32, variation_index: 3, variation_name: "Standing Weighted Calf Raise", youtube_url: "https://youtu.be/q2Eigaa9dKU" },
  { id: 36, exercise_id: 32, variation_index: 4, variation_name: "Leg Press Calf Raise", youtube_url: "https://youtu.be/s8yUXsZrgE0" },

  // SUPERSET B - STANDING FACE PULLS (id: 36) - 4 variações
  { id: 37, exercise_id: 36, variation_index: 1, variation_name: "Standing Face Pulls", youtube_url: "https://youtu.be/02g7XtSRXug", is_primary: true },
  { id: 38, exercise_id: 36, variation_index: 2, variation_name: "Bent Over Dumbbell Face Pulls", youtube_url: "https://youtu.be/kA415Unr-_E" },
  { id: 39, exercise_id: 36, variation_index: 3, variation_name: "(Weighted) Prone Arm Circles", youtube_url: "https://youtu.be/6D-4V_M8RJA" },
  { id: 40, exercise_id: 36, variation_index: 4, variation_name: "Wall Slides", youtube_url: "https://youtu.be/x4zjfuLXHVk" },
];

// Programa 3 dias - Treino A (Full Body A)
export const day1Exercises = [
  { exercise_id: 1, sets: 3, reps_target: "8-10" },  // Barbell Bench Press
  { exercise_id: 7, sets: 3, reps_target: "8-10" },  // Barbell Romanian Deadlift  
  { exercise_id: 10, sets: 3, reps_target: "6-12" }, // (Weighted) Pull-Ups
  { exercise_id: 17, sets: 3, reps_target: "8-10 per leg" }, // Walking Lunges (quad focus)
  
  // Superset A
  { exercise_id: 22, sets: 3, reps_target: "10-15", is_superset: true, superset_label: "A", superset_exercise_label: "A1" }, // Standing Mid-Chest Cable Fly
  { exercise_id: 27, sets: 3, reps_target: "15-20", is_superset: true, superset_label: "A", superset_exercise_label: "A2" }, // Dumbbell Lateral Raise
  
  // Superset B
  { exercise_id: 32, sets: 3, reps_target: "10-15", is_superset: true, superset_label: "B", superset_exercise_label: "B1" }, // Single Leg Weighted Calf Raise
  { exercise_id: 36, sets: 3, reps_target: "10", is_superset: true, superset_label: "B", superset_exercise_label: "B2" }, // Standing Face Pulls
];

// Função para obter exercício por ID
export function getUserExerciseById(id: number): Exercise | undefined {
  return userExercises.find(ex => ex.id === id);
}

// Função para obter variações de um exercício (sempre primeira é padrão)
export function getUserExerciseVariations(exerciseId: number): ExerciseVariation[] {
  const variations = userExerciseVariations.filter(ev => ev.exercise_id === exerciseId);
  // Garantir que a primeira variação (is_primary) vem primeiro
  return variations.sort((a, b) => {
    if (a.is_primary && !b.is_primary) return -1;
    if (!a.is_primary && b.is_primary) return 1;
    return a.variation_index - b.variation_index;
  });
}

// Função para obter URL do exercício selecionado
export function getExerciseVideoUrl(exerciseId: number, variationIndex: number = 1): string {
  const variation = userExerciseVariations.find(
    ev => ev.exercise_id === exerciseId && ev.variation_index === variationIndex
  );
  return variation?.youtube_url || '';
}

// Sistema inteligente de sugestão de progressão
export interface ProgressionSuggestion {
  type: 'weight' | 'reps' | 'both';
  current: { weight?: number; reps?: number };
  suggested: { weight?: number; reps?: number };
  reason: string;
}

export function getProgressionSuggestion(
  lastWeight: number,
  lastReps: number,
  difficulty: 'easy' | 'medium' | 'hard' | 'max_effort' | 'failed',
  targetRepsRange: string
): ProgressionSuggestion {
  const [minReps, maxReps] = targetRepsRange.split('-').map(r => parseInt(r.replace(/\D/g, '')));
  
  if (difficulty === 'easy') {
    if (lastReps < maxReps) {
      // Aumentar 1 rep até chegar no máximo
      return {
        type: 'reps',
        current: { weight: lastWeight, reps: lastReps },
        suggested: { weight: lastWeight, reps: lastReps + 1 },
        reason: `Última série foi fácil. Aumente para ${lastReps + 1} reps.`
      };
    } else {
      // Já está no máximo de reps, aumentar peso e voltar pro mínimo
      const suggestedWeight = lastWeight + (lastWeight * 0.025); // 2.5% de aumento
      return {
        type: 'weight',
        current: { weight: lastWeight, reps: lastReps },
        suggested: { weight: Math.round(suggestedWeight * 2) / 2, reps: minReps },
        reason: `Máximo de reps atingido com facilidade. Aumente peso para ${Math.round(suggestedWeight * 2) / 2}kg e volte para ${minReps} reps.`
      };
    }
  } else if (difficulty === 'hard' && lastReps > minReps) {
    // Diminuir 1 rep
    return {
      type: 'reps',
      current: { weight: lastWeight, reps: lastReps },
      suggested: { weight: lastWeight, reps: lastReps - 1 },
      reason: `Última série foi difícil. Mantenha peso e faça ${lastReps - 1} reps.`
    };
  } else if (difficulty === 'failed') {
    // Diminuir peso em 5-10%
    const suggestedWeight = lastWeight * 0.925; // Reduzir 7.5%
    return {
      type: 'weight',
      current: { weight: lastWeight, reps: lastReps },
      suggested: { weight: Math.round(suggestedWeight * 2) / 2, reps: lastReps },
      reason: `Falha na execução. Reduza peso para ${Math.round(suggestedWeight * 2) / 2}kg.`
    };
  } else {
    // Manter igual (medium, max_effort ou edge cases)
    return {
      type: 'both',
      current: { weight: lastWeight, reps: lastReps },
      suggested: { weight: lastWeight, reps: lastReps },
      reason: difficulty === 'medium' ? 'Carga adequada. Mantenha peso e reps.' : 'Mantenha a carga atual.'
    };
  }
}