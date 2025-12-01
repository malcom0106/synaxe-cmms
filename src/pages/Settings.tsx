import React from 'react';
import { PageTitle } from '@/components/ui/PageTitle';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Monitor, 
  Wrench, 
  Users, 
  Settings2,
  ChevronRight,
  Calendar,
  User,
  Shield,
  Sliders,
  Key
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface SettingCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  to: string;
}

const SettingCard: React.FC<SettingCardProps> = ({ icon, title, description, to }) => (
  <Link to={to}>
    <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-start gap-4">
            <div className="text-primary">{icon}</div>
            <div>
              <h3 className="font-medium text-foreground mb-1">{title}</h3>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </div>
      </CardContent>
    </Card>
  </Link>
);

const Settings: React.FC = () => {
  return (
    <div className="p-6 w-full bg-background">
      <PageTitle 
        title="Paramètres" 
        subtitle="Configuration et administration du système"
      />

      {/* Équipements et Infrastructure */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Monitor className="h-6 w-6 text-foreground" />
          <div>
            <h2 className="text-lg font-semibold text-foreground">Équipements et Infrastructure</h2>
            <p className="text-sm text-muted-foreground">Configuration des types et catégories d'équipements</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SettingCard
            icon={<Monitor className="h-5 w-5" />}
            title="Familles d'Équipements"
            description="Gérer les familles d'équipements"
            to="/settings/equipment-families"
          />
          <SettingCard
            icon={<Monitor className="h-5 w-5" />}
            title="Sous-Familles d'Équipements"
            description="Gérer les sous-familles d'équipements"
            to="/settings/equipment-subfamilies"
          />
        </div>
      </div>

      {/* Utilisateurs et Permissions */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Users className="h-6 w-6 text-foreground" />
          <div>
            <h2 className="text-lg font-semibold text-foreground">Utilisateurs et Permissions</h2>
            <p className="text-sm text-muted-foreground">Gestion des utilisateurs et rôles</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SettingCard
            icon={<User className="h-5 w-5" />}
            title="Utilisateurs"
            description="Gérer les comptes utilisateurs"
            to="/settings/users"
          />
          <SettingCard
            icon={<Shield className="h-5 w-5" />}
            title="Rôles et Permissions"
            description="Configuration des rôles et permissions"
            to="/settings/roles"
          />
        </div>
      </div>

      {/* Système */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Settings2 className="h-6 w-6 text-foreground" />
          <div>
            <h2 className="text-lg font-semibold text-foreground">Système</h2>
            <p className="text-sm text-muted-foreground">Configuration générale du système</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SettingCard
            icon={<Sliders className="h-5 w-5" />}
            title="Paramètres Généraux"
            description="Configuration générale du système"
            to="/settings/general"
          />
          <SettingCard
            icon={<Key className="h-5 w-5" />}
            title="API Keys"
            description="Gérer les clés API"
            to="/settings/api-keys"
          />
        </div>
      </div>
    </div>
  );
};

export default Settings;
