import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  Search,
  ClipboardList,
  FileText,
  Link as LinkIcon,
  CheckCircle2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface Equipment {
  id: string;
  name: string;
  code: string;
  location: string;
  status: 'operational' | 'maintenance' | 'stopped';
}

interface MaintenanceRange {
  id: string;
  name: string;
  code: string;
  family: string;
}

interface ChecklistItem {
  id: string;
  label: string;
  checked: boolean;
  observation: string;
}

const equipmentList: Equipment[] = [
  { id: 'EQ001', name: 'Oléoserveur 201', code: 'EQ001', location: 'Zone A', status: 'operational' },
  { id: 'EQ002', name: 'Oléoserveur 202', code: 'EQ002', location: 'Zone A', status: 'operational' },
  { id: 'EQ008', name: 'Compteur Zone 1', code: 'EQ008', location: 'Zone 1', status: 'maintenance' },
  { id: 'EQ015', name: 'Pompe principale Zone A', code: 'EQ015', location: 'Zone A', status: 'operational' },
  { id: 'EQ022', name: 'Filtre Station B', code: 'EQ022', location: 'Zone B', status: 'operational' },
  { id: 'EQ033', name: 'Vanne de sécurité', code: 'EQ033', location: 'Zone B', status: 'stopped' },
];

const maintenanceRanges: MaintenanceRange[] = [
  { id: 'GM001', name: 'Maintenance préventive mensuelle', code: 'MP-OLEO-M', family: 'Oléoserveur' },
  { id: 'GM002', name: 'Contrôle visuel hebdomadaire', code: 'CV-POMP-H', family: 'Pompe' },
  { id: 'GM003', name: 'Calibration compteurs', code: 'CAL-COMP-T', family: 'Compteur' },
  { id: 'GM004', name: 'Remplacement joint d\'urgence', code: 'RJ-URG', family: 'Général' },
  { id: 'GM005', name: 'Diagnostic vibrations', code: 'DIAG-VIB', family: 'Général' },
];

