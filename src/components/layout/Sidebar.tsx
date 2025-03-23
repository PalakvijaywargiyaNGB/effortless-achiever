
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { LayoutDashboard, ListChecks, BrainCircuit, Settings, PlusCircle } from 'lucide-react';
import { useTaskContext } from '@/context/TaskContext';
import { generateProductivityStats } from '@/utils/taskUtils';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { state: { tasks } } = useTaskContext();
  const stats = generateProductivityStats(tasks);
  
  const navigationItems = [
    {
      name: 'Dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
      path: '/dashboard',
    },
    {
      name: 'Tasks',
      icon: <ListChecks className="w-5 h-5" />,
      path: '/',
    },
    {
      name: 'Focus Mode',
      icon: <BrainCircuit className="w-5 h-5" />,
      path: '/focus',
    },
    {
      name: 'Settings',
      icon: <Settings className="w-5 h-5" />,
      path: '/settings',
    },
  ];

  return (
    <aside className="hidden md:flex flex-col h-screen w-64 fixed left-0 top-0 bg-card border-r border-border pt-16">
      {/* Quick Stats */}
      <div className="px-6 py-6">
        <div className="glass-panel rounded-xl p-4 mb-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Today's Progress</h3>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm">Completion Rate</span>
            <span className="text-sm font-medium">{stats.completionRate}%</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2 mb-4">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${stats.completionRate}%` }}
            ></div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {stats.completed} of {stats.total} tasks
            </span>
            <span className="text-xs text-primary font-medium">
              {stats.tasksCompletedToday} today
            </span>
          </div>
        </div>
        
        {/* Quick Add Task */}
        <Link 
          to="/?newTask=true" 
          className="flex items-center gap-2 w-full p-3 rounded-lg border border-border bg-background hover:bg-secondary/50 transition-colors mb-6 text-sm font-medium"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Task</span>
        </Link>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 px-3">
        <ul className="space-y-1">
          {navigationItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200",
                  location.pathname === item.path
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      {/* User Info */}
      <div className="p-4 border-t border-border mt-auto">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-foreground font-medium">
            U
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">User</p>
            <p className="text-xs text-muted-foreground truncate">Productivity Expert</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
