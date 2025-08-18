// Mock data baseado nos CSVs reais fornecidos
// Dados estruturados para desenvolvimento offline-first

export interface Program {
  id: number;
  name: string;
}

export interface ProgramDay {
  id: number;
  program_id: number;
  day_index: number;
  day_name: string;
  program_name: string;
}

export interface Exercise {
  id: number;
  name: string;
}

export interface DayExercise {
  id: number;
  program_day_id: number;
  exercise_id: number;
  order_pos: number;
  set_target: number;
}

export interface DayExerciseSet {
  id: number;
  day_exercise_id: number;
  set_number: number;
  reps_target: string;
}

export interface ExerciseVariation {
  id: number;
  exercise_id: number;
  variation_index: number;
  variation_name: string;
  youtube_url: string;
}

export interface User {
  id: string;
  email: string;
  display_name: string;
  unit: 'kg' | 'lb';
  suggestion_aggressiveness: 'conservative' | 'standard' | 'aggressive';
  video_pref: 'youtube' | 'guide' | 'smart';
}

export interface WorkoutSession {
  id: number;
  user_id: string;
  program_id: number;
  program_day_id: number;
  started_at: string;
  finished_at?: string;
  status: 'in_progress' | 'done';
}

export interface WorkoutSet {
  id: number;
  session_id: number;
  exercise_id: number;
  variation_index?: number;
  set_number: number;
  weight_kg?: number;
  reps?: number;
  rest_sec?: number;
  rpe?: number;
  difficulty?: 'easy' | 'ok' | 'hard';
  created_at: string;
}

export interface LastSetCache {
  user_id: string;
  exercise_id: number;
  variation_index?: number;
  weight_kg?: number;
  reps?: number;
  rest_sec?: number;
  updated_at: string;
}

// Mock data baseado nos CSVs
export const mockPrograms: Program[] = [
  { id: 1, name: "3-day Program" },
  { id: 2, name: "4-day Program" },
  { id: 3, name: "5-day Program" }
];

export const mockProgramDays: ProgramDay[] = [
  { id: 1, program_id: 1, day_index: 1, day_name: "Full Body A", program_name: "3-day Program" },
  { id: 2, program_id: 1, day_index: 2, day_name: "Full Body B", program_name: "3-day Program" },
  { id: 3, program_id: 1, day_index: 3, day_name: "Full Body C", program_name: "3-day Program" },
  { id: 4, program_id: 2, day_index: 1, day_name: "Upper 1", program_name: "4-day Program" },
  { id: 5, program_id: 2, day_index: 2, day_name: "Lower 1 (Quad Focus)", program_name: "4-day Program" },
  { id: 6, program_id: 2, day_index: 3, day_name: "Upper 2", program_name: "4-day Program" },
  { id: 7, program_id: 2, day_index: 4, day_name: "Lower 2 (Glute Focus)", program_name: "4-day Program" },
  { id: 8, program_id: 3, day_index: 1, day_name: "Upper", program_name: "5-day Program" },
  { id: 9, program_id: 3, day_index: 2, day_name: "Lower 1 (Quad Focus)", program_name: "5-day Program" },
  { id: 10, program_id: 3, day_index: 3, day_name: "Push", program_name: "5-day Program" },
  { id: 11, program_id: 3, day_index: 4, day_name: "Pull", program_name: "5-day Program" },
  { id: 12, program_id: 3, day_index: 5, day_name: "Lower 2 (Glute Focus)", program_name: "5-day Program" }
];

export const mockExercises: Exercise[] = [
  { id: 1, name: "Barbell Back Squat" },
  { id: 2, name: "Barbell Bench Press" },
  { id: 3, name: "Barbell Deadlift" },
  { id: 4, name: "Barbell Hip Thrust" },
  { id: 5, name: "Barbell Row (lat focus)" },
  { id: 6, name: "Cable Lateral Raise" },
  { id: 7, name: "Cable Pushdowns*" },
  { id: 8, name: "Dumbbell Fly" },
  { id: 9, name: "Dumbbell Lateral Raise" },
  { id: 10, name: "Dumbbell Romanian Deadlift" },
  { id: 11, name: "Flat Dumbbell Press" },
  { id: 12, name: "Hammer Curls" },
  { id: 13, name: "Incline DB Overhead Extensions" },
  { id: 14, name: "Incline Dumbbell Curls" },
  { id: 15, name: "Kneeling Lat Pulldown" },
  { id: 16, name: "Lat Focused Cable Row" },
  { id: 17, name: "Lat Pulldown" },
  { id: 18, name: "Low Incline Dumbbell Press" },
  { id: 19, name: "Lying Leg Curls" },
  { id: 20, name: "Quad-Focused Leg Press" },
  { id: 21, name: "Rear Delt Cable Row" },
  { id: 22, name: "Seated Cable Row (mid/upper back)" },
  { id: 23, name: "Seated Dumbbell Curls" },
  { id: 24, name: "Seated Dumbbell Shoulder Press" },
  { id: 25, name: "Seated Leg Curls" },
  { id: 26, name: "Seated Leg Extensions" },
  { id: 27, name: "Side Plank" },
  { id: 28, name: "Single Leg Weighted Calf Raise" },
  { id: 29, name: "Single-Leg Leg Press" },
  { id: 30, name: "Smith Machine Hip Thrust" },
  { id: 31, name: "Smith Machine Squat" },
  { id: 32, name: "Standing Face Pulls" },
  { id: 33, name: "Standing High To Low Cable Fly" },
  { id: 34, name: "Standing Weighted Calf Raise" },
  { id: 35, name: "Walking Lunges (quad focus)" },
  { id: 36, name: "Weighted Step-Ups*" }
];

