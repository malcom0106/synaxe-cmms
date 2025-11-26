
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Settings, 
  BarChart, 
  Calendar, 
  Wrench, 
  Box, 
  TriangleAlert,
  Globe,
  LogOut,
  ChevronLeft,
  Package
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
      "flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors rounded-md",
      isActive 
        ? "bg-primary/10 text-primary" 
        : "text-foreground hover:bg-muted"
    )}
  >
    <Icon className="h-5 w-5 shrink-0" />
    <span>{label}</span>
  </NavLink>
);

export const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside 
      className={cn(
        "flex h-screen flex-col border-r border-border bg-card transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header with Logo */}
      <div className="flex items-center gap-3 border-b border-border p-4">
        <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center shrink-0">
          <Package className="h-6 w-6 text-primary-foreground" />
        </div>
        {!collapsed && (
          <div className="flex-1">
            <h1 className="text-base font-semibold text-foreground">Synaxe CMMS</h1>
            <p className="text-xs text-muted-foreground">Gestion de maintenance</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        <NavItem to="/" icon={BarChart} label="Tableau de bord" expanded={!collapsed} />
        <NavItem to="/maintenance" icon={Wrench} label="Interventions de maintenance" expanded={!collapsed} />
        <NavItem to="/calendar" icon={Calendar} label="Calendrier" expanded={!collapsed} />
        <NavItem to="/equipment" icon={Box} label="Équipements" expanded={!collapsed} />
        <NavItem to="/anomalies" icon={TriangleAlert} label="Anomalies" expanded={!collapsed} />
        <NavItem to="/settings" icon={Settings} label="Paramètres" expanded={!collapsed} />
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="border-t border-border">
          {/* Language Selector */}
          <button className="flex items-center gap-3 px-4 py-3 text-sm text-muted-foreground hover:bg-muted w-full transition-colors">
            <Globe className="h-5 w-5" />
            <span>Changer la langue</span>
          </button>

          {/* User Profile */}
          <div className="p-4 bg-muted/30">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-sm font-semibold text-primary">AB</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">Adélaïde BRUNIN</p>
                <p className="text-xs text-muted-foreground truncate">abrunin@synaxe.com</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="w-full justify-start gap-2">
              <LogOut className="h-4 w-4" />
              <span>Se déconnecter</span>
            </Button>
            <p className="text-xs text-muted-foreground text-center mt-3">V 1.0.1</p>
          </div>
        </div>
      )}

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 h-6 w-6 rounded-full bg-card border border-border flex items-center justify-center hover:bg-muted transition-colors"
      >
        <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
      </button>
    </aside>
  );
};
