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
  const radius = typeof window !== 'undefined' && window.innerWidth < 640 ? 30 : 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (timerProgress / 100) * circumference;
  const size = typeof window !== 'undefined' && window.innerWidth < 640 ? 64 : 96;
  const center = size / 2;

  return (
    <div className="absolute top-2 sm:top-4 right-2 sm:right-4">
      <svg className={`w-16 h-16 sm:w-24 sm:h-24 transform -rotate-90`}>
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke="currentColor"
          strokeWidth="3"
          fill="transparent"
          className="text-gray-300"
        />
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke="currentColor"
          strokeWidth="3"
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          className={`transition-all duration-1000 ${
            timeLeft <= 10 ? 'text-red-500' : timeLeft <= 20 ? 'text-yellow-500' : 'text-green-500'
          }`}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`text-sm sm:text-lg font-bold ${
          timeLeft <= 10 ? 'text-red-600' : timeLeft <= 20 ? 'text-yellow-600' : 'text-green-600'
        }`}>
          {timeLeft}s
        </span>
      </div>
    </div>
  );
}

export default QuizTimer; 