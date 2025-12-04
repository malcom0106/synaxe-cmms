import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, eachDayOfInterval, isWeekend, isSameDay, addDays, addWeeks, addMonths, addYears, isWithinInterval } from 'date-fns';
import { fr } from 'date-fns/locale';
import { PageTitle } from '@/components/ui/PageTitle';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  Plus, 
  Search,
  Filter,
  Clock,
  Monitor,
  Play,
  Edit,
  ChevronRight,
  ChevronLeft,
  BarChart3,
  CalendarIcon,
  Eye,
  CheckCircle2,
  ListChecks
} from 'lucide-react';
import { cn } from '@/lib/utils';

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
  status: 'Actif' | 'Inactif';
}

interface Equipment {
  id: string;
  name: string;
  family: string;
  subFamily: string;
}

interface GeneratedIntervention {
  date: Date;
  rangeId: number;
  rangeName: string;
  equipmentId: string;
  equipmentName: string;
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
    interventions: 0,
    status: 'Actif'
  },
  {
    id: 2,
    name: 'Révision Mensuelle Pompes',
    type: 'Maintenance Préventive',
    frequency: 'Mensuel',
    familyEquipment: 'Pompe',
    subFamily: 'Distribution',
    actions: {
      total: 5,
      details: ['Contrôle pression', 'Vérification joints', '+3 autres']
    },
    interventions: 12,
    status: 'Actif'
  },
  {
    id: 3,
    name: 'Inspection Annuelle Cuves',
    type: 'Maintenance Préventive',
    frequency: 'Annuel',
    familyEquipment: 'Cuve',
    subFamily: 'Stockage',
    actions: {
      total: 8,
      details: ['Inspection visuelle', 'Test étanchéité', '+6 autres']
    },
    interventions: 2,
    status: 'Actif'
  },
];

const equipmentList: Equipment[] = [
  { id: '202', name: 'Camion 202', family: 'Camion', subFamily: 'Oléoserveur' },
  { id: '215', name: 'Camion 215', family: 'Camion', subFamily: 'Citerne' },
  { id: '220', name: 'Camion 220', family: 'Camion', subFamily: 'Oléoserveur' },
  { id: 'Cuve108', name: 'Cuve 108', family: 'Cuve', subFamily: 'Stockage' },
  { id: 'Cuve109', name: 'Cuve 109', family: 'Cuve', subFamily: 'Stockage' },
  { id: 'Pompe01', name: 'Pompe 01', family: 'Pompe', subFamily: 'Distribution' },
  { id: 'Pompe02', name: 'Pompe 02', family: 'Pompe', subFamily: 'Distribution' },
];

const frequencyOptions = [
  { value: 'Quotidien', label: 'Quotidien' },
  { value: 'Hebdomadaire', label: 'Hebdomadaire' },
  { value: 'Bi-mensuel', label: 'Bi-mensuel' },
  { value: 'Mensuel', label: 'Mensuel' },
  { value: 'Annuel', label: 'Annuel' },
];

