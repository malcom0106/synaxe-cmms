import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, 
  Clock, 
  User, 
  Users, 
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  PlayCircle,
  Wrench
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Intervention {
  id: string;
  equipment: string;
  equipmentCode: string;
  gamme: string;
  assignedTo: string;
  plannedTime: string;
  status: 'planned' | 'in-progress' | 'completed' | 'late';
  priority: 'low' | 'medium' | 'high';
}

// Données de démonstration
const todayInterventions: Intervention[] = [
  {
    id: 'INT001',
    equipment: 'Oléoserveur 201',
    equipmentCode: 'EQ001',
    gamme: 'Maintenance préventive mensuelle',
    assignedTo: 'Jean Martin',
    plannedTime: '08:00',
    status: 'completed',
    priority: 'medium'
  },
  {
    id: 'INT002',
    equipment: 'Pompe principale Zone A',
    equipmentCode: 'EQ015',
    gamme: 'Contrôle visuel',
    assignedTo: 'Jean Martin',
    plannedTime: '10:30',
    status: 'in-progress',
    priority: 'high'
  },
  {
    id: 'INT003',
    equipment: 'Compteur Zone 1',
    equipmentCode: 'EQ008',
    gamme: 'Calibration',
    assignedTo: 'Jean Martin',
    plannedTime: '14:00',
    status: 'planned',
    priority: 'medium'
  },
  {
    id: 'INT004',
    equipment: 'Filtre Station B',
    equipmentCode: 'EQ022',
    gamme: 'Remplacement filtre',
    assignedTo: 'Sophie Bernard',
    plannedTime: '09:00',
    status: 'completed',
    priority: 'low'
  },
  {
    id: 'INT005',
    equipment: 'Vanne de sécurité',
    equipmentCode: 'EQ033',
    gamme: 'Inspection réglementaire',
    assignedTo: 'Pierre Lefebvre',
    plannedTime: '11:00',
    status: 'late',
    priority: 'high'
  },
  {
    id: 'INT006',
    equipment: 'Oléoserveur 202',
    equipmentCode: 'EQ002',
    gamme: 'Maintenance préventive mensuelle',
    assignedTo: 'Marie Dubois',
    plannedTime: '15:30',
    status: 'planned',
    priority: 'medium'
  },
];

const currentUser = 'Jean Martin';

const getStatusConfig = (status: string) => {
  switch (status) {
    case 'completed':
      return { 
        label: 'Terminé', 
        icon: CheckCircle2, 
        className: 'bg-green-100 text-green-800 border-green-200' 
      };
    case 'in-progress':
      return { 
        label: 'En cours', 
        icon: PlayCircle, 
        className: 'bg-blue-100 text-blue-800 border-blue-200' 
      };
    case 'late':
      return { 
        label: 'En retard', 
        icon: AlertCircle, 
        className: 'bg-red-100 text-red-800 border-red-200' 
      };
    default:
      return { 
        label: 'Planifié', 
        icon: Clock, 
        className: 'bg-gray-100 text-gray-800 border-gray-200' 
      };
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'border-l-red-500';
    case 'medium':
      return 'border-l-orange-500';
    default:
      return 'border-l-green-500';
  }
};

