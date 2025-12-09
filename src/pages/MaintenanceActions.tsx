import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageTitle } from '@/components/ui/PageTitle';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Plus, 
  Search,
  Edit
} from 'lucide-react';

interface MaintenanceAction {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
}

const maintenanceActions: MaintenanceAction[] = [
  {
    id: '1',
    name: 'Contrôle visuel',
    description: 'Vérification visuelle de l\'équipement',
    isActive: true
  },
  {
    id: '2',
    name: 'Graissage',
    description: 'Application de graisse sur les points de lubrification',
    isActive: true
  },
  {
    id: '3',
    name: 'Remplacement filtres',
    description: 'Changement des filtres à air et à huile',
    isActive: false
  },
  {
    id: '4',
    name: 'Nettoyage complet',
    description: 'Nettoyage approfondi de l\'équipement',
    isActive: true
  },
  {
    id: '5',
    name: 'Calibration',
    description: 'Calibration des capteurs et instruments',
    isActive: false
  },
];

const MaintenanceActions: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedActions, setSelectedActions] = useState<string[]>([]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedActions(maintenanceActions.map(a => a.id));
    } else {
      setSelectedActions([]);
    }
  };

  const handleSelectAction = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedActions([...selectedActions, id]);
    } else {
      setSelectedActions(selectedActions.filter(a => a !== id));
    }
  };

  return (
    <div className="p-6 w-full bg-background">
      <PageTitle 
        title="Actions de Maintenance" 
        subtitle="Gérer les types d'actions de maintenance"
        action={
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle action
          </Button>
        }
      />
      
      {/* Barre de recherche */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher une action..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 w-full rounded-md border border-input bg-card pl-10 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/30 border-b border-border">
              <tr>
                <th className="px-4 py-3 text-left w-12">
                  <Checkbox 
                    checked={selectedActions.length === maintenanceActions.length}
                    onCheckedChange={handleSelectAll}
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                  Nom
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                  Description
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                  Statut
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-card">
              {maintenanceActions.map((action) => (
                <tr 
                  key={action.id} 
                  className="border-b border-border hover:bg-muted/30 transition-colors cursor-pointer"
                  onClick={() => navigate(`/maintenance/actions/${action.id}`)}
                >
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <Checkbox 
                      checked={selectedActions.includes(action.id)}
                      onCheckedChange={(checked) => handleSelectAction(action.id, checked as boolean)}
                    />
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-foreground">
                    {action.name}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {action.description}
                  </td>
                  <td className="px-4 py-3">
                    <Badge className={action.isActive 
                      ? "bg-green-500/10 text-green-600 hover:bg-green-500/10 border-0" 
                      : "bg-muted text-muted-foreground hover:bg-muted border-0"
                    }>
                      {action.isActive ? 'Actif' : 'Inactif'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="sm" onClick={() => navigate(`/maintenance/actions/${action.id}`)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceActions;
