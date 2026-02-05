import React, { useState } from 'react';
import { PageTitle } from '@/components/ui/PageTitle';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
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
  Eye,
  Check,
  X,
  Play,
  ArrowLeft,
  Pause
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

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
  scopeType?: 'family' | 'subFamily' | 'warehouse' | '';
  scopeValue?: string;
  subFamilyValue?: string;
  lines?: InventoryLine[];
}

const demoParts = [
  { id: 'PDR001', name: 'Filtre à huile', location: 'Étagère A3', quantity: 5, warehouse: 'Magasin Principal', family: 'Filtres', subFamily: 'Huile' },
  { id: 'PDR002', name: 'Joint torique 50mm', location: 'Tiroir B2', quantity: 25, warehouse: 'Magasin Principal', family: 'Joints', subFamily: 'Toriques' },
  { id: 'PDR003', name: 'Tuyau hydraulique 1m', location: 'Étagère C1', quantity: 3, warehouse: 'Magasin Principal', family: 'Hydraulique', subFamily: 'Tuyaux' },
  { id: 'PDR004', name: 'Filtre à air', location: 'Étagère A2', quantity: 12, warehouse: 'Magasin Principal', family: 'Filtres', subFamily: 'Air' },
  { id: 'PDR005', name: 'Kit de réparation pompe', location: 'Tiroir D4', quantity: 2, warehouse: 'Magasin Secondaire', family: 'Pompes', subFamily: 'Kits réparation' },
  { id: 'PDR006', name: 'Filtre carburant', location: 'Étagère A4', quantity: 8, warehouse: 'Magasin Principal', family: 'Filtres', subFamily: 'Carburant' },
];

// Demo data with lines for in-progress inventory
const demoInventoryHistory: InventoryRecord[] = [
  { 
    id: 'INV001', date: '20/01/2026', status: 'completed', operator: 'J. Martin', totalItems: 45, countedItems: 45, differences: 3, notes: 'Inventaire trimestriel Q1', scope: 'Magasin Principal',
    scopeType: 'warehouse', scopeValue: 'Magasin Principal',
    lines: [
      { partId: 'PDR001', partName: 'Filtre à huile', location: 'Étagère A3', warehouse: 'Magasin Principal', family: 'Filtres', subFamily: 'Huile', theoreticalQty: 5, actualQty: 5, isOk: true },
      { partId: 'PDR002', partName: 'Joint torique 50mm', location: 'Tiroir B2', warehouse: 'Magasin Principal', family: 'Joints', subFamily: 'Toriques', theoreticalQty: 25, actualQty: 23, isOk: false, justification: 'Pièces abimées jetées' },
      { partId: 'PDR004', partName: 'Filtre à air', location: 'Étagère A2', warehouse: 'Magasin Principal', family: 'Filtres', subFamily: 'Air', theoreticalQty: 12, actualQty: 12, isOk: true },
    ]
  },
  { 
    id: 'INV002', date: '05/02/2026', status: 'en_cours', operator: 'A. Dupont', totalItems: 4, countedItems: 2, differences: 1, notes: 'Inventaire famille Filtres', scope: 'Filtres',
    scopeType: 'family', scopeValue: 'Filtres',
    lines: [
      { partId: 'PDR001', partName: 'Filtre à huile', location: 'Étagère A3', warehouse: 'Magasin Principal', family: 'Filtres', subFamily: 'Huile', theoreticalQty: 5, actualQty: 5, isOk: true },
      { partId: 'PDR004', partName: 'Filtre à air', location: 'Étagère A2', warehouse: 'Magasin Principal', family: 'Filtres', subFamily: 'Air', theoreticalQty: 12, actualQty: 10, isOk: false, justification: 'Écart constaté' },
      { partId: 'PDR006', partName: 'Filtre carburant', location: 'Étagère A4', warehouse: 'Magasin Principal', family: 'Filtres', subFamily: 'Carburant', theoreticalQty: 8, actualQty: null, isOk: null },
    ]
  },
  { id: 'INV003', date: '15/10/2025', status: 'completed', operator: 'A. Dupont', totalItems: 42, countedItems: 42, differences: 5, notes: 'Inventaire trimestriel Q4', scope: 'Magasin Principal', scopeType: 'warehouse', scopeValue: 'Magasin Principal' },
  { id: 'INV004', date: '12/07/2025', status: 'completed', operator: 'P. Bernard', totalItems: 40, countedItems: 40, differences: 2, notes: 'Inventaire semestriel', scope: 'Tous', scopeType: 'warehouse', scopeValue: 'Magasin Principal' },
];

