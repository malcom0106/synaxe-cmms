import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
  ArrowLeft, 
  AlertTriangle, 
  Clock, 
  User,
  Wrench,
  Stethoscope,
  X as XIcon,
  Camera,
  CheckCircle2,
  XCircle,
  FileText,
  ChevronRight,
  Search,
  Play,
  Pause,
  Plus,
  CalendarIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import RangeExecutionPanel from '@/components/tablet/RangeExecutionPanel';

type RequestStatus = 'ouverte' | 'assignee' | 'en_cours' | 'en_attente' | 'terminee' | 'annulee';

interface AssignmentInfo {
  rangeId: string;
  rangeName: string;
  date?: Date;
  time?: string;
  operator?: string;
}

interface InterventionRequest {
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
  assignedRange?: string;
  assignment?: AssignmentInfo;
  diagnostic?: string;
  cancelReason?: string;
}

interface MaintenanceStep {
  id: string;
  order: number;
  label: string;
  description: string;
  inputType: 'boolean' | 'numeric' | 'comment' | 'photo' | 'checkbox';
  required: boolean;
  unit?: string;
  minValue?: number;
  maxValue?: number;
  value: any;
  completed: boolean;
  remarks: string;
  stepComment: string;
  stepPhoto: string | null;
  completedAt?: string;
}

interface MaintenanceRange {
  id: string;
  name: string;
  code: string;
  family: string;
  frequency: string;
  estimatedTime: string;
  tasksCount: number;
  steps: MaintenanceStep[];
}

const operators = [
  'Jean Martin',
  'Sophie Bernard',
  'Pierre Lefebvre',
  'Marie Dubois',
  'Luc Moreau',
  'Anne Petit',
  'Marc Durand',
  'Claire Fontaine',
];

