
import React, { useState, useEffect } from 'react';
import { useTaskContext, Task } from '@/context/TaskContext';
import { sortTasks, filterTasks } from '@/utils/taskUtils';
import TaskCard from './TaskCard';
import TaskForm from './TaskForm';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { PlusCircle, Search, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { AnimatePresence, motion } from 'framer-motion';

interface TaskListProps {
  showNewTaskForm?: boolean;
}

const TaskList: React.FC<TaskListProps> = ({ showNewTaskForm = false }) => {
  const { state } = useTaskContext();
  const { tasks } = state;
  
  const [sortBy, setSortBy] = useState<'priority' | 'dueDate' | 'createdAt'>('priority');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [isNewTaskDialogOpen, setIsNewTaskDialogOpen] = useState(showNewTaskForm);
  
  // Effect to handle URL params for showing new task form
  useEffect(() => {
    setIsNewTaskDialogOpen(showNewTaskForm);
  }, [showNewTaskForm]);
  
  // Apply sorting and filtering
  const displayedTasks = filterTasks(
    sortTasks(tasks, sortBy),
    {
      status: filter,
      search: searchTerm,
    }
  );
  
  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsNewTaskDialogOpen(true);
  };
  
  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <Tabs defaultValue="all" className="w-full sm:w-auto" onValueChange={(v) => setFilter(v as any)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial sm:w-48">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search tasks..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 input-glass"
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 rounded-full"
                onClick={() => setSearchTerm('')}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
          
          <Select defaultValue={sortBy} onValueChange={(v) => setSortBy(v as any)}>
            <SelectTrigger className="w-32 input-glass">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="priority">Priority</SelectItem>
              <SelectItem value="dueDate">Due Date</SelectItem>
              <SelectItem value="createdAt">Recent</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Task List */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {displayedTasks.length > 0 ? (
            displayedTasks.map((task) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <TaskCard task={task} onEdit={handleEditTask} />
              </motion.div>
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="glass-panel rounded-xl p-8 text-center"
            >
              <h3 className="text-lg font-medium mb-2">No tasks found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm 
                  ? "No tasks match your search criteria" 
                  : filter === 'completed' 
                  ? "You haven't completed any tasks yet" 
                  : filter === 'active' 
                  ? "You don't have any active tasks" 
                  : "Start by adding a new task"}
              </p>
              <Button 
                onClick={() => setIsNewTaskDialogOpen(true)}
                className="mt-2"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add New Task
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Add Task FAB for mobile */}
      <div className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-10">
        <Dialog open={isNewTaskDialogOpen} onOpenChange={setIsNewTaskDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="h-14 w-14 rounded-full shadow-xl">
              <PlusCircle className="h-6 w-6" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] p-0 bg-transparent border-none shadow-none">
            <TaskForm 
              editTask={editingTask} 
              onClose={() => {
                setIsNewTaskDialogOpen(false);
                setEditingTask(undefined);
              }} 
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default TaskList;
