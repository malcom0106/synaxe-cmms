import React, { useState } from 'react';
import { PageTitle } from '@/components/ui/PageTitle';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Plus, 
  Search,
  Edit,
  Trash2
} from 'lucide-react';

interface MaintenanceAction {
  id: string;
  name: string;
  category: string;
  description: string;
  estimatedTime: string;
}

const maintenanceActions: MaintenanceAction[] = [
  {
    id: '1',
    name: 'Contrôle visuel',
    category: 'Inspection',
    description: 'Vérification visuelle de l\'équipement',
    estimatedTime: '15 min'
  },
  {
    id: '2',
    name: 'Graissage',
    category: 'Lubrification',
    description: 'Application de graisse sur les points de lubrification',
    estimatedTime: '30 min'
  },
  {
    id: '3',
    name: 'Remplacement filtres',
    category: 'Remplacement',
    description: 'Changement des filtres à air et à huile',
    estimatedTime: '45 min'
  },
  {
    id: '4',
    name: 'Nettoyage complet',
    category: 'Nettoyage',
    description: 'Nettoyage approfondi de l\'équipement',
    estimatedTime: '1h'
  },
  {
    id: '5',
    name: 'Calibration',
    category: 'Réglage',
    description: 'Calibration des capteurs et instruments',
    estimatedTime: '1h 30min'
  },
];

const MaintenanceActions: React.FC = () => {
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
                  Catégorie
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                  Description
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                  Temps estimé
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-card">
              {maintenanceActions.map((action) => (
                <tr 
                  key={action.id} 
                  className="border-b border-border hover:bg-muted/30 transition-colors"
                >
                  <td className="px-4 py-3">
                    <Checkbox 
                      checked={selectedActions.includes(action.id)}
                      onCheckedChange={(checked) => handleSelectAction(action.id, checked as boolean)}
                    />
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-foreground">
                    {action.name}
                  </td>
                  <td className="px-4 py-3">
                    <Badge className="bg-blue-500/10 text-blue-600 hover:bg-blue-500/10 border-0">
                      {action.category}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {action.description}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {action.estimatedTime}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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
