import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { 
  ArrowLeft, 
  Package,
  Save,
  MapPin,
  Layers,
  History,
  AlertTriangle,
  Wrench,
  Calendar
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PartData {
  id: string;
  internalRef: string;
  externalRef: string;
  name: string;
  family: string;
  subFamily: string;
  quantity: number;
  reservedQuantity: number;
  minQuantity: number;
  maxQuantity: number;
  warehouse: string;
  location: string;
  stockStatus: 'ok' | 'low' | 'critical' | 'expired';
  expirationDate?: string;
  lastStockUpdate?: string;
}

interface PartIntervention {
  id: string;
  equipment: string;
  gamme: string;
  type: 'Contrôle' | 'Corrective' | 'Préventive';
  operateur: string;
  datePlanifiee: string;
  dateRealisee: string | null;
  statut: 'Terminé' | 'Planifié' | 'En cours';
  quantityUsed: number;
}

interface HistoryRecord {
  id: string;
  date: string;
  time: string;
  userEmail: string;
  userInitials: string;
  field: string;
  oldValue: string;
  newValue: string;
}

const families = ['Filtres', 'Joints', 'Lubrifiants', 'Courroies', 'Roulements', 'Capteurs', 'Flexibles', 'Électrique', 'Pompes', 'Hydraulique'];
const subFamilies: Record<string, string[]> = {
  'Filtres': ['Huile', 'Air', 'Carburant', 'Hydraulique'],
  'Joints': ['Toriques', 'Plats', 'SPI', 'Mécaniques'],
  'Lubrifiants': ['Huiles', 'Graisses', 'Sprays'],
  'Courroies': ['Trapézoïdales', 'Crantées', 'Plates'],
  'Roulements': ['Billes', 'Rouleaux', 'Aiguilles'],
  'Capteurs': ['Pression', 'Température', 'Niveau', 'Débit'],
  'Flexibles': ['Hydrauliques', 'Pneumatiques'],
  'Électrique': ['Contacteurs', 'Relais', 'Fusibles', 'Câbles'],
  'Pompes': ['Kits réparation', 'Pistons', 'Joints'],
  'Hydraulique': ['Tuyaux', 'Raccords', 'Valves'],
};
const warehouses = ['Magasin Principal', 'Magasin Secondaire', 'Stock déporté'];

// Mock data
const mockPart: PartData = { 
  id: 'PDR001', 
  internalRef: 'PDR001', 
  externalRef: 'SKF-FH2500', 
  name: 'Filtre à huile', 
  family: 'Filtres', 
  subFamily: 'Huile', 
  quantity: 5, 
  reservedQuantity: 2, 
  minQuantity: 10, 
  maxQuantity: 50,
  warehouse: 'Magasin Principal', 
  location: 'Étagère A3', 
  stockStatus: 'low', 
  expirationDate: '2026-06-15',
  lastStockUpdate: '2026-01-20',
};

const mockInterventions: PartIntervention[] = [
  { id: '#411', equipment: 'Pompe distribution 202', gamme: 'Maintenance préventive', type: 'Préventive', operateur: 'J. Martin', datePlanifiee: '27/11/2025', dateRealisee: '27/11/2025', statut: 'Terminé', quantityUsed: 2 },
  { id: '#389', equipment: 'Compresseur principal', gamme: 'Contrôle mensuel', type: 'Contrôle', operateur: 'P. Bernard', datePlanifiee: '15/11/2025', dateRealisee: '15/11/2025', statut: 'Terminé', quantityUsed: 1 },
  { id: '#456', equipment: 'Pompe hydraulique A', gamme: 'Remplacement filtres', type: 'Corrective', operateur: '-', datePlanifiee: '05/12/2025', dateRealisee: null, statut: 'Planifié', quantityUsed: 2 },
];

const mockHistory: HistoryRecord[] = [
  { id: 'H001', date: '05/02/2026', time: '09:43', userEmail: 'jmartin@synaxe.com', userInitials: 'JM', field: 'Quantité en stock', oldValue: '3', newValue: '5' },
  { id: 'H002', date: '05/02/2026', time: '09:40', userEmail: 'jmartin@synaxe.com', userInitials: 'JM', field: 'Seuil d\'alerte', oldValue: '5', newValue: '10' },
  { id: 'H003', date: '28/01/2026', time: '17:39', userEmail: 'adupont@synaxe.com', userInitials: 'AD', field: 'Emplacement', oldValue: 'Étagère A2', newValue: 'Étagère A3' },
  { id: 'H004', date: '28/01/2026', time: '17:35', userEmail: 'adupont@synaxe.com', userInitials: 'AD', field: 'Magasin', oldValue: 'Magasin Secondaire', newValue: 'Magasin Principal' },
  { id: 'H005', date: '15/01/2026', time: '14:22', userEmail: 'pbernard@synaxe.com', userInitials: 'PB', field: 'Libellé', oldValue: 'Filtre huile', newValue: 'Filtre à huile' },
];

const PartDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<PartData>(mockPart);
  const [hasChanges, setHasChanges] = useState(false);

  const handleChange = (field: keyof PartData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    toast({
      title: "Pièce enregistrée",
      description: `La pièce ${formData.name} a été mise à jour.`,
    });
    setHasChanges(false);
  };

  const availableSubFamilies = formData.family ? subFamilies[formData.family] || [] : [];

  const getStatusLabel = (): { status: 'success' | 'warning' | 'danger', label: string } => {
    switch (formData.stockStatus) {
      case 'ok': return { status: 'success', label: 'OK' };
      case 'low': return { status: 'warning', label: 'Faible' };
      case 'critical': return { status: 'danger', label: 'Critique' };
      case 'expired': return { status: 'danger', label: 'Expiré' };
      default: return { status: 'warning', label: 'Inconnu' };
    }
  };

  const statusInfo = getStatusLabel();

  const getInterventionStatusBadge = (statut: string) => {
    switch (statut) {
      case 'Terminé': return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Terminé</Badge>;
      case 'Planifié': return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Planifié</Badge>;
      case 'En cours': return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">En cours</Badge>;
      default: return <Badge variant="secondary">{statut}</Badge>;
    }
  };


  return (
    <div className="p-6 space-y-4">
      {/* Header compact */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-foreground">{formData.name}</h1>
              <StatusBadge status={statusInfo.status} label={statusInfo.label} />
            </div>
            <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-0.5">
              <Package className="h-3.5 w-3.5" />
              {formData.internalRef}
              {formData.externalRef && <span className="text-muted-foreground">• {formData.externalRef}</span>}
            </p>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <Button 
            size="sm" 
            className="gap-2" 
            onClick={handleSave}
            disabled={!hasChanges}
          >
            <Save className="h-4 w-4" />
            Enregistrer
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="general" className="gap-2">
            <Package className="h-4 w-4" />
            Général
          </TabsTrigger>
          <TabsTrigger value="interventions" className="gap-2">
            <Wrench className="h-4 w-4" />
            Interventions
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2">
            <History className="h-4 w-4" />
            Historique
          </TabsTrigger>
        </TabsList>

        {/* General Tab */}
        <TabsContent value="general" className="space-y-4 mt-4">
          {/* 3 cards in a row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Identification */}
            <Card className="p-4">
              <h3 className="flex items-center gap-2 font-semibold text-foreground mb-4">
                <Package className="h-4 w-4 text-primary" />
                Identification
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="internalRef">Référence interne *</Label>
                  <Input
                    id="internalRef"
                    value={formData.internalRef}
                    onChange={(e) => handleChange('internalRef', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="externalRef">Référence externe</Label>
                  <Input
                    id="externalRef"
                    value={formData.externalRef}
                    onChange={(e) => handleChange('externalRef', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Libellé *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                  />
                </div>
              </div>
            </Card>

            {/* Classification */}
            <Card className="p-4">
              <h3 className="flex items-center gap-2 font-semibold text-foreground mb-4">
                <Layers className="h-4 w-4 text-primary" />
                Classification
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Famille *</Label>
                  <Select
                    value={formData.family}
                    onValueChange={(value) => {
                      setFormData(prev => ({ ...prev, family: value, subFamily: '' }));
                      setHasChanges(true);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner..." />
                    </SelectTrigger>
                    <SelectContent>
                      {families.map(f => (
                        <SelectItem key={f} value={f}>{f}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Sous-famille</Label>
                  <Select
                    value={formData.subFamily}
                    onValueChange={(value) => handleChange('subFamily', value)}
                    disabled={!formData.family}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner..." />
                    </SelectTrigger>
                    <SelectContent>
                      {availableSubFamilies.map(sf => (
                        <SelectItem key={sf} value={sf}>{sf}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expirationDate">DLC</Label>
                  <Input
                    id="expirationDate"
                    type="date"
                    value={formData.expirationDate || ''}
                    onChange={(e) => handleChange('expirationDate', e.target.value)}
                  />
                </div>
              </div>
            </Card>

            {/* Emplacement */}
            <Card className="p-4">
              <h3 className="flex items-center gap-2 font-semibold text-foreground mb-4">
                <MapPin className="h-4 w-4 text-primary" />
                Emplacement
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Magasin</Label>
                  <Select
                    value={formData.warehouse}
                    onValueChange={(value) => handleChange('warehouse', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner..." />
                    </SelectTrigger>
                    <SelectContent>
                      {warehouses.map(w => (
                        <SelectItem key={w} value={w}>{w}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Emplacement</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleChange('location', e.target.value)}
                    placeholder="Étagère A3"
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* Quantités - full width card */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="flex items-center gap-2 font-semibold text-foreground">
                <AlertTriangle className="h-4 w-4 text-primary" />
                Quantités et seuils
              </h3>
              {formData.lastStockUpdate && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Dernière MAJ stock :</span>
                  <span className="font-medium text-foreground">
                    {new Date(formData.lastStockUpdate).toLocaleDateString('fr-FR')}
                  </span>
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantité en stock</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="0"
                  value={formData.quantity}
                  onChange={(e) => handleChange('quantity', parseInt(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reservedQuantity">Quantité réservée</Label>
                <Input
                  id="reservedQuantity"
                  type="number"
                  min="0"
                  value={formData.reservedQuantity}
                  onChange={(e) => handleChange('reservedQuantity', parseInt(e.target.value) || 0)}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">Plans non démarrés</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="minQuantity">Seuil d'alerte</Label>
                <Input
                  id="minQuantity"
                  type="number"
                  min="0"
                  value={formData.minQuantity}
                  onChange={(e) => handleChange('minQuantity', parseInt(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxQuantity">Quantité max</Label>
                <Input
                  id="maxQuantity"
                  type="number"
                  min="0"
                  value={formData.maxQuantity}
                  onChange={(e) => handleChange('maxQuantity', parseInt(e.target.value) || 0)}
                />
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Interventions Tab */}
        <TabsContent value="interventions" className="mt-4">
          <Card className="p-4">
            <h3 className="flex items-center gap-2 font-semibold text-foreground mb-4">
              <Wrench className="h-4 w-4 text-primary" />
              Interventions utilisant cette pièce ({mockInterventions.length})
            </h3>
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-20">ID</TableHead>
                    <TableHead>Équipement</TableHead>
                    <TableHead>Gamme</TableHead>
                    <TableHead className="w-24">Type</TableHead>
                    <TableHead>Opérateur</TableHead>
                    <TableHead className="w-28">Date planifiée</TableHead>
                    <TableHead className="w-28">Date réalisée</TableHead>
                    <TableHead className="w-24">Statut</TableHead>
                    <TableHead className="w-24 text-center">Qté utilisée</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockInterventions.map((intervention) => (
                    <TableRow 
                      key={intervention.id} 
                      className="cursor-pointer hover:bg-muted/30"
                      onClick={() => navigate(`/maintenance/${intervention.id.replace('#', '')}`)}
                    >
                      <TableCell className="font-medium text-primary">{intervention.id}</TableCell>
                      <TableCell>{intervention.equipment}</TableCell>
                      <TableCell>{intervention.gamme}</TableCell>
                      <TableCell className="text-sm">{intervention.type}</TableCell>
                      <TableCell>{intervention.operateur}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{intervention.datePlanifiee}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{intervention.dateRealisee || '-'}</TableCell>
                      <TableCell>{getInterventionStatusBadge(intervention.statut)}</TableCell>
                      <TableCell className="text-center font-medium">{intervention.quantityUsed}</TableCell>
                    </TableRow>
                  ))}
                  {mockInterventions.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8">
                        <Wrench className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                        <p className="text-muted-foreground">Aucune intervention liée à cette pièce</p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="mt-4">
          <Card className="p-4">
            <h3 className="flex items-center gap-2 font-semibold text-foreground mb-4">
              <History className="h-4 w-4 text-primary" />
              Historique des modifications
            </h3>
            <div className="divide-y">
              {mockHistory.map((record) => (
                <div key={record.id} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-medium text-muted-foreground">
                      {record.userInitials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">
                        <span className="font-medium text-foreground">{record.userEmail}</span>
                        <span className="text-muted-foreground"> a mis à jour </span>
                        <span className="font-medium text-primary">{record.field}</span>
                        <span className="text-muted-foreground"> le {record.date} à {record.time}</span>
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        <span>{record.oldValue}</span>
                        <span className="mx-2">→</span>
                        <span>{record.newValue}</span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {mockHistory.length === 0 && (
                <div className="text-center py-8">
                  <History className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">Aucune modification enregistrée</p>
                </div>
              )}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PartDetail;
