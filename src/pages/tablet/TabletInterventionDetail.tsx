import React, { useState, useRef } from 'react';
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
  AlertCircle,
  Plus,
  Image,
  Lock,
  Hash,
  ToggleLeft,
  FileText,
  Paperclip,
  ChevronDown,
  ChevronUp,
  Send,
  Check
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
  attachments: string[];
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
  status: 'planned' | 'in-progress' | 'completed' | 'locked';
  priority: string;
  steps: InterventionStep[];
  comments: { user: string; date: string; text: string }[];
  photos: string[];
  startedAt?: string;
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
      { id: 's1', order: 1, label: 'Vérifier le niveau d\'huile', description: 'Contrôler le niveau dans le réservoir principal. Le niveau doit être entre MIN et MAX.', inputType: 'boolean', required: true, value: true, completed: true, remarks: '', attachments: [], completedAt: '08:20' },
      { id: 's2', order: 2, label: 'Relever la pression', description: 'Mesurer la pression du circuit hydraulique en bar.', inputType: 'numeric', required: true, unit: 'bar', minValue: 150, maxValue: 200, value: 175, completed: true, remarks: 'Pression nominale', attachments: [], completedAt: '08:35' },
      { id: 's3', order: 3, label: 'Contrôler les connexions électriques', description: 'Vérifier visuellement l\'état des câbles et connexions.', inputType: 'boolean', required: true, value: true, completed: true, remarks: '', attachments: [], completedAt: '08:50' },
      { id: 's4', order: 4, label: 'Photo du compteur', description: 'Prendre une photo du compteur pour archivage.', inputType: 'photo', required: true, value: 'photo_compteur.jpg', completed: true, remarks: '', attachments: ['photo_compteur.jpg'], completedAt: '09:00' },
      { id: 's5', order: 5, label: 'Observations générales', description: 'Noter toute observation ou anomalie constatée.', inputType: 'comment', required: false, value: 'RAS - Équipement en bon état général', completed: true, remarks: '', attachments: [], completedAt: '09:15' },
    ],
    comments: [
      { user: 'Jean Martin', date: '04/12/2025 08:45', text: 'Niveau d\'huile conforme, légère fuite détectée sur raccord B2.' },
    ],
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
    status: 'in-progress',
    priority: 'high',
    startedAt: '04/12/2025 10:45',
    steps: [
      { id: 's1', order: 1, label: 'Inspecter les joints', description: 'Vérifier l\'état des joints d\'étanchéité. Signaler tout signe d\'usure ou de fuite.', inputType: 'boolean', required: true, value: true, completed: true, remarks: 'Joint principal OK', attachments: [], completedAt: '10:50' },
      { id: 's2', order: 2, label: 'Mesurer les vibrations', description: 'Utiliser le vibromètre pour mesurer les vibrations en mm/s.', inputType: 'numeric', required: true, unit: 'mm/s', minValue: 0, maxValue: 10, value: null, completed: false, remarks: '', attachments: [] },
      { id: 's3', order: 3, label: 'Relever la température', description: 'Mesurer la température de fonctionnement en °C.', inputType: 'numeric', required: true, unit: '°C', minValue: 20, maxValue: 80, value: null, completed: false, remarks: '', attachments: [] },
      { id: 's4', order: 4, label: 'Vérifier les fixations', description: 'Contrôler le serrage de toutes les fixations.', inputType: 'checkbox', required: true, value: false, completed: false, remarks: '', attachments: [] },
      { id: 's5', order: 5, label: 'Photo de la pompe', description: 'Documenter l\'état visuel de la pompe.', inputType: 'photo', required: false, value: null, completed: false, remarks: '', attachments: [] },
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
      { id: 's1', order: 1, label: 'Préparer l\'équipement', description: 'Rassembler le matériel de calibration nécessaire.', inputType: 'checkbox', required: true, value: false, completed: false, remarks: '', attachments: [] },
      { id: 's2', order: 2, label: 'Relever valeur initiale', description: 'Noter la valeur affichée avant calibration.', inputType: 'numeric', required: true, unit: 'L/min', value: null, completed: false, remarks: '', attachments: [] },
      { id: 's3', order: 3, label: 'Effectuer la calibration', description: 'Suivre la procédure de calibration du manuel.', inputType: 'boolean', required: true, value: null, completed: false, remarks: '', attachments: [] },
      { id: 's4', order: 4, label: 'Relever valeur finale', description: 'Noter la valeur après calibration.', inputType: 'numeric', required: true, unit: 'L/min', value: null, completed: false, remarks: '', attachments: [] },
      { id: 's5', order: 5, label: 'Commentaire de validation', description: 'Décrire le résultat de la calibration.', inputType: 'comment', required: true, value: '', completed: false, remarks: '', attachments: [] },
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
  const [expandedStep, setExpandedStep] = useState<string | null>(null);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState(intervention?.comments || []);
  const [status, setStatus] = useState(intervention?.status || 'planned');
  const [showSignature, setShowSignature] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

  const handleStepValueChange = (stepId: string, value: any) => {
    if (isLocked) return;
    setSteps(steps.map(s => 
      s.id === stepId ? { ...s, value } : s
    ));
  };

  const handleStepComplete = (stepId: string) => {
    if (isLocked) return;
    const step = steps.find(s => s.id === stepId);
    if (!step) return;

    // Vérifier si la saisie est valide
    if (step.required && (step.value === null || step.value === '' || step.value === undefined)) {
      toast({ 
        title: "Saisie obligatoire", 
        description: "Veuillez remplir ce champ avant de valider.",
        variant: "destructive"
      });
      return;
    }

    setSteps(steps.map(s => 
      s.id === stepId ? { 
        ...s, 
        completed: true, 
        completedAt: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
      } : s
    ));
    
    toast({ title: "Étape validée" });
  };

  const handleStepRemarks = (stepId: string, remarks: string) => {
    if (isLocked) return;
    setSteps(steps.map(s => 
      s.id === stepId ? { ...s, remarks } : s
    ));
  };

  const handleAddAttachment = (stepId: string) => {
    if (isLocked) return;
    toast({ 
      title: "Pièce jointe",
      description: "La prise de photo sera disponible sur l'application native"
    });
    setSteps(steps.map(s => 
      s.id === stepId ? { ...s, attachments: [...s.attachments, `photo_${Date.now()}.jpg`] } : s
    ));
  };

  const handleStartIntervention = () => {
    setStatus('in-progress');
    toast({ title: "Intervention démarrée", description: "Le chronomètre est lancé" });
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

  const handleSignAndValidate = () => {
    setStatus('locked');
    setShowSignature(false);
    toast({ 
      title: "Intervention validée et verrouillée", 
      description: "Les données ont été enregistrées et synchronisées" 
    });
  };

  const handleAddComment = () => {
    if (!comment.trim()) return;
    const newComment = {
      user: 'Jean Martin',
      date: new Date().toLocaleString('fr-FR'),
      text: comment
    };
    setComments([...comments, newComment]);
    setComment('');
    toast({ title: "Commentaire ajouté" });
  };

  const renderStepInput = (step: InterventionStep) => {
    const InputIcon = getInputTypeIcon(step.inputType);

    switch (step.inputType) {
      case 'boolean':
        return (
          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
            <Label className="text-base font-medium">Conforme ?</Label>
            <Switch
              checked={step.value === true}
              onCheckedChange={(checked) => handleStepValueChange(step.id, checked)}
              disabled={isLocked || step.completed}
            />
          </div>
        );

      case 'numeric':
        return (
          <div className="space-y-2">
            <Label className="text-base font-medium">
              Valeur {step.unit && `(${step.unit})`}
              {step.minValue !== undefined && step.maxValue !== undefined && (
                <span className="text-sm text-muted-foreground ml-2">
                  (min: {step.minValue}, max: {step.maxValue})
                </span>
              )}
            </Label>
            <Input
              type="number"
              placeholder={`Entrer la valeur${step.unit ? ` en ${step.unit}` : ''}`}
              value={step.value || ''}
              onChange={(e) => handleStepValueChange(step.id, e.target.value ? parseFloat(e.target.value) : null)}
              className="h-14 text-lg"
              disabled={isLocked || step.completed}
            />
          </div>
        );

      case 'comment':
        return (
          <div className="space-y-2">
            <Label className="text-base font-medium">Observation</Label>
            <Textarea
              placeholder="Entrez votre observation..."
              value={step.value || ''}
              onChange={(e) => handleStepValueChange(step.id, e.target.value)}
              className="min-h-[100px] text-base"
              disabled={isLocked || step.completed}
            />
          </div>
        );

      case 'photo':
        return (
          <div className="space-y-3">
            <Label className="text-base font-medium">Photo requise</Label>
            {step.value ? (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                <Image className="h-6 w-6 text-green-600" />
                <span className="text-green-700">{step.value}</span>
              </div>
            ) : (
              <Button 
                variant="outline" 
                className="w-full h-14"
                onClick={() => {
                  handleStepValueChange(step.id, `photo_${Date.now()}.jpg`);
                  toast({ title: "Photo capturée" });
                }}
                disabled={isLocked || step.completed}
              >
                <Camera className="h-5 w-5 mr-2" />
                Prendre une photo
              </Button>
            )}
          </div>
        );

      case 'checkbox':
        return (
          <div 
            className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg cursor-pointer"
            onClick={() => !isLocked && !step.completed && handleStepValueChange(step.id, !step.value)}
          >
            <Checkbox 
              checked={step.value === true}
              disabled={isLocked || step.completed}
              className="h-6 w-6"
            />
            <Label className="text-base font-medium cursor-pointer">Tâche effectuée</Label>
          </div>
        );

      default:
        return null;
    }
  };

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

      {/* Actions rapides */}
      {!isLocked && (
        <div className="flex gap-3">
          {status === 'planned' && (
            <Button 
              className="flex-1 h-14 text-base"
              onClick={handleStartIntervention}
            >
              <PlayCircle className="h-5 w-5 mr-2" />
              Démarrer l'intervention
            </Button>
          )}
          {status === 'in-progress' && (
            <Button 
              className="flex-1 h-14 text-base bg-green-600 hover:bg-green-700"
              onClick={handleCompleteIntervention}
            >
              <CheckCircle2 className="h-5 w-5 mr-2" />
              Valider l'intervention
            </Button>
          )}
        </div>
      )}

      {/* Progression globale */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-foreground">Progression</h2>
          <span className="text-sm font-medium">{completedSteps}/{steps.length} étapes</span>
        </div>
        <Progress value={progress} className="h-3" />
        <p className="text-sm text-muted-foreground mt-2">{progress}% complété</p>
      </Card>

      {/* Étapes détaillées */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground px-1">Étapes de l'intervention</h2>
        
        {steps.map((step, index) => {
          const isExpanded = expandedStep === step.id;
          const InputIcon = getInputTypeIcon(step.inputType);
          
          return (
            <Card 
              key={step.id}
              className={cn(
                "overflow-hidden transition-all",
                step.completed && "border-green-200 bg-green-50/30",
                isLocked && "opacity-80"
              )}
            >
              {/* En-tête de l'étape */}
              <div 
                className="p-4 cursor-pointer"
                onClick={() => setExpandedStep(isExpanded ? null : step.id)}
              >
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0",
                    step.completed 
                      ? "bg-green-500 text-white" 
                      : "bg-muted text-muted-foreground"
                  )}>
                    {step.completed ? <Check className="h-5 w-5" /> : step.order}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-foreground">{step.label}</span>
                      {step.required && (
                        <Badge variant="outline" className="text-xs">Obligatoire</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <InputIcon className="h-4 w-4" />
                      <span className="capitalize">{step.inputType}</span>
                      {step.completedAt && (
                        <span className="text-green-600">• Validé à {step.completedAt}</span>
                      )}
                    </div>
                  </div>
                  
                  {isExpanded ? (
                    <ChevronUp className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
              </div>

              {/* Contenu détaillé */}
              {isExpanded && (
                <div className="px-4 pb-4 space-y-4 border-t border-border pt-4">
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                  
                  {/* Zone de saisie */}
                  {renderStepInput(step)}

                  {/* Remarques */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Remarques (optionnel)</Label>
                    <Textarea
                      placeholder="Ajouter une remarque..."
                      value={step.remarks}
                      onChange={(e) => handleStepRemarks(step.id, e.target.value)}
                      className="min-h-[60px]"
                      disabled={isLocked}
                    />
                  </div>

                  {/* Pièces jointes */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium text-muted-foreground">Pièces jointes</Label>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleAddAttachment(step.id)}
                        disabled={isLocked}
                      >
                        <Paperclip className="h-4 w-4 mr-1" />
                        Ajouter
                      </Button>
                    </div>
                    {step.attachments.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {step.attachments.map((att, i) => (
                          <Badge key={i} variant="secondary" className="gap-1">
                            <Image className="h-3 w-3" />
                            {att}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Bouton de validation */}
                  {!step.completed && !isLocked && (
                    <Button 
                      className="w-full h-12"
                      onClick={() => handleStepComplete(step.id)}
                    >
                      <Check className="h-5 w-5 mr-2" />
                      Valider cette étape
                    </Button>
                  )}
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Commentaires généraux */}
      <Card className="p-4">
        <h2 className="text-lg font-semibold text-foreground mb-4">Commentaires</h2>
        
        {!isLocked && (
          <div className="space-y-3 mb-4">
            <Textarea
              placeholder="Ajouter un commentaire général..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-[80px]"
            />
            <Button 
              onClick={handleAddComment} 
              disabled={!comment.trim()}
              className="w-full h-12"
            >
              <MessageSquare className="h-5 w-5 mr-2" />
              Ajouter le commentaire
            </Button>
          </div>
        )}

        {comments.length > 0 && (
          <div className="space-y-3">
            {comments.map((c, index) => (
              <div key={index} className="bg-muted/30 p-3 rounded-lg">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="font-medium text-foreground">{c.user}</span>
                  <span className="text-muted-foreground">{c.date}</span>
                </div>
                <p className="text-sm text-foreground">{c.text}</p>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Bouton diagnostic */}
      {!isLocked && (
        <Button 
          variant="outline" 
          className="w-full h-14 text-base"
          onClick={() => navigate(`/tablet/diagnostic?equipment=${intervention.equipmentCode}&intervention=${intervention.id}`)}
        >
          <Plus className="h-5 w-5 mr-2" />
          Signaler une anomalie
        </Button>
      )}

      {/* Modal de signature */}
      {showSignature && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md p-6 space-y-4">
            <h2 className="text-xl font-bold text-foreground text-center">Validation finale</h2>
            <p className="text-sm text-muted-foreground text-center">
              En validant, vous confirmez avoir réalisé toutes les étapes de l'intervention. 
              L'intervention sera verrouillée et ne pourra plus être modifiée.
            </p>
            
            <div className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-4 text-center">
              <canvas 
                ref={canvasRef}
                className="w-full h-32 bg-white rounded"
              />
              <p className="text-xs text-muted-foreground mt-2">Zone de signature (simulation)</p>
            </div>

            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1 h-12"
                onClick={() => setShowSignature(false)}
              >
                Annuler
              </Button>
              <Button 
                className="flex-1 h-12 bg-green-600 hover:bg-green-700"
                onClick={handleSignAndValidate}
              >
                <Lock className="h-5 w-5 mr-2" />
                Signer et valider
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default TabletInterventionDetail;
