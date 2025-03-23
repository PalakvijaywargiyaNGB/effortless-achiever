
import React from 'react';
import { useTaskContext } from '@/context/TaskContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Flame, Trophy, Calendar } from 'lucide-react';

const StreakDisplay = () => {
  const { state } = useTaskContext();
  const { currentStreak, longestStreak } = state.streak;
  
  return (
    <Card className="glass-panel glass-panel-hover">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Flame className="h-5 w-5 text-orange-500" />
          <span>Productivity Streak</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col items-center justify-center p-4 bg-secondary/20 rounded-lg">
            <div className="flex items-center justify-center w-12 h-12 mb-2 rounded-full bg-orange-500/20">
              <Flame className="h-6 w-6 text-orange-500" />
            </div>
            <span className="text-2xl font-bold">{currentStreak}</span>
            <span className="text-xs text-muted-foreground">Current Streak</span>
          </div>
          
          <div className="flex flex-col items-center justify-center p-4 bg-secondary/20 rounded-lg">
            <div className="flex items-center justify-center w-12 h-12 mb-2 rounded-full bg-amber-500/20">
              <Trophy className="h-6 w-6 text-amber-500" />
            </div>
            <span className="text-2xl font-bold">{longestStreak}</span>
            <span className="text-xs text-muted-foreground">Longest Streak</span>
          </div>
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground">
            {currentStreak > 0 
              ? `You've completed tasks ${currentStreak} ${currentStreak === 1 ? 'day' : 'days'} in a row!` 
              : "Complete a task today to start your streak!"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default StreakDisplay;
