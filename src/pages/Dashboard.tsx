
import React from 'react';
import { useTaskContext } from '@/context/TaskContext';
import { 
  generateProductivityStats, 
  filterTasks, 
  sortTasks,
  formatDate
} from '@/utils/taskUtils';
import Container from '@/components/ui/Container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import StreakDisplay from '@/components/streak/StreakDisplay';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { ArrowUp, ArrowDown, CheckCircle, Clock, Calendar, CircleOff } from 'lucide-react';

const Dashboard = () => {
  const { state: { tasks } } = useTaskContext();
  const stats = generateProductivityStats(tasks);
  
  // Calculate tasks by priority
  const tasksByPriority = [
    { name: 'High', value: tasks.filter(t => t.priority === 'high').length },
    { name: 'Medium', value: tasks.filter(t => t.priority === 'medium').length },
    { name: 'Low', value: tasks.filter(t => t.priority === 'low').length },
  ];
  
  // Calculate completion by day (last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);
    return date;
  }).reverse();
  
  const taskCompletionByDay = last7Days.map(date => {
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    const dayTasks = tasks.filter(task => {
      const taskDate = new Date(task.createdAt);
      return taskDate.getDate() === date.getDate() && 
             taskDate.getMonth() === date.getMonth() && 
             taskDate.getFullYear() === date.getFullYear();
    });
    
    const completed = dayTasks.filter(t => t.completed).length;
    const total = dayTasks.length;
    
    return {
      name: dayName,
      completed,
      total,
    };
  });
  
  // Upcoming/overdue tasks
  const upcomingTasks = filterTasks(
    sortTasks(tasks, 'dueDate'),
    { status: 'active' }
  ).slice(0, 3);
  
  // Pie chart colors
  const COLORS = ['#f87171', '#fbbf24', '#34d399'];
  
  return (
    <div className="min-h-screen pt-24 pb-10 px-4">
      <Container>
        <div className="mb-6">
          <h1 className="text-3xl font-semibold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Your productivity overview and task insights
          </p>
        </div>
        
        {/* Streak Display */}
        <div className="mb-6">
          <StreakDisplay />
        </div>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="glass-panel glass-panel-hover">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-3xl font-semibold">{stats.total}</p>
                  <p className="text-xs text-muted-foreground">tasks created</p>
                </div>
                <div className="bg-primary/10 p-2 rounded-full">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-panel glass-panel-hover">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-3xl font-semibold">{stats.completed}</p>
                  <p className="text-xs text-muted-foreground">tasks done</p>
                </div>
                <div className="bg-green-500/10 p-2 rounded-full">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-panel glass-panel-hover">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Completion Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-3xl font-semibold">{stats.completionRate}%</p>
                  <p className="text-xs text-muted-foreground">overall rate</p>
                </div>
                <div className={`${stats.completionRate > 50 ? 'bg-green-500/10' : 'bg-amber-500/10'} p-2 rounded-full`}>
                  {stats.completionRate > 50 ? (
                    <ArrowUp className={`h-6 w-6 ${stats.completionRate > 50 ? 'text-green-500' : 'text-amber-500'}`} />
                  ) : (
                    <ArrowDown className={`h-6 w-6 ${stats.completionRate > 50 ? 'text-green-500' : 'text-amber-500'}`} />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-panel glass-panel-hover">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Today
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-3xl font-semibold">{stats.tasksCompletedToday}</p>
                  <p className="text-xs text-muted-foreground">tasks completed today</p>
                </div>
                <div className="bg-blue-500/10 p-2 rounded-full">
                  <Calendar className="h-6 w-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card className="glass-panel glass-panel-hover lg:col-span-2">
            <CardHeader>
              <CardTitle>Weekly Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={taskCompletionByDay}
                    margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
                    <XAxis dataKey="name" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip />
                    <Bar dataKey="total" stackId="a" fill="#94a3b8" name="Total Tasks" />
                    <Bar dataKey="completed" stackId="a" fill="#0ea5e9" name="Completed" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-panel glass-panel-hover">
            <CardHeader>
              <CardTitle>Tasks by Priority</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={tasksByPriority}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => 
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {tasksByPriority.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Upcoming Tasks */}
        <Card className="glass-panel glass-panel-hover">
          <CardHeader>
            <CardTitle>Upcoming Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingTasks.length > 0 ? (
              <div className="space-y-4">
                {upcomingTasks.map(task => (
                  <div key={task.id} className="flex items-start justify-between p-3 border border-border/50 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-full ${
                        task.priority === 'high' ? 'bg-red-500/10 text-red-500' :
                        task.priority === 'medium' ? 'bg-amber-500/10 text-amber-500' :
                        'bg-green-500/10 text-green-500'
                      }`}>
                        <Clock className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="font-medium">{task.title}</h4>
                        {task.description && (
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {task.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {task.dueDate ? formatDate(task.dueDate) : 'No due date'}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <CircleOff className="h-10 w-10 mx-auto mb-2 text-muted-foreground/50" />
                <p className="text-muted-foreground">No upcoming tasks</p>
              </div>
            )}
          </CardContent>
        </Card>
      </Container>
    </div>
  );
};

export default Dashboard;
