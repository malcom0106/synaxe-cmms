 import React, { useState } from 'react';
 import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogFooter,
 } from '@/components/ui/dialog';
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
 import { useToast } from '@/hooks/use-toast';
 import { 
   ClipboardCheck, 
   AlertTriangle, 
   Check, 
   ArrowRight,
   Minus,
   Plus
 } from 'lucide-react';
 import { Badge } from '@/components/ui/badge';
 import { Card } from '@/components/ui/card';
 import { cn } from '@/lib/utils';
 
 interface InventoryLine {
   partId: string;
   partName: string;
   location: string;
   theoreticalQty: number;
   actualQty: number | null;
   justification?: string;
 }
 
 interface InventoryCountModalProps {
   open: boolean;
   onOpenChange: (open: boolean) => void;
   onConfirm: (data: {
     warehouse: string;
     date: string;
     lines: InventoryLine[];
     notes: string;
   }) => void;
   parts: Array<{ 
     id: string; 
     name: string; 
     location: string;
     quantity: number;
     warehouse: string;
   }>;
 }
 
 const ECART_THRESHOLD = 10; // %
 
 export const InventoryCountModal: React.FC<InventoryCountModalProps> = ({
   open,
   onOpenChange,
   onConfirm,
   parts,
 }) => {
   const { toast } = useToast();
   const [warehouse, setWarehouse] = useState('');
   const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
   const [notes, setNotes] = useState('');
   const [lines, setLines] = useState<InventoryLine[]>([]);
   const [justifyingIndex, setJustifyingIndex] = useState<number | null>(null);
   const [tempJustification, setTempJustification] = useState('');
 
   const warehouses = [...new Set(parts.map(p => p.warehouse).filter(Boolean))];
 
   const handleWarehouseChange = (value: string) => {
     setWarehouse(value);
     const filtered = parts.filter(p => p.warehouse === value);
     setLines(filtered.map(p => ({
       partId: p.id,
       partName: p.name,
       location: p.location,
       theoreticalQty: p.quantity,
       actualQty: null,
     })));
   };
 
   const handleQtyChange = (index: number, qty: number | null) => {
     const updated = [...lines];
     updated[index] = { ...updated[index], actualQty: qty };
     setLines(updated);
   };
 
   const calculateEcart = (theoretical: number, actual: number | null) => {
     if (actual === null) return null;
     return actual - theoretical;
   };
 
   const calculateEcartPercent = (theoretical: number, actual: number | null) => {
     if (actual === null || theoretical === 0) return null;
     return Math.abs((actual - theoretical) / theoretical * 100);
   };
 
   const needsJustification = (line: InventoryLine) => {
     const ecartPercent = calculateEcartPercent(line.theoreticalQty, line.actualQty);
     return ecartPercent !== null && ecartPercent > ECART_THRESHOLD && !line.justification;
   };
 
   const handleSaveJustification = (index: number) => {
     const updated = [...lines];
     updated[index] = { ...updated[index], justification: tempJustification };
     setLines(updated);
     setJustifyingIndex(null);
     setTempJustification('');
   };
 
   const handleSubmit = () => {
     const incomplete = lines.filter(l => l.actualQty === null);
     if (incomplete.length > 0) {
       toast({
         title: "Inventaire incomplet",
         description: `${incomplete.length} article(s) n'ont pas été comptés.`,
         variant: "destructive",
       });
       return;
     }
 
     const needsJustif = lines.filter(needsJustification);
     if (needsJustif.length > 0) {
       toast({
         title: "Justification requise",
         description: `${needsJustif.length} article(s) présentent un écart important non justifié.`,
         variant: "destructive",
       });
       return;
     }
 
     onConfirm({ warehouse, date, lines, notes });
     
     const ecarts = lines.filter(l => l.actualQty !== l.theoreticalQty);
     toast({
       title: "Inventaire validé",
       description: `${lines.length} article(s) comptés. ${ecarts.length} écart(s) corrigé(s).`,
     });
 
     setWarehouse('');
     setLines([]);
     setNotes('');
     onOpenChange(false);
   };
 
   const countedLines = lines.filter(l => l.actualQty !== null).length;
   const ecartsCount = lines.filter(l => {
     const ecart = calculateEcart(l.theoreticalQty, l.actualQty);
     return ecart !== null && ecart !== 0;
   }).length;
 
   return (
     <Dialog open={open} onOpenChange={onOpenChange}>
       <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
         <DialogHeader>
           <DialogTitle className="flex items-center gap-2">
             <ClipboardCheck className="h-5 w-5" />
             Inventaire physique
           </DialogTitle>
         </DialogHeader>
 
         <div className="space-y-6">
           {/* En-tête */}
           <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
               <Label>Magasin *</Label>
               <Select value={warehouse} onValueChange={handleWarehouseChange}>
                 <SelectTrigger>
                   <SelectValue placeholder="Sélectionner un magasin..." />
                 </SelectTrigger>
                 <SelectContent>
                   {warehouses.map(w => (
                     <SelectItem key={w} value={w}>{w}</SelectItem>
                   ))}
                 </SelectContent>
               </Select>
             </div>
             <div className="space-y-2">
               <Label htmlFor="date">Date d'inventaire</Label>
               <Input
                 id="date"
                 type="date"
                 value={date}
                 onChange={(e) => setDate(e.target.value)}
               />
             </div>
           </div>
 
           {/* Stats */}
           {lines.length > 0 && (
             <div className="grid grid-cols-3 gap-3">
               <Card className="p-3 text-center">
                 <div className="text-xl font-bold">{lines.length}</div>
                 <div className="text-xs text-muted-foreground">Articles</div>
               </Card>
               <Card className="p-3 text-center bg-blue-50 border-blue-200">
                 <div className="text-xl font-bold text-blue-700">{countedLines}</div>
                 <div className="text-xs text-blue-600">Comptés</div>
               </Card>
               <Card className="p-3 text-center bg-orange-50 border-orange-200">
                 <div className="text-xl font-bold text-orange-700">{ecartsCount}</div>
                 <div className="text-xs text-orange-600">Écarts</div>
               </Card>
             </div>
           )}
 
           {/* Liste articles */}
           {lines.length > 0 && (
             <div className="space-y-2 max-h-[400px] overflow-y-auto">
               {lines.map((line, index) => {
                 const ecart = calculateEcart(line.theoreticalQty, line.actualQty);
                 const hasLargeEcart = needsJustification(line);
                 
                 return (
                   <Card 
                     key={line.partId} 
                     className={cn(
                       "p-3 transition-all",
                       hasLargeEcart && "border-orange-300 bg-orange-50/50",
                       line.actualQty !== null && !hasLargeEcart && ecart === 0 && "border-green-300 bg-green-50/30"
                     )}
                   >
                     <div className="flex items-center gap-3">
                       <div className="flex-1 min-w-0">
                         <div className="flex items-center gap-2 mb-1">
                           <Badge variant="outline" className="text-xs font-mono">{line.partId}</Badge>
                           {line.justification && (
                             <Badge className="text-xs bg-blue-100 text-blue-700">Justifié</Badge>
                           )}
                         </div>
                         <p className="font-medium text-sm truncate">{line.partName}</p>
                         <p className="text-xs text-muted-foreground">{line.location}</p>
                       </div>
                       
                       <div className="flex items-center gap-4">
                         {/* Théorique */}
                         <div className="text-center w-16">
                           <Label className="text-xs text-muted-foreground">Théo.</Label>
                           <div className="text-lg font-bold">{line.theoreticalQty}</div>
                         </div>
                         
                         <ArrowRight className="h-4 w-4 text-muted-foreground" />
                         
                         {/* Comptage */}
                         <div className="flex items-center gap-1">
                           <Button
                             variant="outline"
                             size="icon"
                             className="h-8 w-8"
                             onClick={() => handleQtyChange(index, Math.max(0, (line.actualQty ?? line.theoreticalQty) - 1))}
                           >
                             <Minus className="h-3 w-3" />
                           </Button>
                           <Input
                             type="number"
                             value={line.actualQty ?? ''}
                             onChange={(e) => handleQtyChange(index, e.target.value ? parseInt(e.target.value) : null)}
                             className="w-16 h-8 text-center font-bold"
                             placeholder="?"
                           />
                           <Button
                             variant="outline"
                             size="icon"
                             className="h-8 w-8"
                             onClick={() => handleQtyChange(index, (line.actualQty ?? line.theoreticalQty) + 1)}
                           >
                             <Plus className="h-3 w-3" />
                           </Button>
                         </div>
 
                         {/* Écart */}
                         <div className="text-center w-16">
                           <Label className="text-xs text-muted-foreground">Écart</Label>
                           {ecart !== null ? (
                             <div className={cn(
                               "text-lg font-bold",
                               ecart === 0 && "text-green-600",
                               ecart > 0 && "text-blue-600",
                               ecart < 0 && "text-red-600"
                             )}>
                               {ecart > 0 ? '+' : ''}{ecart}
                             </div>
                           ) : (
                             <div className="text-lg text-muted-foreground">-</div>
                           )}
                         </div>
 
                         {/* Action justification */}
                         {hasLargeEcart && (
                           <Button
                             variant="outline"
                             size="sm"
                             className="text-orange-600 border-orange-300"
                             onClick={() => {
                               setJustifyingIndex(index);
                               setTempJustification('');
                             }}
                           >
                             <AlertTriangle className="h-4 w-4 mr-1" />
                             Justifier
                           </Button>
                         )}
                       </div>
                     </div>
 
                     {/* Zone justification */}
                     {justifyingIndex === index && (
                       <div className="mt-3 pt-3 border-t space-y-2">
                         <Label className="text-sm">Justification de l'écart</Label>
                         <Textarea
                           value={tempJustification}
                           onChange={(e) => setTempJustification(e.target.value)}
                           placeholder="Expliquez la raison de cet écart..."
                           className="min-h-[60px]"
                         />
                         <div className="flex gap-2 justify-end">
                           <Button
                             variant="outline"
                             size="sm"
                             onClick={() => setJustifyingIndex(null)}
                           >
                             Annuler
                           </Button>
                           <Button
                             size="sm"
                             onClick={() => handleSaveJustification(index)}
                             disabled={!tempJustification.trim()}
                           >
                             <Check className="h-4 w-4 mr-1" />
                             Valider
                           </Button>
                         </div>
                       </div>
                     )}
                   </Card>
                 );
               })}
             </div>
           )}
 
           {!warehouse && (
             <Card className="p-8 text-center border-dashed">
               <ClipboardCheck className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
               <p className="text-muted-foreground">Sélectionnez un magasin pour démarrer l'inventaire</p>
             </Card>
           )}
 
           {/* Notes */}
           {lines.length > 0 && (
             <div className="space-y-2">
               <Label htmlFor="notes">Remarques générales</Label>
               <Textarea
                 id="notes"
                 value={notes}
                 onChange={(e) => setNotes(e.target.value)}
                 placeholder="Notes sur l'inventaire..."
                 className="min-h-[60px]"
               />
             </div>
           )}
         </div>
 
         <DialogFooter>
           <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
             Annuler
           </Button>
           <Button onClick={handleSubmit} disabled={lines.length === 0 || countedLines < lines.length}>
             <Check className="h-4 w-4 mr-2" />
             Valider l'inventaire
           </Button>
         </DialogFooter>
       </DialogContent>
     </Dialog>
   );
 };