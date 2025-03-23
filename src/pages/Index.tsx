
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Container from '@/components/ui/Container';
import TaskList from '@/components/tasks/TaskList';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { TaskProvider } from '@/context/TaskContext';

const Index = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  // Parse URL param to check if new task dialog should be shown
  const searchParams = new URLSearchParams(location.search);
  const showNewTaskForm = searchParams.has('newTask');
  
  // Clear URL param after dialog is shown
  useEffect(() => {
    if (showNewTaskForm) {
      const cleanUrl = location.pathname;
      navigate(cleanUrl, { replace: true });
    }
  }, [showNewTaskForm, location.pathname, navigate]);
  
  return (
    <TaskProvider>
      <div className="min-h-screen">
        <Header />
        <Sidebar />
        
        <main className={`min-h-screen pt-24 pb-10 px-4 ${!isMobile ? 'md:pl-72' : ''}`}>
          <Container>
            <div className="mb-6">
              <h1 className="text-3xl font-semibold mb-2">Tasks</h1>
              <p className="text-muted-foreground">
                Manage and organize all your tasks
              </p>
            </div>
            
            <TaskList showNewTaskForm={showNewTaskForm} />
          </Container>
        </main>
      </div>
    </TaskProvider>
  );
};

export default Index;
