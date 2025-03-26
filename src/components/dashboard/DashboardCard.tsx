
import React from 'react';
import { cn } from '@/lib/utils';

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  children?: React.ReactNode;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  icon,
  trend,
  className,
  children,
}) => {
  return (
    <div 
      className={cn(
        "card-dashboard card-hover animate-scale-in", 
        className
      )}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        {icon && <div className="text-gray-400">{icon}</div>}
      </div>
      <div className="flex items-end justify-between">
        <div>
          <div className="text-2xl font-bold text-gray-900">{value}</div>
          {trend && (
            <div className="mt-1 flex items-center text-xs">
              <span className={cn(
                "font-medium",
                trend.isPositive ? "text-airfuel-success" : "text-airfuel-danger"
              )}>
                {trend.isPositive ? '+' : ''}{trend.value}%
              </span>
              <span className="ml-1 text-gray-500">vs période préc.</span>
            </div>
          )}
        </div>
        {children}
      </div>
    </div>
  );
};
