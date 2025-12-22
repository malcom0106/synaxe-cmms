import { useState } from "react";
import { PageTitle } from "@/components/ui/PageTitle";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface ScheduledIntervention {
  id: string;
  title: string;
  equipment: string;
  type: 'Préventive' | 'Corrective' | 'Contrôle';
  operator: string;
  date: Date;
}

const mockInterventions: ScheduledIntervention[] = [
  {
    id: "1",
    title: "Maintenance pompe hydraulique",
    equipment: "Pompe P-001",
    type: "Préventive",
    operator: "Jean Dupont",
    date: new Date(2024, 11, 20),
  },
  {
    id: "2",
    title: "Contrôle compresseur",
    equipment: "Compresseur C-002",
    type: "Contrôle",
    operator: "Marie Martin",
    date: new Date(2024, 11, 22),
  },
  {
    id: "3",
    title: "Réparation convoyeur",
    equipment: "Convoyeur CV-003",
    type: "Corrective",
    operator: "Pierre Durand",
    date: new Date(2024, 11, 22),
  },
  {
    id: "4",
    title: "Vidange moteur",
    equipment: "Moteur M-004",
    type: "Préventive",
    operator: "Jean Dupont",
    date: new Date(2024, 11, 27),
  },
];

const CalendarPage = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const getInterventionsForDate = (date: Date | undefined) => {
    if (!date) return [];
    return mockInterventions.filter(
      (intervention) =>
        format(intervention.date, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
    );
  };

  const interventionsForSelectedDate = getInterventionsForDate(selectedDate);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Corrective':
        return 'bg-red-500/10 text-red-600 border-red-200';
      case 'Préventive':
        return 'bg-green-500/10 text-green-600 border-green-200';
      case 'Contrôle':
        return 'bg-amber-500/10 text-amber-600 border-amber-200';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  // Get dates that have interventions for highlighting
  const datesWithInterventions = mockInterventions.map((i) => i.date);

  return (
    <div className="p-6 space-y-6">
      <PageTitle 
        title="Calendrier de maintenance" 
        subtitle="Visualisez les interventions planifiées"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Sélectionner une date</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              locale={fr}
              className="rounded-md border pointer-events-auto"
              modifiers={{
                hasIntervention: datesWithInterventions,
              }}
              modifiersStyles={{
                hasIntervention: {
                  fontWeight: "bold",
                  backgroundColor: "hsl(var(--primary) / 0.1)",
                  color: "hsl(var(--primary))",
                },
              }}
            />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">
              Interventions du {selectedDate ? format(selectedDate, "d MMMM yyyy", { locale: fr }) : "..."}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {interventionsForSelectedDate.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Aucune intervention planifiée pour cette date
              </p>
            ) : (
              <div className="space-y-4">
                {interventionsForSelectedDate.map((intervention) => (
                  <div
                    key={intervention.id}
                    className="p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h3 className="font-medium text-foreground">
                          {intervention.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {intervention.equipment}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Opérateur: {intervention.operator}
                        </p>
                      </div>
                      <Badge variant="outline" className={getTypeColor(intervention.type)}>
                        {intervention.type}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CalendarPage;
