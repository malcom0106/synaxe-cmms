import React, { useState } from 'react';
import { PageTitle } from '@/components/ui/PageTitle';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Search,
  Filter,
  Calendar,
  Clock,
  Monitor,
  Play,
  Copy,
  Edit,
  ChevronRight,
  BarChart3
} from 'lucide-react';

interface MaintenanceRange {
  id: number;
  name: string;
  type: 'Maintenance Préventive' | 'Maintenance Corrective';
  frequency: string;
  familyEquipment: string;
  subFamily: string;
  actions: {
    total: number;
    details: string[];
  };
  interventions: number;
}

const maintenanceRanges: MaintenanceRange[] = [
  {
    id: 1,
    name: 'Check Quotidienne Oléoserveur',
    type: 'Maintenance Préventive',
    frequency: 'Quotidien',
    familyEquipment: 'Camion',
    subFamily: 'Oléoserveur',
    actions: {
      total: 3,
      details: ['Étape 1 check', 'Étape 2 check', '+1 autres']
    },
    interventions: 0
  },
];

const MaintenanceRanges: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="p-6 w-full bg-background">
      <PageTitle 
        title="Gamme de Maintenance" 
        subtitle="Planifier et gérer les gammes de maintenance"
        action={
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle gamme
          </Button>
        }
      />
      
      {/* Barre de recherche avec filtres */}
      <div className="mb-6 flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher une gamme de maintenance..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 w-full rounded-md border border-input bg-card pl-10 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <Button variant="outline" className="bg-card">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
        <Button variant="outline" className="bg-card">
          <Calendar className="h-4 w-4 mr-2" />
          Calendrier
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/30 border-b border-border">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                  ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                  Gamme de maintenance
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                  Périodicité
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                  Famille équipement
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                  Actions
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                  Interventions
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-card">
              {maintenanceRanges.map((range) => (
                <tr 
                  key={range.id} 
                  className="border-b border-border hover:bg-muted/30 transition-colors"
                >
                  <td className="px-4 py-4 text-sm font-medium text-foreground">
                    {range.id}
                  </td>
                  <td className="px-4 py-4 text-sm font-medium text-foreground">
                    {range.name}
                  </td>
                  <td className="px-4 py-4">
                    <Badge className="bg-blue-500/10 text-blue-600 hover:bg-blue-500/10 border-0">
                      {range.type}
                    </Badge>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2 text-sm text-foreground">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      {range.frequency}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2 text-sm text-foreground">
                      <Monitor className="h-4 w-4 text-muted-foreground" />
                      <span>{range.familyEquipment}</span>
                      <ChevronRight className="h-3 w-3 text-muted-foreground" />
                      <span>{range.subFamily}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm">
                      <div className="font-medium text-foreground mb-1">
                        {range.actions.total} action(s)
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {range.actions.details.join(', ')}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2 text-sm text-foreground">
                      <BarChart3 className="h-4 w-4 text-muted-foreground" />
                      {range.interventions} intervention(s)
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Play className="h-4 w-4 text-primary" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Copy className="h-4 w-4 text-muted-foreground" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Edit className="h-4 w-4 text-primary" />
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

export default MaintenanceRanges;
