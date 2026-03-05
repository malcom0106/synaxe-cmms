import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Package, 
  Plus, 
  Minus, 
  Search, 
  X, 
  ChevronDown, 
  ChevronUp,
  Wrench,
  Warehouse
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export interface RangePart {
  id: string;
  reference: string;
  label: string;
  expectedQty: number;
  unit: string;
  stockAvailable: number;
}

export interface UsedPart {
  partId: string;
  reference: string;
  label: string;
  unit: string;
  expectedQty: number | null; // null = pièce ajoutée hors gamme
  usedQty: number;
  stockAvailable: number;
  fromRange: boolean;
}

interface StockPart {
  id: string;
  reference: string;
  label: string;
  family: string;
  unit: string;
  stockAvailable: number;
}

// Mock stock catalogue
const mockStockParts: StockPart[] = [
  { id: 'sp1', reference: 'FIL-001', label: 'Filtre à huile', family: 'Filtration', unit: 'pièce', stockAvailable: 24 },
  { id: 'sp2', reference: 'FIL-002', label: 'Filtre à air', family: 'Filtration', unit: 'pièce', stockAvailable: 12 },
  { id: 'sp3', reference: 'COU-001', label: 'Courroie de distribution', family: 'Transmission', unit: 'pièce', stockAvailable: 8 },
  { id: 'sp4', reference: 'PNE-001', label: 'Pneu avant 225/65R17', family: 'Pneumatiques', unit: 'pièce', stockAvailable: 16 },
  { id: 'sp5', reference: 'VIS-001', label: 'Vis M8x30 inox', family: 'Visserie', unit: 'pièce', stockAvailable: 200 },
  { id: 'sp6', reference: 'VIS-002', label: 'Vis M10x40 inox', family: 'Visserie', unit: 'pièce', stockAvailable: 150 },
  { id: 'sp7', reference: 'ECR-001', label: 'Écrou M8 inox', family: 'Visserie', unit: 'pièce', stockAvailable: 300 },
  { id: 'sp8', reference: 'JOI-001', label: 'Joint torique 25mm', family: 'Étanchéité', unit: 'pièce', stockAvailable: 50 },
  { id: 'sp9', reference: 'HUI-001', label: 'Huile moteur 5W30', family: 'Lubrifiants', unit: 'litre', stockAvailable: 60 },
  { id: 'sp10', reference: 'GRA-001', label: 'Graisse multi-usage', family: 'Lubrifiants', unit: 'kg', stockAvailable: 15 },
  { id: 'sp11', reference: 'PLQ-001', label: 'Plaquettes de frein AV', family: 'Freinage', unit: 'jeu', stockAvailable: 6 },
  { id: 'sp12', reference: 'AMO-001', label: 'Amortisseur avant', family: 'Suspension', unit: 'pièce', stockAvailable: 4 },
];

interface PartsConsumptionPanelProps {
  rangeParts: RangePart[];
  usedParts: UsedPart[];
  onUsedPartsChange: (parts: UsedPart[]) => void;
  disabled?: boolean;
}

