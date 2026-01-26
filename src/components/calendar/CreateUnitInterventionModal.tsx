import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  AlertTriangle, 
  AlertCircle, 
  Calendar as CalendarIcon, 
  Wrench,
  Lock,
  Truck,
  Gauge,
  Clock,
  Droplets,
  Info
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { ThresholdNotification, ReferentialType } from './ThresholdNotifications';

interface CreateUnitInterventionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  notification: ThresholdNotification | null;
  onCreateIntervention: (data: {
    notificationId: string;
    date: Date;
    operatorId?: string;
  }) => void;
}

// Mock operators
const mockOperators = [
  { id: '1', name: 'Jean Martin' },
  { id: '2', name: 'Sophie Bernard' },
  { id: '3', name: 'Pierre Lefebvre' },
  { id: '4', name: 'Marie Dubois' },
];

// Mock validation (simule vérification gamme active et équipement non décommissionné)
const validateIntervention = (notification: ThresholdNotification): { valid: boolean; error?: string } => {
  // Simulation - en réalité, ces vérifications seraient faites côté serveur
  const gammeActive = true; // Simuler gamme active
  const equipmentActive = true; // Simuler équipement non décommissionné

  if (!gammeActive) {
    return { valid: false, error: 'La gamme de maintenance n\'est plus active.' };
  }
  if (!equipmentActive) {
    return { valid: false, error: 'L\'équipement a été décommissionné.' };
  }
  return { valid: true };
};

const getReferentialIcon = (type: ReferentialType) => {
  switch (type) {
    case 'kilometres':
      return <Gauge className="h-4 w-4" />;
    case 'temps':
      return <Clock className="h-4 w-4" />;
    case 'litrage':
      return <Droplets className="h-4 w-4" />;
  }
};

const getReferentialLabel = (type: ReferentialType) => {
  switch (type) {
    case 'kilometres':
      return 'Kilomètres';
    case 'temps':
      return 'Temps moteur';
    case 'litrage':
      return 'Litrage';
  }
};

export const CreateUnitInterventionModal: React.FC<CreateUnitInterventionModalProps> = ({
  open,
  onOpenChange,
  notification,
  onCreateIntervention,
}) => {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedOperator, setSelectedOperator] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!notification) return null;

  const validation = validateIntervention(notification);
  const isMaxiAlert = notification.thresholdLevel === 'maxi';

  const handleSubmit = async () => {
    if (!selectedDate) {
      toast({
        title: 'Erreur',
        description: 'Veuillez sélectionner une date d\'intervention',
        variant: 'destructive',
      });
      return;
    }

    if (!validation.valid) {
      toast({
        title: 'Impossible de créer l\'intervention',
        description: validation.error,
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    // Simuler un délai de création
    await new Promise(resolve => setTimeout(resolve, 500));

    onCreateIntervention({
      notificationId: notification.id,
      date: selectedDate,
      operatorId: selectedOperator || undefined,
    });

    toast({
      title: 'Intervention créée',
      description: `L'intervention unitaire a été planifiée pour le ${format(selectedDate, "dd/MM/yyyy", { locale: fr })}`,
    });

    setIsSubmitting(false);
    setSelectedDate(new Date());
    setSelectedOperator('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5 text-primary" />
            Créer une intervention unitaire
          </DialogTitle>
        </DialogHeader>

        {/* Bannière d'alerte */}
        <div className={`p-3 rounded-lg flex items-start gap-3 ${
          isMaxiAlert ? 'bg-red-50 border border-red-200' : 'bg-orange-50 border border-orange-200'
        }`}>
          <div className={`p-1.5 rounded-full ${
            isMaxiAlert ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'
          }`}>
            {isMaxiAlert ? <AlertTriangle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          </div>
          <div className="flex-1">
            <p className={`text-sm font-medium ${isMaxiAlert ? 'text-red-800' : 'text-orange-800'}`}>
              Alerte seuil {isMaxiAlert ? 'maximum' : 'minimum'} atteint
            </p>
            <div className="flex items-center gap-2 mt-1 text-xs">
              <span className={isMaxiAlert ? 'text-red-600' : 'text-orange-600'}>
                {getReferentialIcon(notification.referentialType)}
              </span>
              <span className={isMaxiAlert ? 'text-red-700' : 'text-orange-700'}>
                {getReferentialLabel(notification.referentialType)}: {notification.currentValue.toLocaleString('fr-FR')} {notification.unit}
              </span>
              <span className="text-muted-foreground">
                (seuil: {notification.thresholdValue.toLocaleString('fr-FR')} {notification.unit})
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-4 py-2">
          {/* Équipement (verrouillé) */}
          <div className="space-y-2">
            <Label className="flex items-center gap-1">
              <Lock className="h-3 w-3 text-muted-foreground" />
              Équipement
            </Label>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 border border-border">
              <Truck className="h-4 w-4 text-muted-foreground" />
              <div>
                <span className="font-medium text-foreground">{notification.equipmentName}</span>
                <span className="text-muted-foreground ml-2 text-sm">({notification.equipmentCode})</span>
              </div>
            </div>
          </div>

          {/* Gamme (verrouillée) */}
          <div className="space-y-2">
            <Label className="flex items-center gap-1">
              <Lock className="h-3 w-3 text-muted-foreground" />
              Gamme de maintenance
            </Label>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 border border-border">
              <Wrench className="h-4 w-4 text-muted-foreground" />
              <div>
                <span className="font-medium text-foreground">{notification.gammeName}</span>
                <span className="text-muted-foreground ml-2 text-sm">({notification.gammeCode})</span>
              </div>
            </div>
          </div>

          {/* Date d'intervention (obligatoire) */}
          <div className="space-y-2">
            <Label>
              Date de l'intervention <span className="text-red-500">*</span>
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? (
                    format(selectedDate, "EEEE d MMMM yyyy", { locale: fr })
                  ) : (
                    <span>Sélectionner une date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  initialFocus
                  locale={fr}
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Opérateur (facultatif) */}
          <div className="space-y-2">
            <Label>Opérateur (facultatif)</Label>
            <Select value={selectedOperator} onValueChange={setSelectedOperator}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un opérateur" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Non attribué</SelectItem>
                {mockOperators.map((operator) => (
                  <SelectItem key={operator.id} value={operator.id}>
                    {operator.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Message d'information */}
          <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <Info className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-blue-800">
              La création de cette intervention unitaire acquittera automatiquement cette notification 
              et mettra à jour la date de référence pour le recalcul des prochains seuils.
            </p>
          </div>

          {/* Message d'erreur de validation */}
          {!validation.valid && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-red-800">{validation.error}</p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!validation.valid || isSubmitting || !selectedDate}
            className={isMaxiAlert ? 'bg-red-600 hover:bg-red-700' : ''}
          >
            {isSubmitting ? 'Création...' : 'Créer l\'intervention'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};