const families = ['Filtres', 'Joints', 'Hydraulique', 'Pompes', 'Électrique'];
const warehouses = ['Magasin Principal', 'Magasin Secondaire', 'Stock déporté'];

const ECART_THRESHOLD = 10;

const InventoryCounts: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('list');
  const [inventoryRecords, setInventoryRecords] = useState<InventoryRecord[]>(demoInventoryHistory);
  const [viewingInventoryId, setViewingInventoryId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // New/edit inventory state
  const [currentInventory, setCurrentInventory] = useState({
    id: '',
    scopeType: '' as 'family' | 'subFamily' | 'warehouse' | '',
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
    setCurrentInventory({ ...currentInventory, scopeType: value as any, scopeValue: '', subFamilyValue: '' });
    setInventoryLines([]);
  };

  const handleScopeValueChange = (value: string) => {
    setCurrentInventory({ ...currentInventory, scopeValue: value, subFamilyValue: '' });
    
    let filtered = demoParts;
    if (currentInventory.scopeType === 'family') {
      filtered = demoParts.filter(p => p.family === value);
    } else if (currentInventory.scopeType === 'warehouse') {
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
    setCurrentInventory({ ...currentInventory, subFamilyValue: value });
    
    const filtered = demoParts.filter(p => p.family === currentInventory.scopeValue && p.subFamily === value);
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
    setActiveTab('edit');
    setViewingInventoryId(null);
    setIsEditing(true);
    setCurrentInventory({ id: '', scopeType: '', scopeValue: '', subFamilyValue: '', date: new Date().toISOString().split('T')[0], notes: '' });
    setInventoryLines([]);
  };

  const handleOpenInventory = (inv: InventoryRecord, editMode: boolean) => {
    setViewingInventoryId(inv.id);
    setIsEditing(editMode);
    setCurrentInventory({
      id: inv.id,
      scopeType: inv.scopeType || '',
      scopeValue: inv.scopeValue || '',
      subFamilyValue: inv.subFamilyValue || '',
      date: inv.date,
      notes: inv.notes,
    });
    setInventoryLines(inv.lines || []);
    setActiveTab('edit');
  };

  const handlePauseInventory = () => {
    const countedItems = inventoryLines.filter(l => l.isOk !== null).length;
    const differences = inventoryLines.filter(l => l.isOk === false).length;

    if (viewingInventoryId) {
      // Update existing
      setInventoryRecords(inventoryRecords.map(inv => 
        inv.id === viewingInventoryId 
          ? { ...inv, status: 'en_cours' as const, countedItems, differences, notes: currentInventory.notes, lines: inventoryLines }
          : inv
      ));
    } else {
      // Create new in-progress
      const newRecord: InventoryRecord = {
        id: `INV${String(inventoryRecords.length + 1).padStart(3, '0')}`,
        date: new Date().toLocaleDateString('fr-FR'),
        status: 'en_cours',
        operator: 'Utilisateur',
        totalItems: inventoryLines.length,
        countedItems,
        differences,
        notes: currentInventory.notes,
        scope: currentInventory.scopeValue || 'Tous',
        scopeType: currentInventory.scopeType,
        scopeValue: currentInventory.scopeValue,
        subFamilyValue: currentInventory.subFamilyValue,
        lines: inventoryLines,
      };
      setInventoryRecords([newRecord, ...inventoryRecords]);
    }

    toast({ title: "Inventaire mis en pause", description: `${countedItems}/${inventoryLines.length} article(s) comptés.` });
    setActiveTab('list');
    setViewingInventoryId(null);
    setIsEditing(false);
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

    if (viewingInventoryId) {
      // Update existing to completed
      setInventoryRecords(inventoryRecords.map(inv => 
        inv.id === viewingInventoryId 
          ? { ...inv, status: 'completed' as const, countedItems: inventoryLines.length, differences, notes: currentInventory.notes, lines: inventoryLines }
          : inv
      ));
    } else {
      // Create new completed
      const newRecord: InventoryRecord = {
        id: `INV${String(inventoryRecords.length + 1).padStart(3, '0')}`,
        date: new Date().toLocaleDateString('fr-FR'),
        status: 'completed',
        operator: 'Utilisateur',
        totalItems: inventoryLines.length,
        countedItems: inventoryLines.length,
        differences,
        notes: currentInventory.notes,
        scope: currentInventory.scopeValue || 'Tous',
        scopeType: currentInventory.scopeType,
        scopeValue: currentInventory.scopeValue,
        subFamilyValue: currentInventory.subFamilyValue,
        lines: inventoryLines,
      };
      setInventoryRecords([newRecord, ...inventoryRecords]);
    }

    toast({ title: "Inventaire validé", description: `${inventoryLines.length} article(s) comptés. ${differences} écart(s).` });
    setActiveTab('list');
    setViewingInventoryId(null);
    setIsEditing(false);
  };

  const handleBackToList = () => {
    setActiveTab('list');
    setViewingInventoryId(null);
    setIsEditing(false);
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
            <TableRow key={inv.id} className="hover:bg-muted/30 cursor-pointer" onClick={() => handleOpenInventory(inv, inv.status === 'en_cours')}>
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
                <div className="flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                  {inv.status === 'en_cours' ? (
                    <Button variant="ghost" size="icon" className="h-8 w-8" title="Reprendre" onClick={() => handleOpenInventory(inv, true)}>
                      <Play className="h-4 w-4 text-primary" />
                    </Button>
                  ) : (
                    <Button variant="ghost" size="icon" className="h-8 w-8" title="Voir détails" onClick={() => handleOpenInventory(inv, false)}>
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

  const renderInventoryLinesTable = (readOnly: boolean) => (
    <div className="rounded-lg border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-24">Réf.</TableHead>
            <TableHead>Libellé</TableHead>
            <TableHead className="w-32">Emplacement</TableHead>
            <TableHead className="w-24 text-center">Théorique</TableHead>
            {!readOnly && <TableHead className="w-24 text-center">OK ?</TableHead>}
            <TableHead className="w-32 text-center">Qté réelle</TableHead>
            <TableHead className="w-24 text-center">Écart</TableHead>
            <TableHead className="w-28">{readOnly ? 'Justification' : 'Action'}</TableHead>
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
                  {!readOnly && (
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
                  )}
                  <TableCell className="text-center">
                    {readOnly ? (
                      <span className={line.isOk === false ? 'font-medium' : 'text-muted-foreground'}>
                        {line.actualQty !== null ? line.actualQty : '-'}
                      </span>
                    ) : line.isOk === false ? (
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
                    {readOnly ? (
                      line.justification ? (
                        <span className="text-xs text-muted-foreground">{line.justification}</span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )
                    ) : (
                      <>
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
                      </>
                    )}
                  </TableCell>
                </TableRow>
                {!readOnly && justifyingIndex === index && (
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
  );

  return (
    <div className="p-6 max-w-7xl mx-auto animate-fade-in">
      <PageTitle 
        title="Inventaires" 
        subtitle="Gestion des inventaires physiques"
        action={
          activeTab !== 'edit' && (
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
          {activeTab === 'edit' && (
            <TabsTrigger value="edit" className="gap-2">
              {viewingInventoryId ? (isEditing ? <Play className="h-4 w-4" /> : <Eye className="h-4 w-4" />) : <Plus className="h-4 w-4" />}
              {viewingInventoryId ? (isEditing ? 'Reprise' : 'Détails') : 'Nouvel inventaire'}
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

        {/* Edit/View inventory */}
        <TabsContent value="edit" className="mt-4 space-y-4">
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={handleBackToList}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <h3 className="font-semibold text-foreground">
                  {viewingInventoryId 
                    ? (isEditing ? `Reprise de l'inventaire ${viewingInventoryId}` : `Détails de l'inventaire ${viewingInventoryId}`)
                    : "Nouvel inventaire"
                  }
                </h3>
              </div>
              {viewingInventoryId && !isEditing && (
                <Button variant="outline" onClick={() => setIsEditing(true)}>
                  <Play className="h-4 w-4 mr-2" />
                  Reprendre
                </Button>
              )}
            </div>
            
            {/* Scope selection - only for new inventories */}
            {!viewingInventoryId && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Type de périmètre *</Label>
                  <Select value={currentInventory.scopeType} onValueChange={handleScopeTypeChange}>
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

                {currentInventory.scopeType === 'warehouse' && (
                  <div className="space-y-2">
                    <Label>Magasin *</Label>
                    <Select value={currentInventory.scopeValue} onValueChange={handleScopeValueChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner..." />
                      </SelectTrigger>
                      <SelectContent>
                        {warehouses.map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {(currentInventory.scopeType === 'family' || currentInventory.scopeType === 'subFamily') && (
                  <div className="space-y-2">
                    <Label>Famille *</Label>
                    <Select value={currentInventory.scopeValue} onValueChange={handleScopeValueChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner..." />
                      </SelectTrigger>
                      <SelectContent>
                        {families.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {currentInventory.scopeType === 'subFamily' && currentInventory.scopeValue && (
                  <div className="space-y-2">
                    <Label>Sous-famille *</Label>
                    <Select value={currentInventory.subFamilyValue} onValueChange={handleSubFamilyChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner..." />
                      </SelectTrigger>
                      <SelectContent>
                        {getSubFamilies(currentInventory.scopeValue).map(sf => <SelectItem key={sf} value={sf}>{sf}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={currentInventory.date}
                    onChange={(e) => setCurrentInventory({ ...currentInventory, date: e.target.value })}
                  />
                </div>
              </div>
            )}

            {/* Scope info for existing inventory */}
            {viewingInventoryId && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Date :</span>
                  <span className="ml-2 font-medium">{currentInventory.date}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Périmètre :</span>
                  <span className="ml-2 font-medium">{currentInventory.scopeValue}</span>
                </div>
              </div>
            )}
          </Card>

          {/* Inventory lines */}
          {inventoryLines.length > 0 && (
            <Card className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">
                  Articles ({inventoryLines.length})
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

              {renderInventoryLinesTable(!isEditing)}

              {/* Notes */}
              <div className="mt-4 space-y-2">
                <Label>Remarques générales</Label>
                <Textarea
                  value={currentInventory.notes}
                  onChange={(e) => setCurrentInventory({ ...currentInventory, notes: e.target.value })}
                  placeholder="Notes sur l'inventaire..."
                  className="min-h-[60px]"
                  disabled={!isEditing}
                />
              </div>

              {/* Actions */}
              {isEditing && (
                <div className="mt-4 flex justify-end gap-2">
                  <Button variant="outline" onClick={handleBackToList}>Annuler</Button>
                  <Button variant="outline" onClick={handlePauseInventory}>
                    <Pause className="h-4 w-4 mr-2" />
                    Mettre en pause
                  </Button>
                  <Button onClick={handleValidateInventory}>
                    <Check className="h-4 w-4 mr-2" />
                    Valider l'inventaire
                  </Button>
                </div>
              )}
            </Card>
          )}

          {!viewingInventoryId && !currentInventory.scopeType && (
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
