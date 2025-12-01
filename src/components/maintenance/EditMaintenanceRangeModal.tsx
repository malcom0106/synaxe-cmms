import React, { useState } from 'react';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Info, Search, Wrench, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MaintenanceAction {
  id: string;
  title: string;
  description: string;
  checked: boolean;
}

interface EditMaintenanceRangeModalProps {
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
    actions: Array<{ id: number; title: string; description: string }>;
  };
}

export const EditMaintenanceRangeModal: React.FC<EditMaintenanceRangeModalProps> = ({
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
  });

  const [actions, setActions] = useState<MaintenanceAction[]>(
    rangeData.actions.map((action) => ({
      id: action.id.toString(),
      title: action.title,
      description: action.description,
      checked: true,
    }))
  );

  const [searchQuery, setSearchQuery] = useState('');

  const filteredActions = actions.filter(
    (action) =>
      action.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      action.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedActionsCount = actions.filter((a) => a.checked).length;

  const handleSubmit = () => {
    if (!formData.name || !formData.operationType || !formData.frequency) {
      toast({
        title: 'Erreur',
        description: 'Veuillez remplir tous les champs requis',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Modifications enregistrées',
      description: 'La gamme de maintenance a été mise à jour avec succès',
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Wrench className="h-5 w-5 text-primary" />
            Modifier la gamme de maintenance
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-2">
            Modifiez les informations pour mettre à jour cette gamme de maintenance dans le système.
          </p>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Général */}
          <div>
            {/* Nom du programme */}
            <div className="space-y-2 mb-4">
              <Label htmlFor="name">
                Nom du programme <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Maintenance moteur mensuelle"
              />
            </div>

            {/* Type d'opération et Périodicité */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor="operation-type">
                  Type d'opération <span className="text-red-500">*</span>
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

              <div className="space-y-2">
                <Label htmlFor="frequency">
                  Périodicité <span className="text-red-500">*</span>
                </Label>
                <Select value={formData.frequency} onValueChange={(value) => setFormData({ ...formData, frequency: value })}>
                  <SelectTrigger id="frequency">
                    <SelectValue />
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
            </div>

            {/* Description */}
            <div className="space-y-2 mb-4">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Description détaillée du programme (optionnel)"
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
          </div>

          {/* Équipements concernés */}
          <div>
            <h3 className="text-sm font-medium text-foreground mb-4">Équipements concernés</h3>
            
            <div className="grid grid-cols-2 gap-4 mb-3">
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
                Si aucune famille n'est sélectionnée, ce programme s'appliquera à tous les équipements
              </p>
            </div>
          </div>

          {/* Actions de maintenance */}
          <div>
            <h3 className="text-sm font-medium text-foreground mb-4">
              Actions de maintenance
            </h3>

            <div className="space-y-3">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Sélectionner les actions à effectuer :"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button type="button" size="sm" className="flex-shrink-0">
                  <Plus className="h-4 w-4 mr-2" />
                  Créer une action
                </Button>
              </div>

              <div className="border border-border rounded-lg p-4 space-y-3 max-h-64 overflow-y-auto">
                {filteredActions.map((action) => (
                  <div key={action.id} className="flex items-start gap-3">
                    <Checkbox
                      id={`action-${action.id}`}
                      checked={action.checked}
                      onCheckedChange={(checked) => {
                        setActions(
                          actions.map((a) =>
                            a.id === action.id ? { ...a, checked: checked as boolean } : a
                          )
                        );
                      }}
                    />
                    <div className="flex-1">
                      <Label
                        htmlFor={`action-${action.id}`}
                        className="text-sm font-medium cursor-pointer"
                      >
                        {action.title}
                      </Label>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {action.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-xs text-muted-foreground">
                {selectedActionsCount} action(s) sélectionnée(s)
              </p>

              <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-blue-900">
                  Les actions sélectionnées seront automatiquement ajoutées aux interventions générées
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleSubmit}>
            Enregistrer les modifications
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
