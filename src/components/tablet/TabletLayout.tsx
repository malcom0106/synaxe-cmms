import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  Wrench, 
  Calendar, 
  AlertTriangle,
  LogOut,
  User,
  Package,
  History,
  Wifi,
  WifiOff,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
}

const navItems: NavItem[] = [
  { icon: Home, label: 'Accueil', path: '/tablet' },
  { icon: Wrench, label: 'Gammes', path: '/tablet/ranges' },
  { icon: Calendar, label: 'Plan', path: '/tablet/plan' },
  { icon: AlertTriangle, label: "Demande d'intervention", path: '/tablet/requests' },
  { icon: Package, label: 'Inventaire', path: '/tablet/inventory' },
  { icon: History, label: 'Historique', path: '/tablet/history' },
];

export const TabletLayout: React.FC = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isInterventionPage = location.pathname.includes('/tablet/intervention/');

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleLogout = () => {
    navigate('/tablet/login');
  };

  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isInterventionPage) {
    return (
      <div className="min-h-screen bg-muted/30">
        <Outlet />
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background flex">
        {/* Sidebar */}
        <aside className={cn(
          "bg-primary flex flex-col py-3 shrink-0 transition-all duration-300",
          expanded ? "w-48 px-3" : "w-16 items-center"
        )}>
          {/* Logo */}
          <div className={cn(
            "flex items-center mb-2",
            expanded ? "justify-start px-1" : "justify-center"
          )}>
            <div className={cn(
              "rounded-lg bg-primary-foreground/20 flex items-center justify-center",
              expanded ? "w-8 h-8" : "w-10 h-10"
            )}>
              <span className="text-primary-foreground font-bold text-sm">GM</span>
            </div>
            {expanded && <span className="text-primary-foreground font-semibold ml-2 text-sm">GMAO</span>}
          </div>

          {/* Navigation items */}
          <nav className="flex-1 flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path || 
                (item.path !== '/tablet' && location.pathname.startsWith(item.path));
              
              const navButton = (
                <button
                  onClick={() => handleNavigation(item.path)}
                  className={cn(
                    "rounded-lg flex items-center transition-all",
                    expanded 
                      ? "w-full h-10 px-3 gap-3 justify-start" 
                      : "w-11 h-11 justify-center",
                    isActive
                      ? "bg-primary-foreground text-primary"
                      : "text-primary-foreground/70 hover:bg-primary-foreground/10 hover:text-primary-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  {expanded && <span className="text-sm font-medium truncate">{item.label}</span>}
                </button>
              );

              if (expanded) {
                return <div key={item.path}>{navButton}</div>;
              }

              return (
                <Tooltip key={item.path} delayDuration={0}>
                  <TooltipTrigger asChild>
                    {navButton}
                  </TooltipTrigger>
                  <TooltipContent side="right" className="font-medium">
                    {item.label}
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </nav>

          {/* Statut connexion */}
          <div className={cn(
            "rounded-lg flex items-center",
            expanded ? "w-full h-10 px-3 gap-3" : "w-11 h-11 justify-center",
            isOnline ? "text-green-300" : "text-red-300"
          )}>
            {isOnline ? <Wifi className="h-5 w-5 shrink-0" /> : <WifiOff className="h-5 w-5 shrink-0" />}
            {expanded && <span className="text-sm">{isOnline ? 'En ligne' : 'Hors ligne'}</span>}
          </div>

          {/* Déconnexion */}
          {expanded ? (
            <button
              onClick={handleLogout}
              className="w-full h-10 rounded-lg flex items-center px-3 gap-3 text-primary-foreground/70 hover:bg-red-500/20 hover:text-red-300 transition-all"
            >
              <LogOut className="h-5 w-5 shrink-0" />
              <span className="text-sm font-medium">Déconnexion</span>
            </button>
          ) : (
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <button
                  onClick={handleLogout}
                  className="w-11 h-11 rounded-lg flex items-center justify-center text-primary-foreground/70 hover:bg-red-500/20 hover:text-red-300 transition-all"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="font-medium">
                Déconnexion
              </TooltipContent>
            </Tooltip>
          )}
        </aside>

        {/* Main content area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header compact */}
          <header className="h-12 bg-card border-b border-border flex items-center justify-between px-4 shrink-0">
            <h1 className="text-base font-semibold text-foreground">GMAO Tablette</h1>
            
            <div className="flex items-center gap-3">
              {!isOnline && (
                <span className="text-xs text-orange-600 font-medium">Mode hors ligne</span>
              )}
              {/* Toggle menu + User */}
              <button
                onClick={() => setExpanded(!expanded)}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Jean Martin</span>
                {expanded ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </button>
            </div>
          </header>

          {/* Barre hors ligne */}
          {!isOnline && (
            <div className="bg-orange-500 text-white px-4 py-1.5 text-xs text-center">
              <WifiOff className="h-3 w-3 inline mr-2" />
              Les données seront synchronisées à la reconnexion
            </div>
          )}

          {/* Main Content */}
          <main className="flex-1 overflow-auto p-4">
            <Outlet />
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
};