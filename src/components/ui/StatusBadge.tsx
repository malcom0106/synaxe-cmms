
import React from 'react';
import { cn } from '@/lib/utils';

type StatusType = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

interface StatusBadgeProps {
  status: StatusType;
  label: string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  label, 
  className 
}) => {
  const getStatusClasses = () => {
    switch (status) {
      case 'success':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'warning':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'danger':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'info':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'neutral':
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <span className={cn(
      "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
      getStatusClasses(),
      className
    )}>
      {label}
    </span>
  );
};
