import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  User, 
  Wrench,
  MapPin,
  Camera,
  MessageSquare,
  CheckCircle2,
  PlayCircle,
  PauseCircle,
  Lock,
  Hash,
  ToggleLeft,
  FileText,
  Image,
  ChevronLeft,
  ChevronRight,
  Check,
  Pen,
  Download,
  Printer
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

// Types pour les étapes
type StepInputType = 'boolean' | 'numeric' | 'comment' | 'photo' | 'checkbox';

interface InterventionStep {
  id: string;
  order: number;
  label: string;
  description: string;
  inputType: StepInputType;
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

interface InterventionData {
  id: string;
  equipment: string;
  equipmentCode: string;
  location: string;
  gamme: string;
  description: string;
  assignedTo: string;
  plannedDate: string;
  plannedTime: string;
  status: 'planned' | 'in-progress' | 'paused' | 'completed' | 'locked';
  priority: string;
  steps: InterventionStep[];
  comments: { user: string; date: string; text: string }[];
  photos: string[];
  startedAt?: string;
  pausedAt?: string;
  completedAt?: string;
  signature?: string;
}

// Données de démonstration enrichies
const interventionData: Record<string, InterventionData> = {
  'INT001': {
    id: 'INT001',
    equipment: 'Oléoserveur 201',
    equipmentCode: 'EQ001',
    location: 'Zone A - Bâtiment principal',
    gamme: 'Maintenance préventive mensuelle',
    description: 'Vérification complète du système oléohydraulique incluant le contrôle des niveaux, la vérification des connexions et le test des capteurs.',
    assignedTo: 'Jean Martin',
    plannedDate: '04/12/2025',
    plannedTime: '08:00',
    status: 'completed',
    priority: 'medium',
    startedAt: '04/12/2025 08:15',
    completedAt: '04/12/2025 10:30',
    steps: [
      { id: 's1', order: 1, label: 'Vérifier le niveau d\'huile', description: 'Contrôler le niveau dans le réservoir principal. Le niveau doit être entre MIN et MAX.', inputType: 'boolean', required: true, value: true, completed: true, remarks: '', stepComment: '', stepPhoto: null, completedAt: '08:20' },
      { id: 's2', order: 2, label: 'Relever la pression', description: 'Mesurer la pression du circuit hydraulique en bar.', inputType: 'numeric', required: true, unit: 'bar', minValue: 150, maxValue: 200, value: 175, completed: true, remarks: 'Pression nominale', stepComment: '', stepPhoto: null, completedAt: '08:35' },
      { id: 's3', order: 3, label: 'Contrôler les connexions électriques', description: 'Vérifier visuellement l\'état des câbles et connexions.', inputType: 'boolean', required: true, value: true, completed: true, remarks: '', stepComment: '', stepPhoto: null, completedAt: '08:50' },
      { id: 's4', order: 4, label: 'Photo du compteur', description: 'Prendre une photo du compteur pour archivage.', inputType: 'photo', required: true, value: 'photo_compteur.jpg', completed: true, remarks: '', stepComment: '', stepPhoto: 'photo_compteur.jpg', completedAt: '09:00' },
      { id: 's5', order: 5, label: 'Observations générales', description: 'Noter toute observation ou anomalie constatée.', inputType: 'comment', required: false, value: 'RAS - Équipement en bon état général', completed: true, remarks: '', stepComment: '', stepPhoto: null, completedAt: '09:15' },
    ],
    comments: [],
    photos: ['photo_compteur.jpg']
  },
  'INT002': {
    id: 'INT002',
    equipment: 'Pompe principale Zone A',
    equipmentCode: 'EQ015',
    location: 'Zone A - Station de pompage',
    gamme: 'Contrôle visuel',
    description: 'Inspection visuelle de la pompe principale pour détecter tout signe d\'usure ou de dysfonctionnement.',
    assignedTo: 'Jean Martin',
    plannedDate: '04/12/2025',
    plannedTime: '10:30',
    status: 'paused',
    priority: 'high',
    startedAt: '04/12/2025 10:45',
    pausedAt: '04/12/2025 11:00',
    steps: [
      { id: 's1', order: 1, label: 'Inspecter les joints', description: 'Vérifier l\'état des joints d\'étanchéité. Signaler tout signe d\'usure ou de fuite.', inputType: 'boolean', required: true, value: true, completed: true, remarks: 'Joint principal OK', stepComment: 'Aucune fuite visible', stepPhoto: null, completedAt: '10:50' },
      { id: 's2', order: 2, label: 'Mesurer les vibrations', description: 'Utiliser le vibromètre pour mesurer les vibrations en mm/s.', inputType: 'numeric', required: true, unit: 'mm/s', minValue: 0, maxValue: 10, value: null, completed: false, remarks: '', stepComment: '', stepPhoto: null },
      { id: 's3', order: 3, label: 'Relever la température', description: 'Mesurer la température de fonctionnement en °C.', inputType: 'numeric', required: true, unit: '°C', minValue: 20, maxValue: 80, value: null, completed: false, remarks: '', stepComment: '', stepPhoto: null },
      { id: 's4', order: 4, label: 'Vérifier les fixations', description: 'Contrôler le serrage de toutes les fixations.', inputType: 'checkbox', required: true, value: false, completed: false, remarks: '', stepComment: '', stepPhoto: null },
      { id: 's5', order: 5, label: 'Photo de la pompe', description: 'Documenter l\'état visuel de la pompe.', inputType: 'photo', required: false, value: null, completed: false, remarks: '', stepComment: '', stepPhoto: null },
    ],
    comments: [],
    photos: []
  },
  'INT003': {
    id: 'INT003',
    equipment: 'Compteur Zone 1',
    equipmentCode: 'EQ008',
    location: 'Zone 1 - Point de distribution',
    gamme: 'Calibration',
    description: 'Calibration du compteur de débit selon les procédures standards.',
    assignedTo: 'Jean Martin',
    plannedDate: '04/12/2025',
    plannedTime: '14:00',
    status: 'planned',
    priority: 'medium',
    steps: [
      { id: 's1', order: 1, label: 'Préparer l\'équipement', description: 'Rassembler le matériel de calibration nécessaire.', inputType: 'checkbox', required: true, value: false, completed: false, remarks: '', stepComment: '', stepPhoto: null },
      { id: 's2', order: 2, label: 'Relever valeur initiale', description: 'Noter la valeur affichée avant calibration.', inputType: 'numeric', required: true, unit: 'L/min', value: null, completed: false, remarks: '', stepComment: '', stepPhoto: null },
      { id: 's3', order: 3, label: 'Effectuer la calibration', description: 'Suivre la procédure de calibration du manuel.', inputType: 'boolean', required: true, value: null, completed: false, remarks: '', stepComment: '', stepPhoto: null },
      { id: 's4', order: 4, label: 'Relever valeur finale', description: 'Noter la valeur après calibration.', inputType: 'numeric', required: true, unit: 'L/min', value: null, completed: false, remarks: '', stepComment: '', stepPhoto: null },
      { id: 's5', order: 5, label: 'Commentaire de validation', description: 'Décrire le résultat de la calibration.', inputType: 'comment', required: true, value: '', completed: false, remarks: '', stepComment: '', stepPhoto: null },
    ],
    comments: [],
    photos: []
  },
};

const getStatusConfig = (status: string) => {
  switch (status) {
    case 'completed':
      return { label: 'Terminé', icon: CheckCircle2, className: 'bg-green-100 text-green-800' };
    case 'in-progress':
      return { label: 'En cours', icon: PlayCircle, className: 'bg-blue-100 text-blue-800' };
    case 'paused':
      return { label: 'En pause', icon: PauseCircle, className: 'bg-orange-100 text-orange-800' };
    case 'locked':
      return { label: 'Verrouillé', icon: Lock, className: 'bg-gray-100 text-gray-800' };
    default:
      return { label: 'Planifié', icon: Clock, className: 'bg-gray-100 text-gray-800' };
  }
};

const getInputTypeIcon = (type: StepInputType) => {
  switch (type) {
    case 'boolean': return ToggleLeft;
    case 'numeric': return Hash;
    case 'comment': return FileText;
    case 'photo': return Camera;
    case 'checkbox': return CheckCircle2;
    default: return FileText;
  }
};

const TabletInterventionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const intervention = id ? interventionData[id] : null;
  const [steps, setSteps] = useState<InterventionStep[]>(intervention?.steps || []);
  const [status, setStatus] = useState(intervention?.status || 'planned');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [showSignature, setShowSignature] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Lors du démarrage ou reprise, aller à la première étape non complétée
  useEffect(() => {
    if (status === 'in-progress' || status === 'paused') {
      const firstIncompleteIndex = steps.findIndex(s => !s.completed);
      if (firstIncompleteIndex !== -1) {
        setCurrentStepIndex(firstIncompleteIndex);
      }
    }
  }, []);

