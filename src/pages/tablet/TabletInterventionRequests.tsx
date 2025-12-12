import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Plus, 
  AlertTriangle, 
  Clock, 
  User,
  MapPin,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { CreateInterventionRequestModal } from '@/components/tablet/CreateInterventionRequestModal';
import { toast } from 'sonner';
interface InterventionRequest {
  id: string;
  title: string;
  equipment: string;
  equipmentCode: string;
  location: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'assigned' | 'in-progress' | 'resolved';
  createdBy: string;
  createdAt: string;
}

const interventionRequests: InterventionRequest[] = [
  {
    id: 'DI001',
    title: 'Fuite détectée sur raccord B2',
    equipment: 'Oléoserveur 201',
    equipmentCode: 'EQ001',
    location: 'Zone A - Bâtiment principal',
    description: 'Fuite d\'huile légère détectée lors de la maintenance préventive',
    priority: 'high',
    status: 'pending',
    createdBy: 'Jean Martin',
    createdAt: '04/12/2025 08:45'
  },
  {
    id: 'DI002',
    title: 'Bruit anormal pompe',
    equipment: 'Pompe principale Zone A',
    equipmentCode: 'EQ015',
    location: 'Zone A - Station de pompage',
    description: 'Vibrations et bruit inhabituel lors du fonctionnement',
    priority: 'critical',
    status: 'assigned',
    createdBy: 'Sophie Bernard',
    createdAt: '03/12/2025 14:20'
  },
  {
    id: 'DI003',
    title: 'Écran de contrôle défectueux',
    equipment: 'Compteur Zone 1',
    equipmentCode: 'EQ008',
    location: 'Zone 1 - Point de distribution',
    description: 'Affichage intermittent sur l\'écran de contrôle',
    priority: 'medium',
    status: 'in-progress',
    createdBy: 'Pierre Lefebvre',
    createdAt: '02/12/2025 10:15'
  },
  {
    id: 'DI004',
    title: 'Joint usé vanne de sécurité',
    equipment: 'Vanne de sécurité',
    equipmentCode: 'EQ033',
    location: 'Zone B - Circuit principal',
    description: 'Joint d\'étanchéité présentant des signes d\'usure',
    priority: 'low',
    status: 'resolved',
    createdBy: 'Marie Dubois',
    createdAt: '01/12/2025 16:30'
  },
];

const getPriorityConfig = (priority: string) => {
  switch (priority) {
    case 'critical':
      return { label: 'Critique', className: 'bg-red-600 text-white', borderColor: 'border-l-red-600' };
    case 'high':
      return { label: 'Haute', className: 'bg-orange-500 text-white', borderColor: 'border-l-orange-500' };
    case 'medium':
      return { label: 'Moyenne', className: 'bg-yellow-500 text-white', borderColor: 'border-l-yellow-500' };
    default:
      return { label: 'Basse', className: 'bg-green-500 text-white', borderColor: 'border-l-green-500' };
  }
};

const getStatusConfig = (status: string) => {
  switch (status) {
    case 'pending':
      return { label: 'En attente', className: 'bg-gray-100 text-gray-800' };
    case 'assigned':
      return { label: 'Assignée', className: 'bg-blue-100 text-blue-800' };
    case 'in-progress':
      return { label: 'En cours', className: 'bg-purple-100 text-purple-800' };
    case 'resolved':
      return { label: 'Résolue', className: 'bg-green-100 text-green-800' };
    default:
      return { label: status, className: 'bg-gray-100 text-gray-800' };
  }
};

const TabletInterventionRequests: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [requests, setRequests] = useState(interventionRequests);

  const filteredRequests = requests.filter(request =>
    request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    request.equipment.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateRequest = (data: {
    title: string;
    description: string;
    equipmentId: string;
    equipmentName: string;
    photo?: string;
  }) => {
    const newRequest: InterventionRequest = {
      id: `DI${String(requests.length + 1).padStart(3, '0')}`,
      title: data.title,
      equipment: data.equipmentName,
      equipmentCode: data.equipmentId,
      location: 'Zone à définir',
      description: data.description,
      priority: 'medium',
      status: 'pending',
      createdBy: 'Jean Martin',
      createdAt: new Date().toLocaleString('fr-FR', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
    };
    setRequests([newRequest, ...requests]);
    toast.success('Demande d\'intervention créée avec succès');
  };
  return (
    <div className="p-4 pb-8 space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Demandes d'intervention</h1>
          <p className="text-muted-foreground mt-1">Anomalies et demandes signalées</p>
        </div>
        <Button 
          className="h-12 px-4"
          onClick={() => setCreateModalOpen(true)}
        >
          <Plus className="h-5 w-5 mr-2" />
          Nouvelle Demande d'Intervention
        </Button>
      </div>

      <CreateInterventionRequestModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onSubmit={handleCreateRequest}
      />

      {/* Recherche */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Rechercher une demande..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-12 h-14 text-base"
        />
      </div>

      {/* Stats rapides */}
      <div className="grid grid-cols-4 gap-2">
        <Card className="p-3 text-center">
          <div className="text-xl font-bold text-foreground">
            {interventionRequests.filter(r => r.status === 'pending').length}
          </div>
          <div className="text-xs text-muted-foreground">En attente</div>
        </Card>
        <Card className="p-3 text-center">
          <div className="text-xl font-bold text-blue-600">
            {interventionRequests.filter(r => r.status === 'assigned').length}
          </div>
          <div className="text-xs text-muted-foreground">Assignées</div>
        </Card>
        <Card className="p-3 text-center">
          <div className="text-xl font-bold text-purple-600">
            {interventionRequests.filter(r => r.status === 'in-progress').length}
          </div>
          <div className="text-xs text-muted-foreground">En cours</div>
        </Card>
        <Card className="p-3 text-center">
          <div className="text-xl font-bold text-green-600">
            {interventionRequests.filter(r => r.status === 'resolved').length}
          </div>
          <div className="text-xs text-muted-foreground">Résolues</div>
        </Card>
      </div>

      {/* Liste des demandes */}
      <div className="space-y-3">
        {filteredRequests.map((request) => {
          const priorityConfig = getPriorityConfig(request.priority);
          const statusConfig = getStatusConfig(request.status);
          
          return (
            <Card 
              key={request.id}
              className={cn(
                "p-4 border-l-4 cursor-pointer transition-all active:scale-[0.98] hover:shadow-md",
                priorityConfig.borderColor
              )}
              onClick={() => navigate(`/tablet/requests/${request.id}`)}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <Badge className={cn("text-xs", priorityConfig.className)}>
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      {priorityConfig.label}
                    </Badge>
                    <Badge className={cn("text-xs", statusConfig.className)}>
                      {statusConfig.label}
                    </Badge>
                    <span className="text-xs text-muted-foreground font-mono">{request.id}</span>
                  </div>
                  
                  <h3 className="font-semibold text-foreground text-lg">
                    {request.title}
                  </h3>
                  <p className="text-sm text-primary font-medium mt-1">{request.equipment}</p>
                  
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span className="truncate">{request.location}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {request.createdBy}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {request.createdAt}
                    </div>
                  </div>
                </div>
                
                <ChevronRight className="h-6 w-6 text-muted-foreground flex-shrink-0 mt-2" />
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
      </div>
    </div>
  );
};

export default TabletInterventionRequests;
