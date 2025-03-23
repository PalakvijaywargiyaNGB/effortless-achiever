
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { toast } from "sonner";

export type Priority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: Priority;
  dueDate?: Date;
  createdAt: Date;
  tags?: string[];
}

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastCompletedDate: string | null;
}

interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  streak: StreakData;
}

type TaskAction =
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'TOGGLE_COMPLETED'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'UPDATE_STREAK'; payload: StreakData };

const initialStreakData: StreakData = {
  currentStreak: 0,
  longestStreak: 0,
  lastCompletedDate: null,
};

const initialState: TaskState = {
  tasks: [],
  loading: false,
  error: null,
  streak: initialStreakData,
};

// Load tasks from localStorage if available
const loadTasks = (): Task[] => {
  try {
    const storedTasks = localStorage.getItem('tasks');
    return storedTasks ? JSON.parse(storedTasks) : [];
  } catch (error) {
    console.error('Error loading tasks from localStorage:', error);
    return [];
  }
};

// Load streak data from localStorage
const loadStreakData = (): StreakData => {
  try {
    const storedStreak = localStorage.getItem('streak');
    return storedStreak ? JSON.parse(storedStreak) : initialStreakData;
  } catch (error) {
    console.error('Error loading streak data from localStorage:', error);
    return initialStreakData;
  }
};

// Create a reducer function to handle state updates
const taskReducer = (state: TaskState, action: TaskAction): TaskState => {
  switch (action.type) {
    case 'ADD_TASK':
      return {
        ...state,
        tasks: [action.payload, ...state.tasks],
      };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task => 
          task.id === action.payload.id ? action.payload : task
        ),
      };
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload),
      };
    case 'TOGGLE_COMPLETED':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload
            ? { ...task, completed: !task.completed }
            : task
        ),
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };
    case 'UPDATE_STREAK':
      return {
        ...state,
        streak: action.payload,
      };
    default:
      return state;
  }
};

// Create the context
const TaskContext = createContext<{
  state: TaskState;
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  toggleCompleted: (id: string) => void;
}>({
  state: initialState,
  addTask: () => {},
  updateTask: () => {},
  deleteTask: () => {},
  toggleCompleted: () => {},
});

// Helper to check if a task was completed today
const wasCompletedToday = (date: string | null): boolean => {
  if (!date) return false;
  
  const today = new Date();
  const lastDate = new Date(date);
  
  return (
    today.getDate() === lastDate.getDate() &&
    today.getMonth() === lastDate.getMonth() &&
    today.getFullYear() === lastDate.getFullYear()
  );
};

// Helper to check if a date was yesterday
const wasYesterday = (date: string | null): boolean => {
  if (!date) return false;
  
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const lastDate = new Date(date);
  
  return (
    yesterday.getDate() === lastDate.getDate() &&
    yesterday.getMonth() === lastDate.getMonth() &&
    yesterday.getFullYear() === lastDate.getFullYear()
  );
};

// Create the provider component
export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state with loaded tasks and streak data
  const [state, dispatch] = useReducer(taskReducer, {
    ...initialState,
    tasks: loadTasks(),
    streak: loadStreakData(),
  });

  // Save tasks to localStorage when they change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(state.tasks));
  }, [state.tasks]);
  
  // Save streak data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('streak', JSON.stringify(state.streak));
  }, [state.streak]);

  // Action to add a new task
  const addTask = (task: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    
    dispatch({ type: 'ADD_TASK', payload: newTask });
    toast.success("Task added successfully");
  };

  // Action to update an existing task
  const updateTask = (task: Task) => {
    dispatch({ type: 'UPDATE_TASK', payload: task });
    toast.success("Task updated successfully");
  };

  // Action to delete a task
  const deleteTask = (id: string) => {
    dispatch({ type: 'DELETE_TASK', payload: id });
    toast.success("Task deleted successfully");
  };

  // Action to toggle a task's completed status and update streak
  const toggleCompleted = (id: string) => {
    const task = state.tasks.find(t => t.id === id);
    
    // Only update streak if we're completing a task (not un-completing it)
    if (task && !task.completed) {
      updateStreak();
    }
    
    dispatch({ type: 'TOGGLE_COMPLETED', payload: id });
  };
  
  // Update streak when completing a task
  const updateStreak = () => {
    const { currentStreak, longestStreak, lastCompletedDate } = state.streak;
    const today = new Date().toISOString();
    
    // If already completed a task today, no change to streak
    if (wasCompletedToday(lastCompletedDate)) {
      return;
    }
    
    // Calculate new streak value
    let newCurrentStreak = currentStreak;
    
    // If yesterday was the last day, increment streak
    if (wasYesterday(lastCompletedDate)) {
      newCurrentStreak += 1;
    } 
    // If no tasks completed yet, or streak broken, start at 1
    else if (!lastCompletedDate || !wasYesterday(lastCompletedDate)) {
      newCurrentStreak = 1;
    }
    
    // Calculate new longest streak
    const newLongestStreak = Math.max(newCurrentStreak, longestStreak);
    
    // Update streak state
    const newStreakData: StreakData = {
      currentStreak: newCurrentStreak,
      longestStreak: newLongestStreak,
      lastCompletedDate: today,
    };
    
    dispatch({ type: 'UPDATE_STREAK', payload: newStreakData });
    
    // Show streak milestone notifications
    if (newCurrentStreak > 0 && newCurrentStreak % 5 === 0) {
      toast.success(`🔥 ${newCurrentStreak} day streak! Keep it up!`);
    }
  };

  return (
    <TaskContext.Provider
      value={{
        state,
        addTask,
        updateTask,
        deleteTask,
        toggleCompleted,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

// Custom hook to use the task context
export const useTaskContext = () => useContext(TaskContext);
