
import React, { useState } from 'react';
import { Task, useTaskContext, Priority } from '@/context/TaskContext';
import { formatDate, getPriorityColor } from '@/utils/taskUtils';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  Tag, 
  Clock, 
  MoreVertical, 
  Edit, 
  Trash2,
  AlertCircle
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { motion } from 'framer-motion';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit }) => {
  const { toggleCompleted, deleteTask } = useTaskContext();
  const [isHovered, setIsHovered] = useState(false);

  // Determine if task is overdue
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;

  // Calculate opacity for completed tasks
  const completedStyle = task.completed ? 'opacity-50' : '';

  // Get color based on priority
  const priorityColor = getPriorityColor(task.priority);
  
  // Format creation date
  const createdDate = formatDate(task.createdAt);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25 }}
      className={`glass-panel glass-panel-hover rounded-xl overflow-hidden ${completedStyle}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start gap-3 p-4">
        <div className="pt-0.5">
          <Checkbox 
            checked={task.completed} 
            onCheckedChange={() => toggleCompleted(task.id)}
            className={task.completed ? 'bg-primary border-primary' : ''}
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h3 className={`font-medium text-base truncate ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
              {task.title}
            </h3>
            <div className="flex items-center gap-1 flex-shrink-0">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem onClick={() => onEdit(task)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => deleteTask(task.id)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          {task.description && (
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {task.description}
            </p>
          )}
          
          <div className="flex flex-wrap items-center gap-3 mt-2">
            {task.dueDate && (
              <div className={`flex items-center gap-1 text-xs rounded-full px-2 py-0.5 ${
                isOverdue ? 'bg-destructive/10 text-destructive' : 'bg-secondary text-muted-foreground'
              }`}>
                {isOverdue ? (
                  <AlertCircle className="h-3 w-3" />
                ) : (
                  <Calendar className="h-3 w-3" />
                )}
                <span>{formatDate(task.dueDate)}</span>
              </div>
            )}
            
            <div className={`flex items-center gap-1 text-xs rounded-full px-2 py-0.5 ${priorityColor}`}>
              <span>{task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}</span>
            </div>
            
            {task.tags && task.tags.length > 0 && (
              <div className="flex items-center gap-1 text-xs bg-secondary text-muted-foreground rounded-full px-2 py-0.5">
                <Tag className="h-3 w-3" />
                <span>{task.tags[0]}</span>
                {task.tags.length > 1 && <span>+{task.tags.length - 1}</span>}
              </div>
            )}
            
            <div className="flex items-center gap-1 text-xs bg-secondary text-muted-foreground rounded-full px-2 py-0.5 ml-auto">
              <Clock className="h-3 w-3" />
              <span>{createdDate}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;
