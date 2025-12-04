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
  Search, 
  Calendar, 
  Clock,
  User,
  Wrench,
  ChevronRight,
  FileText,
  Image,
  Filter,
  Download,
  Eye,
  CheckCircle2,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface HistoryIntervention {
  id: string;
  equipment: string;
  equipmentCode: string;
  gamme: string;
  type: 'preventive' | 'corrective' | 'diagnostic';
  status: 'completed' | 'cancelled' | 'partial';
  assignedTo: string;
  completedDate: string;
  duration: string;
  hasPhotos: boolean;
  hasReport: boolean;
  comments: string;
}

interface HistoryRequest {
  id: string;
  title: string;
  equipment: string;
  equipmentCode: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'resolved' | 'rejected' | 'pending';
  createdBy: string;
  createdAt: string;
  resolvedAt?: string;
  resolution?: string;
}

const historyInterventions: HistoryIntervention[] = [
  { id: 'INT-2025-001', equipment: 'Oléoserveur 201', equipmentCode: 'EQ001', gamme: 'Maintenance préventive mensuelle', type: 'preventive', status: 'completed', assignedTo: 'Jean Martin', completedDate: '04/12/2025', duration: '2h15', hasPhotos: true, hasReport: true, comments: 'RAS' },
  { id: 'INT-2025-002', equipment: 'Pompe principale Zone A', equipmentCode: 'EQ015', gamme: 'Réparation fuite', type: 'corrective', status: 'completed', assignedTo: 'Jean Martin', completedDate: '03/12/2025', duration: '3h30', hasPhotos: true, hasReport: true, comments: 'Joint remplacé' },
  { id: 'INT-2025-003', equipment: 'Compteur Zone 1', equipmentCode: 'EQ008', gamme: 'Calibration trimestrielle', type: 'preventive', status: 'completed', assignedTo: 'Sophie Bernard', completedDate: '02/12/2025', duration: '1h45', hasPhotos: false, hasReport: true, comments: 'Calibration OK' },
  { id: 'INT-2025-004', equipment: 'Vanne de sécurité', equipmentCode: 'EQ033', gamme: 'Inspection réglementaire', type: 'preventive', status: 'partial', assignedTo: 'Jean Martin', completedDate: '01/12/2025', duration: '4h00', hasPhotos: true, hasReport: false, comments: 'Test partiel - pièce manquante' },
  { id: 'INT-2025-005', equipment: 'Filtre Station B', equipmentCode: 'EQ022', gamme: 'Remplacement filtre', type: 'corrective', status: 'completed', assignedTo: 'Pierre Lefebvre', completedDate: '30/11/2025', duration: '45min', hasPhotos: false, hasReport: true, comments: 'Filtre colmaté remplacé' },
  { id: 'INT-2025-006', equipment: 'Oléoserveur 202', equipmentCode: 'EQ002', gamme: 'Diagnostic vibrations', type: 'diagnostic', status: 'completed', assignedTo: 'Jean Martin', completedDate: '29/11/2025', duration: '1h30', hasPhotos: true, hasReport: true, comments: 'Vibrations dans les normes' },
  { id: 'INT-2025-007', equipment: 'Capteur pression Zone A', equipmentCode: 'EQ040', gamme: 'Remplacement capteur', type: 'corrective', status: 'cancelled', assignedTo: 'Marie Dubois', completedDate: '28/11/2025', duration: '-', hasPhotos: false, hasReport: false, comments: 'Annulé - mauvaise référence' },
];