// Exemplos de variações (primeiras 10 do CSV)
export const mockExerciseVariations: ExerciseVariation[] = [
  { id: 1, exercise_id: 1, variation_index: 1, variation_name: "See Tutorial Video", youtube_url: "https://youtu.be/AWo-q7P-HZ0" },
  { id: 2, exercise_id: 2, variation_index: 1, variation_name: "See Tutorial Video", youtube_url: "https://youtu.be/pCGVSBk0bIQ" },
  { id: 3, exercise_id: 3, variation_index: 1, variation_name: "See Tutorial Video", youtube_url: "https://youtu.be/JL1tJTEmxfw" },
  { id: 4, exercise_id: 3, variation_index: 2, variation_name: "Sumo Deadlift", youtube_url: "https://youtu.be/sO8lFa9CidE" },
  { id: 5, exercise_id: 3, variation_index: 3, variation_name: "Romanian Deadlift", youtube_url: "https://youtu.be/3Z3C44SXSQE" },
  { id: 6, exercise_id: 3, variation_index: 4, variation_name: "Trap Bar Deadlift", youtube_url: "https://youtu.be/hPpNTAEDnxM" },
  { id: 7, exercise_id: 3, variation_index: 5, variation_name: "Deficit Deadlift", youtube_url: "https://youtu.be/N-kUwH1uf9c" },
  { id: 8, exercise_id: 4, variation_index: 1, variation_name: "See Tutorial Video", youtube_url: "https://youtu.be/_vBMijiZoxE" },
  { id: 9, exercise_id: 4, variation_index: 2, variation_name: "Single Leg Hip Thrust", youtube_url: "https://youtu.be/kpzUeELReEA" },
  { id: 10, exercise_id: 4, variation_index: 3, variation_name: "Banded Hip Thrust", youtube_url: "https://youtu.be/abc1fisYB3w" }
];

// Mock user para desenvolvimento
export const mockUser: User = {
  id: "mock-user-123",
  email: "user@builtwithscience.com",
  display_name: "Test User",
  unit: "kg",
  suggestion_aggressiveness: "standard",
  video_pref: "smart"
};

// Mock de último set para pré-preenchimento
export const mockLastSetCache: LastSetCache[] = [
  { user_id: "mock-user-123", exercise_id: 1, variation_index: 1, weight_kg: 80, reps: 8, rest_sec: 180, updated_at: new Date().toISOString() },
  { user_id: "mock-user-123", exercise_id: 2, variation_index: 1, weight_kg: 60, reps: 10, rest_sec: 120, updated_at: new Date().toISOString() },
  { user_id: "mock-user-123", exercise_id: 3, variation_index: 1, weight_kg: 100, reps: 6, rest_sec: 240, updated_at: new Date().toISOString() }
];

// Função para simular delay de API
export async function simulateApiDelay(ms: number = 500): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, ms));
}

// Funções helper para buscar dados
export function getProgramById(id: number): Program | undefined {
  return mockPrograms.find(p => p.id === id);
}

export function getProgramDays(programId: number): ProgramDay[] {
  return mockProgramDays.filter(pd => pd.program_id === programId);
}

export function getExerciseById(id: number): Exercise | undefined {
  return mockExercises.find(e => e.id === id);
}

export function getExerciseVariations(exerciseId: number): ExerciseVariation[] {
  return mockExerciseVariations.filter(ev => ev.exercise_id === exerciseId);
}

export function getLastSet(userId: string, exerciseId: number, variationIndex?: number): LastSetCache | undefined {
  return mockLastSetCache.find(
    cache => cache.user_id === userId && 
             cache.exercise_id === exerciseId && 
             cache.variation_index === variationIndex
  );
}