  if (!intervention) {
    return (
      <div className="p-4 text-center">
        <h2 className="text-xl font-semibold mb-4">Intervention introuvable</h2>
        <Button onClick={() => navigate('/tablet')}>Retour à l'accueil</Button>
      </div>
    );
  }

  const statusConfig = getStatusConfig(status);
  const StatusIcon = statusConfig.icon;
  const completedSteps = steps.filter(s => s.completed).length;
  const progress = Math.round((completedSteps / steps.length) * 100);
  const isLocked = status === 'locked' || status === 'completed';
  const isActive = status === 'in-progress';
  const isPaused = status === 'paused';
  const currentStep = steps[currentStepIndex];
  const isLastStep = currentStepIndex === steps.length - 1;
  const allStepsCompleted = steps.every(s => !s.required || s.completed);

  const handleStepValueChange = (value: any) => {
    if (isLocked) return;
    setSteps(steps.map((s, i) => 
      i === currentStepIndex ? { ...s, value } : s
    ));
  };

  const handleStepCommentChange = (stepComment: string) => {
    if (isLocked) return;
    setSteps(steps.map((s, i) => 
      i === currentStepIndex ? { ...s, stepComment } : s
    ));
  };

  const handleTakePhoto = () => {
    if (isLocked) return;
    const photoName = `photo_step_${currentStepIndex + 1}_${Date.now()}.jpg`;
    setSteps(steps.map((s, i) => 
      i === currentStepIndex ? { ...s, stepPhoto: photoName } : s
    ));
    toast({ title: "Photo capturée", description: photoName });
  };

