"use client";

import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useState, useEffect } from 'react';

export function LoadingState() {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState('Initializing...');

  useEffect(() => {
    const stages = [
      'Initializing AI model...',
      'Processing prompt...',
      'Generating image...',
      'Applying artistic touches...',
      'Finalizing creation...'
    ];

    let currentStage = 0;
    let currentProgress = 0;

    const interval = setInterval(() => {
      // Update progress
      currentProgress += Math.random() * 15 + 5;
      
      // Update stage based on progress
      const stageIndex = Math.min(
        Math.floor((currentProgress / 100) * stages.length),
        stages.length - 1
      );
      
      if (stageIndex !== currentStage) {
        currentStage = stageIndex;
        setStage(stages[currentStage]);
      }

      setProgress(Math.min(currentProgress, 95)); // Cap at 95% until actual completion

      if (currentProgress >= 95) {
        clearInterval(interval);
      }
    }, 800);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card>
      <CardContent className="p-8">
        <div className="flex flex-col items-center space-y-6">
          {/* Animated Icon */}
          <div className="relative">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-2 w-12 h-12 border-4 border-secondary border-b-transparent rounded-full animate-spin animate-reverse"></div>
          </div>

          {/* Stage Text */}
          <div className="text-center space-y-2">
            <h3 className="text-lg font-medium">Creating Your Image</h3>
            <p className="text-muted-foreground">{stage}</p>
          </div>

          {/* Progress Bar */}
          <div className="w-full max-w-md space-y-2">
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-muted-foreground text-center">
              {Math.round(progress)}% complete
            </p>
          </div>

          {/* Estimated Time */}
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              This usually takes 30-60 seconds
            </p>
          </div>

          {/* Visual Elements */}
          <div className="flex space-x-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-3 h-3 rounded-full bg-primary/30 animate-pulse"
                style={{
                  animationDelay: `${i * 0.5}s`,
                  animationDuration: '1.5s'
                }}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}