const InterventionCard: React.FC<{ intervention: Intervention; onClick: () => void }> = ({ 
  intervention, 
  onClick 
}) => {
  const statusConfig = getStatusConfig(intervention.status);
  const StatusIcon = statusConfig.icon;

  return (
    <Card 
      className={cn(
        "p-4 border-l-4 cursor-pointer transition-all active:scale-[0.98] hover:shadow-md",
        getPriorityColor(intervention.priority)
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <Badge className={cn("text-xs px-2 py-0.5 border", statusConfig.className)}>
              <StatusIcon className="h-3 w-3 mr-1" />
              {statusConfig.label}
            </Badge>
            <span className="text-sm text-muted-foreground font-mono">{intervention.id}</span>
          </div>
          
          <h3 className="font-semibold text-foreground text-lg truncate">
            {intervention.equipment}
          </h3>
          <p className="text-sm text-muted-foreground truncate">{intervention.gamme}</p>
          
          <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {intervention.plannedTime}
            </div>
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              {intervention.assignedTo}
            </div>
          </div>
        </div>
        
        <ChevronRight className="h-6 w-6 text-muted-foreground flex-shrink-0 mt-2" />
      </div>
    </Card>
  );
};

const TabletDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('me');
  
  const today = new Date().toLocaleDateString('fr-FR', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });

  const myInterventions = todayInterventions.filter(i => i.assignedTo === currentUser);
  const teamInterventions = todayInterventions;

  const getStats = (interventions: Intervention[]) => ({
    total: interventions.length,
    completed: interventions.filter(i => i.status === 'completed').length,
    inProgress: interventions.filter(i => i.status === 'in-progress').length,
    late: interventions.filter(i => i.status === 'late').length,
  });

  const myStats = getStats(myInterventions);
  const teamStats = getStats(teamInterventions);

  return (
    <div className="p-4 pb-8 space-y-4">
      {/* En-tête avec date */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Interventions du jour</h1>
          <p className="text-muted-foreground capitalize flex items-center gap-2 mt-1">
            <Calendar className="h-4 w-4" />
            {today}
          </p>
        </div>
      </div>

      {/* Onglets Moi / Équipe */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 h-14 p-1 bg-muted/50">
          <TabsTrigger 
            value="me" 
            className="h-12 text-base font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <User className="h-5 w-5 mr-2" />
            Mes interventions ({myInterventions.length})
          </TabsTrigger>
          <TabsTrigger 
            value="team"
            className="h-12 text-base font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Users className="h-5 w-5 mr-2" />
            Équipe ({teamInterventions.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="me" className="mt-4 space-y-4">
          {/* Stats rapides */}
          <div className="grid grid-cols-4 gap-3">
            <Card className="p-3 text-center bg-muted/30">
              <div className="text-2xl font-bold text-foreground">{myStats.total}</div>
              <div className="text-xs text-muted-foreground">Total</div>
            </Card>
            <Card className="p-3 text-center bg-green-50 border-green-200">
              <div className="text-2xl font-bold text-green-700">{myStats.completed}</div>
              <div className="text-xs text-green-600">Terminé</div>
            </Card>
            <Card className="p-3 text-center bg-blue-50 border-blue-200">
              <div className="text-2xl font-bold text-blue-700">{myStats.inProgress}</div>
              <div className="text-xs text-blue-600">En cours</div>
            </Card>
            <Card className="p-3 text-center bg-red-50 border-red-200">
              <div className="text-2xl font-bold text-red-700">{myStats.late}</div>
              <div className="text-xs text-red-600">En retard</div>
            </Card>
          </div>

          {/* Liste des interventions */}
          <div className="space-y-3">
            {myInterventions.length === 0 ? (
              <Card className="p-8 text-center">
                <Wrench className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">Aucune intervention prévue aujourd'hui</p>
              </Card>
            ) : (
              myInterventions.map((intervention) => (
                <InterventionCard
                  key={intervention.id}
                  intervention={intervention}
                  onClick={() => navigate(`/tablet/intervention/${intervention.id}`)}
                />
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="team" className="mt-4 space-y-4">
          {/* Stats rapides équipe */}
          <div className="grid grid-cols-4 gap-3">
            <Card className="p-3 text-center bg-muted/30">
              <div className="text-2xl font-bold text-foreground">{teamStats.total}</div>
              <div className="text-xs text-muted-foreground">Total</div>
            </Card>
            <Card className="p-3 text-center bg-green-50 border-green-200">
              <div className="text-2xl font-bold text-green-700">{teamStats.completed}</div>
              <div className="text-xs text-green-600">Terminé</div>
            </Card>
            <Card className="p-3 text-center bg-blue-50 border-blue-200">
              <div className="text-2xl font-bold text-blue-700">{teamStats.inProgress}</div>
              <div className="text-xs text-blue-600">En cours</div>
            </Card>
            <Card className="p-3 text-center bg-red-50 border-red-200">
              <div className="text-2xl font-bold text-red-700">{teamStats.late}</div>
              <div className="text-xs text-red-600">En retard</div>
            </Card>
          </div>

          {/* Liste des interventions équipe */}
          <div className="space-y-3">
            {teamInterventions.map((intervention) => (
              <InterventionCard
                key={intervention.id}
                intervention={intervention}
                onClick={() => navigate(`/tablet/intervention/${intervention.id}`)}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TabletDashboard;
