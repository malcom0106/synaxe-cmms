import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Settings, Save, Plus } from 'lucide-react';

interface MaintenanceActionData {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
}

interface EditMaintenanceActionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  action: MaintenanceActionData | null;
  onSave: (data: MaintenanceActionData) => void;
}

const EditMaintenanceActionModal: React.FC<EditMaintenanceActionModalProps> = ({
  open,
  onOpenChange,
  action,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (action) {
      setName(action.name);
      setDescription(action.description);
      setIsActive(action.isActive);
    }
  }, [action]);

  const handleSave = () => {
    if (action) {
      onSave({
        ...action,
        name,
        description,
        isActive,
      });
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
            <Settings className="h-5 w-5 text-primary" />
            Modifier l'action
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Nom de l'action */}
          <div className="space-y-2">
            <Label htmlFor="action-name">
              Nom de l'action <span className="text-destructive">*</span>
            </Label>
            <Input
              id="action-name"
              value={name}
              onChange={(e) => setName(e.target.value.slice(0, 100))}
              placeholder="Nom de l'action"
              className="border-primary/50 focus:border-primary"
            />
            <p className="text-xs text-muted-foreground">
              {name.length}/100 caractères
            </p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="action-description">Description</Label>
            <Textarea
              id="action-description"
              value={description}
              onChange={(e) => setDescription(e.target.value.slice(0, 500))}
              placeholder="Description de l'action"
              rows={4}
              className="resize-y"
            />
            <p className="text-xs text-muted-foreground">
              {description.length}/500 caractères
            </p>
          </div>

          {/* Variables personnalisées */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Variables personnalisées</Label>
              <Button variant="outline" size="sm" className="text-xs">
                <Plus className="h-3 w-3 mr-1" />
                Ajouter une variable
              </Button>
            </div>
            <div className="rounded-lg border border-border bg-muted/20 p-4 text-center">
              <p className="text-sm text-muted-foreground">
                Aucune variable personnalisée définie. Ajoutez des variables pour définir les données à collecter lors de l'exécution de cette action.
              </p>
            </div>
          </div>

          {/* Statut actif */}
          <div className="space-y-2">
            <Label>Statut actif</Label>
            <div className="flex items-center">
              <Switch
                checked={isActive}
                onCheckedChange={setIsActive}
              />
            </div>
          </div>

          {/* Exemples d'actions courantes */}
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
            <p className="font-medium text-sm text-foreground mb-2">
              Exemples d'actions courantes
            </p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Inspection visuelle : Contrôle visuel général de l'équipement</li>
              <li>• Lubrification : Lubrification des parties mobiles et roulements</li>
              <li>• Nettoyage : Nettoyage et dégraissage complet</li>
              <li>• Contrôle température : Vérification des températures de fonctionnement</li>
              <li>• Test fonctionnel : Test de bon fonctionnement général</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button 
            onClick={handleSave}
            className="bg-primary hover:bg-primary/90"
            disabled={!name.trim()}
          >
            <Save className="h-4 w-4 mr-2" />
            Enregistrer les modifications
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditMaintenanceActionModal;
