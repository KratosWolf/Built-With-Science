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

// Variações de exercícios com alternativas
export const mockExerciseVariations: ExerciseVariation[] = [
  // Barbell Back Squat (id: 1)
  { id: 1, exercise_id: 1, variation_index: 1, variation_name: "Barbell Back Squat", youtube_url: "https://youtu.be/AWo-q7P-HZ0" },
  { id: 2, exercise_id: 1, variation_index: 2, variation_name: "Goblet Squat", youtube_url: "https://youtu.be/MeIiIdhvXT4" },
  { id: 3, exercise_id: 1, variation_index: 3, variation_name: "Dumbbell Squat", youtube_url: "https://youtu.be/xqvCmoLULNY" },
  { id: 4, exercise_id: 1, variation_index: 4, variation_name: "Smith Machine Squat", youtube_url: "https://youtu.be/IB7NoVVJp-g" },
  
  // Barbell Bench Press (id: 2)
  { id: 5, exercise_id: 2, variation_index: 1, variation_name: "Barbell Bench Press", youtube_url: "https://youtu.be/pCGVSBk0bIQ" },
  { id: 6, exercise_id: 2, variation_index: 2, variation_name: "Dumbbell Bench Press", youtube_url: "https://youtu.be/QCAuqXCMJOE" },
  { id: 7, exercise_id: 2, variation_index: 3, variation_name: "Push-ups", youtube_url: "https://youtu.be/IODxDxX7oi4" },
  { id: 8, exercise_id: 2, variation_index: 4, variation_name: "Incline Barbell Press", youtube_url: "https://youtu.be/SrqOu55lrYU" },
  
  // Barbell Deadlift (id: 3)
  { id: 9, exercise_id: 3, variation_index: 1, variation_name: "Conventional Deadlift", youtube_url: "https://youtu.be/JL1tJTEmxfw" },
  { id: 10, exercise_id: 3, variation_index: 2, variation_name: "Sumo Deadlift", youtube_url: "https://youtu.be/sO8lFa9CidE" },
  { id: 11, exercise_id: 3, variation_index: 3, variation_name: "Romanian Deadlift", youtube_url: "https://youtu.be/3Z3C44SXSQE" },
  { id: 12, exercise_id: 3, variation_index: 4, variation_name: "Trap Bar Deadlift", youtube_url: "https://youtu.be/hPpNTAEDnxM" },
  { id: 13, exercise_id: 3, variation_index: 5, variation_name: "Deficit Deadlift", youtube_url: "https://youtu.be/N-kUwH1uf9c" },
  
  // Barbell Hip Thrust (id: 4)
  { id: 14, exercise_id: 4, variation_index: 1, variation_name: "Barbell Hip Thrust", youtube_url: "https://youtu.be/_vBMijiZoxE" },
  { id: 15, exercise_id: 4, variation_index: 2, variation_name: "Single Leg Hip Thrust", youtube_url: "https://youtu.be/kpzUeELReEA" },
  { id: 16, exercise_id: 4, variation_index: 3, variation_name: "Dumbbell Hip Thrust", youtube_url: "https://youtu.be/abc1fisYB3w" },
  { id: 17, exercise_id: 4, variation_index: 4, variation_name: "Glute Bridge", youtube_url: "https://youtu.be/OUgsJ8-Vi0E" },
  
  // Barbell Row (id: 5)
  { id: 18, exercise_id: 5, variation_index: 1, variation_name: "Barbell Row", youtube_url: "https://youtu.be/9efgcAjQe7E" },
  { id: 19, exercise_id: 5, variation_index: 2, variation_name: "T-Bar Row", youtube_url: "https://youtu.be/j3Igk5nyZE4" },
  { id: 20, exercise_id: 5, variation_index: 3, variation_name: "Dumbbell Row", youtube_url: "https://youtu.be/pYcpY20QaE8" },
  { id: 21, exercise_id: 5, variation_index: 4, variation_name: "Chest Supported Row", youtube_url: "https://youtu.be/UCXxvVItLoM" },
  
  // Cable Lateral Raise (id: 6)
  { id: 22, exercise_id: 6, variation_index: 1, variation_name: "Cable Lateral Raise", youtube_url: "https://youtu.be/3VcKaXpzqRo" },
  { id: 23, exercise_id: 6, variation_index: 2, variation_name: "Dumbbell Lateral Raise", youtube_url: "https://youtu.be/3VcKaXpzqRo" },
  { id: 24, exercise_id: 6, variation_index: 3, variation_name: "Machine Lateral Raise", youtube_url: "https://youtu.be/3VcKaXpzqRo" },
  
  // Cable Pushdowns (id: 7)
  { id: 25, exercise_id: 7, variation_index: 1, variation_name: "Cable Pushdowns", youtube_url: "https://youtu.be/2-LAMcpzODU" },
  { id: 26, exercise_id: 7, variation_index: 2, variation_name: "Overhead Extension", youtube_url: "https://youtu.be/2-LAMcpzODU" },
  { id: 27, exercise_id: 7, variation_index: 3, variation_name: "Close Grip Push-ups", youtube_url: "https://youtu.be/2-LAMcpzODU" },
  
  // Flat Dumbbell Press (id: 11)
  { id: 28, exercise_id: 11, variation_index: 1, variation_name: "Flat Dumbbell Press", youtube_url: "https://youtu.be/QCAuqXCMJOE" },
  { id: 29, exercise_id: 11, variation_index: 2, variation_name: "Incline Dumbbell Press", youtube_url: "https://youtu.be/8iPEnn-ltC8" },
  { id: 30, exercise_id: 11, variation_index: 3, variation_name: "Decline Dumbbell Press", youtube_url: "https://youtu.be/Lrq3GBKBaUE" },
  
  // Hammer Curls (id: 12)
  { id: 31, exercise_id: 12, variation_index: 1, variation_name: "Hammer Curls", youtube_url: "https://youtu.be/zC3nLlEvin4" },
  { id: 32, exercise_id: 12, variation_index: 2, variation_name: "Cross Body Hammer Curls", youtube_url: "https://youtu.be/zC3nLlEvin4" },
  { id: 33, exercise_id: 12, variation_index: 3, variation_name: "Cable Hammer Curls", youtube_url: "https://youtu.be/zC3nLlEvin4" },
  
  // Lat Pulldown (id: 17)
  { id: 34, exercise_id: 17, variation_index: 1, variation_name: "Wide Grip Lat Pulldown", youtube_url: "https://youtu.be/CAwf7n6Luuc" },
  { id: 35, exercise_id: 17, variation_index: 2, variation_name: "Close Grip Lat Pulldown", youtube_url: "https://youtu.be/CAwf7n6Luuc" },
  { id: 36, exercise_id: 17, variation_index: 3, variation_name: "Neutral Grip Pulldown", youtube_url: "https://youtu.be/CAwf7n6Luuc" },
  { id: 37, exercise_id: 17, variation_index: 4, variation_name: "Pull-ups", youtube_url: "https://youtu.be/eGo4IYlbE5g" },
  
  // Seated Dumbbell Shoulder Press (id: 24)
  { id: 38, exercise_id: 24, variation_index: 1, variation_name: "Seated DB Shoulder Press", youtube_url: "https://youtu.be/qEwKCR5JCog" },
  { id: 39, exercise_id: 24, variation_index: 2, variation_name: "Standing DB Press", youtube_url: "https://youtu.be/qEwKCR5JCog" },
  { id: 40, exercise_id: 24, variation_index: 3, variation_name: "Arnold Press", youtube_url: "https://youtu.be/6Z15_WdXmVw" },
  { id: 41, exercise_id: 24, variation_index: 4, variation_name: "Military Press", youtube_url: "https://youtu.be/2yjwXTZQDDI" }
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
  { user_id: "mock-user-123", exercise_id: 3, variation_index: 1, weight_kg: 100, reps: 6, rest_sec: 240, updated_at: new Date().toISOString() },
  { user_id: "mock-user-123", exercise_id: 4, variation_index: 1, weight_kg: 70, reps: 10, rest_sec: 150, updated_at: new Date().toISOString() },
  { user_id: "mock-user-123", exercise_id: 5, variation_index: 1, weight_kg: 55, reps: 10, rest_sec: 120, updated_at: new Date().toISOString() },
  { user_id: "mock-user-123", exercise_id: 6, variation_index: 1, weight_kg: 12, reps: 12, rest_sec: 90, updated_at: new Date().toISOString() },
  { user_id: "mock-user-123", exercise_id: 7, variation_index: 1, weight_kg: 25, reps: 12, rest_sec: 90, updated_at: new Date().toISOString() },
  { user_id: "mock-user-123", exercise_id: 9, variation_index: 1, weight_kg: 8, reps: 15, rest_sec: 90, updated_at: new Date().toISOString() },
  { user_id: "mock-user-123", exercise_id: 11, variation_index: 1, weight_kg: 25, reps: 10, rest_sec: 120, updated_at: new Date().toISOString() },
  { user_id: "mock-user-123", exercise_id: 12, variation_index: 1, weight_kg: 15, reps: 12, rest_sec: 90, updated_at: new Date().toISOString() },
  { user_id: "mock-user-123", exercise_id: 13, variation_index: 1, weight_kg: 12, reps: 12, rest_sec: 90, updated_at: new Date().toISOString() },
  { user_id: "mock-user-123", exercise_id: 14, variation_index: 1, weight_kg: 12, reps: 12, rest_sec: 90, updated_at: new Date().toISOString() },
  { user_id: "mock-user-123", exercise_id: 15, variation_index: 1, weight_kg: 45, reps: 10, rest_sec: 120, updated_at: new Date().toISOString() },
  { user_id: "mock-user-123", exercise_id: 17, variation_index: 1, weight_kg: 50, reps: 10, rest_sec: 120, updated_at: new Date().toISOString() },
  { user_id: "mock-user-123", exercise_id: 18, variation_index: 1, weight_kg: 22, reps: 10, rest_sec: 120, updated_at: new Date().toISOString() },
  { user_id: "mock-user-123", exercise_id: 19, variation_index: 1, weight_kg: 35, reps: 12, rest_sec: 90, updated_at: new Date().toISOString() },
  { user_id: "mock-user-123", exercise_id: 23, variation_index: 1, weight_kg: 12, reps: 12, rest_sec: 90, updated_at: new Date().toISOString() },
  { user_id: "mock-user-123", exercise_id: 24, variation_index: 1, weight_kg: 18, reps: 12, rest_sec: 120, updated_at: new Date().toISOString() },
  { user_id: "mock-user-123", exercise_id: 27, variation_index: 1, weight_kg: 0, reps: 45, rest_sec: 60, updated_at: new Date().toISOString() },
  { user_id: "mock-user-123", exercise_id: 32, variation_index: 1, weight_kg: 15, reps: 15, rest_sec: 90, updated_at: new Date().toISOString() },
  { user_id: "mock-user-123", exercise_id: 34, variation_index: 1, weight_kg: 20, reps: 15, rest_sec: 90, updated_at: new Date().toISOString() }
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

