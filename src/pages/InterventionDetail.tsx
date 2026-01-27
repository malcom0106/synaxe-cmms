import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  ArrowLeft, 
  Clock, 
  Calendar,
  User,
  Wrench,
  Settings,
  FileText,
  MessageSquare,
  CheckCircle2,
  Play,
  Pencil,
  FileDown,
  Tablet,
  ChevronDown,
  ChevronRight,
  Timer
} from 'lucide-react';
import { cn } from '@/lib/utils';

type InterventionStatus = 'planifie' | 'en_cours' | 'termine' | 'en_retard';

interface MaintenanceAction {
  id: string;
  name: string;
  description: string;
  completedAt?: string;
  completedBy?: string;
  status: 'completed' | 'pending';
  variables?: { name: string; value: string }[];
  comment?: string;
}

interface InterventionData {
  id: string;
  equipment: string;
  equipmentId: string;
  gamme: string;
  gammeId: string;
  operator: string | null;
  plannedDate: string;
  executionDate: string | null;
  duration: string | null;
  status: InterventionStatus;
  createdAt: string;
  comment: string;
  actions: MaintenanceAction[];
}

const mockIntervention: InterventionData = {
  id: '#373',
  equipment: 'camion 793',
  equipmentId: 'EQ-793',
  gamme: 'Test camion Renault',
  gammeId: '8',
  operator: null,
  plannedDate: '29 octobre 2025',
  executionDate: '22 novembre 2025 à 15:40',
  duration: '2h 3min',
  status: 'en_cours',
  createdAt: '29 octobre 2025 à 18:12',
  comment: 'zéée',
  actions: [
    {
      id: 'a1',
      name: 'mon inspection x',
      description: 'test action avec champs complexe',
      completedAt: '30/12/2025 16:08:09',
      completedBy: 'Julien LEBLANC',
      status: 'completed',
      variables: [
        { name: 'teszté', value: '' },
        { name: '2e variable*', value: '-' }
      ]
    },
    {
      id: 'a2',
      name: 'Test sans result value m',
      description: 'Description Test sans result value',
      completedAt: '30/12/2025 16:08:17',
      completedBy: 'Julien LEBLANC',
      status: 'completed',
      variables: [
        { name: 'var test 1', value: '-' }
      ],
      comment: 'qqqq'
    },
    {
      id: 'a3',
      name: 'Test Crud 4',
      description: 'CRUD 4',
      completedAt: '12/01/2026 17:27:54',
      completedBy: 'Jacques MAZURIE',
      status: 'completed',
      variables: [
        { name: 'Ma 2e Variable', value: '5' },
        { name: 'Encore une variable*', value: '5' },
        { name: 'Presence', value: '-' }
      ],
      comment: 'zzzzz'
    }
  ]
};

const getStatusConfig = (status: InterventionStatus) => {
  switch (status) {
    case 'planifie':
      return { label: 'Planifié', className: 'bg-blue-100 text-blue-700', icon: Calendar };
    case 'en_cours':
      return { label: 'En cours', className: 'bg-orange-100 text-orange-700', icon: Play };
    case 'termine':
      return { label: 'Terminé', className: 'bg-green-100 text-green-700', icon: CheckCircle2 };
    case 'en_retard':
      return { label: 'En retard', className: 'bg-red-100 text-red-700', icon: Clock };
    default:
      return { label: status, className: 'bg-gray-100 text-gray-700', icon: Clock };
  }
};

