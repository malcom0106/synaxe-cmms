import { useState } from "react";
import { PageTitle } from "@/components/ui/PageTitle";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addDays, addWeeks, subWeeks, addMonths, subMonths, startOfMonth, endOfMonth, isSameMonth, isSameDay, isAfter, isBefore, startOfDay } from "date-fns";
import { fr } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, List, Filter, Settings } from "lucide-react";

type InterventionStatus = 'en_retard' | 'bientot_du' | 'cette_semaine' | 'planifie' | 'complete';

interface ScheduledIntervention {
  id: string;
  equipment: string;
  status: InterventionStatus;
  gamme: string;
  date: Date;
  note: string;
}

const mockInterventions: ScheduledIntervention[] = [
  {
    id: "1",
    equipment: "camion 456",
    status: "complete",
    gamme: "Test camion Renault",
    date: new Date(2025, 9, 29),
    note: "Généré depuis la gamme: Test camion Renault",
  },
  {
    id: "2",
    equipment: "camion 793",
    status: "planifie",
    gamme: "Test camion Renault",
    date: new Date(2025, 9, 29),
    note: "Généré depuis la gamme: Test camion Renault",
  },
  {
    id: "3",
    equipment: "camion 456",
    status: "planifie",
    gamme: "Test camion Renault",
    date: new Date(2025, 9, 30),
    note: "Généré depuis la gamme: Test camion Renault",
  },
  {
    id: "4",
    equipment: "camion 793",
    status: "planifie",
    gamme: "Test camion Renault",
    date: new Date(2025, 9, 30),
    note: "Généré depuis la gamme: Test camion Renault",
  },
  {
    id: "5",
    equipment: "Pompe P-001",
    status: "en_retard",
    gamme: "Maintenance pompe",
    date: addDays(new Date(), -5),
    note: "Généré depuis la gamme: Maintenance pompe",
  },
  {
    id: "6",
    equipment: "Compresseur C-002",
    status: "bientot_du",
    gamme: "Contrôle compresseur",
    date: addDays(new Date(), 2),
    note: "Généré depuis la gamme: Contrôle compresseur",
  },
  {
    id: "7",
    equipment: "Convoyeur CV-003",
    status: "cette_semaine",
    gamme: "Inspection convoyeur",
    date: addDays(new Date(), 4),
    note: "Généré depuis la gamme: Inspection convoyeur",
  },
];

