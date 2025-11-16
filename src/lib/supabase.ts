import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database tables
export interface WorkoutSet {
  id: string
  user_id: string
  session_id?: string
  program_id: number
  day_id: number
  exercise_id: number
  set_number: number
  weight_kg?: number
  reps?: number
  rpe?: number
  difficulty?: string
  created_at: string
  updated_at?: string
}

export interface WorkoutSession {
  id: string
  user_id: string
  program_id: number
  day_id: number
  started_at: string
  completed_at?: string
  notes?: string
  total_points?: number
}