  const handleValidateStep = () => {
    if (isLocked) return;
    const step = currentStep;

    // Vérifier si la saisie est valide
    if (step.required && (step.value === null || step.value === '' || step.value === undefined)) {
      toast({ 
        title: "Saisie obligatoire", 
        description: "Veuillez remplir ce champ avant de valider.",
        variant: "destructive"
      });
      return;
    }

    setSteps(steps.map((s, i) => 
      i === currentStepIndex ? { 
        ...s, 
        completed: true, 
        completedAt: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
      } : s
    ));
    
    toast({ title: "Étape validée" });

    // Passer automatiquement à l'étape suivante ou afficher la signature
    if (!isLastStep) {
      setTimeout(() => setCurrentStepIndex(currentStepIndex + 1), 300);
    }
  };

  const handleStartIntervention = () => {
    setStatus('in-progress');
    const firstIncompleteIndex = steps.findIndex(s => !s.completed);
    setCurrentStepIndex(firstIncompleteIndex !== -1 ? firstIncompleteIndex : 0);
    toast({ title: "Intervention démarrée", description: "Le chronomètre est lancé" });
  };

  const handleResumeIntervention = () => {
    setStatus('in-progress');
    const firstIncompleteIndex = steps.findIndex(s => !s.completed);
    if (firstIncompleteIndex !== -1) {
      setCurrentStepIndex(firstIncompleteIndex);
    }
    toast({ title: "Intervention reprise", description: "Continuez à l'étape en cours" });
  };

