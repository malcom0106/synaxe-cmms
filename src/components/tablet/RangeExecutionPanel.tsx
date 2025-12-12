import React, { useState, useRef, useEffect } from 'react';
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
  Clock, 
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
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

type StepInputType = 'boolean' | 'numeric' | 'comment' | 'photo' | 'checkbox';

interface MaintenanceStep {
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

interface RangeExecutionPanelProps {
  range: MaintenanceRange;
  onComplete: () => void;
  onCancel: () => void;
}

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

const RangeExecutionPanel: React.FC<RangeExecutionPanelProps> = ({ 
  range, 
  onComplete, 
  onCancel 
}) => {
  const [steps, setSteps] = useState<MaintenanceStep[]>(range.steps);
  const [status, setStatus] = useState<'preview' | 'in-progress' | 'paused' | 'completed'>('preview');
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
  }, [status]);

  const completedSteps = steps.filter(s => s.completed).length;
  const progress = Math.round((completedSteps / steps.length) * 100);
  const isLocked = status === 'completed';
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
    toast.success("Photo capturée");
  };

  const handleValidateStep = () => {
    if (isLocked) return;
    const step = currentStep;

    if (step.required && (step.value === null || step.value === '' || step.value === undefined)) {
      toast.error("Veuillez remplir ce champ avant de valider");
      return;
    }

    setSteps(steps.map((s, i) => 
      i === currentStepIndex ? { 
        ...s, 
        completed: true, 
        completedAt: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
      } : s
    ));
    
    toast.success("Étape validée");

    if (!isLastStep) {
      setTimeout(() => setCurrentStepIndex(currentStepIndex + 1), 300);
    }
  };

  const handleStartExecution = () => {
    setStatus('in-progress');
    const firstIncompleteIndex = steps.findIndex(s => !s.completed);
    setCurrentStepIndex(firstIncompleteIndex !== -1 ? firstIncompleteIndex : 0);
    toast.success("Exécution démarrée");
  };

  const handleResumeExecution = () => {
    setStatus('in-progress');
    const firstIncompleteIndex = steps.findIndex(s => !s.completed);
    if (firstIncompleteIndex !== -1) {
      setCurrentStepIndex(firstIncompleteIndex);
    }
    toast.success("Exécution reprise");
  };

  const handlePauseExecution = () => {
    setStatus('paused');
    toast.success("Exécution mise en pause");
  };

  const handleCompleteExecution = () => {
    const uncompletedRequired = steps.filter(s => s.required && !s.completed);
    if (uncompletedRequired.length > 0) {
      toast.error(`${uncompletedRequired.length} étape(s) obligatoire(s) non complétée(s)`);
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
  };

  const handleSignAndValidate = () => {
    setStatus('completed');
    setShowSignature(false);
    toast.success("Gamme exécutée avec succès");
    onComplete();
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
                  toast.success("Photo capturée");
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

  // Vue preview (avant démarrage)
  if (status === 'preview') {
    return (
      <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-card p-4 border-b border-border flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-foreground">{range.name}</h2>
              <p className="text-sm text-muted-foreground font-mono">{range.code}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={onCancel}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="p-4 space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-primary/10 text-primary">{range.frequency}</Badge>
              <Badge variant="outline">{range.family}</Badge>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                {range.estimatedTime}
              </div>
            </div>

            <Card className="p-4">
              <h3 className="text-lg font-semibold text-foreground mb-3">Étapes ({steps.length})</h3>
              <div className="space-y-2">
                {steps.map((step, index) => (
                  <div 
                    key={step.id}
                    className="flex items-center gap-3 p-2 rounded-lg"
                  >
                    <div className="w-6 h-6 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </div>
                    <span className="text-sm text-foreground">{step.label}</span>
                    {step.required && (
                      <Badge variant="outline" className="text-xs ml-auto">Obligatoire</Badge>
                    )}
                  </div>
                ))}
              </div>
            </Card>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={onCancel}>
                Annuler
              </Button>
              <Button className="flex-1" onClick={handleStartExecution}>
                <PlayCircle className="h-5 w-5 mr-2" />
                Démarrer l'exécution
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Vue pause
  if (isPaused) {
    return (
      <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-card p-4 border-b border-border flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-foreground">{range.name}</h2>
              <Badge className="bg-orange-100 text-orange-800">En pause</Badge>
            </div>
            <Button variant="ghost" size="icon" onClick={onCancel}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="p-4 space-y-4">
            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-foreground">Progression</h3>
                <span className="text-sm font-medium">{completedSteps}/{steps.length} étapes</span>
              </div>
              <Progress value={progress} className="h-3" />
              <p className="text-sm text-muted-foreground mt-2">{progress}% complété</p>
            </Card>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={onCancel}>
                Quitter
              </Button>
              <Button className="flex-1" onClick={handleResumeExecution}>
                <PlayCircle className="h-5 w-5 mr-2" />
                Reprendre
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Vue active (en cours)
  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      {/* Header fixe */}
      <div className="p-4 border-b border-border bg-background">
        <div className="flex items-center gap-3 mb-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10"
            onClick={() => setStatus('paused')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-foreground">{range.name}</h1>
            <p className="text-xs text-muted-foreground">{range.code}</p>
          </div>
          <Badge className="bg-blue-100 text-blue-800">
            <PlayCircle className="h-4 w-4 mr-1" />
            En cours
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
              <p className="text-sm text-green-700">Vous pouvez maintenant finaliser l'exécution.</p>
              <Button 
                className="w-full h-14 text-lg bg-green-600 hover:bg-green-700"
                onClick={handleCompleteExecution}
              >
                <Pen className="h-6 w-6 mr-2" />
                Signer et finaliser
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
              onClick={handlePauseExecution}
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

      {/* Modal de signature */}
      {showSignature && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <Card className="w-full max-w-lg p-6 space-y-4">
            <h2 className="text-xl font-bold text-foreground text-center">Validation finale</h2>
            <p className="text-sm text-muted-foreground text-center">
              En signant, vous confirmez avoir réalisé toutes les étapes de la gamme.
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

export default RangeExecutionPanel;
