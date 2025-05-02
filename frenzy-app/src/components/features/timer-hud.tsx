'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { SlidingNumber } from '../ui/sliding-number';

interface TimerDisplayProps {
  questionIndex: number;
  isActive: boolean;
  onTimeUp?: () => void;
  duration?: number; // in seconds
}

export function TimerDisplay({
  questionIndex,
  isActive,
  onTimeUp,
  duration = 80, // Default of 1 minute and 20 seconds
}: TimerDisplayProps) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isWarning, setIsWarning] = useState(false);
  const [isDanger, setIsDanger] = useState(false);
  const [hasFired, setHasFired] = useState(false);

  // Reset timer when question changes
  useEffect(() => {
    setTimeLeft(duration);
    setIsWarning(false);
    setIsDanger(false);
    setHasFired(false);
  }, [questionIndex, duration]);

  // Handle countdown
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          const newTime = prevTime - 1;

          if (newTime <= duration * 0.3 && newTime > duration * 0.1) {
            setIsWarning(true);
            setIsDanger(false);
          }
          if (newTime <= duration * 0.1) {
            setIsWarning(false);
            setIsDanger(true);
          }

          if (newTime <= 0 && onTimeUp && !hasFired) {
            setHasFired(true);
            setTimeout(() => onTimeUp(), 0); // defer to next tick
          }

          return Math.max(newTime, 0);
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, duration, onTimeUp, hasFired]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const getColorClass = () => {
    if (isDanger) return 'text-red-500';
    if (isWarning) return 'text-yellow-500';
    return 'text-white';
  };

  return (
    <div className='flex items-center justify-center'>
      {isDanger ? (
        <motion.div
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ repeat: Infinity, duration: 0.8 }}
          className={`flex items-center gap-0.5 font-mono ${getColorClass()}`}
        >
          <SlidingNumber value={minutes} padStart={true} />
          <span className={`${getColorClass()}`}>:</span>
          <SlidingNumber value={seconds} padStart={true} />
        </motion.div>
      ) : (
        <div
          className={`flex items-center gap-0.5 font-mono ${getColorClass()}`}
        >
          <SlidingNumber value={minutes} padStart={true} />
          <span className={`${getColorClass()}`}>:</span>
          <SlidingNumber value={seconds} padStart={true} />
        </div>
      )}
    </div>
  );
}
