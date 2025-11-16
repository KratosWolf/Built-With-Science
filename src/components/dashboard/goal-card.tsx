'use client';

import { motion } from 'framer-motion';
import { GoalProgress } from '@/types/goals';
import { AnimatedNumber } from '@/components/ui/animated-number';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

interface GoalCardProps {
  goalProgress: GoalProgress;
  index: number;
}

const goalConfig = {
  workouts: {
    label: 'Total de Treinos',
    emoji: '🎯',
    unit: '',
  },
  volume: {
    label: 'Volume Total',
    emoji: '💪',
    unit: 'kg',
  },
  frequency: {
    label: 'Frequência Semanal',
    emoji: '📅',
    unit: 'x/semana',
  },
};

export function GoalCard({ goalProgress, index }: GoalCardProps) {
  const { goal, current_value, progress_percent, is_achieved, remaining } = goalProgress;
  const config = goalConfig[goal.type];

  // Cor da progress bar baseada no progresso
  const getProgressColor = () => {
    if (is_achieved) return 'bg-green-500';
    if (progress_percent >= 75) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  // Cor do texto baseada no progresso
  const getTextColor = () => {
    if (is_achieved) return 'text-green-500';
    if (progress_percent >= 75) return 'text-yellow-500';
    return 'text-blue-500';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="bg-[#161b22] border border-[#30363d] rounded-lg p-6 hover:border-[#10b981] transition-colors"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{config.emoji}</span>
          <div>
            <h3 className="text-white font-semibold">{config.label}</h3>
            <p className="text-xs text-gray-500">
              Meta: {goal.target_value.toLocaleString()}{config.unit}
            </p>
          </div>
        </div>
        {is_achieved && (
          <CheckCircleIcon className="w-6 h-6 text-green-500" />
        )}
      </div>

      {/* Progress Numbers */}
      <div className="mb-3">
        <div className="flex items-baseline gap-2">
          <span className={`text-3xl font-bold ${getTextColor()}`}>
            <AnimatedNumber
              value={goal.type === 'volume' ? current_value / 1000 : current_value}
              suffix={goal.type === 'volume' ? 'k' : ''}
            />
          </span>
          <span className="text-gray-400 text-sm">
            / {goal.type === 'volume' ? (goal.target_value / 1000).toFixed(0) + 'k' : goal.target_value}
            {config.unit && ` ${config.unit}`}
          </span>
        </div>
        {!is_achieved && (
          <p className="text-xs text-gray-500 mt-1">
            Faltam {goal.type === 'volume' ? (remaining / 1000).toFixed(1) + 'k' : remaining}{config.unit} para a meta
          </p>
        )}
        {is_achieved && (
          <p className="text-xs text-green-500 mt-1">
            Meta alcançada! 🎉
          </p>
        )}
      </div>

      {/* Progress Bar */}
      <div className="relative h-2 bg-[#0d1117] rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress_percent}%` }}
          transition={{ duration: 1, delay: index * 0.1 + 0.2, ease: 'easeOut' }}
          className={`h-full ${getProgressColor()} rounded-full`}
        />
      </div>

      {/* Progress Percentage */}
      <div className="mt-2 text-right">
        <span className={`text-sm font-medium ${getTextColor()}`}>
          {progress_percent}%
        </span>
      </div>
    </motion.div>
  );
}
