import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageTitle } from '@/components/ui/PageTitle';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  Search,
  TruckIcon
} from 'lucide-react';
import { CreateEditPartModal, PartData } from '@/components/inventory/CreateEditPartModal';
import { GoodsReceiptModal } from '@/components/inventory/GoodsReceiptModal';
import { useToast } from '@/hooks/use-toast';

const initialInventoryItems: PartData[] = [
  { 
    id: 'PDR001', internalRef: 'PDR001', externalRef: 'SKF-FH2500', name: 'Filtre à huile', 
    family: 'Filtres', subFamily: 'Huile', quantity: 5, reservedQuantity: 2, minQuantity: 10, maxQuantity: 50,
    price: 75.50, warehouse: 'Magasin Principal', location: 'Étagère A3', stockStatus: 'low', expirationDate: '2026-06-15',
  },
  { 
    id: 'PDR002', internalRef: 'PDR002', externalRef: 'JT-50-VITON', name: 'Joint torique 50mm', 
    family: 'Joints', subFamily: 'Toriques', quantity: 25, reservedQuantity: 0, minQuantity: 15, maxQuantity: 100,
    price: 12.20, warehouse: 'Magasin Principal', location: 'Tiroir B2', stockStatus: 'ok',
  },
  { 
    id: 'PDR003', internalRef: 'PDR003', externalRef: 'PARKER-HYD-1M', name: 'Tuyau hydraulique 1m', 
    family: 'Hydraulique', subFamily: 'Tuyaux', quantity: 3, reservedQuantity: 1, minQuantity: 5, maxQuantity: 20,
    price: 95.30, warehouse: 'Magasin Principal', location: 'Étagère C1', stockStatus: 'low',
  },
  { 
    id: 'PDR004', internalRef: 'PDR004', externalRef: 'MANN-AF-500', name: 'Filtre à air', 
    family: 'Filtres', subFamily: 'Air', quantity: 12, reservedQuantity: 3, minQuantity: 8, maxQuantity: 40,
    price: 45.75, warehouse: 'Magasin Principal', location: 'Étagère A2', stockStatus: 'ok',
  },
  { 
    id: 'PDR005', internalRef: 'PDR005', externalRef: 'KIT-PUMP-R500', name: 'Kit de réparation pompe', 
    family: 'Pompes', subFamily: 'Kits réparation', quantity: 2, reservedQuantity: 0, minQuantity: 2, maxQuantity: 10,
    price: 185.00, warehouse: 'Magasin Secondaire', location: 'Tiroir D4', stockStatus: 'critical', expirationDate: '2025-12-01',
  },
];

const InventoryParts: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [items, setItems] = useState<PartData[]>(initialInventoryItems);
  const [searchQuery, setSearchQuery] = useState('');
  const [createEditModalOpen, setCreateEditModalOpen] = useState(false);
  const [goodsReceiptModalOpen, setGoodsReceiptModalOpen] = useState(false);
  const [editingPart, setEditingPart] = useState<PartData | null>(null);
  const [selectedPartForReceipt, setSelectedPartForReceipt] = useState<PartData | null>(null);

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

  const handleViewPart = (part: PartData) => {
    navigate(`/inventory/parts/${part.id}`);
  };

  const handleQuickReceipt = (part: PartData) => {
    setSelectedPartForReceipt(part);
    setGoodsReceiptModalOpen(true);
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


  return (
    <div className="p-6 max-w-7xl mx-auto animate-fade-in">
      <PageTitle 
        title="Pièces" 
        subtitle="Gestion des pièces de rechange"
        action={
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => setGoodsReceiptModalOpen(true)}>
              <TruckIcon className="h-4 w-4 mr-2" />
              Entrée marchandise
            </Button>
            <Button className="btn-primary" onClick={() => { setEditingPart(null); setCreateEditModalOpen(true); }}>
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle pièce
            </Button>
          </div>
        }
      />

      {/* Search and filters */}
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
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Filtrer
        </Button>
      </div>


      {/* Table */}
      <div className="rounded-xl border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Libellé</TableHead>
                <TableHead className="w-24 text-center">En stock</TableHead>
                <TableHead className="w-24 text-center">Réservée</TableHead>
                <TableHead className="w-24 text-center">Seuil</TableHead>
                <TableHead className="w-24">État</TableHead>
                <TableHead className="w-32">Famille</TableHead>
                <TableHead className="w-40">Emplacement</TableHead>
                <TableHead className="w-20 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item) => (
                <TableRow key={item.id} className="hover:bg-muted/30 cursor-pointer" onClick={() => handleViewPart(item)}>
                  <TableCell>
                    <div className="font-medium text-foreground">{item.name}</div>
                    <div className="text-xs text-muted-foreground">{item.internalRef}</div>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className={item.quantity < item.minQuantity ? 'font-bold text-destructive' : item.quantity === item.minQuantity ? 'font-bold text-warning' : 'font-medium text-foreground'}>
                      {item.quantity}
                    </span>
                  </TableCell>
                  <TableCell className="text-center text-sm text-muted-foreground">
                    {item.reservedQuantity > 0 ? item.reservedQuantity : '-'}
                  </TableCell>
                  <TableCell className="text-center text-sm text-muted-foreground">
                    {item.minQuantity}
                  </TableCell>
                  <TableCell>
                    <StatusBadge 
                      status={item.stockStatus === 'ok' ? 'success' : item.stockStatus === 'low' ? 'warning' : 'danger'} 
                      label={item.stockStatus === 'ok' ? 'OK' : item.stockStatus === 'low' ? 'Faible' : 'Critique'} 
                    />
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{item.family}</div>
                    {item.subFamily && <div className="text-xs text-muted-foreground">{item.subFamily}</div>}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{item.warehouse}</div>
                    <div className="text-xs text-muted-foreground">{item.location}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleQuickReceipt(item)} title="Entrée marchandise">
                        <TruckIcon className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredItems.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <Package className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">Aucune pièce trouvée</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>


      {/* Modals */}
      <CreateEditPartModal open={createEditModalOpen} onOpenChange={setCreateEditModalOpen} part={editingPart} onSave={handleSavePart} />
      <GoodsReceiptModal open={goodsReceiptModalOpen} onOpenChange={setGoodsReceiptModalOpen} onConfirm={handleGoodsReceipt} availableParts={items.map(i => ({ id: i.id!, name: i.name, location: `${i.warehouse} - ${i.location}` }))} />
    </div>
  );
};

export default InventoryParts;