const MaintenanceRanges: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // États pour la modale de génération simple (par ligne)
  const [isSingleDialogOpen, setIsSingleDialogOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState<MaintenanceRange | null>(null);

  // États pour la modale de génération en masse
  const [isMassDialogOpen, setIsMassDialogOpen] = useState(false);
  const [selectedRanges, setSelectedRanges] = useState<number[]>([]);

  // États communs
  const [currentStep, setCurrentStep] = useState(1);
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [selectedFrequency, setSelectedFrequency] = useState<string>('');

  // États pour les équipements
  const [equipmentSearchQuery, setEquipmentSearchQuery] = useState('');
  const [selectedEquipments, setSelectedEquipments] = useState<string[]>([]);
  const [familyFilter, setFamilyFilter] = useState<string>('all');
  const [subFamilyFilter, setSubFamilyFilter] = useState<string>('all');

  // États pour les options d'exclusion
  const [excludeWeekends, setExcludeWeekends] = useState(false);
  const [excludePeriod, setExcludePeriod] = useState(false);
  const [excludeStartDate, setExcludeStartDate] = useState<Date | undefined>();
  const [excludeEndDate, setExcludeEndDate] = useState<Date | undefined>();

  // États pour la recherche de gammes (modale masse)
  const [rangeSearchQuery, setRangeSearchQuery] = useState('');

  const families = useMemo(() => {
    return [...new Set(equipmentList.map(e => e.family))];
  }, []);

  const subFamilies = useMemo(() => {
    if (familyFilter === 'all') {
      return [...new Set(equipmentList.map(e => e.subFamily))];
    }
    return [...new Set(equipmentList.filter(e => e.family === familyFilter).map(e => e.subFamily))];
  }, [familyFilter]);

  const filteredEquipments = useMemo(() => {
    return equipmentList.filter(equipment => {
      const matchesSearch = equipment.name.toLowerCase().includes(equipmentSearchQuery.toLowerCase());
      const matchesFamily = familyFilter === 'all' || equipment.family === familyFilter;
      const matchesSubFamily = subFamilyFilter === 'all' || equipment.subFamily === subFamilyFilter;
      return matchesSearch && matchesFamily && matchesSubFamily;
    });
  }, [equipmentSearchQuery, familyFilter, subFamilyFilter]);

  const filteredRanges = useMemo(() => {
    return maintenanceRanges.filter(range =>
      range.name.toLowerCase().includes(rangeSearchQuery.toLowerCase())
    );
  }, [rangeSearchQuery]);

  // Calculer les interventions générées
  const generatedInterventions = useMemo((): GeneratedIntervention[] => {
    if (!startDate || !endDate || selectedEquipments.length === 0) return [];

    const interventions: GeneratedIntervention[] = [];
    const rangesToUse = isMassDialogOpen 
      ? maintenanceRanges.filter(r => selectedRanges.includes(r.id))
      : selectedRange ? [selectedRange] : [];

    const frequency = selectedFrequency || (selectedRange?.frequency || 'Mensuel');

    rangesToUse.forEach(range => {
      selectedEquipments.forEach(equipmentId => {
        const equipment = equipmentList.find(e => e.id === equipmentId);
        if (!equipment) return;

        let currentDate = new Date(startDate);
        while (currentDate <= endDate) {
          let shouldAdd = true;

          // Exclure les week-ends
          if (excludeWeekends && isWeekend(currentDate)) {
            shouldAdd = false;
          }

          // Exclure la période définie
          if (excludePeriod && excludeStartDate && excludeEndDate) {
            if (isWithinInterval(currentDate, { start: excludeStartDate, end: excludeEndDate })) {
              shouldAdd = false;
            }
          }

          if (shouldAdd) {
            interventions.push({
              date: new Date(currentDate),
              rangeId: range.id,
              rangeName: range.name,
              equipmentId: equipment.id,
              equipmentName: equipment.name,
            });
          }

          // Avancer selon la fréquence
          switch (frequency) {
            case 'Quotidien':
              currentDate = addDays(currentDate, 1);
              break;
            case 'Hebdomadaire':
              currentDate = addWeeks(currentDate, 1);
              break;
            case 'Bi-mensuel':
              currentDate = addWeeks(currentDate, 2);
              break;
            case 'Mensuel':
              currentDate = addMonths(currentDate, 1);
              break;
            case 'Annuel':
              currentDate = addYears(currentDate, 1);
              break;
            default:
              currentDate = addMonths(currentDate, 1);
          }
        }
      });
    });

    return interventions;
  }, [startDate, endDate, selectedEquipments, selectedRange, selectedRanges, isMassDialogOpen, selectedFrequency, excludeWeekends, excludePeriod, excludeStartDate, excludeEndDate]);

  // Dates avec interventions pour le calendrier
  const interventionDates = useMemo(() => {
    return generatedInterventions.map(i => i.date);
  }, [generatedInterventions]);

  const handleGenerateSingle = (range: MaintenanceRange) => {
    setSelectedRange(range);
    setSelectedFrequency(range.frequency);
    setCurrentStep(1);
    setIsSingleDialogOpen(true);
  };

  const handleGenerateMass = () => {
    setSelectedRange(null);
    setSelectedRanges([]);
    setSelectedFrequency('Mensuel');
    setCurrentStep(1);
    setIsMassDialogOpen(true);
  };

  const handleSelectAllEquipments = (checked: boolean) => {
    if (checked) {
      setSelectedEquipments(filteredEquipments.map(e => e.id));
    } else {
      setSelectedEquipments([]);
    }
  };

  const handleToggleEquipment = (equipmentId: string) => {
    setSelectedEquipments(prev => 
      prev.includes(equipmentId) 
        ? prev.filter(id => id !== equipmentId)
        : [...prev, equipmentId]
    );
  };

  const handleToggleRange = (rangeId: number) => {
    setSelectedRanges(prev =>
      prev.includes(rangeId)
        ? prev.filter(id => id !== rangeId)
        : [...prev, rangeId]
    );
  };

  const handleSelectAllRanges = (checked: boolean) => {
    if (checked) {
      setSelectedRanges(filteredRanges.map(r => r.id));
    } else {
      setSelectedRanges([]);
    }
  };

  const resetDialogState = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setSelectedEquipments([]);
    setEquipmentSearchQuery('');
    setFamilyFilter('all');
    setSubFamilyFilter('all');
    setExcludeWeekends(false);
    setExcludePeriod(false);
    setExcludeStartDate(undefined);
    setExcludeEndDate(undefined);
    setCurrentStep(1);
    setSelectedRanges([]);
    setRangeSearchQuery('');
    setSelectedFrequency('');
  };

  const handleCloseSingleDialog = () => {
    setIsSingleDialogOpen(false);
    resetDialogState();
  };

  const handleCloseMassDialog = () => {
    setIsMassDialogOpen(false);
    resetDialogState();
  };

  const handleConfirmGeneration = () => {
    console.log('Génération du plan');
    console.log('Interventions générées:', generatedInterventions.length);
    if (isMassDialogOpen) {
      handleCloseMassDialog();
    } else {
      handleCloseSingleDialog();
    }
  };

  const allFilteredEquipmentsSelected = filteredEquipments.length > 0 && 
    filteredEquipments.every(e => selectedEquipments.includes(e.id));

  const allFilteredRangesSelected = filteredRanges.length > 0 &&
    filteredRanges.every(r => selectedRanges.includes(r.id));

  const canProceedStep1 = isMassDialogOpen 
    ? selectedRanges.length > 0 
    : true;

  const canProceedStep2 = startDate && endDate && selectedEquipments.length > 0;

  // Nombre de gammes impactées
  const impactedRangesCount = isMassDialogOpen 
    ? selectedRanges.length 
    : selectedRange ? 1 : 0;

  const renderStepIndicator = (totalSteps: number) => (
    <div className="flex items-center justify-center gap-2 mb-6">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
        <React.Fragment key={step}>
          <div
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
              currentStep === step
                ? "bg-primary text-primary-foreground"
                : currentStep > step
                ? "bg-green-600 text-white"
                : "bg-muted text-muted-foreground"
            )}
          >
            {currentStep > step ? <CheckCircle2 className="h-4 w-4" /> : step}
          </div>
          {step < totalSteps && (
            <div className={cn(
              "w-12 h-0.5",
              currentStep > step ? "bg-green-600" : "bg-muted"
            )} />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  const renderEquipmentSelection = () => (
    <div className="space-y-3">
      <Label className="text-sm font-medium text-foreground">Équipements</Label>
      
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un équipement..."
            value={equipmentSearchQuery}
            onChange={(e) => setEquipmentSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={familyFilter} onValueChange={(value) => {
          setFamilyFilter(value);
          setSubFamilyFilter('all');
        }}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Famille" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes</SelectItem>
            {families.map(family => (
              <SelectItem key={family} value={family}>{family}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={subFamilyFilter} onValueChange={setSubFamilyFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Sous-famille" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes</SelectItem>
            {subFamilies.map(subFamily => (
              <SelectItem key={subFamily} value={subFamily}>{subFamily}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg">
        <Checkbox 
          id="select-all-equipment"
          checked={allFilteredEquipmentsSelected}
          onCheckedChange={handleSelectAllEquipments}
        />
        <Label htmlFor="select-all-equipment" className="text-sm cursor-pointer">
          Tout sélectionner ({filteredEquipments.length} équipement(s))
        </Label>
      </div>

      <ScrollArea className="h-[150px] border border-border rounded-lg">
        <div className="p-2 space-y-1">
          {filteredEquipments.map(equipment => (
            <div 
              key={equipment.id}
              className="flex items-center gap-3 p-2 rounded hover:bg-muted/50 transition-colors"
            >
              <Checkbox 
                id={`equipment-${equipment.id}`}
                checked={selectedEquipments.includes(equipment.id)}
                onCheckedChange={() => handleToggleEquipment(equipment.id)}
              />
              <Label htmlFor={`equipment-${equipment.id}`} className="flex-1 cursor-pointer">
                <span className="text-sm font-medium">{equipment.name}</span>
                <span className="text-xs text-muted-foreground ml-2">
                  {equipment.family} &gt; {equipment.subFamily}
                </span>
              </Label>
            </div>
          ))}
          {filteredEquipments.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              Aucun équipement trouvé
            </p>
          )}
        </div>
      </ScrollArea>

      <p className="text-xs text-muted-foreground">
        {selectedEquipments.length} équipement(s) sélectionné(s)
      </p>
    </div>
  );

  const renderPeriodAndOptions = () => (
    <>
      {/* Périodicité */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-foreground">Périodicité</Label>
        <Select value={selectedFrequency} onValueChange={setSelectedFrequency}>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner la périodicité" />
          </SelectTrigger>
          <SelectContent>
            {frequencyOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Période de génération */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-foreground">Période de génération</Label>
        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs text-muted-foreground">Date de début</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal mt-1",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "PPP", { locale: fr }) : "Sélectionner"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div>
            <Label className="text-xs text-muted-foreground">Date de fin</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal mt-1",
                    !endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP", { locale: fr }) : "Sélectionner"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      {/* Options d'exclusion */}
      <div className="space-y-4">
        <Label className="text-sm font-medium text-foreground">Options</Label>
        
        <div className="flex items-center justify-between p-3 rounded-lg border border-border">
          <div>
            <p className="text-sm font-medium text-foreground">Exclure les week-ends</p>
            <p className="text-xs text-muted-foreground">Les samedis et dimanches ne seront pas planifiés</p>
          </div>
          <Switch 
            checked={excludeWeekends}
            onCheckedChange={setExcludeWeekends}
          />
        </div>

        <div className="p-3 rounded-lg border border-border space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Exclure une période</p>
              <p className="text-xs text-muted-foreground">Définir une période à exclure de la planification</p>
            </div>
            <Switch 
              checked={excludePeriod}
              onCheckedChange={setExcludePeriod}
            />
          </div>

          {excludePeriod && (
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border">
              <div>
                <Label className="text-xs text-muted-foreground">Du</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal mt-1",
                        !excludeStartDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {excludeStartDate ? format(excludeStartDate, "PPP", { locale: fr }) : "Début"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={excludeStartDate}
                      onSelect={setExcludeStartDate}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Au</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal mt-1",
                        !excludeEndDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {excludeEndDate ? format(excludeEndDate, "PPP", { locale: fr }) : "Fin"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={excludeEndDate}
                      onSelect={setExcludeEndDate}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );

  const renderPreview = () => (
    <div className="space-y-4">
      {/* Statistiques */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 rounded-lg bg-blue-50 border border-blue-100">
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 className="h-4 w-4 text-blue-600" />
            <p className="text-xs text-blue-600 font-medium">Interventions</p>
          </div>
          <p className="text-2xl font-bold text-blue-700">{generatedInterventions.length}</p>
        </div>
        <div className="p-4 rounded-lg bg-green-50 border border-green-100">
          <div className="flex items-center gap-2 mb-1">
            <ListChecks className="h-4 w-4 text-green-600" />
            <p className="text-xs text-green-600 font-medium">Gammes</p>
          </div>
          <p className="text-2xl font-bold text-green-700">{impactedRangesCount}</p>
        </div>
        <div className="p-4 rounded-lg bg-purple-50 border border-purple-100">
          <div className="flex items-center gap-2 mb-1">
            <Monitor className="h-4 w-4 text-purple-600" />
            <p className="text-xs text-purple-600 font-medium">Équipements</p>
          </div>
          <p className="text-2xl font-bold text-purple-700">{selectedEquipments.length}</p>
        </div>
      </div>

      {/* Calendrier de prévisualisation */}
      <div>
        <Label className="text-sm font-medium text-foreground mb-2 block">Vue calendrier</Label>
        <div className="border border-border rounded-lg p-2">
          <Calendar
            mode="multiple"
            selected={interventionDates}
            className="pointer-events-auto w-full"
            modifiers={{
              intervention: interventionDates,
            }}
            modifiersStyles={{
              intervention: {
                backgroundColor: 'hsl(var(--primary))',
                color: 'white',
                borderRadius: '50%',
              },
            }}
            disabled
          />
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Les dates colorées représentent les interventions planifiées
        </p>
      </div>

      {/* Liste des interventions */}
      <div>
        <Label className="text-sm font-medium text-foreground mb-2 block">
          Détail des interventions ({generatedInterventions.length})
        </Label>
        <ScrollArea className="h-[150px] border border-border rounded-lg">
          <div className="p-2 space-y-1">
            {generatedInterventions.slice(0, 50).map((intervention, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-2 rounded bg-muted/30"
              >
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-3 w-3 text-muted-foreground" />
                  <span className="text-sm">{format(intervention.date, "dd/MM/yyyy", { locale: fr })}</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {intervention.equipmentName} - {intervention.rangeName}
                </div>
              </div>
            ))}
            {generatedInterventions.length > 50 && (
              <p className="text-xs text-muted-foreground text-center py-2">
                ... et {generatedInterventions.length - 50} autres interventions
              </p>
            )}
            {generatedInterventions.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                Aucune intervention à générer
              </p>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );

  return (
    <div className="p-6 w-full bg-background">
      <PageTitle 
        title="Gamme de Maintenance" 
        subtitle="Planifier et gérer les gammes de maintenance"
        action={
          <div className="flex items-center gap-2">
            <Button 
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={handleGenerateMass}
            >
              <Play className="h-4 w-4 mr-2" />
              Génération en masse
            </Button>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle gamme
            </Button>
          </div>
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
                  État
                </th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="bg-card">
              {maintenanceRanges.map((range) => (
                <tr 
                  key={range.id} 
                  className="border-b border-border hover:bg-muted/30 transition-colors cursor-pointer"
                  onClick={() => navigate(`/maintenance/ranges/${range.id}`)}
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
                    <Badge 
                      className={
                        range.status === 'Actif' 
                          ? "bg-green-600 text-white hover:bg-green-600" 
                          : "bg-gray-500 text-white hover:bg-gray-500"
                      }
                    >
                      {range.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleGenerateSingle(range);
                        }}
                      >
                        <Play className="h-4 w-4 text-primary" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
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

      {/* Dialog de génération simple (par ligne) */}
      <Dialog open={isSingleDialogOpen} onOpenChange={(open) => !open && handleCloseSingleDialog()}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Play className="h-5 w-5 text-green-600" />
              Génération d'un plan de maintenance
            </DialogTitle>
            <DialogDescription>
              Générer des interventions pour la gamme sélectionnée
            </DialogDescription>
          </DialogHeader>

          {renderStepIndicator(3)}
          
          {selectedRange && (
            <div className="space-y-6 py-4">
              {/* Étape 1: Gamme (affichage uniquement) + Équipements */}
              {currentStep === 1 && (
                <>
                  <div>
                    <Label className="text-sm font-medium text-foreground">Gamme de maintenance</Label>
                    <div className="mt-2 p-3 rounded-lg bg-muted/50 border border-border">
                      <p className="text-sm font-medium text-foreground">{selectedRange.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">{selectedRange.type}</p>
                    </div>
                  </div>

                  {renderEquipmentSelection()}
                </>
              )}

              {/* Étape 2: Période et options */}
              {currentStep === 2 && renderPeriodAndOptions()}

              {/* Étape 3: Prévisualisation */}
              {currentStep === 3 && renderPreview()}
            </div>
          )}

          <DialogFooter className="flex justify-between">
            <div>
              {currentStep > 1 && (
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(prev => prev - 1)}
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Précédent
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleCloseSingleDialog}>
                Annuler
              </Button>
              {currentStep < 3 ? (
                <Button
                  onClick={() => setCurrentStep(prev => prev + 1)}
                  disabled={currentStep === 1 ? selectedEquipments.length === 0 : !canProceedStep2}
                >
                  Suivant
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={handleConfirmGeneration}
                  disabled={generatedInterventions.length === 0}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Générer le plan
                </Button>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de génération en masse */}
      <Dialog open={isMassDialogOpen} onOpenChange={(open) => !open && handleCloseMassDialog()}>
        <DialogContent className="sm:max-w-[750px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Play className="h-5 w-5 text-green-600" />
              Génération en masse
            </DialogTitle>
            <DialogDescription>
              Générer des interventions pour plusieurs gammes de maintenance
            </DialogDescription>
          </DialogHeader>

          {renderStepIndicator(3)}
          
          <div className="space-y-6 py-4">
            {/* Étape 1: Sélection des gammes + Équipements */}
            {currentStep === 1 && (
              <>
                {/* Sélection des gammes */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-foreground">Gammes de maintenance</Label>
                  
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher une gamme..."
                      value={rangeSearchQuery}
                      onChange={(e) => setRangeSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg">
                    <Checkbox 
                      id="select-all-ranges"
                      checked={allFilteredRangesSelected}
                      onCheckedChange={handleSelectAllRanges}
                    />
                    <Label htmlFor="select-all-ranges" className="text-sm cursor-pointer">
                      Tout sélectionner ({filteredRanges.length} gamme(s))
                    </Label>
                  </div>

                  <ScrollArea className="h-[150px] border border-border rounded-lg">
                    <div className="p-2 space-y-1">
                      {filteredRanges.map(range => (
                        <div 
                          key={range.id}
                          className="flex items-center gap-3 p-2 rounded hover:bg-muted/50 transition-colors"
                        >
                          <Checkbox 
                            id={`range-${range.id}`}
                            checked={selectedRanges.includes(range.id)}
                            onCheckedChange={() => handleToggleRange(range.id)}
                          />
                          <Label htmlFor={`range-${range.id}`} className="flex-1 cursor-pointer">
                            <span className="text-sm font-medium">{range.name}</span>
                            <span className="text-xs text-muted-foreground ml-2">
                              {range.frequency} - {range.familyEquipment}
                            </span>
                          </Label>
                        </div>
                      ))}
                      {filteredRanges.length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          Aucune gamme trouvée
                        </p>
                      )}
                    </div>
                  </ScrollArea>

                  <p className="text-xs text-muted-foreground">
                    {selectedRanges.length} gamme(s) sélectionnée(s)
                  </p>
                </div>

                {renderEquipmentSelection()}
              </>
            )}

            {/* Étape 2: Période et options */}
            {currentStep === 2 && renderPeriodAndOptions()}

            {/* Étape 3: Prévisualisation */}
            {currentStep === 3 && renderPreview()}
          </div>

          <DialogFooter className="flex justify-between">
            <div>
              {currentStep > 1 && (
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(prev => prev - 1)}
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Précédent
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleCloseMassDialog}>
                Annuler
              </Button>
              {currentStep < 3 ? (
                <Button
                  onClick={() => setCurrentStep(prev => prev + 1)}
                  disabled={currentStep === 1 ? !canProceedStep1 || selectedEquipments.length === 0 : !canProceedStep2}
                >
                  Suivant
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={handleConfirmGeneration}
                  disabled={generatedInterventions.length === 0}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Générer le plan
                </Button>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MaintenanceRanges;
