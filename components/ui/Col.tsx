import React from 'react';
import { cn } from '@/utils/common';

interface ColProps {
  children: React.ReactNode;
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  className?: string;
}

export default function Col({ 
  children, 
  xs = 12, 
  sm, 
  md, 
  lg, 
  xl, 
  className 
}: ColProps) {
  const getColClasses = () => {
    const classes = [];
    
    // Extra small (default)
    if (xs) classes.push(`col-span-${xs}`);
    
    // Small
    if (sm) classes.push(`sm:col-span-${sm}`);
    
    // Medium
    if (md) classes.push(`md:col-span-${md}`);
    
    // Large
    if (lg) classes.push(`lg:col-span-${lg}`);
    
    // Extra large
    if (xl) classes.push(`xl:col-span-${xl}`);
    
    return classes.join(' ');
  };

  return (
    <div className={cn(getColClasses(), className)}>
      {children}
    </div>
  );
} 