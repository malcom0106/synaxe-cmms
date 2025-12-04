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
  X
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

// Données de démonstration
const interventionData: Record<string, InterventionData> = {
  'INT001': {
    id: 'INT001',
    equipment: 'Oléoserveur 201',
    equipmentCode: 'EQ001',
    location: 'Zone A - Bâtiment principal',
    gamme: 'Maintenance préventive mensuelle',
    description: 'Vérification complète du système oléohydraulique.',
    assignedTo: 'Jean Martin',
    plannedDate: '04/12/2025',
    plannedTime: '08:00',
    status: 'completed',
    priority: 'medium',
    startedAt: '04/12/2025 08:15',
    completedAt: '04/12/2025 10:30',
    steps: [
      { id: 's1', order: 1, label: 'Vérifier le niveau d\'huile', description: 'Contrôler le niveau dans le réservoir principal.', inputType: 'boolean', required: true, value: true, completed: true, remarks: '', stepComment: '', stepPhoto: null, completedAt: '08:20' },
      { id: 's2', order: 2, label: 'Relever la pression', description: 'Mesurer la pression du circuit hydraulique.', inputType: 'numeric', required: true, unit: 'bar', minValue: 150, maxValue: 200, value: 175, completed: true, remarks: '', stepComment: '', stepPhoto: null, completedAt: '08:35' },
      { id: 's3', order: 3, label: 'Contrôler les connexions électriques', description: 'Vérifier visuellement l\'état des câbles.', inputType: 'boolean', required: true, value: true, completed: true, remarks: '', stepComment: '', stepPhoto: null, completedAt: '08:50' },
      { id: 's4', order: 4, label: 'Photo du compteur', description: 'Prendre une photo du compteur.', inputType: 'photo', required: true, value: 'photo_compteur.jpg', completed: true, remarks: '', stepComment: '', stepPhoto: 'photo_compteur.jpg', completedAt: '09:00' },
      { id: 's5', order: 5, label: 'Observations générales', description: 'Noter toute observation.', inputType: 'comment', required: false, value: 'RAS', completed: true, remarks: '', stepComment: '', stepPhoto: null, completedAt: '09:15' },
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
    description: 'Inspection visuelle de la pompe principale.',
    assignedTo: 'Jean Martin',
    plannedDate: '04/12/2025',
    plannedTime: '10:30',
    status: 'paused',
    priority: 'high',
    startedAt: '04/12/2025 10:45',
    pausedAt: '04/12/2025 11:00',
    steps: [
      { id: 's1', order: 1, label: 'Inspecter les joints', description: 'Vérifier l\'état des joints d\'étanchéité.', inputType: 'boolean', required: true, value: true, completed: true, remarks: '', stepComment: 'Aucune fuite', stepPhoto: null, completedAt: '10:50' },
      { id: 's2', order: 2, label: 'Mesurer les vibrations', description: 'Utiliser le vibromètre.', inputType: 'numeric', required: true, unit: 'mm/s', minValue: 0, maxValue: 10, value: null, completed: false, remarks: '', stepComment: '', stepPhoto: null },
      { id: 's3', order: 3, label: 'Relever la température', description: 'Mesurer la température.', inputType: 'numeric', required: true, unit: '°C', minValue: 20, maxValue: 80, value: null, completed: false, remarks: '', stepComment: '', stepPhoto: null },
      { id: 's4', order: 4, label: 'Vérifier les fixations', description: 'Contrôler le serrage.', inputType: 'checkbox', required: true, value: false, completed: false, remarks: '', stepComment: '', stepPhoto: null },
      { id: 's5', order: 5, label: 'Photo de la pompe', description: 'Documenter l\'état visuel.', inputType: 'photo', required: false, value: null, completed: false, remarks: '', stepComment: '', stepPhoto: null },
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
    description: 'Calibration du compteur de débit.',
    assignedTo: 'Jean Martin',
    plannedDate: '04/12/2025',
    plannedTime: '14:00',
    status: 'planned',
    priority: 'medium',
    steps: [
      { id: 's1', order: 1, label: 'Préparer l\'équipement', description: 'Rassembler le matériel.', inputType: 'checkbox', required: true, value: false, completed: false, remarks: '', stepComment: '', stepPhoto: null },
      { id: 's2', order: 2, label: 'Relever valeur initiale', description: 'Noter la valeur affichée.', inputType: 'numeric', required: true, unit: 'L/min', value: null, completed: false, remarks: '', stepComment: '', stepPhoto: null },
      { id: 's3', order: 3, label: 'Effectuer la calibration', description: 'Suivre la procédure.', inputType: 'boolean', required: true, value: null, completed: false, remarks: '', stepComment: '', stepPhoto: null },
      { id: 's4', order: 4, label: 'Relever valeur finale', description: 'Noter la valeur après calibration.', inputType: 'numeric', required: true, unit: 'L/min', value: null, completed: false, remarks: '', stepComment: '', stepPhoto: null },
      { id: 's5', order: 5, label: 'Commentaire de validation', description: 'Décrire le résultat.', inputType: 'comment', required: true, value: '', completed: false, remarks: '', stepComment: '', stepPhoto: null },
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
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="p-6 text-center max-w-sm">
          <h2 className="text-lg font-semibold mb-3">Intervention introuvable</h2>
          <Button onClick={() => navigate('/tablet')}>Retour à l'accueil</Button>
        </Card>
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
    setSteps(steps.map((s, i) => i === currentStepIndex ? { ...s, value } : s));
  };

  const handleStepCommentChange = (stepComment: string) => {
    if (isLocked) return;
    setSteps(steps.map((s, i) => i === currentStepIndex ? { ...s, stepComment } : s));
  };

  const handleTakePhoto = () => {
    if (isLocked) return;
    const photoName = `photo_step_${currentStepIndex + 1}_${Date.now()}.jpg`;
    setSteps(steps.map((s, i) => i === currentStepIndex ? { ...s, stepPhoto: photoName } : s));
    toast({ title: "Photo capturée" });
  };

  const handleValidateStep = () => {
    if (isLocked) return;
    const step = currentStep;

    if (step.required && (step.value === null || step.value === '' || step.value === undefined)) {
      toast({ title: "Saisie obligatoire", variant: "destructive" });
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

    if (!isLastStep) {
      setTimeout(() => setCurrentStepIndex(currentStepIndex + 1), 300);
    }
  };

  const handleStartIntervention = () => {
    setStatus('in-progress');
    const firstIncompleteIndex = steps.findIndex(s => !s.completed);
    setCurrentStepIndex(firstIncompleteIndex !== -1 ? firstIncompleteIndex : 0);
    toast({ title: "Intervention démarrée" });
  };

  const handleResumeIntervention = () => {
    setStatus('in-progress');
    const firstIncompleteIndex = steps.findIndex(s => !s.completed);
    if (firstIncompleteIndex !== -1) {
      setCurrentStepIndex(firstIncompleteIndex);
    }
    toast({ title: "Intervention reprise" });
  };

  const handlePauseIntervention = () => {
    setStatus('paused');
    toast({ title: "Intervention mise en pause" });
  };

  const handleCompleteIntervention = () => {
    const uncompletedRequired = steps.filter(s => s.required && !s.completed);
    if (uncompletedRequired.length > 0) {
      toast({ title: "Étapes manquantes", variant: "destructive" });
      return;
    }
    setShowSignature(true);
  };

  // Signature handlers
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
  };

  const stopDrawing = () => setIsDrawing(false);

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleSignAndValidate = () => {
    setStatus('locked');
    setShowSignature(false);
    toast({ title: "Intervention validée et verrouillée" });
  };

  const renderStepInput = () => {
    const step = currentStep;
    if (!step) return null;

    switch (step.inputType) {
      case 'boolean':
        return (
          <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
            <Label className="text-sm font-medium">Conforme ?</Label>
            <Switch
              checked={step.value === true}
              onCheckedChange={(checked) => handleStepValueChange(checked)}
              disabled={isLocked || step.completed}
            />
          </div>
        );

      case 'numeric':
        return (
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Valeur {step.unit && `(${step.unit})`}
            </Label>
            {step.minValue !== undefined && step.maxValue !== undefined && (
              <p className="text-xs text-muted-foreground">
                Plage : {step.minValue} - {step.maxValue} {step.unit}
              </p>
            )}
            <Input
              type="number"
              placeholder={`Valeur${step.unit ? ` en ${step.unit}` : ''}`}
              value={step.value || ''}
              onChange={(e) => handleStepValueChange(e.target.value ? parseFloat(e.target.value) : null)}
              className="h-10"
              disabled={isLocked || step.completed}
            />
          </div>
        );

      case 'comment':
        return (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Observation</Label>
            <Textarea
              placeholder="Votre observation..."
              value={step.value || ''}
              onChange={(e) => handleStepValueChange(e.target.value)}
              className="min-h-[80px] text-sm"
              disabled={isLocked || step.completed}
            />
          </div>
        );

      case 'photo':
        return (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Photo requise</Label>
            {step.value ? (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                <Image className="h-5 w-5 text-green-600" />
                <span className="text-green-700 text-sm">{step.value}</span>
              </div>
            ) : (
              <Button 
                variant="outline" 
                className="w-full h-10"
                onClick={() => {
                  handleStepValueChange(`photo_step_${currentStepIndex + 1}.jpg`);
                  toast({ title: "Photo capturée" });
                }}
                disabled={isLocked || step.completed}
              >
                <Camera className="h-4 w-4 mr-2" />
                Prendre une photo
              </Button>
            )}
          </div>
        );

      case 'checkbox':
        return (
          <div 
            className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg cursor-pointer"
            onClick={() => !isLocked && !step.completed && handleStepValueChange(!step.value)}
          >
            <Checkbox 
              checked={step.value === true}
              disabled={isLocked || step.completed}
              className="h-5 w-5"
            />
            <Label className="text-sm font-medium cursor-pointer">Tâche effectuée</Label>
          </div>
        );

      default:
        return null;
    }
  };

  // Vue non active (planifié ou en pause)
  if (!isActive && !isLocked) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-lg p-5 space-y-4">
          {/* Header */}
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => navigate('/tablet')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1 min-w-0">
              <h1 className="text-base font-bold text-foreground truncate">{intervention.equipment}</h1>
              <p className="text-xs text-muted-foreground">{intervention.id}</p>
            </div>
            <Badge className={cn("text-xs", statusConfig.className)}>
              <StatusIcon className="h-3 w-3 mr-1" />
              {statusConfig.label}
            </Badge>
          </div>

          {/* Informations */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg">
              <Wrench className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="truncate">{intervention.gamme}</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg">
              <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="truncate">{intervention.location}</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg">
              <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
              <span>{intervention.plannedDate}</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg">
              <User className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="truncate">{intervention.assignedTo}</span>
            </div>
          </div>

          {/* Progression si en pause */}
          {isPaused && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium">Progression</span>
                <span className="text-muted-foreground">{completedSteps}/{steps.length}</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          {/* Résumé des étapes */}
          <div className="space-y-2">
            <h2 className="text-sm font-semibold">Étapes ({steps.length})</h2>
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {steps.map((step, index) => (
                <div 
                  key={step.id}
                  className={cn(
                    "flex items-center gap-2 p-2 rounded-lg text-xs",
                    step.completed && "bg-green-50"
                  )}
                >
                  <div className={cn(
                    "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0",
                    step.completed ? "bg-green-500 text-white" : "bg-muted text-muted-foreground"
                  )}>
                    {step.completed ? <Check className="h-3 w-3" /> : index + 1}
                  </div>
                  <span className={cn("truncate", step.completed && "text-green-700")}>
                    {step.label}
                  </span>
                  {step.required && !step.completed && (
                    <Badge variant="outline" className="text-[10px] ml-auto shrink-0">Requis</Badge>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Boutons d'action */}
          {status === 'planned' && (
            <Button className="w-full h-11" onClick={handleStartIntervention}>
              <PlayCircle className="h-5 w-5 mr-2" />
              Démarrer l'intervention
            </Button>
          )}
          {isPaused && (
            <Button className="w-full h-11" onClick={handleResumeIntervention}>
              <PlayCircle className="h-5 w-5 mr-2" />
              Reprendre l'intervention
            </Button>
          )}
        </Card>
      </div>
    );
  }

  // Vue active (en cours) - Condensée avec marges
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl overflow-hidden flex flex-col" style={{ maxHeight: 'calc(100vh - 2rem)' }}>
        {/* Header compact */}
        <div className="p-3 border-b border-border bg-muted/30 shrink-0">
          <div className="flex items-center gap-2 mb-2">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate('/tablet')}>
              <X className="h-4 w-4" />
            </Button>
            <div className="flex-1 min-w-0">
              <h1 className="text-sm font-bold truncate">{intervention.equipment}</h1>
              <p className="text-[10px] text-muted-foreground truncate">{intervention.gamme}</p>
            </div>
            <Badge className={cn("text-xs", statusConfig.className)}>
              {statusConfig.label}
            </Badge>
            {!isLocked && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-orange-600 hover:bg-orange-50"
                onClick={handlePauseIntervention}
              >
                <PauseCircle className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Barre de progression compacte */}
          <div className="flex items-center gap-2">
            <Progress value={progress} className="flex-1 h-1.5" />
            <span className="text-[10px] text-muted-foreground whitespace-nowrap">
              {completedSteps}/{steps.length}
            </span>
          </div>
          
          {/* Indicateurs d'étapes */}
          <div className="flex gap-0.5 mt-2">
            {steps.map((step, index) => (
              <button
                key={step.id}
                onClick={() => setCurrentStepIndex(index)}
                className={cn(
                  "flex-1 h-1.5 rounded-full transition-all",
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

        {/* Contenu de l'étape */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {currentStep && (
            <>
              {/* Numéro et titre */}
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0",
                  currentStep.completed ? "bg-green-500 text-white" : "bg-primary text-primary-foreground"
                )}>
                  {currentStep.completed ? <Check className="h-5 w-5" /> : currentStep.order}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-sm font-bold truncate">{currentStep.label}</h2>
                  {currentStep.required && (
                    <Badge variant="outline" className="text-[10px]">Obligatoire</Badge>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-muted-foreground bg-muted/30 p-2 rounded-lg">
                {currentStep.description}
              </p>

              {/* Zone de saisie principale */}
              <div className="bg-card border border-border rounded-lg p-3">
                {renderStepInput()}
              </div>

              {/* Commentaire et photo en ligne */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MessageSquare className="h-3 w-3" />
                    <span>Commentaire</span>
                  </div>
                  <Textarea
                    placeholder="Optionnel..."
                    value={currentStep.stepComment}
                    onChange={(e) => handleStepCommentChange(e.target.value)}
                    className="min-h-[60px] text-xs"
                    disabled={isLocked || currentStep.completed}
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Camera className="h-3 w-3" />
                    <span>Photo</span>
                  </div>
                  {currentStep.stepPhoto ? (
                    <div className="h-[60px] bg-green-50 border border-green-200 rounded-lg flex items-center justify-center gap-2">
                      <Image className="h-4 w-4 text-green-600" />
                      <span className="text-green-700 text-xs truncate">{currentStep.stepPhoto}</span>
                    </div>
                  ) : (
                    <Button 
                      variant="outline" 
                      className="w-full h-[60px] text-xs"
                      onClick={handleTakePhoto}
                      disabled={isLocked || currentStep.completed}
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Bouton de validation ou statut */}
              {!currentStep.completed && !isLocked ? (
                <Button className="w-full h-10" onClick={handleValidateStep}>
                  <Check className="h-4 w-4 mr-2" />
                  Valider l'étape {currentStep.order}/{steps.length}
                </Button>
              ) : currentStep.completed && (
                <div className="text-center p-2 bg-green-50 rounded-lg">
                  <p className="text-green-700 text-xs font-medium flex items-center justify-center gap-1">
                    <CheckCircle2 className="h-4 w-4" />
                    Validée à {currentStep.completedAt}
                  </p>
                </div>
              )}
            </>
          )}

          {/* Bouton de finalisation */}
          {allStepsCompleted && !isLocked && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-center space-y-2">
              <CheckCircle2 className="h-8 w-8 text-green-600 mx-auto" />
              <p className="text-sm font-medium text-green-800">Toutes les étapes complétées !</p>
              <Button 
                className="w-full h-10 bg-green-600 hover:bg-green-700"
                onClick={handleCompleteIntervention}
              >
                <Pen className="h-4 w-4 mr-2" />
                Signer et finaliser
              </Button>
            </div>
          )}
        </div>

        {/* Navigation entre étapes */}
        <div className="p-3 border-t border-border bg-muted/30 shrink-0">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => setCurrentStepIndex(Math.max(0, currentStepIndex - 1))}
              disabled={currentStepIndex === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Précédent
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => setCurrentStepIndex(Math.min(steps.length - 1, currentStepIndex + 1))}
              disabled={currentStepIndex === steps.length - 1}
            >
              Suivant
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Modal de signature */}
      {showSignature && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md p-4 space-y-3">
            <h2 className="text-base font-bold text-center">Validation finale</h2>
            <p className="text-xs text-muted-foreground text-center">
              En signant, vous confirmez avoir réalisé toutes les étapes.
            </p>
            
            <div className="border-2 border-dashed border-muted-foreground/30 rounded-lg overflow-hidden">
              <canvas 
                ref={canvasRef}
                width={350}
                height={120}
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
            <Button variant="ghost" size="sm" onClick={clearSignature} className="w-full text-xs">
              Effacer la signature
            </Button>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1" onClick={() => setShowSignature(false)}>
                Annuler
              </Button>
              <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700" onClick={handleSignAndValidate}>
                <Lock className="h-4 w-4 mr-1" />
                Valider
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default TabletInterventionDetail;