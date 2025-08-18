import { z } from 'zod';

// User validation schemas
export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  display_name: z.string().min(1).max(100),
  unit: z.enum(['kg', 'lb']),
  suggestion_aggressiveness: z.enum(['conservative', 'standard', 'aggressive']),
  video_pref: z.enum(['youtube', 'guide', 'smart']),
});

export const createUserSchema = userSchema.omit({ id: true });

// Workout validation schemas
export const workoutSetSchema = z.object({
  id: z.number().optional(),
  session_id: z.number(),
  exercise_id: z.number(),
  variation_index: z.number().optional(),
  set_number: z.number().min(1),
  weight_kg: z.number().min(0).max(1000).optional(),
  reps: z.number().min(0).max(100).optional(),
  rest_sec: z.number().min(0).max(3600).optional(),
  rpe: z.number().min(1).max(10).optional(),
  difficulty: z.enum(['easy', 'ok', 'hard']).optional(),
});

export const workoutSessionSchema = z.object({
  id: z.number().optional(),
  user_id: z.string().uuid(),
  program_id: z.number(),
  program_day_id: z.number(),
  started_at: z.string().datetime(),
  finished_at: z.string().datetime().optional(),
  status: z.enum(['in_progress', 'done']),
});

export const exerciseVariationSchema = z.object({
  id: z.number(),
  exercise_id: z.number(),
  variation_index: z.number(),
  variation_name: z.string(),
  youtube_url: z.string().url(),
});

export const lastSetCacheSchema = z.object({
  user_id: z.string().uuid(),
  exercise_id: z.number(),
  variation_index: z.number().optional(),
  weight_kg: z.number().min(0).max(1000).optional(),
  reps: z.number().min(0).max(100).optional(),
  rest_sec: z.number().min(0).max(3600).optional(),
  updated_at: z.string().datetime(),
});

// Form validation schemas
export const setFormSchema = z.object({
  weight: z.number().min(0).max(1000),
  reps: z.number().min(1).max(100),
  rest_minutes: z.number().min(0).max(60),
  rest_seconds: z.number().min(0).max(59),
  difficulty: z.enum(['easy', 'ok', 'hard']),
  rpe: z.number().min(1).max(10).optional(),
});

export const userPreferencesSchema = z.object({
  unit: z.enum(['kg', 'lb']),
  suggestion_aggressiveness: z.enum(['conservative', 'standard', 'aggressive']),
  video_pref: z.enum(['youtube', 'guide', 'smart']),
});

// Program and exercise schemas
export const programSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export const programDaySchema = z.object({
  id: z.number(),
  program_id: z.number(),
  day_index: z.number(),
  day_name: z.string(),
});

export const exerciseSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export const dayExerciseSchema = z.object({
  id: z.number(),
  program_day_id: z.number(),
  exercise_id: z.number(),
  order_pos: z.number(),
  set_target: z.number(),
});

export const dayExerciseSetSchema = z.object({
  id: z.number(),
  day_exercise_id: z.number(),
  set_number: z.number(),
  reps_target: z.string(), // "8-10", "6-12", etc.
});

// Progression suggestion schema
export const progressionSuggestionSchema = z.object({
  suggested_weight: z.number(),
  rationale: z.string(),
  percentage_change: z.number(),
  previous_weight: z.number().optional(),
  previous_reps: z.number().optional(),
  target_reps: z.string(),
});

// Type exports
export type User = z.infer<typeof userSchema>;
export type CreateUser = z.infer<typeof createUserSchema>;
export type WorkoutSet = z.infer<typeof workoutSetSchema>;
export type WorkoutSession = z.infer<typeof workoutSessionSchema>;
export type ExerciseVariation = z.infer<typeof exerciseVariationSchema>;
export type LastSetCache = z.infer<typeof lastSetCacheSchema>;
export type SetForm = z.infer<typeof setFormSchema>;
export type UserPreferences = z.infer<typeof userPreferencesSchema>;
export type Program = z.infer<typeof programSchema>;
export type ProgramDay = z.infer<typeof programDaySchema>;
export type Exercise = z.infer<typeof exerciseSchema>;
export type DayExercise = z.infer<typeof dayExerciseSchema>;
export type DayExerciseSet = z.infer<typeof dayExerciseSetSchema>;
export type ProgressionSuggestion = z.infer<typeof progressionSuggestionSchema>;

