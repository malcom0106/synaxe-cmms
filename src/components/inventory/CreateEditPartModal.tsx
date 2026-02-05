 import React, { useState, useEffect } from 'react';
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
 import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
 } from '@/components/ui/select';
 import { useToast } from '@/hooks/use-toast';
 import { Package, Save } from 'lucide-react';
 
 export interface PartData {
   id?: string;
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
   stockStatus: 'ok' | 'low' | 'critical' | 'expired';
   expirationDate?: string;
 }
 
 interface CreateEditPartModalProps {
   open: boolean;
   onOpenChange: (open: boolean) => void;
   part?: PartData | null;
   onSave: (part: PartData) => void;
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
 
 export const CreateEditPartModal: React.FC<CreateEditPartModalProps> = ({
   open,
   onOpenChange,
   part,
   onSave,
 }) => {
   const { toast } = useToast();
   const isEdit = !!part?.id;
   
   const [formData, setFormData] = useState<PartData>({
     internalRef: '',
     externalRef: '',
     name: '',
     family: '',
     subFamily: '',
     quantity: 0,
     reservedQuantity: 0,
     minQuantity: 0,
     maxQuantity: 100,
     warehouse: '',
     location: '',
     price: 0,
     stockStatus: 'ok',
     expirationDate: '',
   });
 
   useEffect(() => {
     if (part) {
       setFormData(part);
     } else {
       setFormData({
         internalRef: '',
         externalRef: '',
         name: '',
         family: '',
         subFamily: '',
         quantity: 0,
         reservedQuantity: 0,
         minQuantity: 0,
         maxQuantity: 100,
         warehouse: '',
         location: '',
         price: 0,
         stockStatus: 'ok',
         expirationDate: '',
       });
     }
   }, [part, open]);
 
   const handleSubmit = (e: React.FormEvent) => {
     e.preventDefault();
     
     if (!formData.internalRef || !formData.name || !formData.family) {
       toast({
         title: "Champs requis",
         description: "Veuillez remplir tous les champs obligatoires.",
         variant: "destructive",
       });
       return;
     }
 
     onSave({
       ...formData,
       id: part?.id || `PDR${Date.now()}`,
     });
     
     toast({
       title: isEdit ? "Pièce modifiée" : "Pièce créée",
       description: `La pièce ${formData.name} a été ${isEdit ? 'modifiée' : 'créée'} avec succès.`,
     });
     
     onOpenChange(false);
   };
 
   const availableSubFamilies = formData.family ? subFamilies[formData.family] || [] : [];
 
   return (
     <Dialog open={open} onOpenChange={onOpenChange}>
       <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
         <DialogHeader>
           <DialogTitle className="flex items-center gap-2">
             <Package className="h-5 w-5" />
             {isEdit ? 'Modifier la pièce' : 'Nouvelle pièce'}
           </DialogTitle>
         </DialogHeader>
         
         <form onSubmit={handleSubmit} className="space-y-6">
           {/* Références */}
           <div className="space-y-4">
             <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Identification</h3>
             <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                 <Label htmlFor="internalRef">Référence interne *</Label>
                 <Input
                   id="internalRef"
                   value={formData.internalRef}
                   onChange={(e) => setFormData({ ...formData, internalRef: e.target.value })}
                   placeholder="PDR001"
                 />
               </div>
               <div className="space-y-2">
                 <Label htmlFor="externalRef">Référence externe</Label>
                 <Input
                   id="externalRef"
                   value={formData.externalRef}
                   onChange={(e) => setFormData({ ...formData, externalRef: e.target.value })}
                   placeholder="REF-FOURNISSEUR"
                 />
               </div>
             </div>
             <div className="space-y-2">
               <Label htmlFor="name">Libellé *</Label>
               <Input
                 id="name"
                 value={formData.name}
                 onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                 placeholder="Nom de la pièce"
               />
             </div>
           </div>
 
           {/* Classification */}
           <div className="space-y-4">
             <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Classification</h3>
             <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                 <Label>Famille *</Label>
                 <Select
                   value={formData.family}
                   onValueChange={(value) => setFormData({ ...formData, family: value, subFamily: '' })}
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
                   onValueChange={(value) => setFormData({ ...formData, subFamily: value })}
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
             </div>
           </div>
 
           {/* Emplacement */}
           <div className="space-y-4">
             <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Emplacement</h3>
             <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                 <Label>Magasin</Label>
                 <Select
                   value={formData.warehouse}
                   onValueChange={(value) => setFormData({ ...formData, warehouse: value })}
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
                   onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                   placeholder="Étagère A3"
                 />
               </div>
             </div>
           </div>
 
           {/* Quantités */}
           <div className="space-y-4">
             <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Quantités</h3>
             <div className="grid grid-cols-4 gap-4">
               <div className="space-y-2">
                 <Label htmlFor="quantity">En stock</Label>
                 <Input
                   id="quantity"
                   type="number"
                   min="0"
                   value={formData.quantity}
                   onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                 />
               </div>
               <div className="space-y-2">
                 <Label htmlFor="reservedQuantity">Réservée</Label>
                 <Input
                   id="reservedQuantity"
                   type="number"
                   min="0"
                   value={formData.reservedQuantity}
                   onChange={(e) => setFormData({ ...formData, reservedQuantity: parseInt(e.target.value) || 0 })}
                 />
               </div>
               <div className="space-y-2">
                 <Label htmlFor="minQuantity">Seuil alerte</Label>
                 <Input
                   id="minQuantity"
                   type="number"
                   min="0"
                   value={formData.minQuantity}
                   onChange={(e) => setFormData({ ...formData, minQuantity: parseInt(e.target.value) || 0 })}
                 />
               </div>
               <div className="space-y-2">
                 <Label htmlFor="maxQuantity">Quantité max</Label>
                 <Input
                   id="maxQuantity"
                   type="number"
                   min="0"
                   value={formData.maxQuantity}
                   onChange={(e) => setFormData({ ...formData, maxQuantity: parseInt(e.target.value) || 0 })}
                 />
               </div>
             </div>
           </div>
 
           {/* Prix et DLC */}
           <div className="space-y-4">
             <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Informations complémentaires</h3>
             <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                 <Label htmlFor="price">Prix unitaire (€)</Label>
                 <Input
                   id="price"
                   type="number"
                   min="0"
                   step="0.01"
                   value={formData.price}
                   onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                 />
               </div>
               <div className="space-y-2">
                 <Label htmlFor="expirationDate">Date limite consommation (DLC)</Label>
                 <Input
                   id="expirationDate"
                   type="date"
                   value={formData.expirationDate}
                   onChange={(e) => setFormData({ ...formData, expirationDate: e.target.value })}
                 />
               </div>
             </div>
           </div>
 
           <DialogFooter>
             <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
               Annuler
             </Button>
             <Button type="submit">
               <Save className="h-4 w-4 mr-2" />
               {isEdit ? 'Enregistrer' : 'Créer'}
             </Button>
           </DialogFooter>
         </form>
       </DialogContent>
     </Dialog>
   );
 };