const ActionCard: React.FC<{ action: MaintenanceAction; index: number }> = ({ action, index }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="border rounded-lg overflow-hidden">
      <CollapsibleTrigger className="w-full">
        <div className="flex items-center justify-between px-3 py-2 hover:bg-muted/30 transition-colors">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <span className="text-xs text-muted-foreground w-5">{index + 1}.</span>
            <div className={cn(
              "h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0",
              action.status === 'completed' ? "bg-green-100" : "bg-amber-100"
            )}>
              <CheckCircle2 className={cn(
                "h-3 w-3",
                action.status === 'completed' ? "text-green-600" : "text-amber-600"
              )} />
            </div>
            <span className="font-medium text-sm truncate">{action.name}</span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {action.completedAt && (
              <span className="text-xs text-muted-foreground hidden lg:block">
                {action.completedAt}
              </span>
            )}
            <Badge className={cn(
              "text-[10px] px-1.5 py-0",
              action.status === 'completed' 
                ? "bg-green-100 text-green-700 hover:bg-green-100" 
                : "bg-amber-100 text-amber-700 hover:bg-amber-100"
            )}>
              {action.status === 'completed' ? 'OK' : 'En attente'}
            </Badge>
            {isOpen ? <ChevronDown className="h-3 w-3 text-muted-foreground" /> : <ChevronRight className="h-3 w-3 text-muted-foreground" />}
          </div>
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="px-3 pb-2 pt-0 border-t bg-muted/10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 py-2">
            {action.variables && action.variables.length > 0 && (
              <div className="text-xs space-y-0.5">
                {action.variables.map((variable, idx) => (
                  <div key={idx} className="flex gap-1">
                    <span className="text-muted-foreground">{variable.name}:</span>
                    <span className="font-medium">{variable.value || '-'}</span>
                  </div>
                ))}
              </div>
            )}
            {action.comment && (
              <div className="text-xs">
                <span className="text-muted-foreground">Note: </span>
                <span>{action.comment}</span>
              </div>
            )}
          </div>
          {action.completedBy && (
            <div className="text-[10px] text-muted-foreground pt-1 border-t">
              Par {action.completedBy}
            </div>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

const InterventionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // In real app, fetch by id
  const intervention = mockIntervention;
  const statusConfig = getStatusConfig(intervention.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="p-6 space-y-6">
      {/* Header compact */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-foreground">Intervention {intervention.id}</h1>
              <Badge className={cn("text-xs", statusConfig.className)}>
                <StatusIcon className="h-3 w-3 mr-1" />
                {statusConfig.label}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-0.5">
              <Clock className="h-3.5 w-3.5" />
              Créée le {intervention.createdAt}
            </p>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Tablet className="h-4 w-4" />
            Accès tablette
          </Button>
          <Button size="sm" className="gap-2">
            <Play className="h-4 w-4" />
            Exécuter l'intervention
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Pencil className="h-4 w-4" />
            Modifier
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <FileDown className="h-4 w-4" />
            Aperçu du PDF
          </Button>
        </div>
      </div>

      {/* 3 cards in a row - optimized layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Informations générales */}
        <Card className="p-4">
          <h3 className="flex items-center gap-2 font-semibold text-foreground mb-3">
            <FileText className="h-4 w-4 text-primary" />
            Informations générales
          </h3>
          <div className="space-y-3 text-sm">
            <div>
              <span className="text-muted-foreground">Équipement</span>
              <p className="font-medium text-primary">{intervention.equipment}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Gamme de maintenance</span>
              <p className="font-medium text-primary">{intervention.gamme}</p>
              <span className="text-xs text-muted-foreground">ID Gamme: {intervention.gammeId}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Opérateur assigné</span>
              <p className="flex items-center gap-1.5 text-foreground">
                <User className="h-3.5 w-3.5" />
                {intervention.operator || 'Non attribué'}
              </p>
            </div>
          </div>
        </Card>

        {/* Planification et exécution */}
        <Card className="p-4">
          <h3 className="flex items-center gap-2 font-semibold text-foreground mb-3">
            <Calendar className="h-4 w-4 text-primary" />
            Planification et exécution
          </h3>
          <div className="space-y-3 text-sm">
            <div>
              <span className="text-muted-foreground">Date planifiée</span>
              <p className="flex items-center gap-1.5 font-medium">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                {intervention.plannedDate}
              </p>
            </div>
            {intervention.executionDate && (
              <div>
                <span className="text-muted-foreground">Date d'exécution</span>
                <p className="flex items-center gap-1.5 font-medium">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                  {intervention.executionDate}
                </p>
              </div>
            )}
            {intervention.duration && (
              <div>
                <span className="text-muted-foreground">Durée</span>
                <p className="flex items-center gap-1.5 font-medium">
                  <Timer className="h-3.5 w-3.5 text-muted-foreground" />
                  {intervention.duration}
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Commentaire */}
        <Card className="p-4">
          <h3 className="flex items-center gap-2 font-semibold text-foreground mb-3">
            <MessageSquare className="h-4 w-4 text-primary" />
            Commentaire
          </h3>
          <p className="text-sm text-foreground">
            {intervention.comment || <span className="text-muted-foreground italic">Aucun commentaire</span>}
          </p>
        </Card>
      </div>

      {/* Actions de maintenance - section compacte */}
      <Card className="p-4">
        <h3 className="flex items-center gap-2 font-semibold text-foreground mb-4">
          <Wrench className="h-4 w-4 text-primary" />
          Actions de maintenance ({intervention.actions.length})
        </h3>
        <div className="space-y-1">
          {intervention.actions.map((action, index) => (
            <ActionCard key={action.id} action={action} index={index} />
          ))}
        </div>
      </Card>
    </div>
  );
};

export default InterventionDetail;
