import React, { useState } from 'react';
import { PageTitle } from '@/components/ui/PageTitle';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Plus, 
  Search,
  Calendar,
  Edit,
  Trash2
} from 'lucide-react';

interface MaintenanceRange {
  id: string;
  name: string;
  description: string;
  frequency: string;
  duration: string;
  active: boolean;
}

const maintenanceRanges: MaintenanceRange[] = [
  {
    id: '1',
    name: 'Check Quotidienne Oléoserveur',
    description: 'Vérification quotidienne des niveaux et de l\'état général',
    frequency: 'Quotidienne',
    duration: '30 min',
    active: true
  },
  {
    id: '2',
    name: 'Test Maintenance',
    description: 'Tests périodiques de maintenance préventive',
    frequency: 'Hebdomadaire',
    duration: '1h',
    active: true
  },
  {
    id: '3',
    name: 'Maintenance Trimestrielle',
    description: 'Maintenance complète tous les 3 mois',
    frequency: 'Trimestrielle',
    duration: '4h',
    active: true
  },
];

const MaintenanceRanges: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRanges, setSelectedRanges] = useState<string[]>([]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRanges(maintenanceRanges.map(r => r.id));
    } else {
      setSelectedRanges([]);
    }
  };

  const handleSelectRange = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedRanges([...selectedRanges, id]);
    } else {
      setSelectedRanges(selectedRanges.filter(r => r !== id));
    }
  };

  return (
    <div className="p-6 w-full bg-background">
      <PageTitle 
        title="Gammes de Maintenance" 
        subtitle="Gérer les gammes de maintenance préventive"
        action={
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle gamme
          </Button>
        }
      />
      
      {/* Barre de recherche */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher une gamme..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 w-full rounded-md border border-input bg-card pl-10 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Grille de cartes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {maintenanceRanges.map((range) => (
          <Card key={range.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <Checkbox 
                  checked={selectedRanges.includes(range.id)}
                  onCheckedChange={(checked) => handleSelectRange(range.id, checked as boolean)}
                />
                <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/10 border-0">
                  {range.active ? 'Actif' : 'Inactif'}
                </Badge>
              </div>

              <h3 className="text-lg font-semibold text-foreground mb-2">{range.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">{range.description}</p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Fréquence:</span>
                  <span className="text-foreground font-medium">{range.frequency}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Durée:</span>
                  <span className="text-foreground font-medium">{range.duration}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Edit className="h-4 w-4 mr-2" />
                  Modifier
                </Button>
                <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MaintenanceRanges;
