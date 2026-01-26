import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageTitle } from '@/components/ui/PageTitle';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Plus, 
  Search,
  Edit,
  Lock,
  Gauge,
  Clock,
  Droplets
} from 'lucide-react';
import EditMaintenanceActionModal from '@/components/maintenance/EditMaintenanceActionModal';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface MaintenanceAction {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  isReferential?: boolean; // Actions référentielles avec IDs négatifs
}

// Actions référentielles - IDs négatifs, non modifiables, non supprimables
const referentialActions: MaintenanceAction[] = [
  {
    id: '-1',
    name: 'Kilomètres',
    description: 'Action référentielle liée au compteur kilométrique de l\'équipement',
    isActive: true,
    isReferential: true
  },
  {
    id: '-2',
    name: 'Temps',
    description: 'Action référentielle liée au temps de fonctionnement moteur',
    isActive: true,
    isReferential: true
  },
  {
    id: '-3',
    name: 'Litrage',
    description: 'Action référentielle liée au volume de fluide consommé',
    isActive: true,
    isReferential: true
  },
];

// Actions classiques créées par les utilisateurs
const userActionsData: MaintenanceAction[] = [
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

// Fonction utilitaire pour vérifier si une action est référentielle
export const isReferentialAction = (id: string): boolean => {
  return parseInt(id) < 0;
};

// Fonction pour obtenir l'icône d'une action référentielle
const getReferentialIcon = (id: string) => {
  switch (id) {
    case '-1':
      return <Gauge className="h-4 w-4" />;
    case '-2':
      return <Clock className="h-4 w-4" />;
    case '-3':
      return <Droplets className="h-4 w-4" />;
    default:
      return null;
  }
};

const MaintenanceActions: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedActions, setSelectedActions] = useState<string[]>([]);
  const [userActions, setUserActions] = useState<MaintenanceAction[]>(userActionsData);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<MaintenanceAction | null>(null);

  // Combiner les actions référentielles et utilisateur
  const allActions = [...referentialActions, ...userActions];

  // Filtrer les actions selon la recherche
  const filteredActions = allActions.filter(action =>
    action.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    action.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Séparer les actions filtrées
  const filteredReferentialActions = filteredActions.filter(a => a.isReferential);
  const filteredUserActions = filteredActions.filter(a => !a.isReferential);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      // Ne sélectionner que les actions non référentielles
      setSelectedActions(userActions.map(a => a.id));
    } else {
      setSelectedActions([]);
    }
  };

  const handleSelectAction = (id: string, checked: boolean) => {
    // Empêcher la sélection des actions référentielles
    if (isReferentialAction(id)) return;
    
    if (checked) {
      setSelectedActions([...selectedActions, id]);
    } else {
      setSelectedActions(selectedActions.filter(a => a !== id));
    }
  };

  const handleEditClick = (action: MaintenanceAction) => {
    // Empêcher l'édition des actions référentielles
    if (action.isReferential) return;
    
    setSelectedAction(action);
    setEditModalOpen(true);
  };

  const handleSave = (updatedAction: MaintenanceAction) => {
    setUserActions(prev => 
      prev.map(a => a.id === updatedAction.id ? updatedAction : a)
    );
  };

  const handleRowClick = (action: MaintenanceAction) => {
    // Pour les actions référentielles, naviguer en lecture seule
    navigate(`/maintenance/actions/${action.id}`);
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
                    checked={selectedActions.length === userActions.length && userActions.length > 0}
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
              {/* Actions référentielles en premier */}
              {filteredReferentialActions.length > 0 && (
                <>
                  {filteredReferentialActions.map((action) => (
                    <tr 
                      key={action.id} 
                      className="border-b border-border hover:bg-orange-50/50 transition-colors cursor-pointer bg-orange-50/30"
                      onClick={() => handleRowClick(action)}
                    >
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center justify-center">
                              <Lock className="h-4 w-4 text-orange-500" />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Action référentielle - Non modifiable</p>
                          </TooltipContent>
                        </Tooltip>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-orange-600">
                            {getReferentialIcon(action.id)}
                          </span>
                          <span className="text-sm font-medium text-orange-600">
                            {action.name}
                          </span>
                          <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 border-0 text-[10px] px-1.5 py-0">
                            Référentiel
                          </Badge>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {action.description}
                      </td>
                      <td className="px-4 py-3">
                        <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/10 border-0">
                          Actif
                        </Badge>
                      </td>
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="sm" disabled className="opacity-50">
                              <Lock className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Les actions référentielles ne peuvent pas être modifiées</p>
                          </TooltipContent>
                        </Tooltip>
                      </td>
                    </tr>
                  ))}
                  {/* Séparateur visuel */}
                  {filteredUserActions.length > 0 && (
                    <tr className="bg-muted/20">
                      <td colSpan={5} className="px-4 py-2">
                        <span className="text-xs text-muted-foreground font-medium">
                          Actions personnalisées
                        </span>
                      </td>
                    </tr>
                  )}
                </>
              )}
              
              {/* Actions utilisateur */}
              {filteredUserActions.map((action) => (
                <tr 
                  key={action.id} 
                  className="border-b border-border hover:bg-muted/30 transition-colors cursor-pointer"
                  onClick={() => handleRowClick(action)}
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
                    <Button variant="ghost" size="sm" onClick={() => handleEditClick(action)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Légende */}
      <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-orange-100 border border-orange-200" />
          <span>Actions référentielles (système)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-card border border-border" />
          <span>Actions personnalisées</span>
        </div>
      </div>

      <EditMaintenanceActionModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        action={selectedAction}
        onSave={handleSave}
      />
    </div>
  );
};

export default MaintenanceActions;