import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PageTitle } from '@/components/ui/PageTitle';
import { 
  Search, 
  Plus, 
  AlertTriangle, 
  Clock, 
  User
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { CreateInterventionRequestModal } from '@/components/tablet/CreateInterventionRequestModal';
import { toast } from 'sonner';

export type RequestStatus = 'ouverte' | 'assignee' | 'en_cours' | 'en_attente' | 'terminee' | 'annulee';

export interface InterventionRequest {
  id: string;
  title: string;
  equipment: string;
  equipmentCode: string;
  location: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: RequestStatus;
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
    status: 'ouverte',
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
    status: 'assignee',
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
    status: 'en_cours',
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
    status: 'terminee',
    createdBy: 'Marie Dubois',
    createdAt: '01/12/2025 16:30'
  },
  {
    id: 'DI005',
    title: 'Capteur pression défaillant',
    equipment: 'Capteur P-102',
    equipmentCode: 'EQ045',
    location: 'Zone C - Contrôle',
    description: 'Capteur donnant des valeurs erratiques',
    priority: 'high',
    status: 'en_attente',
    createdBy: 'Luc Moreau',
    createdAt: '02/12/2025 14:00'
  },
  {
    id: 'DI006',
    title: 'Courroie usée ventilateur',
    equipment: 'Ventilateur V-301',
    equipmentCode: 'EQ056',
    location: 'Zone D - Ventilation',
    description: 'Courroie présentant des signes d\'usure avancée',
    priority: 'medium',
    status: 'ouverte',
    createdBy: 'Anne Petit',
    createdAt: '05/12/2025 09:30'
  },
  {
    id: 'DI007',
    title: 'Fuite hydraulique vérin',
    equipment: 'Vérin hydraulique H-12',
    equipmentCode: 'EQ078',
    location: 'Zone A - Poste levage',
    description: 'Fuite hydraulique détectée sur le joint du vérin',
    priority: 'critical',
    status: 'en_cours',
    createdBy: 'Marc Durand',
    createdAt: '04/12/2025 11:00'
  },
  {
    id: 'DI008',
    title: 'Thermostat défaillant',
    equipment: 'Chaudière CH-01',
    equipmentCode: 'EQ089',
    location: 'Zone B - Chaufferie',
    description: 'Thermostat ne régule plus correctement la température',
    priority: 'high',
    status: 'assignee',
    createdBy: 'Claire Fontaine',
    createdAt: '03/12/2025 16:45'
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

const getStatusConfig = (status: RequestStatus) => {
  switch (status) {
    case 'ouverte':
      return { label: 'Ouverte', className: 'bg-blue-100 text-blue-800' };
    case 'assignee':
      return { label: 'Assignée', className: 'bg-indigo-100 text-indigo-800' };
    case 'en_cours':
      return { label: 'En cours', className: 'bg-purple-100 text-purple-800' };
    case 'en_attente':
      return { label: 'En attente', className: 'bg-amber-100 text-amber-800' };
    case 'terminee':
      return { label: 'Terminée', className: 'bg-green-100 text-green-800' };
    case 'annulee':
      return { label: 'Annulée', className: 'bg-gray-100 text-gray-800' };
    default:
      return { label: status, className: 'bg-gray-100 text-gray-800' };
  }
};

interface KanbanColumnProps {
  title: string;
  status: RequestStatus;
  requests: InterventionRequest[];
  onCardClick: (id: string) => void;
  headerColor: string;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ title, requests, onCardClick, headerColor }) => {
  return (
    <div className="flex flex-col h-full min-w-0">
      <div className={cn("p-3 rounded-t-lg font-semibold text-sm", headerColor)}>
        {title} ({requests.length})
      </div>
      <div className="flex-1 bg-muted/30 rounded-b-lg p-2 space-y-2 overflow-y-auto">
        {requests.map((request) => {
          const priorityConfig = getPriorityConfig(request.priority);
          return (
            <Card 
              key={request.id}
              className={cn(
                "p-3 border-l-4 cursor-pointer transition-all hover:shadow-md",
                priorityConfig.borderColor
              )}
              onClick={() => onCardClick(request.id)}
            >
              <div className="space-y-2">
                <div className="flex items-center gap-1 flex-wrap">
                  <Badge className={cn("text-xs", priorityConfig.className)}>
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    {priorityConfig.label}
                  </Badge>
                  <span className="text-xs text-muted-foreground font-mono">{request.id}</span>
                </div>
                
                <h3 className="font-medium text-foreground text-sm line-clamp-2">
                  {request.title}
                </h3>
                <p className="text-xs text-primary font-medium truncate">{request.equipment}</p>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    <span className="truncate max-w-16">{request.createdBy}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{request.createdAt.split(' ')[0]}</span>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}

        {requests.length === 0 && (
          <div className="text-center text-xs text-muted-foreground py-4">
            Aucune demande
          </div>
        )}
      </div>
    </div>
  );
};

const InterventionRequests: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [requests, setRequests] = useState(interventionRequests);

  // Filter out completed requests and apply search
  const activeRequests = requests.filter(r => 
    r.status !== 'terminee' && r.status !== 'annulee'
  );

  const filteredRequests = activeRequests.filter(request =>
    request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    request.equipment.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group by status for Kanban columns
  const ouvertes = filteredRequests.filter(r => r.status === 'ouverte');
  const assignees = filteredRequests.filter(r => r.status === 'assignee');
  const enCours = filteredRequests.filter(r => r.status === 'en_cours');
  const enAttente = filteredRequests.filter(r => r.status === 'en_attente');

  // Stats (on all requests)
  const statsOuvertes = requests.filter(r => r.status === 'ouverte').length;
  const statsAssignees = requests.filter(r => r.status === 'assignee').length;
  const statsEnCours = requests.filter(r => r.status === 'en_cours').length;
  const statsTerminees = requests.filter(r => r.status === 'terminee').length;

  const handleCreateRequest = (data: {
    title: string;
    description: string;
    equipmentId: string;
    equipmentName: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    photo?: string;
  }) => {
    const newRequest: InterventionRequest = {
      id: `DI${String(requests.length + 1).padStart(3, '0')}`,
      title: data.title,
      equipment: data.equipmentName,
      equipmentCode: data.equipmentId,
      location: 'Zone à définir',
      description: data.description,
      priority: data.priority,
      status: 'ouverte',
      createdBy: 'Adélaïde Brunin',
      createdAt: new Date().toLocaleString('fr-FR', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
    };
    setRequests([newRequest, ...requests]);
    toast.success('Demande d\'Intervention créée avec succès');
  };

  const handleCardClick = (id: string) => {
    navigate(`/intervention-requests/${id}`);
  };

  return (
    <div className="p-6 space-y-6 h-full flex flex-col">
      <PageTitle 
        title="Demandes d'Intervention" 
        subtitle="Anomalies et demandes signalées"
        action={
          <Button onClick={() => setCreateModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle Demande d'Intervention
          </Button>
        }
      />

      <CreateInterventionRequestModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onSubmit={handleCreateRequest}
      />

      {/* Recherche */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher une demande..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Stats rapides */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {statsOuvertes}
          </div>
          <div className="text-sm text-muted-foreground">Ouvertes</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-indigo-600">
            {statsAssignees}
          </div>
          <div className="text-sm text-muted-foreground">Assignées</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">
            {statsEnCours}
          </div>
          <div className="text-sm text-muted-foreground">En cours</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {statsTerminees}
          </div>
          <div className="text-sm text-muted-foreground">Résolues</div>
        </Card>
      </div>

      {/* Kanban columns */}
      <div className="flex-1 grid grid-cols-4 gap-4 min-h-0">
        <KanbanColumn
          title="Nouvelles"
          status="ouverte"
          requests={ouvertes}
          onCardClick={handleCardClick}
          headerColor="bg-blue-100 text-blue-800"
        />
        <KanbanColumn
          title="Assignées"
          status="assignee"
          requests={assignees}
          onCardClick={handleCardClick}
          headerColor="bg-indigo-100 text-indigo-800"
        />
        <KanbanColumn
          title="En cours"
          status="en_cours"
          requests={enCours}
          onCardClick={handleCardClick}
          headerColor="bg-purple-100 text-purple-800"
        />
        <KanbanColumn
          title="En attente"
          status="en_attente"
          requests={enAttente}
          onCardClick={handleCardClick}
          headerColor="bg-amber-100 text-amber-800"
        />
      </div>
    </div>
  );
};

export default InterventionRequests;
