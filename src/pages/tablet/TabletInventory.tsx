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
   Sheet,
   SheetContent,
   SheetHeader,
   SheetTitle,
 } from '@/components/ui/sheet';
 import {
   Tabs,
   TabsContent,
   TabsList,
   TabsTrigger,
 } from '@/components/ui/tabs';
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
   TruckIcon,
   ClipboardCheck,
   History,
   Trash2,
   Calendar,
   TrendingDown,
   TrendingUp,
   ArrowRight,
   Eye
 } from 'lucide-react';
 import { useToast } from '@/hooks/use-toast';
 import { cn } from '@/lib/utils';
 
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
   price: number;
   stockStatus: 'ok' | 'low' | 'critical';
   expirationDate?: string;
 }
 
 interface ConsumptionRecord {
   id: string;
   date: string;
   type: 'consumption' | 'entry' | 'adjustment';
   quantity: number;
   interventionId?: string;
   interventionTitle?: string;
   operator: string;
   notes?: string;
 }
 
 interface ReceiptLine {
   partId: string;
   partName: string;
   expectedQty: number;
   receivedQty: number;
 }
 
 const initialParts: PartData[] = [
   { 
     id: 'PDR001', internalRef: 'PDR001', externalRef: 'SKF-FH2500', name: 'Filtre à huile', 
     family: 'Filtres', subFamily: 'Huile', quantity: 5, reservedQuantity: 2, minQuantity: 10, maxQuantity: 50,
     price: 75.50, warehouse: 'Magasin Principal', location: 'Étagère A3', stockStatus: 'low', expirationDate: '2026-06-15'
   },
   { 
     id: 'PDR002', internalRef: 'PDR002', externalRef: 'JT-50-VITON', name: 'Joint torique 50mm', 
     family: 'Joints', subFamily: 'Toriques', quantity: 25, reservedQuantity: 0, minQuantity: 15, maxQuantity: 100,
     price: 12.20, warehouse: 'Magasin Principal', location: 'Tiroir B2', stockStatus: 'ok'
   },
   { 
     id: 'PDR003', internalRef: 'PDR003', externalRef: 'PARKER-HYD-1M', name: 'Tuyau hydraulique 1m', 
     family: 'Hydraulique', subFamily: 'Tuyaux', quantity: 3, reservedQuantity: 1, minQuantity: 5, maxQuantity: 20,
     price: 95.30, warehouse: 'Magasin Principal', location: 'Étagère C1', stockStatus: 'low'
   },
   { 
     id: 'PDR004', internalRef: 'PDR004', externalRef: 'MANN-AF-500', name: 'Filtre à air', 
     family: 'Filtres', subFamily: 'Air', quantity: 12, reservedQuantity: 3, minQuantity: 8, maxQuantity: 40,
     price: 45.75, warehouse: 'Magasin Principal', location: 'Étagère A2', stockStatus: 'ok'
   },
   { 
     id: 'PDR005', internalRef: 'PDR005', externalRef: 'KIT-PUMP-R500', name: 'Kit réparation pompe', 
     family: 'Pompes', subFamily: 'Kits réparation', quantity: 2, reservedQuantity: 0, minQuantity: 2, maxQuantity: 10,
     price: 185.00, warehouse: 'Magasin Secondaire', location: 'Tiroir D4', stockStatus: 'critical', expirationDate: '2025-12-01'
   },
   { 
     id: 'PDR006', internalRef: 'PDR006', externalRef: 'ROULEMENT-6205', name: 'Roulement 6205-2RS', 
     family: 'Roulements', subFamily: 'Billes', quantity: 18, reservedQuantity: 4, minQuantity: 10, maxQuantity: 50,
     price: 28.90, warehouse: 'Magasin Principal', location: 'Tiroir E1', stockStatus: 'ok'
   },
 ];
 
 const demoHistory: ConsumptionRecord[] = [
   { id: 'C001', date: '15/01/2026', type: 'consumption', quantity: 2, interventionId: 'INT-2026-001', interventionTitle: 'Maintenance préventive compresseur', operator: 'J. Martin' },
   { id: 'C002', date: '10/01/2026', type: 'entry', quantity: 10, operator: 'A. Dupont', notes: 'Réception commande BL-2026-015' },
   { id: 'C003', date: '05/01/2026', type: 'consumption', quantity: 1, interventionId: 'INT-2025-089', interventionTitle: 'Dépannage pompe hydraulique', operator: 'P. Bernard' },
   { id: 'C004', date: '20/12/2025', type: 'adjustment', quantity: -3, operator: 'J. Martin', notes: 'Correction inventaire annuel' },
 ];
 
 const warehouses = ['Tous', 'Magasin Principal', 'Magasin Secondaire'];
 const families = ['Toutes', 'Filtres', 'Joints', 'Lubrifiants', 'Courroies', 'Roulements', 'Capteurs', 'Flexibles', 'Électrique', 'Pompes', 'Hydraulique'];
 
 const ECART_THRESHOLD = 10;
 
 type ViewMode = 'stock' | 'inventory' | 'receipt';
 
 const TabletInventory: React.FC = () => {
   const { toast } = useToast();
   const [parts, setParts] = useState<PartData[]>(initialParts);
   const [searchQuery, setSearchQuery] = useState('');
   const [warehouseFilter, setWarehouseFilter] = useState('Tous');
   const [familyFilter, setFamilyFilter] = useState('Toutes');
   const [viewMode, setViewMode] = useState<ViewMode>('stock');
   
   const [inventoryActuals, setInventoryActuals] = useState<Record<string, number | null>>({});
   const [pendingInventory, setPendingInventory] = useState<string[]>([]);
   const [justificationModal, setJustificationModal] = useState<PartData | null>(null);
   const [justification, setJustification] = useState('');
   
   const [receiptLines, setReceiptLines] = useState<ReceiptLine[]>([]);
   const [supplier, setSupplier] = useState('');
   const [deliveryNote, setDeliveryNote] = useState('');
   const [selectedPartForReceipt, setSelectedPartForReceipt] = useState('');
   
   const [historySheet, setHistorySheet] = useState<PartData | null>(null);
 
   const filteredParts = parts.filter(part => {
     const matchesSearch = part.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          part.internalRef.toLowerCase().includes(searchQuery.toLowerCase());
     const matchesWarehouse = warehouseFilter === 'Tous' || part.warehouse === warehouseFilter;
     const matchesFamily = familyFilter === 'Toutes' || part.family === familyFilter;
     return matchesSearch && matchesWarehouse && matchesFamily;
   });
 
   const lowStockCount = parts.filter(p => p.stockStatus === 'low').length;
   const criticalCount = parts.filter(p => p.stockStatus === 'critical').length;
 
   const handleInventoryQtyChange = (partId: string, qty: number | null) => {
     setInventoryActuals(prev => ({ ...prev, [partId]: qty }));
     if (!pendingInventory.includes(partId) && qty !== null) {
       setPendingInventory(prev => [...prev, partId]);
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
 
   const needsJustification = (part: PartData) => {
     const ecartPercent = calculateEcartPercent(part.quantity, inventoryActuals[part.id] ?? null);
     return ecartPercent !== null && ecartPercent > ECART_THRESHOLD;
   };
 
   const handleValidateInventory = (part: PartData) => {
     const actual = inventoryActuals[part.id];
     if (actual === null || actual === undefined) {
       toast({ title: "Quantité requise", description: "Veuillez saisir la quantité réelle.", variant: "destructive" });
       return;
     }
     if (needsJustification(part)) {
       setJustificationModal(part);
       setJustification('');
     } else {
       confirmInventory(part.id);
     }
   };
 
   const confirmInventory = (partId: string, withJustification?: string) => {
     const actual = inventoryActuals[partId];
     if (actual !== null && actual !== undefined) {
       setParts(prev => prev.map(p => 
         p.id === partId ? { 
           ...p, 
           quantity: actual,
           stockStatus: actual >= p.minQuantity ? 'ok' : actual > 0 ? 'low' : 'critical'
         } : p
       ));
     }
     setPendingInventory(prev => prev.filter(id => id !== partId));
     setInventoryActuals(prev => { const copy = {...prev}; delete copy[partId]; return copy; });
     setJustificationModal(null);
     setJustification('');
     toast({ 
       title: "Inventaire enregistré", 
       description: withJustification ? "L'écart a été justifié et enregistré." : "La quantité a été mise à jour."
     });
   };
 
   const handleSyncAllInventory = () => {
     const itemsNeedingJustification = parts.filter(p => pendingInventory.includes(p.id) && needsJustification(p));
     if (itemsNeedingJustification.length > 0) {
       toast({ title: "Justification requise", description: `${itemsNeedingJustification.length} article(s) nécessitent une justification.`, variant: "destructive" });
       return;
     }
     pendingInventory.forEach(id => confirmInventory(id));
     toast({ title: "Synchronisation réussie", description: `${pendingInventory.length} article(s) synchronisé(s).` });
   };
 
   const handleAddReceiptLine = () => {
     if (!selectedPartForReceipt) return;
     const part = parts.find(p => p.id === selectedPartForReceipt);
     if (!part || receiptLines.some(l => l.partId === selectedPartForReceipt)) {
       toast({ title: "Pièce déjà ajoutée", variant: "destructive" });
       return;
     }
     setReceiptLines(prev => [...prev, { partId: part.id, partName: part.name, expectedQty: 0, receivedQty: 0 }]);
     setSelectedPartForReceipt('');
   };
 
   const handleUpdateReceiptLine = (index: number, field: 'expectedQty' | 'receivedQty', value: number) => {
     setReceiptLines(prev => prev.map((l, i) => i === index ? { ...l, [field]: value } : l));
   };
 
   const handleRemoveReceiptLine = (index: number) => {
     setReceiptLines(prev => prev.filter((_, i) => i !== index));
   };
 
   const handleConfirmReceipt = () => {
     if (!supplier || receiptLines.length === 0) {
       toast({ title: "Données incomplètes", description: "Renseignez le fournisseur et au moins une ligne.", variant: "destructive" });
       return;
     }
     receiptLines.forEach(line => {
       setParts(prev => prev.map(p => 
         p.id === line.partId ? {
           ...p,
           quantity: p.quantity + line.receivedQty,
           stockStatus: (p.quantity + line.receivedQty) >= p.minQuantity ? 'ok' : 'low'
         } : p
       ));
     });
     toast({ title: "Réception enregistrée", description: `${receiptLines.length} article(s) réceptionné(s).` });
     setReceiptLines([]);
     setSupplier('');
     setDeliveryNote('');
     setViewMode('stock');
   };
 
   const totalReceived = receiptLines.reduce((sum, l) => sum + l.receivedQty, 0);
 
   return (
     <div className="p-4 pb-8 space-y-4">
       <div className="flex items-start justify-between">
         <div>
           <h1 className="text-2xl font-bold text-foreground">Stock & Inventaire</h1>
           <p className="text-muted-foreground mt-1">Gérer les pièces et quantités</p>
         </div>
       </div>
 
       <div className="grid grid-cols-4 gap-3">
         <Card className="p-3 text-center">
           <Package className="h-5 w-5 mx-auto text-muted-foreground mb-1" />
           <div className="text-xl font-bold text-foreground">{parts.length}</div>
           <div className="text-xs text-muted-foreground">Références</div>
         </Card>
         <Card className="p-3 text-center">
           <div className="text-xl font-bold text-foreground">{parts.reduce((s, p) => s + p.quantity, 0)}</div>
           <div className="text-xs text-muted-foreground">Pièces en stock</div>
         </Card>
         <Card className={cn("p-3 text-center", lowStockCount > 0 && "bg-warning/10 border-warning/30")}>
           <div className="text-xl font-bold text-warning">{lowStockCount}</div>
           <div className="text-xs text-muted-foreground">Stock faible</div>
         </Card>
         <Card className={cn("p-3 text-center", criticalCount > 0 && "bg-destructive/10 border-destructive/30")}>
           <div className="text-xl font-bold text-destructive">{criticalCount}</div>
           <div className="text-xs text-muted-foreground">Critique</div>
         </Card>
       </div>
 
       <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)} className="w-full">
         <TabsList className="grid w-full grid-cols-3 h-12">
           <TabsTrigger value="stock" className="gap-2 text-base">
             <Eye className="h-4 w-4" />
             Visualiser
           </TabsTrigger>
           <TabsTrigger value="inventory" className="gap-2 text-base">
             <ClipboardCheck className="h-4 w-4" />
             Inventaire
           </TabsTrigger>
           <TabsTrigger value="receipt" className="gap-2 text-base">
             <TruckIcon className="h-4 w-4" />
             Réception
           </TabsTrigger>
         </TabsList>
 
         <TabsContent value="stock" className="mt-4 space-y-4">
           <Card className="p-4 space-y-3">
             <div className="relative">
               <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
               <Input placeholder="Rechercher..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-12 h-12" />
             </div>
             <div className="grid grid-cols-2 gap-3">
               <Select value={warehouseFilter} onValueChange={setWarehouseFilter}>
                 <SelectTrigger className="h-12"><MapPin className="h-4 w-4 mr-2 text-muted-foreground" /><SelectValue /></SelectTrigger>
                 <SelectContent>{warehouses.map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}</SelectContent>
               </Select>
               <Select value={familyFilter} onValueChange={setFamilyFilter}>
                 <SelectTrigger className="h-12"><Filter className="h-4 w-4 mr-2 text-muted-foreground" /><SelectValue /></SelectTrigger>
                 <SelectContent>{families.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
               </Select>
             </div>
           </Card>
 
           <div className="space-y-3">
             {filteredParts.map(part => (
               <Card key={part.id} className={cn("p-4", part.stockStatus === 'critical' && "border-destructive/50 bg-destructive/5", part.stockStatus === 'low' && "border-warning/50 bg-warning/5")}>
                 <div className="flex items-start justify-between gap-3">
                   <div className="flex-1 min-w-0">
                     <div className="flex items-center gap-2 mb-1 flex-wrap">
                       <Badge variant="outline" className="text-xs font-mono">{part.internalRef}</Badge>
                       <Badge className="text-xs bg-muted text-muted-foreground">{part.family}</Badge>
                       {part.expirationDate && (
                         <Badge variant="outline" className="text-xs gap-1">
                           <Calendar className="h-3 w-3" />
                           {new Date(part.expirationDate).toLocaleDateString('fr-FR')}
                         </Badge>
                       )}
                     </div>
                     <h3 className="font-semibold text-foreground">{part.name}</h3>
                     <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                       <MapPin className="h-3 w-3" />
                       {part.warehouse} - {part.location}
                     </div>
                   </div>
                   <Badge className={cn(
                     "text-xs shrink-0",
                     part.stockStatus === 'ok' && "bg-green-100 text-green-700",
                     part.stockStatus === 'low' && "bg-warning/20 text-warning",
                     part.stockStatus === 'critical' && "bg-destructive/20 text-destructive"
                   )}>
                     {part.stockStatus === 'ok' ? 'OK' : part.stockStatus === 'low' ? 'Faible' : 'Critique'}
                   </Badge>
                 </div>
                 
                 <div className="grid grid-cols-4 gap-2 mt-3 p-3 bg-muted/30 rounded-lg text-center">
                   <div>
                     <div className="text-xs text-muted-foreground">Stock</div>
                     <div className={cn("text-lg font-bold", part.quantity < part.minQuantity ? "text-destructive" : "text-foreground")}>{part.quantity}</div>
                   </div>
                   <div>
                     <div className="text-xs text-muted-foreground">Réservé</div>
                     <div className="text-lg font-medium text-muted-foreground">{part.reservedQuantity}</div>
                   </div>
                   <div>
                     <div className="text-xs text-muted-foreground">Dispo</div>
                     <div className="text-lg font-bold text-primary">{part.quantity - part.reservedQuantity}</div>
                   </div>
                   <div>
                     <div className="text-xs text-muted-foreground">Seuil</div>
                     <div className="text-sm text-muted-foreground">{part.minQuantity} - {part.maxQuantity}</div>
                   </div>
                 </div>
                 
                 <div className="flex justify-between items-center mt-3">
                   <span className="text-sm font-medium">{part.price.toFixed(2)} € / unité</span>
                   <Button variant="ghost" size="sm" className="gap-1" onClick={() => setHistorySheet(part)}>
                     <History className="h-4 w-4" />
                     Historique
                   </Button>
                 </div>
               </Card>
             ))}
             {filteredParts.length === 0 && (
               <Card className="p-8 text-center">
                 <Package className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                 <p className="text-muted-foreground">Aucun article trouvé</p>
               </Card>
             )}
           </div>
         </TabsContent>
 
         <TabsContent value="inventory" className="mt-4 space-y-4">
           {pendingInventory.length > 0 && (
             <div className="flex justify-between items-center">
               <Badge className="bg-orange-500 text-white">{pendingInventory.length} en attente</Badge>
               <Button onClick={handleSyncAllInventory} className="gap-2">
                 <RefreshCw className="h-4 w-4" />
                 Synchroniser tout
               </Button>
             </div>
           )}
           
           <Card className="p-4">
             <div className="relative">
               <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
               <Input placeholder="Rechercher un article à inventorier..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-12 h-12" />
             </div>
           </Card>
 
           <div className="space-y-3">
             {filteredParts.map(part => {
               const actual = inventoryActuals[part.id] ?? null;
               const ecart = calculateEcart(part.quantity, actual);
               const largeEcart = needsJustification(part);
               const isPending = pendingInventory.includes(part.id);
 
               return (
                 <Card key={part.id} className={cn("p-4", isPending && "border-orange-300 bg-orange-50/30", actual !== null && !isPending && "border-green-300 bg-green-50/30")}>
                   <div className="flex items-start justify-between gap-3 mb-3">
                     <div className="flex-1 min-w-0">
                       <div className="flex items-center gap-2 mb-1">
                         <Badge variant="outline" className="text-xs font-mono">{part.internalRef}</Badge>
                         <Badge className="text-xs bg-muted text-muted-foreground">{part.family}</Badge>
                       </div>
                       <h3 className="font-semibold text-foreground">{part.name}</h3>
                       <div className="text-sm text-muted-foreground">{part.location}</div>
                     </div>
                     {isPending && <Badge className="bg-orange-500 text-white shrink-0">En attente</Badge>}
                   </div>
 
                   <div className="grid grid-cols-3 gap-3 p-3 bg-muted/30 rounded-lg">
                     <div className="text-center">
                       <div className="text-xs text-muted-foreground mb-1">Théorique</div>
                       <div className="text-lg font-bold text-foreground">{part.quantity}</div>
                     </div>
                     <div className="text-center">
                       <div className="text-xs text-muted-foreground mb-1">Réel</div>
                       <div className="flex items-center justify-center gap-1">
                         <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleInventoryQtyChange(part.id, Math.max(0, (actual ?? part.quantity) - 1))}>
                           <Minus className="h-4 w-4" />
                         </Button>
                         <Input type="number" value={actual ?? ''} onChange={(e) => handleInventoryQtyChange(part.id, e.target.value ? parseInt(e.target.value) : null)} className="w-16 h-8 text-center text-lg font-bold" placeholder="?" />
                         <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleInventoryQtyChange(part.id, (actual ?? part.quantity) + 1)}>
                           <Plus className="h-4 w-4" />
                         </Button>
                       </div>
                     </div>
                     <div className="text-center">
                       <div className="text-xs text-muted-foreground mb-1">Écart</div>
                       {ecart !== null ? (
                         <div className={cn("text-lg font-bold", ecart === 0 && "text-green-600", ecart > 0 && "text-blue-600", ecart < 0 && "text-red-600")}>
                           {ecart > 0 ? '+' : ''}{ecart}
                           {largeEcart && <AlertTriangle className="h-4 w-4 inline ml-1 text-orange-500" />}
                         </div>
                       ) : <div className="text-lg text-muted-foreground">-</div>}
                     </div>
                   </div>
 
                   {actual !== null && (
                     <Button className="w-full h-12 mt-3" variant={isPending ? "default" : "outline"} onClick={() => handleValidateInventory(part)}>
                       {isPending ? <><Save className="h-5 w-5 mr-2" />Valider l'inventaire</> : <><Check className="h-5 w-5 mr-2" />Inventorié</>}
                     </Button>
                   )}
                 </Card>
               );
             })}
           </div>
         </TabsContent>
 
         <TabsContent value="receipt" className="mt-4 space-y-4">
           <Card className="p-4 space-y-4">
             <h3 className="font-semibold text-foreground">Informations livraison</h3>
             <div className="grid grid-cols-2 gap-3">
               <div className="space-y-2">
                 <Label>Fournisseur *</Label>
                 <Input value={supplier} onChange={(e) => setSupplier(e.target.value)} placeholder="Nom du fournisseur" className="h-12" />
               </div>
               <div className="space-y-2">
                 <Label>N° bon de livraison</Label>
                 <Input value={deliveryNote} onChange={(e) => setDeliveryNote(e.target.value)} placeholder="BL-2026-001" className="h-12" />
               </div>
             </div>
           </Card>
 
           <Card className="p-4 space-y-4">
             <h3 className="font-semibold text-foreground">Articles à réceptionner</h3>
             <div className="flex gap-2">
               <Select value={selectedPartForReceipt} onValueChange={setSelectedPartForReceipt}>
                 <SelectTrigger className="flex-1 h-12"><SelectValue placeholder="Sélectionner une pièce..." /></SelectTrigger>
                 <SelectContent>
                   {parts.map(p => <SelectItem key={p.id} value={p.id}>{p.internalRef} - {p.name}</SelectItem>)}
                 </SelectContent>
               </Select>
               <Button onClick={handleAddReceiptLine} disabled={!selectedPartForReceipt} className="h-12 px-6">
                 <Plus className="h-5 w-5" />
               </Button>
             </div>
 
             {receiptLines.length === 0 ? (
               <div className="p-6 text-center border-2 border-dashed rounded-lg">
                 <Package className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                 <p className="text-sm text-muted-foreground">Aucun article ajouté</p>
               </div>
             ) : (
               <div className="space-y-3">
                 {receiptLines.map((line, index) => (
                   <Card key={line.partId} className="p-3">
                     <div className="flex items-center gap-3">
                       <div className="flex-1 min-w-0">
                         <Badge variant="outline" className="text-xs font-mono mb-1">{line.partId}</Badge>
                         <p className="font-medium text-sm truncate">{line.partName}</p>
                       </div>
                       <div className="flex items-center gap-2">
                         <div className="text-center">
                           <Label className="text-xs text-muted-foreground">Attendu</Label>
                           <Input type="number" min="0" className="w-16 h-8 text-center" value={line.expectedQty} onChange={(e) => handleUpdateReceiptLine(index, 'expectedQty', parseInt(e.target.value) || 0)} />
                         </div>
                         <div className="text-center">
                           <Label className="text-xs text-muted-foreground">Reçu</Label>
                           <Input type="number" min="0" className="w-16 h-8 text-center" value={line.receivedQty} onChange={(e) => handleUpdateReceiptLine(index, 'receivedQty', parseInt(e.target.value) || 0)} />
                         </div>
                         <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleRemoveReceiptLine(index)}>
                           <Trash2 className="h-4 w-4" />
                         </Button>
                       </div>
                     </div>
                   </Card>
                 ))}
                 <div className="flex justify-between items-center pt-2">
                   <Badge className="bg-primary/10 text-primary">Total: {totalReceived} pièce(s)</Badge>
                   <Button onClick={handleConfirmReceipt} disabled={receiptLines.length === 0 || !supplier} className="gap-2">
                     <Check className="h-4 w-4" />
                     Valider la réception
                   </Button>
                 </div>
               </div>
             )}
           </Card>
         </TabsContent>
       </Tabs>
 
       {justificationModal && (
         <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
           <Card className="w-full max-w-md p-6 space-y-4">
             <div className="flex items-center gap-3 text-orange-600">
               <AlertTriangle className="h-6 w-6" />
               <h2 className="text-xl font-bold">Écart important détecté</h2>
             </div>
             <div className="p-4 bg-orange-50 rounded-lg space-y-2">
               <p className="font-medium text-foreground">{justificationModal.name}</p>
               <div className="grid grid-cols-2 gap-2 text-sm">
                 <div><span className="text-muted-foreground">Théorique:</span> <span className="font-medium">{justificationModal.quantity}</span></div>
                 <div><span className="text-muted-foreground">Réel:</span> <span className="font-medium">{inventoryActuals[justificationModal.id]}</span></div>
               </div>
             </div>
             <div className="space-y-2">
               <Label className="text-base font-medium">Justification obligatoire <span className="text-destructive">*</span></Label>
               <Textarea placeholder="Expliquez la raison de cet écart..." value={justification} onChange={(e) => setJustification(e.target.value)} className="min-h-[100px]" />
             </div>
             <div className="flex gap-3">
               <Button variant="outline" className="flex-1 h-12" onClick={() => { setJustificationModal(null); setJustification(''); }}>Annuler</Button>
               <Button className="flex-1 h-12" disabled={!justification.trim()} onClick={() => confirmInventory(justificationModal.id, justification)}>
                 <Check className="h-5 w-5 mr-2" />Confirmer
               </Button>
             </div>
           </Card>
         </div>
       )}
 
       <Sheet open={!!historySheet} onOpenChange={() => setHistorySheet(null)}>
         <SheetContent side="bottom" className="h-[80vh]">
           <SheetHeader>
             <SheetTitle className="flex items-center gap-2">
               <History className="h-5 w-5" />
               Historique - {historySheet?.name}
             </SheetTitle>
           </SheetHeader>
           {historySheet && (
             <div className="mt-4 space-y-4 overflow-y-auto max-h-[calc(80vh-100px)]">
               <div className="grid grid-cols-3 gap-3">
                 <Card className="p-3 text-center">
                   <TrendingDown className="h-4 w-4 mx-auto text-destructive mb-1" />
                   <div className="text-lg font-bold text-destructive">-{demoHistory.filter(r => r.type === 'consumption').reduce((s, r) => s + r.quantity, 0)}</div>
                   <div className="text-xs text-muted-foreground">Consommé</div>
                 </Card>
                 <Card className="p-3 text-center">
                   <TrendingUp className="h-4 w-4 mx-auto text-green-600 mb-1" />
                   <div className="text-lg font-bold text-green-600">+{demoHistory.filter(r => r.type === 'entry').reduce((s, r) => s + r.quantity, 0)}</div>
                   <div className="text-xs text-muted-foreground">Entrées</div>
                 </Card>
                 <Card className="p-3 text-center">
                   <ArrowRight className="h-4 w-4 mx-auto text-muted-foreground mb-1" />
                   <div className="text-lg font-bold">{demoHistory.length}</div>
                   <div className="text-xs text-muted-foreground">Mouvements</div>
                 </Card>
               </div>
               
               <div className="space-y-2">
                 {demoHistory.map(record => (
                   <Card key={record.id} className="p-3">
                     <div className="flex items-start justify-between gap-3">
                       <div className="flex-1">
                         <div className="flex items-center gap-2 mb-1">
                           <span className="text-sm text-muted-foreground">{record.date}</span>
                           <Badge className={cn("text-xs",
                             record.type === 'consumption' && "bg-red-100 text-red-700",
                             record.type === 'entry' && "bg-green-100 text-green-700",
                             record.type === 'adjustment' && "bg-blue-100 text-blue-700"
                           )}>
                             {record.type === 'consumption' ? 'Consommation' : record.type === 'entry' ? 'Entrée' : 'Ajustement'}
                           </Badge>
                         </div>
                         {record.interventionId && (
                           <p className="text-sm text-primary">{record.interventionTitle}</p>
                         )}
                         <p className="text-xs text-muted-foreground">{record.operator} {record.notes && `• ${record.notes}`}</p>
                       </div>
                       <div className={cn("text-lg font-bold", record.type === 'consumption' ? "text-destructive" : "text-green-600")}>
                         {record.type === 'consumption' ? '-' : '+'}{Math.abs(record.quantity)}
                       </div>
                     </div>
                   </Card>
                 ))}
               </div>
             </div>
           )}
         </SheetContent>
       </Sheet>
     </div>
   );
 };
 
 export default TabletInventory;