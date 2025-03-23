
import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { Menu, X, Sun, Moon, Search } from 'lucide-react';

const Header: React.FC = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    document.documentElement.classList.toggle('dark', newMode);
  };

  // Get page title based on current route
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Home';
      case '/dashboard':
        return 'Dashboard';
      case '/focus':
        return 'Focus Mode';
      case '/settings':
        return 'Settings';
      default:
        return 'Task Master';
    }
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-background/80 backdrop-blur-lg shadow-subtle' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-semibold">TM</span>
              </div>
              <span className="font-semibold text-lg hidden sm:inline-block animate-fade-in">
                Task Master
              </span>
            </Link>
          </div>

          {/* Page Title (Center) - Only on Mobile */}
          {isMobile && (
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <h1 className="text-lg font-medium">{getPageTitle()}</h1>
            </div>
          )}

          {/* Right Section - Actions */}
          <div className="flex items-center space-x-2">
            {!isMobile && (
              <div className="relative mr-2">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-muted-foreground" />
                </div>
                <input 
                  type="text" 
                  placeholder="Search tasks..." 
                  className="input-glass pl-10 py-1.5 text-sm w-36 focus:w-64 transition-all duration-300"
                />
              </div>
            )}
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleDarkMode}
              className="rounded-full"
            >
              {isDarkMode ? 
                <Sun className="h-[1.2rem] w-[1.2rem]" /> : 
                <Moon className="h-[1.2rem] w-[1.2rem]" />
              }
            </Button>
            
            {isMobile && (
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile Menu Overlay */}
      {isMobile && mobileMenuOpen && (
        <div className="fixed inset-0 bg-background/95 backdrop-blur-md z-40 animate-fade-in">
          <div className="flex flex-col items-center justify-center h-full space-y-8">
            <Link 
              to="/" 
              className="text-2xl font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/dashboard" 
              className="text-2xl font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link 
              to="/focus" 
              className="text-2xl font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Focus Mode
            </Link>
            <Link 
              to="/settings" 
              className="text-2xl font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Settings
            </Link>
            <div className="mt-8">
              <Button
                variant="outline"
                size="lg"
                className="rounded-full px-8"
                onClick={() => {
                  toggleDarkMode();
                  setMobileMenuOpen(false);
                }}
              >
                {isDarkMode ? 'Light Mode' : 'Dark Mode'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
