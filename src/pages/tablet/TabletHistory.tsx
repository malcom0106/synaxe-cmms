import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { 
  Search, 
  Calendar as CalendarIcon, 
  Clock,
  User,
  Wrench,
  ChevronRight,
  FileText,
  Image,
  Filter,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Truck,
  ClipboardList,
  Stethoscope
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { DateRange } from 'react-day-picker';

interface AssociatedItem {
  id: string;
  type: 'diagnostic' | 'gamme';
  name: string;
}

interface HistoryIntervention {
  id: string;
  equipment: string;
  equipmentCode: string;
  gamme: string;
  type: 'preventive' | 'corrective' | 'diagnostic';
  status: 'completed' | 'cancelled' | 'partial' | 'in_progress';
  assignedTo: string;
  completedDate: string;
  duration: string;
  hasPhotos: boolean;
  comments: string;
}

interface HistoryRequest {
  id: string;
  title: string;
  equipment: string;
  equipmentCode: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'resolved' | 'cancelled' | 'pending';
  createdBy: string;
  createdAt: string;
  resolvedAt?: string;
  cancelledComment?: string;
  associatedItems: AssociatedItem[];
}

// Mock data - équipements (camions)
const equipmentOptions = [
  { value: 'all', label: 'Tous les camions' },
  { value: 'EQ001', label: 'Oléoserveur 201' },
  { value: 'EQ002', label: 'Oléoserveur 202' },
  { value: 'EQ015', label: 'Pompe principale Zone A' },
  { value: 'EQ008', label: 'Compteur Zone 1' },
  { value: 'EQ033', label: 'Vanne de sécurité' },
  { value: 'EQ022', label: 'Filtre Station B' },
  { value: 'EQ040', label: 'Capteur pression Zone A' },
];

// Mock data - opérateurs
const operatorOptions = [
  { value: 'all', label: 'Tous les opérateurs' },
  { value: 'Jean Martin', label: 'Jean Martin' },
  { value: 'Sophie Bernard', label: 'Sophie Bernard' },
  { value: 'Pierre Lefebvre', label: 'Pierre Lefebvre' },
  { value: 'Marie Dubois', label: 'Marie Dubois' },
];

const historyInterventions: HistoryIntervention[] = [
  { id: 'INT-2025-001', equipment: 'Oléoserveur 201', equipmentCode: 'EQ001', gamme: 'Maintenance préventive mensuelle', type: 'preventive', status: 'completed', assignedTo: 'Jean Martin', completedDate: '04/12/2025', duration: '2h15', hasPhotos: true, comments: 'RAS' },
  { id: 'INT-2025-002', equipment: 'Pompe principale Zone A', equipmentCode: 'EQ015', gamme: 'Réparation fuite', type: 'corrective', status: 'completed', assignedTo: 'Jean Martin', completedDate: '03/12/2025', duration: '3h30', hasPhotos: true, comments: 'Joint remplacé' },
  { id: 'INT-2025-003', equipment: 'Compteur Zone 1', equipmentCode: 'EQ008', gamme: 'Calibration trimestrielle', type: 'preventive', status: 'completed', assignedTo: 'Sophie Bernard', completedDate: '02/12/2025', duration: '1h45', hasPhotos: false, comments: 'Calibration OK' },
  { id: 'INT-2025-004', equipment: 'Vanne de sécurité', equipmentCode: 'EQ033', gamme: 'Inspection réglementaire', type: 'preventive', status: 'in_progress', assignedTo: 'Jean Martin', completedDate: '01/12/2025', duration: '4h00', hasPhotos: true, comments: 'Test partiel - pièce manquante' },
  { id: 'INT-2025-005', equipment: 'Filtre Station B', equipmentCode: 'EQ022', gamme: 'Remplacement filtre', type: 'corrective', status: 'completed', assignedTo: 'Pierre Lefebvre', completedDate: '30/11/2025', duration: '45min', hasPhotos: false, comments: 'Filtre colmaté remplacé' },
  { id: 'INT-2025-006', equipment: 'Oléoserveur 202', equipmentCode: 'EQ002', gamme: 'Diagnostic vibrations', type: 'diagnostic', status: 'completed', assignedTo: 'Jean Martin', completedDate: '29/11/2025', duration: '1h30', hasPhotos: true, comments: 'Vibrations dans les normes' },
  { id: 'INT-2025-007', equipment: 'Capteur pression Zone A', equipmentCode: 'EQ040', gamme: 'Remplacement capteur', type: 'corrective', status: 'cancelled', assignedTo: 'Marie Dubois', completedDate: '28/11/2025', duration: '-', hasPhotos: false, comments: 'Annulé - mauvaise référence' },
];

const historyRequests: HistoryRequest[] = [
  { 
    id: 'DI-2025-001', 
    title: 'Fuite raccord B2', 
    equipment: 'Oléoserveur 201', 
    equipmentCode: 'EQ001', 
    priority: 'high', 
    status: 'resolved', 
    createdBy: 'Jean Martin', 
    createdAt: '04/12/2025 08:45', 
    resolvedAt: '04/12/2025 14:30',
    associatedItems: [
      { id: 'GAM-001', type: 'gamme', name: 'Maintenance préventive mensuelle' },
      { id: 'DIAG-001', type: 'diagnostic', name: 'Diagnostic fuite' }
    ]
  },
  { 
    id: 'DI-2025-002', 
    title: 'Bruit anormal pompe', 
    equipment: 'Pompe principale Zone A', 
    equipmentCode: 'EQ015', 
    priority: 'critical', 
    status: 'resolved', 
    createdBy: 'Sophie Bernard', 
    createdAt: '03/12/2025 14:20', 
    resolvedAt: '03/12/2025 18:00',
    associatedItems: [
      { id: 'GAM-002', type: 'gamme', name: 'Réparation fuite' }
    ]
  },
  { 
    id: 'DI-2025-003', 
    title: 'Écran défectueux', 
    equipment: 'Compteur Zone 1', 
    equipmentCode: 'EQ008', 
    priority: 'medium', 
    status: 'pending', 
    createdBy: 'Pierre Lefebvre', 
    createdAt: '02/12/2025 10:15',
    associatedItems: []
  },
  { 
    id: 'DI-2025-004', 
    title: 'Joint usé vanne', 
    equipment: 'Vanne de sécurité', 
    equipmentCode: 'EQ033', 
    priority: 'low', 
    status: 'resolved', 
    createdBy: 'Marie Dubois', 
    createdAt: '01/12/2025 16:30', 
    resolvedAt: '02/12/2025 09:00',
    associatedItems: [
      { id: 'DIAG-002', type: 'diagnostic', name: 'Inspection visuelle' }
    ]
  },
  { 
    id: 'DI-2025-005', 
    title: 'Fausse alarme', 
    equipment: 'Filtre Station B', 
    equipmentCode: 'EQ022', 
    priority: 'medium', 
    status: 'cancelled', 
    createdBy: 'Jean Martin', 
    createdAt: '30/11/2025 11:00',
    cancelledComment: 'Pas d\'anomalie constatée lors de la vérification sur site',
    associatedItems: []
  },
];

const currentUser = 'Jean Martin';

const getStatusConfig = (status: string) => {
  switch (status) {
    case 'completed':
      return { label: 'Terminé', icon: CheckCircle2, className: 'bg-green-100 text-green-800' };
    case 'cancelled':
      return { label: 'Annulé', icon: XCircle, className: 'bg-gray-100 text-gray-800' };
    case 'partial':
      return { label: 'Partiel', icon: AlertTriangle, className: 'bg-orange-100 text-orange-800' };
    case 'in_progress':
      return { label: 'En cours', icon: Clock, className: 'bg-blue-100 text-blue-800' };
    case 'resolved':
      return { label: 'Résolu', icon: CheckCircle2, className: 'bg-green-100 text-green-800' };
    case 'pending':
      return { label: 'En attente', icon: Clock, className: 'bg-blue-100 text-blue-800' };
    default:
      return { label: status, icon: Clock, className: 'bg-gray-100 text-gray-800' };
  }
};

const getTypeConfig = (type: string) => {
  switch (type) {
    case 'preventive':
      return { label: 'Préventif', className: 'bg-blue-500' };
    case 'corrective':
      return { label: 'Correctif', className: 'bg-orange-500' };
    case 'diagnostic':
      return { label: 'Diagnostic', className: 'bg-purple-500' };
    default:
      return { label: type, className: 'bg-gray-500' };
  }
};

const getPriorityConfig = (priority: string) => {
  switch (priority) {
    case 'critical':
      return { label: 'Critique', className: 'bg-red-600 text-white' };
    case 'high':
      return { label: 'Haute', className: 'bg-orange-500 text-white' };
    case 'medium':
      return { label: 'Moyenne', className: 'bg-yellow-500 text-white' };
    default:
      return { label: 'Basse', className: 'bg-green-500 text-white' };
  }
};

// Helper to parse date from string
const parseDate = (dateStr: string): Date | null => {
  const parts = dateStr.split(' ')[0].split('/');
  if (parts.length === 3) {
    return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
  }
  return null;
};

const TabletHistory: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('interventions');
  const [searchQuery, setSearchQuery] = useState('');
  const [equipmentFilter, setEquipmentFilter] = useState('all');
  const [operatorFilter, setOperatorFilter] = useState('all');
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  const filteredInterventions = historyInterventions.filter(item => {
    const matchesSearch = item.gamme.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesEquipment = equipmentFilter === 'all' || item.equipmentCode === equipmentFilter;
    const matchesOperator = operatorFilter === 'all' || item.assignedTo === operatorFilter;
    
    let matchesDate = true;
    if (dateRange?.from) {
      const itemDate = parseDate(item.completedDate);
      if (itemDate) {
        matchesDate = itemDate >= dateRange.from;
        if (dateRange.to) {
          matchesDate = matchesDate && itemDate <= dateRange.to;
        }
      }
    }
    
    return matchesSearch && matchesEquipment && matchesOperator && matchesDate;
  });

  const filteredRequests = historyRequests.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesEquipment = equipmentFilter === 'all' || item.equipmentCode === equipmentFilter;
    const matchesOperator = operatorFilter === 'all' || item.createdBy === operatorFilter;
    
    let matchesDate = true;
    if (dateRange?.from) {
      const itemDate = parseDate(item.createdAt);
      if (itemDate) {
        matchesDate = itemDate >= dateRange.from;
        if (dateRange.to) {
          matchesDate = matchesDate && itemDate <= dateRange.to;
        }
      }
    }
    
    return matchesSearch && matchesEquipment && matchesOperator && matchesDate;
  });

  const handleViewPhotos = (id: string, hasPhotos: boolean) => {
    if (!hasPhotos) {
      toast({ 
        title: "Aucune photo",
        description: "Cette intervention n'a pas de photos associées",
        variant: "destructive"
      });
      return;
    }
    toast({ 
      title: "Photos",
      description: "L'affichage des photos sera disponible sur l'application native"
    });
  };

  const handleViewReport = (id: string, canView: boolean) => {
    if (!canView) {
      toast({ 
        title: "Rapport non disponible",
        description: "Le rapport sera disponible une fois l'intervention terminée",
        variant: "destructive"
      });
      return;
    }
    toast({ 
      title: "Rapport PDF",
      description: "L'affichage PDF sera disponible sur l'application native"
    });
  };

  const clearFilters = () => {
    setSearchQuery('');
    setEquipmentFilter('all');
    setOperatorFilter('all');
    setDateRange(undefined);
  };

  const hasActiveFilters = searchQuery || equipmentFilter !== 'all' || operatorFilter !== 'all' || dateRange?.from;

  return (
    <div className="p-4 pb-8 space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Historique</h1>
        <p className="text-muted-foreground mt-1">Consultez les interventions et demandes passées</p>
      </div>

      {/* Filtres */}
      <Card className="p-4 space-y-3">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Rechercher par nom d'intervention..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-12"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <Select value={equipmentFilter} onValueChange={setEquipmentFilter}>
            <SelectTrigger className="h-12">
              <Truck className="h-4 w-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Camion" />
            </SelectTrigger>
            <SelectContent>
              {equipmentOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={operatorFilter} onValueChange={setOperatorFilter}>
            <SelectTrigger className="h-12">
              <User className="h-4 w-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Opérateur" />
            </SelectTrigger>
            <SelectContent>
              {operatorOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-3">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex-1 h-12 justify-start text-left font-normal">
                <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "dd/MM/yyyy", { locale: fr })} - {format(dateRange.to, "dd/MM/yyyy", { locale: fr })}
                    </>
                  ) : (
                    format(dateRange.from, "dd/MM/yyyy", { locale: fr })
                  )
                ) : (
                  <span className="text-muted-foreground">Sélectionner une période</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
                locale={fr}
              />
            </PopoverContent>
          </Popover>

          {hasActiveFilters && (
            <Button 
              variant="ghost" 
              className="h-12 px-4 text-muted-foreground"
              onClick={clearFilters}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Effacer
            </Button>
          )}
        </div>
      </Card>

      {/* Onglets */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 h-14 p-1 bg-muted/50">
          <TabsTrigger 
            value="interventions" 
            className="h-12 text-base font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Wrench className="h-5 w-5 mr-2" />
            Interventions
          </TabsTrigger>
          <TabsTrigger 
            value="requests"
            className="h-12 text-base font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <AlertTriangle className="h-5 w-5 mr-2" />
            Demandes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="interventions" className="mt-4 space-y-3">
          {filteredInterventions.map((item) => {
            const statusConfig = getStatusConfig(item.status);
            const typeConfig = getTypeConfig(item.type);
            const StatusIcon = statusConfig.icon;
            const isCompleted = item.status === 'completed';

            return (
              <Card key={item.id} className="p-4">
                <div className="flex gap-4">
                  {/* Content */}
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className={cn("text-xs text-white", typeConfig.className)}>
                        {typeConfig.label}
                      </Badge>
                      <Badge className={cn("text-xs", statusConfig.className)}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {statusConfig.label}
                      </Badge>
                      <span className="text-xs text-muted-foreground font-mono">{item.id}</span>
                    </div>
                    
                    <h3 className="font-semibold text-foreground">{item.equipment}</h3>
                    <p className="text-sm text-primary">{item.gamme}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="h-4 w-4" />
                        {item.completedDate}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {item.duration}
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {item.assignedTo}
                      </div>
                    </div>

                  </div>

                  {/* Action Buttons - Right side */}
                  <div className="flex flex-col gap-2 shrink-0">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className={cn(
                        "h-10 w-10",
                        !item.hasPhotos && "opacity-50 cursor-not-allowed"
                      )}
                      onClick={() => handleViewPhotos(item.id, item.hasPhotos)}
                      disabled={!item.hasPhotos}
                    >
                      <Image className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className={cn(
                        "h-10 w-10",
                        !isCompleted && "opacity-50 cursor-not-allowed"
                      )}
                      onClick={() => handleViewReport(item.id, isCompleted)}
                      disabled={!isCompleted}
                    >
                      <FileText className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}

          {filteredInterventions.length === 0 && (
            <Card className="p-8 text-center">
              <Wrench className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">Aucune intervention trouvée</p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="requests" className="mt-4 space-y-3">
          {filteredRequests.map((item) => {
            const statusConfig = getStatusConfig(item.status);
            const priorityConfig = getPriorityConfig(item.priority);
            const StatusIcon = statusConfig.icon;
            const isCancelled = item.status === 'cancelled';

            return (
              <Card key={item.id} className="p-4">
                <div className="flex gap-4">
                  {/* Content */}
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className={cn("text-xs", priorityConfig.className)}>
                        {priorityConfig.label}
                      </Badge>
                      <Badge className={cn("text-xs", statusConfig.className)}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {statusConfig.label}
                      </Badge>
                      <span className="text-xs text-muted-foreground font-mono">{item.id}</span>
                    </div>
                    
                    <h3 className="font-semibold text-foreground">{item.title}</h3>
                    <p className="text-sm text-primary">{item.equipment}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="h-4 w-4" />
                        {item.createdAt}
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {item.createdBy}
                      </div>
                    </div>

                    {/* Cancelled comment */}
                    {isCancelled && item.cancelledComment && (
                      <div className="mt-2 p-2 bg-gray-100 rounded text-sm border-l-4 border-gray-400">
                        <span className="text-muted-foreground font-medium">Motif d'annulation: </span>
                        <span className="text-foreground">{item.cancelledComment}</span>
                      </div>
                    )}
                  </div>

                  {/* Associated Items - Right side */}
                  <div className="flex flex-col gap-1 shrink-0 min-w-[180px]">
                    {item.associatedItems.length > 0 ? (
                      item.associatedItems.map((assoc) => (
                        <div 
                          key={assoc.id}
                          className="flex items-center gap-2 text-sm p-2 bg-muted/50 rounded"
                        >
                          {assoc.type === 'diagnostic' ? (
                            <Stethoscope className="h-4 w-4 text-purple-500 shrink-0" />
                          ) : (
                            <ClipboardList className="h-4 w-4 text-blue-500 shrink-0" />
                          )}
                          <span className="truncate text-foreground">{assoc.name}</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-muted-foreground italic p-2">
                        Aucune gamme/diagnostic
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}

          {filteredRequests.length === 0 && (
            <Card className="p-8 text-center">
              <AlertTriangle className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">Aucune demande trouvée</p>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TabletHistory;
