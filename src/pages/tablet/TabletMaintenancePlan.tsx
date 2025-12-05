import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight as ChevronRightIcon, 
  Clock, 
  User,
  Play
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface PlannedIntervention {
  id: string;
  date: string;
  time: string;
  equipment: string;
  gamme: string;
  assignedTo: string;
  status: 'planned' | 'completed' | 'late';
}

const plannedInterventions: PlannedIntervention[] = [
  { id: 'P001', date: '2025-12-04', time: '08:00', equipment: 'Oléoserveur 201', gamme: 'Maintenance préventive', assignedTo: 'Jean Martin', status: 'completed' },
  { id: 'P002', date: '2025-12-04', time: '14:00', equipment: 'Compteur Zone 1', gamme: 'Calibration', assignedTo: 'Jean Martin', status: 'planned' },
  { id: 'P003', date: '2025-12-05', time: '09:00', equipment: 'Pompe principale', gamme: 'Contrôle visuel', assignedTo: 'Sophie Bernard', status: 'planned' },
  { id: 'P004', date: '2025-12-05', time: '11:00', equipment: 'Vanne sécurité A', gamme: 'Inspection', assignedTo: 'Jean Martin', status: 'planned' },
  { id: 'P005', date: '2025-12-06', time: '08:30', equipment: 'Filtre Station B', gamme: 'Remplacement', assignedTo: 'Pierre Lefebvre', status: 'planned' },
  { id: 'P006', date: '2025-12-06', time: '10:00', equipment: 'Oléoserveur 202', gamme: 'Maintenance préventive', assignedTo: 'Jean Martin', status: 'planned' },
  { id: 'P007', date: '2025-12-09', time: '08:00', equipment: 'Compteur Zone 2', gamme: 'Calibration', assignedTo: 'Marie Dubois', status: 'planned' },
  { id: 'P008', date: '2025-12-10', time: '14:00', equipment: 'Pompe secondaire', gamme: 'Contrôle visuel', assignedTo: 'Jean Martin', status: 'planned' },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'completed':
      return <Badge className="bg-green-100 text-green-800">Terminé</Badge>;
    case 'late':
      return <Badge className="bg-red-100 text-red-800">En retard</Badge>;
    default:
      return <Badge className="bg-blue-100 text-blue-800">Planifié</Badge>;
  }
};

const TabletMaintenancePlan: React.FC = () => {
  const navigate = useNavigate();
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(today.setDate(diff));
  });

  const getWeekDays = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(currentWeekStart);
      day.setDate(currentWeekStart.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const weekDays = getWeekDays();

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(currentWeekStart.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeekStart(newDate);
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const getInterventionsForDate = (date: Date) => {
    const dateStr = formatDate(date);
    return plannedInterventions.filter(i => i.date === dateStr);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const weekRange = `${weekDays[0].toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })} - ${weekDays[6].toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}`;

  return (
    <div className="p-4 pb-8 space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Plan de maintenance</h1>
        <p className="text-muted-foreground mt-1">Planning des interventions à venir</p>
      </div>

      {/* Navigation semaine */}
      <Card className="p-3">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            className="h-12 w-12"
            onClick={() => navigateWeek('prev')}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          
          <div className="text-center">
            <div className="flex items-center gap-2 justify-center">
              <Calendar className="h-5 w-5 text-primary" />
              <span className="font-semibold text-lg">{weekRange}</span>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            className="h-12 w-12"
            onClick={() => navigateWeek('next')}
          >
            <ChevronRightIcon className="h-6 w-6" />
          </Button>
        </div>
      </Card>

      {/* Vue par jour */}
      <div className="space-y-4">
        {weekDays.map((day) => {
          const interventions = getInterventionsForDate(day);
          const dayName = day.toLocaleDateString('fr-FR', { weekday: 'long' });
          const dayDate = day.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });
          
          return (
            <div key={day.toISOString()}>
              <div className={cn(
                "flex items-center gap-2 mb-2 px-2",
                isToday(day) && "text-primary"
              )}>
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg",
                  isToday(day) ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                )}>
                  {day.getDate()}
                </div>
                <div>
                  <div className="font-semibold capitalize">{dayName}</div>
                  <div className="text-sm text-muted-foreground">{dayDate}</div>
                </div>
                {interventions.length > 0 && (
                  <Badge variant="outline" className="ml-auto">
                    {interventions.length} intervention{interventions.length > 1 ? 's' : ''}
                  </Badge>
                )}
              </div>
              
              {interventions.length > 0 ? (
                <div className="space-y-2 ml-12">
                  {interventions.map((intervention) => (
                    <Card key={intervention.id} className="p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{intervention.time}</span>
                            {getStatusBadge(intervention.status)}
                          </div>
                          <h4 className="font-medium text-foreground truncate">{intervention.equipment}</h4>
                          <p className="text-sm text-muted-foreground">{intervention.gamme}</p>
                          <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                            <User className="h-3 w-3" />
                            {intervention.assignedTo}
                          </div>
                        </div>
                        {intervention.status !== 'completed' && (
                          <Button
                            size="sm"
                            className="shrink-0"
                            onClick={() => navigate(`/tablet/intervention/${intervention.id}`)}
                          >
                            <Play className="h-4 w-4 mr-1" />
                            Réaliser
                          </Button>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="ml-12 py-3 px-4 bg-muted/30 rounded-lg text-sm text-muted-foreground">
                  Aucune intervention prévue
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TabletMaintenancePlan;
