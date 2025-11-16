export interface PeriodComparison {
  current: number;
  previous: number;
  change: number;        // Diferença absoluta
  changePercent: number; // Diferença em %
  isIncrease: boolean;   // true = aumento, false = diminuição
}

export interface StatsWithComparison {
  totalWorkouts: PeriodComparison;
  currentStreak: number; // Streak não tem comparação
  totalVolume: PeriodComparison;
  avgWeekly: PeriodComparison;
}