const maintenanceRanges: MaintenanceRange[] = [
  {
    id: 'GM001',
    name: 'Maintenance préventive mensuelle',
    code: 'MP-OLEO-M',
    family: 'Oléoserveur',
    frequency: 'Mensuel',
    estimatedTime: '2h',
    tasksCount: 8,
    steps: [
      { id: 's1', order: 1, label: 'Vérifier le niveau d\'huile', description: 'Contrôler le niveau dans le réservoir principal', inputType: 'boolean', required: true, value: null, completed: false, remarks: '', stepComment: '', stepPhoto: null },
      { id: 's2', order: 2, label: 'Relever la pression', description: 'Mesurer la pression du circuit hydraulique', inputType: 'numeric', required: true, unit: 'bar', minValue: 150, maxValue: 200, value: null, completed: false, remarks: '', stepComment: '', stepPhoto: null },
      { id: 's3', order: 3, label: 'Contrôler les connexions électriques', description: 'Vérifier visuellement l\'état des câbles', inputType: 'boolean', required: true, value: null, completed: false, remarks: '', stepComment: '', stepPhoto: null },
      { id: 's4', order: 4, label: 'Photo du compteur', description: 'Prendre une photo du compteur', inputType: 'photo', required: true, value: null, completed: false, remarks: '', stepComment: '', stepPhoto: null },
      { id: 's5', order: 5, label: 'Tester les capteurs de pression', description: 'Vérifier le bon fonctionnement des capteurs', inputType: 'boolean', required: true, value: null, completed: false, remarks: '', stepComment: '', stepPhoto: null },
      { id: 's6', order: 6, label: 'Nettoyer les filtres', description: 'Nettoyer ou remplacer si nécessaire', inputType: 'checkbox', required: true, value: null, completed: false, remarks: '', stepComment: '', stepPhoto: null },
      { id: 's7', order: 7, label: 'Vérifier l\'étanchéité', description: 'Contrôler l\'absence de fuites', inputType: 'boolean', required: true, value: null, completed: false, remarks: '', stepComment: '', stepPhoto: null },
      { id: 's8', order: 8, label: 'Observations générales', description: 'Noter toute observation', inputType: 'comment', required: false, value: null, completed: false, remarks: '', stepComment: '', stepPhoto: null },
    ],
  },
  {
    id: 'GM002',
    name: 'Contrôle visuel hebdomadaire',
    code: 'CV-POMP-H',
    family: 'Pompe',
    frequency: 'Hebdomadaire',
    estimatedTime: '30min',
    tasksCount: 5,
    steps: [
      { id: 's1', order: 1, label: 'Inspecter les joints', description: 'Vérifier l\'état des joints', inputType: 'boolean', required: true, value: null, completed: false, remarks: '', stepComment: '', stepPhoto: null },
      { id: 's2', order: 2, label: 'Écouter les bruits', description: 'Détecter tout bruit anormal', inputType: 'boolean', required: true, value: null, completed: false, remarks: '', stepComment: '', stepPhoto: null },
      { id: 's3', order: 3, label: 'Vérifier les vibrations', description: 'Contrôler les vibrations', inputType: 'boolean', required: true, value: null, completed: false, remarks: '', stepComment: '', stepPhoto: null },
      { id: 's4', order: 4, label: 'Contrôler la température', description: 'Vérifier la température', inputType: 'numeric', required: true, unit: '°C', minValue: 20, maxValue: 80, value: null, completed: false, remarks: '', stepComment: '', stepPhoto: null },
      { id: 's5', order: 5, label: 'Observations', description: 'Noter les observations', inputType: 'comment', required: false, value: null, completed: false, remarks: '', stepComment: '', stepPhoto: null },
    ],
  },
  {
    id: 'GM003',
    name: 'Calibration compteurs',
    code: 'CAL-COMP-T',
    family: 'Compteur',
    frequency: 'Trimestriel',
    estimatedTime: '1h30',
    tasksCount: 5,
    steps: [
      { id: 's1', order: 1, label: 'Préparer l\'équipement', description: 'Rassembler le matériel', inputType: 'checkbox', required: true, value: null, completed: false, remarks: '', stepComment: '', stepPhoto: null },
      { id: 's2', order: 2, label: 'Relever valeur initiale', description: 'Noter la valeur avant calibration', inputType: 'numeric', required: true, unit: 'L/min', value: null, completed: false, remarks: '', stepComment: '', stepPhoto: null },
      { id: 's3', order: 3, label: 'Effectuer la calibration', description: 'Suivre la procédure', inputType: 'boolean', required: true, value: null, completed: false, remarks: '', stepComment: '', stepPhoto: null },
      { id: 's4', order: 4, label: 'Relever valeur finale', description: 'Noter la valeur après', inputType: 'numeric', required: true, unit: 'L/min', value: null, completed: false, remarks: '', stepComment: '', stepPhoto: null },
      { id: 's5', order: 5, label: 'Commentaire de validation', description: 'Décrire le résultat', inputType: 'comment', required: true, value: null, completed: false, remarks: '', stepComment: '', stepPhoto: null },
    ],
  },
];

