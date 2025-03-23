
import { Task, Priority } from '@/context/TaskContext';

// Calculate task importance score for prioritization
export const calculateTaskScore = (task: Task): number => {
  // Base scores by priority
  const priorityScores: Record<Priority, number> = {
    high: 100,
    medium: 50,
    low: 10,
  };

  let score = priorityScores[task.priority];

  // Add urgency based on due date if available
  if (task.dueDate) {
    const now = new Date();
    const dueDate = new Date(task.dueDate);
    const daysUntilDue = Math.max(0, Math.floor((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
    
    // The closer to the due date, the higher the score
    if (daysUntilDue <= 1) {
      score += 50; // Due today or tomorrow
    } else if (daysUntilDue <= 3) {
      score += 30; // Due in 2-3 days
    } else if (daysUntilDue <= 7) {
      score += 15; // Due this week
    }
  }

  // Additional factors could be considered here
  
  return score;
};

// Sort tasks by different criteria
export const sortTasks = (tasks: Task[], sortBy: 'priority' | 'dueDate' | 'createdAt' = 'priority'): Task[] => {
  const tasksArray = [...tasks];
  
  switch (sortBy) {
    case 'priority':
      return tasksArray.sort((a, b) => calculateTaskScore(b) - calculateTaskScore(a));
    
    case 'dueDate':
      return tasksArray.sort((a, b) => {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      });
    
    case 'createdAt':
      return tasksArray.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
    default:
      return tasksArray;
  }
};

// Filter tasks by different criteria
export const filterTasks = (
  tasks: Task[],
  filters: {
    status?: 'all' | 'completed' | 'active';
    priority?: Priority | 'all';
    search?: string;
  }
): Task[] => {
  return tasks.filter(task => {
    // Filter by status
    if (filters.status === 'completed' && !task.completed) return false;
    if (filters.status === 'active' && task.completed) return false;
    
    // Filter by priority
    if (filters.priority && filters.priority !== 'all' && task.priority !== filters.priority) return false;
    
    // Filter by search term
    if (filters.search && !task.title.toLowerCase().includes(filters.search.toLowerCase())) return false;
    
    return true;
  });
};

// Format date for display
export const formatDate = (date: Date | string | undefined): string => {
  if (!date) return '';
  
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

// Group tasks by date
export const groupTasksByDate = (tasks: Task[]): Record<string, Task[]> => {
  const grouped: Record<string, Task[]> = {};
  
  tasks.forEach(task => {
    const dueDate = task.dueDate ? formatDate(task.dueDate) : 'No Due Date';
    if (!grouped[dueDate]) {
      grouped[dueDate] = [];
    }
    grouped[dueDate].push(task);
  });
  
  return grouped;
};

// Returns a color based on priority
export const getPriorityColor = (priority: Priority): string => {
  switch (priority) {
    case 'high':
      return 'text-priority-high bg-priority-high/10';
    case 'medium':
      return 'text-priority-medium bg-priority-medium/10';
    case 'low':
      return 'text-priority-low bg-priority-low/10';
    default:
      return 'text-muted-foreground bg-muted/50';
  }
};

// Generate productivity stats
export const generateProductivityStats = (tasks: Task[]) => {
  const completed = tasks.filter(task => task.completed).length;
  const total = tasks.length;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
  
  // Tasks completed today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tasksCompletedToday = tasks.filter(
    task => task.completed && new Date(task.createdAt) >= today
  ).length;
  
  return {
    completed,
    total,
    completionRate,
    tasksCompletedToday,
  };
};
