import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  ChevronRight, 
  Clock, 
  Wrench,
  FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface MaintenanceRange {
  id: string;
  name: string;
  code: string;
  family: string;
  subFamily: string;
  frequency: string;
  estimatedTime: string;
  tasksCount: number;
  description: string;
}

const maintenanceRanges: MaintenanceRange[] = [
  {
    id: 'GM001',
    name: 'Maintenance préventive mensuelle',
    code: 'MP-OLEO-M',
    family: 'Oléoserveur',
    subFamily: 'Pompe',
    frequency: 'Mensuel',
    estimatedTime: '2h',
    tasksCount: 12,
    description: 'Vérification complète du système oléohydraulique'
  },
  {
    id: 'GM002',
    name: 'Contrôle visuel hebdomadaire',
    code: 'CV-POMP-H',
    family: 'Pompe',
    subFamily: 'Principale',
    frequency: 'Hebdomadaire',
    estimatedTime: '30min',
    tasksCount: 5,
    description: 'Inspection visuelle et contrôle sonore'
  },
  {
    id: 'GM003',
    name: 'Calibration compteurs',
    code: 'CAL-COMP-T',
    family: 'Compteur',
    subFamily: 'Débit',
    frequency: 'Trimestriel',
    estimatedTime: '1h30',
    tasksCount: 8,
    description: 'Calibration et vérification de la précision des compteurs'
  },
  {
    id: 'GM004',
    name: 'Inspection réglementaire',
    code: 'IR-VANNE-A',
    family: 'Vanne',
    subFamily: 'Sécurité',
    frequency: 'Annuel',
    estimatedTime: '4h',
    tasksCount: 20,
    description: 'Inspection complète selon les normes réglementaires'
  },
  {
    id: 'GM005',
    name: 'Remplacement filtres',
    code: 'RF-FILT-M',
    family: 'Filtre',
    subFamily: 'Huile',
    frequency: 'Mensuel',
    estimatedTime: '45min',
    tasksCount: 6,
    description: 'Remplacement et nettoyage des filtres'
  },
];

const TabletMaintenanceRanges: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRanges = maintenanceRanges.filter(range =>
    range.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    range.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    range.family.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 pb-8 space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Gammes de maintenance</h1>
        <p className="text-muted-foreground mt-1">Consultez les procédures de maintenance</p>
      </div>

      {/* Recherche */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Rechercher une gamme..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-12 h-14 text-base"
        />
      </div>

      {/* Liste des gammes */}
      <div className="space-y-3">
        {filteredRanges.map((range) => (
          <Card 
            key={range.id}
            className="p-4 cursor-pointer transition-all active:scale-[0.98] hover:shadow-md"
            onClick={() => navigate(`/tablet/ranges/${range.id}`)}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-xs">
                    {range.code}
                  </Badge>
                  <Badge className="bg-primary/10 text-primary text-xs">
                    {range.frequency}
                  </Badge>
                </div>
                
                <h3 className="font-semibold text-foreground text-lg">
                  {range.name}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">{range.description}</p>
                
                <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Wrench className="h-4 w-4" />
                    {range.family} / {range.subFamily}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {range.estimatedTime}
                  </div>
                  <div className="flex items-center gap-1">
                    <FileText className="h-4 w-4" />
                    {range.tasksCount} tâches
                  </div>
                </div>
              </div>
              
              <ChevronRight className="h-6 w-6 text-muted-foreground flex-shrink-0 mt-2" />
            </div>
          </Card>
        ))}

        {filteredRanges.length === 0 && (
          <Card className="p-8 text-center">
            <Search className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">Aucune gamme trouvée</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TabletMaintenanceRanges;
