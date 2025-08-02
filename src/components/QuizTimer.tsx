'use client'
import React, { useEffect, useRef } from 'react'

interface QuizTimerProps {
  timeLeft: number;
  timerActive: boolean;
  onTimeUp: () => void;
  onTick: () => void;
}

const QuizTimer = ({ timeLeft, timerActive, onTimeUp, onTick }: QuizTimerProps) => {
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Timer effect
  useEffect(() => {
    if (timerActive && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        if (timeLeft === 1) {
          onTimeUp();
        } else {
          onTick();
        }
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [timeLeft, timerActive, onTimeUp, onTick]);

  // Calculate timer progress for circular display
  const timerProgress = (timeLeft / 30) * 100;
  const circumference = 2 * Math.PI * 45; // radius = 45
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (timerProgress / 100) * circumference;

  return (
    <div className="absolute top-4 right-4">
      <svg className="w-24 h-24 transform -rotate-90">
        <circle
          cx="48"
          cy="48"
          r="45"
          stroke="currentColor"
          strokeWidth="4"
          fill="transparent"
          className="text-gray-300"
        />
        <circle
          cx="48"
          cy="48"
          r="45"
          stroke="currentColor"
          strokeWidth="4"
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          className={`transition-all duration-1000 ${
            timeLeft <= 10 ? 'text-red-500' : timeLeft <= 20 ? 'text-yellow-500' : 'text-green-500'
          }`}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`text-lg font-bold ${
          timeLeft <= 10 ? 'text-red-600' : timeLeft <= 20 ? 'text-yellow-600' : 'text-green-600'
        }`}>
          {timeLeft}s
        </span>
      </div>
    </div>
  );
}

export default QuizTimer; 