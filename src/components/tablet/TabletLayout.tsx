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
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
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
  { icon: Stethoscope, label: 'Diagnostic', path: '/tablet/diagnostic' },
];

export const TabletLayout: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path: string) => {
    navigate(path);
    setMenuOpen(false);
  };

  const handleLogout = () => {
    navigate('/tablet/login');
  };

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
            <div className="flex items-center gap-2 bg-primary-foreground/10 rounded-full px-3 py-1">
              <User className="h-5 w-5" />
              <span className="text-sm font-medium">Jean Martin</span>
            </div>
          </div>
        </div>
      </header>

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
            
            <nav className="p-4 space-y-2">
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

            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
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
