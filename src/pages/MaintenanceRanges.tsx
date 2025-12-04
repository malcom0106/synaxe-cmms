import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
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
  BarChart3,
  CalendarIcon,
  X
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
];

// Liste des équipements
const equipmentList: Equipment[] = [
  { id: '202', name: 'Camion 202', family: 'Camion', subFamily: 'Oléoserveur' },
  { id: '215', name: 'Camion 215', family: 'Camion', subFamily: 'Citerne' },
  { id: '220', name: 'Camion 220', family: 'Camion', subFamily: 'Oléoserveur' },
  { id: 'Cuve108', name: 'Cuve 108', family: 'Cuve', subFamily: 'Stockage' },
  { id: 'Cuve109', name: 'Cuve 109', family: 'Cuve', subFamily: 'Stockage' },
  { id: 'Pompe01', name: 'Pompe 01', family: 'Pompe', subFamily: 'Distribution' },
  { id: 'Pompe02', name: 'Pompe 02', family: 'Pompe', subFamily: 'Distribution' },
];

const MaintenanceRanges: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState<MaintenanceRange | null>(null);
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const navigate = useNavigate();

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

  // Extraire les familles et sous-familles uniques
  const families = useMemo(() => {
    return [...new Set(equipmentList.map(e => e.family))];
  }, []);

  const subFamilies = useMemo(() => {
    if (familyFilter === 'all') {
      return [...new Set(equipmentList.map(e => e.subFamily))];
    }
    return [...new Set(equipmentList.filter(e => e.family === familyFilter).map(e => e.subFamily))];
  }, [familyFilter]);

  // Filtrer les équipements
  const filteredEquipments = useMemo(() => {
    return equipmentList.filter(equipment => {
      const matchesSearch = equipment.name.toLowerCase().includes(equipmentSearchQuery.toLowerCase());
      const matchesFamily = familyFilter === 'all' || equipment.family === familyFilter;
      const matchesSubFamily = subFamilyFilter === 'all' || equipment.subFamily === subFamilyFilter;
      return matchesSearch && matchesFamily && matchesSubFamily;
    });
  }, [equipmentSearchQuery, familyFilter, subFamilyFilter]);

  const handleGeneratePlan = (range: MaintenanceRange) => {
    setSelectedRange(range);
    setIsGenerateDialogOpen(true);
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

  const handleCloseDialog = () => {
    setIsGenerateDialogOpen(false);
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
  };

  const handleConfirmGeneration = () => {
    console.log('Génération du plan pour:', selectedRange?.name);
    console.log('Période:', startDate, 'à', endDate);
    console.log('Équipements sélectionnés:', selectedEquipments);
    console.log('Exclure week-ends:', excludeWeekends);
    console.log('Exclure période:', excludePeriod, excludeStartDate, excludeEndDate);
    handleCloseDialog();
  };

  const allFilteredSelected = filteredEquipments.length > 0 && 
    filteredEquipments.every(e => selectedEquipments.includes(e.id));

  return (
    <div className="p-6 w-full bg-background">
      <PageTitle 
        title="Gamme de Maintenance" 
        subtitle="Planifier et gérer les gammes de maintenance"
        action={
          <div className="flex items-center gap-2">
            <Button 
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={() => handleGeneratePlan(maintenanceRanges[0])}
            >
              <Play className="h-4 w-4 mr-2" />
              Génération d'un plan de maintenance
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
                          handleGeneratePlan(range);
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

      {/* Dialog de génération de plan */}
      <Dialog open={isGenerateDialogOpen} onOpenChange={(open) => !open && handleCloseDialog()}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Play className="h-5 w-5 text-green-600" />
              Génération d'un plan de maintenance
            </DialogTitle>
            <DialogDescription>
              Sélectionnez les équipements et la période pour générer les interventions planifiées
            </DialogDescription>
          </DialogHeader>
          
          {selectedRange && (
            <div className="space-y-6 py-4">
              {/* Nom de la gamme */}
              <div>
                <Label className="text-sm font-medium text-foreground">Gamme de maintenance</Label>
                <div className="mt-2 p-3 rounded-lg bg-muted/50 border border-border">
                  <p className="text-sm font-medium text-foreground">{selectedRange.name}</p>
                </div>
              </div>

              {/* Périodicité */}
              <div>
                <Label className="text-sm font-medium text-foreground">Périodicité</Label>
                <div className="mt-2 p-3 rounded-lg bg-blue-50 border border-blue-100">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <p className="text-sm font-medium text-blue-600">{selectedRange.frequency}</p>
                  </div>
                </div>
              </div>

              {/* Sélection des équipements */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-foreground">Équipements</Label>
                
                {/* Filtres et recherche */}
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

                {/* Tout cocher */}
                <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg">
                  <Checkbox 
                    id="select-all"
                    checked={allFilteredSelected}
                    onCheckedChange={handleSelectAllEquipments}
                  />
                  <Label htmlFor="select-all" className="text-sm cursor-pointer">
                    Tout sélectionner ({filteredEquipments.length} équipement(s))
                  </Label>
                </div>

                {/* Liste des équipements */}
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
                
                {/* Exclure les week-ends */}
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

                {/* Exclure une période */}
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
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleCloseDialog}
            >
              Annuler
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={handleConfirmGeneration}
              disabled={!startDate || !endDate || selectedEquipments.length === 0}
            >
              <Play className="h-4 w-4 mr-2" />
              Générer le plan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MaintenanceRanges;