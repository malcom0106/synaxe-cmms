import React, { useState } from 'react';
import { PageTitle } from '@/components/ui/PageTitle';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Plus, 
  AlertTriangle,
  ClipboardCheck,
  Calendar,
  Eye,
  Check,
  X,
  Play,
  ArrowLeft
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface InventoryRecord {
  id: string;
  date: string;
  status: 'en_cours' | 'completed';
  operator: string;
  totalItems: number;
  countedItems: number;
  differences: number;
  notes: string;
  scope: string;
}

interface InventoryLine {
  partId: string;
  partName: string;
  location: string;
  warehouse: string;
  family: string;
  subFamily: string;
  theoreticalQty: number;
  actualQty: number | null;
  isOk: boolean | null;
  justification?: string;
}

// Demo data
const demoInventoryHistory: InventoryRecord[] = [
  { id: 'INV001', date: '20/01/2026', status: 'completed', operator: 'J. Martin', totalItems: 45, countedItems: 45, differences: 3, notes: 'Inventaire trimestriel Q1', scope: 'Magasin Principal' },
  { id: 'INV002', date: '05/02/2026', status: 'en_cours', operator: 'A. Dupont', totalItems: 12, countedItems: 5, differences: 1, notes: 'Inventaire famille Filtres', scope: 'Filtres' },
  { id: 'INV003', date: '15/10/2025', status: 'completed', operator: 'A. Dupont', totalItems: 42, countedItems: 42, differences: 5, notes: 'Inventaire trimestriel Q4', scope: 'Magasin Principal' },
  { id: 'INV004', date: '12/07/2025', status: 'completed', operator: 'P. Bernard', totalItems: 40, countedItems: 40, differences: 2, notes: 'Inventaire semestriel', scope: 'Tous' },
];

const demoParts = [
  { id: 'PDR001', name: 'Filtre à huile', location: 'Étagère A3', quantity: 5, warehouse: 'Magasin Principal', family: 'Filtres', subFamily: 'Huile' },
  { id: 'PDR002', name: 'Joint torique 50mm', location: 'Tiroir B2', quantity: 25, warehouse: 'Magasin Principal', family: 'Joints', subFamily: 'Toriques' },
  { id: 'PDR003', name: 'Tuyau hydraulique 1m', location: 'Étagère C1', quantity: 3, warehouse: 'Magasin Principal', family: 'Hydraulique', subFamily: 'Tuyaux' },
  { id: 'PDR004', name: 'Filtre à air', location: 'Étagère A2', quantity: 12, warehouse: 'Magasin Principal', family: 'Filtres', subFamily: 'Air' },
  { id: 'PDR005', name: 'Kit de réparation pompe', location: 'Tiroir D4', quantity: 2, warehouse: 'Magasin Secondaire', family: 'Pompes', subFamily: 'Kits réparation' },
  { id: 'PDR006', name: 'Filtre carburant', location: 'Étagère A4', quantity: 8, warehouse: 'Magasin Principal', family: 'Filtres', subFamily: 'Carburant' },
];

const families = ['Filtres', 'Joints', 'Hydraulique', 'Pompes', 'Électrique'];
const warehouses = ['Magasin Principal', 'Magasin Secondaire', 'Stock déporté'];

const ECART_THRESHOLD = 10;

