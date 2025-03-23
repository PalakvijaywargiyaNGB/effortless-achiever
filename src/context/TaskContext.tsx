
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

interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

type TaskAction =
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'TOGGLE_COMPLETED'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string };

const initialState: TaskState = {
  tasks: [],
  loading: false,
  error: null,
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

// Create the provider component
export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state with loaded tasks
  const [state, dispatch] = useReducer(taskReducer, {
    ...initialState,
    tasks: loadTasks(),
  });

  // Save tasks to localStorage when they change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(state.tasks));
  }, [state.tasks]);

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

  // Action to toggle a task's completed status
  const toggleCompleted = (id: string) => {
    dispatch({ type: 'TOGGLE_COMPLETED', payload: id });
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
