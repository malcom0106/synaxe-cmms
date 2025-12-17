import React, { useState } from 'react';
import { PageTitle } from '@/components/ui/PageTitle';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Plus, 
  Search,
  Calendar,
  User,
  Circle,
  Target,
  Settings
} from 'lucide-react';

interface Intervention {
  id: string;
  equipment: string;
  gamme: string;
  type: 'Contrôle' | 'Corrective' | 'Préventive';
  operateur: string;
  datePlanifiee: string;
  dateRealisee: string | null;
  statut: 'Terminé' | 'Planifié';
}

const interventions: Intervention[] = [
  {
    id: '#411',
    equipment: 'Pompe distribution 202',
    gamme: 'Test Maintenance',
    type: 'Préventive',
    operateur: '-',
    datePlanifiee: '27/11/2025 01:00',
    dateRealisee: null,
    statut: 'Planifié'
  },
  {
    id: '#566',
    equipment: 'Pompe distribution 202',
    gamme: 'Test Maintenance',
    type: 'Contrôle',
    operateur: '-',
    datePlanifiee: '27/11/2025 01:00',
    dateRealisee: null,
    statut: 'Planifié'
  },
  {
    id: '#596',
    equipment: 'Pompe distribution 202',
    gamme: 'Test Maintenance',
    type: 'Corrective',
    operateur: '-',
    datePlanifiee: '27/11/2025 01:00',
    dateRealisee: null,
    statut: 'Planifié'
  },
  {
    id: '#1',
    equipment: 'Oléoserveur 202',
    gamme: 'Check Quotidienne Oléoserveur',
    type: 'Contrôle',
    operateur: 'Non attribué',
    datePlanifiee: '26/11/2025 01:00',
    dateRealisee: '26/11/2025 11:29',
    statut: 'Terminé'
  },
  {
    id: '#2',
    equipment: 'Oléoserveur 202',
    gamme: 'Check Quotidienne Oléoserveur',
    type: 'Préventive',
    operateur: 'Non attribué',
    datePlanifiee: '28/11/2025 01:00',
    dateRealisee: null,
    statut: 'Planifié'
  },
  {
    id: '#3',
    equipment: 'Oléoserveur 202',
    gamme: 'Check Quotidienne Oléoserveur',
    type: 'Préventive',
    operateur: 'Non attribué',
    datePlanifiee: '29/11/2025 01:00',
    dateRealisee: null,
    statut: 'Planifié'
  },
  {
    id: '#4',
    equipment: 'Oléoserveur 202',
    gamme: 'Check Quotidienne Oléoserveur',
    type: 'Corrective',
    operateur: 'Non attribué',
    datePlanifiee: '30/11/2025 01:00',
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
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle intervention
          </Button>
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
      <div className="mb-6 flex flex-wrap gap-3">
        <Select>
          <SelectTrigger className="w-[200px] bg-card">
            <User className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Sélectionner un opérateur" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="operateur1">Opérateur 1</SelectItem>
            <SelectItem value="operateur2">Opérateur 2</SelectItem>
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className="w-[220px] bg-card">
            <Circle className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Sélectionner un équipement" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pompe202">Pompe distribution 202</SelectItem>
            <SelectItem value="pompe215">Pompe distribution 215</SelectItem>
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className="w-[200px] bg-card">
            <SelectValue placeholder="Sélectionner une gamme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="test">Test Maintenance</SelectItem>
            <SelectItem value="preventive">Maintenance Préventive</SelectItem>
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className="w-[200px] bg-card">
            <SelectValue placeholder="Type d'intervention" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="controle">Contrôle</SelectItem>
            <SelectItem value="corrective">Corrective</SelectItem>
            <SelectItem value="preventive">Préventive</SelectItem>
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className="w-[200px] bg-card">
            <Target className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Sélectionner une famille" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="famille1">Famille 1</SelectItem>
            <SelectItem value="famille2">Famille 2</SelectItem>
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className="w-[220px] bg-card">
            <SelectValue placeholder="Sélectionner une sous-famille" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sous-famille1">Sous-famille 1</SelectItem>
            <SelectItem value="sous-famille2">Sous-famille 2</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" className="bg-card">
          <Calendar className="h-4 w-4 mr-2" />
          27 Nov 2025 - 28 Nov 2025
        </Button>

        <Select>
          <SelectTrigger className="w-[200px] bg-card">
            <Settings className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Sélectionner un statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="termine">Terminé</SelectItem>
            <SelectItem value="planifie">Planifié</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Table */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/30 border-b border-border">
              <tr>
                <th className="px-4 py-3 text-left w-12">
                  <Checkbox 
                    checked={selectedInterventions.length === interventions.length}
                    onCheckedChange={handleSelectAll}
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                  ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                  Équipement
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                  Gamme
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                  Opérateur
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                  Date planifiée
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                  Date réalisée
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                  Statut
                </th>
              </tr>
            </thead>
            <tbody className="bg-card">
              {interventions.map((intervention) => (
                <tr 
                  key={intervention.id} 
                  className="border-b border-border hover:bg-muted/30 transition-colors"
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
                  <td className="px-4 py-3 text-sm text-foreground">
                    {intervention.equipment}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {intervention.gamme}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {intervention.type}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {intervention.operateur}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5 text-sm text-red-600">
                      <Calendar className="h-3.5 w-3.5" />
                      {intervention.datePlanifiee}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {intervention.dateRealisee || '-'}
                  </td>
                  <td className="px-4 py-3">
                    <Badge 
                      className="bg-blue-500/10 text-blue-600 hover:bg-blue-500/10 border-0"
                    >
                      {intervention.statut}
                    </Badge>
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