const PartsConsumptionPanel: React.FC<PartsConsumptionPanelProps> = ({
  rangeParts,
  usedParts,
  onUsedPartsChange,
  disabled = false,
}) => {
  const [showStockSearch, setShowStockSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expanded, setExpanded] = useState(true);

  // Initialize range parts into usedParts if not already there
  React.useEffect(() => {
    if (usedParts.length === 0 && rangeParts.length > 0) {
      const initial: UsedPart[] = rangeParts.map(rp => ({
        partId: rp.id,
        reference: rp.reference,
        label: rp.label,
        unit: rp.unit,
        expectedQty: rp.expectedQty,
        usedQty: 0,
        stockAvailable: rp.stockAvailable,
        fromRange: true,
      }));
      onUsedPartsChange(initial);
    }
  }, []);

  const handleQtyChange = (partId: string, delta: number) => {
    if (disabled) return;
    const updated = usedParts.map(p => {
      if (p.partId === partId) {
        const newQty = Math.max(0, Math.min(p.stockAvailable, p.usedQty + delta));
        return { ...p, usedQty: newQty };
      }
      return p;
    });
    onUsedPartsChange(updated);
  };

  const handleQtyDirectChange = (partId: string, value: string) => {
    if (disabled) return;
    const num = parseInt(value) || 0;
    const updated = usedParts.map(p => {
      if (p.partId === partId) {
        const newQty = Math.max(0, Math.min(p.stockAvailable, num));
        return { ...p, usedQty: newQty };
      }
      return p;
    });
    onUsedPartsChange(updated);
  };

  const handleAddStockPart = (stockPart: StockPart) => {
    if (usedParts.find(p => p.partId === stockPart.id)) {
      toast.error('Cette pièce est déjà dans la liste');
      return;
    }
    const newPart: UsedPart = {
      partId: stockPart.id,
      reference: stockPart.reference,
      label: stockPart.label,
      unit: stockPart.unit,
      expectedQty: null,
      usedQty: 1,
      stockAvailable: stockPart.stockAvailable,
      fromRange: false,
    };
    onUsedPartsChange([...usedParts, newPart]);
    toast.success(`${stockPart.label} ajoutée`);
    setSearchQuery('');
    setShowStockSearch(false);
  };

  const handleRemoveExtraPart = (partId: string) => {
    if (disabled) return;
    onUsedPartsChange(usedParts.filter(p => p.partId !== partId || p.fromRange));
  };

  const filteredStockParts = mockStockParts.filter(sp => {
    const alreadyAdded = usedParts.find(p => p.partId === sp.id);
    if (alreadyAdded) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return sp.label.toLowerCase().includes(q) || sp.reference.toLowerCase().includes(q) || sp.family.toLowerCase().includes(q);
  });

  const rangePartsUsed = usedParts.filter(p => p.fromRange);
  const extraParts = usedParts.filter(p => !p.fromRange);
  const totalUsed = usedParts.reduce((sum, p) => sum + p.usedQty, 0);

  return (
    <Card className="overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Package className="h-5 w-5 text-primary" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-foreground">Pièces utilisées</h3>
            <p className="text-xs text-muted-foreground">
              {totalUsed} pièce{totalUsed > 1 ? 's' : ''} consommée{totalUsed > 1 ? 's' : ''}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {rangePartsUsed.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              <Wrench className="h-3 w-3 mr-1" />
              {rangePartsUsed.length} gamme
            </Badge>
          )}
          {extraParts.length > 0 && (
            <Badge variant="outline" className="text-xs">
              <Warehouse className="h-3 w-3 mr-1" />
              +{extraParts.length} stock
            </Badge>
          )}
          {expanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
        </div>
      </button>

      {expanded && (
        <div className="border-t border-border">
          {/* Pièces de la gamme */}
          {rangePartsUsed.length > 0 && (
            <div className="p-4 space-y-3">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Wrench className="h-3.5 w-3.5" />
                Pièces prévues par la gamme
              </Label>
              <div className="space-y-2">
                {rangePartsUsed.map((part) => (
                  <div
                    key={part.partId}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg border transition-colors",
                      part.usedQty > 0 ? "bg-primary/5 border-primary/20" : "bg-muted/30 border-border"
                    )}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm text-foreground truncate">{part.label}</span>
                        <Badge variant="outline" className="text-[10px] flex-shrink-0">
                          {part.reference}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">
                          Prévu: <span className="font-semibold text-foreground">{part.expectedQty}</span> {part.unit}{part.expectedQty! > 1 ? 's' : ''}
                        </span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">
                          Stock: {part.stockAvailable}
                        </span>
                      </div>
                    </div>

                    {/* Compteur de quantité */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9"
                        onClick={() => handleQtyChange(part.partId, -1)}
                        disabled={disabled || part.usedQty <= 0}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input
                        type="number"
                        value={part.usedQty}
                        onChange={(e) => handleQtyDirectChange(part.partId, e.target.value)}
                        className="w-14 h-9 text-center text-sm font-bold [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        disabled={disabled}
                        min={0}
                        max={part.stockAvailable}
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9"
                        onClick={() => handleQtyChange(part.partId, 1)}
                        disabled={disabled || part.usedQty >= part.stockAvailable}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pièces supplémentaires (hors gamme) */}
          {extraParts.length > 0 && (
            <div className="p-4 pt-0 space-y-3">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Warehouse className="h-3.5 w-3.5" />
                Pièces ajoutées depuis le stock
              </Label>
              <div className="space-y-2">
                {extraParts.map((part) => (
                  <div
                    key={part.partId}
                    className="flex items-center gap-3 p-3 rounded-lg border border-dashed border-border bg-muted/20"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm text-foreground truncate">{part.label}</span>
                        <Badge variant="outline" className="text-[10px] flex-shrink-0">
                          {part.reference}
                        </Badge>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        Stock: {part.stockAvailable} {part.unit}{part.stockAvailable > 1 ? 's' : ''}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9"
                        onClick={() => handleQtyChange(part.partId, -1)}
                        disabled={disabled || part.usedQty <= 0}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input
                        type="number"
                        value={part.usedQty}
                        onChange={(e) => handleQtyDirectChange(part.partId, e.target.value)}
                        className="w-14 h-9 text-center text-sm font-bold [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        disabled={disabled}
                        min={0}
                        max={part.stockAvailable}
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9"
                        onClick={() => handleQtyChange(part.partId, 1)}
                        disabled={disabled || part.usedQty >= part.stockAvailable}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => handleRemoveExtraPart(part.partId)}
                      disabled={disabled}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bouton + recherche stock */}
          <div className="p-4 pt-0">
            {!showStockSearch ? (
              <Button
                variant="outline"
                className="w-full border-dashed"
                onClick={() => setShowStockSearch(true)}
                disabled={disabled}
              >
                <Plus className="h-4 w-4 mr-2" />
                Ajouter une pièce depuis le stock
              </Button>
            ) : (
              <div className="space-y-3 p-3 rounded-lg border border-border bg-muted/20">
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <Input
                    placeholder="Rechercher une pièce (réf, nom, famille)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-9"
                    autoFocus
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 flex-shrink-0"
                    onClick={() => { setShowStockSearch(false); setSearchQuery(''); }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="max-h-48 overflow-y-auto space-y-1">
                  {filteredStockParts.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      {searchQuery ? 'Aucune pièce trouvée' : 'Toutes les pièces sont déjà ajoutées'}
                    </p>
                  ) : (
                    filteredStockParts.map((sp) => (
                      <button
                        key={sp.id}
                        onClick={() => handleAddStockPart(sp)}
                        className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-background transition-colors text-left"
                      >
                        <Package className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-foreground truncate">{sp.label}</span>
                            <Badge variant="outline" className="text-[10px]">{sp.reference}</Badge>
                          </div>
                          <span className="text-xs text-muted-foreground">{sp.family} • Stock: {sp.stockAvailable} {sp.unit}</span>
                        </div>
                        <Plus className="h-4 w-4 text-primary flex-shrink-0" />
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  );
};

export default PartsConsumptionPanel;
