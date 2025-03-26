
import React from 'react';
import { cn } from '@/lib/utils';

interface PageTitleProps {
  title: string;
  subtitle?: string;
  className?: string;
  action?: React.ReactNode;
}

export const PageTitle: React.FC<PageTitleProps> = ({ 
  title, 
  subtitle, 
  className, 
  action 
}) => {
  return (
    <div className={cn("mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between", className)}>
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 animate-slide-in">{title}</h1>
        {subtitle && (
          <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
        )}
      </div>
      {action && (
        <div className="mt-4 sm:mt-0 animate-scale-in">
          {action}
        </div>
      )}
    </div>
  );
};