const mockRequests: Record<string, InterventionRequest> = {
  'DI001': {
    id: 'DI001',
    title: 'Fuite détectée sur raccord B2',
    equipment: 'Oléoserveur 201',
    equipmentCode: 'EQ001',
    location: 'Zone A - Bâtiment principal',
    description: 'Fuite d\'huile légère détectée lors de la maintenance préventive. Le raccord semble usé et nécessite une intervention.',
    priority: 'high',
    status: 'ouverte',
    createdBy: 'Jean Martin',
    createdAt: '04/12/2025 08:45'
  },
  'DI002': {
    id: 'DI002',
    title: 'Bruit anormal pompe',
    equipment: 'Pompe principale Zone A',
    equipmentCode: 'EQ015',
    location: 'Zone A - Station de pompage',
    description: 'Vibrations et bruit inhabituel lors du fonctionnement',
    priority: 'critical',
    status: 'en_cours',
    createdBy: 'Sophie Bernard',
    createdAt: '03/12/2025 14:20',
    assignedRange: 'GM002'
  },
  'DI003': {
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
  'DI004': {
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
  'DI005': {
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
  'DI006': {
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
  'DI007': {
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
  'DI008': {
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

const getStatusConfig = (status: RequestStatus) => {
  switch (status) {
    case 'ouverte':
      return { label: 'Ouverte', className: 'bg-blue-100 text-blue-800', icon: AlertTriangle };
    case 'assignee':
      return { label: 'Assignée', className: 'bg-indigo-100 text-indigo-800', icon: FileText };
    case 'en_cours':
      return { label: 'En cours', className: 'bg-purple-100 text-purple-800', icon: Play };
    case 'en_attente':
      return { label: 'En attente', className: 'bg-amber-100 text-amber-800', icon: Pause };
    case 'terminee':
      return { label: 'Terminée', className: 'bg-green-100 text-green-800', icon: CheckCircle2 };
    case 'annulee':
      return { label: 'Annulée', className: 'bg-gray-100 text-gray-800', icon: XCircle };
    default:
      return { label: status, className: 'bg-gray-100 text-gray-800', icon: AlertTriangle };
  }
};

const InterventionRequestDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [request, setRequest] = useState<InterventionRequest | null>(
    id ? mockRequests[id] || null : null
  );
  
  // Modal states
  const [rangeModalOpen, setRangeModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [diagnosticModalOpen, setDiagnosticModalOpen] = useState(false);
  const [finishModalOpen, setFinishModalOpen] = useState(false);
  const [executingRange, setExecutingRange] = useState<MaintenanceRange | null>(null);
  
  // Range selection states
  const [selectedRange, setSelectedRange] = useState<MaintenanceRange | null>(null);
  const [rangeModalStep, setRangeModalStep] = useState<'select' | 'actions' | 'assign'>('select');
  const [assignmentDate, setAssignmentDate] = useState<Date | undefined>(undefined);
  const [assignmentTime, setAssignmentTime] = useState<string>('');
  const [assignmentOperator, setAssignmentOperator] = useState<string>('');
  
  // Form states
  const [cancelComment, setCancelComment] = useState('');
  const [cancelPhoto, setCancelPhoto] = useState<string | null>(null);
  const [diagnosticComment, setDiagnosticComment] = useState('');
  const [diagnosticPhoto, setDiagnosticPhoto] = useState<string | null>(null);
  const [rangeSearchQuery, setRangeSearchQuery] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const diagnosticFileInputRef = useRef<HTMLInputElement>(null);

  if (!request) {
    return (
      <div className="p-6">
        <Button variant="ghost" onClick={() => navigate('/intervention-requests')}>
          <ArrowLeft className="h-5 w-5 mr-2" />
          Retour
        </Button>
        <Card className="p-8 text-center mt-4">
          <AlertTriangle className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground">Demande non trouvée</p>
        </Card>
      </div>
    );
  }

  const priorityConfig = getPriorityConfig(request.priority);
  const statusConfig = getStatusConfig(request.status);
  const StatusIcon = statusConfig.icon;

  const filteredRanges = maintenanceRanges.filter(range =>
    range.name.toLowerCase().includes(rangeSearchQuery.toLowerCase()) ||
    range.code.toLowerCase().includes(rangeSearchQuery.toLowerCase())
  );

  const handlePhotoCapture = (
    e: React.ChangeEvent<HTMLInputElement>, 
    setPhoto: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectRange = (range: MaintenanceRange) => {
    setSelectedRange(range);
    setRangeModalStep('actions');
  };

  const handleStartExecution = () => {
    if (!selectedRange) return;
    setRangeModalOpen(false);
    setExecutingRange(selectedRange);
    setRequest({ ...request, assignedRange: selectedRange.id, status: 'en_cours' });
    resetRangeModal();
    toast.success(`Exécution de la gamme "${selectedRange.name}" démarrée`);
  };

  const handleAssignRange = () => {
    if (!selectedRange) return;
    
    const assignment: AssignmentInfo = {
      rangeId: selectedRange.id,
      rangeName: selectedRange.name,
      date: assignmentDate,
      time: assignmentTime || undefined,
      operator: assignmentOperator || undefined,
    };
    
    setRequest({ 
      ...request, 
      assignedRange: selectedRange.id, 
      assignment,
      status: 'assignee' 
    });
    setRangeModalOpen(false);
    resetRangeModal();
    toast.success(`Intervention assignée avec la gamme "${selectedRange.name}"`);
  };

  const handleStartAssignedIntervention = () => {
    if (!request.assignment) return;
    const range = maintenanceRanges.find(r => r.id === request.assignment?.rangeId);
    if (range) {
      setExecutingRange(range);
      setRequest({ ...request, status: 'en_cours' });
    }
  };

  const resetRangeModal = () => {
    setSelectedRange(null);
    setRangeModalStep('select');
    setAssignmentDate(undefined);
    setAssignmentTime('');
    setAssignmentOperator('');
    setRangeSearchQuery('');
  };

  const handleRangeModalClose = () => {
    setRangeModalOpen(false);
    resetRangeModal();
  };

  const handleRangeExecutionComplete = () => {
    setExecutingRange(null);
    setRequest({ ...request, status: 'terminee' });
    toast.success('Intervention terminée avec succès');
  };

  const handleRangeExecutionCancel = () => {
    setExecutingRange(null);
  };

  const handleStartDiagnostic = () => {
    if (!diagnosticComment.trim()) {
      toast.error('Veuillez saisir un commentaire de diagnostic');
      return;
    }
    setRequest({ 
      ...request, 
      status: 'en_cours', 
      diagnostic: diagnosticComment 
    });
    setDiagnosticModalOpen(false);
    setDiagnosticComment('');
    setDiagnosticPhoto(null);
    toast.success('Diagnostic enregistré');
  };

  const handleCancel = () => {
    if (!cancelComment.trim()) {
      toast.error('Veuillez saisir un commentaire de justification');
      return;
    }
    setRequest({ 
      ...request, 
      status: 'annulee', 
      cancelReason: cancelComment 
    });
    setCancelModalOpen(false);
    setCancelComment('');
    setCancelPhoto(null);
    toast.success('Demande annulée');
  };

  const handleFinish = () => {
    setRequest({ ...request, status: 'terminee' });
    setFinishModalOpen(false);
    toast.success('Demande d\'intervention terminée');
  };

  const canFinish = (request.status === 'en_cours' || request.status === 'en_attente') && (request.assignedRange || request.diagnostic);
  const canPerformActions = request.status === 'ouverte' || request.status === 'en_cours' || request.status === 'en_attente' || request.status === 'assignee';
  const canPutOnHold = request.status === 'en_cours';

  const handlePutOnHold = () => {
    setRequest({ ...request, status: 'en_attente' });
    toast.success('Demande mise en attente');
  };

  const handleResumeWork = () => {
    setRequest({ ...request, status: 'en_cours' });
    toast.success('Travail repris');
  };

  // If executing a range, show the execution panel
  if (executingRange) {
    return (
      <div className="p-6">
        <RangeExecutionPanel
          range={executingRange}
          onComplete={handleRangeExecutionComplete}
          onCancel={handleRangeExecutionCancel}
        />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 flex flex-col min-h-[calc(100vh-2rem)]">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/intervention-requests')} className="mt-1">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-mono text-muted-foreground">{request.id}</span>
            <Badge className={cn("text-xs", priorityConfig.className)}>
              <AlertTriangle className="h-3 w-3 mr-1" />
              {priorityConfig.label}
            </Badge>
            <Badge className={cn("text-xs", statusConfig.className)}>
              <StatusIcon className="h-3 w-3 mr-1" />
              {statusConfig.label}
            </Badge>
          </div>
          <h1 className="text-2xl font-bold text-foreground mt-1">{request.title}</h1>
        </div>
        
        {/* Actions principales */}
        {canPerformActions && request.status !== 'annulee' && (
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button 
              onClick={() => setRangeModalOpen(true)}
              className="gap-2"
            >
              <FileText className="h-4 w-4" />
              Assigner une gamme
            </Button>

            <Button 
              variant="outline"
              onClick={() => setDiagnosticModalOpen(true)}
              className="gap-2 border-purple-500/30 hover:bg-purple-500/10"
            >
              <Stethoscope className="h-4 w-4 text-purple-600" />
              Réaliser un diagnostic
            </Button>
          </div>
        )}
      </div>

      {/* Contenu principal */}
      <div className="flex-1 space-y-4">
        {/* Informations */}
        <Card className="p-4 space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <Wrench className="h-5 w-5 text-primary" />
            <div>
              <p className="font-medium text-foreground">{request.equipment}</p>
              <p className="text-muted-foreground">{request.equipmentCode}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 text-sm">
            <User className="h-5 w-5 text-muted-foreground" />
            <span className="text-muted-foreground">{request.createdBy}</span>
          </div>
          
          <div className="flex items-center gap-3 text-sm">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <span className="text-muted-foreground">{request.createdAt}</span>
          </div>
        </Card>

        {/* Description */}
        <Card className="p-4">
          <h3 className="font-medium text-foreground mb-2">Description</h3>
          <p className="text-sm text-muted-foreground">{request.description}</p>
        </Card>

        {/* Assigned range/intervention if exists */}
        {request.assignment && (
          <Card className="p-4 border-primary/20 bg-primary/5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-primary">
                <FileText className="h-5 w-5" />
                <span className="font-medium">Intervention assignée</span>
              </div>
              {request.status === 'assignee' && (
                <Button 
                  size="sm"
                  onClick={handleStartAssignedIntervention}
                  className="gap-2"
                >
                  <Play className="h-4 w-4" />
                  Démarrer l'intervention
                </Button>
              )}
            </div>
            <p className="text-sm font-medium text-foreground mb-2">
              {request.assignment.rangeName}
            </p>
            <div className="grid grid-cols-3 gap-3 text-xs">
              {request.assignment.date && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <CalendarIcon className="h-3 w-3" />
                  <span>{format(request.assignment.date, 'dd/MM/yyyy', { locale: fr })}</span>
                </div>
              )}
              {request.assignment.time && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{request.assignment.time}</span>
                </div>
              )}
              {request.assignment.operator && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <User className="h-3 w-3" />
                  <span>{request.assignment.operator}</span>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Assigned range without full assignment info (legacy) */}
        {request.assignedRange && !request.assignment && (
          <Card className="p-4 border-primary/20 bg-primary/5">
            <div className="flex items-center gap-2 text-primary mb-2">
              <FileText className="h-5 w-5" />
              <span className="font-medium">Gamme assignée</span>
            </div>
            <p className="text-sm text-foreground">
              {maintenanceRanges.find(r => r.id === request.assignedRange)?.name || request.assignedRange}
            </p>
          </Card>
        )}

        {/* Diagnostic if exists */}
        {request.diagnostic && (
          <Card className="p-4 border-purple-500/20 bg-purple-500/5">
            <div className="flex items-center gap-2 text-purple-600 mb-2">
              <Stethoscope className="h-5 w-5" />
              <span className="font-medium">Diagnostic réalisé</span>
            </div>
            <p className="text-sm text-foreground">{request.diagnostic}</p>
          </Card>
        )}

        {/* Cancel reason if exists */}
        {request.cancelReason && (
          <Card className="p-4 border-destructive/20 bg-destructive/5">
            <div className="flex items-center gap-2 text-destructive mb-2">
              <XCircle className="h-5 w-5" />
              <span className="font-medium">Raison d'annulation</span>
            </div>
            <p className="text-sm text-foreground">{request.cancelReason}</p>
          </Card>
        )}
      </div>

      {/* Actions secondaires en bas à droite */}
      {canPerformActions && request.status !== 'annulee' && (
        <div className="sticky bottom-4 bg-background border border-border rounded-lg p-4 shadow-lg">
          <div className="flex items-center justify-end gap-3">
            {canPutOnHold && (
              <Button 
                variant="outline"
                onClick={handlePutOnHold}
                className="gap-2 border-amber-500/30 hover:bg-amber-500/10"
              >
                <Pause className="h-4 w-4 text-amber-600" />
                Mettre en attente
              </Button>
            )}

            {request.status === 'en_attente' && (
              <Button 
                onClick={handleResumeWork}
                className="gap-2 bg-purple-600 hover:bg-purple-700"
              >
                <Play className="h-4 w-4" />
                Reprendre
              </Button>
            )}

            <Button 
              variant="outline"
              onClick={() => setCancelModalOpen(true)}
              className="gap-2 border-destructive/30 hover:bg-destructive/10"
            >
              <XCircle className="h-4 w-4 text-destructive" />
              Annuler la demande
            </Button>

            {canFinish && (
              <Button 
                className="gap-2 bg-green-600 hover:bg-green-700"
                onClick={() => setFinishModalOpen(true)}
              >
                <CheckCircle2 className="h-4 w-4" />
                Terminer la demande
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Modal: Sélection de gamme */}
      <Dialog open={rangeModalOpen} onOpenChange={handleRangeModalClose}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {rangeModalStep === 'select' && 'Assigner une gamme de maintenance'}
              {rangeModalStep === 'actions' && `Gamme sélectionnée : ${selectedRange?.name}`}
              {rangeModalStep === 'assign' && 'Planifier l\'intervention'}
            </DialogTitle>
          </DialogHeader>
          
          {/* Step 1: Select range */}
          {rangeModalStep === 'select' && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher une gamme..."
                    value={rangeSearchQuery}
                    onChange={(e) => setRangeSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button 
                  variant="outline"
                  onClick={() => {
                    handleRangeModalClose();
                    navigate('/maintenance/ranges/new');
                  }}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Créer une gamme
                </Button>
              </div>
              
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredRanges.map((range) => (
                  <Card 
                    key={range.id}
                    className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => handleSelectRange(range)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">{range.name}</p>
                        <p className="text-sm text-muted-foreground">{range.code} • {range.family}</p>
                        <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                          <span>{range.frequency}</span>
                          <span>{range.estimatedTime}</span>
                          <span>{range.tasksCount} tâches</span>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Choose action */}
          {rangeModalStep === 'actions' && selectedRange && (
            <div className="space-y-4 py-4">
              <Card className="p-4 bg-muted/30">
                <p className="font-medium text-foreground">{selectedRange.name}</p>
                <p className="text-sm text-muted-foreground">{selectedRange.code} • {selectedRange.family}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                  <span>{selectedRange.frequency}</span>
                  <span>{selectedRange.estimatedTime}</span>
                  <span>{selectedRange.tasksCount} tâches</span>
                </div>
              </Card>

              <div className="flex flex-col gap-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start h-14"
                  onClick={() => {
                    setRangeModalStep('select');
                    setSelectedRange(null);
                  }}
                >
                  <ArrowLeft className="h-4 w-4 mr-3" />
                  Annuler et choisir une autre gamme
                </Button>
                
                <Button 
                  variant="outline"
                  className="w-full justify-start h-14 border-primary/30 hover:bg-primary/10"
                  onClick={() => setRangeModalStep('assign')}
                >
                  <CalendarIcon className="h-4 w-4 mr-3 text-primary" />
                  Assigner l'intervention (planifier pour plus tard)
                </Button>
                
                <Button 
                  className="w-full justify-start h-14 bg-green-600 hover:bg-green-700"
                  onClick={handleStartExecution}
                >
                  <Play className="h-4 w-4 mr-3" />
                  Démarrer l'intervention maintenant
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Assignment form */}
          {rangeModalStep === 'assign' && selectedRange && (
            <div className="space-y-4 py-4">
              <Card className="p-3 bg-muted/30">
                <p className="font-medium text-foreground text-sm">{selectedRange.name}</p>
                <p className="text-xs text-muted-foreground">{selectedRange.code}</p>
              </Card>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Date d'intervention</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !assignmentDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {assignmentDate ? format(assignmentDate, 'PPP', { locale: fr }) : 'Sélectionner une date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={assignmentDate}
                        onSelect={setAssignmentDate}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>Heure d'intervention</Label>
                  <Input
                    type="time"
                    value={assignmentTime}
                    onChange={(e) => setAssignmentTime(e.target.value)}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Opérateur</Label>
                  <Select value={assignmentOperator} onValueChange={setAssignmentOperator}>
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Sélectionner un opérateur" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Non assigné</SelectItem>
                      {operators.map((op) => (
                        <SelectItem key={op} value={op}>{op}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setRangeModalStep('actions')}
                >
                  Retour
                </Button>
                <Button 
                  className="flex-1"
                  onClick={handleAssignRange}
                >
                  Assigner l'intervention
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal: Diagnostic */}
      <Dialog open={diagnosticModalOpen} onOpenChange={setDiagnosticModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Stethoscope className="h-5 w-5 text-purple-600" />
              Réaliser un diagnostic
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Commentaire de diagnostic *</Label>
              <Textarea
                placeholder="Décrivez le diagnostic..."
                value={diagnosticComment}
                onChange={(e) => setDiagnosticComment(e.target.value)}
                rows={4}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Photo (optionnel)</Label>
              {diagnosticPhoto ? (
                <div className="relative">
                  <img src={diagnosticPhoto} alt="Diagnostic" className="w-full h-32 object-cover rounded-lg" />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => setDiagnosticPhoto(null)}
                  >
                    <XIcon className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => diagnosticFileInputRef.current?.click()}
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Prendre une photo
                </Button>
              )}
              <input
                ref={diagnosticFileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={(e) => handlePhotoCapture(e, setDiagnosticPhoto)}
                className="hidden"
              />
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setDiagnosticModalOpen(false)}>
              Annuler
            </Button>
            <Button className="flex-1" onClick={handleStartDiagnostic}>
              Valider le diagnostic
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal: Annulation */}
      <Dialog open={cancelModalOpen} onOpenChange={setCancelModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <XCircle className="h-5 w-5" />
              Annuler la demande
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Motif d'annulation *</Label>
              <Textarea
                placeholder="Justifiez l'annulation..."
                value={cancelComment}
                onChange={(e) => setCancelComment(e.target.value)}
                rows={4}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Photo (optionnel)</Label>
              {cancelPhoto ? (
                <div className="relative">
                  <img src={cancelPhoto} alt="Justification" className="w-full h-32 object-cover rounded-lg" />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => setCancelPhoto(null)}
                  >
                    <XIcon className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Prendre une photo
                </Button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={(e) => handlePhotoCapture(e, setCancelPhoto)}
                className="hidden"
              />
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setCancelModalOpen(false)}>
              Retour
            </Button>
            <Button variant="destructive" className="flex-1" onClick={handleCancel}>
              Confirmer l'annulation
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal: Terminer */}
      <Dialog open={finishModalOpen} onOpenChange={setFinishModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle2 className="h-5 w-5" />
              Terminer la demande
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <p className="text-muted-foreground">
              Êtes-vous sûr de vouloir marquer cette demande d'intervention comme terminée ?
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setFinishModalOpen(false)}>
              Annuler
            </Button>
            <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={handleFinish}>
              Confirmer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InterventionRequestDetail;