const getStatusColor = (status: InterventionStatus) => {
  switch (status) {
    case 'en_retard':
      return 'bg-red-100 text-red-700 border-red-200';
    case 'bientot_du':
      return 'bg-orange-100 text-orange-700 border-orange-200';
    case 'cette_semaine':
      return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    case 'planifie':
      return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'complete':
      return 'bg-green-100 text-green-700 border-green-200';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

const getStatusLabel = (status: InterventionStatus) => {
  switch (status) {
    case 'en_retard':
      return 'En retard';
    case 'bientot_du':
      return 'Bientôt dû';
    case 'cette_semaine':
      return 'Cette semaine';
    case 'planifie':
      return 'Planifié';
    case 'complete':
      return 'Terminé';
    default:
      return status;
  }
};

const getLegendDotColor = (status: InterventionStatus) => {
  switch (status) {
    case 'en_retard':
      return 'bg-red-500';
    case 'bientot_du':
      return 'bg-orange-500';
    case 'cette_semaine':
      return 'bg-yellow-500';
    case 'planifie':
      return 'bg-blue-500';
    case 'complete':
      return 'bg-green-500';
    default:
      return 'bg-muted';
  }
};

const getInterventionsForDate = (date: Date) => {
  return mockInterventions.filter((intervention) =>
    isSameDay(intervention.date, date)
  );
};

const getInterventionsForMonth = (date: Date) => {
  return mockInterventions.filter((intervention) =>
    isSameMonth(intervention.date, date)
  );
};

// Stats calculation
const getStats = (interventions: ScheduledIntervention[]) => {
  return {
    total: interventions.length,
    complete: interventions.filter(i => i.status === 'complete').length,
    en_cours: interventions.filter(i => i.status === 'cette_semaine' || i.status === 'bientot_du').length,
    en_retard: interventions.filter(i => i.status === 'en_retard').length,
  };
};

// List View Component
const ListView = ({ currentDate }: { currentDate: Date }) => {
  const interventions = getInterventionsForMonth(currentDate);
  
  return (
    <div className="space-y-4">
      {interventions.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            Aucune intervention pour cette période
          </CardContent>
        </Card>
      ) : (
        interventions.map((intervention) => (
          <Card key={intervention.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground">{intervention.equipment}</span>
                    <Badge className={getStatusColor(intervention.status)}>
                      {getStatusLabel(intervention.status)}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Gamme: {intervention.gamme}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CalendarIcon className="h-4 w-4" />
                    {format(intervention.date, "dd/MM/yyyy", { locale: fr })}
                  </div>
                  <div className="text-sm text-muted-foreground italic">
                    "{intervention.note}"
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <Settings className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

// Monthly View Component
const MonthlyView = ({ currentDate, onDayClick }: { currentDate: Date; onDayClick: (date: Date) => void }) => {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  return (
    <Card>
      <CardContent className="p-4">
        <div className="grid grid-cols-7 gap-1">
          {["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"].map((day) => (
            <div key={day} className="text-center font-medium text-muted-foreground py-2 text-sm">
              {day}
            </div>
          ))}
          {days.map((day) => {
            const interventions = getInterventionsForDate(day);
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isToday = isSameDay(day, new Date());

            return (
              <div
                key={day.toISOString()}
                onClick={() => onDayClick(day)}
                className={`min-h-24 p-2 border rounded-md cursor-pointer hover:bg-accent/50 transition-colors ${
                  !isCurrentMonth ? "bg-muted/30 text-muted-foreground" : "bg-card"
                } ${isToday ? "ring-2 ring-primary" : ""}`}
              >
                <div className="font-medium text-sm mb-1">{format(day, "d")}</div>
                <div className="space-y-1">
                  {interventions.slice(0, 2).map((intervention) => (
                    <div
                      key={intervention.id}
                      className={`text-xs p-1 rounded truncate ${getStatusColor(intervention.status)}`}
                    >
                      {intervention.equipment}
                    </div>
                  ))}
                  {interventions.length > 2 && (
                    <div className="text-xs text-muted-foreground">
                      +{interventions.length - 2} autres
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

// Weekly View Component
const WeeklyView = ({ currentDate }: { currentDate: Date }) => {
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const days = eachDayOfInterval({
    start: weekStart,
    end: addDays(weekStart, 6),
  });
  const hours = Array.from({ length: 12 }, (_, i) => i + 7);

  return (
    <Card>
      <CardContent className="p-4 overflow-x-auto">
        <div className="min-w-[800px]">
          <div className="grid grid-cols-8 gap-1">
            <div className="text-center font-medium text-muted-foreground py-2"></div>
            {days.map((day) => (
              <div
                key={day.toISOString()}
                className={`text-center font-medium py-2 ${
                  isSameDay(day, new Date()) ? "text-primary" : "text-foreground"
                }`}
              >
                <div className="text-sm capitalize">{format(day, "EEE", { locale: fr })}</div>
                <div className={`text-lg ${isSameDay(day, new Date()) ? "bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center mx-auto" : ""}`}>
                  {format(day, "d")}
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-8 gap-1">
            {hours.map((hour) => (
              <div key={`row-${hour}`} className="contents">
                <div className="text-right pr-2 text-sm text-muted-foreground py-4 border-t">
                  {hour}:00
                </div>
                {days.map((day) => {
                  const interventions = getInterventionsForDate(day);
                  return (
                    <div key={`${day.toISOString()}-${hour}`} className="border-t min-h-16 relative p-1">
                      {hour === 8 && interventions.map((intervention) => (
                        <div
                          key={intervention.id}
                          className={`p-1 rounded text-xs mb-1 ${getStatusColor(intervention.status)}`}
                        >
                          <div className="font-medium truncate">{intervention.equipment}</div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Daily View Component
const DailyView = ({ currentDate }: { currentDate: Date }) => {
  const interventions = getInterventionsForDate(currentDate);

  return (
    <Card>
      <CardContent className="p-4">
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold capitalize">
            {format(currentDate, "EEEE d MMMM yyyy", { locale: fr })}
          </h3>
        </div>
        {interventions.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            Aucune intervention pour ce jour
          </div>
        ) : (
          <div className="space-y-4">
            {interventions.map((intervention) => (
              <Card key={intervention.id} className="border">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground">{intervention.equipment}</span>
                        <Badge className={getStatusColor(intervention.status)}>
                          {getStatusLabel(intervention.status)}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Gamme: {intervention.gamme}
                      </div>
                      <div className="text-sm text-muted-foreground italic">
                        "{intervention.note}"
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Settings className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeView, setActiveView] = useState<string>("list");

  const interventions = getInterventionsForMonth(currentDate);
  const stats = getStats(interventions);

  const navigatePrevious = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const navigateNext = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const handleDayClick = (date: Date) => {
    setCurrentDate(date);
    setActiveView("daily");
  };

  return (
    <div className="p-6 space-y-6">
      <PageTitle 
        title="Calendrier de Maintenance" 
        subtitle="Planifier et suivre les interventions de maintenance"
      />

      {/* Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={navigatePrevious}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={navigateNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <span className="font-semibold text-lg capitalize min-w-40">
            {format(currentDate, "MMMM yyyy", { locale: fr })}
          </span>
          <Button variant="outline" size="sm" onClick={goToToday}>
            Aujourd'hui
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Tabs value={activeView} onValueChange={setActiveView}>
            <TabsList>
              <TabsTrigger value="monthly" className="flex items-center gap-1">
                <CalendarIcon className="h-4 w-4" />
                Mois
              </TabsTrigger>
              <TabsTrigger value="weekly" className="flex items-center gap-1">
                <CalendarIcon className="h-4 w-4" />
                Semaine
              </TabsTrigger>
              <TabsTrigger value="daily" className="flex items-center gap-1">
                <CalendarIcon className="h-4 w-4" />
                Jour
              </TabsTrigger>
              <TabsTrigger value="list" className="flex items-center gap-1">
                <List className="h-4 w-4" />
                Liste
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filtres
          </Button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-sm">
        <span className="font-medium">Légende</span>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${getLegendDotColor('en_retard')}`}></div>
          <span>En retard</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${getLegendDotColor('bientot_du')}`}></div>
          <span>Bientôt dû</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${getLegendDotColor('cette_semaine')}`}></div>
          <span>Cette semaine</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${getLegendDotColor('planifie')}`}></div>
          <span>Planifié</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${getLegendDotColor('complete')}`}></div>
          <span>Complété</span>
        </div>
      </div>

      {/* Views */}
      {activeView === "list" && <ListView currentDate={currentDate} />}
      {activeView === "monthly" && <MonthlyView currentDate={currentDate} onDayClick={handleDayClick} />}
      {activeView === "weekly" && <WeeklyView currentDate={currentDate} />}
      {activeView === "daily" && <DailyView currentDate={currentDate} />}

      {/* Stats Footer */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-foreground">{stats.total}</div>
            <div className="text-sm text-muted-foreground">Interventions totales</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-foreground">{stats.complete}</div>
            <div className="text-sm text-muted-foreground">Complété</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-foreground">{stats.en_cours}</div>
            <div className="text-sm text-muted-foreground">En cours</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-500">{stats.en_retard}</div>
            <div className="text-sm text-muted-foreground">En retard</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CalendarPage;
