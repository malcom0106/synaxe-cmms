import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  Menu, 
  X, 
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
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
}

const navItems: NavItem[] = [
  { icon: Home, label: 'Accueil', path: '/tablet' },
  { icon: Wrench, label: 'Gammes de maintenance', path: '/tablet/ranges' },
  { icon: Calendar, label: 'Plan de maintenance', path: '/tablet/plan' },
  { icon: AlertTriangle, label: "Demandes d'intervention", path: '/tablet/requests' },
  { icon: Package, label: 'Inventaire', path: '/tablet/inventory' },
  { icon: History, label: 'Historique', path: '/tablet/history' },
  { icon: Stethoscope, label: 'Nouveau diagnostic', path: '/tablet/diagnostic' },
];

export const TabletLayout: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(true); // Simulation état réseau
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path: string) => {
    navigate(path);
    setMenuOpen(false);
  };

  const handleLogout = () => {
    navigate('/tablet/login');
  };

  // Simulation de changement d'état réseau
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

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-primary text-primary-foreground shadow-lg">
        <div className="flex items-center justify-between px-4 py-3">
          <Button
            variant="ghost"
            size="icon"
            className="text-primary-foreground hover:bg-primary-foreground/10 h-12 w-12"
            onClick={() => setMenuOpen(true)}
          >
            <Menu className="h-7 w-7" />
          </Button>
          
          <h1 className="text-xl font-semibold">GMAO Tablette</h1>
          
          <div className="flex items-center gap-2">
            {/* Indicateur de connexion */}
            <div className={cn(
              "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
              isOnline ? "bg-green-500/20 text-green-100" : "bg-red-500/20 text-red-100"
            )}>
              {isOnline ? (
                <>
                  <Wifi className="h-3 w-3" />
                  <span className="hidden sm:inline">En ligne</span>
                </>
              ) : (
                <>
                  <WifiOff className="h-3 w-3" />
                  <span className="hidden sm:inline">Hors ligne</span>
                </>
              )}
            </div>
            
            <div className="flex items-center gap-2 bg-primary-foreground/10 rounded-full px-3 py-1">
              <User className="h-5 w-5" />
              <span className="text-sm font-medium hidden sm:inline">Jean Martin</span>
            </div>
          </div>
        </div>
      </header>

      {/* Barre hors ligne */}
      {!isOnline && (
        <div className="bg-orange-500 text-white px-4 py-2 text-sm text-center">
          <WifiOff className="h-4 w-4 inline mr-2" />
          Mode hors ligne - Les données seront synchronisées à la reconnexion
        </div>
      )}

      {/* Menu Drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-50">
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-80 bg-card shadow-2xl animate-in slide-in-from-left duration-300">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-xl font-semibold text-foreground">Menu</h2>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10"
                onClick={() => setMenuOpen(false)}
              >
                <X className="h-6 w-6" />
              </Button>
            </div>

            {/* Info utilisateur */}
            <div className="p-4 border-b border-border bg-muted/30">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="font-semibold text-foreground">Jean Martin</div>
                  <div className="text-sm text-muted-foreground">Mécanicien</div>
                </div>
              </div>
            </div>
            
            <nav className="p-4 space-y-2 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 250px)' }}>
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className={cn(
                    "w-full flex items-center gap-4 px-4 py-4 rounded-xl text-left transition-all active:scale-95",
                    location.pathname === item.path
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted/50 text-foreground hover:bg-muted"
                  )}
                >
                  <item.icon className="h-6 w-6" />
                  <span className="text-lg font-medium">{item.label}</span>
                </button>
              ))}
            </nav>

            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-card">
              {/* Indicateur de synchronisation */}
              <div className="mb-3 p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">État de synchronisation</span>
                  <Badge variant={isOnline ? "default" : "secondary"} className="text-xs">
                    {isOnline ? "Synchronisé" : "En attente"}
                  </Badge>
                </div>
              </div>
              
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-4 px-4 py-4 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive/20 transition-all active:scale-95"
              >
                <LogOut className="h-6 w-6" />
                <span className="text-lg font-medium">Déconnexion</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};
