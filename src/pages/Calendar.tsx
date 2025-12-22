import { useState } from "react";
import { PageTitle } from "@/components/ui/PageTitle";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addDays, addWeeks, subWeeks, addMonths, subMonths, startOfMonth, endOfMonth, isSameMonth, isSameDay, addYears, subYears } from "date-fns";
import { fr } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";

interface ScheduledIntervention {
  id: string;
  title: string;
  equipment: string;
  type: 'Préventive' | 'Corrective' | 'Contrôle';
  operator: string;
  date: Date;
  startTime: string;
  endTime: string;
}

const mockInterventions: ScheduledIntervention[] = [
  {
    id: "1",
    title: "Maintenance pompe hydraulique",
    equipment: "Pompe P-001",
    type: "Préventive",
    operator: "Jean Dupont",
    date: new Date(),
    startTime: "08:00",
    endTime: "10:00",
  },
  {
    id: "2",
    title: "Contrôle compresseur",
    equipment: "Compresseur C-002",
    type: "Contrôle",
    operator: "Marie Martin",
    date: new Date(),
    startTime: "14:00",
    endTime: "15:30",
  },
  {
    id: "3",
    title: "Réparation convoyeur",
    equipment: "Convoyeur CV-003",
    type: "Corrective",
    operator: "Pierre Durand",
    date: addDays(new Date(), 2),
    startTime: "09:00",
    endTime: "12:00",
  },
  {
    id: "4",
    title: "Vidange moteur",
    equipment: "Moteur M-004",
    type: "Préventive",
    operator: "Jean Dupont",
    date: addDays(new Date(), 5),
    startTime: "10:00",
    endTime: "11:00",
  },
  {
    id: "5",
    title: "Inspection générale",
    equipment: "Ligne de production L-001",
    type: "Contrôle",
    operator: "Sophie Bernard",
    date: addDays(new Date(), -3),
    startTime: "08:00",
    endTime: "17:00",
  },
];

