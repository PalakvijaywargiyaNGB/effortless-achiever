
import React from 'react';
import { cn } from '@/lib/utils';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  glass?: boolean;
}

const Container: React.FC<ContainerProps> = ({ 
  children, 
  className,
  glass = false
}) => {
  return (
    <div className={cn(
      'w-full mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl transition-all duration-300 ease-in-out',
      glass && 'glass-panel rounded-lg p-6',
      className
    )}>
      {children}
    </div>
  );
};

export default Container;
