import React, { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { 
  Camera,
  CheckCircle2,
  PlayCircle,
  PauseCircle,
  Hash,
  ToggleLeft,
  FileText,
  Image,
  ChevronLeft,
  ChevronRight,
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
  completedAt?: string;
}

interface InterventionExecutionPanelProps {
  interventionId: string;
  rangeName: string;
  steps: MaintenanceStep[];
  onComplete: () => void;
  onCancel: () => void;
}

const InterventionExecutionPanel: React.FC<InterventionExecutionPanelProps> = ({ 
  interventionId,
  rangeName,
  steps: initialSteps, 
  onComplete, 
  onCancel 
}) => {
  const [steps, setSteps] = useState<MaintenanceStep[]>(initialSteps);
  const [status, setStatus] = useState<'in-progress' | 'paused'>('in-progress');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [showSignature, setShowSignature] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const completedSteps = steps.filter(s => s.completed).length;
  const progress = Math.round((completedSteps / steps.length) * 100);
  const currentStep = steps[currentStepIndex];
  const isLastStep = currentStepIndex === steps.length - 1;
  const allRequiredCompleted = steps.every(s => !s.required || s.completed);

  const handleStepValueChange = (value: any) => {
    setSteps(steps.map((s, i) => 
      i === currentStepIndex ? { ...s, value } : s
    ));
  };

  const handleValidateStep = () => {
    const step = currentStep;
    if (step.required && (step.value === null || step.value === '' || step.value === undefined)) {
      toast.error("Veuillez remplir ce champ obligatoire");
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
      setTimeout(() => setCurrentStepIndex(currentStepIndex + 1), 200);
    }
  };

  const handleCompleteExecution = () => {
    const uncompletedRequired = steps.filter(s => s.required && !s.completed);
    if (uncompletedRequired.length > 0) {
      toast.error(`${uncompletedRequired.length} étape(s) obligatoire(s) non complétée(s)`);
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
    setHasSignature(true);
  };

  const stopDrawing = () => setIsDrawing(false);

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
      toast.error("Veuillez signer avant de valider");
      return;
    }
    toast.success("Intervention terminée avec succès");
    onComplete();
  };

  const renderStepInput = () => {
    if (!currentStep) return null;

    switch (currentStep.inputType) {
      case 'boolean':
        return (
          <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
            <Label className="text-sm font-medium">Conforme ?</Label>
            <Switch
              checked={currentStep.value === true}
              onCheckedChange={handleStepValueChange}
              disabled={currentStep.completed}
            />
          </div>
        );
      case 'numeric':
        return (
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Valeur {currentStep.unit && `(${currentStep.unit})`}
            </Label>
            {currentStep.minValue !== undefined && currentStep.maxValue !== undefined && (
              <p className="text-xs text-muted-foreground">
                Plage: {currentStep.minValue} - {currentStep.maxValue} {currentStep.unit}
              </p>
            )}
            <Input
              type="number"
              placeholder={`Valeur${currentStep.unit ? ` en ${currentStep.unit}` : ''}`}
              value={currentStep.value || ''}
              onChange={(e) => handleStepValueChange(e.target.value ? parseFloat(e.target.value) : null)}
              disabled={currentStep.completed}
            />
          </div>
        );
      case 'comment':
        return (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Observation</Label>
            <Textarea
              placeholder="Entrez votre observation..."
              value={currentStep.value || ''}
              onChange={(e) => handleStepValueChange(e.target.value)}
              className="min-h-[80px]"
              disabled={currentStep.completed}
            />
          </div>
        );
      case 'photo':
        return (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Photo</Label>
            {currentStep.value ? (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                <Image className="h-4 w-4 text-green-600" />
                <span className="text-green-700 text-sm">{currentStep.value}</span>
              </div>
            ) : (
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  handleStepValueChange(`photo_${currentStepIndex + 1}.jpg`);
                  toast.success("Photo capturée");
                }}
                disabled={currentStep.completed}
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
            onClick={() => !currentStep.completed && handleStepValueChange(!currentStep.value)}
          >
            <Checkbox checked={currentStep.value === true} disabled={currentStep.completed} />
            <Label className="text-sm font-medium cursor-pointer">Tâche effectuée</Label>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Card className="p-4">
        {/* Header avec progression */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Badge className="bg-blue-100 text-blue-800">
              <PlayCircle className="h-3 w-3 mr-1" />
              Exécution
            </Badge>
            <span className="text-sm font-medium">{rangeName}</span>
          </div>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Barre de progression compacte */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-muted-foreground">Progression</span>
            <span className="font-medium">{completedSteps}/{steps.length}</span>
          </div>
          <Progress value={progress} className="h-1.5" />
          {/* Mini indicateurs d'étapes */}
          <div className="flex gap-0.5 mt-1.5">
            {steps.map((step, index) => (
              <button
                key={step.id}
                onClick={() => setCurrentStepIndex(index)}
                className={cn(
                  "flex-1 h-1 rounded-full transition-all",
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

        {/* Étape courante - compact */}
        {currentStep && (
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <div className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0",
                currentStep.completed ? "bg-green-100 text-green-700" : "bg-primary text-primary-foreground"
              )}>
                {currentStep.completed ? <CheckCircle2 className="h-4 w-4" /> : currentStepIndex + 1}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm">{currentStep.label}</h4>
                <p className="text-xs text-muted-foreground">{currentStep.description}</p>
                {currentStep.required && (
                  <Badge variant="outline" className="text-[10px] mt-1">Obligatoire</Badge>
                )}
              </div>
            </div>

            {/* Input de l'étape */}
            <div className="pl-8">
              {renderStepInput()}
            </div>

            {/* Boutons navigation */}
            <div className="flex items-center justify-between pt-2 border-t">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setCurrentStepIndex(Math.max(0, currentStepIndex - 1))}
                disabled={currentStepIndex === 0}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Préc.
              </Button>
              
              <div className="flex gap-2">
                {!currentStep.completed && (
                  <Button size="sm" onClick={handleValidateStep}>
                    <CheckCircle2 className="h-4 w-4 mr-1" />
                    Valider
                  </Button>
                )}
                {currentStep.completed && !isLastStep && (
                  <Button 
                    size="sm"
                    onClick={() => setCurrentStepIndex(currentStepIndex + 1)}
                  >
                    Suivant
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                )}
                {allRequiredCompleted && (
                  <Button size="sm" variant="default" onClick={handleCompleteExecution}>
                    <Pen className="h-4 w-4 mr-1" />
                    Terminer
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Modal signature */}
      <Dialog open={showSignature} onOpenChange={setShowSignature}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Signature obligatoire</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Signez pour valider l'intervention {interventionId}
            </p>
            <div className="border-2 border-dashed border-muted rounded-lg p-1">
              <canvas
                ref={canvasRef}
                width={350}
                height={150}
                className="w-full bg-white rounded cursor-crosshair touch-none"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
              />
            </div>
            <Button variant="outline" size="sm" onClick={clearSignature} className="w-full">
              Effacer
            </Button>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSignature(false)}>Annuler</Button>
            <Button onClick={handleSignAndValidate} disabled={!hasSignature}>
              Signer et valider
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InterventionExecutionPanel;
