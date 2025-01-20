import React, { useEffect, useRef, useState } from 'react';
import { useTestStore } from '@/store/testStore';
import { Progress } from '@/components/ui/progress';

interface TimerProps {
  duration: number;
  onComplete: () => void;
}

export const Timer: React.FC<TimerProps> = ({ duration, onComplete }) => {
  const { updateTimeRemaining } = useTestStore();
  const [timeLeft, setTimeLeft] = useState(duration);
  const intervalRef = useRef<NodeJS.Timeout>();

  const progress = (timeLeft / duration) * 100;

  useEffect(()=>{

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(()=>{
      setTimeLeft((time) => {
        if (time <= 0) {
          onComplete();
          return 0;
        }
        updateTimeRemaining(time - 1);
        return time - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [duration]);

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between text-sm">
        <span>Time Remaining</span>
        <span>{Math.ceil(timeLeft)}s</span>
      </div>
      <Progress value={progress} />
    </div>
  );
};