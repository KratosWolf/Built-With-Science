'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface RestTimerProps {
  initialSeconds: number;
  onComplete: () => void;
  onSkip: () => void;
  isActive: boolean;
}

export function RestTimer({ initialSeconds, onComplete, onSkip, isActive }: RestTimerProps) {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(isActive);

  useEffect(() => {
    if (isActive) {
      setTimeLeft(initialSeconds);
      setIsRunning(true);
    }
  }, [isActive, initialSeconds]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            onComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, onComplete]);

  if (!isActive && timeLeft === 0) {
    return null;
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    return ((initialSeconds - timeLeft) / initialSeconds) * 100;
  };

  const getTimerColor = () => {
    const percentage = (timeLeft / initialSeconds) * 100;
    if (percentage > 50) return 'green';
    if (percentage > 25) return 'orange';
    return 'red';
  };

  const timerColor = getTimerColor();

  return (
    <Card className={`border-${timerColor}-200 bg-${timerColor}-50 animate-pulse`}>
      <CardContent className="pt-6">
        <div className="text-center space-y-4">
          {/* Circular Progress */}
          <div className="relative w-24 h-24 mx-auto">
            <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-gray-200"
              />
              {/* Progress circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 45}`}
                strokeDashoffset={`${2 * Math.PI * 45 * (1 - getProgressPercentage() / 100)}`}
                className={`text-${timerColor}-500 transition-all duration-1000 ease-linear`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-xl font-bold text-${timerColor}-700`}>
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>

          <div>
            <div className={`text-2xl font-bold text-${timerColor}-700 mb-1`}>
              Rest Time
            </div>
            <div className={`text-sm text-${timerColor}-600`}>
              {timeLeft > 0 ? 'Take your time to recover' : 'Ready for next set!'}
            </div>
          </div>

          <div className="flex gap-2 justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsRunning(!isRunning)}
              className="border-gray-300"
            >
              {isRunning ? '⏸️ Pause' : '▶️ Resume'}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setTimeLeft(prev => Math.min(prev + 30, initialSeconds + 60))}
              className="border-gray-300"
            >
              +30s
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setTimeLeft(prev => Math.max(prev - 30, 0))}
              className="border-gray-300"
            >
              -30s
            </Button>
            
            <Button
              onClick={onSkip}
              size="sm"
              className={`bg-${timerColor}-600 hover:bg-${timerColor}-700`}
            >
              Skip Rest
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
