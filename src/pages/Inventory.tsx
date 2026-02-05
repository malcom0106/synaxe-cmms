 import React, { useState } from 'react';
 import { PageTitle } from '@/components/ui/PageTitle';
 import { StatusBadge } from '@/components/ui/StatusBadge';
 import { Button } from '@/components/ui/button';
 import { Input } from '@/components/ui/input';
 import { Badge } from '@/components/ui/badge';
 import {
   Sheet,
   SheetContent,
   SheetHeader,
   SheetTitle,
 } from '@/components/ui/sheet';
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
   Package, 
   Filter,
   ShoppingCart,
   AlertTriangle,
   BarChart3,
   Search,
   TruckIcon,
   ClipboardCheck,
   Edit,
   History,
   Calendar
 } from 'lucide-react';
 import { CreateEditPartModal, PartData } from '@/components/inventory/CreateEditPartModal';
 import { GoodsReceiptModal } from '@/components/inventory/GoodsReceiptModal';
 import { InventoryCountModal } from '@/components/inventory/InventoryCountModal';
 import { ConsumptionHistoryPanel } from '@/components/inventory/ConsumptionHistoryPanel';
 import { useToast } from '@/hooks/use-toast';
 
 // Demo data for inventory items with extended fields
 const initialInventoryItems: PartData[] = [
   { 
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
     price: 75.50,
     warehouse: 'Magasin Principal',
     location: 'Étagère A3',
     stockStatus: 'low',
     expirationDate: '2026-06-15',
   },
   { 
     id: 'PDR002',
     internalRef: 'PDR002',
     externalRef: 'JT-50-VITON',
     name: 'Joint torique 50mm', 
     family: 'Joints',
     subFamily: 'Toriques',
     quantity: 25,
     reservedQuantity: 0,
     minQuantity: 15,
     maxQuantity: 100,
     price: 12.20,
     warehouse: 'Magasin Principal',
     location: 'Tiroir B2',
     stockStatus: 'ok',
   },
   { 
     id: 'PDR003',
     internalRef: 'PDR003',
     externalRef: 'PARKER-HYD-1M',
     name: 'Tuyau hydraulique 1m', 
     family: 'Hydraulique',
     subFamily: 'Tuyaux',
     quantity: 3,
     reservedQuantity: 1,
     minQuantity: 5,
     maxQuantity: 20,
     price: 95.30,
     warehouse: 'Magasin Principal',
     location: 'Étagère C1',
     stockStatus: 'low',
   },
   { 
     id: 'PDR004',
     internalRef: 'PDR004',
     externalRef: 'MANN-AF-500',
     name: 'Filtre à air', 
     family: 'Filtres',
     subFamily: 'Air',
     quantity: 12,
     reservedQuantity: 3,
     minQuantity: 8,
     maxQuantity: 40,
     price: 45.75,
     warehouse: 'Magasin Principal',
     location: 'Étagère A2',
     stockStatus: 'ok',
   },
   { 
     id: 'PDR005',
     internalRef: 'PDR005',
     externalRef: 'KIT-PUMP-R500',
     name: 'Kit de réparation pompe', 
     family: 'Pompes',
     subFamily: 'Kits réparation',
     quantity: 2,
     reservedQuantity: 0,
     minQuantity: 2,
     maxQuantity: 10,
     price: 185.00,
     warehouse: 'Magasin Secondaire',
     location: 'Tiroir D4',
     stockStatus: 'critical',
     expirationDate: '2025-12-01',
   },
 ];
 
 // Demo consumption history
 const demoConsumptionHistory = [
   { id: 'C001', date: '15/01/2026', type: 'consumption' as const, quantity: 2, interventionId: 'INT-2026-001', interventionTitle: 'Maintenance préventive compresseur', operator: 'J. Martin', notes: 'Remplacement filtres' },
   { id: 'C002', date: '10/01/2026', type: 'entry' as const, quantity: 10, operator: 'A. Dupont', notes: 'Réception commande BL-2026-015' },
   { id: 'C003', date: '05/01/2026', type: 'consumption' as const, quantity: 1, interventionId: 'INT-2025-089', interventionTitle: 'Dépannage pompe hydraulique', operator: 'P. Bernard' },
   { id: 'C004', date: '20/12/2025', type: 'adjustment' as const, quantity: -3, operator: 'J. Martin', notes: 'Correction inventaire annuel' },
   { id: 'C005', date: '15/12/2025', type: 'consumption' as const, quantity: 2, interventionId: 'INT-2025-082', interventionTitle: 'Révision générale ligne 2', operator: 'A. Dupont' },
 ];
 
 const Inventory: React.FC = () => {
   const { toast } = useToast();
   const [items, setItems] = useState<PartData[]>(initialInventoryItems);
   const [searchQuery, setSearchQuery] = useState('');
   const [createEditModalOpen, setCreateEditModalOpen] = useState(false);
   const [goodsReceiptModalOpen, setGoodsReceiptModalOpen] = useState(false);
   const [inventoryModalOpen, setInventoryModalOpen] = useState(false);
   const [historySheetOpen, setHistorySheetOpen] = useState(false);
   const [editingPart, setEditingPart] = useState<PartData | null>(null);
   const [selectedPartForHistory, setSelectedPartForHistory] = useState<PartData | null>(null);
 
   const filteredItems = items.filter(item =>
     item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     item.internalRef.toLowerCase().includes(searchQuery.toLowerCase()) ||
     item.family.toLowerCase().includes(searchQuery.toLowerCase())
   );
 
   const handleSavePart = (part: PartData) => {
     if (editingPart) {
       setItems(items.map(i => i.id === part.id ? part : i));
     } else {
       setItems([...items, part]);
     }
     setEditingPart(null);
   };
 
   const handleEditPart = (part: PartData) => {
     setEditingPart(part);
     setCreateEditModalOpen(true);
   };
 
   const handleViewHistory = (part: PartData) => {
     setSelectedPartForHistory(part);
     setHistorySheetOpen(true);
   };
 
   const handleGoodsReceipt = (data: { lines: Array<{ partId: string; receivedQty: number }> }) => {
     const updatedItems = [...items];
     data.lines.forEach((line) => {
       const idx = updatedItems.findIndex(i => i.id === line.partId);
       if (idx !== -1) {
         updatedItems[idx] = {
           ...updatedItems[idx],
           quantity: updatedItems[idx].quantity + line.receivedQty,
           stockStatus: updatedItems[idx].quantity + line.receivedQty >= updatedItems[idx].minQuantity ? 'ok' : 'low',
         };
       }
     });
     setItems(updatedItems);
   };
 
   const handleInventoryCount = (data: { lines: Array<{ partId: string; actualQty: number | null }> }) => {
     const updatedItems = [...items];
     data.lines.forEach((line) => {
       const idx = updatedItems.findIndex(i => i.id === line.partId);
       if (idx !== -1 && line.actualQty !== null) {
         updatedItems[idx] = {
           ...updatedItems[idx],
           quantity: line.actualQty,
           stockStatus: line.actualQty >= updatedItems[idx].minQuantity ? 'ok' : 
                        line.actualQty > 0 ? 'low' : 'critical',
         };
       }
     });
     setItems(updatedItems);
   };
 
   const lowStockCount = items.filter(i => i.stockStatus === 'low').length;
   const criticalCount = items.filter(i => i.stockStatus === 'critical' || i.quantity === 0).length;
   const totalValue = items.reduce((sum, i) => sum + (i.quantity * i.price), 0);
 
   return (
     <div className="p-6 max-w-7xl mx-auto animate-fade-in">
       <PageTitle 
         title="Stocks et Pièces de Rechange" 
         subtitle="Gérer l'inventaire des pièces détachées"
         action={
           <div className="flex flex-wrap gap-2">
             <Button variant="outline" onClick={() => setInventoryModalOpen(true)}>
               <ClipboardCheck className="h-4 w-4 mr-2" />
               Inventaire
             </Button>
             <Button variant="outline" onClick={() => setGoodsReceiptModalOpen(true)}>
               <TruckIcon className="h-4 w-4 mr-2" />
               Entrée marchandise
             </Button>
             <Button variant="outline">
               <ShoppingCart className="h-4 w-4 mr-2" />
               Commander
             </Button>
             <Button className="btn-primary" onClick={() => { setEditingPart(null); setCreateEditModalOpen(true); }}>
               <Plus className="h-4 w-4 mr-2" />
               Nouvelle pièce
             </Button>
           </div>
         }
       />
       
       <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-3">
         <div className="relative flex-1">
           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
           <Input
             type="text"
             placeholder="Rechercher par référence, nom, famille..."
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
             className="pl-9"
           />
         </div>
         <Button variant="outline" size="sm" className="flex items-center">
           <Filter className="h-4 w-4 mr-2" />
           Filtrer
         </Button>
         <Button variant="outline" size="sm" className="flex items-center">
           <BarChart3 className="h-4 w-4 mr-2" />
           Statistiques
         </Button>
       </div>
       
       <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
         <div className="card-dashboard card-hover">
           <div className="flex justify-between mb-3">
             <Package className="h-6 w-6 text-muted-foreground" />
           </div>
           <h3 className="text-sm font-medium text-muted-foreground">Total des références</h3>
           <div className="text-2xl font-bold text-foreground mt-1">{items.length}</div>
         </div>
         <div className="card-dashboard card-hover">
           <div className="flex justify-between mb-3">
             <ShoppingCart className="h-6 w-6 text-muted-foreground" />
           </div>
           <h3 className="text-sm font-medium text-muted-foreground">Valeur du stock</h3>
           <div className="text-2xl font-bold text-foreground mt-1">{totalValue.toLocaleString('fr-FR')} €</div>
         </div>
         <div className="card-dashboard card-hover">
           <div className="flex justify-between mb-3">
             <AlertTriangle className="h-6 w-6 text-warning" />
             <StatusBadge status="warning" label="Attention" />
           </div>
           <h3 className="text-sm font-medium text-muted-foreground">Stock faible</h3>
           <div className="text-2xl font-bold text-warning mt-1">{lowStockCount}</div>
         </div>
         <div className="card-dashboard card-hover">
           <div className="flex justify-between mb-3">
             <AlertTriangle className="h-6 w-6 text-destructive" />
             <StatusBadge status="danger" label="Critique" />
           </div>
           <h3 className="text-sm font-medium text-muted-foreground">Rupture de stock</h3>
           <div className="text-2xl font-bold text-destructive mt-1">{criticalCount}</div>
         </div>
       </div>
       
       <div className="rounded-xl border bg-card overflow-hidden">
         <div className="overflow-x-auto">
           <Table>
             <TableHeader>
               <TableRow className="bg-muted/50">
                 <TableHead className="w-28">Réf. interne</TableHead>
                 <TableHead>Désignation</TableHead>
                 <TableHead className="w-32">Famille</TableHead>
                 <TableHead className="w-40">Emplacement</TableHead>
                 <TableHead className="w-36 text-center">Quantités</TableHead>
                 <TableHead className="w-24 text-right">Prix</TableHead>
                 <TableHead className="w-24">DLC</TableHead>
                 <TableHead className="w-24">Statut</TableHead>
                 <TableHead className="w-28 text-right">Actions</TableHead>
               </TableRow>
             </TableHeader>
             <TableBody>
               {filteredItems.map((item) => (
                 <TableRow key={item.id} className="hover:bg-muted/30">
                   <TableCell>
                     <Badge variant="outline" className="font-mono text-xs">{item.internalRef}</Badge>
                   </TableCell>
                   <TableCell>
                     <div className="font-medium text-foreground">{item.name}</div>
                     {item.externalRef && (
                       <div className="text-xs text-muted-foreground">{item.externalRef}</div>
                     )}
                   </TableCell>
                   <TableCell>
                     <div className="text-sm">{item.family}</div>
                     {item.subFamily && (
                       <div className="text-xs text-muted-foreground">{item.subFamily}</div>
                     )}
                   </TableCell>
                   <TableCell>
                     <div className="text-sm">{item.warehouse}</div>
                     <div className="text-xs text-muted-foreground">{item.location}</div>
                   </TableCell>
                   <TableCell>
                     <div className="flex flex-col items-center gap-0.5">
                       <span className={
                         item.quantity < item.minQuantity 
                           ? 'font-bold text-destructive' 
                           : item.quantity === item.minQuantity
                             ? 'font-bold text-warning'
                             : 'font-medium text-foreground'
                       }>
                         {item.quantity}
                       </span>
                       <div className="flex gap-1 text-xs text-muted-foreground">
                         <span>min {item.minQuantity}</span>
                         <span>•</span>
                         <span>max {item.maxQuantity}</span>
                       </div>
                       {item.reservedQuantity > 0 && (
                         <Badge variant="secondary" className="text-xs">
                           {item.reservedQuantity} réservé
                         </Badge>
                       )}
                     </div>
                   </TableCell>
                   <TableCell className="text-right text-sm">
                     {item.price.toFixed(2)} €
                   </TableCell>
                   <TableCell>
                     {item.expirationDate ? (
                       <div className="flex items-center gap-1 text-xs">
                         <Calendar className="h-3 w-3 text-muted-foreground" />
                         {new Date(item.expirationDate).toLocaleDateString('fr-FR')}
                       </div>
                     ) : (
                       <span className="text-xs text-muted-foreground">-</span>
                     )}
                   </TableCell>
                   <TableCell>
                     <StatusBadge 
                       status={
                         item.stockStatus === 'ok' ? 'success' : 
                         item.stockStatus === 'low' ? 'warning' : 
                         'danger'
                       } 
                       label={
                         item.stockStatus === 'ok' ? 'OK' : 
                         item.stockStatus === 'low' ? 'Faible' : 
                         'Critique'
                       } 
                     />
                   </TableCell>
                   <TableCell>
                     <div className="flex justify-end gap-1">
                       <Button 
                         variant="ghost" 
                         size="icon" 
                         className="h-8 w-8"
                         onClick={() => handleViewHistory(item)}
                         title="Historique"
                       >
                         <History className="h-4 w-4 text-muted-foreground" />
                       </Button>
                       <Button 
                         variant="ghost" 
                         size="icon" 
                         className="h-8 w-8"
                         onClick={() => handleEditPart(item)}
                         title="Modifier"
                       >
                         <Edit className="h-4 w-4 text-muted-foreground" />
                       </Button>
                       <Button variant="ghost" size="icon" className="h-8 w-8" title="Commander">
                         <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                       </Button>
                     </div>
                   </TableCell>
                 </TableRow>
               ))}
               {filteredItems.length === 0 && (
                 <TableRow>
                   <TableCell colSpan={9} className="text-center py-8">
                     <Package className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                     <p className="text-muted-foreground">Aucune pièce trouvée</p>
                   </TableCell>
                 </TableRow>
               )}
             </TableBody>
           </Table>
         </div>
       </div>
       
       <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
         <div className="rounded-xl border bg-card p-6">
           <h3 className="text-lg font-medium text-foreground mb-4">Scanner une pièce</h3>
           <div className="bg-muted/30 border border-dashed rounded-lg p-6 text-center">
             <Search className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
             <p className="text-muted-foreground mb-3">Scannez un code barre pour gérer le stock d'une pièce</p>
             <Button className="btn-primary">
               Scanner un code barre
             </Button>
           </div>
         </div>
         
         <div className="rounded-xl border border-warning/20 bg-warning/5 p-6">
           <div className="flex items-start">
             <AlertTriangle className="h-6 w-6 text-warning mr-3 mt-1" />
             <div>
               <h4 className="text-md font-medium">Articles à réapprovisionner</h4>
               <p className="text-sm text-muted-foreground mt-2 mb-4">Les articles suivants ont atteint leur seuil minimal :</p>
               <ul className="space-y-2">
                 {items.filter(i => i.quantity <= i.minQuantity).slice(0, 3).map(item => (
                   <li key={item.id} className="flex justify-between">
                     <span className="text-sm">{item.name}</span>
                     <StatusBadge 
                       status={item.quantity < item.minQuantity ? 'danger' : 'warning'} 
                       label={`${item.quantity} / ${item.minQuantity}`} 
                     />
                   </li>
                 ))}
               </ul>
               <div className="mt-4">
                 <Button variant="outline" className="bg-background">
                   <ShoppingCart className="h-4 w-4 mr-2" />
                   Créer une demande d'achat
                 </Button>
               </div>
             </div>
           </div>
         </div>
       </div>
 
       {/* Modals */}
       <CreateEditPartModal
         open={createEditModalOpen}
         onOpenChange={setCreateEditModalOpen}
         part={editingPart}
         onSave={handleSavePart}
       />
 
       <GoodsReceiptModal
         open={goodsReceiptModalOpen}
         onOpenChange={setGoodsReceiptModalOpen}
         onConfirm={handleGoodsReceipt}
         availableParts={items.map(i => ({ id: i.id!, name: i.name, location: `${i.warehouse} - ${i.location}` }))}
       />
 
       <InventoryCountModal
         open={inventoryModalOpen}
         onOpenChange={setInventoryModalOpen}
         onConfirm={handleInventoryCount}
         parts={items.map(i => ({
           id: i.id!,
           name: i.name,
           location: i.location,
           quantity: i.quantity,
           warehouse: i.warehouse,
         }))}
       />
 
       {/* History Sheet */}
       <Sheet open={historySheetOpen} onOpenChange={setHistorySheetOpen}>
         <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
           <SheetHeader className="mb-6">
             <SheetTitle>Historique des mouvements</SheetTitle>
           </SheetHeader>
           {selectedPartForHistory && (
             <ConsumptionHistoryPanel
               partId={selectedPartForHistory.id!}
               partName={selectedPartForHistory.name}
               records={demoConsumptionHistory}
             />
           )}
         </SheetContent>
       </Sheet>
     </div>
   );
 };
 
 export default Inventory;