  const handlePauseIntervention = () => {
    setStatus('paused');
    toast({ 
      title: "Intervention mise en pause", 
      description: "Vous pourrez reprendre à tout moment" 
    });
  };

  const handleCompleteIntervention = () => {
    const uncompletedRequired = steps.filter(s => s.required && !s.completed);
    if (uncompletedRequired.length > 0) {
      toast({ 
        title: "Étapes obligatoires manquantes",
        description: `${uncompletedRequired.length} étape(s) obligatoire(s) non complétée(s)`,
        variant: "destructive"
      });
      return;
    }
    setShowSignature(true);
  };

  // Signature canvas handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineTo(x, y);
    ctx.stroke();
    setHasSignature(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  const handleSignAndValidate = () => {
    if (!hasSignature) {
      toast({ 
        title: "Signature obligatoire", 
        description: "Veuillez signer avant de valider l'intervention.",
        variant: "destructive"
      });
      return;
    }
    setStatus('completed');
    setShowSignature(false);
    setHasSignature(false);
    toast({ 
      title: "Intervention terminée", 
      description: "L'intervention a été validée et ne peut plus être modifiée" 
    });
  };

  const renderStepInput = () => {
    const step = currentStep;
    if (!step) return null;

    switch (step.inputType) {
      case 'boolean':
        return (
          <div className="flex items-center justify-between p-6 bg-muted/30 rounded-xl">
            <Label className="text-lg font-medium">Conforme ?</Label>
            <Switch
              checked={step.value === true}
              onCheckedChange={(checked) => handleStepValueChange(checked)}
              disabled={isLocked || step.completed}
              className="scale-125"
            />
          </div>
        );

      case 'numeric':
        return (
          <div className="space-y-3">
            <Label className="text-lg font-medium">
              Valeur {step.unit && `(${step.unit})`}
            </Label>
            {step.minValue !== undefined && step.maxValue !== undefined && (
              <p className="text-sm text-muted-foreground">
                Plage acceptée : {step.minValue} - {step.maxValue} {step.unit}
              </p>
            )}
            <Input
              type="number"
              placeholder={`Entrer la valeur${step.unit ? ` en ${step.unit}` : ''}`}
              value={step.value || ''}
              onChange={(e) => handleStepValueChange(e.target.value ? parseFloat(e.target.value) : null)}
              className="h-16 text-xl"
              disabled={isLocked || step.completed}
            />
          </div>
        );

      case 'comment':
        return (
          <div className="space-y-3">
            <Label className="text-lg font-medium">Observation</Label>
            <Textarea
              placeholder="Entrez votre observation..."
              value={step.value || ''}
              onChange={(e) => handleStepValueChange(e.target.value)}
              className="min-h-[120px] text-base"
              disabled={isLocked || step.completed}
            />
          </div>
        );

      case 'photo':
        return (
          <div className="space-y-4">
            <Label className="text-lg font-medium">Photo requise</Label>
            {step.value ? (
              <div className="p-6 bg-green-50 border border-green-200 rounded-xl flex items-center gap-4">
                <Image className="h-8 w-8 text-green-600" />
                <span className="text-green-700 text-lg">{step.value}</span>
              </div>
            ) : (
              <Button 
                variant="outline" 
                className="w-full h-16 text-lg"
                onClick={() => {
                  handleStepValueChange(`photo_step_${currentStepIndex + 1}.jpg`);
                  toast({ title: "Photo capturée" });
                }}
                disabled={isLocked || step.completed}
              >
                <Camera className="h-6 w-6 mr-3" />
                Prendre une photo
              </Button>
            )}
          </div>
        );

      case 'checkbox':
        return (
          <div 
            className="flex items-center gap-6 p-6 bg-muted/30 rounded-xl cursor-pointer"
            onClick={() => !isLocked && !step.completed && handleStepValueChange(!step.value)}
          >
            <Checkbox 
              checked={step.value === true}
              disabled={isLocked || step.completed}
              className="h-8 w-8"
            />
            <Label className="text-lg font-medium cursor-pointer">Tâche effectuée</Label>
          </div>
        );

      default:
        return null;
    }
  };

  const handleExportPDF = () => {
    window.print();
    toast({ title: "Export PDF", description: "Utilisez la boîte de dialogue d'impression pour sauvegarder en PDF" });
  };

  const getValueDisplay = (step: InterventionStep) => {
    switch (step.inputType) {
      case 'boolean':
        return step.value ? '✓ Conforme' : '✗ Non conforme';
      case 'numeric':
        return `${step.value}${step.unit ? ` ${step.unit}` : ''}`;
      case 'comment':
        return step.value || '-';
      case 'photo':
        return step.value ? `📷 ${step.value}` : '-';
      case 'checkbox':
        return step.value ? '✓ Effectué' : '✗ Non effectué';
      default:
        return step.value || '-';
    }
  };

  // Vue terminée (affichage du récapitulatif)
  if (status === 'completed' || status === 'locked') {
    return (
      <div className="p-4 pb-8 space-y-4 print:p-0 print:space-y-2">
        {/* Header */}
        <div className="flex items-center gap-3 print:hidden">
          <Button
            variant="ghost"
            size="icon"
            className="h-12 w-12"
            onClick={() => navigate('/tablet')}
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-foreground">{intervention.equipment}</h1>
            <p className="text-sm text-muted-foreground">{intervention.id}</p>
          </div>
          <Badge className={cn("text-sm px-3 py-1", statusConfig.className)}>
            <StatusIcon className="h-4 w-4 mr-1" />
            {statusConfig.label}
          </Badge>
        </div>

        {/* Header pour impression */}
        <div className="hidden print:block print:mb-4">
          <h1 className="text-2xl font-bold text-center">Rapport d'intervention</h1>
          <p className="text-center text-gray-600">{intervention.id} - {intervention.equipment}</p>
        </div>

        {/* Informations générales */}
        <Card className="p-4 print:border print:shadow-none">
          <h2 className="text-lg font-semibold text-foreground mb-3 print:text-base">Informations générales</h2>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Wrench className="h-4 w-4 text-muted-foreground print:hidden" />
              <span className="text-muted-foreground">Gamme:</span>
              <span className="text-foreground font-medium">{intervention.gamme}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground print:hidden" />
              <span className="text-muted-foreground">Lieu:</span>
              <span className="text-foreground font-medium">{intervention.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground print:hidden" />
              <span className="text-muted-foreground">Date:</span>
              <span className="text-foreground font-medium">{intervention.plannedDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground print:hidden" />
              <span className="text-muted-foreground">Technicien:</span>
              <span className="text-foreground font-medium">{intervention.assignedTo}</span>
            </div>
            {intervention.startedAt && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground print:hidden" />
                <span className="text-muted-foreground">Début:</span>
                <span className="text-foreground font-medium">{intervention.startedAt}</span>
              </div>
            )}
            {intervention.completedAt && (
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-muted-foreground print:hidden" />
                <span className="text-muted-foreground">Fin:</span>
                <span className="text-foreground font-medium">{intervention.completedAt}</span>
              </div>
            )}
          </div>
        </Card>

        {/* Récapitulatif des actions */}
        <Card className="p-4 print:border print:shadow-none">
          <h2 className="text-lg font-semibold text-foreground mb-3 print:text-base">Récapitulatif des actions</h2>
          <div className="space-y-2">
            <div className="grid grid-cols-12 gap-2 text-xs font-semibold text-muted-foreground border-b pb-2 print:text-[10px]">
              <div className="col-span-1">#</div>
              <div className="col-span-5">Action</div>
              <div className="col-span-3">Résultat</div>
              <div className="col-span-3">Heure</div>
            </div>
            {steps.map((step) => (
              <div 
                key={step.id}
                className={cn(
                  "grid grid-cols-12 gap-2 text-sm py-2 border-b border-muted/50 last:border-0 print:text-xs print:py-1",
                  step.completed ? "bg-green-50/50" : "bg-orange-50/50"
                )}
              >
                <div className="col-span-1 font-medium">{step.order}</div>
                <div className="col-span-5">
                  <span className="font-medium">{step.label}</span>
                  {step.stepComment && (
                    <p className="text-xs text-muted-foreground mt-0.5 italic">"{step.stepComment}"</p>
                  )}
                </div>
                <div className="col-span-3">
                  <span className={cn(
                    "text-xs px-2 py-0.5 rounded",
                    step.completed ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"
                  )}>
                    {getValueDisplay(step)}
                  </span>
                </div>
                <div className="col-span-3 text-muted-foreground">
                  {step.completedAt || '-'}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Résumé */}
        <Card className="p-4 print:border print:shadow-none">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-green-600 print:text-lg">{completedSteps}</p>
              <p className="text-xs text-muted-foreground">Étapes réalisées</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground print:text-lg">{steps.length}</p>
              <p className="text-xs text-muted-foreground">Total étapes</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary print:text-lg">{progress}%</p>
              <p className="text-xs text-muted-foreground">Complétion</p>
            </div>
          </div>
        </Card>

        {/* Zone signature */}
        {intervention.signature && (
          <Card className="p-4 print:border print:shadow-none">
            <h2 className="text-lg font-semibold text-foreground mb-2 print:text-base">Signature</h2>
            <div className="h-20 bg-muted/20 rounded flex items-center justify-center">
              <Pen className="h-6 w-6 text-muted-foreground mr-2" />
              <span className="text-muted-foreground">Intervention signée</span>
            </div>
          </Card>
        )}

        {/* Bouton export PDF */}
        <Button 
          className="w-full h-14 text-lg print:hidden"
          onClick={handleExportPDF}
        >
          <Download className="h-6 w-6 mr-3" />
          Exporter en PDF
        </Button>
      </div>
    );
  }

  // Vue non active (planifié ou en pause)
  if (!isActive) {
    return (
      <div className="p-4 pb-8 space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-12 w-12"
            onClick={() => navigate('/tablet')}
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-foreground">{intervention.equipment}</h1>
            <p className="text-sm text-muted-foreground">{intervention.id}</p>
          </div>
          <Badge className={cn("text-sm px-3 py-1", statusConfig.className)}>
            <StatusIcon className="h-4 w-4 mr-1" />
            {statusConfig.label}
          </Badge>
        </div>

        {/* Informations générales */}
        <Card className="p-4 space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <Wrench className="h-5 w-5 text-muted-foreground" />
            <span className="text-foreground">{intervention.gamme}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <MapPin className="h-5 w-5 text-muted-foreground" />
            <span className="text-foreground">{intervention.location}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <span className="text-foreground">{intervention.plannedDate} à {intervention.plannedTime}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <User className="h-5 w-5 text-muted-foreground" />
            <span className="text-foreground">{intervention.assignedTo}</span>
          </div>
          
          <div className="pt-2 border-t border-border">
            <p className="text-sm text-muted-foreground">{intervention.description}</p>
          </div>
        </Card>

        {/* Progression si en pause */}
        {isPaused && (
          <Card className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold text-foreground">Progression</h2>
              <span className="text-sm font-medium">{completedSteps}/{steps.length} étapes</span>
            </div>
            <Progress value={progress} className="h-3" />
            <p className="text-sm text-muted-foreground mt-2">{progress}% complété</p>
          </Card>
        )}

        {/* Résumé des étapes */}
        <Card className="p-4">
          <h2 className="text-lg font-semibold text-foreground mb-3">Étapes ({steps.length})</h2>
          <div className="space-y-2">
            {steps.map((step, index) => (
              <div 
                key={step.id}
                className={cn(
                  "flex items-center gap-3 p-2 rounded-lg",
                  step.completed && "bg-green-50"
                )}
              >
                <div className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                  step.completed 
                    ? "bg-green-500 text-white" 
                    : "bg-muted text-muted-foreground"
                )}>
                  {step.completed ? <Check className="h-4 w-4" /> : index + 1}
                </div>
                <span className={cn(
                  "text-sm",
                  step.completed ? "text-green-700" : "text-foreground"
                )}>{step.label}</span>
                {step.required && !step.completed && (
                  <Badge variant="outline" className="text-xs ml-auto">Obligatoire</Badge>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Boutons d'action */}
        <div className="space-y-3">
          {status === 'planned' && (
            <Button 
              className="w-full h-16 text-lg"
              onClick={handleStartIntervention}
            >
              <PlayCircle className="h-6 w-6 mr-3" />
              Démarrer l'intervention
            </Button>
          )}
          {isPaused && (
            <Button 
              className="w-full h-16 text-lg"
              onClick={handleResumeIntervention}
            >
              <PlayCircle className="h-6 w-6 mr-3" />
              Reprendre l'intervention
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Vue active (en cours)
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Header fixe */}
      <div className="p-4 border-b border-border bg-background">
        <div className="flex items-center gap-3 mb-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10"
            onClick={() => navigate('/tablet')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-foreground">{intervention.equipment}</h1>
            <p className="text-xs text-muted-foreground">{intervention.gamme}</p>
          </div>
          <Badge className={cn("text-sm px-3 py-1", statusConfig.className)}>
            <StatusIcon className="h-4 w-4 mr-1" />
            {statusConfig.label}
          </Badge>
        </div>

        {/* Barre de progression */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Progression</span>
            <span className="text-muted-foreground">{completedSteps}/{steps.length} étapes</span>
          </div>
          <Progress value={progress} className="h-2" />
          
          {/* Indicateurs d'étapes */}
          <div className="flex gap-1 mt-2">
            {steps.map((step, index) => (
              <button
                key={step.id}
                onClick={() => setCurrentStepIndex(index)}
                className={cn(
                  "flex-1 h-2 rounded-full transition-all",
                  step.completed 
                    ? "bg-green-500" 
                    : index === currentStepIndex 
                      ? "bg-primary" 
                      : "bg-muted"
                )}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Contenu de l'étape courante */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {currentStep && (
          <>
            {/* Numéro et titre de l'étape */}
            <div className="text-center space-y-2">
              <div className={cn(
                "w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold mx-auto",
                currentStep.completed 
                  ? "bg-green-500 text-white" 
                  : "bg-primary text-primary-foreground"
              )}>
                {currentStep.completed ? <Check className="h-8 w-8" /> : currentStep.order}
              </div>
              <h2 className="text-xl font-bold text-foreground">{currentStep.label}</h2>
              {currentStep.required && (
                <Badge variant="outline">Obligatoire</Badge>
              )}
            </div>

            {/* Description */}
            <Card className="p-4">
              <p className="text-muted-foreground">{currentStep.description}</p>
            </Card>

            {/* Zone de saisie principale */}
            <Card className="p-4">
              {renderStepInput()}
            </Card>

            {/* Commentaire de l'étape */}
            <Card className="p-4 space-y-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-muted-foreground" />
                <Label className="font-medium">Commentaire (optionnel)</Label>
              </div>
              <Textarea
                placeholder="Ajouter un commentaire pour cette étape..."
                value={currentStep.stepComment}
                onChange={(e) => handleStepCommentChange(e.target.value)}
                className="min-h-[80px]"
                disabled={isLocked || currentStep.completed}
              />
            </Card>

            {/* Photo de l'étape */}
            <Card className="p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Camera className="h-5 w-5 text-muted-foreground" />
                <Label className="font-medium">Photo (optionnel)</Label>
              </div>
              {currentStep.stepPhoto ? (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                  <Image className="h-6 w-6 text-green-600" />
                  <span className="text-green-700">{currentStep.stepPhoto}</span>
                </div>
              ) : (
                <Button 
                  variant="outline" 
                  className="w-full h-12"
                  onClick={handleTakePhoto}
                  disabled={isLocked || currentStep.completed}
                >
                  <Camera className="h-5 w-5 mr-2" />
                  Prendre une photo
                </Button>
              )}
            </Card>

            {/* Bouton de validation de l'étape */}
            {!currentStep.completed && !isLocked && (
              <Button 
                className="w-full h-14 text-lg"
                onClick={handleValidateStep}
              >
                <Check className="h-6 w-6 mr-2" />
                Valider l'étape {currentStep.order}/{steps.length}
              </Button>
            )}

            {/* Indication si étape déjà complétée */}
            {currentStep.completed && (
              <div className="text-center p-4 bg-green-50 rounded-xl">
                <CheckCircle2 className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-green-700 font-medium">Étape validée à {currentStep.completedAt}</p>
              </div>
            )}
          </>
        )}

        {/* Bouton de finalisation si toutes les étapes sont complétées */}
        {allStepsCompleted && !isLocked && (
          <Card className="p-4 bg-green-50 border-green-200">
            <div className="text-center space-y-3">
              <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto" />
              <h3 className="text-lg font-bold text-green-800">Toutes les étapes sont complétées !</h3>
              <p className="text-sm text-green-700">Vous pouvez maintenant finaliser l'intervention.</p>
              <Button 
                className="w-full h-14 text-lg bg-green-600 hover:bg-green-700"
                onClick={handleCompleteIntervention}
              >
                <CheckCircle2 className="h-6 w-6 mr-2" />
                Terminer l'intervention
              </Button>
            </div>
          </Card>
        )}
      </div>

      {/* Navigation entre étapes */}
      <div className="p-4 border-t border-border bg-background">
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1 h-12"
            onClick={() => setCurrentStepIndex(Math.max(0, currentStepIndex - 1))}
            disabled={currentStepIndex === 0}
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            Précédent
          </Button>

          {!isLocked && (
            <Button
              variant="outline"
              className="h-12 px-4 text-orange-600 border-orange-300 hover:bg-orange-50"
              onClick={handlePauseIntervention}
            >
              <PauseCircle className="h-5 w-5" />
            </Button>
          )}

          <Button
            variant="outline"
            className="flex-1 h-12"
            onClick={() => setCurrentStepIndex(Math.min(steps.length - 1, currentStepIndex + 1))}
            disabled={currentStepIndex === steps.length - 1}
          >
            Suivant
            <ChevronRight className="h-5 w-5 ml-1" />
          </Button>
        </div>
      </div>

      {showSignature && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <Card className="w-full max-w-lg p-6 space-y-4">
            <h2 className="text-xl font-bold text-foreground text-center">Signature obligatoire</h2>
            <p className="text-sm text-muted-foreground text-center">
              Signez ci-dessous pour confirmer la réalisation de l'intervention. 
              Une fois terminée, l'intervention ne pourra plus être modifiée.
            </p>
            
            <div className="border-2 border-dashed border-muted-foreground/30 rounded-lg overflow-hidden">
              <canvas 
                ref={canvasRef}
                width={400}
                height={150}
                className="w-full bg-white touch-none"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
              />
            </div>
            <Button variant="ghost" size="sm" onClick={clearSignature} className="w-full">
              Effacer la signature
            </Button>

            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1 h-12"
                onClick={() => {
                  setShowSignature(false);
                  setHasSignature(false);
                  clearSignature();
                }}
              >
                Annuler
              </Button>
              <Button 
                className="flex-1 h-12 bg-green-600 hover:bg-green-700"
                onClick={handleSignAndValidate}
                disabled={!hasSignature}
              >
                <CheckCircle2 className="h-5 w-5 mr-2" />
                Terminer
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default TabletInterventionDetail;