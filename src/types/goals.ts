export type GoalType = 'workouts' | 'volume' | 'frequency';

export interface Goal {
  id: string;
  user_id: string;
  type: GoalType;
  target_value: number;
  period_days: number;
  created_at: string;
  updated_at: string;
}

export interface GoalProgress {
  goal: Goal;
  current_value: number;
  progress_percent: number;
  is_achieved: boolean;
  remaining: number;
}