const InventoryCounts: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('list');
  const [inventoryRecords, setInventoryRecords] = useState<InventoryRecord[]>(demoInventoryHistory);
  
  // New inventory state
  const [newInventory, setNewInventory] = useState({
    scopeType: '' as 'family' | 'subFamily' | 'warehouse' | 'location' | '',
    scopeValue: '',
    subFamilyValue: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });
  const [inventoryLines, setInventoryLines] = useState<InventoryLine[]>([]);
  const [justifyingIndex, setJustifyingIndex] = useState<number | null>(null);
  const [tempJustification, setTempJustification] = useState('');

  const inProgressInventories = inventoryRecords.filter(inv => inv.status === 'en_cours');
  const completedInventories = inventoryRecords.filter(inv => inv.status === 'completed');

  const getSubFamilies = (family: string) => {
    const parts = demoParts.filter(p => p.family === family);
    return [...new Set(parts.map(p => p.subFamily))];
  };

  const handleScopeTypeChange = (value: string) => {
    setNewInventory({ ...newInventory, scopeType: value as any, scopeValue: '', subFamilyValue: '' });
    setInventoryLines([]);
  };

  const handleScopeValueChange = (value: string) => {
    setNewInventory({ ...newInventory, scopeValue: value, subFamilyValue: '' });
    
    let filtered = demoParts;
    if (newInventory.scopeType === 'family') {
      filtered = demoParts.filter(p => p.family === value);
    } else if (newInventory.scopeType === 'warehouse') {
      filtered = demoParts.filter(p => p.warehouse === value);
    }
    
    setInventoryLines(filtered.map(p => ({
      partId: p.id,
      partName: p.name,
      location: p.location,
      warehouse: p.warehouse,
      family: p.family,
      subFamily: p.subFamily,
      theoreticalQty: p.quantity,
      actualQty: null,
      isOk: null,
    })));
  };

  const handleSubFamilyChange = (value: string) => {
    setNewInventory({ ...newInventory, subFamilyValue: value });
    
    const filtered = demoParts.filter(p => p.family === newInventory.scopeValue && p.subFamily === value);
    setInventoryLines(filtered.map(p => ({
      partId: p.id,
      partName: p.name,
      location: p.location,
      warehouse: p.warehouse,
      family: p.family,
      subFamily: p.subFamily,
      theoreticalQty: p.quantity,
      actualQty: null,
      isOk: null,
    })));
  };

  const handleOkToggle = (index: number, isOk: boolean) => {
    const updated = [...inventoryLines];
    updated[index] = { 
      ...updated[index], 
      isOk, 
      actualQty: isOk ? updated[index].theoreticalQty : null 
    };
    setInventoryLines(updated);
  };

  const handleActualQtyChange = (index: number, qty: number | null) => {
    const updated = [...inventoryLines];
    updated[index] = { ...updated[index], actualQty: qty };
    setInventoryLines(updated);
  };

  const needsJustification = (line: InventoryLine) => {
    if (line.isOk || line.actualQty === null) return false;
    const ecartPercent = Math.abs((line.actualQty - line.theoreticalQty) / line.theoreticalQty * 100);
    return ecartPercent > ECART_THRESHOLD && !line.justification;
  };

  const handleSaveJustification = (index: number) => {
    const updated = [...inventoryLines];
    updated[index] = { ...updated[index], justification: tempJustification };
    setInventoryLines(updated);
    setJustifyingIndex(null);
    setTempJustification('');
  };

  const handleStartNewInventory = () => {
    setActiveTab('new');
    setNewInventory({ scopeType: '', scopeValue: '', subFamilyValue: '', date: new Date().toISOString().split('T')[0], notes: '' });
    setInventoryLines([]);
  };

  const handleValidateInventory = () => {
    const incomplete = inventoryLines.filter(l => l.isOk === null);
    if (incomplete.length > 0) {
      toast({ title: "Inventaire incomplet", description: `${incomplete.length} article(s) n'ont pas été vérifiés.`, variant: "destructive" });
      return;
    }

    const needsJustif = inventoryLines.filter(needsJustification);
    if (needsJustif.length > 0) {
      toast({ title: "Justification requise", description: `${needsJustif.length} article(s) présentent un écart important non justifié.`, variant: "destructive" });
      return;
    }

    const differences = inventoryLines.filter(l => !l.isOk).length;
    const newRecord: InventoryRecord = {
      id: `INV${String(inventoryRecords.length + 1).padStart(3, '0')}`,
      date: new Date().toLocaleDateString('fr-FR'),
      status: 'completed',
      operator: 'Utilisateur',
      totalItems: inventoryLines.length,
      countedItems: inventoryLines.length,
      differences,
      notes: newInventory.notes,
      scope: newInventory.scopeValue || 'Tous',
    };

    setInventoryRecords([newRecord, ...inventoryRecords]);
    toast({ title: "Inventaire validé", description: `${inventoryLines.length} article(s) comptés. ${differences} écart(s).` });
    setActiveTab('list');
  };

  const renderInventoryTable = (records: InventoryRecord[], showStatus = true) => (
    <div className="rounded-xl border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-28">Référence</TableHead>
            <TableHead className="w-28">Date</TableHead>
            <TableHead>Périmètre</TableHead>
            <TableHead>Notes</TableHead>
            <TableHead className="w-32">Opérateur</TableHead>
            <TableHead className="w-24 text-center">Articles</TableHead>
            <TableHead className="w-24 text-center">Écarts</TableHead>
            {showStatus && <TableHead className="w-24">Statut</TableHead>}
            <TableHead className="w-20 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((inv) => (
            <TableRow key={inv.id} className="hover:bg-muted/30">
              <TableCell><Badge variant="outline" className="font-mono text-xs">{inv.id}</Badge></TableCell>
              <TableCell className="font-medium">{inv.date}</TableCell>
              <TableCell className="text-sm">{inv.scope}</TableCell>
              <TableCell><span className="text-sm text-muted-foreground">{inv.notes}</span></TableCell>
              <TableCell className="text-sm">{inv.operator}</TableCell>
              <TableCell className="text-center">
                {inv.status === 'en_cours' ? (
                  <span className="text-sm">{inv.countedItems}/{inv.totalItems}</span>
                ) : (
                  <span className="font-medium">{inv.totalItems}</span>
                )}
              </TableCell>
              <TableCell className="text-center">
                {inv.differences > 0 ? (
                  <Badge variant="outline" className="bg-warning/10 text-warning border-warning/30">{inv.differences}</Badge>
                ) : (
                  <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/30">0</Badge>
                )}
              </TableCell>
              {showStatus && (
                <TableCell>
                  <StatusBadge 
                    status={inv.status === 'completed' ? 'success' : 'warning'} 
                    label={inv.status === 'completed' ? 'Terminé' : 'En cours'} 
                  />
                </TableCell>
              )}
              <TableCell>
                <div className="flex justify-end gap-1">
                  {inv.status === 'en_cours' ? (
                    <Button variant="ghost" size="icon" className="h-8 w-8" title="Reprendre">
                      <Play className="h-4 w-4 text-primary" />
                    </Button>
                  ) : (
                    <Button variant="ghost" size="icon" className="h-8 w-8" title="Voir détails">
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
          {records.length === 0 && (
            <TableRow>
              <TableCell colSpan={showStatus ? 9 : 8} className="text-center py-8">
                <ClipboardCheck className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground">Aucun inventaire</p>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto animate-fade-in">
      <PageTitle 
        title="Inventaires" 
        subtitle="Gestion des inventaires physiques"
        action={
          activeTab !== 'new' && (
            <Button className="btn-primary" onClick={handleStartNewInventory}>
              <Plus className="h-4 w-4 mr-2" />
              Nouvel inventaire
            </Button>
          )
        }
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="list" className="gap-2">
            <ClipboardCheck className="h-4 w-4" />
            Tous les inventaires
          </TabsTrigger>
          <TabsTrigger value="in_progress" className="gap-2">
            <Play className="h-4 w-4" />
            En cours ({inProgressInventories.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="gap-2">
            <Check className="h-4 w-4" />
            Terminés ({completedInventories.length})
          </TabsTrigger>
          {activeTab === 'new' && (
            <TabsTrigger value="new" className="gap-2">
              <Plus className="h-4 w-4" />
              Nouvel inventaire
            </TabsTrigger>
          )}
        </TabsList>

        {/* All inventories */}
        <TabsContent value="list" className="mt-4">
          {renderInventoryTable(inventoryRecords)}
        </TabsContent>

        {/* In progress */}
        <TabsContent value="in_progress" className="mt-4">
          {renderInventoryTable(inProgressInventories, false)}
        </TabsContent>

        {/* Completed */}
        <TabsContent value="completed" className="mt-4">
          {renderInventoryTable(completedInventories, false)}
        </TabsContent>

        {/* New inventory */}
        <TabsContent value="new" className="mt-4 space-y-4">
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <Button variant="ghost" size="icon" onClick={() => setActiveTab('list')}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h3 className="font-semibold text-foreground">Configuration de l'inventaire</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Type de périmètre *</Label>
                <Select value={newInventory.scopeType} onValueChange={handleScopeTypeChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="warehouse">Magasin</SelectItem>
                    <SelectItem value="family">Famille</SelectItem>
                    <SelectItem value="subFamily">Sous-famille</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {newInventory.scopeType === 'warehouse' && (
                <div className="space-y-2">
                  <Label>Magasin *</Label>
                  <Select value={newInventory.scopeValue} onValueChange={handleScopeValueChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner..." />
                    </SelectTrigger>
                    <SelectContent>
                      {warehouses.map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {(newInventory.scopeType === 'family' || newInventory.scopeType === 'subFamily') && (
                <div className="space-y-2">
                  <Label>Famille *</Label>
                  <Select value={newInventory.scopeValue} onValueChange={handleScopeValueChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner..." />
                    </SelectTrigger>
                    <SelectContent>
                      {families.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {newInventory.scopeType === 'subFamily' && newInventory.scopeValue && (
                <div className="space-y-2">
                  <Label>Sous-famille *</Label>
                  <Select value={newInventory.subFamilyValue} onValueChange={handleSubFamilyChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner..." />
                    </SelectTrigger>
                    <SelectContent>
                      {getSubFamilies(newInventory.scopeValue).map(sf => <SelectItem key={sf} value={sf}>{sf}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label>Date</Label>
                <Input
                  type="date"
                  value={newInventory.date}
                  onChange={(e) => setNewInventory({ ...newInventory, date: e.target.value })}
                />
              </div>
            </div>
          </Card>

          {/* Inventory lines */}
          {inventoryLines.length > 0 && (
            <Card className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">
                  Articles à inventorier ({inventoryLines.length})
                </h3>
                <div className="flex gap-2 text-sm">
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    {inventoryLines.filter(l => l.isOk === true).length} OK
                  </Badge>
                  <Badge variant="outline" className="bg-orange-50 text-orange-700">
                    {inventoryLines.filter(l => l.isOk === false).length} Écarts
                  </Badge>
                  <Badge variant="outline">
                    {inventoryLines.filter(l => l.isOk === null).length} À vérifier
                  </Badge>
                </div>
              </div>

              <div className="rounded-lg border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="w-24">Réf.</TableHead>
                      <TableHead>Libellé</TableHead>
                      <TableHead className="w-32">Emplacement</TableHead>
                      <TableHead className="w-24 text-center">Théorique</TableHead>
                      <TableHead className="w-24 text-center">OK ?</TableHead>
                      <TableHead className="w-32 text-center">Qté réelle</TableHead>
                      <TableHead className="w-24 text-center">Écart</TableHead>
                      <TableHead className="w-28">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inventoryLines.map((line, index) => {
                      const ecart = line.actualQty !== null ? line.actualQty - line.theoreticalQty : null;
                      const hasLargeEcart = needsJustification(line);

                      return (
                        <React.Fragment key={line.partId}>
                          <TableRow className={cn(
                            "hover:bg-muted/30",
                            line.isOk === true && "bg-green-50/50",
                            line.isOk === false && !hasLargeEcart && "bg-orange-50/30",
                            hasLargeEcart && "bg-orange-100/50"
                          )}>
                            <TableCell>
                              <Badge variant="outline" className="font-mono text-xs">{line.partId}</Badge>
                            </TableCell>
                            <TableCell className="font-medium">{line.partName}</TableCell>
                            <TableCell className="text-sm text-muted-foreground">{line.location}</TableCell>
                            <TableCell className="text-center font-bold text-lg">{line.theoreticalQty}</TableCell>
                            <TableCell className="text-center">
                              <div className="flex justify-center gap-2">
                                <Button
                                  variant={line.isOk === true ? "default" : "outline"}
                                  size="sm"
                                  className={cn("h-8 w-8 p-0", line.isOk === true && "bg-green-600 hover:bg-green-700")}
                                  onClick={() => handleOkToggle(index, true)}
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant={line.isOk === false ? "default" : "outline"}
                                  size="sm"
                                  className={cn("h-8 w-8 p-0", line.isOk === false && "bg-orange-600 hover:bg-orange-700")}
                                  onClick={() => handleOkToggle(index, false)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              {line.isOk === false ? (
                                <Input
                                  type="number"
                                  min="0"
                                  value={line.actualQty ?? ''}
                                  onChange={(e) => handleActualQtyChange(index, e.target.value ? parseInt(e.target.value) : null)}
                                  className="w-20 h-8 text-center mx-auto"
                                  placeholder="?"
                                />
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </TableCell>
                            <TableCell className="text-center">
                              {ecart !== null && line.isOk === false ? (
                                <span className={cn(
                                  "font-bold",
                                  ecart === 0 && "text-green-600",
                                  ecart > 0 && "text-blue-600",
                                  ecart < 0 && "text-red-600"
                                )}>
                                  {ecart > 0 ? '+' : ''}{ecart}
                                </span>
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </TableCell>
                            <TableCell>
                              {hasLargeEcart && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-orange-600 border-orange-300 h-7 text-xs"
                                  onClick={() => { setJustifyingIndex(index); setTempJustification(''); }}
                                >
                                  <AlertTriangle className="h-3 w-3 mr-1" />
                                  Justifier
                                </Button>
                              )}
                              {line.justification && (
                                <Badge className="text-xs bg-blue-100 text-blue-700">Justifié</Badge>
                              )}
                            </TableCell>
                          </TableRow>
                          {justifyingIndex === index && (
                            <TableRow>
                              <TableCell colSpan={8} className="bg-orange-50 p-4">
                                <div className="space-y-2">
                                  <Label className="text-sm font-medium">Justification de l'écart (obligatoire si &gt;10%)</Label>
                                  <Textarea
                                    value={tempJustification}
                                    onChange={(e) => setTempJustification(e.target.value)}
                                    placeholder="Expliquez la raison de cet écart..."
                                    className="min-h-[60px]"
                                  />
                                  <div className="flex gap-2 justify-end">
                                    <Button variant="outline" size="sm" onClick={() => setJustifyingIndex(null)}>Annuler</Button>
                                    <Button size="sm" onClick={() => handleSaveJustification(index)} disabled={!tempJustification.trim()}>
                                      <Check className="h-4 w-4 mr-1" />
                                      Valider
                                    </Button>
                                  </div>
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* Notes */}
              <div className="mt-4 space-y-2">
                <Label>Remarques générales</Label>
                <Textarea
                  value={newInventory.notes}
                  onChange={(e) => setNewInventory({ ...newInventory, notes: e.target.value })}
                  placeholder="Notes sur l'inventaire..."
                  className="min-h-[60px]"
                />
              </div>

              {/* Actions */}
              <div className="mt-4 flex justify-end gap-2">
                <Button variant="outline" onClick={() => setActiveTab('list')}>Annuler</Button>
                <Button onClick={handleValidateInventory}>
                  <Check className="h-4 w-4 mr-2" />
                  Valider l'inventaire
                </Button>
              </div>
            </Card>
          )}

          {!newInventory.scopeType && (
            <Card className="p-8 text-center border-dashed">
              <ClipboardCheck className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">Sélectionnez un type de périmètre pour démarrer l'inventaire</p>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InventoryCounts;
