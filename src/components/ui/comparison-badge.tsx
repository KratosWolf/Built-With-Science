'use client';

import { motion } from 'framer-motion';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';

interface ComparisonBadgeProps {
  changePercent: number;
  isIncrease: boolean;
}

export function ComparisonBadge({ changePercent, isIncrease }: ComparisonBadgeProps) {
  const absPercent = Math.abs(changePercent);
  const displayPercent = absPercent > 999 ? '999+' : absPercent.toFixed(1);

  if (changePercent === 0) {
    return (
      <span className="text-xs text-gray-400">
        Sem mudança
      </span>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`flex items-center gap-1 text-xs font-medium ${
        isIncrease ? 'text-green-500' : 'text-red-500'
      }`}
    >
      {isIncrease ? (
        <ArrowUpIcon className="w-3 h-3" />
      ) : (
        <ArrowDownIcon className="w-3 h-3" />
      )}
      <span>{displayPercent}%</span>
    </motion.div>
  );
}
