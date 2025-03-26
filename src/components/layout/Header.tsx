
import React from 'react';
import { Bell, Search, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Header: React.FC<{ title?: string }> = ({ title }) => {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white/80 px-6 backdrop-blur-md">
      <div className="flex items-center">
        <h1 className="text-xl font-semibold text-gray-800">{title || 'Airfuel GMAO'}</h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative rounded-md hidden sm:flex items-center">
          <Search className="absolute left-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher..."
            className="h-9 w-64 rounded-md border border-gray-200 bg-gray-50 pl-9 pr-4 text-sm focus:border-airfuel-primary focus:outline-none focus:ring-1 focus:ring-airfuel-primary"
          />
        </div>

        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-gray-600" />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-airfuel-danger" />
        </Button>

        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
            <User className="h-4 w-4 text-gray-600" />
          </div>
          <span className="hidden text-sm font-medium text-gray-700 md:block">Technicien</span>
        </div>
      </div>
    </header>
  );
};
