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
 import { Package, Plus, Trash2, TruckIcon, Check } from 'lucide-react';
 import { Badge } from '@/components/ui/badge';
 import { Card } from '@/components/ui/card';
 
 interface ReceiptLine {
   partId: string;
   partName: string;
   expectedQty: number;
   receivedQty: number;
   location: string;
 }
 
 interface GoodsReceiptModalProps {
   open: boolean;
   onOpenChange: (open: boolean) => void;
   onConfirm: (data: {
     supplier: string;
     deliveryNote: string;
     date: string;
     lines: ReceiptLine[];
     notes: string;
   }) => void;
   availableParts: Array<{ id: string; name: string; location: string }>;
 }
 
 export const GoodsReceiptModal: React.FC<GoodsReceiptModalProps> = ({
   open,
   onOpenChange,
   onConfirm,
   availableParts,
 }) => {
   const { toast } = useToast();
   const [supplier, setSupplier] = useState('');
   const [deliveryNote, setDeliveryNote] = useState('');
   const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
   const [notes, setNotes] = useState('');
   const [lines, setLines] = useState<ReceiptLine[]>([]);
   const [selectedPartId, setSelectedPartId] = useState('');
 
   const handleAddLine = () => {
     if (!selectedPartId) return;
     
     const part = availableParts.find(p => p.id === selectedPartId);
     if (!part) return;
     
     if (lines.some(l => l.partId === selectedPartId)) {
       toast({
         title: "Pièce déjà ajoutée",
         description: "Cette pièce est déjà dans la liste de réception.",
         variant: "destructive",
       });
       return;
     }
 
     setLines([
       ...lines,
       {
         partId: part.id,
         partName: part.name,
         expectedQty: 0,
         receivedQty: 0,
         location: part.location,
       },
     ]);
     setSelectedPartId('');
   };
 
   const handleUpdateLine = (index: number, field: keyof ReceiptLine, value: string | number) => {
     const updated = [...lines];
     updated[index] = { ...updated[index], [field]: value };
     setLines(updated);
   };
 
   const handleRemoveLine = (index: number) => {
     setLines(lines.filter((_, i) => i !== index));
   };
 
   const handleSubmit = () => {
     if (!supplier || lines.length === 0) {
       toast({
         title: "Données incomplètes",
         description: "Veuillez renseigner le fournisseur et au moins une ligne de réception.",
         variant: "destructive",
       });
       return;
     }
 
     onConfirm({ supplier, deliveryNote, date, lines, notes });
     
     toast({
       title: "Entrée enregistrée",
       description: `${lines.length} article(s) réceptionné(s) avec succès.`,
     });
 
     // Reset form
     setSupplier('');
     setDeliveryNote('');
     setDate(new Date().toISOString().split('T')[0]);
     setNotes('');
     setLines([]);
     onOpenChange(false);
   };
 
   const totalReceived = lines.reduce((sum, l) => sum + l.receivedQty, 0);
 
   return (
     <Dialog open={open} onOpenChange={onOpenChange}>
       <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
         <DialogHeader>
           <DialogTitle className="flex items-center gap-2">
             <TruckIcon className="h-5 w-5" />
             Entrée de marchandise
           </DialogTitle>
         </DialogHeader>
 
         <div className="space-y-6">
           {/* Informations livraison */}
           <div className="space-y-4">
             <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Informations livraison</h3>
             <div className="grid grid-cols-3 gap-4">
               <div className="space-y-2">
                 <Label htmlFor="supplier">Fournisseur *</Label>
                 <Input
                   id="supplier"
                   value={supplier}
                   onChange={(e) => setSupplier(e.target.value)}
                   placeholder="Nom du fournisseur"
                 />
               </div>
               <div className="space-y-2">
                 <Label htmlFor="deliveryNote">N° bon de livraison</Label>
                 <Input
                   id="deliveryNote"
                   value={deliveryNote}
                   onChange={(e) => setDeliveryNote(e.target.value)}
                   placeholder="BL-2025-001"
                 />
               </div>
               <div className="space-y-2">
                 <Label htmlFor="date">Date de réception</Label>
                 <Input
                   id="date"
                   type="date"
                   value={date}
                   onChange={(e) => setDate(e.target.value)}
                 />
               </div>
             </div>
           </div>
 
           {/* Ajout article */}
           <div className="space-y-4">
             <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Articles à réceptionner</h3>
             <div className="flex gap-2">
               <Select value={selectedPartId} onValueChange={setSelectedPartId}>
                 <SelectTrigger className="flex-1">
                   <SelectValue placeholder="Sélectionner une pièce..." />
                 </SelectTrigger>
                 <SelectContent>
                   {availableParts.map(p => (
                     <SelectItem key={p.id} value={p.id}>
                       {p.id} - {p.name}
                     </SelectItem>
                   ))}
                 </SelectContent>
               </Select>
               <Button type="button" onClick={handleAddLine} disabled={!selectedPartId}>
                 <Plus className="h-4 w-4" />
               </Button>
             </div>
           </div>
 
           {/* Liste articles */}
           {lines.length > 0 && (
             <div className="space-y-3">
               {lines.map((line, index) => (
                 <Card key={line.partId} className="p-3">
                   <div className="flex items-center gap-3">
                     <div className="flex-1 min-w-0">
                       <div className="flex items-center gap-2 mb-1">
                         <Badge variant="outline" className="text-xs font-mono">{line.partId}</Badge>
                       </div>
                       <p className="font-medium text-sm truncate">{line.partName}</p>
                       <p className="text-xs text-muted-foreground">{line.location}</p>
                     </div>
                     <div className="flex items-center gap-2">
                       <div className="text-center">
                         <Label className="text-xs text-muted-foreground">Attendu</Label>
                         <Input
                           type="number"
                           min="0"
                           className="w-20 h-8 text-center"
                           value={line.expectedQty}
                           onChange={(e) => handleUpdateLine(index, 'expectedQty', parseInt(e.target.value) || 0)}
                         />
                       </div>
                       <div className="text-center">
                         <Label className="text-xs text-muted-foreground">Reçu</Label>
                         <Input
                           type="number"
                           min="0"
                           className="w-20 h-8 text-center"
                           value={line.receivedQty}
                           onChange={(e) => handleUpdateLine(index, 'receivedQty', parseInt(e.target.value) || 0)}
                         />
                       </div>
                       <Button
                         variant="ghost"
                         size="icon"
                         className="h-8 w-8 text-destructive"
                         onClick={() => handleRemoveLine(index)}
                       >
                         <Trash2 className="h-4 w-4" />
                       </Button>
                     </div>
                   </div>
                 </Card>
               ))}
               
               <div className="flex justify-end">
                 <Badge className="bg-primary/10 text-primary">
                   Total: {totalReceived} pièce(s)
                 </Badge>
               </div>
             </div>
           )}
 
           {lines.length === 0 && (
             <Card className="p-6 text-center border-dashed">
               <Package className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
               <p className="text-sm text-muted-foreground">Aucun article ajouté</p>
             </Card>
           )}
 
           {/* Notes */}
           <div className="space-y-2">
             <Label htmlFor="notes">Remarques</Label>
             <Textarea
               id="notes"
               value={notes}
               onChange={(e) => setNotes(e.target.value)}
               placeholder="Notes sur la réception..."
               className="min-h-[80px]"
             />
           </div>
         </div>
 
         <DialogFooter>
           <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
             Annuler
           </Button>
           <Button onClick={handleSubmit} disabled={lines.length === 0}>
             <Check className="h-4 w-4 mr-2" />
             Valider la réception
           </Button>
         </DialogFooter>
       </DialogContent>
     </Dialog>
   );
 };