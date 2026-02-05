import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  Calendar,
  History,
  AlertTriangle
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

// Mock data - would come from API
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
};

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
          <Button variant="outline" size="sm" className="gap-2">
            <History className="h-4 w-4" />
            Historique
          </Button>
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
        <h3 className="flex items-center gap-2 font-semibold text-foreground mb-4">
          <AlertTriangle className="h-4 w-4 text-primary" />
          Quantités et seuils
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
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
          <div className="space-y-2">
            <Label>État du stock</Label>
            <Select
              value={formData.stockStatus}
              onValueChange={(value) => handleChange('stockStatus', value as PartData['stockStatus'])}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ok">OK</SelectItem>
                <SelectItem value="low">Faible</SelectItem>
                <SelectItem value="critical">Critique</SelectItem>
                <SelectItem value="expired">Expiré</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PartDetail;
