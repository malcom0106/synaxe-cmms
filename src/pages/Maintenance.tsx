import React, { useState } from 'react';
import { PageTitle } from '@/components/ui/PageTitle';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Plus, 
  Search,
  BarChart3,
  Calendar,
  ChevronRight,
  Settings2
} from 'lucide-react';

interface Intervention {
  id: string;
  equipmentNumber: string;
  equipmentId: string;
  gamme: string;
  assignedTo: string;
  datePlanifiee: string;
  dateRealisee: string | null;
  statut: 'Terminé' | 'Planifié';
}

const interventions: Intervention[] = [
  {
    id: '#1',
    equipmentNumber: '202',
    equipmentId: '4397 4b4b-ae7a-447b-9241-65ad6d68fde3',
    gamme: 'Check Quotidienne Oléoserveur',
    assignedTo: 'Non attribué',
    datePlanifiee: '26/11/2025 01:00',
    dateRealisee: '26/11/2025 11:29',
    statut: 'Terminé'
  },
  {
    id: '#2',
    equipmentNumber: '202',
    equipmentId: '4397 4b4b-ae7a-447b-9241-65ad6d68fde3',
    gamme: 'Check Quotidienne Oléoserveur',
    assignedTo: 'Non attribué',
    datePlanifiee: '27/11/2025 01:00',
    dateRealisee: null,
    statut: 'Planifié'
  },
  {
    id: '#3',
    equipmentNumber: '202',
    equipmentId: '4397 4b4b-ae7a-447b-9241-65ad6d68fde3',
    gamme: 'Check Quotidienne Oléoserveur',
    assignedTo: 'Non attribué',
    datePlanifiee: '28/11/2025 01:00',
    dateRealisee: null,
    statut: 'Planifié'
  },
  {
    id: '#4',
    equipmentNumber: '202',
    equipmentId: '4397 4b4b-ae7a-447b-9241-65ad6d68fde3',
    gamme: 'Check Quotidienne Oléoserveur',
    assignedTo: 'Non attribué',
    datePlanifiee: '29/11/2025 01:00',
    dateRealisee: null,
    statut: 'Planifié'
  },
  {
    id: '#5',
    equipmentNumber: '202',
    equipmentId: '4397 4b4b-ae7a-447b-9241-65ad6d68fde3',
    gamme: 'Check Quotidienne Oléoserveur',
    assignedTo: 'Non attribué',
    datePlanifiee: '30/11/2025 01:00',
    dateRealisee: null,
    statut: 'Planifié'
  },
  {
    id: '#6',
    equipmentNumber: '202',
    equipmentId: '4397 4b4b-ae7a-447b-9241-65ad6d68fde3',
    gamme: 'Check Quotidienne Oléoserveur',
    assignedTo: 'Non attribué',
    datePlanifiee: '01/12/2025 01:00',
    dateRealisee: null,
    statut: 'Planifié'
  },
  {
    id: '#7',
    equipmentNumber: '202',
    equipmentId: '4397 4b4b-ae7a-447b-9241-65ad6d68fde3',
    gamme: 'Check Quotidienne Oléoserveur',
    assignedTo: 'Non attribué',
    datePlanifiee: '02/12/2025 01:00',
    dateRealisee: null,
    statut: 'Planifié'
  },
];

const Maintenance: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInterventions, setSelectedInterventions] = useState<string[]>([]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedInterventions(interventions.map(i => i.id));
    } else {
      setSelectedInterventions([]);
    }
  };

  const handleSelectIntervention = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedInterventions([...selectedInterventions, id]);
    } else {
      setSelectedInterventions(selectedInterventions.filter(i => i !== id));
    }
  };

  return (
    <div className="p-6 w-full bg-background">
      <PageTitle 
        title="Interventions de Maintenance" 
        subtitle="Gérer les interventions de maintenance préventive et corrective"
        action={
          <div className="flex gap-2">
            <Button variant="outline" className="bg-card">
              <BarChart3 className="h-4 w-4 mr-2" />
              Statistiques
            </Button>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle intervention
            </Button>
          </div>
        }
      />
      
      {/* Barre de recherche */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher une intervention..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 w-full rounded-md border border-input bg-card pl-10 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Filtres */}
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <div>
          <label className="text-xs font-medium text-foreground mb-1 block">Statut</label>
          <Select>
            <SelectTrigger className="bg-card">
              <SelectValue placeholder="Sélectionner un statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="termine">Terminé</SelectItem>
              <SelectItem value="planifie">Planifié</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-xs font-medium text-foreground mb-1 block">Équipement</label>
          <Select>
            <SelectTrigger className="bg-card">
              <SelectValue placeholder="Sélectionner un équipement" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="202">202</SelectItem>
              <SelectItem value="215">215</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-xs font-medium text-foreground mb-1 block">Famille d'équipement</label>
          <Select>
            <SelectTrigger className="bg-card">
              <SelectValue placeholder="Sélectionner une famille" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="famille1">Famille 1</SelectItem>
              <SelectItem value="famille2">Famille 2</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-xs font-medium text-foreground mb-1 block">Sous-famille d'équipement</label>
          <Select>
            <SelectTrigger className="bg-card">
              <SelectValue placeholder="Sélectionner une sous-famille" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sous-famille1">Sous-famille 1</SelectItem>
              <SelectItem value="sous-famille2">Sous-famille 2</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-xs font-medium text-foreground mb-1 block">Période</label>
          <Button variant="outline" className="w-full justify-start bg-card">
            <Calendar className="h-4 w-4 mr-2" />
            Sélectionner une période
          </Button>
        </div>
      </div>
      
      {/* Section Liste des Interventions */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Settings2 className="h-5 w-5 text-foreground" />
            <h2 className="text-lg font-semibold text-foreground">Liste des Interventions</h2>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left w-12">
                  <Checkbox 
                    checked={selectedInterventions.length === interventions.length}
                    onCheckedChange={handleSelectAll}
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                  ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                  Équipement
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                  Gamme
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                  Attribué à
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                  Date planifiée
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                  Date réalisée
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                  Statut
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {interventions.map((intervention) => (
                <tr 
                  key={intervention.id} 
                  className="hover:bg-muted/50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <Checkbox 
                      checked={selectedInterventions.includes(intervention.id)}
                      onCheckedChange={(checked) => handleSelectIntervention(intervention.id, checked as boolean)}
                    />
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-foreground">
                    {intervention.id}
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm font-medium text-foreground">{intervention.equipmentNumber}</div>
                    <div className="text-xs text-muted-foreground">ID: {intervention.equipmentId}</div>
                  </td>
                  <td className="px-4 py-3 text-sm text-primary">
                    {intervention.gamme}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {intervention.assignedTo}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {intervention.datePlanifiee}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {intervention.dateRealisee ? (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {intervention.dateRealisee}
                      </div>
                    ) : (
                      'Non définie'
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Badge 
                      className={
                        intervention.statut === 'Terminé'
                          ? 'bg-green-100 text-green-800 hover:bg-green-100'
                          : 'bg-blue-100 text-blue-800 hover:bg-blue-100'
                      }
                    >
                      {intervention.statut}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="gap-1"
                    >
                      Détails
                      <ChevronRight className="h-3 w-3" />
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

export default Maintenance;