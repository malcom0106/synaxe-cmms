import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  ArrowLeft,
  Camera, 
  Image,
  X,
  Send,
  AlertTriangle,
  Wrench,
  Search
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface Equipment {
  id: string;
  name: string;
  code: string;
  location: string;
}

const equipmentList: Equipment[] = [
  { id: 'EQ001', name: 'Oléoserveur 201', code: 'EQ001', location: 'Zone A' },
  { id: 'EQ002', name: 'Oléoserveur 202', code: 'EQ002', location: 'Zone A' },
  { id: 'EQ008', name: 'Compteur Zone 1', code: 'EQ008', location: 'Zone 1' },
  { id: 'EQ015', name: 'Pompe principale Zone A', code: 'EQ015', location: 'Zone A' },
  { id: 'EQ022', name: 'Filtre Station B', code: 'EQ022', location: 'Zone B' },
  { id: 'EQ033', name: 'Vanne de sécurité', code: 'EQ033', location: 'Zone B' },
];

const TabletDiagnostic: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const preselectedEquipment = searchParams.get('equipment');
  const linkedIntervention = searchParams.get('intervention');

  const [selectedEquipment, setSelectedEquipment] = useState<string>(preselectedEquipment || '');
  const [equipmentSearch, setEquipmentSearch] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<string>('medium');
  const [photos, setPhotos] = useState<string[]>([]);

  const filteredEquipment = equipmentList.filter(eq =>
    eq.name.toLowerCase().includes(equipmentSearch.toLowerCase()) ||
    eq.code.toLowerCase().includes(equipmentSearch.toLowerCase())
  );

  const selectedEquipmentData = equipmentList.find(eq => eq.code === selectedEquipment);

  const handleTakePhoto = () => {
    // Simulation de prise de photo
    toast({ 
      title: "Fonction photo",
      description: "La prise de photo sera disponible sur l'application native"
    });
    // Simuler l'ajout d'une photo
    setPhotos([...photos, `photo_${photos.length + 1}.jpg`]);
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!selectedEquipment || !title || !description) {
      toast({ 
        title: "Formulaire incomplet",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    toast({ 
      title: "Diagnostic enregistré",
      description: "Votre demande d'intervention a été créée avec succès"
    });
    
    navigate('/tablet/requests');
  };

  return (
    <div className="p-4 pb-8 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="h-12 w-12"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-foreground">Nouveau diagnostic</h1>
          <p className="text-sm text-muted-foreground">Signaler une anomalie ou un problème</p>
        </div>
      </div>

      {linkedIntervention && (
        <Card className="p-3 bg-primary/5 border-primary/20">
          <div className="flex items-center gap-2 text-sm">
            <Wrench className="h-4 w-4 text-primary" />
            <span className="text-muted-foreground">Lié à l'intervention:</span>
            <Badge variant="outline">{linkedIntervention}</Badge>
          </div>
        </Card>
      )}

      {/* Sélection équipement */}
      <Card className="p-4 space-y-4">
        <div>
          <Label className="text-base font-medium">Équipement concerné *</Label>
          {!selectedEquipment ? (
            <div className="mt-2 space-y-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un équipement..."
                  value={equipmentSearch}
                  onChange={(e) => setEquipmentSearch(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>
              <div className="max-h-48 overflow-y-auto space-y-1">
                {filteredEquipment.map((eq) => (
                  <div
                    key={eq.id}
                    className="p-3 bg-muted/30 rounded-lg cursor-pointer hover:bg-muted/50 active:scale-[0.98] transition-all"
                    onClick={() => setSelectedEquipment(eq.code)}
                  >
                    <div className="font-medium">{eq.name}</div>
                    <div className="text-sm text-muted-foreground">{eq.code} - {eq.location}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-2 p-3 bg-primary/5 border border-primary/20 rounded-lg flex items-center justify-between">
              <div>
                <div className="font-medium">{selectedEquipmentData?.name}</div>
                <div className="text-sm text-muted-foreground">
                  {selectedEquipmentData?.code} - {selectedEquipmentData?.location}
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setSelectedEquipment('')}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Détails du diagnostic */}
      <Card className="p-4 space-y-4">
        <div>
          <Label htmlFor="title" className="text-base font-medium">Titre du problème *</Label>
          <Input
            id="title"
            placeholder="Ex: Fuite détectée sur raccord B2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-2 h-12"
          />
        </div>

        <div>
          <Label htmlFor="description" className="text-base font-medium">Description détaillée *</Label>
          <Textarea
            id="description"
            placeholder="Décrivez le problème observé..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-2 min-h-[120px] text-base"
          />
        </div>

        <div>
          <Label className="text-base font-medium">Priorité</Label>
          <Select value={priority} onValueChange={setPriority}>
            <SelectTrigger className="mt-2 h-12">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  Basse - Peut attendre
                </div>
              </SelectItem>
              <SelectItem value="medium">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  Moyenne - À traiter rapidement
                </div>
              </SelectItem>
              <SelectItem value="high">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-orange-500" />
                  Haute - Urgent
                </div>
              </SelectItem>
              <SelectItem value="critical">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  Critique - Arrêt immédiat requis
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Photos */}
      <Card className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-base font-medium">Photos</Label>
          <Button variant="outline" onClick={handleTakePhoto}>
            <Camera className="h-5 w-5 mr-2" />
            Prendre photo
          </Button>
        </div>

        {photos.length > 0 ? (
          <div className="grid grid-cols-3 gap-2">
            {photos.map((photo, index) => (
              <div 
                key={index} 
                className="relative aspect-square bg-muted rounded-lg flex items-center justify-center"
              >
                <Image className="h-8 w-8 text-muted-foreground" />
                <span className="absolute bottom-1 left-1 text-xs text-muted-foreground">{photo}</span>
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-1 right-1 h-6 w-6"
                  onClick={() => handleRemovePhoto(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 border-2 border-dashed border-muted-foreground/20 rounded-lg text-center">
            <Camera className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">Aucune photo ajoutée</p>
          </div>
        )}
      </Card>

      {/* Bouton de soumission */}
      <Button 
        className="w-full h-14 text-lg font-semibold"
        onClick={handleSubmit}
      >
        <Send className="h-5 w-5 mr-2" />
        Envoyer le diagnostic
      </Button>
    </div>
  );
};

export default TabletDiagnostic;