const historyRequests: HistoryRequest[] = [
  { id: 'DI-2025-001', title: 'Fuite raccord B2', equipment: 'Oléoserveur 201', equipmentCode: 'EQ001', priority: 'high', status: 'resolved', createdBy: 'Jean Martin', createdAt: '04/12/2025 08:45', resolvedAt: '04/12/2025 14:30', resolution: 'Joint remplacé lors de la maintenance' },
  { id: 'DI-2025-002', title: 'Bruit anormal pompe', equipment: 'Pompe principale Zone A', equipmentCode: 'EQ015', priority: 'critical', status: 'resolved', createdBy: 'Sophie Bernard', createdAt: '03/12/2025 14:20', resolvedAt: '03/12/2025 18:00', resolution: 'Roulement remplacé' },
  { id: 'DI-2025-003', title: 'Écran défectueux', equipment: 'Compteur Zone 1', equipmentCode: 'EQ008', priority: 'medium', status: 'pending', createdBy: 'Pierre Lefebvre', createdAt: '02/12/2025 10:15' },
  { id: 'DI-2025-004', title: 'Joint usé vanne', equipment: 'Vanne de sécurité', equipmentCode: 'EQ033', priority: 'low', status: 'resolved', createdBy: 'Marie Dubois', createdAt: '01/12/2025 16:30', resolvedAt: '02/12/2025 09:00', resolution: 'Commandé nouveau joint' },
  { id: 'DI-2025-005', title: 'Fausse alarme', equipment: 'Filtre Station B', equipmentCode: 'EQ022', priority: 'medium', status: 'rejected', createdBy: 'Jean Martin', createdAt: '30/11/2025 11:00', resolution: 'Pas d\'anomalie constatée' },
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
    case 'resolved':
      return { label: 'Résolu', icon: CheckCircle2, className: 'bg-green-100 text-green-800' };
    case 'rejected':
      return { label: 'Rejeté', icon: XCircle, className: 'bg-red-100 text-red-800' };
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

const TabletHistory: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('interventions');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showOnlyMine, setShowOnlyMine] = useState(false);

  const filteredInterventions = historyInterventions.filter(item => {
    const matchesSearch = item.equipment.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.gamme.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesUser = !showOnlyMine || item.assignedTo === currentUser;
    return matchesSearch && matchesStatus && matchesUser;
  });

  const filteredRequests = historyRequests.filter(item => {
    const matchesSearch = item.equipment.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesUser = !showOnlyMine || item.createdBy === currentUser;
    return matchesSearch && matchesStatus && matchesUser;
  });

  const handleViewReport = (id: string) => {
    toast({ 
      title: "Rapport PDF",
      description: "L'affichage PDF sera disponible sur l'application native"
    });
  };

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
            placeholder="Rechercher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-12"
          />
        </div>
        
        <div className="flex gap-3">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="flex-1 h-12">
              <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="completed">Terminé</SelectItem>
              <SelectItem value="partial">Partiel</SelectItem>
              <SelectItem value="cancelled">Annulé</SelectItem>
              <SelectItem value="resolved">Résolu</SelectItem>
              <SelectItem value="pending">En attente</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant={showOnlyMine ? "default" : "outline"}
            className="h-12 px-4"
            onClick={() => setShowOnlyMine(!showOnlyMine)}
          >
            <User className="h-4 w-4 mr-2" />
            Mes activités
          </Button>
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

            return (
              <Card key={item.id} className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
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
                      
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground flex-wrap">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
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

                      {item.comments && (
                        <p className="text-sm text-muted-foreground mt-2 italic">"{item.comments}"</p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2 border-t border-border">
                    {item.hasPhotos && (
                      <Button variant="outline" size="sm" className="flex-1 h-10">
                        <Image className="h-4 w-4 mr-2" />
                        Photos
                      </Button>
                    )}
                    {item.hasReport && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 h-10"
                        onClick={() => handleViewReport(item.id)}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Rapport PDF
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" className="h-10 w-10">
                      <ChevronRight className="h-5 w-5" />
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

            return (
              <Card key={item.id} className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
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
                      
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground flex-wrap">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {item.createdAt}
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {item.createdBy}
                        </div>
                      </div>

                      {item.resolution && (
                        <div className="mt-2 p-2 bg-muted/30 rounded text-sm">
                          <span className="text-muted-foreground">Résolution: </span>
                          <span className="text-foreground">{item.resolution}</span>
                        </div>
                      )}
                    </div>
                    
                    <Button variant="ghost" size="icon" className="h-10 w-10">
                      <ChevronRight className="h-5 w-5" />
                    </Button>
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
