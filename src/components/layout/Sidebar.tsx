
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Settings, 
  BarChart, 
  Calendar, 
  FileText, 
  Tool, 
  Truck, 
  Package, 
  Menu, 
  X, 
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

type NavItemProps = {
  to: string;
  icon: React.ElementType;
  label: string;
  expanded: boolean;
};

const NavItem: React.FC<NavItemProps> = ({ to, icon: Icon, label, expanded }) => (
  <NavLink 
    to={to} 
    className={({ isActive }) => cn(
      "group relative flex h-12 items-center overflow-hidden rounded-lg transition-all duration-300 ease-in-out",
      expanded ? "w-full px-4" : "w-12 justify-center",
      isActive 
        ? "bg-airfuel-primary/10 text-airfuel-primary" 
        : "text-gray-600 hover:bg-gray-100"
    )}
  >
    <Icon className={cn("h-5 w-5 shrink-0", expanded ? "mr-3" : "")} />
    <span className={cn(
      "absolute left-12 whitespace-nowrap transition-all duration-300", 
      expanded ? "opacity-100" : "opacity-0"
    )}>
      {label}
    </span>
    {!expanded && (
      <div className="absolute left-14 z-10 ml-4 hidden w-auto min-w-[180px] rounded-md bg-white px-2 py-1 shadow-md group-hover:block">
        <span className="block text-sm font-medium text-gray-700">{label}</span>
      </div>
    )}
  </NavLink>
);

export const Sidebar: React.FC = () => {
  const [expanded, setExpanded] = useState(true);

  return (
    <aside 
      className={cn(
        "flex h-screen flex-col border-r border-gray-200 bg-white transition-all duration-300 ease-in-out",
        expanded ? "w-64" : "w-16"
      )}
    >
      <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4">
        <div className={cn("flex items-center", expanded ? "justify-start" : "justify-center w-full")}>
          {expanded ? (
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-airfuel-primary flex items-center justify-center">
                <span className="text-white font-bold">AF</span>
              </div>
              <span className="ml-2 font-semibold text-airfuel-dark">Airfuel GMAO</span>
            </div>
          ) : (
            <div className="h-8 w-8 rounded-full bg-airfuel-primary flex items-center justify-center">
              <span className="text-white font-bold">AF</span>
            </div>
          )}
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setExpanded(!expanded)}
          className={cn("hidden sm:flex", !expanded && "w-full justify-center")}
        >
          {expanded ? <ChevronRight className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3">
        <NavItem to="/" icon={BarChart} label="Tableau de bord" expanded={expanded} />
        <NavItem to="/preventive" icon={Calendar} label="Maintenance préventive" expanded={expanded} />
        <NavItem to="/corrective" icon={Tool} label="Maintenance corrective" expanded={expanded} />
        <NavItem to="/equipment" icon={Truck} label="Équipements" expanded={expanded} />
        <NavItem to="/inventory" icon={Package} label="Stocks" expanded={expanded} />
        <NavItem to="/documents" icon={FileText} label="Documentation" expanded={expanded} />
      </nav>

      <div className="mt-auto border-t border-gray-200 p-3">
        <NavItem to="/settings" icon={Settings} label="Paramètres" expanded={expanded} />
      </div>
    </aside>
  );
};
