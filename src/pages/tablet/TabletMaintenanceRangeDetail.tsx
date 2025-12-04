import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { 
  ArrowLeft, 
  Calendar as CalendarIcon, 
  Clock, 
  Wrench,
  FileText,
  CheckCircle2,
  PlayCircle,
  Search,
  ChevronDown,
  ChevronUp,
  Zap,
  User
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface MaintenanceStep {
  id: string;
  order: number;
  label: string;
  description: string;
  inputType: 'boolean' | 'numeric' | 'comment' | 'photo' | 'checkbox';
  required: boolean;
  unit?: string;
}

interface MaintenanceRangeDetail {
  id: string;
  name: string;
  code: string;
  family: string;
  subFamily: string;
  frequency: string;
  estimatedTime: string;
  description: string;
  steps: MaintenanceStep[];
  applicableEquipment: { id: string; name: string; code: string; location: string }[];
}

const maintenanceRangesData: Record<string, MaintenanceRangeDetail> = {
  'GM001': {
    id: 'GM001',
    name: 'Maintenance préventive mensuelle',
    code: 'MP-OLEO-M',
    family: 'Oléoserveur',
    subFamily: 'Pompe',
    frequency: 'Mensuel',
    estimatedTime: '2h',
    description: 'Procédure complète de maintenance préventive mensuelle pour les oléoserveurs. Inclut la vérification des niveaux, le contrôle des connexions et les tests de performance.',
    steps: [
      { id: 's1', order: 1, label: 'Vérifier le niveau d\'huile', description: 'Contrôler le niveau dans le réservoir principal', inputType: 'boolean', required: true },
      { id: 's2', order: 2, label: 'Relever la pression', description: 'Mesurer la pression du circuit hydraulique', inputType: 'numeric', required: true, unit: 'bar' },
      { id: 's3', order: 3, label: 'Contrôler les connexions électriques', description: 'Vérifier visuellement l\'état des câbles', inputType: 'boolean', required: true },
      { id: 's4', order: 4, label: 'Photo du compteur', description: 'Prendre une photo du compteur', inputType: 'photo', required: true },
      { id: 's5', order: 5, label: 'Tester les capteurs de pression', description: 'Vérifier le bon fonctionnement des capteurs', inputType: 'boolean', required: true },
      { id: 's6', order: 6, label: 'Nettoyer les filtres', description: 'Nettoyer ou remplacer si nécessaire', inputType: 'checkbox', required: true },
      { id: 's7', order: 7, label: 'Vérifier l\'étanchéité', description: 'Contrôler l\'absence de fuites', inputType: 'boolean', required: true },
      { id: 's8', order: 8, label: 'Observations générales', description: 'Noter toute observation', inputType: 'comment', required: false },
    ],
    applicableEquipment: [
      { id: 'EQ001', name: 'Oléoserveur 201', code: 'EQ001', location: 'Zone A' },
      { id: 'EQ002', name: 'Oléoserveur 202', code: 'EQ002', location: 'Zone A' },
      { id: 'EQ003', name: 'Oléoserveur 203', code: 'EQ003', location: 'Zone B' },
    ]
  },
  'GM002': {
    id: 'GM002',
    name: 'Contrôle visuel hebdomadaire',
    code: 'CV-POMP-H',
    family: 'Pompe',
    subFamily: 'Principale',
    frequency: 'Hebdomadaire',
    estimatedTime: '30min',
    description: 'Inspection visuelle rapide pour détecter les anomalies évidentes.',
    steps: [
      { id: 's1', order: 1, label: 'Inspecter les joints', description: 'Vérifier l\'état des joints', inputType: 'boolean', required: true },
      { id: 's2', order: 2, label: 'Écouter les bruits', description: 'Détecter tout bruit anormal', inputType: 'boolean', required: true },
      { id: 's3', order: 3, label: 'Vérifier les vibrations', description: 'Contrôler les vibrations', inputType: 'boolean', required: true },
      { id: 's4', order: 4, label: 'Contrôler la température', description: 'Vérifier la température', inputType: 'numeric', required: true, unit: '°C' },
      { id: 's5', order: 5, label: 'Observations', description: 'Noter les observations', inputType: 'comment', required: false },
    ],
    applicableEquipment: [
      { id: 'EQ015', name: 'Pompe principale Zone A', code: 'EQ015', location: 'Zone A' },
      { id: 'EQ016', name: 'Pompe secondaire Zone A', code: 'EQ016', location: 'Zone A' },
      { id: 'EQ017', name: 'Pompe principale Zone B', code: 'EQ017', location: 'Zone B' },
    ]
  },
  'GM003': {
    id: 'GM003',
    name: 'Calibration compteurs',
    code: 'CAL-COMP-T',
    family: 'Compteur',
    subFamily: 'Débit',
    frequency: 'Trimestriel',
    estimatedTime: '1h30',
    description: 'Calibration et vérification de la précision des compteurs de débit.',
    steps: [
      { id: 's1', order: 1, label: 'Préparer l\'équipement', description: 'Rassembler le matériel', inputType: 'checkbox', required: true },
      { id: 's2', order: 2, label: 'Relever valeur initiale', description: 'Noter la valeur avant calibration', inputType: 'numeric', required: true, unit: 'L/min' },
      { id: 's3', order: 3, label: 'Effectuer la calibration', description: 'Suivre la procédure', inputType: 'boolean', required: true },
      { id: 's4', order: 4, label: 'Relever valeur finale', description: 'Noter la valeur après', inputType: 'numeric', required: true, unit: 'L/min' },
      { id: 's5', order: 5, label: 'Commentaire de validation', description: 'Décrire le résultat', inputType: 'comment', required: true },
    ],
    applicableEquipment: [
      { id: 'EQ008', name: 'Compteur Zone 1', code: 'EQ008', location: 'Zone 1' },
      { id: 'EQ009', name: 'Compteur Zone 2', code: 'EQ009', location: 'Zone 2' },
    ]
  },
};

const getInputTypeLabel = (type: string) => {
  switch (type) {
    case 'boolean': return 'Oui/Non';
    case 'numeric': return 'Valeur numérique';
    case 'comment': return 'Commentaire';
    case 'photo': return 'Photo';
    case 'checkbox': return 'Case à cocher';
    default: return type;
  }
};

const TabletMaintenanceRangeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const range = id ? maintenanceRangesData[id] : null;
  
  const [showSteps, setShowSteps] = useState(true);
  const [showEquipment, setShowEquipment] = useState(false);
  const [showQuickPlan, setShowQuickPlan] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);
  const [plannedDate, setPlannedDate] = useState<Date | undefined>(new Date());
  const [equipmentSearch, setEquipmentSearch] = useState('');

  if (!range) {
    return (
      <div className="p-4 text-center">
        <h2 className="text-xl font-semibold mb-4">Gamme introuvable</h2>
        <Button onClick={() => navigate('/tablet/ranges')}>Retour aux gammes</Button>
      </div>
    );
  }

  const filteredEquipment = range.applicableEquipment.filter(eq =>
    eq.name.toLowerCase().includes(equipmentSearch.toLowerCase()) ||
    eq.code.toLowerCase().includes(equipmentSearch.toLowerCase())
  );

  const handleSelectEquipment = (eqId: string) => {
    setSelectedEquipment(prev =>
      prev.includes(eqId) ? prev.filter(id => id !== eqId) : [...prev, eqId]
    );
  };

  const handleSelectAllEquipment = () => {
    if (selectedEquipment.length === filteredEquipment.length) {
      setSelectedEquipment([]);
    } else {
      setSelectedEquipment(filteredEquipment.map(eq => eq.id));
    }
  };

  const handleGeneratePlan = () => {
    if (selectedEquipment.length === 0) {
      toast({
        title: "Sélection requise",
        description: "Veuillez sélectionner au moins un équipement",
        variant: "destructive"
      });
      return;
    }

    if (!plannedDate) {
      toast({
        title: "Date requise",
        description: "Veuillez sélectionner une date de planification",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Interventions générées",
      description: `${selectedEquipment.length} intervention(s) planifiée(s) pour le ${format(plannedDate, 'dd/MM/yyyy', { locale: fr })}`
    });

    setShowQuickPlan(false);
    setSelectedEquipment([]);
    navigate('/tablet/plan');
  };

  const handleStartImmediate = (equipmentId: string) => {
    toast({
      title: "Intervention démarrée",
      description: "Redirection vers l'exécution..."
    });
    // Simuler la création d'une intervention et rediriger
    navigate(`/tablet/intervention/INT001`);
  };

  return (
    <div className="p-4 pb-8 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="h-12 w-12"
          onClick={() => navigate('/tablet/ranges')}
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-foreground">{range.name}</h1>
          <p className="text-sm text-muted-foreground font-mono">{range.code}</p>
        </div>
      </div>

      {/* Informations générales */}
      <Card className="p-4 space-y-3">
        <div className="flex flex-wrap gap-2">
          <Badge className="bg-primary/10 text-primary">{range.frequency}</Badge>
          <Badge variant="outline">{range.family}</Badge>
          <Badge variant="outline">{range.subFamily}</Badge>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {range.estimatedTime}
          </div>
          <div className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            {range.steps.length} étapes
          </div>
          <div className="flex items-center gap-1">
            <Wrench className="h-4 w-4" />
            {range.applicableEquipment.length} équipements
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground">{range.description}</p>
      </Card>

      {/* Bouton génération rapide */}
      <Button 
        className="w-full h-14 text-base"
        onClick={() => setShowQuickPlan(true)}
      >
        <Zap className="h-5 w-5 mr-2" />
        Générer un plan rapidement
      </Button>

      {/* Étapes de la gamme */}
      <Card className="overflow-hidden">
        <div 
          className="p-4 flex items-center justify-between cursor-pointer bg-muted/30"
          onClick={() => setShowSteps(!showSteps)}
        >
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Étapes de la procédure
          </h2>
          {showSteps ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </div>
        
        {showSteps && (
          <div className="p-4 pt-0 space-y-2">
            {range.steps.map((step) => (
              <div 
                key={step.id}
                className="flex items-start gap-3 p-3 bg-muted/20 rounded-lg"
              >
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {step.order}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-foreground">{step.label}</span>
                    {step.required && (
                      <Badge variant="outline" className="text-xs">Obligatoire</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">{step.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs">
                      {getInputTypeLabel(step.inputType)}
                    </Badge>
                    {step.unit && (
                      <Badge variant="secondary" className="text-xs">
                        {step.unit}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Équipements applicables */}
      <Card className="overflow-hidden">
        <div 
          className="p-4 flex items-center justify-between cursor-pointer bg-muted/30"
          onClick={() => setShowEquipment(!showEquipment)}
        >
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            Équipements applicables ({range.applicableEquipment.length})
          </h2>
          {showEquipment ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </div>
        
        {showEquipment && (
          <div className="p-4 pt-0 space-y-2">
            {range.applicableEquipment.map((eq) => (
              <div 
                key={eq.id}
                className="flex items-center justify-between p-3 bg-muted/20 rounded-lg"
              >
                <div>
                  <div className="font-medium text-foreground">{eq.name}</div>
                  <div className="text-sm text-muted-foreground">{eq.code} - {eq.location}</div>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleStartImmediate(eq.id)}
                >
                  <PlayCircle className="h-4 w-4 mr-1" />
                  Exécuter
                </Button>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Modal génération rapide */}
      {showQuickPlan && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center">
          <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl m-0 sm:m-4">
            <div className="sticky top-0 bg-card p-4 border-b border-border">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-foreground">Génération rapide</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowQuickPlan(false)}
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Planifier des interventions pour la gamme "{range.name}"
              </p>
            </div>

            <div className="p-4 space-y-4">
              {/* Date de planification */}
              <div className="space-y-2">
                <Label className="text-base font-medium">Date de planification</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full h-12 justify-start text-left font-normal",
                        !plannedDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-5 w-5" />
                      {plannedDate ? format(plannedDate, "EEEE d MMMM yyyy", { locale: fr }) : "Sélectionner une date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={plannedDate}
                      onSelect={setPlannedDate}
                      initialFocus
                      className="pointer-events-auto"
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Sélection équipements */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-medium">Équipements ({selectedEquipment.length}/{range.applicableEquipment.length})</Label>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={handleSelectAllEquipment}
                  >
                    {selectedEquipment.length === filteredEquipment.length ? 'Désélectionner tout' : 'Tout sélectionner'}
                  </Button>
                </div>

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher..."
                    value={equipmentSearch}
                    onChange={(e) => setEquipmentSearch(e.target.value)}
                    className="pl-10 h-10"
                  />
                </div>

                <div className="max-h-48 overflow-y-auto space-y-1 border rounded-lg p-2">
                  {filteredEquipment.map((eq) => (
                    <div 
                      key={eq.id}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all",
                        selectedEquipment.includes(eq.id) 
                          ? "bg-primary/10 border border-primary/30" 
                          : "bg-muted/30 hover:bg-muted/50"
                      )}
                      onClick={() => handleSelectEquipment(eq.id)}
                    >
                      <Checkbox 
                        checked={selectedEquipment.includes(eq.id)}
                        className="h-5 w-5"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-sm">{eq.name}</div>
                        <div className="text-xs text-muted-foreground">{eq.location}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Résumé */}
              {selectedEquipment.length > 0 && plannedDate && (
                <Card className="p-3 bg-green-50 border-green-200">
                  <div className="flex items-center gap-2 text-green-800">
                    <CheckCircle2 className="h-5 w-5" />
                    <span className="font-medium">
                      {selectedEquipment.length} intervention(s) à créer
                    </span>
                  </div>
                  <div className="text-sm text-green-700 mt-1">
                    Planifiées pour le {format(plannedDate, "d MMMM yyyy", { locale: fr })}
                  </div>
                </Card>
              )}
            </div>

            {/* Actions */}
            <div className="sticky bottom-0 bg-card p-4 border-t border-border flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1 h-12"
                onClick={() => setShowQuickPlan(false)}
              >
                Annuler
              </Button>
              <Button 
                className="flex-1 h-12"
                onClick={handleGeneratePlan}
                disabled={selectedEquipment.length === 0 || !plannedDate}
              >
                <Zap className="h-5 w-5 mr-2" />
                Générer ({selectedEquipment.length})
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default TabletMaintenanceRangeDetail;