const getTypeColor = (type: string) => {
  switch (type) {
    case 'Corrective':
      return 'bg-red-500 text-white';
    case 'Préventive':
      return 'bg-green-500 text-white';
    case 'Contrôle':
      return 'bg-amber-500 text-white';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

const getTypeBorderColor = (type: string) => {
  switch (type) {
    case 'Corrective':
      return 'border-l-red-500';
    case 'Préventive':
      return 'border-l-green-500';
    case 'Contrôle':
      return 'border-l-amber-500';
    default:
      return 'border-l-muted';
  }
};

const getInterventionsForDate = (date: Date) => {
  return mockInterventions.filter((intervention) =>
    isSameDay(intervention.date, date)
  );
};

// Annual View Component
const AnnualView = ({ currentDate, onMonthClick }: { currentDate: Date; onMonthClick: (month: number) => void }) => {
  const months = Array.from({ length: 12 }, (_, i) => i);

  return (
    <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
      {months.map((month) => {
        const monthDate = new Date(currentDate.getFullYear(), month, 1);
        const daysInMonth = eachDayOfInterval({
          start: startOfMonth(monthDate),
          end: endOfMonth(monthDate),
        });
        const interventionsInMonth = mockInterventions.filter(
          (i) => i.date.getMonth() === month && i.date.getFullYear() === currentDate.getFullYear()
        );

        return (
          <Card
            key={month}
            className="cursor-pointer hover:bg-accent/50 transition-colors"
            onClick={() => onMonthClick(month)}
          >
            <CardContent className="p-4">
              <h3 className="font-semibold text-foreground mb-2 capitalize">
                {format(monthDate, "MMMM", { locale: fr })}
              </h3>
              <div className="grid grid-cols-7 gap-0.5 text-xs">
                {["L", "M", "M", "J", "V", "S", "D"].map((day, i) => (
                  <div key={i} className="text-center text-muted-foreground font-medium">
                    {day}
                  </div>
                ))}
                {Array.from({ length: (daysInMonth[0].getDay() + 6) % 7 }).map((_, i) => (
                  <div key={`empty-${i}`} />
                ))}
                {daysInMonth.map((day) => {
                  const hasIntervention = interventionsInMonth.some((i) =>
                    isSameDay(i.date, day)
                  );
                  return (
                    <div
                      key={day.toISOString()}
                      className={`text-center p-0.5 rounded-sm ${
                        hasIntervention ? "bg-primary text-primary-foreground" : ""
                      } ${isSameDay(day, new Date()) ? "ring-1 ring-primary" : ""}`}
                    >
                      {format(day, "d")}
                    </div>
                  );
                })}
              </div>
              {interventionsInMonth.length > 0 && (
                <p className="text-xs text-muted-foreground mt-2">
                  {interventionsInMonth.length} intervention(s)
                </p>
              )}
            </CardContent>
          </Card>
        );
      })}
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
                      className={`text-xs p-1 rounded truncate ${getTypeColor(intervention.type)}`}
                    >
                      {intervention.title}
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
  const hours = Array.from({ length: 12 }, (_, i) => i + 7); // 7h to 18h

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
              <>
                <div key={`hour-${hour}`} className="text-right pr-2 text-sm text-muted-foreground py-4 border-t">
                  {hour}:00
                </div>
                {days.map((day) => {
                  const interventions = getInterventionsForDate(day).filter((i) => {
                    const startHour = parseInt(i.startTime.split(":")[0]);
                    return startHour === hour;
                  });

                  return (
                    <div key={`${day.toISOString()}-${hour}`} className="border-t min-h-16 relative">
                      {interventions.map((intervention) => (
                        <div
                          key={intervention.id}
                          className={`absolute left-0 right-0 mx-0.5 p-1 rounded text-xs border-l-4 bg-card shadow-sm ${getTypeBorderColor(intervention.type)}`}
                        >
                          <div className="font-medium truncate">{intervention.title}</div>
                          <div className="text-muted-foreground">
                            {intervention.startTime} - {intervention.endTime}
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </>
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
  const hours = Array.from({ length: 12 }, (_, i) => i + 7); // 7h to 18h

  return (
    <Card>
      <CardContent className="p-4">
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold capitalize">
            {format(currentDate, "EEEE d MMMM yyyy", { locale: fr })}
          </h3>
        </div>
        <div className="grid grid-cols-1 gap-0">
          {hours.map((hour) => {
            const hourInterventions = interventions.filter((i) => {
              const startHour = parseInt(i.startTime.split(":")[0]);
              return startHour === hour;
            });

            return (
              <div key={hour} className="flex border-t min-h-20">
                <div className="w-20 text-right pr-4 py-2 text-sm text-muted-foreground">
                  {hour}:00
                </div>
                <div className="flex-1 relative py-1">
                  {hourInterventions.map((intervention) => (
                    <div
                      key={intervention.id}
                      className={`p-3 rounded-md border-l-4 bg-accent/30 mb-1 ${getTypeBorderColor(intervention.type)}`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-medium text-foreground">{intervention.title}</div>
                          <div className="text-sm text-muted-foreground">{intervention.equipment}</div>
                          <div className="text-sm text-muted-foreground">
                            {intervention.startTime} - {intervention.endTime} • {intervention.operator}
                          </div>
                        </div>
                        <Badge className={getTypeColor(intervention.type)}>
                          {intervention.type}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeView, setActiveView] = useState<string>("monthly");

  const navigatePrevious = () => {
    switch (activeView) {
      case "annual":
        setCurrentDate(subYears(currentDate, 1));
        break;
      case "monthly":
        setCurrentDate(subMonths(currentDate, 1));
        break;
      case "weekly":
        setCurrentDate(subWeeks(currentDate, 1));
        break;
      case "daily":
        setCurrentDate(addDays(currentDate, -1));
        break;
    }
  };

  const navigateNext = () => {
    switch (activeView) {
      case "annual":
        setCurrentDate(addYears(currentDate, 1));
        break;
      case "monthly":
        setCurrentDate(addMonths(currentDate, 1));
        break;
      case "weekly":
        setCurrentDate(addWeeks(currentDate, 1));
        break;
      case "daily":
        setCurrentDate(addDays(currentDate, 1));
        break;
    }
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const handleMonthClick = (month: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), month, 1));
    setActiveView("monthly");
  };

  const handleDayClick = (date: Date) => {
    setCurrentDate(date);
    setActiveView("daily");
  };

  const getNavigationLabel = () => {
    switch (activeView) {
      case "annual":
        return format(currentDate, "yyyy");
      case "monthly":
        return format(currentDate, "MMMM yyyy", { locale: fr });
      case "weekly":
        const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
        const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
        return `${format(weekStart, "d MMM", { locale: fr })} - ${format(weekEnd, "d MMM yyyy", { locale: fr })}`;
      case "daily":
        return format(currentDate, "EEEE d MMMM yyyy", { locale: fr });
      default:
        return "";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <PageTitle 
        title="Calendrier de maintenance" 
        subtitle="Visualisez et gérez les interventions planifiées"
      />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Tabs value={activeView} onValueChange={setActiveView}>
          <TabsList>
            <TabsTrigger value="annual">Annuel</TabsTrigger>
            <TabsTrigger value="monthly">Mensuel</TabsTrigger>
            <TabsTrigger value="weekly">Semaine</TabsTrigger>
            <TabsTrigger value="daily">Jour</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={goToToday}>
            <CalendarIcon className="h-4 w-4 mr-2" />
            Aujourd'hui
          </Button>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" onClick={navigatePrevious}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="min-w-48 text-center font-medium capitalize">
              {getNavigationLabel()}
            </div>
            <Button variant="outline" size="icon" onClick={navigateNext}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-green-500"></div>
          <span>Préventive</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-red-500"></div>
          <span>Corrective</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-amber-500"></div>
          <span>Contrôle</span>
        </div>
      </div>

      {activeView === "annual" && (
        <AnnualView currentDate={currentDate} onMonthClick={handleMonthClick} />
      )}
      {activeView === "monthly" && (
        <MonthlyView currentDate={currentDate} onDayClick={handleDayClick} />
      )}
      {activeView === "weekly" && <WeeklyView currentDate={currentDate} />}
      {activeView === "daily" && <DailyView currentDate={currentDate} />}
    </div>
  );
};

export default CalendarPage;
