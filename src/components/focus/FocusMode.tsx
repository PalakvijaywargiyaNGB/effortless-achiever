
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Play, 
  Pause, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  RefreshCw 
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Slider } from '@/components/ui/slider';

interface FocusModeProps {
  initialMinutes?: number;
  onComplete?: () => void;
}

const FocusMode: React.FC<FocusModeProps> = ({ 
  initialMinutes = 25, 
  onComplete 
}) => {
  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60);
  const [isActive, setIsActive] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(80);
  const timerRef = useRef<number | null>(null);
  
  // Sound effects
  const tickSound = useRef<HTMLAudioElement | null>(null);
  const completeSound = useRef<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    // Initialize audio elements
    tickSound.current = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-clock-tick-1045.mp3');
    completeSound.current = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-achievement-bell-600.mp3');
    
    // Clean up
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);
  
  useEffect(() => {
    if (timeLeft === 0 && isActive) {
      setIsActive(false);
      setIsCompleted(true);
      
      // Play completion sound if not muted
      if (!isMuted && completeSound.current) {
        completeSound.current.volume = volume / 100;
        completeSound.current.play();
      }
      
      // Call completion callback
      if (onComplete) {
        onComplete();
      }
    }
  }, [timeLeft, isActive, isMuted, volume, onComplete]);
  
  // Start/pause timer
  const toggleTimer = () => {
    if (isActive) {
      // Pause timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    } else {
      // Resume/start timer
      timerRef.current = window.setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            clearInterval(timerRef.current!);
            return 0;
          }
          
          // Play tick sound at certain intervals if not muted
          if (!isMuted && prevTime % 60 === 0 && tickSound.current) {
            tickSound.current.volume = volume / 100;
            tickSound.current.play();
          }
          
          return prevTime - 1;
        });
      }, 1000);
    }
    
    setIsActive(!isActive);
  };
  
  // Reset timer
  const resetTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setIsActive(false);
    setIsCompleted(false);
    setTimeLeft(initialMinutes * 60);
  };
  
  // Skip timer
  const skipTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setTimeLeft(0);
    setIsActive(false);
    setIsCompleted(true);
    
    // Call completion callback
    if (onComplete) {
      onComplete();
    }
  };
  
  // Toggle mute
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };
  
  // Format time for display
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Calculate progress percentage
  const progressPercent = 100 - (timeLeft / (initialMinutes * 60) * 100);
  
  return (
    <div className="glass-panel rounded-xl p-6 text-center max-w-md mx-auto">
      <div className="relative mb-8 mt-4">
        <svg className="w-48 h-48 mx-auto" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-secondary"
          />
          
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeDasharray="283"
            strokeDashoffset={283 - (283 * progressPercent) / 100}
            strokeLinecap="round"
            className="text-primary transition-all duration-1000 ease-linear"
            transform="rotate(-90 50 50)"
          />
          
          {/* Time text */}
          <text
            x="50"
            y="50"
            dominantBaseline="middle"
            textAnchor="middle"
            className="text-foreground font-medium text-lg"
            fontSize="16"
          >
            {formatTime(timeLeft)}
          </text>
          
          {/* Label text */}
          <text
            x="50"
            y="65"
            dominantBaseline="middle"
            textAnchor="middle"
            className="text-muted-foreground text-xs"
            fontSize="8"
          >
            {isCompleted ? "COMPLETED" : isActive ? "FOCUS TIME" : "PAUSED"}
          </text>
        </svg>
      </div>
      
      <div className="flex justify-center space-x-2 mb-6">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full h-12 w-12" 
                onClick={resetTimer}
              >
                <RefreshCw className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Reset Timer</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <Button 
          size="icon" 
          className={`rounded-full h-14 w-14 ${
            isActive ? 'bg-primary/90 hover:bg-primary/80' : 'bg-primary hover:bg-primary/90'
          }`}
          onClick={toggleTimer}
          disabled={isCompleted}
        >
          {isActive ? (
            <Pause className="h-6 w-6" />
          ) : (
            <Play className="h-6 w-6 ml-1" />
          )}
        </Button>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full h-12 w-12" 
                onClick={skipTimer}
                disabled={isCompleted}
              >
                <SkipForward className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Skip Timer</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <div className="flex items-center justify-center space-x-2">
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full h-8 w-8" 
          onClick={toggleMute}
        >
          {isMuted ? (
            <VolumeX className="h-4 w-4" />
          ) : (
            <Volume2 className="h-4 w-4" />
          )}
        </Button>
        
        <Slider
          defaultValue={[volume]}
          max={100}
          step={1}
          disabled={isMuted}
          onValueChange={([value]) => setVolume(value)}
          className="w-32"
        />
      </div>
      
      {isCompleted && (
        <div className="mt-6 animate-fade-in">
          <h3 className="text-lg font-medium mb-2">Great job!</h3>
          <p className="text-sm text-muted-foreground mb-4">
            You've completed your focus session.
          </p>
          <Button onClick={resetTimer}>
            Start Another Session
          </Button>
        </div>
      )}
    </div>
  );
};

export default FocusMode;
