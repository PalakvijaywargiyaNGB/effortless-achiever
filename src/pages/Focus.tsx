
import React, { useState } from 'react';
import Container from '@/components/ui/Container';
import FocusMode from '@/components/focus/FocusMode';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  BrainCircuit,
  Coffee,
  Clock,
  CheckCircle,
  VolumeX,
  Zap,
  Leaf,
  Moon,
  Sun,
} from 'lucide-react';
import { toast } from "sonner";

const Focus: React.FC = () => {
  const [selectedMode, setSelectedMode] = useState<'pomodoro' | 'short' | 'long'>('pomodoro');
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  
  const focusModes = {
    pomodoro: { minutes: 25, label: 'Pomodoro', icon: <BrainCircuit className="h-5 w-5" /> },
    short: { minutes: 5, label: 'Short Break', icon: <Coffee className="h-5 w-5" /> },
    long: { minutes: 15, label: 'Long Break', icon: <Moon className="h-5 w-5" /> },
  };
  
  const handleFocusComplete = () => {
    setSessionsCompleted(prev => prev + 1);
    
    // Show completion toast
    toast.success(`${focusModes[selectedMode].label} session completed!`, {
      description: "Great job focusing. Take a moment to stretch.",
    });
    
    // Auto-switch to short break after pomodoro
    if (selectedMode === 'pomodoro') {
      // After every 4 pomodoros, suggest a long break
      if ((sessionsCompleted + 1) % 4 === 0) {
        toast("Time for a longer break!", {
          description: "You've completed 4 Pomodoro sessions.",
          action: {
            label: "Take Long Break",
            onClick: () => setSelectedMode('long'),
          },
        });
      } else {
        toast("Time for a short break!", {
          action: {
            label: "Take Break",
            onClick: () => setSelectedMode('short'),
          },
        });
      }
    }
  };
  
  return (
    <div className="min-h-screen pt-24 pb-10 px-4">
      <Container>
        <div className="mb-8 text-center max-w-2xl mx-auto">
          <h1 className="text-3xl font-semibold mb-2">Focus Mode</h1>
          <p className="text-muted-foreground">
            Eliminate distractions and maximize your productivity with focused work sessions.
          </p>
        </div>
        
        {/* Focus Mode Selector */}
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          {Object.entries(focusModes).map(([key, mode]) => (
            <Card 
              key={key}
              className={`glass-panel w-full max-w-[180px] cursor-pointer transition-all duration-300 ${
                selectedMode === key ? 'ring-2 ring-primary/50' : 'opacity-80 hover:opacity-100'
              }`}
              onClick={() => setSelectedMode(key as any)}
            >
              <CardContent className="p-6 text-center">
                <div className={`mx-auto rounded-full p-3 mb-3 ${
                  selectedMode === key ? 'bg-primary/10' : 'bg-secondary'
                }`}>
                  {mode.icon}
                </div>
                <h3 className="font-medium">{mode.label}</h3>
                <p className="text-sm text-muted-foreground">{mode.minutes} min</p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Active Focus Timer */}
        <div className="max-w-md mx-auto mb-10">
          <FocusMode 
            initialMinutes={focusModes[selectedMode].minutes} 
            onComplete={handleFocusComplete}
          />
        </div>
        
        {/* Focus Tips */}
        <div className="mt-10 max-w-3xl mx-auto">
          <h2 className="text-xl font-semibold mb-4 text-center">Focus Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="glass-panel">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <VolumeX className="h-5 w-5 text-primary" />
                  <span>Minimize Distractions</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Turn off notifications, close unnecessary tabs, and create a quiet environment to maximize focus.
                </p>
              </CardContent>
            </Card>
            
            <Card className="glass-panel">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-amber-500" />
                  <span>One Task at a Time</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Focus completely on a single task. Multitasking reduces efficiency and quality of work.
                </p>
              </CardContent>
            </Card>
            
            <Card className="glass-panel">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Leaf className="h-5 w-5 text-green-500" />
                  <span>Take Proper Breaks</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Stand up, stretch, and rest your eyes during breaks. Short breaks improve overall productivity.
                </p>
              </CardContent>
            </Card>
            
            <Card className="glass-panel">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sun className="h-5 w-5 text-amber-400" />
                  <span>Optimal Environment</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Ensure good lighting, a comfortable chair, and the right temperature for your workspace.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Focus;
