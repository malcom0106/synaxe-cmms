import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  Wrench, 
  Calendar, 
  AlertTriangle, 
  Stethoscope,
  LogOut,
  User,
  Package,
  History,
  Wifi,
  WifiOff
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
  { icon: AlertTriangle, label: 'Demandes', path: '/tablet/requests' },
  { icon: Package, label: 'Inventaire', path: '/tablet/inventory' },
  { icon: History, label: 'Historique', path: '/tablet/history' },
  { icon: Stethoscope, label: 'Diagnostic', path: '/tablet/diagnostic' },
];

export const TabletLayout: React.FC = () => {
  const [isOnline, setIsOnline] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Vérifier si on est sur une page d'intervention (pour masquer le menu)
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

  // Layout spécial pour les interventions (plein écran)
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
        {/* Sidebar permanente avec icônes carrées */}
        <aside className="w-16 bg-primary flex flex-col items-center py-3 gap-1 shrink-0">
          {/* Logo/Accueil */}
          <div className="w-10 h-10 rounded-lg bg-primary-foreground/20 flex items-center justify-center mb-2">
            <span className="text-primary-foreground font-bold text-sm">GM</span>
          </div>

          {/* Navigation items */}
          <nav className="flex-1 flex flex-col items-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path || 
                (item.path !== '/tablet' && location.pathname.startsWith(item.path));
              
              return (
                <Tooltip key={item.path} delayDuration={0}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => handleNavigation(item.path)}
                      className={cn(
                        "w-11 h-11 rounded-lg flex items-center justify-center transition-all",
                        isActive
                          ? "bg-primary-foreground text-primary"
                          : "text-primary-foreground/70 hover:bg-primary-foreground/10 hover:text-primary-foreground"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                    </button>
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
            "w-11 h-11 rounded-lg flex items-center justify-center",
            isOnline ? "text-green-300" : "text-red-300"
          )}>
            {isOnline ? <Wifi className="h-5 w-5" /> : <WifiOff className="h-5 w-5" />}
          </div>

          {/* Déconnexion */}
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
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Jean Martin</span>
              </div>
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