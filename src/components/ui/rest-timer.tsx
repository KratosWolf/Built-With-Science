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
    <Card className={`border-4 ${timerColor === 'green' ? 'border-green-400 bg-green-50' : timerColor === 'orange' ? 'border-orange-400 bg-orange-50' : 'border-red-400 bg-red-50'} ${timeLeft <= 10 ? 'animate-pulse' : ''}`}>
      <CardContent className="pt-6">
        <div className="text-center space-y-6">
          {/* Large Timer Display */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-800">⏰ Rest Time</h3>
            <div className={`text-6xl font-bold ${timerColor === 'green' ? 'text-green-600' : timerColor === 'orange' ? 'text-orange-600' : 'text-red-600'}`}>
              {formatTime(timeLeft)}
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div 
              className={`h-4 rounded-full transition-all duration-1000 ${timerColor === 'green' ? 'bg-green-500' : timerColor === 'orange' ? 'bg-orange-500' : 'bg-red-500'}`}
              style={{ width: `${getProgressPercentage()}%` }}
            />
          </div>
          
          {/* Circular Progress */}
          <div className="relative w-32 h-32 mx-auto">
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

          <div className="flex flex-col gap-3">
            <div className="flex gap-2 justify-center">
              <Button
                variant="outline"
                size="lg"
                onClick={() => setIsRunning(!isRunning)}
                className="h-12 px-6 font-semibold"
              >
                {isRunning ? '⏸️ Pause' : '▶️ Resume'}
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                onClick={() => setTimeLeft(prev => Math.min(prev + 30, initialSeconds + 60))}
                className="h-12 px-6"
              >
                ⏰ +30s
              </Button>
            </div>
            
            <div className="flex gap-2 justify-center">
              <Button
                onClick={onComplete}
                variant="default"
                size="lg"
                className="flex-1 h-12 bg-green-600 hover:bg-green-700 font-semibold"
              >
                ✅ Done Resting
              </Button>
              
              <Button
                onClick={onSkip}
                variant="outline"
                size="lg"  
                className="flex-1 h-12 font-semibold"
              >
                ⏭️ Skip Rest
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