const defaultChecklist: ChecklistItem[] = [
  { id: 'c1', label: 'Inspection visuelle réalisée', checked: false, observation: '' },
  { id: 'c2', label: 'Bruit anormal détecté', checked: false, observation: '' },
  { id: 'c3', label: 'Fuite visible', checked: false, observation: '' },
  { id: 'c4', label: 'Vibrations excessives', checked: false, observation: '' },
  { id: 'c5', label: 'Température anormale', checked: false, observation: '' },
  { id: 'c6', label: 'Usure visible des pièces', checked: false, observation: '' },
  { id: 'c7', label: 'Connexions électriques OK', checked: false, observation: '' },
  { id: 'c8', label: 'Niveau fluide vérifié', checked: false, observation: '' },
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
  const [diagnosticType, setDiagnosticType] = useState<'checklist' | 'free'>('checklist');
  const [checklist, setChecklist] = useState<ChecklistItem[]>(defaultChecklist);
  const [freeObservation, setFreeObservation] = useState('');
  const [selectedRange, setSelectedRange] = useState<string>('');
  const [rangeSearch, setRangeSearch] = useState('');

  const filteredEquipment = equipmentList.filter(eq =>
    eq.name.toLowerCase().includes(equipmentSearch.toLowerCase()) ||
    eq.code.toLowerCase().includes(equipmentSearch.toLowerCase())
  );

  const filteredRanges = maintenanceRanges.filter(range =>
    range.name.toLowerCase().includes(rangeSearch.toLowerCase()) ||
    range.code.toLowerCase().includes(rangeSearch.toLowerCase())
  );

  const selectedEquipmentData = equipmentList.find(eq => eq.code === selectedEquipment);
  const selectedRangeData = maintenanceRanges.find(r => r.id === selectedRange);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'operational':
        return <Badge className="bg-green-100 text-green-800">Opérationnel</Badge>;
      case 'maintenance':
        return <Badge className="bg-orange-100 text-orange-800">En maintenance</Badge>;
      case 'stopped':
        return <Badge className="bg-red-100 text-red-800">Arrêté</Badge>;
      default:
        return null;
    }
  };

  const handleChecklistToggle = (id: string) => {
    setChecklist(checklist.map(item =>
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const handleChecklistObservation = (id: string, observation: string) => {
    setChecklist(checklist.map(item =>
      item.id === id ? { ...item, observation } : item
    ));
  };

  const handleTakePhoto = () => {
    toast({ 
      title: "Fonction photo",
      description: "La prise de photo sera disponible sur l'application native"
    });
    setPhotos([...photos, `photo_${photos.length + 1}.jpg`]);
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const canPlanIntervention = () => {
    if (!selectedEquipmentData) return true;
    // Ne peut pas planifier si équipement en cours d'utilisation (simulé par statut)
    return selectedEquipmentData.status !== 'stopped';
  };

  const handleSubmit = () => {
    if (!selectedEquipment || !title) {
      toast({ 
        title: "Formulaire incomplet",
        description: "Veuillez sélectionner un équipement et saisir un titre",
        variant: "destructive"
      });
      return;
    }

    if (diagnosticType === 'checklist') {
      const hasObservations = checklist.some(item => item.checked);
      if (!hasObservations) {
        toast({ 
          title: "Diagnostic incomplet",
          description: "Veuillez cocher au moins un élément de la checklist",
          variant: "destructive"
        });
        return;
      }
    } else if (!freeObservation.trim()) {
      toast({ 
        title: "Diagnostic incomplet",
        description: "Veuillez saisir une observation",
        variant: "destructive"
      });
      return;
    }

    toast({ 
      title: "Demande d'intervention créée",
      description: "Le diagnostic a été enregistré et transmis à la supervision"
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
          <h1 className="text-xl font-bold text-foreground">Nouvelle demande d'intervention</h1>
          <p className="text-sm text-muted-foreground">Signaler une anomalie avec diagnostic</p>
        </div>
      </div>

      {linkedIntervention && (
        <Card className="p-3 bg-primary/5 border-primary/20">
          <div className="flex items-center gap-2 text-sm">
            <LinkIcon className="h-4 w-4 text-primary" />
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
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{eq.name}</div>
                        <div className="text-sm text-muted-foreground">{eq.code} - {eq.location}</div>
                      </div>
                      {getStatusBadge(eq.status)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-2 p-3 bg-primary/5 border border-primary/20 rounded-lg flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{selectedEquipmentData?.name}</span>
                  {selectedEquipmentData && getStatusBadge(selectedEquipmentData.status)}
                </div>
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

          {selectedEquipmentData?.status === 'stopped' && (
            <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-5 w-5" />
              <span className="text-sm">Équipement actuellement arrêté - Planification bloquée</span>
            </div>
          )}
        </div>
      </Card>

      {/* Informations de la DI */}
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
          <Label htmlFor="description" className="text-base font-medium">Description (optionnel)</Label>
          <Textarea
            id="description"
            placeholder="Décrivez brièvement le contexte..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-2 min-h-[80px]"
          />
        </div>

        <div>
          <Label className="text-base font-medium">Niveau de criticité *</Label>
          <RadioGroup value={priority} onValueChange={setPriority} className="mt-2 grid grid-cols-2 gap-2">
            <div className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-muted/30">
              <RadioGroupItem value="low" id="low" />
              <Label htmlFor="low" className="cursor-pointer flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                Basse
              </Label>
            </div>
            <div className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-muted/30">
              <RadioGroupItem value="medium" id="medium" />
              <Label htmlFor="medium" className="cursor-pointer flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                Moyenne
              </Label>
            </div>
            <div className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-muted/30">
              <RadioGroupItem value="high" id="high" />
              <Label htmlFor="high" className="cursor-pointer flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-500" />
                Haute
              </Label>
            </div>
            <div className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-muted/30">
              <RadioGroupItem value="critical" id="critical" />
              <Label htmlFor="critical" className="cursor-pointer flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                Critique
              </Label>
            </div>
          </RadioGroup>
        </div>
      </Card>

      {/* Diagnostic */}
      <Card className="p-4 space-y-4">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <ClipboardList className="h-5 w-5" />
          Diagnostic
        </h2>

        <Tabs value={diagnosticType} onValueChange={(v) => setDiagnosticType(v as 'checklist' | 'free')}>
          <TabsList className="grid grid-cols-2 h-12">
            <TabsTrigger value="checklist" className="h-10">
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Checklist
            </TabsTrigger>
            <TabsTrigger value="free" className="h-10">
              <FileText className="h-4 w-4 mr-2" />
              Libre
            </TabsTrigger>
          </TabsList>

          <TabsContent value="checklist" className="mt-4 space-y-2">
            {checklist.map((item) => (
              <div key={item.id} className="space-y-2">
                <div 
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all",
                    item.checked ? "bg-orange-50 border border-orange-200" : "bg-muted/30"
                  )}
                  onClick={() => handleChecklistToggle(item.id)}
                >
                  <Checkbox 
                    checked={item.checked}
                    className="h-6 w-6"
                  />
                  <span className={cn(
                    "flex-1",
                    item.checked && "font-medium text-orange-800"
                  )}>
                    {item.label}
                  </span>
                </div>
                {item.checked && (
                  <Input
                    placeholder="Précision (optionnel)..."
                    value={item.observation}
                    onChange={(e) => handleChecklistObservation(item.id, e.target.value)}
                    className="ml-9"
                  />
                )}
              </div>
            ))}
          </TabsContent>

          <TabsContent value="free" className="mt-4">
            <Textarea
              placeholder="Décrivez en détail les observations du diagnostic..."
              value={freeObservation}
              onChange={(e) => setFreeObservation(e.target.value)}
              className="min-h-[150px] text-base"
            />
          </TabsContent>
        </Tabs>
      </Card>

      {/* Liaison gamme */}
      <Card className="p-4 space-y-4">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <LinkIcon className="h-5 w-5" />
          Lier à une gamme de maintenance
        </h2>

        {!selectedRange ? (
          <div className="space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Rechercher une gamme..."
                value={rangeSearch}
                onChange={(e) => setRangeSearch(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
            <div className="max-h-40 overflow-y-auto space-y-1">
              {filteredRanges.map((range) => (
                <div
                  key={range.id}
                  className="p-3 bg-muted/30 rounded-lg cursor-pointer hover:bg-muted/50 active:scale-[0.98] transition-all"
                  onClick={() => setSelectedRange(range.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{range.name}</div>
                      <div className="text-sm text-muted-foreground">{range.code}</div>
                    </div>
                    <Badge variant="outline">{range.family}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg flex items-center justify-between">
            <div>
              <div className="font-medium">{selectedRangeData?.name}</div>
              <div className="text-sm text-muted-foreground">{selectedRangeData?.code}</div>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setSelectedRange('')}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        )}
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
        disabled={!canPlanIntervention()}
      >
        <Send className="h-5 w-5 mr-2" />
        Créer la demande d'intervention
      </Button>

      {!canPlanIntervention() && (
        <p className="text-center text-sm text-red-600">
          Impossible de planifier : équipement actuellement arrêté
        </p>
      )}
    </div>
  );
};

export default TabletDiagnostic;
