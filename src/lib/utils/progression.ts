// Lógica de sugestão de progressão baseada em heurística científica
// Baseado em RPE, dificuldade percebida e meta de repetições

export interface ProgressionInput {
  lastWeight: number;
  lastReps: number;
  targetReps: string; // "8-10", "6-12", etc.
  difficulty?: 'easy' | 'ok' | 'hard';
  rpe?: number;
  aggressiveness: 'conservative' | 'standard' | 'aggressive';
  exerciseType?: 'compound' | 'isolation';
}

export interface ProgressionSuggestion {
  suggestedWeight: number;
  rationale: string;
  percentageChange: number;
  previousWeight: number;
  previousReps: number;
  targetReps: string;
}

// Configurações de progressão por perfil de agressividade
const PROGRESSION_CONFIG = {
  conservative: {
    hit_easy: { min: 0, max: 2 },      // +0% a +2%
    hit_ok: { min: 0, max: 1 },        // +0% a +1%
    missed_hard: { min: -2, max: 0 },  // -2% a 0%
  },
  standard: {
    hit_easy: { min: 2.5, max: 4 },    // +2.5% a +4%
    hit_ok: { min: 0, max: 2.5 },      // +0% a +2.5%
    missed_hard: { min: -2.5, max: 0 }, // -2.5% a 0%
  },
  aggressive: {
    hit_easy: { min: 4, max: 6 },      // +4% a +6%
    hit_ok: { min: 1, max: 3 },        // +1% a +3%
    missed_hard: { min: -5, max: -2.5 }, // -5% a -2.5%
  },
};

// Incrementos mínimos por tipo de exercício
const MIN_INCREMENTS = {
  compound: 2.5,  // kg
  isolation: 1.25, // kg
};

function parseTargetReps(targetReps: string): { min: number; max: number } {
  const match = targetReps.match(/(\d+)(?:-(\d+))?/);
  if (!match) return { min: 8, max: 10 }; // default
  
  const min = parseInt(match[1]);
  const max = match[2] ? parseInt(match[2]) : min;
  return { min, max };
}

function determinePerformance(
  lastReps: number, 
  targetReps: string, 
  difficulty?: 'easy' | 'ok' | 'hard', 
  rpe?: number
): 'hit_easy' | 'hit_ok' | 'missed_hard' {
  const { min, max } = parseTargetReps(targetReps);
  const hitTarget = lastReps >= min && lastReps <= max;
  
  // Se não bateu a meta, sempre é 'missed_hard'
  if (!hitTarget) return 'missed_hard';
  
  // Se bateu a meta, verifica dificuldade
  if (difficulty) {
    if (difficulty === 'easy') return 'hit_easy';
    if (difficulty === 'ok') return 'hit_ok';
    if (difficulty === 'hard') return 'missed_hard'; // mesmo batendo meta, se foi difícil
  }
  
  // Se tem RPE, usa como referência
  if (rpe !== undefined) {
    if (rpe <= 7) return 'hit_easy';
    if (rpe <= 8.5) return 'hit_ok';
    return 'missed_hard';
  }
  
  // Default: hit_ok
  return 'hit_ok';
}

function calculatePercentageChange(
  performance: 'hit_easy' | 'hit_ok' | 'missed_hard',
  aggressiveness: 'conservative' | 'standard' | 'aggressive'
): number {
  const config = PROGRESSION_CONFIG[aggressiveness][performance];
  
  // Usa o valor médio do range
  return (config.min + config.max) / 2;
}

function applyMinimumIncrement(
  oldWeight: number,
  newWeight: number,
  exerciseType: 'compound' | 'isolation' = 'compound'
): number {
  const minIncrement = MIN_INCREMENTS[exerciseType];
  const difference = newWeight - oldWeight;
  
  // Se a diferença é positiva mas menor que o mínimo, aplica o mínimo
  if (difference > 0 && difference < minIncrement) {
    return oldWeight + minIncrement;
  }
  
  // Se a diferença é muito pequena (< 0.5kg), mantém o peso
  if (Math.abs(difference) < 0.5) {
    return oldWeight;
  }
  
  return newWeight;
}

function generateRationale(
  performance: 'hit_easy' | 'hit_ok' | 'missed_hard',
  percentageChange: number,
  lastReps: number,
  targetReps: string,
  difficulty?: 'easy' | 'ok' | 'hard',
  rpe?: number
): string {
  const { min, max } = parseTargetReps(targetReps);
  const difficultyText = difficulty ? ` e marcou '${difficulty}'` : '';
  const rpeText = rpe ? ` (RPE ${rpe})` : '';
  
  if (performance === 'hit_easy') {
    return `+${percentageChange.toFixed(1)}% porque bateu a meta (${lastReps}/${min}-${max})${difficultyText}${rpeText} com facilidade`;
  }
  
  if (performance === 'hit_ok') {
    if (percentageChange > 0) {
      return `+${percentageChange.toFixed(1)}% porque bateu a meta (${lastReps}/${min}-${max})${difficultyText}${rpeText} adequadamente`;
    } else {
      return `Mantém peso porque bateu a meta (${lastReps}/${min}-${max})${difficultyText}${rpeText} mas foi desafiador`;
    }
  }
  
  // missed_hard
  if (lastReps < min) {
    return `${percentageChange.toFixed(1)}% porque não bateu a meta (${lastReps}/${min}-${max})${difficultyText}${rpeText}`;
  } else {
    return `${percentageChange.toFixed(1)}% porque foi muito difícil${difficultyText}${rpeText} mesmo batendo meta`;
  }
}

export function calculateProgression(input: ProgressionInput): ProgressionSuggestion {
  const {
    lastWeight,
    lastReps,
    targetReps,
    difficulty,
    rpe,
    aggressiveness,
    exerciseType = 'compound'
  } = input;

  // Determina performance baseada em meta e dificuldade
  const performance = determinePerformance(lastReps, targetReps, difficulty, rpe);
  
  // Calcula mudança percentual
  const percentageChange = calculatePercentageChange(performance, aggressiveness);
  
  // Aplica mudança percentual
  let suggestedWeight = lastWeight * (1 + percentageChange / 100);
  
  // Aplica incremento mínimo
  suggestedWeight = applyMinimumIncrement(lastWeight, suggestedWeight, exerciseType);
  
  // Arredonda para 0.25kg (padrão de anilhas)
  suggestedWeight = Math.round(suggestedWeight * 4) / 4;
  
  // Gera explicação
  const rationale = generateRationale(
    performance, 
    percentageChange, 
    lastReps, 
    targetReps, 
    difficulty, 
    rpe
  );

  return {
    suggestedWeight,
    rationale,
    percentageChange,
    previousWeight: lastWeight,
    previousReps: lastReps,
    targetReps,
  };
}

// Função helper para converter unidades
export function convertWeight(weight: number, fromUnit: 'kg' | 'lb', toUnit: 'kg' | 'lb'): number {
  if (fromUnit === toUnit) return weight;
  
  if (fromUnit === 'kg' && toUnit === 'lb') {
    return weight * 2.20462;
  }
  
  if (fromUnit === 'lb' && toUnit === 'kg') {
    return weight / 2.20462;
  }
  
  return weight;
}

// Função para estimar 1RM usando fórmula de Epley
export function calculate1RM(weight: number, reps: number): number {
  if (reps === 1) return weight;
  return weight * (1 + reps / 30);
}

