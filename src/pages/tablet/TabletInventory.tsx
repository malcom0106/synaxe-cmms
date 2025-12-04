import React, { useState } from 'react';
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
  SelectValue,
} from '@/components/ui/select';
import { 
  Search, 
  Package, 
  MapPin,
  AlertTriangle,
  Check,
  Minus,
  Plus,
  Save,
  RefreshCw,
  Filter,
  BarChart3
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface InventoryItem {
  id: string;
  name: string;
  code: string;
  family: string;
  site: string;
  location: string;
  theoreticalQty: number;
  actualQty: number | null;
  unit: string;
  lastInventory: string;
  minStock: number;
  maxStock: number;
}

const inventoryItems: InventoryItem[] = [
  { id: 'INV001', name: 'Filtre à huile HF-2500', code: 'FH-2500', family: 'Filtres', site: 'Site Principal', location: 'Magasin A - Étagère 3', theoreticalQty: 24, actualQty: null, unit: 'pièce', lastInventory: '15/11/2025', minStock: 10, maxStock: 50 },
  { id: 'INV002', name: 'Joint torique Ø50mm', code: 'JT-50', family: 'Joints', site: 'Site Principal', location: 'Magasin A - Tiroir 12', theoreticalQty: 150, actualQty: null, unit: 'pièce', lastInventory: '15/11/2025', minStock: 50, maxStock: 300 },
  { id: 'INV003', name: 'Huile hydraulique ISO 46', code: 'HH-46', family: 'Lubrifiants', site: 'Site Principal', location: 'Magasin B - Zone liquides', theoreticalQty: 200, actualQty: null, unit: 'litre', lastInventory: '15/11/2025', minStock: 100, maxStock: 500 },
  { id: 'INV004', name: 'Courroie trapézoïdale A68', code: 'CT-A68', family: 'Courroies', site: 'Site Principal', location: 'Magasin A - Étagère 5', theoreticalQty: 8, actualQty: null, unit: 'pièce', lastInventory: '15/11/2025', minStock: 5, maxStock: 20 },
  { id: 'INV005', name: 'Roulement 6205-2RS', code: 'RLT-6205', family: 'Roulements', site: 'Site Principal', location: 'Magasin A - Tiroir 8', theoreticalQty: 12, actualQty: null, unit: 'pièce', lastInventory: '15/11/2025', minStock: 6, maxStock: 30 },
  { id: 'INV006', name: 'Capteur pression 0-10bar', code: 'CP-10B', family: 'Capteurs', site: 'Site Secondaire', location: 'Magasin C - Armoire électrique', theoreticalQty: 4, actualQty: null, unit: 'pièce', lastInventory: '10/11/2025', minStock: 2, maxStock: 10 },
  { id: 'INV007', name: 'Flexible hydraulique DN12 - 1m', code: 'FLX-12-1', family: 'Flexibles', site: 'Site Principal', location: 'Magasin B - Rack flexibles', theoreticalQty: 15, actualQty: null, unit: 'pièce', lastInventory: '15/11/2025', minStock: 5, maxStock: 25 },
  { id: 'INV008', name: 'Contacteur 24V 10A', code: 'CON-24-10', family: 'Électrique', site: 'Site Secondaire', location: 'Magasin C - Armoire électrique', theoreticalQty: 6, actualQty: null, unit: 'pièce', lastInventory: '10/11/2025', minStock: 3, maxStock: 15 },
];

const sites = ['Tous les sites', 'Site Principal', 'Site Secondaire'];
const families = ['Toutes les familles', 'Filtres', 'Joints', 'Lubrifiants', 'Courroies', 'Roulements', 'Capteurs', 'Flexibles', 'Électrique'];

const ECART_THRESHOLD = 10; // Seuil en pourcentage

const TabletInventory: React.FC = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<InventoryItem[]>(inventoryItems);
  const [searchQuery, setSearchQuery] = useState('');
  const [siteFilter, setSiteFilter] = useState('Tous les sites');
  const [familyFilter, setFamilyFilter] = useState('Toutes les familles');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [justification, setJustification] = useState('');
  const [pendingChanges, setPendingChanges] = useState<string[]>([]);

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSite = siteFilter === 'Tous les sites' || item.site === siteFilter;
    const matchesFamily = familyFilter === 'Toutes les familles' || item.family === familyFilter;
    return matchesSearch && matchesSite && matchesFamily;
  });

  const handleQuantityChange = (itemId: string, qty: number | null) => {
    setItems(items.map(item => 
      item.id === itemId ? { ...item, actualQty: qty } : item
    ));
    if (!pendingChanges.includes(itemId) && qty !== null) {
      setPendingChanges([...pendingChanges, itemId]);
    }
  };

  const calculateEcart = (theoretical: number, actual: number | null) => {
    if (actual === null) return null;
    return actual - theoretical;
  };

  const calculateEcartPercent = (theoretical: number, actual: number | null) => {
    if (actual === null || theoretical === 0) return null;
    return Math.abs((actual - theoretical) / theoretical * 100);
  };

  const needsJustification = (item: InventoryItem) => {
    const ecartPercent = calculateEcartPercent(item.theoreticalQty, item.actualQty);
    return ecartPercent !== null && ecartPercent > ECART_THRESHOLD;
  };

  const handleValidateItem = (item: InventoryItem) => {
    if (item.actualQty === null) {
      toast({ 
        title: "Quantité requise", 
        description: "Veuillez saisir la quantité réelle.",
        variant: "destructive"
      });
      return;
    }

    if (needsJustification(item)) {
      setSelectedItem(item);
      setJustification('');
    } else {
      confirmValidation(item.id);
    }
  };

  const confirmValidation = (itemId: string, withJustification?: string) => {
    setPendingChanges(pendingChanges.filter(id => id !== itemId));
    setSelectedItem(null);
    setJustification('');
    toast({ 
      title: "Inventaire enregistré", 
      description: withJustification 
        ? "L'écart a été justifié et enregistré." 
        : "La quantité a été mise à jour."
    });
  };

  const handleSyncAll = () => {
    if (pendingChanges.length === 0) {
      toast({ title: "Aucune modification", description: "Aucun inventaire en attente de synchronisation." });
      return;
    }

    // Vérifier les écarts non justifiés
    const itemsNeedingJustification = items.filter(
      item => pendingChanges.includes(item.id) && needsJustification(item)
    );

    if (itemsNeedingJustification.length > 0) {
      toast({ 
        title: "Justification requise", 
        description: `${itemsNeedingJustification.length} article(s) nécessitent une justification d'écart.`,
        variant: "destructive"
      });
      return;
    }

    toast({ 
      title: "Synchronisation réussie", 
      description: `${pendingChanges.length} article(s) synchronisé(s) avec le serveur.`
    });
    setPendingChanges([]);
  };

  const inventoriedCount = items.filter(i => i.actualQty !== null).length;

  return (
    <div className="p-4 pb-8 space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Inventaire</h1>
          <p className="text-muted-foreground mt-1">Mise à jour du stock physique</p>
        </div>
        {pendingChanges.length > 0 && (
          <Button onClick={handleSyncAll} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Synchroniser ({pendingChanges.length})
          </Button>
        )}
      </div>

      {/* Stats rapides */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="p-3 text-center">
          <div className="text-2xl font-bold text-foreground">{items.length}</div>
          <div className="text-xs text-muted-foreground">Articles</div>
        </Card>
        <Card className="p-3 text-center bg-blue-50 border-blue-200">
          <div className="text-2xl font-bold text-blue-700">{inventoriedCount}</div>
          <div className="text-xs text-blue-600">Inventoriés</div>
        </Card>
        <Card className="p-3 text-center bg-orange-50 border-orange-200">
          <div className="text-2xl font-bold text-orange-700">{pendingChanges.length}</div>
          <div className="text-xs text-orange-600">En attente</div>
        </Card>
      </div>

      {/* Filtres */}
      <Card className="p-4 space-y-3">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Rechercher un article..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-12"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <Select value={siteFilter} onValueChange={setSiteFilter}>
            <SelectTrigger className="h-12">
              <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sites.map(site => (
                <SelectItem key={site} value={site}>{site}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={familyFilter} onValueChange={setFamilyFilter}>
            <SelectTrigger className="h-12">
              <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {families.map(family => (
                <SelectItem key={family} value={family}>{family}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Liste des articles */}
      <div className="space-y-3">
        {filteredItems.map((item) => {
          const ecart = calculateEcart(item.theoreticalQty, item.actualQty);
          const ecartPercent = calculateEcartPercent(item.theoreticalQty, item.actualQty);
          const hasEcart = ecart !== null && ecart !== 0;
          const largeEcart = needsJustification(item);
          const isPending = pendingChanges.includes(item.id);

          return (
            <Card 
              key={item.id}
              className={cn(
                "p-4 transition-all",
                isPending && "border-orange-300 bg-orange-50/30",
                item.actualQty !== null && !isPending && "border-green-300 bg-green-50/30"
              )}
            >
              <div className="space-y-3">
                {/* En-tête */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs font-mono">{item.code}</Badge>
                      <Badge className="text-xs bg-muted text-muted-foreground">{item.family}</Badge>
                    </div>
                    <h3 className="font-semibold text-foreground">{item.name}</h3>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                      <MapPin className="h-3 w-3" />
                      {item.location}
                    </div>
                  </div>
                  
                  {isPending && (
                    <Badge className="bg-orange-500 text-white">En attente</Badge>
                  )}
                </div>

                {/* Quantités */}
                <div className="grid grid-cols-3 gap-3 p-3 bg-muted/30 rounded-lg">
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground mb-1">Théorique</div>
                    <div className="text-lg font-bold text-foreground">
                      {item.theoreticalQty} <span className="text-xs font-normal">{item.unit}</span>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground mb-1">Réel</div>
                    <div className="flex items-center justify-center gap-1">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleQuantityChange(
                          item.id, 
                          Math.max(0, (item.actualQty ?? item.theoreticalQty) - 1)
                        )}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input
                        type="number"
                        value={item.actualQty ?? ''}
                        onChange={(e) => handleQuantityChange(
                          item.id, 
                          e.target.value ? parseInt(e.target.value) : null
                        )}
                        className="w-16 h-8 text-center text-lg font-bold"
                        placeholder="?"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleQuantityChange(
                          item.id, 
                          (item.actualQty ?? item.theoreticalQty) + 1
                        )}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="text-xs text-muted-foreground mb-1">Écart</div>
                    {ecart !== null ? (
                      <div className={cn(
                        "text-lg font-bold",
                        ecart === 0 && "text-green-600",
                        ecart > 0 && "text-blue-600",
                        ecart < 0 && "text-red-600"
                      )}>
                        {ecart > 0 ? '+' : ''}{ecart}
                        {largeEcart && (
                          <AlertTriangle className="h-4 w-4 inline ml-1 text-orange-500" />
                        )}
                      </div>
                    ) : (
                      <div className="text-lg text-muted-foreground">-</div>
                    )}
                  </div>
                </div>

                {/* Bouton de validation */}
                {item.actualQty !== null && (
                  <Button 
                    className="w-full h-12"
                    variant={isPending ? "default" : "outline"}
                    onClick={() => handleValidateItem(item)}
                  >
                    {isPending ? (
                      <>
                        <Save className="h-5 w-5 mr-2" />
                        Valider l'inventaire
                      </>
                    ) : (
                      <>
                        <Check className="h-5 w-5 mr-2" />
                        Inventorié
                      </>
                    )}
                  </Button>
                )}
              </div>
            </Card>
          );
        })}

        {filteredItems.length === 0 && (
          <Card className="p-8 text-center">
            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">Aucun article trouvé</p>
          </Card>
        )}
      </div>

      {/* Modal de justification */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md p-6 space-y-4">
            <div className="flex items-center gap-3 text-orange-600">
              <AlertTriangle className="h-6 w-6" />
              <h2 className="text-xl font-bold">Écart important détecté</h2>
            </div>
            
            <div className="p-4 bg-orange-50 rounded-lg space-y-2">
              <p className="font-medium text-foreground">{selectedItem.name}</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Théorique:</span>{' '}
                  <span className="font-medium">{selectedItem.theoreticalQty} {selectedItem.unit}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Réel:</span>{' '}
                  <span className="font-medium">{selectedItem.actualQty} {selectedItem.unit}</span>
                </div>
              </div>
              <div className="text-sm">
                <span className="text-muted-foreground">Écart:</span>{' '}
                <span className={cn(
                  "font-bold",
                  (selectedItem.actualQty ?? 0) - selectedItem.theoreticalQty >= 0 ? "text-blue-600" : "text-red-600"
                )}>
                  {((selectedItem.actualQty ?? 0) - selectedItem.theoreticalQty > 0 ? '+' : '')}
                  {(selectedItem.actualQty ?? 0) - selectedItem.theoreticalQty} {selectedItem.unit}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-base font-medium">
                Justification obligatoire <span className="text-red-500">*</span>
              </Label>
              <Textarea
                placeholder="Expliquez la raison de cet écart..."
                value={justification}
                onChange={(e) => setJustification(e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1 h-12"
                onClick={() => {
                  setSelectedItem(null);
                  setJustification('');
                }}
              >
                Annuler
              </Button>
              <Button 
                className="flex-1 h-12"
                disabled={!justification.trim()}
                onClick={() => confirmValidation(selectedItem.id, justification)}
              >
                <Check className="h-5 w-5 mr-2" />
                Confirmer
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default TabletInventory;
