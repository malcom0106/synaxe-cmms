import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Info, Settings, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Types de périodicité
type PeriodicityType = 'temporal' | 'referential';
type ReferentialAction = 'kilometres' | 'temps' | 'litrage' | '';

interface EditGeneralInfoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rangeData: {
    name: string;
    operationType: string;
    frequency: string;
    description?: string;
    estimatedDuration?: string;
    familyEquipment?: string;
    subFamily?: string;
    periodicityType?: PeriodicityType;
    referentialAction?: ReferentialAction;
    thresholdMin?: number;
    thresholdMax?: number;
  };
}

const getReferentialUnit = (action: ReferentialAction): string => {
  switch (action) {
    case 'kilometres':
      return 'km';
    case 'temps':
      return 'h';
    case 'litrage':
      return 'L';
    default:
      return '';
  }
};

const getReferentialLabel = (action: ReferentialAction): string => {
  switch (action) {
    case 'kilometres':
      return 'Kilomètres';
    case 'temps':
      return 'Temps moteur';
    case 'litrage':
      return 'Litrage';
    default:
      return '';
  }
};

export const EditGeneralInfoModal: React.FC<EditGeneralInfoModalProps> = ({
  open,
  onOpenChange,
  rangeData,
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: rangeData.name,
    operationType: rangeData.operationType,
    frequency: rangeData.frequency,
    description: rangeData.description || '',
    estimatedDuration: rangeData.estimatedDuration?.replace('h ', ':').replace('min', '') || '',
    familyEquipment: rangeData.familyEquipment || '',
    subFamily: rangeData.subFamily || '',
    periodicityType: rangeData.periodicityType || 'temporal' as PeriodicityType,
    referentialAction: rangeData.referentialAction || '' as ReferentialAction,
    thresholdMin: rangeData.thresholdMin ?? '',
    thresholdMax: rangeData.thresholdMax ?? '',
  });

  const [validationErrors, setValidationErrors] = useState<{
    thresholdMin?: string;
    thresholdMax?: string;
  }>({});

  // Valider les seuils
  const validateThresholds = () => {
    const errors: typeof validationErrors = {};
    const min = formData.thresholdMin !== '' ? Number(formData.thresholdMin) : null;
    const max = formData.thresholdMax !== '' ? Number(formData.thresholdMax) : null;

    if (formData.periodicityType === 'referential' && formData.referentialAction) {
      if (min !== null && min < 0) {
        errors.thresholdMin = 'Le seuil minimum doit être ≥ 0';
      }
      if (max !== null && max < 0) {
        errors.thresholdMax = 'Le seuil maximum doit être ≥ 0';
      }
      if (min !== null && max !== null && min > max) {
        errors.thresholdMin = 'Le seuil minimum doit être ≤ au seuil maximum';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  useEffect(() => {
    if (formData.periodicityType === 'referential' && formData.referentialAction) {
      validateThresholds();
    } else {
      setValidationErrors({});
    }
  }, [formData.thresholdMin, formData.thresholdMax, formData.periodicityType, formData.referentialAction]);

  const handleSubmit = () => {
    if (!formData.name || !formData.operationType) {
      toast({
        title: 'Erreur',
        description: 'Veuillez remplir tous les champs requis',
        variant: 'destructive',
      });
      return;
    }

    if (formData.periodicityType === 'temporal' && !formData.frequency) {
      toast({
        title: 'Erreur',
        description: 'Veuillez sélectionner une périodicité',
        variant: 'destructive',
      });
      return;
    }

    if (formData.periodicityType === 'referential' && !formData.referentialAction) {
      toast({
        title: 'Erreur',
        description: 'Veuillez sélectionner une action référentielle',
        variant: 'destructive',
      });
      return;
    }

    if (!validateThresholds()) {
      toast({
        title: 'Erreur de validation',
        description: 'Veuillez corriger les erreurs de seuils',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Modifications enregistrées',
      description: 'Les informations générales ont été mises à jour avec succès',
    });
    onOpenChange(false);
  };

  const unit = getReferentialUnit(formData.referentialAction as ReferentialAction);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Settings className="h-5 w-5 text-primary" />
            Modifier les informations générales
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-2">
            Modifiez les informations générales de cette gamme de maintenance.
          </p>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Nom de la gamme */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Nom de la gamme <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: Maintenance moteur mensuelle"
            />
          </div>

          {/* Type d'intervention */}
          <div className="space-y-2">
            <Label htmlFor="operation-type">
              Type d'intervention <span className="text-red-500">*</span>
            </Label>
            <Select value={formData.operationType} onValueChange={(value) => setFormData({ ...formData, operationType: value })}>
              <SelectTrigger id="operation-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Préventive">Préventive</SelectItem>
                <SelectItem value="Corrective">Corrective</SelectItem>
                <SelectItem value="Prédictive">Prédictive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Type de périodicité */}
          <div className="space-y-2">
            <Label>
              Type de périodicité <span className="text-red-500">*</span>
            </Label>
            <Select 
              value={formData.periodicityType} 
              onValueChange={(value: PeriodicityType) => setFormData({ 
                ...formData, 
                periodicityType: value,
                // Reset les champs selon le type
                frequency: value === 'temporal' ? formData.frequency : '',
                referentialAction: value === 'referential' ? formData.referentialAction : '',
                thresholdMin: value === 'referential' ? formData.thresholdMin : '',
                thresholdMax: value === 'referential' ? formData.thresholdMax : '',
              })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner le type de périodicité" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="temporal">Temporelle (jour, semaine, mois...)</SelectItem>
                <SelectItem value="referential">Basée sur action référentielle</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Périodicité temporelle */}
          {formData.periodicityType === 'temporal' && (
            <div className="space-y-2">
              <Label htmlFor="frequency">
                Périodicité <span className="text-red-500">*</span>
              </Label>
              <Select value={formData.frequency} onValueChange={(value) => setFormData({ ...formData, frequency: value })}>
                <SelectTrigger id="frequency">
                  <SelectValue placeholder="Sélectionner une périodicité" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Quotidien">Quotidien</SelectItem>
                  <SelectItem value="Hebdomadaire">Hebdomadaire</SelectItem>
                  <SelectItem value="Mensuel">Mensuel</SelectItem>
                  <SelectItem value="Trimestriel">Trimestriel</SelectItem>
                  <SelectItem value="Semestriel">Semestriel</SelectItem>
                  <SelectItem value="Annuel">Annuel</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Périodicité basée sur action référentielle */}
          {formData.periodicityType === 'referential' && (
            <div className="space-y-4 p-4 border border-primary/20 rounded-lg bg-primary/5">
              <div className="space-y-2">
                <Label htmlFor="referential-action">
                  Action référentielle <span className="text-red-500">*</span>
                </Label>
                <Select 
                  value={formData.referentialAction} 
                  onValueChange={(value: ReferentialAction) => setFormData({ 
                    ...formData, 
                    referentialAction: value,
                    thresholdMin: '',
                    thresholdMax: '',
                  })}
                >
                  <SelectTrigger id="referential-action">
                    <SelectValue placeholder="Sélectionner une action référentielle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kilometres">Kilomètres</SelectItem>
                    <SelectItem value="temps">Temps moteur</SelectItem>
                    <SelectItem value="litrage">Litrage</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Champs de seuils - visibles uniquement si action référentielle sélectionnée */}
              {formData.referentialAction && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="threshold-min">
                        Seuil minimum ({unit})
                      </Label>
                      <div className="relative">
                        <Input
                          id="threshold-min"
                          type="number"
                          min="0"
                          value={formData.thresholdMin}
                          onChange={(e) => setFormData({ ...formData, thresholdMin: e.target.value })}
                          placeholder={`Ex: 10000`}
                          className={validationErrors.thresholdMin ? 'border-destructive' : ''}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                          {unit}
                        </span>
                      </div>
                      {validationErrors.thresholdMin && (
                        <p className="text-xs text-destructive flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {validationErrors.thresholdMin}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="threshold-max">
                        Seuil maximum ({unit})
                      </Label>
                      <div className="relative">
                        <Input
                          id="threshold-max"
                          type="number"
                          min="0"
                          value={formData.thresholdMax}
                          onChange={(e) => setFormData({ ...formData, thresholdMax: e.target.value })}
                          placeholder={`Ex: 50000`}
                          className={validationErrors.thresholdMax ? 'border-destructive' : ''}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                          {unit}
                        </span>
                      </div>
                      {validationErrors.thresholdMax && (
                        <p className="text-xs text-destructive flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {validationErrors.thresholdMax}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-blue-900">
                      Ces seuils seront automatiquement transmis aux actions du plan de maintenance lors de la génération.
                      L'intervention sera déclenchée lorsque la valeur de {getReferentialLabel(formData.referentialAction as ReferentialAction).toLowerCase()} 
                      {formData.thresholdMin && ` dépasse ${formData.thresholdMin} ${unit}`}
                      {formData.thresholdMin && formData.thresholdMax && ' et'}
                      {formData.thresholdMax && ` reste sous ${formData.thresholdMax} ${unit}`}.
                    </p>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Description détaillée de la gamme (optionnel)"
              rows={3}
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground">{formData.description.length}/500 caractères</p>
          </div>

          {/* Durée estimée */}
          <div className="space-y-2">
            <Label htmlFor="duration">Durée estimée (minutes)</Label>
            <Input
              id="duration"
              type="text"
              value={formData.estimatedDuration}
              onChange={(e) => setFormData({ ...formData, estimatedDuration: e.target.value })}
              placeholder="Ex: 120"
            />
            <p className="text-xs text-muted-foreground">Optionnel</p>
          </div>

          {/* Équipements concernés */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-foreground">Équipements concernés</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="family">Famille d'équipement</Label>
                <Select value={formData.familyEquipment} onValueChange={(value) => setFormData({ ...formData, familyEquipment: value })}>
                  <SelectTrigger id="family">
                    <SelectValue placeholder="Sélectionner une famille" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Camion">Camion</SelectItem>
                    <SelectItem value="Pompe">Pompe</SelectItem>
                    <SelectItem value="Compresseur">Compresseur</SelectItem>
                    <SelectItem value="Générateur">Générateur</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subfamily">Sous-famille</Label>
                <Select value={formData.subFamily} onValueChange={(value) => setFormData({ ...formData, subFamily: value })}>
                  <SelectTrigger id="subfamily">
                    <SelectValue placeholder="Sélectionner une sous-famille" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Oléoserveur">Oléoserveur</SelectItem>
                    <SelectItem value="Benne">Benne</SelectItem>
                    <SelectItem value="Citerne">Citerne</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-blue-900">
                Si aucune famille n'est sélectionnée, cette gamme s'appliquera à tous les équipements
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleSubmit}>
            Enregistrer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};